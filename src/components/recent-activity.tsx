'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CalendarIcon, 
  BookOpenIcon, 
  MessageSquareIcon, 
  UserIcon,
  ExternalLinkIcon
} from 'lucide-react';

interface RecentActivityItem {
  id: number;
  title: string;
  type: 'event' | 'publication' | 'discussion' | 'registration';
  date: string;
  slug?: string;
  eventTitle?: string; // For registrations
}

export function RecentActivity() {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/dashboard/activity', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recent activities');
        }

        const data = await response.json();
        setActivities(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return CalendarIcon;
      case 'publication':
        return BookOpenIcon;
      case 'discussion':
        return MessageSquareIcon;
      case 'registration':
        return UserIcon;
      default:
        return CalendarIcon;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'event':
        return 'Acara';
      case 'publication':
        return 'Publikasi';
      case 'discussion':
        return 'Diskusi';
      case 'registration':
        return 'Pendaftaran';
      default:
        return 'Item';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event':
        return 'text-blue-600 bg-blue-50';
      case 'publication':
        return 'text-green-600 bg-green-50';
      case 'discussion':
        return 'text-purple-600 bg-purple-50';
      case 'registration':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getEditLink = (activity: RecentActivityItem) => {
    switch (activity.type) {
      case 'event':
        return `/admin/acara/edit/${activity.id}`;
      case 'publication':
        return `/admin/publikasi/edit/${activity.id}`;
      case 'discussion':
        return `/admin/program/diskusi/edit/${activity.id}`;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !activities.length) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {error || 'Belum ada aktivitas terbaru'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm bg-white">
      <CardHeader className="pb-4 bg-slate-50 rounded-t-lg border-b">
        <CardTitle className="text-xl font-bold text-gray-800">Aktivitas Terbaru</CardTitle>
        <CardDescription className="text-gray-600">
          Konten dan aktivitas terbaru di website
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {activities.slice(0, 6).map((activity, index) => {
            const IconComponent = getIcon(activity.type);
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getTypeColor(activity.type)}`}>
                  <IconComponent className="h-3 w-3" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed truncate text-gray-800">
                    {activity.title}
                    {activity.eventTitle && (
                      <span className="text-gray-600"> - {activity.eventTitle}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatDate(activity.date)} • {getTypeLabel(activity.type)}
                  </p>
                </div>
              </div>
            );
          })}
          
          {activities.length > 6 && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                +{activities.length - 6} aktivitas lainnya
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 