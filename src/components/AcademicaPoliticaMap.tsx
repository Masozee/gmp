'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Define specific locations with coordinates for Academia Politica
const academicaPoliticaLocations = [
  {
    name: 'DKI Jakarta',
    coordinates: [-6.2088, 106.8456] as [number, number],
    description: 'Lokasi program Academia Politica',
    status: 'active'
  },
  {
    name: 'Bandung, Jawa Barat',
    coordinates: [-6.9175, 107.6191] as [number, number],
    description: 'Lokasi program Academia Politica',
    status: 'active'
  },
  {
    name: 'Yogyakarta, DIY',
    coordinates: [-7.7956, 110.3695] as [number, number],
    description: 'Lokasi program Academia Politica',
    status: 'active'
  },
  {
    name: 'Samarinda, Kalimantan Timur',
    coordinates: [-0.5022, 117.1536] as [number, number],
    description: 'Lokasi program Academia Politica',
    status: 'active'
  },
  {
    name: 'Makassar, Sulawesi Selatan',
    coordinates: [-5.1477, 119.4327] as [number, number],
    description: 'Lokasi program Academia Politica',
    status: 'active'
  },
  {
    name: 'Sorong, Papua Barat',
    coordinates: [-0.8650, 131.2644] as [number, number],
    description: 'Lokasi program Academia Politica',
    status: 'active'
  },
  {
    name: 'Jayapura, Papua',
    coordinates: [-2.5489, 140.7197] as [number, number],
    description: 'Lokasi program Academia Politica',
    status: 'active'
  },
  {
    name: 'Ambon, Maluku',
    coordinates: [-3.6954, 128.1814] as [number, number],
    description: 'Lokasi program Academia Politica',
    status: 'coming_soon'
  },
  {
    name: 'Manado, Sulawesi Utara',
    coordinates: [1.4748, 124.8421] as [number, number],
    description: 'Lokasi program Academia Politica',
    status: 'coming_soon'
  },
  {
    name: 'Nusa Tenggara Barat',
    coordinates: [-8.6529, 117.3616] as [number, number], // Mataram coordinates
    description: 'Lokasi program Academia Politica',
    status: 'coming_soon'
  },
  {
    name: 'Kalimantan Selatan',
    coordinates: [-3.0926, 115.2838] as [number, number], // Banjarmasin coordinates
    description: 'Lokasi program Academia Politica',
    status: 'coming_soon'
  },
  {
    name: 'Jambi',
    coordinates: [-1.6101, 103.6131] as [number, number], // Jambi city coordinates
    description: 'Lokasi program Academia Politica',
    status: 'coming_soon'
  }
];

interface AcademicaPoliticaMapProps {
  className?: string;
}

const AcademicaPoliticaMap: React.FC<AcademicaPoliticaMapProps> = ({ className = "" }) => {
  const [loading, setLoading] = useState(true);

  // Fix Leaflet icon issue in Next.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Fix default icon paths
        L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';
        
        // Create custom marker icon for active locations
        const activeIcon = new L.Icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        // Set as default
        L.Icon.Default.prototype.options = activeIcon.options;
        setLoading(false);
      });
    }
  }, []);

  // Create marker icon based on status
  const createMarkerIcon = (status: string) => {
    if (typeof window === 'undefined') return null;
    
    const L = require('leaflet');
    
    if (status === 'coming_soon') {
      // Gray marker for coming soon locations
      return new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPGNpcmNsZSBjeD0iMTIuNSIgY3k9IjEyLjUiIHI9IjciIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    } else {
      // Blue marker for active locations
      return new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 min-h-[600px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <p className="text-gray-500">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md z-[500]">
        <h4 className="text-sm font-semibold mb-2">Lokasi Program</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <span className="text-xs">Aktif</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span className="text-xs">Coming Soon</span>
          </div>
        </div>
      </div>

      <div className="h-full w-full">
        <MapContainer
          center={[-2.5, 118]} // Center of Indonesia
          zoom={5}
          style={{ height: "100%", width: "100%", zIndex: 10, cursor: "default" }}
          zoomControl={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
          dragging={false}
          className="z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Add pinpoint markers for specific locations */}
          {academicaPoliticaLocations.map((location, index) => (
            <Marker 
              key={index} 
              position={location.coordinates}
              icon={createMarkerIcon(location.status)}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-sm mb-1">{location.name}</h3>
                  <p className="text-xs text-gray-600">{location.description}</p>
                  <div className="mt-2 text-xs">
                    {location.status === 'active' ? (
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Academia Politica
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <style jsx global>{`
        .leaflet-container {
          cursor: default !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
        }
        .leaflet-popup-content {
          margin: 12px !important;
          line-height: 1.4 !important;
        }
      `}</style>
    </div>
  );
};

export default AcademicaPoliticaMap;