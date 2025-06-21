'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Briefcase,
  MapPin,
  Calendar,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface Career {
  id: number;
  title: string;
  type: 'internship' | 'full-time' | 'part-time' | 'contract' | 'volunteer';
  location: string | null;
  duration: string | null;
  deadline: string | null;
  postedDate: string;
  poster: string | null;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  applyUrl: string | null;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const typeLabels = {
  'internship': 'Magang',
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  'contract': 'Kontrak',
  'volunteer': 'Relawan'
};

const typeColors = {
  'internship': 'bg-blue-100 text-blue-800',
  'full-time': 'bg-green-100 text-green-800',
  'part-time': 'bg-yellow-100 text-yellow-800',
  'contract': 'bg-purple-100 text-purple-800',
  'volunteer': 'bg-pink-100 text-pink-800'
};

export default function AdminKarirPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch careers
  const fetchCareers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/karir', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch careers');
      }

      const data = await response.json();
      setCareers(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch careers');
    } finally {
      setLoading(false);
    }
  };

  // Delete career
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus lowongan ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/karir/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete career');
      }

      // Refresh the list
      fetchCareers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete career');
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  // Filter careers based on search term
  const filteredCareers = careers.filter(career =>
    career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (career.location && career.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Karir</h1>
          <p className="text-muted-foreground">
            Kelola lowongan pekerjaan dan magang
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/karir/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Lowongan
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan judul, deskripsi, atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Careers List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Lowongan ({filteredCareers.length})</CardTitle>
          <CardDescription>
            Semua lowongan pekerjaan dan magang
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="space-x-2">
                    <Skeleton className="h-8 w-16 inline-block" />
                    <Skeleton className="h-8 w-16 inline-block" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button onClick={fetchCareers} className="mt-4">
                Coba Lagi
              </Button>
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Tidak ada lowongan</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Tidak ada lowongan yang sesuai dengan pencarian.' : 'Belum ada lowongan yang dibuat.'}
              </p>
              {!searchTerm && (
                <Button asChild className="mt-4">
                  <Link href="/admin/karir/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Lowongan Pertama
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCareers.map((career) => (
                <div
                  key={career.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{career.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {career.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={typeColors[career.type]}
                          variant="secondary"
                        >
                          {typeLabels[career.type]}
                        </Badge>
                        <Badge variant={career.isActive ? "default" : "secondary"}>
                          {career.isActive ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Posted: {formatDate(career.postedDate)}
                      </div>
                      {career.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {career.location}
                        </div>
                      )}
                      {career.deadline && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Deadline: {formatDate(career.deadline)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/karir/detail/${career.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/karir/edit/${career.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/karir/${career.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(career.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 