'use client';

import dynamic from 'next/dynamic';
import React from 'react';

interface AcademicaPoliticaMapWrapperProps {
  className?: string;
}

// Simple loading component
const MapLoading = () => (
  <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
      <p className="text-gray-600">Memuat peta...</p>
    </div>
  </div>
);

// Dynamically import the map component
const DynamicMap = dynamic(
  () => import('./AcademicaPoliticaMap'),
  { 
    ssr: false,
    loading: () => <MapLoading />
  }
);

const AcademicaPoliticaMapWrapper: React.FC<AcademicaPoliticaMapWrapperProps> = ({ className }) => {
  return (
    <div className={className}>
      <DynamicMap className="w-full h-full" />
    </div>
  );
};

export default AcademicaPoliticaMapWrapper;