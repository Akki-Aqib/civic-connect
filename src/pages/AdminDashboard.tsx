import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import MapView from '@/components/MapView';

const mockReports = [
  {
    id: '1',
    type: 'Pothole',
    location: [40.7128, -74.0060] as [number, number],
    status: 'submitted' as const,
    description: 'Large pothole on Main Street',
  },
  {
    id: '2',
    type: 'Streetlight',
    location: [40.7158, -74.0040] as [number, number],
    status: 'progress' as const,
    description: 'Broken streetlight near park',
  },
  {
    id: '3',
    type: 'Trash Overflow',
    location: [40.7100, -74.0080] as [number, number],
    status: 'resolved' as const,
    description: 'Overflowing trash bin',
  },
];

const stats = [
  {
    title: 'Total Reports',
    value: '1,543',
    icon: BarChart3,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Pending Issues',
    value: '328',
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    title: 'In Progress',
    value: '355',
    icon: AlertCircle,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Resolved Issues',
    value: '1060',
    icon: CheckCircle2,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Avg Resolution Time',
    value: '2.1 Days',
    icon: TrendingUp,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
];

const topIssueTypes = [
  { type: 'Pothole', count: 487, percentage: 32 },
  { type: 'Streetlight', count: 356, percentage: 23 },
  { type: 'Trash', count: 298, percentage: 19 },
  { type: 'Graffiti', count: 215, percentage: 14 },
  { type: 'Other', count: 187, percentage: 12 },
];

const recentActivity = [
  { title: 'New Report: Pothole on Main St (Pending)', time: 'Just now' },
  { title: 'Status Update: Elm Ave Streetlight (Resolved)', time: '5 mins ago' },
  { title: 'New Report: Trash at Park St (Pending)', time: '15 mins ago' },
];

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Sarah Chen</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
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
                reports={mockReports}
                center={[40.7128, -74.0060]}
                zoom={13}
              />
            </div>
          </CardContent>
        </Card>

        {/* Side Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Issue Types</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
