"use client";

import { useState, useEffect } from 'react';
import { TrendingDownIcon, TrendingUpIcon, CalendarIcon, BookOpenIcon, UsersIcon, MessageSquareIcon, BriefcaseIcon, EyeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardChart } from "./dashboard-chart";
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
          <Card key={i} className="shadow-xs bg-gradient-to-t from-primary/5 to-card">
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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview konten dan aktivitas website
        </p>
      </div>

      {/* Key Metrics - Only 4 main ones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.slice(0, 4).map((card, index) => {
          const trend = formatTrend(card.trend);
          const IconComponent = card.icon;
          
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold">
                      {formatNumber(card.value)}
                    </p>
                    <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
                      <trend.icon className="h-3 w-3" />
                      <span>{trend.value} bulan ini</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-muted`}>
                    <IconComponent className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Chart */}
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>

        {/* Right side - Quick Actions + Mini Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="/admin/acara/create"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-md bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Tambah Acara</span>
              </a>
              <a
                href="/admin/publikasi/create"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-md bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                  <BookOpenIcon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Tambah Publikasi</span>
              </a>
              <a
                href="/admin/program/diskusi/create"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-md bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                  <MessageSquareIcon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Tambah Diskusi</span>
              </a>
              <a
                href="/admin/karir/create"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="p-2 rounded-md bg-orange-100 text-orange-600 group-hover:bg-orange-200 transition-colors">
                  <BriefcaseIcon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Tambah Karir</span>
              </a>
            </CardContent>
          </Card>

          {/* Additional Stats */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Statistik Lainnya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cards.slice(4).map((card, index) => {
                const trend = formatTrend(card.trend);
                const IconComponent = card.icon;
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md bg-muted`}>
                        <IconComponent className={`h-4 w-4 ${card.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{card.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatNumber(card.value)} total
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
                      <trend.icon className="h-3 w-3" />
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