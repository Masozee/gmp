'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { Feature, FeatureCollection, Geometry } from 'geojson';

type ProvinceProperties = {
  PROVINSI: string;
  Provinsi?: string;
  NAME_1?: string;
  [key: string]: unknown;
};

type ProvinceFeature = Feature<Geometry, ProvinceProperties>;
type ProvinceCollection = FeatureCollection<Geometry, ProvinceProperties>;

interface IndonesiaMapProps {
  width?: number;
  height?: number;
  className?: string;
}

const IndonesiaMap = ({ 
  width = 800, 
  height = 400,
  className = '' 
}: IndonesiaMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapData, setMapData] = useState<ProvinceCollection | null>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/data/Provinsi.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch map data: ${response.status}`);
        }
        
        const data = await response.json() as ProvinceCollection;
        setMapData(data);
      } catch (err) {
        console.error('Error loading map data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  useEffect(() => {
    if (!mapData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous rendering

    const projection = d3.geoMercator()
      .center([118, -2]) // Center on Indonesia
      .scale(width * 1.3)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const g = svg.append('g');

    g.selectAll('path')
      .data(mapData.features)
      .enter()
      .append('path')
      .attr('d', (d) => path(d) || '')
      .attr('fill', '#f0a6d2')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.5)
      .on('mouseover', function(event, d: ProvinceFeature) {
        d3.select(this)
          .attr('fill', '#d53f8c')
          .attr('stroke-width', 1);
          
        const provinceName = d.properties.PROVINSI || 
                             d.properties.Provinsi || 
                             d.properties.NAME_1 || 'Unknown Province';
          
        // Show tooltip
        const [x, y] = d3.pointer(event);
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${x + 10}, ${y + 10})`);
          
        tooltip.append('rect')
          .attr('width', provinceName.length * 8 + 20)
          .attr('height', 30)
          .attr('fill', 'white')
          .attr('opacity', 0.9)
          .attr('rx', 5)
          .attr('stroke', '#d53f8c')
          .attr('stroke-width', 1);
          
        tooltip.append('text')
          .attr('x', 10)
          .attr('y', 20)
          .text(provinceName)
          .attr('fill', '#333')
          .attr('font-size', '12px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('fill', '#f0a6d2')
          .attr('stroke-width', 0.5);
          
        // Remove tooltip
        svg.selectAll('.tooltip').remove();
      });

  }, [mapData, width, height]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-red-500 text-center">
          <p>Failed to load map: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`} 
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

// Add display name
IndonesiaMap.displayName = 'IndonesiaMap';

export default IndonesiaMap;
