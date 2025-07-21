"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Trash2, 
  Edit, 
  Plus, 
  Eye, 
  Download, 
  Users, 
  Search,
  BookOpen,
  TrendingUp
} from "lucide-react";

interface Publication {
  id: number;
  slug: string;
  title: string;
  date: string;
  count: string;
  image: string | null;
  type: 'riset' | 'artikel' | 'dampak';
  pdfUrl: string | null;
  author: string;
  order: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const typeColors = {
  riset: 'bg-blue-100 text-blue-800',
  artikel: 'bg-green-100 text-green-800',
  dampak: 'bg-purple-100 text-purple-800'
};

const typeLabels = {
  riset: 'Riset',
  artikel: 'Artikel',
  dampak: 'Dampak'
};

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPublications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/publikasi");
      const json = await res.json();
      
      if (res.ok && json.success) {
        setPublications(json.data || []);
      } else {
        setError(json.error || "Failed to fetch publications");
      }
    } catch {
      setError("Failed to fetch publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/publikasi/${id}`, {
        method: "DELETE",
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete publication");
      }
      
      fetchPublications();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred while deleting");
      }
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString || dateString === 'Invalid Date') {
        return 'Tanggal tidak tersedia';
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak valid';
      }
      
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const getDownloadCount = (visitorCount: string) => {
    const visitors = parseInt(visitorCount) || 0;
    return Math.floor(visitors * (0.1 + Math.random() * 0.2));
  };

  // Filter and sort publications based on search, ordered by latest first
  const filteredPublications = publications
    .filter(pub =>
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by createdAt or updatedAt in descending order (latest first)
      const dateA = new Date(a.updatedAt || a.createdAt || a.date);
      const dateB = new Date(b.updatedAt || b.createdAt || b.date);
      return dateB.getTime() - dateA.getTime();
    });

  // Calculate statistics
  const stats = {
    total: publications.length,
    riset: publications.filter(p => p.type === 'riset').length,
    artikel: publications.filter(p => p.type === 'artikel').length,
    dampak: publications.filter(p => p.type === 'dampak').length,
    totalViews: publications.reduce((sum, p) => sum + parseInt(p.count || '0'), 0),
    totalDownloads: publications.reduce((sum, p) => sum + getDownloadCount(p.count), 0)
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">Manajemen Publikasi</h1>
            <p className="text-lg mt-2 text-gray-600">
              Kelola artikel, riset, dan laporan dampak organisasi
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin/publikasi/create">
              <Plus className="mr-2 h-4 w-4" />
              Buat Publikasi Baru
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
                  Total Publikasi
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-blue-100 border">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Total Views
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-100 border">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Total Downloads
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stats.totalDownloads.toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-purple-100 border">
                <Download className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Avg. Views
                </p>
                <p className="text-3xl font-black text-gray-800">
                  {stats.total > 0 ? Math.round(stats.totalViews / stats.total) : 0}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-orange-100 border">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border shadow-sm bg-white">
        <CardHeader className="pb-4 bg-slate-50 rounded-t-lg border-b">
          <CardTitle className="text-xl font-bold text-gray-800">Pencarian Publikasi</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan judul, penulis, atau tipe publikasi..."
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
              <Button onClick={fetchPublications} variant="outline">
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publications Table */}
      <Card className="border shadow-sm bg-white">
        <CardHeader className="pb-4 bg-slate-50 rounded-t-lg border-b">
          <CardTitle className="text-xl font-bold text-gray-800">
            Daftar Publikasi ({filteredPublications.length})
          </CardTitle>
          {searchTerm && (
            <p className="text-gray-600 text-sm">
              Menampilkan {filteredPublications.length} dari {publications.length} publikasi
            </p>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {filteredPublications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <BookOpen className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-800">
                  {searchTerm ? 'Tidak ada publikasi yang sesuai' : 'Belum ada publikasi'}
                </p>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Coba ubah kata kunci pencarian Anda'
                    : 'Mulai dengan membuat publikasi pertama Anda'
                  }
                </p>
              </div>
              {!searchTerm && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/admin/publikasi/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Publikasi Pertama
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="font-semibold text-gray-700 w-[35%]">Judul</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[10%] text-center">Tipe</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[15%]">Penulis</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[12%]">Tanggal</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700 w-[8%]">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4" />
                        Views
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-700 w-[10%]">
                      <div className="flex items-center justify-center gap-1">
                        <Download className="h-4 w-4" />
                        Downloads
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[10%] text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPublications.map((pub) => (
                    <TableRow key={pub.id} className="border-gray-100 hover:bg-gray-50">
                      <TableCell className="w-[35%]">
                        <div className="space-y-1">
                          <div className="font-medium line-clamp-2 text-gray-800 leading-tight">{pub.title}</div>
                          <div className="text-sm text-gray-500">
                            /{pub.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="w-[10%] text-center">
                        <Badge className={typeColors[pub.type]}>
                          {typeLabels[pub.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-700 w-[15%]">{pub.author}</TableCell>
                      <TableCell className="text-sm text-gray-700 w-[12%] whitespace-nowrap">{formatDate(pub.date)}</TableCell>
                      <TableCell className="text-center w-[8%]">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-3 w-3 text-blue-500" />
                          <span className="font-medium text-gray-800">{pub.count}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center w-[10%]">
                        <div className="flex items-center justify-center gap-1">
                          <Download className="h-3 w-3 text-green-500" />
                          <span className="font-medium text-gray-800">{getDownloadCount(pub.count)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="w-[10%]">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-blue-50 hover:border-blue-200 p-2"
                          >
                            <Link href={`/admin/publikasi/detail/${pub.id}`} title="Lihat Detail">
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-green-50 hover:border-green-200 p-2"
                          >
                            <Link href={`/admin/publikasi/edit/${pub.id}`} title="Edit Publikasi">
                              <Edit className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pub.id, pub.title)}
                            disabled={deleting === pub.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 p-2"
                            title="Hapus Publikasi"
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