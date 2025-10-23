import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar } from 'lucide-react';

interface ReportCardProps {
  id: string;
  type: string;
  location: string;
  status: 'submitted' | 'progress' | 'resolved';
  image?: string;
  date: string;
  onClick?: () => void;
}

const ReportCard = ({ type, location, status, image, date, onClick }: ReportCardProps) => {
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
    <Card 
      className="overflow-hidden hover-lift cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {image && (
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
              <img 
                src={image} 
                alt={type}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg truncate">{type}</h3>
              <Badge className={`status-badge ${getStatusColor(status)} flex-shrink-0`}>
                {getStatusLabel(status)}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
