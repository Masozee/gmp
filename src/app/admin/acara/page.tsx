'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CalendarDays,
  Clock,
  TrendingUp
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  slug: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registrationUrl: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminAcaraPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/acara', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus acara "${title}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/acara/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      fetchEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    return new Date(`${dateString}T${timeString}`).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate statistics
  const now = new Date();
  const stats = {
    total: events.length,
    active: events.filter(e => e.isActive).length,
    upcoming: events.filter(e => new Date(e.date) > now).length,
    past: events.filter(e => new Date(e.date) <= now).length,
    totalCapacity: events.reduce((sum, e) => sum + e.capacity, 0),
    avgCapacity: events.length > 0 ? Math.round(events.reduce((sum, e) => sum + e.capacity, 0) / events.length) : 0
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="p-6 rounded-xl border bg-white">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border shadow-sm bg-white">
          <CardHeader className="bg-slate-50 rounded-t-lg border-b">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-xl border bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">Manajemen Acara</h1>
            <p className="text-lg mt-2 text-gray-600">
              Kelola acara dan event organisasi
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin/acara/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Acara
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Total Acara
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-blue-100 border">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Acara Aktif
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stats.active}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-100 border">
                <CalendarDays className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Acara Mendatang
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stats.upcoming}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-purple-100 border">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Total Kapasitas
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stats.totalCapacity.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-orange-100 border">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border shadow-sm bg-white">
        <CardHeader className="pb-4 bg-slate-50 rounded-t-lg border-b">
          <CardTitle className="text-xl font-bold text-gray-800">Pencarian Acara</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan judul, deskripsi, atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">{error}</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={fetchEvents} variant="outline">
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Table */}
      <Card className="border shadow-sm bg-white">
        <CardHeader className="pb-4 bg-slate-50 rounded-t-lg border-b">
          <CardTitle className="text-xl font-bold text-gray-800">
            Daftar Acara ({filteredEvents.length})
          </CardTitle>
          {searchTerm && (
            <p className="text-gray-600 text-sm">
              Menampilkan {filteredEvents.length} dari {events.length} acara
            </p>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Calendar className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-800">
                  {searchTerm ? 'Tidak ada acara yang sesuai' : 'Belum ada acara'}
                </p>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Coba ubah kata kunci pencarian Anda'
                    : 'Mulai dengan membuat acara pertama Anda'
                  }
                </p>
              </div>
              {!searchTerm && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/admin/acara/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Acara Pertama
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="font-semibold text-gray-700 w-[35%]">Acara</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[15%]">Tanggal & Waktu</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[20%]">Lokasi</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[10%] text-center">Kapasitas</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[10%] text-center">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[10%] text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id} className="border-gray-100 hover:bg-gray-50">
                      <TableCell className="w-[35%]">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-800 leading-tight">{event.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2 leading-tight">
                            {event.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            /{event.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[15%]">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-800 whitespace-nowrap">
                            {formatDate(event.date)}
                          </div>
                          <div className="text-xs text-gray-600 whitespace-nowrap">
                            {event.time}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[20%]">
                        <div className="flex items-start gap-1 text-sm text-gray-700">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{event.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[10%] text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-700">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="font-medium">{event.capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[10%] text-center">
                        <Badge 
                          className={event.isActive 
                            ? 'bg-green-100 text-green-800 whitespace-nowrap' 
                            : 'bg-gray-100 text-gray-800 whitespace-nowrap'
                          }
                        >
                          {event.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[10%]">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-blue-50 hover:border-blue-200 p-2"
                          >
                            <Link href={`/admin/acara/detail/${event.id}`} title="Lihat Detail">
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-green-50 hover:border-green-200 p-2"
                          >
                            <Link href={`/admin/acara/edit/${event.id}`} title="Edit Acara">
                              <Edit className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-purple-50 hover:border-purple-200 p-2"
                          >
                            <Link href={`/acara/${event.slug}`} target="_blank" title="Lihat Publik">
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(event.id, event.title)}
                            disabled={deleting === event.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 p-2"
                            title="Hapus Acara"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 