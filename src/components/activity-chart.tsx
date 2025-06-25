'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUpIcon, TrendingDownIcon, EyeIcon, ActivityIcon } from 'lucide-react';

interface VisitorData {
  date: string;
  desktop: number;
  mobile: number;
  total: number;
  month: string;
  day: number;
}

interface MonthlyData {
  month: string;
  events: number;
  publications: number;
  discussions: number;
  registrations: number;
  contacts: number;
  subscriptions: number;
  total: number;
}

interface ActivityData {
  visitors: VisitorData[];
  monthly: MonthlyData[];
  summary: {
    totalVisitors: number;
    avgDailyVisitors: number;
    maxDailyVisitors: number;
    minDailyVisitors: number;
    totalActivities: number;
    avgMonthlyActivities: number;
    timeRange: string;
  };
}

// Chart configuration removed since we're using a simplified chart

export function ActivityChart() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState("90d");
  const [chartType, setChartType] = useState<'visitors' | 'activities'>('visitors');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard/activity', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch activity data');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activity data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Aktivitas 6 Bulan Terakhir</CardTitle>
          <CardDescription>
            Memuat data aktivitas dan pengunjung...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Aktivitas 6 Bulan Terakhir</CardTitle>
          <CardDescription>
            {error || 'Tidak ada data untuk ditampilkan'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Filter visitor data based on time range
  const filteredVisitorData = data.visitors.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "180d") {
      daysToSubtract = 180;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // Calculate trend for visitors
  const recentVisitors = filteredVisitorData.slice(-7).reduce((sum, day) => sum + day.total, 0);
  const previousVisitors = filteredVisitorData.slice(-14, -7).reduce((sum, day) => sum + day.total, 0);
  const visitorTrend = previousVisitors > 0 ? ((recentVisitors - previousVisitors) / previousVisitors) * 100 : 0;

  // Calculate trend for activities
  const recentActivities = data.monthly.slice(-2).reduce((sum, month) => sum + month.total, 0);
  const previousActivities = data.monthly.slice(-4, -2).reduce((sum, month) => sum + month.total, 0);
  const activityTrend = previousActivities > 0 ? ((recentActivities - previousActivities) / previousActivities) * 100 : 0;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Aktivitas 6 Bulan Terakhir</CardTitle>
          <CardDescription>
            Menampilkan tren pengunjung dan aktivitas konten
          </CardDescription>
        </div>
        <div className="flex flex-col gap-3 px-6 py-4 sm:min-w-[300px]">
          <div className="flex gap-2">
            <Select value={chartType} onValueChange={(value: 'visitors' | 'activities') => setChartType(value)}>
              <SelectTrigger className="w-[160px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="visitors" className="rounded-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <EyeIcon className="h-4 w-4" />
                    Pengunjung
                  </div>
                </SelectItem>
                <SelectItem value="activities" className="rounded-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <ActivityIcon className="h-4 w-4" />
                    Aktivitas
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {chartType === 'visitors' && (
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[120px] rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="7d" className="rounded-lg">7 hari</SelectItem>
                  <SelectItem value="30d" className="rounded-lg">30 hari</SelectItem>
                  <SelectItem value="90d" className="rounded-lg">90 hari</SelectItem>
                  <SelectItem value="180d" className="rounded-lg">6 bulan</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {chartType === 'visitors' ? (
          <div className="space-y-4">
            {/* Visitor Stats */}
            <div className="flex items-center justify-between">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm font-medium leading-none">
                  Total Pengunjung ({timeRange})
                </div>
                <div className="flex items-center gap-2 text-lg font-bold leading-none">
                  {filteredVisitorData.reduce((sum, day) => sum + day.total, 0).toLocaleString()}
                  <div className={`flex items-center gap-1 text-xs ${visitorTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {visitorTrend >= 0 ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
                    {Math.abs(visitorTrend).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Rata-rata harian</div>
                <div className="text-sm font-medium">
                  {Math.round(filteredVisitorData.reduce((sum, day) => sum + day.total, 0) / filteredVisitorData.length)}
                </div>
              </div>
            </div>

            {/* Visitor Chart - Simplified Line Chart */}
            <div className="h-64 w-full bg-muted/30 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute inset-4">
                <div className="h-full flex items-end justify-between gap-1">
                  {filteredVisitorData.slice(-30).map((day, index) => {
                    const maxValue = Math.max(...filteredVisitorData.slice(-30).map(d => d.total));
                    const height = maxValue > 0 ? (day.total / maxValue) * 100 : 0;
                    return (
                      <div 
                        key={index}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                        title={`${day.date}: ${day.total} pengunjung (Desktop: ${day.desktop}, Mobile: ${day.mobile})`}
                      />
                    );
                  })}
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{filteredVisitorData[filteredVisitorData.length - 30]?.date.split('-').slice(1).join('/')}</span>
                  <span>Hari ini</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Activity Stats */}
            <div className="flex items-center justify-between">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm font-medium leading-none">
                  Total Aktivitas (6 bulan)
                </div>
                <div className="flex items-center gap-2 text-lg font-bold leading-none">
                  {data.summary.totalActivities}
                  <div className={`flex items-center gap-1 text-xs ${activityTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {activityTrend >= 0 ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
                    {Math.abs(activityTrend).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Rata-rata bulanan</div>
                <div className="text-sm font-medium">{data.summary.avgMonthlyActivities}</div>
              </div>
            </div>

            {/* Monthly Activity Bars */}
            <div className="space-y-3">
              {data.monthly.map((month, index) => {
                const maxTotal = Math.max(...data.monthly.map(m => m.total));
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{month.month}</span>
                      <span className="text-xs text-muted-foreground">{month.total} total</span>
                    </div>
                    
                    <div className="relative">
                      <div className="flex h-6 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 transition-all duration-300"
                          style={{ width: `${maxTotal > 0 ? (month.events / maxTotal) * 100 : 0}%` }}
                          title={`Acara: ${month.events}`}
                        ></div>
                        <div 
                          className="transition-all duration-300"
                          style={{backgroundColor: 'var(--success)', width: `${maxTotal > 0 ? (month.publications / maxTotal) * 100 : 0}%`}}
                          title={`Publikasi: ${month.publications}`}
                        ></div>
                        <div 
                          className="bg-purple-500 transition-all duration-300"
                          style={{ width: `${maxTotal > 0 ? (month.discussions / maxTotal) * 100 : 0}%` }}
                          title={`Diskusi: ${month.discussions}`}
                        ></div>
                        <div 
                          className="bg-orange-500 transition-all duration-300"
                          style={{ width: `${maxTotal > 0 ? (month.registrations / maxTotal) * 100 : 0}%` }}
                          title={`Registrasi: ${month.registrations}`}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Acara: {month.events}</span>
                        <span>Publikasi: {month.publications}</span>
                        <span>Diskusi: {month.discussions}</span>
                        <span>Registrasi: {month.registrations}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Activity Legend */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t text-xs">
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
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Registrasi</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 