'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
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
import { Pie, Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import AnimatedCounter from '@/components/ui/animated-counter';
// Remove static import since we'll use API data

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

// Types for the data structure
interface DataItem {
  Variable: string;
  Question_Label: string | null;
  Category: string | null;
  Frequency: number | string | null;
  Percentage: number | string | null;
}

interface FilterOptions {
  age: string[];
  gender: string[];
  region: string[];
  activism: string[];
  politicalExposure: string[];
}

// Dynamic import for client-side only components
const ReportInteractiveMap = dynamic(() => import('../components/ReportInteractiveMap'), {
  ssr: false,
  loading: () => (
    <section className="relative w-full h-screen overflow-hidden bg-gray-50">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
          <p className="text-gray-500">Loading interactive map...</p>
        </div>
      </div>
    </section>
  )
});

// Available filter options - will be populated from API
const getDefaultFilterOptions = (): FilterOptions => ({
  age: [],
  gender: [],
  region: [],
  activism: [],
  politicalExposure: []
});

// Filter component
const FilterPanel = ({ filters, setFilters, data, filterOptions }: { 
  filters: any, 
  setFilters: (filters: any) => void,
  data: any,
  filterOptions: FilterOptions
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setFilters((prev: any) => ({
      ...prev,
      [category]: checked 
        ? [...prev[category], value]
        : prev[category].filter((item: string) => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      age: [],
      gender: [],
      region: [],
      activism: [],
      politicalExposure: []
    });
  };

  const activeFiltersCount = Object.values(filters).flat().length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Filter Data</h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#f0f8ff', color: '#59caf5' }}>
                {activeFiltersCount} aktif
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Hapus Semua
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: '#59caf5' }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#48b9e4'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#59caf5'}
            >
              {isOpen ? 'Tutup' : 'Buka'} Filter
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(filterOptions).map(([category, options]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-gray-900 capitalize">
                  {category === 'age' && 'Usia'}
                  {category === 'gender' && 'Gender'}
                  {category === 'region' && 'Wilayah'}
                  {category === 'activism' && 'Aktivisme'}
                  {category === 'politicalExposure' && 'Keterpaparan Politik'}
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {options.map((option: string) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters[category].includes(option)}
                        onChange={(e) => handleFilterChange(category, option, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {option === 'West' && 'Indonesia Barat'}
                        {option === 'East' && 'Indonesia Timur'}
                        {option === 'Central' && 'Indonesia Tengah'}
                        {option === 'Overseas' && 'Luar Negeri'}
                        {!['West', 'East', 'Central', 'Overseas'].includes(option) && option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Fetch data from API with filters
const fetchResearchData = async (filters: any) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, values]: [string, any]) => {
      if (Array.isArray(values) && values.length > 0) {
        queryParams.set(key, values.join(','));
      }
    });
    
    const response = await fetch(`/api/ruang-sipil?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching research data:', error);
    return null;
  }
};

// Helper function to convert percentage to actual number
const getActualNumber = (percentage: string, total: number): number => {
  const cleanPercentage = parseFloat(percentage.replace(',', '.'));
  return Math.round((cleanPercentage / 100) * total);
};

// Key insights component with enhanced findings
const TemuanUtama = ({ data, filters, setFilters, filterOptions }: { 
  data: any, 
  filters: any, 
  setFilters: (filters: any) => void, 
  filterOptions: FilterOptions 
}) => {
  const findings = [
    {
      title: "Aktivisme Pemuda Cukup Aktif",
      subtitle: "Lebih dari setengah pemuda memiliki pengalaman aktivisme",
      value: getActualNumber(data.activismExperience?.find((item: any) => item.Category === 'Pernah')?.Percentage || '56,6', data.totalRespondents || 505),
      description: "pemuda pernah terlibat dalam aktivitas organisasi masyarakat sipil",
      insight: "Potensi besar untuk pengembangan kapasitas kepemimpinan dan partisipasi politik yang lebih luas.",
      icon: "✊",
      color: "#59caf5", // secondary
      details: data.activismExperience?.slice(0, 2) || []
    },
    {
      title: "Kesadaran Ruang Sipil Bervariasi",
      subtitle: "Tingkat kesadaran tentang ruang sipil beragam di kalangan pemuda",
      value: getActualNumber(data.civicSpaceHeard?.find((item: any) => item.Category === 'Pernah mendengar')?.Percentage || '45,2', data.totalRespondents || 505),
      description: "pernah mendengar istilah ruang sipil",
      insight: "Menunjukkan perlunya edukasi lebih intensif tentang konsep ruang sipil dan keterlibatan dalam isu publik.",
      icon: "📚",
      color: "#f06d98", // accent
      details: data.civicSpaceHeard?.slice(0, 3) || []
    },
    {
      title: "Dominasi Media Sosial dalam Politik",
      subtitle: "Platform media sosial menjadi sumber utama informasi politik",
      value: getActualNumber(data.polexpIg?.find((item: any) => item.Category === 'Yes')?.Percentage || '65,2', data.totalRespondents || 505),
      description: "terpapar politik di Instagram",
      insight: "Instagram mendominasi keterpaparan politik pemuda, diikuti TikTok dan YouTube, menunjukkan pentingnya strategi digital dalam engagement politik.",
      icon: "📱",
      color: "#7bb342", // success
      details: [
        { Category: 'Instagram', Percentage: data.polexpIg?.find((item: any) => item.Category === 'Yes')?.Percentage || '65', N: data.polexpIgN },
        { Category: 'TikTok', Percentage: data.polexpTiktok?.find((item: any) => item.Category === 'Yes')?.Percentage || '58', N: data.polexpTiktokN },
        { Category: 'YouTube', Percentage: data.polexpYt?.find((item: any) => item.Category === 'Yes')?.Percentage || '52', N: data.polexpYtN }
      ]
    },
    {
      title: "Komitmen Menyuarakan Isu",
      subtitle: "Tingkat partisipasi pemuda dalam menyuarakan isu politik",
      value: getActualNumber(data.issueCommitedVoicing?.find((item: any) => item.Category?.includes('terlibat'))?.Percentage || '32,5', data.totalRespondents || 505),
      description: "aktif menyuarakan pandangan politik",
      insight: "Media sosial dapat dioptimalkan sebagai sarana edukasi politik dan mobilisasi partisipasi.",
      icon: "📢",
      color: "#48b9e4", // secondary-dark
      details: data.issueCommitedVoicing?.slice(0, 4) || []
    },
    {
      title: "Persepsi Elit Politik",
      subtitle: "Pandangan pemuda terhadap elit politik nasional",
      value: getActualNumber(data.elitPercepNational?.find((item: any) => item.Category?.includes('Tidak baik'))?.Percentage || '35,4', data.totalRespondents || 505),
      description: "menilai elit politik tidak baik",
      insight: "Persepsi negatif terhadap elit politik menunjukkan perlunya reformasi dan transparansi.",
      icon: "🏛️",
      color: "#ffcb57", // primary
      details: data.elitPercepNational?.slice(0, 4) || []
    },
    {
      title: "Keterpaparan Politik",
      subtitle: "Tingkat keterpaparan pemuda terhadap informasi politik",
      value: getActualNumber(data.politicalExposure?.find((item: any) => item.Category?.includes('Sering'))?.Percentage || '35,2', data.totalRespondents || 505),
      description: "sering terpapar informasi politik",
      insight: "Tingkat keterpaparan politik yang beragam menunjukkan perlunya diversifikasi saluran informasi.",
      icon: "📺",
      color: "#e05c87", // accent-dark
      details: data.politicalExposure?.slice(0, 3) || []
    }
  ];

  return (
    <section className="py-10 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#f0f8ff', color: '#59caf5' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#59caf5' }}></span>
            Hasil Riset Komprehensif
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Temuan Utama
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Enam insight kunci dari survei keterlibatan {data.totalRespondents} pemuda Indonesia 
            dalam ruang sipil dan partisipasi politik
          </p>
        </motion.div>

        {/* Filter Section */}
        <div className="mb-16">
          <FilterPanel filters={filters} setFilters={setFilters} data={data} filterOptions={filterOptions} />
        </div>

        {/* Main Findings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {findings.map((finding, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full">
                {/* Header */}
                <div 
                  className="px-8 py-6 text-white relative overflow-hidden"
                  style={{ backgroundColor: finding.color }}
                >
                  <div className="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12">
                    {finding.icon}
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl lg:text-4xl font-bold mb-2 text-white">
                      <AnimatedCounter 
                        end={typeof finding.value === 'number' ? finding.value : parseInt(finding.value.replace('%', '')) || 0} 
                        duration={2.5}
                        className="text-white"
                      />
                    </div>
                    <div className="text-sm opacity-90 text-white">
                      {finding.description}
                    </div>
                    <div className="text-xs opacity-80 text-white mt-1">
                      N = {finding.details.length > 0 ? finding.details[0].N : data.totalRespondents}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {finding.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {finding.subtitle}
                  </p>
                  
                  {/* Data breakdown */}
                  <div className="space-y-3 mb-6">
                    {finding.details.length > 0 ? finding.details.map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="flex items-center justify-between">
                        <span className="text-gray-700 text-sm flex-1 pr-4">
                          {item.Category}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full transition-all duration-700"
                              style={{ 
                                backgroundColor: finding.color,
                                width: `${Math.min(parseFloat(item.Percentage?.toString().replace(',', '.') || '0'), 100)}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-10 text-right">
                            {item.Percentage}%
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-gray-500 text-sm italic">Data sedang dimuat...</div>
                    )}
                  </div>

                  {/* Insight */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 mt-0.5 flex-shrink-0">
                        💡
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {finding.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

// Research Data Charts Component
const ResearchDataCharts = () => {
  const [researchData, setResearchData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('leadership');

  useEffect(() => {
    const loadResearchData = async () => {
      try {
        const response = await fetch('/data/research.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResearchData(data);
      } catch (error) {
        console.error('Error loading research data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadResearchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
          <p className="text-gray-500">Memuat data penelitian...</p>
        </div>
      </div>
    );
  }

  // Group data by categories and sort by percentage descending
  const leadershipData = researchData
    .filter(item => item.DATA === "Perceived Leadership Characteristics Affecting Civic Space")
    .sort((a, b) => parseFloat(b.Percentage.toString()) - parseFloat(a.Percentage.toString()));
  const safeSpaceData = researchData
    .filter(item => item.DATA === "Key Factors for a Safe and Youth-Friendly Civic Space")
    .sort((a, b) => parseFloat(b.Percentage.toString()) - parseFloat(a.Percentage.toString()));
  const challengesData = researchData
    .filter(item => item.DATA === "Challenges for Youth in Accessing Civic Space")
    .sort((a, b) => parseFloat(b.Percentage.toString()) - parseFloat(a.Percentage.toString()));

  const chartConfigs = {
    leadership: {
      title: "Persepsi Karakteristik Kepemimpinan yang Mempengaruhi Ruang Sipil",
      description: "Karakteristik kepemimpinan yang dipersepsikan oleh pemuda mempengaruhi ruang sipil",
      data: {
        labels: leadershipData.map(item => item.JUDUL.length > 45 ? item.JUDUL.substring(0, 45) + '...' : item.JUDUL),
        datasets: [{
          label: 'Persentase Responden',
          data: leadershipData.map(item => item.Percentage),
          backgroundColor: ['#f06d98', '#59caf5', '#ffcb57', '#7bb342', '#e05c87', '#48b9e4', '#f97316', '#8b5cf6'],
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      type: 'horizontalBar'
    },
    safeSpace: {
      title: "Faktor Kunci untuk Ruang Sipil yang Aman dan Ramah Pemuda",
      description: "Faktor-faktor yang dianggap penting untuk menciptakan ruang sipil yang aman bagi pemuda",
      data: {
        labels: safeSpaceData.map(item => item.JUDUL.length > 45 ? item.JUDUL.substring(0, 45) + '...' : item.JUDUL),
        datasets: [{
          label: 'Persentase Responden',
          data: safeSpaceData.map(item => item.Percentage),
          backgroundColor: ['#7bb342', '#59caf5', '#f06d98', '#ffcb57', '#e05c87', '#48b9e4'],
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      type: 'horizontalBar'
    },
    challenges: {
      title: "Tantangan Pemuda dalam Mengakses Ruang Sipil",
      description: "Hambatan utama yang dihadapi pemuda dalam berpartisipasi di ruang sipil",
      data: {
        labels: challengesData.map(item => item.JUDUL.length > 45 ? item.JUDUL.substring(0, 45) + '...' : item.JUDUL),
        datasets: [{
          label: 'Persentase Responden',
          data: challengesData.map(item => item.Percentage),
          backgroundColor: ['#e05c87', '#f06d98', '#59caf5', '#ffcb57', '#7bb342', '#48b9e4', '#f97316'],
          borderRadius: 8,
          borderWidth: 0
        }]
      },
      type: 'horizontalBar'
    }
  };

  const getChartOptions = (type: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: type === 'horizontalBar' ? 'y' as const : 'x' as const,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = type === 'horizontalBar' ? context.parsed.x : context.parsed.y;
            return `${context.label}: ${Number(value).toFixed(1)}%`;
          },
          afterLabel: function(context: any) {
            const dataItem = researchData.find(item => 
              item.JUDUL.startsWith(context.label) || 
              context.label.startsWith(item.JUDUL.substring(0, 40))
            );
            return dataItem ? `N = ${dataItem.Count}` : '';
          }
        }
      }
    },
    scales: {
      ...(type === 'horizontalBar' ? {
        x: {
          beginAtZero: true,
          max: 80,
          ticks: {
            callback: function(value: any) {
              return Number(value).toFixed(0) + '%';
            },
            color: '#6b7280'
          },
          grid: {
            color: '#f3f4f6'
          }
        },
        y: {
          ticks: {
            color: '#6b7280',
            font: {
              size: 11
            }
          },
          grid: {
            display: false
          }
        }
      } : {
        y: {
          beginAtZero: true,
          max: 80,
          ticks: {
            callback: function(value: any) {
              return Number(value).toFixed(0) + '%';
            },
            color: '#6b7280'
          },
          grid: {
            color: '#f3f4f6'
          }
        },
        x: {
          ticks: {
            color: '#6b7280',
            maxRotation: 45,
            font: {
              size: 10
            }
          },
          grid: {
            display: false
          }
        }
      })
    }
  });

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#f0f8ff', color: '#59caf5' }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#59caf5' }}></span>
            Analisis Mendalam Ruang Sipil
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Persepsi Orang Muda Terhadap Ruang Sipil Indonesia Saat Ini
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analisis komprehensif mengenai persepsi, tantangan, dan faktor kunci ruang sipil bagi pemuda
          </p>
        </motion.div>

        {/* Chart selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(chartConfigs).map(([key, config]) => {
            const buttonLabels = {
              leadership: 'Karakteristik Kepemimpinan',
              safeSpace: 'Faktor Ruang Aman',
              challenges: 'Tantangan Akses'
            };
            
            return (
              <button
                key={key}
                onClick={() => setActiveChart(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeChart === key
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={activeChart === key ? { backgroundColor: '#59caf5' } : {}}
              >
                {buttonLabels[key as keyof typeof buttonLabels]}
              </button>
            );
          })}
        </div>

        {/* Active chart */}
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {chartConfigs[activeChart as keyof typeof chartConfigs].title}
            </h3>
            <p className="text-gray-600 text-sm">
              {chartConfigs[activeChart as keyof typeof chartConfigs].description}
            </p>
          </div>
          <div className="h-96">
            <Bar 
              data={chartConfigs[activeChart as keyof typeof chartConfigs].data} 
              options={getChartOptions(chartConfigs[activeChart as keyof typeof chartConfigs].type)} 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Interactive visualization component for Government Responsiveness
const InteractiveCharts = ({ data }: { data: any }) => {
  const [activeChart, setActiveChart] = useState('socialIssues');

  // Government responsiveness categories
  const chartConfigs = {
    socialIssues: {
      title: `Responsivitas Pemerintah - Isu Sosial (Skala 0-10)`,
      description: "Penilaian pemuda terhadap responsivitas pemerintah dalam menangani isu-isu sosial utama",
      type: 'bar',
      data: (() => {
        const socialIssuesData = [
          { label: 'HAM', value: Number(data.govResponseStats?.humanrights || 0), color: '#f06d98' },
          { label: 'Kemiskinan', value: Number(data.govResponseStats?.poverty || 0), color: '#59caf5' },
          { label: 'Kesehatan', value: Number(data.govResponseStats?.health || 0), color: '#ffcb57' },
          { label: 'Pendidikan', value: Number(data.govResponseStats?.education || 0), color: '#7bb342' },
          { label: 'Populasi Rentan', value: Number(data.govResponseStats?.vulnerablepop || 0), color: '#e05c87' }
        ].sort((a, b) => b.value - a.value);
        
        return {
          labels: socialIssuesData.map(item => item.label),
          datasets: [{
            label: 'Skor Responsivitas',
            data: socialIssuesData.map(item => item.value),
            backgroundColor: socialIssuesData.map(item => item.color),
            borderRadius: 8,
            borderWidth: 0
          }]
        };
      })()
    },
    economicEnvironment: {
      title: `Responsivitas Pemerintah - Ekonomi & Lingkungan (Skala 0-10)`,
      description: "Penilaian pemuda terhadap responsivitas pemerintah dalam menangani isu ekonomi dan lingkungan",
      type: 'bar',
      data: (() => {
        const economicEnvironmentData = [
          { label: 'Lingkungan', value: Number(data.govResponseStats?.environment || 0), color: '#7bb342' },
          { label: 'Ketimpangan', value: Number(data.govResponseStats?.inequality || 0), color: '#ffcb57' },
          { label: 'Peluang Ekonomi', value: Number(data.govResponseStats?.economicopp || 0), color: '#59caf5' },
          { label: 'Sumber Pangan', value: Number(data.govResponseStats?.foodresource || 0), color: '#f06d98' }
        ].sort((a, b) => b.value - a.value);
        
        return {
          labels: economicEnvironmentData.map(item => item.label),
          datasets: [{
            label: 'Skor Responsivitas',
            data: economicEnvironmentData.map(item => item.value),
            backgroundColor: economicEnvironmentData.map(item => item.color),
            borderRadius: 8,
            borderWidth: 0
          }]
        };
      })()
    },
    overallComparison: {
      title: `Perbandingan Seluruh Responsivitas Pemerintah (Skala 0-10)`,
      description: "Rangking responsivitas pemerintah di berbagai bidang menurut persepsi pemuda",
      type: 'horizontalBar',
      data: (() => {
        const overallData = [
          { label: 'HAM', value: Number(data.govResponseStats?.humanrights || 0), color: '#f06d98' },
          { label: 'Lingkungan', value: Number(data.govResponseStats?.environment || 0), color: '#7bb342' },
          { label: 'Kemiskinan', value: Number(data.govResponseStats?.poverty || 0), color: '#59caf5' },
          { label: 'Pendidikan', value: Number(data.govResponseStats?.education || 0), color: '#ffcb57' },
          { label: 'Kesehatan', value: Number(data.govResponseStats?.health || 0), color: '#e05c87' },
          { label: 'Sumber Pangan', value: Number(data.govResponseStats?.foodresource || 0), color: '#48b9e4' },
          { label: 'Pop. Rentan', value: Number(data.govResponseStats?.vulnerablepop || 0), color: '#f97316' },
          { label: 'Ketimpangan', value: Number(data.govResponseStats?.inequality || 0), color: '#8b5cf6' },
          { label: 'Peluang Ekonomi', value: Number(data.govResponseStats?.economicopp || 0), color: '#06b6d4' }
        ].sort((a, b) => b.value - a.value);
        
        return {
          labels: overallData.map(item => item.label),
          datasets: [{
            label: 'Skor Responsivitas',
            data: overallData.map(item => item.value),
            backgroundColor: overallData.map(item => item.color),
            borderRadius: 8,
            borderWidth: 0
          }]
        };
      })()
    }
  };

  const getChartOptions = (type: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: type === 'horizontalBar' ? 'y' as const : 'x' as const,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = type === 'horizontalBar' ? context.parsed.x : context.parsed.y;
            return `${context.label}: ${Number(value).toFixed(1)}/10`;
          },
          afterLabel: function(context: any) {
            return `N = ${data.totalRespondents || 'Loading...'}`;
          }
        }
      }
    },
    scales: {
      ...(type === 'horizontalBar' ? {
        x: {
          beginAtZero: true,
          max: 10,
          min: 0,
          ticks: {
            stepSize: 1,
            color: '#6b7280',
            callback: function(value: any) {
              return Number(value).toFixed(0);
            }
          },
          grid: {
            color: '#f3f4f6'
          }
        },
        y: {
          ticks: {
            color: '#6b7280'
          },
          grid: {
            display: false
          }
        }
      } : {
        y: {
          beginAtZero: true,
          max: 10,
          min: 0,
          ticks: {
            stepSize: 1,
            color: '#6b7280',
            callback: function(value: any) {
              return Number(value).toFixed(0);
            }
          },
          grid: {
            color: '#f3f4f6'
          }
        },
        x: {
          ticks: {
            color: '#6b7280',
            maxRotation: 45
          },
          grid: {
            display: false
          }
        }
      })
    }
  });

  return (
    <section className="py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Responsivitas Pemerintah
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Penilaian pemuda terhadap responsivitas pemerintah dalam berbagai isu (skala 0-10)
          </p>
        </motion.div>

        {/* Chart selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(chartConfigs).map(([key, config]) => {
            const buttonLabels = {
              socialIssues: 'Isu Sosial',
              economicEnvironment: 'Ekonomi & Lingkungan', 
              overallComparison: 'Perbandingan Semua'
            };
            
            return (
              <button
                key={key}
                onClick={() => setActiveChart(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeChart === key
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={activeChart === key ? { backgroundColor: '#59caf5' } : {}}
              >
                {buttonLabels[key as keyof typeof buttonLabels]}
              </button>
            );
          })}
        </div>

        {/* Active chart */}
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {chartConfigs[activeChart as keyof typeof chartConfigs].title}
            </h3>
            <p className="text-gray-600 text-sm">
              {chartConfigs[activeChart as keyof typeof chartConfigs].description}
            </p>
          </div>
          <div className="h-96">
            <Bar 
              data={chartConfigs[activeChart as keyof typeof chartConfigs].data} 
              options={getChartOptions(chartConfigs[activeChart as keyof typeof chartConfigs].type)} 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Main component
const ReportPage = () => {
  const [data, setData] = useState<any>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(getDefaultFilterOptions());
  const [filters, setFilters] = useState({
    age: [],
    gender: [],
    region: [],
    activism: [],
    politicalExposure: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchResearchData(filters);
      if (result) {
        setData(result);
        setFilterOptions(result.filterOptions || getDefaultFilterOptions());
      }
      setLoading(false);
    };
    
    loadData();
  }, [filters]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
          <p className="text-gray-500">Memuat data penelitian...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-32 text-white relative overflow-hidden" style={{ backgroundColor: '#59caf5' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-6 text-4xl font-bold md:text-6xl !text-white leading-tight" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              Ruang Sipil &<br />Partisipasi Pemuda
            </h1>
            <p className="text-xl !text-white mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Memahami navigasi pemuda Indonesia dalam ruang sipil yang dinamis dan 
              tantangan partisipasi politik kontemporer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">
                  <AnimatedCounter 
                    end={data.totalRespondents || 505} 
                    duration={3}
                    className="text-white"
                  />
                </div>
                <div className="text-sm opacity-80 !text-white">Responden</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold">
                  <AnimatedCounter 
                    end={30} 
                    duration={2}
                    className="text-white"
                  />
                </div>
                <div className="text-sm opacity-80 !text-white">Variabel</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg">
                <div className="text-2xl font-bold !text-white">18-25</div>
                <div className="text-sm opacity-80 !text-white">Usia Tahun</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Data Charts */}
      <ResearchDataCharts />

      {/* Main Findings - Temuan Utama */}
      <TemuanUtama data={data} filters={filters} setFilters={setFilters} filterOptions={filterOptions} />

      {/* Interactive Charts */}
      <InteractiveCharts data={data} />

      {/* Interactive Map */}
      <ReportInteractiveMap />

      {/* Call to Action */}
      <section className="py-20 lg:py-24 text-white" style={{ backgroundColor: '#59caf5' }}>
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 !text-white">
              Ambil Bagian dalam Perubahan
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed text-white">
              Temuan ini menunjukkan potensi besar pemuda Indonesia. 
              Mari bersama membangun ruang sipil yang lebih inklusif dan demokratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center ">
              <Link
                href="https://partisipasimuda.org/en/publications/understanding-youth-engagement-and-civic-space-in-indonesia"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-dark hover:bg-[#e5b64e] text-[#4c3c1a] hover:text-[#4c3c1a] px-8 py-3 rounded-full font-bold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 h-12 flex items-center justify-center text-sm"
                style={{ backgroundColor: '#ffcb57' }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = '#e5b64e';
                  (e.target as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLAnchorElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.backgroundColor = '#ffcb57';
                  (e.target as HTMLAnchorElement).style.transform = 'translateY(0px)';
                  (e.target as HTMLAnchorElement).style.boxShadow = 'none';
                }}
              >
                Unduh Laporan Lengkap
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ReportPage;
