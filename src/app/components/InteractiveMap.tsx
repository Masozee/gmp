'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Feature, Geometry } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';
import { motion } from 'framer-motion';
interface MapData {
  provinces: ProvinceData[];
  timezones: {
    [key: string]: {
      totalActivities: number;
      count: number;
      color: string;
      participants: number;
      surveyData: {
        respondents: number;
        demographics: {
          age23: string;
          age25: string;
          avgAge: string;
        };
        activism: {
          hasActivism: string;
          politicalDiscussion: {
            veryOften: string;
            often: string;
          };
        };
        civicSpace: {
          understanding: {
            quite: string;
            very: string;
          };
          engagement: {
            active: string;
            occasional: string;
          };
        };
        concerns: {
          veryWorried: string;
          quiteWorried: string;
        };
      };
      provinces: ProvinceData[];
    };
  };
  surveyStats: {
    totalRespondents: number;
    regions: {
      west: { count: number; percentage: string };
      central: { count: number; percentage: string };
      east: { count: number; percentage: string };
    };
    hoverData: {
      age23: { percentage: string };
      age25: { percentage: string };
      hasActivism: { percentage: string };
      veryOftenDiscuss: { percentage: string };
      oftenDiscuss: { percentage: string };
      quiteUnderstandCivspace: { percentage: string };
      veryUnderstandCivspace: { percentage: string };
    };
    civicEngagement: {
      activeVoicing: { percentage: string };
      occasionalVoicing: { percentage: string };
      willingToEngage: { percentage: string };
      mightEngage: { percentage: string };
      veryWorried: { percentage: string };
      quiteWorried: { percentage: string };
    };
  };
  lastUpdated: string;
}

interface ProvinceData {
  id: string;
  name: string;
  value: number;
  activities: number;
  timezone: string;
  region: string;
  participants: number;
}

interface InteractiveMapProps {
  cardContent?: {
    image?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
  };
}

const InteractiveMap = ({ cardContent }: InteractiveMapProps = {}) => {
  const [geoData, setGeoData] = useState<any>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);
  const [activePopup, setActivePopup] = useState<{
    timezone: string;
    position: { x: number; y: number };
    data: any;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Survey achievements data based on real civic engagement data
  const achievements = mapData ? [
    {
      id: 1,
      title: `${mapData.surveyStats.civicEngagement.activeVoicing.percentage}%`,
      description: 'Sering Bersuara',
      icon: '/icons/communication.png',
    },
    {
      id: 2,
      title: `${mapData.surveyStats.civicEngagement.willingToEngage.percentage}%`,
      description: 'Siap Berpartisipasi',
      icon: '/icons/team-work.png',
    },
    {
      id: 3,
      title: `${mapData.surveyStats.civicEngagement.quiteWorried.percentage}%`,
      description: 'Khawatir Keamanan',
      icon: '/icons/pin.png',
    },
    {
      id: 4,
      title: mapData.surveyStats.totalRespondents.toString(),
      description: 'Total Responden',
      icon: '/icons/global-network.png',
    },
  ] : [];

  // Fix Leaflet icon issue in Next.js and detect mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';
      });
      
      // Detect mobile devices
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch both map data and GeoJSON in parallel
        const [mapDataResponse, geoResponse] = await Promise.all([
          fetch(`/api/map-data?t=${Date.now()}`), // Add timestamp to prevent caching
          fetch('/data/Provinsi.json')
        ]);
        
        if (!mapDataResponse.ok) {
          throw new Error(`Failed to load map data: ${mapDataResponse.status} ${mapDataResponse.statusText}`);
        }
        
        if (!geoResponse.ok) {
          throw new Error(`Failed to load GeoJSON: ${geoResponse.status} ${geoResponse.statusText}`);
        }
        
        const mapResult = await mapDataResponse.json();
        const geoData = await geoResponse.json();
        
        if (!mapResult.success) {
          throw new Error(mapResult.error || 'Failed to load map data');
        }
        
        if (!geoData || !geoData.features || !Array.isArray(geoData.features)) {
          throw new Error('Invalid GeoJSON data format');
        }
        
        console.log('Map data loaded from API:', mapResult.data.lastUpdated, 'Total respondents:', mapResult.data.surveyStats.totalRespondents);
        setMapData(mapResult.data);
        setGeoData(geoData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle escape key to close popup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activePopup) {
        setActivePopup(null);
      }
    };

    if (activePopup) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [activePopup]);

  // Find province data by name
  const getProvinceData = (name: string): ProvinceData => {
    if (!mapData) {
      return {
        name: name,
        value: 30,
        activities: 2,
        timezone: 'WIB',
        id: 'unknown',
        region: 'west',
        participants: 100
      };
    }

    const cleanName = name.replace(/PROVINSI /i, '').trim();
    
    let province = mapData.provinces.find(p => 
      p.name.toLowerCase() === cleanName.toLowerCase()
    );
    
    if (!province) {
      province = mapData.provinces.find(p => 
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
        id: 'unknown',
        region: 'west',
        participants: 100
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
    
    // Get regional survey data for popup
    const getRegionalSurveyData = (timezone: string) => {
      if (!mapData) return { count: 0, percentage: '0' };
      if (timezone === 'WIB') return mapData.surveyStats.regions.west;
      if (timezone === 'WITA') return mapData.surveyStats.regions.central;
      if (timezone === 'WIT') return mapData.surveyStats.regions.east;
      return { count: 0, percentage: '0' };
    };
    
    const regionalData = getRegionalSurveyData(province.timezone);
    
    layer.on({
      click: (e) => {
        setSelectedTimezone(prevTimezone => prevTimezone === province.timezone ? null : province.timezone);
        
        // Set active popup with position and data
        const mapContainer = e.target._map.getContainer();
        const rect = mapContainer.getBoundingClientRect();
        
        const timezoneData = mapData?.timezones[province.timezone];
        
        setActivePopup({
          timezone: province.timezone,
          position: {
            x: e.containerPoint.x,
            y: e.containerPoint.y
          },
          data: {
            provinceName,
            province,
            regionalData,
            surveyStats: mapData?.surveyStats,
            timezoneData: timezoneData
          }
        });
      }
    });
    
    // Enhanced tooltip with timezone info
    const timezoneInfo = mapData?.timezones[province.timezone];
    layer.bindTooltip(`
      <div style="font-family: system-ui; padding: 6px; max-width: 250px; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${timezoneInfo?.color || '#ccc'};"></div>
          <strong style="color: #1f2937; font-size: 13px;">Zona ${province.timezone}</strong>
        </div>
        <div style="color: #6b7280; font-size: 10px; margin-bottom: 6px;">
          ${province.timezone === 'WIB' ? 'UTC+7' : province.timezone === 'WITA' ? 'UTC+8' : 'UTC+9'} • ${provinceName}
        </div>
        <div style="color: #6b7280; font-size: 10px; border-top: 1px solid #e5e7eb; padding-top: 4px;">
          ${timezoneInfo?.totalActivities || 0} kegiatan • ${timezoneInfo?.surveyData?.respondents || 0} responden
        </div>
        <div style="color: #059669; font-size: 9px; font-weight: 600; margin-top: 4px;">
          📍 Klik untuk detail lengkap
        </div>
      </div>
    `, { sticky: false });
  };

  // Get color based on timezone
  const getTimezoneColor = (timezone: string) => {
    return mapData?.timezones[timezone]?.color || '#cccccc';
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

  if (loading || !mapData) {
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
        {/* Title and Description - Responsive positioning */}
        <div className="absolute bottom-6 left-0 w-full z-[500]">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-xl max-w-2xl">
              <motion.div
                className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-stretch"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Publication Image - Top on mobile, Left on desktop */}
                {cardContent?.image && (
                  <div className="flex-shrink-0 flex md:self-stretch">
                    <img 
                      src={cardContent.image}
                      alt={cardContent.title || "Card image"}
                      className="w-24 h-24 md:w-36 md:h-auto lg:w-40 object-contain rounded-lg shadow-md mx-auto md:mx-0"
                    />
                  </div>
                )}
                
                {/* Content - Bottom on mobile, Right on desktop */}
                <div className="flex-1 text-center md:text-left flex flex-col justify-center">
                  {cardContent?.subtitle && (
                    <p className="text-xs md:text-xs lg:text-sm mb-1 md:mb-1 text-primary font-semibold">
                      {cardContent.subtitle}
                    </p>
                  )}
                  <h2 className="text-sm md:text-lg lg:text-xl font-bold text-gray-800 mb-1 md:mb-2 leading-tight">
                    {cardContent?.title || "Understanding Youth Engagement and Civic Space in Indonesia"}
                  </h2>
                  <p className="text-xs md:text-xs lg:text-sm text-gray-600 mb-2 md:mb-3 leading-relaxed">
                    {cardContent?.description || "Eksplorasi mendalam terhadap dinamika partisipasi pemuda dalam ruang sipil Indonesia. Pemetaan ini menunjukkan sebaran geografis kegiatan dan tingkat keterlibatan masyarakat sipil di berbagai zona waktu."}
                  </p>
                  
                  {/* Action Button */}
                  <motion.a
                    href={cardContent?.buttonLink || "/publikasi"}
                    className="inline-block bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] font-semibold px-3 py-1 rounded-full text-xs transition-colors duration-300 touch-manipulation w-fit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cardContent?.buttonText || "Lihat Semua Publikasi"}
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
          onClick={(e) => {
            // Close popup when clicking on the background
            if (e.target === e.currentTarget) {
              setActivePopup(null);
            }
          }}
        >
          {geoData && (
            <MapContainer
              center={isMobile ? [-2.0, 118] : [-2.5, 118]}
              zoom={isMobile ? 3.5 : 5}
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
          
          {/* Custom Popup */}
          {activePopup && (
            <div 
              className="absolute z-30 pointer-events-auto"
              style={{
                left: `${Math.min(activePopup.position.x, window.innerWidth - 320)}px`,
                top: `${Math.min(activePopup.position.y, window.innerHeight - 350)}px`,
                transform: 'translate(-50%, -100%)',
                maxWidth: '320px'
              }}
              onWheel={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden w-80"
                style={{ 
                  fontFamily: 'system-ui',
                  border: `2px solid ${activePopup.data.timezoneData?.color || '#e5e7eb'}`,
                  boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px ${activePopup.data.timezoneData?.color}40`
                }}
              >
                {/* Header with close button */}
                <div 
                  className="px-4 py-4 flex justify-between items-center border-b-2"
                  style={{ 
                    borderBottomColor: activePopup.data.timezoneData?.color || '#ccc',
                    backgroundColor: activePopup.data.timezoneData?.color + '20',
                    background: `linear-gradient(135deg, ${activePopup.data.timezoneData?.color}20, ${activePopup.data.timezoneData?.color}10)`
                  }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div 
                        className="w-4 h-4 rounded-full shadow-lg border-2 border-white"
                        style={{ backgroundColor: activePopup.data.timezoneData?.color || '#ccc' }}
                      ></div>
                      <strong 
                        className="text-lg font-bold"
                        style={{ color: activePopup.data.timezoneData?.color ? '#1f2937' : '#1f2937' }}
                      >
                        Zona {activePopup.timezone}
                      </strong>
                    </div>
                    <span className="text-gray-600 text-sm font-medium">
                      {activePopup.timezone === 'WIB' ? 'UTC+7 - Waktu Indonesia Barat' : 
                       activePopup.timezone === 'WITA' ? 'UTC+8 - Waktu Indonesia Tengah' : 
                       'UTC+9 - Waktu Indonesia Timur'}
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePopup(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-white/80 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                
                {/* Detailed Content */}
                <div className="p-4 text-gray-700 text-xs max-h-72">
                  {activePopup.data.timezoneData?.surveyData && (
                    <>
                      {/* Demographics */}
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          Demografi
                        </h4>
                        <div className="grid grid-cols-1 gap-1 pl-4">
                          <div className="flex justify-between">
                            <span>Rata-rata usia:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.demographics.avgAge} tahun</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Usia 23 tahun:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.demographics.age23}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Usia 25 tahun:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.demographics.age25}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* Activism */}
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Aktivisme & Politik
                        </h4>
                        <div className="grid grid-cols-1 gap-1 pl-4">
                          <div className="flex justify-between">
                            <span>Pernah aktivisme:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.activism.hasActivism}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Diskusi harian:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.activism.politicalDiscussion.veryOften}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Diskusi mingguan:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.activism.politicalDiscussion.often}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* Civic Space Understanding */}
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          Pemahaman Ruang Sipil
                        </h4>
                        <div className="grid grid-cols-1 gap-1 pl-4">
                          <div className="flex justify-between">
                            <span>Sangat paham:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.civicSpace.understanding.very}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Cukup paham:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.civicSpace.understanding.quite}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* Civic Engagement */}
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                          Keterlibatan Sipil
                        </h4>
                        <div className="grid grid-cols-1 gap-1 pl-4">
                          <div className="flex justify-between">
                            <span>Aktif bersuara:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.civicSpace.engagement.active}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Kadang terlibat:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.civicSpace.engagement.occasional}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* Concerns */}
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Kekhawatiran Keamanan
                        </h4>
                        <div className="grid grid-cols-1 gap-1 pl-4">
                          <div className="flex justify-between">
                            <span>Sangat khawatir:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.concerns.veryWorried}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Cukup khawatir:</span>
                            <strong>{activePopup.data.timezoneData.surveyData.concerns.quiteWorried}%</strong>
                          </div>
                        </div>
                      </div>
                      
                      {/* Additional Info */}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-center text-gray-500 text-xs">
                          Data dari {activePopup.data.timezoneData.surveyData.respondents} responden zona {activePopup.timezone}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

// Statistics Component - Separate section after the map
const MapStatistics = ({ mapData }: { mapData: MapData | null }) => {
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);

  if (!mapData) {
    return (
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-pink-50 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
            <p className="text-gray-500">Loading statistics...</p>
          </div>
        </div>
      </section>
    );
  }

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
          {Object.entries(mapData.timezones).map(([timezone, data]) => (
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
                    width: `${(data.totalActivities / Math.max(...Object.values(mapData.timezones).map(tz => tz.totalActivities))) * 100}%`
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

// Export component with map data
const InteractiveMapWithStats = ({ cardContent }: InteractiveMapProps = {}) => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch('/api/map-data');
        const result = await response.json();
        if (result.success) {
          setMapData(result.data);
        }
      } catch (error) {
        console.error('Error fetching map data for stats:', error);
      }
    };
    
    fetchMapData();
  }, []);
  
  return (
    <>
      <InteractiveMap cardContent={cardContent} />
      <MapStatistics mapData={mapData} />
    </>
  );
};

export default InteractiveMap;
export { MapStatistics, InteractiveMapWithStats }; 