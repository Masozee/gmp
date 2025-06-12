'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Feature, Geometry } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';
import { motion } from 'framer-motion';
import overallData from '../../data/overall.json';

// Process the survey data to extract key statistics
const processOverallData = () => {
  const totalRespondents = 505; // Based on the data structure
  
  // Extract regional distribution
  const regionData = overallData.filter(item => item.Variable === 'region_live');
  const westRegion = regionData.find(item => item.Category === 'West');
  const centralRegion = regionData.find(item => item.Category === 'Central');
  const eastRegion = regionData.find(item => item.Category === 'East');
  
  // Extract age data
  const ageData = overallData.filter(item => item.Variable === 'age');
  const age23 = ageData.find(item => item.Category === 23)?.Percentage || '0';
  const age25 = ageData.find(item => item.Category === 25)?.Percentage || '0';
  
  // Extract activism data
  const activismData = overallData.filter(item => item.Variable === 'activism');
  const hasActivism = activismData.find(item => item.Category === 'Pernah')?.Percentage || '0';
  
  // Extract political exposure intensity
  const polexspData = overallData.filter(item => item.Variable === 'polexsp_peers_intensity');
  const veryOften = polexspData.find(item => item.Category === 'Sangat sering (hampir setiap hari)')?.Percentage || '0';
  const often = polexspData.find(item => item.Category === 'Sering (setidaknya sekali seminggu)')?.Percentage || '0';
  
  // Extract civic space understanding
  const civspaceData = overallData.filter(item => item.Variable === 'civspace_understanding');
  const quiteUnderstand = civspaceData.find(item => item.Category === 'Cukup paham')?.Percentage || '0';
  const veryUnderstand = civspaceData.find(item => item.Category === 'Sangat paham')?.Percentage || '0';
  
  // Extract civic engagement data for bottom overlay
  const voicingData = overallData.filter(item => item.Variable === 'issue_commited_voicing');
  const activeVoicing = voicingData.find(item => item.Category === 'Sering terlibat')?.Percentage || '0';
  const occasionalVoicing = voicingData.find(item => item.Category === 'Kadang-kadang terlibat')?.Percentage || '0';
  
  // Extract future engagement willingness
  const engagementData = overallData.filter(item => item.Question_Label === 'Sangat mungkin');
  const willingToEngage = engagementData.find(item => item.Frequency === 125)?.Percentage || '24,8';
  const mightEngage = overallData.filter(item => item.Question_Label === 'Mungkin').find(item => item.Frequency === 217)?.Percentage || '43';
  
  // Extract safety concerns
  const concernData = overallData.filter(item => item.Variable === 'concern_engagement');
  const veryWorried = concernData.find(item => item.Category === 'Sangat khawatir')?.Percentage || '0';
  const quiteWorried = concernData.find(item => item.Category === 'Cukup khawatir')?.Percentage || '0';
  
  return {
    totalRespondents,
    regions: {
      west: { count: westRegion?.Frequency || 0, percentage: westRegion?.Percentage || '0' },
      central: { count: centralRegion?.Frequency || 0, percentage: centralRegion?.Percentage || '0' },
      east: { count: eastRegion?.Frequency || 0, percentage: eastRegion?.Percentage || '0' }
    },
    hoverData: {
      age23: { percentage: age23 },
      age25: { percentage: age25 },
      hasActivism: { percentage: hasActivism },
      veryOftenDiscuss: { percentage: veryOften },
      oftenDiscuss: { percentage: often },
      quiteUnderstandCivspace: { percentage: quiteUnderstand },
      veryUnderstandCivspace: { percentage: veryUnderstand }
    },
    civicEngagement: {
      activeVoicing: { percentage: activeVoicing },
      occasionalVoicing: { percentage: occasionalVoicing },
      willingToEngage: { percentage: willingToEngage },
      mightEngage: { percentage: mightEngage },
      veryWorried: { percentage: veryWorried },
      quiteWorried: { percentage: quiteWorried }
    }
  };
};

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
    color: '#ffcb57', // Primary - Yellow
    participants: provinceData.filter(p => p.timezone === 'WIB').reduce((sum, province) => sum + province.activities * 120, 0),
  },
  'WITA': {
    totalActivities: provinceData.filter(p => p.timezone === 'WITA').reduce((sum, province) => sum + province.activities, 0),
    count: provinceData.filter(p => p.timezone === 'WITA').length,
    color: '#59caf5', // Secondary - Blue
    participants: provinceData.filter(p => p.timezone === 'WITA').reduce((sum, province) => sum + province.activities * 100, 0),
  },
  'WIT': {
    totalActivities: provinceData.filter(p => p.timezone === 'WIT').reduce((sum, province) => sum + province.activities, 0),
    count: provinceData.filter(p => p.timezone === 'WIT').length,
    color: '#f06d98', // Accent - Pink
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

  // Process survey data
  const surveyStats = processOverallData();

  // Survey achievements data based on real civic engagement data
  const achievements = [
    {
      id: 1,
      title: `${surveyStats.civicEngagement.activeVoicing.percentage}%`,
      description: 'Sering Bersuara',
      icon: '/icons/communication.png',
    },
    {
      id: 2,
      title: `${surveyStats.civicEngagement.willingToEngage.percentage}%`,
      description: 'Siap Berpartisipasi',
      icon: '/icons/team-work.png',
    },
    {
      id: 3,
      title: `${surveyStats.civicEngagement.quiteWorried.percentage}%`,
      description: 'Khawatir Keamanan',
      icon: '/icons/pin.png',
    },
    {
      id: 4,
      title: surveyStats.totalRespondents.toString(),
      description: 'Total Responden',
      icon: '/icons/global-network.png',
    },
  ];

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
    
    // Get regional survey data for tooltip
    const getRegionalSurveyData = (timezone: string) => {
      if (timezone === 'WIB') return surveyStats.regions.west;
      if (timezone === 'WITA') return surveyStats.regions.central;
      if (timezone === 'WIT') return surveyStats.regions.east;
      return { count: 0, percentage: '0' };
    };
    
    const regionalData = getRegionalSurveyData(province.timezone);
    
    layer.on({
      click: () => {
        setSelectedTimezone(prevTimezone => prevTimezone === province.timezone ? null : province.timezone);
      }
    });
    
    layer.bindTooltip(`
      <div style="font-family: system-ui; padding: 8px; max-width: 280px;">
        <strong style="color: #1f2937; font-size: 14px;">Zona ${province.timezone}</strong><br/>
        <span style="color: #6b7280; font-size: 12px;">(${province.timezone === 'WIB' ? 'UTC+7' : province.timezone === 'WITA' ? 'UTC+8' : 'UTC+9'})</span><br/><br/>
        <div style="color: #374151; font-size: 12px;">
          <strong>Data Responden:</strong><br/>
          • Regional: ${regionalData.count} (${regionalData.percentage}%)<br/>
          • Usia 23: ${surveyStats.hoverData.age23.percentage}%<br/>
          • Usia 25: ${surveyStats.hoverData.age25.percentage}%<br/><br/>
          <strong>Aktivisme & Politik:</strong><br/>
          • Pernah aktivisme: ${surveyStats.hoverData.hasActivism.percentage}%<br/>
          • Diskusi politik harian: ${surveyStats.hoverData.veryOftenDiscuss.percentage}%<br/>
          • Diskusi politik mingguan: ${surveyStats.hoverData.oftenDiscuss.percentage}%<br/><br/>
          <strong>Pemahaman Ruang Sipil:</strong><br/>
          • Cukup paham: ${surveyStats.hoverData.quiteUnderstandCivspace.percentage}%<br/>
          • Sangat paham: ${surveyStats.hoverData.veryUnderstandCivspace.percentage}%
        </div>
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
        fillColor: '#e5e7eb',
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.9
      };
    }
    
    const provinceName = feature.properties.PROVINSI || 
                         feature.properties.Provinsi || 
                         feature.properties.NAME_1 || 'Unknown';
    const province = getProvinceData(provinceName);
    
    return {
      fillColor: getTimezoneColor(province.timezone),
      weight: selectedTimezone === province.timezone ? 4 : 2,
      opacity: 1,
      color: selectedTimezone === province.timezone ? '#1f2937' : 'white',
      fillOpacity: selectedTimezone === province.timezone ? 1.0 : 0.9
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
                    src="/images/cover/LaporanGorontalo.png"
                    alt="Laporan Riset Ruang Sipil Gorontalo"
                    className="w-32 h-48 object-cover rounded-lg shadow-md"
                  />
                </div>
                
                {/* Content - Right */}
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    Understanding Youth Engagement and Civic Space in Indonesia
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
          
          {/* Gradient overlay - only darken top nav area */}
          <div 
            className="absolute inset-0 pointer-events-none z-20" 
            style={{ 
              background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0) 50%)"
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