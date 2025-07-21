'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  capacity: number;
  registeredCount: number;
  image: string | null;
  category: string;
  isPaid: boolean;
  price?: number;
  isRegistrationOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: PageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [eventId, setEventId] = useState<string>('');

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setEventId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  const fetchEvent = async () => {
    if (!eventId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/acara/${eventId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Acara tidak ditemukan');
        } else {
          throw new Error('Failed to fetch event');
        }
        return;
      }

      const data = await response.json();
      setEvent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data acara');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/acara">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Detail Acara</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                {error || 'Acara tidak ditemukan'}
              </h3>
              <p className="text-muted-foreground">
                Acara yang Anda cari tidak tersedia atau telah dihapus.
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/acara">Kembali ke Daftar Acara</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/acara">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detail Acara</h1>
            <p className="text-muted-foreground">
              Informasi lengkap acara
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/acara/${event.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Lihat di Website
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/acara/edit/${event.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Acara
            </Link>
          </Button>
        </div>
      </div>

            {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <p className="text-sm text-muted-foreground font-mono">{event.slug}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={event.isRegistrationOpen ? "default" : "destructive"}>
                  {event.isRegistrationOpen ? "Pendaftaran Buka" : "Pendaftaran Tutup"}
                </Badge>
                {event.isPaid && (
                  <Badge variant="outline">
                    Berbayar - {event.price ? `Rp ${event.price.toLocaleString()}` : 'Harga belum ditentukan'}
                  </Badge>
                )}
                {event.category && (
                  <Badge variant="secondary">{event.category}</Badge>
                )}
              </div>
            </div>
            
            {event.image && (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/events/default-event.jpg';
                  }}
                />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Event Details */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{formatDate(event.date)}</p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{event.location}</p>
                {event.address && (
                  <p className="text-sm text-muted-foreground">{event.address}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{event.registeredCount} / {event.capacity} peserta</p>
                <div className="w-24 bg-muted rounded-full h-2 mt-1">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-3">Deskripsi</h3>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t">
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>ID: {event.id}</span>
              <span>Dibuat: {formatDateTime(event.createdAt)}</span>
              <span>Update: {formatDateTime(event.updatedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 