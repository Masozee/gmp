'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Dummy data for charts
const generateDummyData = (provinceName: string | null = null) => {
  // Default data (sum of all provinces)
  const defaultData = {
    participantsByAge: {
      labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
      datasets: [
        {
          label: 'Participants by Age Group',
          data: [1200, 850, 600, 450, 300],
          backgroundColor: '#db2777',
        },
      ],
    },
    eventsByType: {
      labels: ['Workshops', 'Seminars', 'Discussions', 'Training', 'Campaigns'],
      datasets: [
        {
          label: 'Events by Type',
          data: [45, 30, 60, 25, 40],
          backgroundColor: [
            '#db2777',
            '#ec4899',
            '#f472b6',
            '#f9a8d4',
            '#fbcfe8',
          ],
        },
      ],
    },
    participationTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Monthly Participation',
          data: [250, 300, 280, 320, 350, 400, 420, 450, 500, 550, 600, 650],
          borderColor: '#db2777',
          backgroundColor: 'rgba(219, 39, 119, 0.2)',
          tension: 0.3,
        },
      ],
    },
    genderDistribution: {
      labels: ['Male', 'Female', 'Other'],
      datasets: [
        {
          label: 'Gender Distribution',
          data: [45, 52, 3],
          backgroundColor: [
            '#0ea5e9',
            '#db2777',
            '#a855f7',
          ],
        },
      ],
    },
  };

  // If no province is selected, return default data
  if (!provinceName) {
    return defaultData;
  }

  // Generate province-specific data based on province name
  // This is dummy data that varies by province name length as a simple way to create variation
  const nameLength = provinceName.length;
  const multiplier = (nameLength % 5) + 0.7; // Between 0.7 and 4.7

  return {
    participantsByAge: {
      labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
      datasets: [
        {
          label: `${provinceName}: Participants by Age Group`,
          data: [
            Math.round(1200 * multiplier / 3),
            Math.round(850 * multiplier / 3),
            Math.round(600 * multiplier / 3),
            Math.round(450 * multiplier / 3),
            Math.round(300 * multiplier / 3),
          ],
          backgroundColor: '#db2777',
        },
      ],
    },
    eventsByType: {
      labels: ['Workshops', 'Seminars', 'Discussions', 'Training', 'Campaigns'],
      datasets: [
        {
          label: `${provinceName}: Events by Type`,
          data: [
            Math.round(45 * multiplier / 3),
            Math.round(30 * multiplier / 3),
            Math.round(60 * multiplier / 3),
            Math.round(25 * multiplier / 3),
            Math.round(40 * multiplier / 3),
          ],
          backgroundColor: [
            '#db2777',
            '#ec4899',
            '#f472b6',
            '#f9a8d4',
            '#fbcfe8',
          ],
        },
      ],
    },
    participationTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: `${provinceName}: Monthly Participation`,
          data: [
            Math.round(250 * multiplier / 3),
            Math.round(300 * multiplier / 3),
            Math.round(280 * multiplier / 3),
            Math.round(320 * multiplier / 3),
            Math.round(350 * multiplier / 3),
            Math.round(400 * multiplier / 3),
            Math.round(420 * multiplier / 3),
            Math.round(450 * multiplier / 3),
            Math.round(500 * multiplier / 3),
            Math.round(550 * multiplier / 3),
            Math.round(600 * multiplier / 3),
            Math.round(650 * multiplier / 3),
          ],
          borderColor: '#db2777',
          backgroundColor: 'rgba(219, 39, 119, 0.2)',
          tension: 0.3,
        },
      ],
    },
    genderDistribution: {
      labels: ['Male', 'Female', 'Other'],
      datasets: [
        {
          label: `${provinceName}: Gender Distribution`,
          data: [
            Math.round(45 * multiplier / 3),
            Math.round(52 * multiplier / 3),
            Math.round(3 * multiplier / 3),
          ],
          backgroundColor: [
            '#0ea5e9',
            '#db2777',
            '#a855f7',
          ],
        },
      ],
    },
  };
};

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

interface ProvinceChartsProps {
  selectedProvince: string | null;
}

const ProvinceCharts: React.FC<ProvinceChartsProps> = ({ selectedProvince }) => {
  const chartData = generateDummyData(selectedProvince);
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        {selectedProvince ? `Data for ${selectedProvince}` : 'National Data Summary'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Chart 1: Participants by Age Group */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Participants by Age</h3>
          <div className="h-64">
            <Bar 
              data={chartData.participantsByAge} 
              options={chartOptions} 
            />
          </div>
        </div>
        
        {/* Chart 2: Events by Type */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Events by Type</h3>
          <div className="h-64">
            <Pie 
              data={chartData.eventsByType} 
              options={chartOptions} 
            />
          </div>
        </div>
        
        {/* Chart 3: Participation Trend */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly Participation</h3>
          <div className="h-64">
            <Line 
              data={chartData.participationTrend} 
              options={chartOptions} 
            />
          </div>
        </div>
        
        {/* Chart 4: Gender Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Gender Distribution</h3>
          <div className="h-64">
            <Doughnut 
              data={chartData.genderDistribution} 
              options={chartOptions} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProvinceCharts;
