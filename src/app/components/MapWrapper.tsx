'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Loading component with error handling
const LoadingMap: React.FC = () => (
  <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
      <p className="text-gray-500">Loading map...</p>
    </div>
  </div>
);
LoadingMap.displayName = 'LoadingMap';

// Error component
const ErrorMap: React.FC<{ error: Error }> = ({ error }) => (
  <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
    <div className="text-center p-4 max-w-md">
      <p className="text-red-500 font-semibold">Failed to load map: {error.message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
      >
        Reload
      </button>
    </div>
  </div>
);
ErrorMap.displayName = 'ErrorMap';

// Create a function component that will be used for dynamic import fallback
const DynamicMapErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  console.error('Failed to load map component:', error);
  return <ErrorMap error={error} />;
};
DynamicMapErrorFallback.displayName = 'DynamicMapErrorFallback';

// Create a named function to return from the dynamic import that has a display name
const createErrorComponent = (err: Error): React.FC => {
  const ErrorComponent: React.FC = () => <DynamicMapErrorFallback error={err} />;
  ErrorComponent.displayName = 'ErrorComponent';
  return ErrorComponent;
};

// Dynamically import the map component to avoid SSR issues
const IndonesiaMapComponent = dynamic(
  () => import('./IndonesiaMap').catch(err => createErrorComponent(err)), 
  { 
    ssr: false,
    loading: () => <LoadingMap />
  }
);

// Give the dynamic component a display name
IndonesiaMapComponent.displayName = 'DynamicIndonesiaMap';

const MapWrapper: React.FC = () => {
  return (
    <div className="rounded-lg overflow-hidden bg-white">
      <IndonesiaMapComponent />
    </div>
  );
};

MapWrapper.displayName = 'MapWrapper';

export default MapWrapper;
