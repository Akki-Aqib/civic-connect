import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import MapView from '@/components/MapView';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    resolved: 0,
  });
  const [reports, setReports] = useState<any[]>([]);
  const [topIssueTypes, setTopIssueTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) throw reportsError;

      // Calculate stats
      const total = reportsData?.length || 0;
      const pending = reportsData?.filter((r) => r.status === 'pending').length || 0;
      const progress = reportsData?.filter((r) => r.status === 'progress').length || 0;
      const resolved = reportsData?.filter((r) => r.status === 'resolved').length || 0;

      setStats({ total, pending, progress, resolved });

      // Format reports for map
      const formattedReports = reportsData?.slice(0, 20).map((report) => ({
        id: report.id,
        type: report.type,
        status: report.status,
        location: [report.latitude, report.longitude] as [number, number],
        description: report.description,
      })) || [];

      setReports(formattedReports);

      // Calculate top issue types
      const typeCounts: { [key: string]: number } = {};
      reportsData?.forEach((report) => {
        typeCounts[report.type] = (typeCounts[report.type] || 0) + 1;
      });

      const topTypes = Object.entries(typeCounts)
        .map(([type, count]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          count,
          percentage: Math.round((count / total) * 100),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setTopIssueTypes(topTypes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Reports',
      value: stats.total,
      icon: BarChart3,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Pending Issues',
      value: stats.pending,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'In Progress',
      value: stats.progress,
      icon: AlertCircle,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Resolved Issues',
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">City Assist Admin Panel</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* Map */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Live Issue Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-6 px-6">
            <div className="h-[400px] rounded-xl overflow-hidden border">
              <MapView
                reports={reports}
                center={[20.5937, 78.9629]}
                zoom={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Top Issue Types */}
        <Card>
          <CardHeader>
            <CardTitle>Top Issue Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topIssueTypes.map((issue, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{issue.type}</span>
                  <span className="text-muted-foreground">{issue.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${issue.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
