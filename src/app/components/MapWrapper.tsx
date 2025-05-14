'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Loading component with error handling
const LoadingMap = () => (
  <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
      <p className="text-gray-500">Loading map...</p>
    </div>
  </div>
);

// Error component
const ErrorMap = ({ error }: { error: Error }) => (
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

// Dynamically import the map component to avoid SSR issues with Leaflet
const LeafletMapComponent = dynamic(() => import('./LeafletMap').catch(err => {
  console.error('Failed to load map component:', err);
  const ErrorComponent = () => <ErrorMap error={err} />;
  ErrorComponent.displayName = 'ErrorMapComponent';
  return ErrorComponent;
}), { 
  ssr: false,
  loading: () => <LoadingMap />
});

const MapWrapper = () => {
  return (
    <div className="rounded-lg overflow-hidden bg-white relative" style={{ zIndex: 10 }}>
      <style jsx global>{`
        /* Ensure Leaflet map container doesn't exceed z-index of navbar */
        .leaflet-container, 
        .leaflet-control,
        .leaflet-pane,
        .leaflet-top,
        .leaflet-bottom {
          z-index: 10 !important;
        }
        
        /* Make sure popups can appear above map */
        .leaflet-popup {
          z-index: 20 !important;
        }
      `}</style>
      <LeafletMapComponent />
    </div>
  );
};

// Add display name
MapWrapper.displayName = 'MapWrapper';

export default MapWrapper;
