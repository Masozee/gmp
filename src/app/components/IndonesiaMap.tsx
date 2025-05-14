'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3-geo';
import { GeoGeometryObjects } from 'd3-geo';

// Define province type
interface Province {
  id: string;
  name: string;
  value: number;
  activities: number;
  clicked?: boolean;
}

// Data for provinces with activity information
const provinceData: Province[] = [
  { id: 'ID-AC', name: 'Aceh', value: 75, activities: 12 },
  { id: 'ID-SU', name: 'Sumatera Utara', value: 65, activities: 10 },
  { id: 'ID-SB', name: 'Sumatera Barat', value: 80, activities: 15 },
  { id: 'ID-RI', name: 'Riau', value: 60, activities: 8 },
  { id: 'ID-JA', name: 'Jambi', value: 45, activities: 5 },
  { id: 'ID-SS', name: 'Sumatera Selatan', value: 70, activities: 11 },
  { id: 'ID-BE', name: 'Bengkulu', value: 40, activities: 4 },
  { id: 'ID-LA', name: 'Lampung', value: 55, activities: 7 },
  { id: 'ID-BB', name: 'Kepulauan Bangka Belitung', value: 30, activities: 3 },
  { id: 'ID-KR', name: 'Kepulauan Riau', value: 35, activities: 4 },
  { id: 'ID-JK', name: 'DKI Jakarta', value: 95, activities: 25 },
  { id: 'ID-JB', name: 'Jawa Barat', value: 90, activities: 20 },
  { id: 'ID-JT', name: 'Jawa Tengah', value: 85, activities: 18 },
  { id: 'ID-YO', name: 'DI Yogyakarta', value: 88, activities: 19 },
  { id: 'ID-JI', name: 'Jawa Timur', value: 82, activities: 17 },
  { id: 'ID-BT', name: 'Banten', value: 75, activities: 12 },
  { id: 'ID-BA', name: 'Bali', value: 78, activities: 14 },
  { id: 'ID-NB', name: 'Nusa Tenggara Barat', value: 60, activities: 8 },
  { id: 'ID-NT', name: 'Nusa Tenggara Timur', value: 50, activities: 6 },
  { id: 'ID-KB', name: 'Kalimantan Barat', value: 45, activities: 5 },
  { id: 'ID-KT', name: 'Kalimantan Tengah', value: 40, activities: 4 },
  { id: 'ID-KS', name: 'Kalimantan Selatan', value: 55, activities: 7 },
  { id: 'ID-KI', name: 'Kalimantan Timur', value: 60, activities: 8 },
  { id: 'ID-KU', name: 'Kalimantan Utara', value: 35, activities: 4 },
  { id: 'ID-SA', name: 'Sulawesi Utara', value: 50, activities: 6 },
  { id: 'ID-ST', name: 'Sulawesi Tengah', value: 45, activities: 5 },
  { id: 'ID-SN', name: 'Sulawesi Selatan', value: 65, activities: 10 },
  { id: 'ID-SG', name: 'Sulawesi Tenggara', value: 40, activities: 4 },
  { id: 'ID-GO', name: 'Gorontalo', value: 30, activities: 3 },
  { id: 'ID-SR', name: 'Sulawesi Barat', value: 25, activities: 2 },
  { id: 'ID-MA', name: 'Maluku', value: 35, activities: 4 },
  { id: 'ID-MU', name: 'Maluku Utara', value: 30, activities: 3 },
  { id: 'ID-PA', name: 'Papua', value: 40, activities: 4 },
  { id: 'ID-PB', name: 'Papua Barat', value: 35, activities: 4 },
];

// Function to get color based on value
const getColor = (value: number): string => {
  if (value >= 80) return '#d53f8c'; // Strong pink for high values
  if (value >= 60) return '#e779ba'; // Medium pink
  if (value >= 40) return '#f0a6d2'; // Light pink
  return '#f8d4e8'; // Very light pink for low values
};

// Define the GeoFeature interface with proper d3-geo typing
interface GeoFeature {
  type: string;
  geometry: GeoGeometryObjects;
  properties: {
    [key: string]: string | number;
  };
}

interface GeoJSON {
  type: string;
  features: GeoFeature[];
}

interface TooltipPosition {
  x: number;
  y: number;
}

const IndonesiaMap: React.FC = () => {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    // Fetch the GeoJSON data with better error handling
    const fetchGeoData = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/data/Provinsi.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.features || !Array.isArray(data.features)) {
          throw new Error('Invalid GeoJSON data format');
        }
        
        console.log('GeoJSON loaded successfully:', data.features.length, 'features');
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

  useEffect(() => {
    // Adjust the map when the container is resized
    const handleResize = (): void => {
      if (svgRef.current && geoData) {
        // Force a re-render by updating state
        setGeoData({...geoData});
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [geoData]);

  const handleProvinceClick = (province: Province): void => {
    setSelectedProvince((prevState: Province | null) => 
      prevState && prevState.name === province.name ? null : province
    );
  };

  const handleProvinceHover = (e: React.MouseEvent, province: Province): void => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    } else {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
    setSelectedProvince(province);
  };

  const handleProvinceLeave = (): void => {
    // Only clear the province if it wasn't clicked
    if (selectedProvince && !selectedProvince.clicked) {
      setSelectedProvince(null);
    }
  };

  // Create the map projection
  const createProjection = () => {
    if (!geoData || !svgRef.current) return null;
    
    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 500;
    
    // Create a projection centered on Indonesia
    return d3.geoMercator()
      .center([118, -2]) // Center on Indonesia
      .scale(width * 1.3) // Adjust scale as needed
      .translate([width / 2, height / 2]);
  };

  // Create the path generator
  const createPathGenerator = () => {
    const projection = createProjection();
    if (!projection) return null;
    
    return d3.geoPath().projection(projection);
  };

  // Find province data by name
  const getProvinceData = (name: string): Province => {
    // Clean up the name to match our data structure
    const cleanName = name.replace(/PROVINSI /i, '').trim();
    
    // Try to find a direct match
    let province = provinceData.find(p => 
      p.name.toLowerCase() === cleanName.toLowerCase()
    );
    
    // If no direct match, try partial matching
    if (!province) {
      province = provinceData.find(p => 
        cleanName.toLowerCase().includes(p.name.toLowerCase()) || 
        p.name.toLowerCase().includes(cleanName.toLowerCase())
      );
    }
    
    // If still no match, return a default
    if (!province) {
      console.log('No match found for province:', cleanName);
      return {
        name: cleanName,
        value: 30,
        activities: 2,
        id: 'unknown'
      };
    }
    
    return province;
  };

  return (
    <div className="relative">
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md z-10">
        <h4 className="text-sm font-semibold mb-2">Tingkat Aktivitas</h4>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#d53f8c' }}></div>
            <span className="text-xs">Sangat Tinggi (80-100)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#e779ba' }}></div>
            <span className="text-xs">Tinggi (60-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#f0a6d2' }}></div>
            <span className="text-xs">Sedang (40-59)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ backgroundColor: '#f8d4e8' }}></div>
            <span className="text-xs">Rendah (0-39)</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-[500px] overflow-hidden relative border rounded-lg">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
              <p className="text-gray-500">Loading map data...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="text-center p-4 max-w-md">
              <p className="text-red-500 font-semibold">Error loading map: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Reload
              </button>
            </div>
          </div>
        )}
        
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          {geoData && geoData.features && geoData.features.map((feature, index) => {
            const pathGenerator = createPathGenerator();
            if (!pathGenerator) return null;
            
            const provinceName = typeof feature.properties.PROVINSI === 'string' 
              ? feature.properties.PROVINSI 
              : typeof feature.properties.Provinsi === 'string'
              ? feature.properties.Provinsi
              : typeof feature.properties.NAME_1 === 'string'
              ? feature.properties.NAME_1
              : 'Unknown';
            const province = getProvinceData(provinceName);
            
            return (
              <path
                key={index}
                d={pathGenerator(feature.geometry) || ''}
                fill={getColor(province.value)}
                stroke="#fff"
                strokeWidth="0.5"
                onClick={() => handleProvinceClick(province)}
                onMouseMove={(e) => handleProvinceHover(e, province)}
                onMouseLeave={handleProvinceLeave}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            );
          })}
        </svg>
        
        {/* Tooltip */}
        {selectedProvince && (
          <div 
            className="absolute bg-white p-3 rounded-md shadow-lg z-20 pointer-events-none"
            style={{ 
              left: `${tooltipPosition.x}px`, 
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
              maxWidth: '200px',
              marginTop: '-10px'
            }}
          >
            <h3 className="font-bold text-pink-600">{selectedProvince.name}</h3>
            <div className="text-sm mt-1">
              <p>Tingkat Aktivitas: <span className="font-semibold">{selectedProvince.value}%</span></p>
              <p>Jumlah Kegiatan: <span className="font-semibold">{selectedProvince.activities}</span></p>
            </div>
          </div>
        )}
      </div>
      
      {/* Selected Province Details */}
      {selectedProvince && (
        <div className="mt-6 p-4 bg-pink-50 rounded-lg">
          <h3 className="text-xl font-bold text-pink-700 mb-2">{selectedProvince.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">Tingkat Aktivitas: <span className="font-semibold">{selectedProvince.value}%</span></p>
              <p className="text-gray-700">Jumlah Kegiatan: <span className="font-semibold">{selectedProvince.activities}</span></p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-pink-600 h-2.5 rounded-full" 
                  style={{ width: `${selectedProvince.value}%` }}
                ></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-pink-700 mb-1">Kegiatan Terbaru:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Workshop Literasi Politik di {selectedProvince.name}</li>
                <li>Seminar Kepemimpinan Muda</li>
                <li>Dialog Publik: Peran Pemuda dalam Demokrasi</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

IndonesiaMap.displayName = 'IndonesiaMap';

export default IndonesiaMap;
