'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface ChartData {
  month: string;
  events: number;
  publications: number;
  discussions: number;
  registrations: number;
}

export function DashboardChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard/chart', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }

        const data = await response.json();
        setChartData(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Konten (6 Bulan Terakhir)</CardTitle>
          <CardDescription>
            Grafik statistik konten dan aktivitas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Konten</CardTitle>
          <CardDescription>
            {error || 'Tidak ada data untuk ditampilkan'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Calculate max values for scaling
  const maxEvents = Math.max(...chartData.map(d => d.events));
  const maxPublications = Math.max(...chartData.map(d => d.publications));
  const maxDiscussions = Math.max(...chartData.map(d => d.discussions));
  const maxRegistrations = Math.max(...chartData.map(d => d.registrations));
  const maxValue = Math.max(maxEvents, maxPublications, maxDiscussions, maxRegistrations);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Aktivitas 6 Bulan Terakhir</CardTitle>
        <CardDescription className="text-sm">
          Tren pembuatan konten per bulan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simplified Chart - Only show 2 main metrics */}
          <div className="space-y-3">
            {chartData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="text-xs text-muted-foreground">
                    {data.events + data.publications + data.discussions} total
                  </div>
                </div>
                
                {/* Combined bar showing total activity */}
                <div className="relative">
                  <div className="flex h-6 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 transition-all duration-300"
                      style={{ width: `${maxValue > 0 ? (data.events / maxValue) * 100 : 0}%` }}
                    ></div>
                    <div 
                      className="transition-all duration-300"
                      style={{backgroundColor: 'var(--success)', width: `${maxValue > 0 ? (data.publications / maxValue) * 100 : 0}%`}}
                    ></div>
                    <div 
                      className="bg-purple-500 transition-all duration-300"
                      style={{ width: `${maxValue > 0 ? (data.discussions / maxValue) * 100 : 0}%` }}
                    ></div>
                  </div>
                  
                  {/* Hover details */}
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Acara: {data.events}</span>
                    <span>Publikasi: {data.publications}</span>
                    <span>Diskusi: {data.discussions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Simple Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Acara</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'var(--success)'}}></div>
              <span>Publikasi</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Diskusi</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 