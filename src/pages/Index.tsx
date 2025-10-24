import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import MapView from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Camera, MapPin, Search, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState<any[]>([]);
  const [trendingIssues, setTrendingIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchReports();
    fetchTrendingIssues();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedReports = data?.map((report) => ({
        id: report.id,
        type: report.type,
        status: report.status,
        location: [report.latitude, report.longitude] as [number, number],
        description: report.description,
      })) || [];

      setReports(formattedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingIssues = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('type')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Count occurrences of each type
      const typeCounts: { [key: string]: number } = {};
      data?.forEach((report) => {
        typeCounts[report.type] = (typeCounts[report.type] || 0) + 1;
      });

      // Convert to array and sort
      const trending = Object.entries(typeCounts)
        .map(([type, count]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          count,
          icon: getIssueIcon(type),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setTrendingIssues(trending);
    } catch (error) {
      console.error('Error fetching trending issues:', error);
    }
  };

  const getIssueIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      pothole: '🕳️',
      trash: '🗑️',
      streetlight: '💡',
      water: '💧',
      road: '🚧',
      others: '📋',
    };
    return icons[type] || '📋';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={!!user} />
      
      <main className="container py-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="glass-effect">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">City Assist</h2>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="w-full btn-primary shadow-glow" size="lg" asChild>
                  <Link to={user ? "/report" : "/auth"}>
                    <Camera className="mr-2 w-5 h-5" />
                    Report an Issue
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recent Reports</h3>
                <div className="space-y-3">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  ) : reports.slice(0, 3).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{report.type}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Map */}
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <div className="h-[500px] relative">
                  {loading ? (
                    <div className="h-full flex items-center justify-center bg-secondary/20">
                      <p className="text-muted-foreground">Loading map...</p>
                    </div>
                  ) : (
                    <MapView
                      reports={reports}
                      center={[20.5937, 78.9629]}
                      zoom={5}
                    />
                  )}
                  <div className="absolute top-4 right-4 z-[1000]">
                    <Badge className="status-resolved shadow-lg">
                      Live Updates
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Issues */}
            {trendingIssues.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Trending Issues</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {trendingIssues.map((issue, index) => (
                      <Card key={index} className="hover-lift">
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl mb-2">{issue.icon}</div>
                          <h3 className="font-semibold text-lg mb-1">{issue.type}</h3>
                          <p className="text-3xl font-bold text-primary">{issue.count}</p>
                          <p className="text-xs text-muted-foreground mt-1">reports</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-gradient-primary text-white border-0 hover-lift cursor-pointer group">
                <CardContent className="p-6">
                  <Camera className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2">Report an Issue</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Snap a photo and help improve your community
                  </p>
                  <Button variant="secondary" size="sm" asChild>
                    <Link to={user ? "/report" : "/auth"}>Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-gradient-hero text-white border-0 hover-lift cursor-pointer group">
                <CardContent className="p-6">
                  <MapPin className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2">Track Your Reports</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Stay updated on the status of your submissions
                  </p>
                  <Button variant="secondary" size="sm" asChild>
                    <Link to={user ? "/my-reports" : "/auth"}>View Reports</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
