'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Define specific locations with coordinates for pinpoint markers
const temuKandidatLocations = [
  {
    name: 'Provinsi Gorontalo',
    coordinates: [0.6999, 122.4467] as [number, number], // Gorontalo city coordinates
    description: 'Lokasi program Temu Kandidat 2020-2021'
  },
  {
    name: 'Provinsi Sulawesi Tengah',
    coordinates: [-1.4300, 121.4456] as [number, number], // Palu city coordinates
    description: 'Lokasi program Temu Kandidat 2020-2021'
  },
  {
    name: 'Kabupaten Sintang',
    coordinates: [0.1553, 111.4991] as [number, number], // Sintang coordinates
    description: 'Kabupaten Sintang, Provinsi Kalimantan Barat'
  },
  {
    name: 'Kabupaten Siak',
    coordinates: [1.1167, 101.4333] as [number, number], // Siak coordinates
    description: 'Kabupaten Siak, Provinsi Riau'
  }
];

interface TemuKandidatMapProps {
  className?: string;
}

const TemuKandidatMap: React.FC<TemuKandidatMapProps> = ({ className = "" }) => {
  const [loading, setLoading] = useState(true);

  // Fix Leaflet icon issue in Next.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Fix default icon paths
        L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';
        
        // Create custom marker icon
        const customIcon = new L.Icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        // Set as default
        L.Icon.Default.prototype.options = customIcon.options;
        setLoading(false);
      });
    }
  }, []);

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
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
          <span className="text-xs">Lokasi Temu Kandidat</span>
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
          {temuKandidatLocations.map((location, index) => (
            <Marker 
              key={index} 
              position={location.coordinates}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-sm mb-1">{location.name}</h3>
                  <p className="text-xs text-gray-600">{location.description}</p>
                  <div className="mt-2 text-xs">
                    <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded">
                      Temu Kandidat 2020-2021
                    </span>
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

export default TemuKandidatMap; 