'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Feature, Geometry } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';

// Define the provinces involved in Temu Kandidat program
const temuKandidatProvinces = [
  'GORONTALO',
  'SULAWESI TENGAH', 
  'KALIMANTAN BARAT',
  'RIAU'
];

interface TemuKandidatMapProps {
  className?: string;
}

const TemuKandidatMap: React.FC<TemuKandidatMapProps> = ({ className = "" }) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fix Leaflet icon issue in Next.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';
      });
    }
  }, []);

  useEffect(() => {
    const fetchGeoData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/data/Provinsi.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json() as any;
        
        if (!data || !data.features || !Array.isArray(data.features)) {
          throw new Error('Invalid GeoJSON data format');
        }
        
        setGeoData(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
        setError(error instanceof Error ? error.message : 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGeoData();
  }, []);

  // Check if province is involved in Temu Kandidat program
  const isTemuKandidatProvince = (provinceName: string): boolean => {
    const cleanName = provinceName.replace(/PROVINSI /i, '').trim().toUpperCase();
    return temuKandidatProvinces.some(province => 
      cleanName.includes(province) || province.includes(cleanName)
    );
  };

  // Define type for feature properties
  interface FeatureProperties {
    PROVINSI?: string;
    Provinsi?: string;
    NAME_1?: string;
    [key: string]: unknown;
  }

  const onEachFeature = (feature: Feature<Geometry, FeatureProperties>, layer: Layer) => {
    const provinceName = feature.properties?.PROVINSI || 
                         feature.properties?.Provinsi || 
                         feature.properties?.NAME_1 || 'Unknown';
    
    const isHighlighted = isTemuKandidatProvince(provinceName);
    
    if (isHighlighted) {
      layer.bindTooltip(`
        <div>
          <strong>${provinceName.replace(/PROVINSI /i, '')}</strong><br/>
          <span style="color: #dc2626;">✓ Lokasi Program Temu Kandidat</span>
        </div>
      `, { 
        sticky: true,
        className: 'custom-tooltip'
      });
    }
  };

  // Define style function
  const geoJSONStyle = (feature: Feature<Geometry, FeatureProperties> | undefined): PathOptions => {
    if (!feature || !feature.properties) {
      return {
        fillColor: '#e5e7eb',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }
    
    const provinceName = feature.properties.PROVINSI || 
                         feature.properties.Provinsi || 
                         feature.properties.NAME_1 || 'Unknown';
    
    const isHighlighted = isTemuKandidatProvince(provinceName);
    
    return {
      fillColor: isHighlighted ? '#dc2626' : '#e5e7eb',
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: isHighlighted ? 0.8 : 0.5
    };
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

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 min-h-[600px]">
        <div className="text-center p-4 max-w-md">
          <p className="text-red-500 font-semibold">Error loading map: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-primary text-black rounded-md hover:opacity-80"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md z-[500]">
        <h4 className="text-sm font-semibold mb-2">Lokasi Program</h4>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600"></div>
            <span className="text-xs">Provinsi Terlibat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300"></div>
            <span className="text-xs">Provinsi Lainnya</span>
          </div>
        </div>
      </div>

      <div className="h-full w-full">
        {geoData && (
          <MapContainer
            center={[-2.5, 118]} // Center of Indonesia
            zoom={5}
            style={{ height: "100%", width: "100%", zIndex: 10, cursor: "pointer" }}
            zoomControl={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            boxZoom={false}
            keyboard={false}
            dragging={true}
            className="z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON 
              data={geoData}
              style={geoJSONStyle}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        )}
      </div>
      
      <style jsx global>{`
        .custom-tooltip {
          background: white !important;
          border: 1px solid #dc2626 !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        .custom-tooltip .leaflet-tooltip-content {
          margin: 8px !important;
        }
        .leaflet-container {
          cursor: pointer !important;
        }
        .leaflet-interactive {
          cursor: pointer !important;
        }
      `}</style>
    </div>
  );
};

export default TemuKandidatMap; 