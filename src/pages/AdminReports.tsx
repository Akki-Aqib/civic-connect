import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockAdminReports = [
  {
    id: 1,
    image: '/placeholder.svg',
    type: 'Pothole',
    location: 'Main St & Elm Ave',
    dateSubmitted: '2023-10-26',
    assignedTo: 'Public Works',
    status: 'submitted' as const,
  },
  {
    id: 2,
    image: '/placeholder.svg',
    type: 'Pothole',
    location: 'Main St & Elm Ave',
    dateSubmitted: '2023-09-25',
    assignedTo: 'Public Works',
    status: 'resolved' as const,
  },
  {
    id: 3,
    type: 'Trash Overflow',
    location: 'Oak Ave & 3rd St',
    dateSubmitted: '2023-10-27',
    assignedTo: 'Sanitation',
    status: 'progress' as const,
  },
  {
    id: 4,
    type: 'Trash Overflow',
    location: 'Elm Ave & 2nd St',
    dateSubmitted: '2023-10-28',
    assignedTo: 'Sanitation',
    status: 'progress' as const,
  },
  {
    id: 5,
    type: 'Broke Bird @ West Rd',
    location: 'Pine Ave & 4 north St',
    dateSubmitted: '2023-10-13',
    assignedTo: 'Unassigned',
    status: 'submitted' as const,
  },
  {
    id: 6,
    type: 'Maple Ave Bridge',
    location: 'Maple Ave between 5th Ave & 6th Ave',
    dateSubmitted: '2023-10-15',
    assignedTo: 'Public Works',
    status: 'progress' as const,
  },
  {
    id: 7,
    image: '/placeholder.svg',
    type: 'Pothole',
    location: 'Broad Ave & Harris Ave',
    dateSubmitted: '2023-10-18',
    assignedTo: 'Public Works',
    status: 'resolved' as const,
  },
];

const AdminReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'Resolved';
      case 'progress':
        return 'In Progress';
      default:
        return 'Submitted';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports Management</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAdminReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/30 cursor-pointer">
                    <TableCell>
                      {report.image ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={report.image}
                            alt={report.type}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{report.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{report.location}</TableCell>
                    <TableCell className="text-sm">{report.dateSubmitted}</TableCell>
                    <TableCell className="text-sm">{report.assignedTo}</TableCell>
                    <TableCell>
                      <Badge className={`status-badge ${getStatusColor(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
