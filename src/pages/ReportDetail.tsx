import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const mockReport = {
  id: '1',
  type: 'Pothole on Main St & Elm Ave',
  status: 'resolved' as const,
  image: '/placeholder.svg',
  submittedDate: '2023-10-26',
  resolvedDate: '2023-10-28',
  location: 'Main Street & Elm Avenue',
  description: 'Large, deep pothole at the intersection, causing cars to swerve. It\'s getting bigger each day.',
  activityLog: [
    {
      id: 1,
      action: 'Report Submitted',
      date: 'Oct 26, 2023',
      status: 'submitted',
    },
    {
      id: 2,
      action: 'Assigned to Public Works',
      date: 'Oct 26, 2023',
      status: 'progress',
    },
    {
      id: 3,
      action: 'Resolved - Repaired with asphalt patch',
      date: 'Oct 28, 2023',
      status: 'resolved',
    },
  ],
};

const ReportDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'status-resolved';
      case 'progress':
        return 'status-progress';
      default:
        return 'status-submitted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={true} />
      
      <main className="container py-8">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/my-reports')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            My Reports
          </Button>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              <Card className="animate-slide-up">
                <CardContent className="p-0">
                  <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-muted">
                    <img
                      src={mockReport.image}
                      alt={mockReport.type}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h1 className="text-2xl font-bold">{mockReport.type}</h1>
                      <Badge className={`status-badge ${getStatusColor(mockReport.status)}`}>
                        {mockReport.status === 'resolved' ? 'Resolved' : mockReport.status}
                      </Badge>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h2 className="font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground">{mockReport.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">Status</h3>
                    <Badge className={`status-badge ${getStatusColor(mockReport.status)}`}>
                      Status: {mockReport.status === 'resolved' ? 'Resolved' : mockReport.status}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-3">Issue Type</h3>
                    <p className="text-sm">Pothole</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-3">Dates</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Submitted On:</span>
                        <p className="font-medium">{mockReport.submittedDate}</p>
                      </div>
                      {mockReport.resolvedDate && (
                        <div>
                          <span className="text-muted-foreground">Resolved On:</span>
                          <p className="font-medium">{mockReport.resolvedDate}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">Location</p>
                        <p className="text-muted-foreground">{mockReport.location}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Activity Log</h3>
                  <div className="space-y-4">
                    {mockReport.activityLog.map((activity, index) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.status === 'resolved' ? 'bg-success/10' :
                            activity.status === 'progress' ? 'bg-warning/10' :
                            'bg-accent/10'
                          }`}>
                            <CheckCircle2 className={`w-4 h-4 ${
                              activity.status === 'resolved' ? 'text-success' :
                              activity.status === 'progress' ? 'text-warning' :
                              'text-accent'
                            }`} />
                          </div>
                          {index < mockReport.activityLog.length - 1 && (
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportDetail;
