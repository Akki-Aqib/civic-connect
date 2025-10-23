import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ReportCard from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const mockUserReports = [
  {
    id: '1',
    type: 'Pothole',
    location: 'Main Street & Elm Ave',
    status: 'submitted' as const,
    image: '/placeholder.svg',
    date: '2023-10-26',
  },
  {
    id: '2',
    type: 'Pothole',
    location: 'Main Street & Elm Ave',
    status: 'resolved' as const,
    image: '/placeholder.svg',
    date: '2023-10-20',
  },
  {
    id: '3',
    type: 'Streetlight',
    location: 'Park Avenue',
    status: 'progress' as const,
    image: '/placeholder.svg',
    date: '2023-10-15',
  },
];

const MyReports = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredReports = mockUserReports.filter(
    (report) => statusFilter === 'all' || report.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
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
                      <SelectItem value="submitted">Submitted</SelectItem>
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
                <p className="text-muted-foreground mb-4">No reports found</p>
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
