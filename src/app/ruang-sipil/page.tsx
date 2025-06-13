'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
import overallData from '../../data/overall.json';

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

// Process survey data for comprehensive analytics
const processComprehensiveData = () => {
  // Age distribution
  const ageData = overallData.filter(item => item.Variable === 'age' && typeof item.Category === 'number');
  
  // Gender distribution
  const genderData = overallData.filter(item => item.Variable === 'gender');
  
  // Education levels
  const educationData = overallData.filter(item => item.Variable === 'education_level');
  
  // Regional distribution
  const regionData = overallData.filter(item => item.Variable === 'region_live');
  
  // Activism experience
  const activismData = overallData.filter(item => item.Variable === 'activism');
  
  // Political discussion frequency
  const discussionData = overallData.filter(item => item.Variable === 'polexsp_peers_intensity');
  
  // Civic space understanding
  const civicSpaceData = overallData.filter(item => item.Variable === 'civspace_understanding');
  
  // Engagement concerns
  const concernData = overallData.filter(item => item.Variable === 'concern_engagement');
  
  // Issue commitment
  const issueData = overallData.filter(item => item.Variable === 'issue_commited_voicing');
  
  return {
    totalRespondents: 505,
    ageDistribution: ageData.map(item => ({
      age: item.Category,
      count: item.Frequency,
      percentage: parseFloat(item.Percentage.toString().replace(',', '.'))
    })),
    genderDistribution: genderData.filter(item => ['Laki-laki', 'Perempuan'].includes(item.Category as string)),
    educationLevels: educationData.filter(item => typeof item.Frequency === 'number' && item.Frequency > 0),
    regionalData: regionData.filter(item => item.Category !== 'NA'),
    activismExperience: activismData.filter(item => item.Category !== 'NA'),
    discussionFrequency: discussionData.filter(item => typeof item.Frequency === 'number' && item.Frequency > 0),
    civicSpaceUnderstanding: civicSpaceData.filter(item => typeof item.Frequency === 'number' && item.Frequency > 0),
    engagementConcerns: concernData.filter(item => typeof item.Frequency === 'number' && item.Frequency > 0),
    issueCommitment: issueData.filter(item => typeof item.Frequency === 'number' && item.Frequency > 0)
  };
};

// Simplified key metrics component
const KeyMetrics = ({ data }: { data: any }) => {
  const metrics = [
    {
      value: data.totalRespondents.toLocaleString(),
      label: 'Total Responden',
      sublabel: 'Pemuda Indonesia 18-25 tahun'
    },
    {
      value: `${data.activismExperience.find((item: any) => item.Category === 'Pernah')?.Percentage || '0'}%`,
      label: 'Pernah Aktivisme',
      sublabel: 'Memiliki pengalaman aktivisme'
    },
    {
      value: `${data.civicSpaceUnderstanding.find((item: any) => item.Category === 'Sangat paham')?.Percentage || '0'}%`,
      label: 'Sangat Paham Ruang Sipil',
      sublabel: 'Memahami konsep ruang sipil'
    },
    {
      value: `${data.regionalData.find((item: any) => item.Category === 'West')?.Percentage || '0'}%`,
      label: 'Wilayah Barat',
      sublabel: 'Responden dari Indonesia Barat'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="text-center"
        >
          <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            {metric.value}
          </div>
          <div className="text-lg font-semibold text-gray-700 mb-1">
            {metric.label}
          </div>
          <div className="text-sm text-gray-500">
            {metric.sublabel}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Streamlined chart section
const ChartSection = ({ data }: { data: any }) => {
  // Theme colors
  const themeColors = {
    primary: '#ffcb57',    // Yellow
    secondary: '#59caf5',  // Blue
    accent: '#f06d98',     // Pink
    success: '#7bb342'     // Green
  };

  // Age distribution chart
  const ageChartData = {
    labels: data.ageDistribution.map((item: any) => `${item.age}`),
    datasets: [{
      label: 'Responden',
      data: data.ageDistribution.map((item: any) => item.count),
      backgroundColor: 'rgba(255, 203, 87, 0.2)',
      borderColor: themeColors.primary,
      borderWidth: 3,
      fill: true
    }]
  };

  // Gender distribution chart
  const genderChartData = {
    labels: data.genderDistribution.map((item: any) => item.Category),
    datasets: [{
      data: data.genderDistribution.map((item: any) => item.Frequency),
      backgroundColor: [themeColors.accent, themeColors.secondary],
      borderWidth: 0
    }]
  };

  // Regional distribution chart - map colors based on region names
  const getRegionalColors = () => {
    return data.regionalData.map((item: any) => {
      switch(item.Category) {
        case 'West': return themeColors.primary;    // West = Primary Yellow (main)
        case 'Central': return themeColors.secondary; // Central = Secondary Blue
        case 'East': return themeColors.accent;       // East = Accent Pink
        case 'Overseas': return themeColors.success;  // Overseas = Success Green
        default: return '#e5e7eb'; // Default gray for any other categories
      }
    });
  };

  const regionalChartData = {
    labels: data.regionalData.map((item: any) => item.Category),
    datasets: [{
      data: data.regionalData.map((item: any) => item.Frequency),
      backgroundColor: getRegionalColors(),
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        border: {
          display: false
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <div className="space-y-20">
      {/* Age Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Distribusi Usia</h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Sebaran usia responden menunjukkan representasi yang merata di kelompok pemuda Indonesia
        </p>
        <div className="h-80 max-w-4xl mx-auto">
          <Bar data={ageChartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Gender & Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Distribusi Gender</h3>
          <p className="text-gray-600 mb-8">
            Keseimbangan representasi gender dalam survei
          </p>
          <div className="h-64">
            <Doughnut data={genderChartData} options={pieOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Distribusi Regional</h3>
          <p className="text-gray-600 mb-8">
            Sebaran geografis responden di seluruh Indonesia
          </p>
          <div className="h-64">
            <Pie data={regionalChartData} options={pieOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Simplified statistics section
const StatisticsOverview = ({ data }: { data: any }) => {
  // Theme colors for different categories
  const categoryColors = {
    activism: '#f06d98',    // Accent - Pink
    civic: '#59caf5',       // Secondary - Blue  
    discussion: '#7bb342'   // Success - Green
  };

  const stats = [
    {
      category: 'Pengalaman Aktivisme',
      items: data.activismExperience.slice(0, 3),
      color: categoryColors.activism
    },
    {
      category: 'Pemahaman Ruang Sipil',
      items: data.civicSpaceUnderstanding.slice(0, 3),
      color: categoryColors.civic
    },
    {
      category: 'Frekuensi Diskusi Politik',
      items: data.discussionFrequency.slice(0, 3),
      color: categoryColors.discussion
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Temuan Utama</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Insight penting dari survei keterlibatan pemuda dalam ruang sipil dan partisipasi politik
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow duration-300"
            style={{ borderLeftColor: stat.color }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-800">
                {stat.category}
              </h4>
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: stat.color }}
              ></div>
            </div>
            <div className="space-y-4">
              {stat.items.map((item: any, itemIndex: number) => (
                <div key={itemIndex} className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm flex-1 pr-4">
                    {item.Category}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ 
                          backgroundColor: stat.color,
                          width: `${Math.min(parseFloat(item.Percentage.toString().replace(',', '.')), 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {item.Percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ReportPage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const processedData = processComprehensiveData();
    setData(processedData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
          <p className="text-gray-500">Loading data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-32 text-white" style={{ backgroundColor: '#59caf5' }}>
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-4 text-4xl font-bold md:text-5xl !text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              Ruang Sipil
            </h1>
            <p className="text-lg !text-white">
              Analisis komprehensif keterlibatan pemuda dalam ruang sipil dan partisipasi politik
            </p>
           
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <KeyMetrics data={data} />
        </div>
      </section>

      {/* Interactive Map */}
      <ReportInteractiveMap />

      {/* Charts Section */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Profil Responden
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Karakteristik demografis dan geografis responden survei
            </p>
          </motion.div>
          <ChartSection data={data} />
        </div>
      </section>

      {/* Statistics Overview */}
      <section className="py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-6">
          <StatisticsOverview data={data} />
        </div>
      </section>

      {/* Publication Section */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Laporan Lengkap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unduh laporan komprehensif untuk analisis mendalam
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="relative h-64 lg:h-80 w-full mb-8 rounded-2xl overflow-hidden">
              <Image 
                src="/images/bg/creative-christians-HN6uXG7GzTE-unsplash.jpg"
                alt="Understanding Youth Engagement and Civic Space in Indonesia" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm font-medium mb-2">Mei 2025</p>
                <h3 className="text-2xl lg:text-3xl font-bold">
                  Understanding Youth Engagement and Civic Space in Indonesia
                </h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
              Penelitian mendalam tentang navigasi pemuda Indonesia dalam ruang sipil yang menyempit, 
              termasuk persepsi mereka tentang ruang publik yang aman dan ramah pemuda.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
                Unduh Laporan Lengkap
              </button>
              <button className="border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-semibold px-8 py-4 rounded-xl transition-colors">
                Lihat Metodologi
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Info */}
      
    </>
  );
};

export default ReportPage;
