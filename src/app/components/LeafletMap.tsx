'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Feature, Geometry } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Pie, Bar, Line, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Filler
);

// Data for provinces with activity information
const provinceData = [
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

// National data - aggregated from province data
const nationalData = {
  name: 'Indonesia',
  totalActivities: provinceData.reduce((sum, province) => sum + province.activities, 0),
  avgValue: Math.round(provinceData.reduce((sum, province) => sum + province.value, 0) / provinceData.length),
  participantsByRegion: {
    'Jawa': 48,
    'Sumatera': 22,
    'Kalimantan': 10,
    'Sulawesi': 12,
    'Bali & Nusa Tenggara': 5,
    'Maluku & Papua': 3
  },
  participantsByAge: {
    '16-20': 35,
    '21-25': 42,
    '26-30': 15,
    '31-35': 8
  },
  activityTypes: {
    'Workshop': 42,
    'Seminar': 28,
    'Dialog Publik': 15,
    'Pelatihan': 10,
    'Festival': 5
  },
  monthlyActivities: {
    'Jan': 12,
    'Feb': 15,
    'Mar': 18,
    'Apr': 22,
    'Mei': 25,
    'Jun': 30,
    'Jul': 28,
    'Agu': 32,
    'Sep': 27,
    'Okt': 24,
    'Nov': 20,
    'Des': 17
  }
};

// Function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Function to get color based on value
const getColor = (value: number) => {
  if (value >= 80) return '#d53f8c'; // Strong pink for high values
  if (value >= 60) return '#e779ba'; // Medium pink
  if (value >= 40) return '#f0a6d2'; // Light pink
  return '#f8d4e8'; // Very light pink for low values
};

interface ProvinceData {
  id: string;
  name: string;
  value: number;
  activities: number;
}

// Add interface for chart data
interface ChartData {
  name: string;
  totalActivities: number;
  avgValue: number;
  participantsByRegion: Record<string, number>;
  participantsByAge: Record<string, number>;
  activityTypes: Record<string, number>;
  monthlyActivities: Record<string, number>;
}

const LeafletMap = () => {
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);
  const [chartData, setChartData] = useState<ChartData>(nationalData);

  // Fix Leaflet icon issue in Next.js
  useEffect(() => {
    // This code should run only in the browser
    if (typeof window !== 'undefined') {
      // Import dynamically to avoid SSR issues
      import('leaflet').then((L) => {
        // Fix the icon issue without accessing private properties
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
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await response.json() as any;
        
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

  // Find province data by name
  const getProvinceData = (name: string): ProvinceData => {
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
    const province = getProvinceData(provinceName);
    
    layer.on({
      click: () => {
        setSelectedProvince(prevState => {
          const newState = prevState && prevState.name === province.name ? null : province;
          
          // If province is deselected, show national data
          if (newState === null) {
            setChartData(nationalData);
          } else {
            // Create custom chart data for the selected province
            setChartData({
              name: province.name,
              totalActivities: province.activities,
              avgValue: province.value,
              participantsByRegion: { [province.name]: 100 },
              participantsByAge: {
                '16-20': 30 + ((province.activities * 7) % 15),
                '21-25': 35 + ((province.activities * 3) % 15),
                '26-30': 10 + ((province.activities * 5) % 15),
                '31-35': 5 + ((province.activities * 2) % 10)
              },
              activityTypes: {
                'Workshop': 30 + ((province.activities * 2) % 30),
                'Seminar': 20 + ((province.activities * 3) % 20),
                'Dialog Publik': 10 + ((province.activities * 4) % 15),
                'Pelatihan': 5 + ((province.activities * 5) % 10),
                'Festival': 0 + ((province.activities * 6) % 10)
              },
              monthlyActivities: {
                'Jan': (province.activities + 1) % 12 || 1,
                'Feb': (province.activities + 2) % 15 || 1,
                'Mar': (province.activities + 3) % 18 || 1,
                'Apr': (province.activities + 4) % 22 || 1,
                'Mei': (province.activities + 5) % 25 || 1,
                'Jun': (province.activities + 6) % 30 || 1,
                'Jul': (province.activities + 7) % 28 || 1,
                'Agu': (province.activities + 8) % 32 || 1,
                'Sep': (province.activities + 9) % 27 || 1,
                'Okt': (province.activities + 10) % 24 || 1,
                'Nov': (province.activities + 11) % 20 || 1,
                'Des': (province.activities + 12) % 17 || 1
              }
            });
          }
          
          return newState;
        });
      }
    });
    
    layer.bindTooltip(`
      <div>
        <strong>${province.name}</strong><br/>
        Tingkat Aktivitas: ${province.value}%<br/>
        Jumlah Kegiatan: ${province.activities}
      </div>
    `, { sticky: true });
  };

  // Define style function with proper typing for react-leaflet
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
      fillColor: getColor(province.value),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  if (loading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
          <p className="text-gray-500">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
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
    );
  }

  return (
    <div className="relative">
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md z-[500]">
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

      <div className="h-[500px] w-full rounded-lg overflow-hidden border" style={{ background: '#FFFDE7' }}>
        {geoData && (
          <MapContainer
            center={[-2.5, 118]} // Center of Indonesia
            zoom={5}
            style={{ height: "100%", width: "100%", background: '#FFFDE7', zIndex: 10 }}
            zoomControl={true}
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
      
      {/* Selected Province Details */}
      {selectedProvince && (
        <div className="mt-6 p-4 bg-pink-50 rounded-lg mb-6">
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
              
              {/* Simple Chart Visualization */}
              <div className="mt-4">
                <h4 className="font-semibold text-pink-700 mb-2">Statistik Kegiatan</h4>
                <div className="flex gap-2 h-20 items-end">
                  <div className="flex flex-col items-center">
                    <div 
                      className="bg-pink-600 w-8 rounded-t"
                      style={{ height: `${(selectedProvince.activities / 25) * 100}%` }}
                    ></div>
                    <span className="text-xs mt-1">Kegiatan</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className="bg-pink-400 w-8 rounded-t"
                      style={{ height: `${selectedProvince.value}%` }}
                    ></div>
                    <span className="text-xs mt-1">Aktivitas</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className="bg-pink-300 w-8 rounded-t"
                      style={{ height: `${(selectedProvince.activities * 6)}%` }}
                    ></div>
                    <span className="text-xs mt-1">Peserta</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-pink-700 mb-1">Kegiatan Terbaru:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>Workshop Literasi Politik di {selectedProvince.name}</li>
                <li>Seminar Kepemimpinan Muda</li>
                <li>Dialog Publik: Peran Pemuda dalam Demokrasi</li>
              </ul>
              
              <div className="mt-4 p-3 bg-white rounded shadow-sm">
                <h4 className="font-semibold text-pink-700 mb-1">Statistik Peserta</h4>
                <div className="text-sm">
                  <p>Total peserta: <span className="font-semibold">{selectedProvince.activities * 120}</span></p>
                  <div className="mt-2 space-y-1">
                    <div>
                      <p className="text-xs">Pelajar/Mahasiswa (65%)</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs">Profesional Muda (25%)</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs">Lainnya (10%)</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Four Charts in Single Row */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 px-4">
          {selectedProvince ? `Statistik Kegiatan: ${selectedProvince.name}` : 'Statistik Kegiatan Nasional'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-pink-700 mb-3 text-sm">Distribusi Wilayah</h4>
            <div className="relative h-48">
              <Pie 
                data={{
                  labels: Object.keys(chartData.participantsByRegion),
                  datasets: [
                    {
                      data: Object.values(chartData.participantsByRegion),
                      backgroundColor: [
                        '#d53f8c', '#e779ba', '#f0a6d2', '#f8d4e8', 
                        '#9f7aea', '#667eea', '#4299e1'
                      ],
                      borderColor: '#ffffff',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 10,
                        font: {
                          size: 10
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Multiple Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-pink-700 mb-3 text-sm">Peserta Berdasarkan Usia</h4>
            <div className="relative h-48">
              <Bar 
                data={{
                  labels: Object.keys(chartData.participantsByAge),
                  datasets: [
                    {
                      label: 'Perempuan',
                      data: Object.values(chartData.participantsByAge),
                      backgroundColor: hexToRgba('#d53f8c', 0.8),
                      borderColor: '#d53f8c',
                      borderWidth: 1,
                      barPercentage: 0.6,
                    },
                    {
                      label: 'Laki-laki',
                      // Generate consistent secondary data based on the primary data
                      data: Object.values(chartData.participantsByAge).map(
                        (value, index) => value * (0.5 + (index % 3) * 0.1)
                      ),
                      backgroundColor: hexToRgba('#9f7aea', 0.7),
                      borderColor: '#9f7aea',
                      borderWidth: 1,
                      barPercentage: 0.6,
                    }
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 10
                        }
                      },
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        boxWidth: 10,
                        font: {
                          size: 10
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Line Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-pink-700 mb-3 text-sm">Aktivitas Bulanan</h4>
            <div className="relative h-48">
              <Line 
                data={{
                  labels: Object.keys(chartData.monthlyActivities),
                  datasets: [
                    {
                      label: 'Aktivitas',
                      data: Object.values(chartData.monthlyActivities),
                      borderColor: '#d53f8c',
                      backgroundColor: hexToRgba('#d53f8c', 0.1),
                      tension: 0.3,
                      fill: true,
                      pointBackgroundColor: '#ffffff',
                      pointBorderColor: '#d53f8c',
                      pointRadius: 3,
                      pointHoverRadius: 5,
                    }
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        font: {
                          size: 10
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          size: 9
                        },
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
          
          {/* Radar Chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-semibold text-pink-700 mb-3 text-sm">Jenis Kegiatan</h4>
            <div className="relative h-48">
              <Radar 
                data={{
                  labels: Object.keys(chartData.activityTypes),
                  datasets: [
                    {
                      label: 'Jenis Kegiatan',
                      data: Object.values(chartData.activityTypes),
                      backgroundColor: hexToRgba('#d53f8c', 0.2),
                      borderColor: '#d53f8c',
                      borderWidth: 2,
                      pointBackgroundColor: '#ffffff',
                      pointBorderColor: '#d53f8c',
                      pointRadius: 3,
                    }
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      angleLines: {
                        color: '#e2e8f0'
                      },
                      grid: {
                        color: '#e2e8f0'
                      },
                      pointLabels: {
                        font: {
                          size: 9
                        }
                      },
                      ticks: {
                        font: {
                          size: 8
                        },
                        backdropColor: 'transparent'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeafletMap; 