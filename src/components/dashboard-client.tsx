"use client";

import { useState, useEffect } from 'react';
import { TrendingDownIcon, TrendingUpIcon, CalendarIcon, BookOpenIcon, UsersIcon, MessageSquareIcon, BriefcaseIcon, EyeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityChart } from "./activity-chart";
import { RecentActivity } from "./recent-activity";

interface DashboardStats {
  events: {
    total: number;
    active: number;
    thisMonth: number;
    trend: number;
  };
  publications: {
    total: number;
    active: number;
    thisMonth: number;
    trend: number;
  };
  discussions: {
    total: number;
    active: number;
    thisMonth: number;
    trend: number;
  };
  careers: {
    total: number;
    active: number;
    thisMonth: number;
    trend: number;
  };
  visitors: {
    total: number;
    today: number;
    thisMonth: number;
    trend: number;
  };
  registrations: {
    total: number;
    thisMonth: number;
    trend: number;
  };
}

export function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard/stats', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }

        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTrend = (trend: number) => {
    const isPositive = trend >= 0;
    return {
      value: Math.abs(trend).toFixed(1) + '%',
      icon: isPositive ? TrendingUpIcon : TrendingDownIcon,
      variant: isPositive ? 'default' : 'destructive' as const,
      color: isPositive ? 'text-green-600' : 'text-red-600',
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 lg:px-6">
        {[...Array(6)].map((_, i) => (
                      <Card key={i} className="shadow-sm bg-white border">
            <CardHeader className="relative">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <div className="absolute right-4 top-4">
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              {error || 'Failed to load dashboard data'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Acara',
      value: stats.events.total,
      description: 'Acara yang terdaftar',
      icon: CalendarIcon,
      trend: stats.events.trend,
      subtitle: `${stats.events.active} aktif, ${stats.events.thisMonth} bulan ini`,
      color: 'text-blue-600'
    },
    {
      title: 'Total Publikasi',
      value: stats.publications.total,
      description: 'Artikel dan riset',
      icon: BookOpenIcon,
      trend: stats.publications.trend,
      subtitle: `${stats.publications.active} aktif, ${stats.publications.thisMonth} bulan ini`,
      color: 'text-green-600'
    },
    {
      title: 'Diskusi Aktif',
      value: stats.discussions.total,
      description: 'Forum diskusi',
      icon: MessageSquareIcon,
      trend: stats.discussions.trend,
      subtitle: `${stats.discussions.active} aktif, ${stats.discussions.thisMonth} bulan ini`,
      color: 'text-purple-600'
    },
    {
      title: 'Lowongan Karir',
      value: stats.careers.total,
      description: 'Peluang karir',
      icon: BriefcaseIcon,
      trend: stats.careers.trend,
      subtitle: `${stats.careers.active} aktif, ${stats.careers.thisMonth} bulan ini`,
      color: 'text-orange-600'
    },
    {
      title: 'Total Pengunjung',
      value: stats.visitors.total,
      description: 'Kunjungan website',
      icon: EyeIcon,
      trend: stats.visitors.trend,
      subtitle: `${stats.visitors.today} hari ini, ${stats.visitors.thisMonth} bulan ini`,
      color: 'text-cyan-600'
    },
    {
      title: 'Pendaftaran Acara',
      value: stats.registrations.total,
      description: 'Peserta terdaftar',
      icon: UsersIcon,
      trend: stats.registrations.trend,
      subtitle: `${stats.registrations.thisMonth} bulan ini`,
      color: 'text-pink-600'
    }
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="p-6 rounded-xl border bg-white">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">Dashboard Admin</h1>
        <p className="text-lg mt-2 text-gray-600">
          Overview konten dan aktivitas website Partisipasi Muda
        </p>
      </div>

      {/* Key Metrics - Enhanced with better visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.slice(0, 4).map((card, index) => {
          const trend = formatTrend(card.trend);
          const IconComponent = card.icon;
          
          return (
            <Card key={index} className="border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-3xl font-black text-gray-800">
                      {formatNumber(card.value)}
                    </p>
                    <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${trend.variant === 'default' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <trend.icon className="h-4 w-4" />
                      <span>{trend.value} bulan ini</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-100 border">
                    <IconComponent className="h-8 w-8 text-slate-600" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-600">{card.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Chart */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityChart />
          
          {/* Content Status Section */}
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-4 bg-slate-50 rounded-t-lg border-b">
              <CardTitle className="text-xl font-bold text-gray-800">Status Konten</CardTitle>
              <p className="text-gray-600 text-sm">Ringkasan status semua konten aktif</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-blue-50">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Acara Aktif</span>
                    </div>
                    <span className="text-xl font-bold text-blue-800">{stats?.events.active || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-green-50">
                    <div className="flex items-center gap-3">
                      <BookOpenIcon className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Publikasi Aktif</span>
                    </div>
                    <span className="text-xl font-bold text-green-800">{stats?.publications.active || 0}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-purple-50">
                    <div className="flex items-center gap-3">
                      <MessageSquareIcon className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">Diskusi Aktif</span>
                    </div>
                    <span className="text-xl font-bold text-purple-800">{stats?.discussions.active || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-orange-50">
                    <div className="flex items-center gap-3">
                      <BriefcaseIcon className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">Karir Aktif</span>
                    </div>
                    <span className="text-xl font-bold text-orange-800">{stats?.careers.active || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Monthly Progress */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-bold mb-4 text-gray-800">Progress Bulan Ini</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-50 border">
                    <p className="text-2xl font-bold text-gray-800">{stats?.events.thisMonth || 0}</p>
                    <p className="text-sm font-medium text-gray-600">Acara Baru</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 border">
                    <p className="text-2xl font-bold text-gray-800">{stats?.publications.thisMonth || 0}</p>
                    <p className="text-sm font-medium text-gray-600">Publikasi Baru</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 border">
                    <p className="text-2xl font-bold text-gray-800">{stats?.discussions.thisMonth || 0}</p>
                    <p className="text-sm font-medium text-gray-600">Diskusi Baru</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 border">
                    <p className="text-2xl font-bold text-gray-800">{stats?.careers.thisMonth || 0}</p>
                    <p className="text-sm font-medium text-gray-600">Karir Baru</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Quick Actions + Mini Stats */}
        <div className="space-y-6">
          {/* Quick Actions - Enhanced */}
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-4 bg-slate-50 rounded-t-lg border-b">
              <CardTitle className="text-xl font-bold text-gray-800">Aksi Cepat</CardTitle>
              <p className="text-gray-600 text-sm">Buat konten baru dengan cepat</p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <a
                href="/admin/acara/create"
                className="flex items-center gap-4 p-4 rounded-xl bg-white border transition-all duration-300 group shadow-sm hover:shadow-md hover:bg-blue-50"
              >
                <div className="p-3 rounded-full group-hover:scale-110 transition-all duration-300 bg-blue-100 text-blue-600">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-base font-semibold text-gray-800">Tambah Acara</span>
                  <p className="text-sm text-gray-600">Buat acara baru</p>
                </div>
              </a>
              <a
                href="/admin/publikasi/create"
                className="flex items-center gap-4 p-4 rounded-xl bg-white border transition-all duration-300 group shadow-sm hover:shadow-md hover:bg-green-50"
              >
                <div className="p-3 rounded-full group-hover:scale-110 transition-all duration-300 bg-green-100 text-green-600">
                  <BookOpenIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-base font-semibold text-gray-800">Tambah Publikasi</span>
                  <p className="text-sm text-gray-600">Tulis artikel atau riset</p>
                </div>
              </a>
              <a
                href="/admin/program/diskusi/create"
                className="flex items-center gap-4 p-4 rounded-xl bg-white border transition-all duration-300 group shadow-sm hover:shadow-md hover:bg-purple-50"
              >
                <div className="p-3 rounded-full group-hover:scale-110 transition-all duration-300 bg-purple-100 text-purple-600">
                  <MessageSquareIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-base font-semibold text-gray-800">Tambah Diskusi</span>
                  <p className="text-sm text-gray-600">Buat topik diskusi</p>
                </div>
              </a>
              <a
                href="/admin/karir/create"
                className="flex items-center gap-4 p-4 rounded-xl bg-white border transition-all duration-300 group shadow-sm hover:shadow-md hover:bg-orange-50"
              >
                <div className="p-3 rounded-full group-hover:scale-110 transition-all duration-300 bg-orange-100 text-orange-600">
                  <BriefcaseIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-base font-semibold text-gray-800">Tambah Karir</span>
                  <p className="text-sm text-gray-600">Posting lowongan kerja</p>
                </div>
              </a>
            </CardContent>
          </Card>

          {/* Additional Stats - Enhanced */}
          <Card className="border shadow-sm bg-white">
            <CardHeader className="pb-4 bg-slate-50 rounded-t-lg border-b">
              <CardTitle className="text-xl font-bold text-gray-800">Statistik Lainnya</CardTitle>
              <p className="text-gray-600 text-sm">Metrik penting website</p>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              {cards.slice(4).map((card, index) => {
                const trend = formatTrend(card.trend);
                const IconComponent = card.icon;
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-slate-100 border">
                        <IconComponent className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">{card.title}</p>
                        <p className="text-sm font-medium text-gray-600">
                          {formatNumber(card.value)} total
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full border ${trend.variant === 'default' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <trend.icon className="h-4 w-4" />
                      <span>{trend.value}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity - Simplified */}
      <RecentActivity />
    </div>
  );
} 