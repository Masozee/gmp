'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Feature, Geometry } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';
import { motion } from 'framer-motion';

// Data for provinces with activity information
const provinceData = [
  // WIB (UTC+7) Timezone
  { id: 'ID-AC', name: 'Aceh', value: 75, activities: 12, timezone: 'WIB' },
  { id: 'ID-SU', name: 'Sumatera Utara', value: 65, activities: 10, timezone: 'WIB' },
  { id: 'ID-SB', name: 'Sumatera Barat', value: 80, activities: 15, timezone: 'WIB' },
  { id: 'ID-RI', name: 'Riau', value: 60, activities: 8, timezone: 'WIB' },
  { id: 'ID-JA', name: 'Jambi', value: 45, activities: 5, timezone: 'WIB' },
  { id: 'ID-SS', name: 'Sumatera Selatan', value: 70, activities: 11, timezone: 'WIB' },
  { id: 'ID-BE', name: 'Bengkulu', value: 40, activities: 4, timezone: 'WIB' },
  { id: 'ID-LA', name: 'Lampung', value: 55, activities: 7, timezone: 'WIB' },
  { id: 'ID-BB', name: 'Kepulauan Bangka Belitung', value: 30, activities: 3, timezone: 'WIB' },
  { id: 'ID-KR', name: 'Kepulauan Riau', value: 35, activities: 4, timezone: 'WIB' },
  { id: 'ID-JK', name: 'DKI Jakarta', value: 95, activities: 25, timezone: 'WIB' },
  { id: 'ID-JB', name: 'Jawa Barat', value: 90, activities: 20, timezone: 'WIB' },
  { id: 'ID-JT', name: 'Jawa Tengah', value: 85, activities: 18, timezone: 'WIB' },
  { id: 'ID-YO', name: 'DI Yogyakarta', value: 88, activities: 19, timezone: 'WIB' },
  { id: 'ID-JI', name: 'Jawa Timur', value: 82, activities: 17, timezone: 'WIB' },
  { id: 'ID-BT', name: 'Banten', value: 75, activities: 12, timezone: 'WIB' },
  { id: 'ID-KB', name: 'Kalimantan Barat', value: 45, activities: 5, timezone: 'WIB' },
  { id: 'ID-KT', name: 'Kalimantan Tengah', value: 40, activities: 4, timezone: 'WIB' },
  
  // WITA (UTC+8) Timezone
  { id: 'ID-BA', name: 'Bali', value: 78, activities: 14, timezone: 'WITA' },
  { id: 'ID-NB', name: 'Nusa Tenggara Barat', value: 60, activities: 8, timezone: 'WITA' },
  { id: 'ID-NT', name: 'Nusa Tenggara Timur', value: 50, activities: 6, timezone: 'WITA' },
  { id: 'ID-KS', name: 'Kalimantan Selatan', value: 55, activities: 7, timezone: 'WITA' },
  { id: 'ID-KI', name: 'Kalimantan Timur', value: 60, activities: 8, timezone: 'WITA' },
  { id: 'ID-KU', name: 'Kalimantan Utara', value: 35, activities: 4, timezone: 'WITA' },
  { id: 'ID-SA', name: 'Sulawesi Utara', value: 50, activities: 6, timezone: 'WITA' },
  { id: 'ID-ST', name: 'Sulawesi Tengah', value: 45, activities: 5, timezone: 'WITA' },
  { id: 'ID-SN', name: 'Sulawesi Selatan', value: 65, activities: 10, timezone: 'WITA' },
  { id: 'ID-SG', name: 'Sulawesi Tenggara', value: 40, activities: 4, timezone: 'WITA' },
  { id: 'ID-GO', name: 'Gorontalo', value: 30, activities: 3, timezone: 'WITA' },
  { id: 'ID-SR', name: 'Sulawesi Barat', value: 25, activities: 2, timezone: 'WITA' },
  
  // WIT (UTC+9) Timezone
  { id: 'ID-MA', name: 'Maluku', value: 35, activities: 4, timezone: 'WIT' },
  { id: 'ID-MU', name: 'Maluku Utara', value: 30, activities: 3, timezone: 'WIT' },
  { id: 'ID-PA', name: 'Papua', value: 40, activities: 4, timezone: 'WIT' },
  { id: 'ID-PB', name: 'Papua Barat', value: 35, activities: 4, timezone: 'WIT' },
];

// Calculate aggregated data by timezone
const timezoneData = {
  'WIB': {
    totalActivities: provinceData.filter(p => p.timezone === 'WIB').reduce((sum, province) => sum + province.activities, 0),
    count: provinceData.filter(p => p.timezone === 'WIB').length,
    color: '#4299e1', // Blue
    participants: provinceData.filter(p => p.timezone === 'WIB').reduce((sum, province) => sum + province.activities * 120, 0),
  },
  'WITA': {
    totalActivities: provinceData.filter(p => p.timezone === 'WITA').reduce((sum, province) => sum + province.activities, 0),
    count: provinceData.filter(p => p.timezone === 'WITA').length,
    color: '#48bb78', // Green
    participants: provinceData.filter(p => p.timezone === 'WITA').reduce((sum, province) => sum + province.activities * 100, 0),
  },
  'WIT': {
    totalActivities: provinceData.filter(p => p.timezone === 'WIT').reduce((sum, province) => sum + province.activities, 0),
    count: provinceData.filter(p => p.timezone === 'WIT').length,
    color: '#ed8936', // Orange
    participants: provinceData.filter(p => p.timezone === 'WIT').reduce((sum, province) => sum + province.activities * 80, 0),
  }
};

interface ProvinceData {
  id: string;
  name: string;
  value: number;
  activities: number;
  timezone: string;
}

const InteractiveMap = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);

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

  // Find province data by name
  const getProvinceData = (name: string): ProvinceData => {
    const cleanName = name.replace(/PROVINSI /i, '').trim();
    
    let province = provinceData.find(p => 
      p.name.toLowerCase() === cleanName.toLowerCase()
    );
    
    if (!province) {
      province = provinceData.find(p => 
        cleanName.toLowerCase().includes(p.name.toLowerCase()) || 
        p.name.toLowerCase().includes(cleanName.toLowerCase())
      );
    }
    
    if (!province) {
      return {
        name: cleanName,
        value: 30,
        activities: 2,
        timezone: 'WIB',
        id: 'unknown'
      };
    }
    
    return province;
  };

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
    const province = getProvinceData(provinceName);
    
    layer.on({
      click: () => {
        setSelectedTimezone(prevTimezone => prevTimezone === province.timezone ? null : province.timezone);
      }
    });
    
    layer.bindTooltip(`
      <div>
        <strong>Zona ${province.timezone}</strong><br/>
        (${province.timezone === 'WIB' ? 'UTC+7' : province.timezone === 'WITA' ? 'UTC+8' : 'UTC+9'})<br/>
        Jumlah Provinsi: ${timezoneData[province.timezone as keyof typeof timezoneData]?.count || 0}<br/>
        Total Kegiatan: ${timezoneData[province.timezone as keyof typeof timezoneData]?.totalActivities || 0}
      </div>
    `, { sticky: true });
  };

  // Get color based on timezone
  const getTimezoneColor = (timezone: string) => {
    return timezoneData[timezone as keyof typeof timezoneData]?.color || '#cccccc';
  };

  const geoJSONStyle = (feature: Feature<Geometry, FeatureProperties> | undefined): PathOptions => {
    if (!feature || !feature.properties) {
      return {
        fillColor: '#f8d4e8',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
      };
    }
    
    const provinceName = feature.properties.PROVINSI || 
                         feature.properties.Provinsi || 
                         feature.properties.NAME_1 || 'Unknown';
    const province = getProvinceData(provinceName);
    
    return {
      fillColor: getTimezoneColor(province.timezone),
      weight: selectedTimezone === province.timezone ? 3 : 1,
      opacity: 1,
      color: selectedTimezone === province.timezone ? '#333' : 'white',
      fillOpacity: selectedTimezone === province.timezone ? 0.9 : 0.7
    };
  };

  if (loading) {
    return (
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-pink-50 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
              <p className="text-gray-500">Loading map data...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-pink-50 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
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
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="relative w-full h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Map Section - Full Width and Full Height */}
      <div className="relative w-full h-full">
        {/* Legend */}
       
        {/* Title and Description - Left Bottom */}
        <div className="absolute bottom-6 left-0 w-full z-[500]">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl max-w-2xl">
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Publication Image - Left */}
            <div className="flex-shrink-0">
              <img 
                src="http://localhost:3000/images/cover/LaporanGorontalo.png"
                alt="Laporan Riset Ruang Sipil Gorontalo"
                className="w-32 h-48 object-cover rounded-lg shadow-md"
              />
            </div>
            
            {/* Content - Right */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Ruang Sipil
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-4 leading-relaxed">
                Eksplorasi mendalam terhadap dinamika partisipasi pemuda dalam ruang sipil Indonesia. 
                Pemetaan ini menunjukkan sebaran geografis kegiatan dan tingkat keterlibatan masyarakat 
                sipil di berbagai zona waktu.
              </p>
              
              {/* Yellow Button to Publications */}
              <motion.a
                href="/publikasi"
                className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-full text-sm transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Lihat Semua Publikasi
              </motion.a>
            </div>
          </motion.div>
            </div>
          </div>
        </div>

        <motion.div 
          className="h-full w-full relative"
          style={{ background: '#f5f5f5' }}
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          {geoData && (
            <MapContainer
              center={[-2.5, 118]}
              zoom={5}
              style={{ height: "100%", width: "100%", background: '#f5f5f5', zIndex: 10 }}
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
          
          {/* Light gradient overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-20" 
            style={{ 
              background: "linear-gradient(360deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.6) 100%)"
            }}
          ></div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Statistics Component - Separate section after the map
const MapStatistics = () => {
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);

  return (
    <section className="w-full bg-gradient-to-br from-blue-50 via-white to-pink-50 py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Statistics Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {Object.entries(timezoneData).map(([timezone, data]) => (
            <motion.div
              key={timezone}
              className={`bg-white p-6 rounded-xl shadow-lg border-l-4 cursor-pointer transition-all duration-300 ${
                selectedTimezone === timezone 
                  ? 'transform scale-105 shadow-xl' 
                  : 'hover:shadow-lg'
              }`}
              style={{ borderLeftColor: data.color }}
              onClick={() => setSelectedTimezone(selectedTimezone === timezone ? null : timezone)}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Zona {timezone}
                </h3>
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: data.color }}
                ></div>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">{data.count}</span> Provinsi
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">{data.totalActivities}</span> Total Kegiatan
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">{data.participants.toLocaleString()}</span> Peserta
                </p>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    backgroundColor: data.color,
                    width: `${(data.totalActivities / Math.max(...Object.values(timezoneData).map(tz => tz.totalActivities))) * 100}%`
                  }}
                ></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-lg text-gray-600 mb-6">
            Tertarik bergabung dengan kegiatan di daerah Anda?
          </p>
          <motion.button
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Jelajahi Program Kami
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveMap;
export { MapStatistics }; 