// @ts-nocheck
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';

interface Report {
  id: string;
  type: string;
  location: [number, number];
  status: 'submitted' | 'progress' | 'resolved';
  description: string;
}

interface MapViewProps {
  reports: Report[];
  center: [number, number];
  zoom?: number;
}

const MapView = ({ reports, center, zoom = 13 }: MapViewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-success/10 text-success border-success/20';
      case 'progress':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-accent/10 text-accent border-accent/20';
    }
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', minHeight: '400px' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={report.location}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold mb-2">{report.type}</h3>
                <Badge className={`${getStatusColor(report.status)} mb-2`}>
                  {report.status}
                </Badge>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
