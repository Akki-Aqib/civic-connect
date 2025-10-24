import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return '#10b981';
      case 'progress':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on India
    const map = L.map(mapContainerRef.current).setView(center, zoom);
    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add markers
    reports.forEach((report) => {
      const marker = L.marker(report.location).addTo(map);
      
      const popupContent = `
        <div style="padding: 8px; min-width: 150px;">
          <h3 style="font-weight: 600; margin-bottom: 8px;">${report.type}</h3>
          <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: ${getStatusColor(report.status)}20; color: ${getStatusColor(report.status)}; border: 1px solid ${getStatusColor(report.status)}40; margin-bottom: 8px;">
            ${report.status}
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px;">${report.description}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [reports, center, zoom]);

  return (
    <div 
      ref={mapContainerRef} 
      className="h-full w-full rounded-xl"
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapView;
