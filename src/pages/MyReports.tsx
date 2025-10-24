import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ReportCard from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const MyReports = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to view your reports');
      navigate('/auth');
    } else if (user) {
      fetchReports();
    }
  }, [user, authLoading, navigate]);

  const fetchReports = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReports = data?.map((report) => ({
        id: report.id,
        type: report.type.charAt(0).toUpperCase() + report.type.slice(1),
        location: `${report.city}, ${report.state}`,
        status: report.status,
        image: report.image_url || '/placeholder.svg',
        date: new Date(report.created_at).toLocaleDateString(),
      })) || [];

      setReports(formattedReports);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(
    (report) => statusFilter === 'all' || report.status === statusFilter
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={!!user} />
      
      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Reports</h1>
            <Button
              onClick={() => navigate('/report')}
              className="btn-primary shadow-glow"
            >
              <Plus className="mr-2 w-5 h-5" />
              Report a New Issue
            </Button>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Filter by Status:</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Sort:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Date (Newest)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Date (Newest)</SelectItem>
                      <SelectItem value="oldest">Date (Oldest)</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <div key={report.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ReportCard
                  {...report}
                  onClick={() => navigate(`/report/${report.id}`)}
                />
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {statusFilter === 'all' ? 'No reports found' : `No ${statusFilter} reports found`}
                </p>
                <Button onClick={() => navigate('/report')} className="btn-primary">
                  Submit Your First Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyReports;
