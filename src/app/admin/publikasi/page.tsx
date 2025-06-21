"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Edit, Plus, Eye } from "lucide-react";

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
      
      // Refresh the list after delete
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
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Publikasi</h1>
          <p className="text-muted-foreground">Kelola artikel, riset, dan laporan dampak</p>
        </div>
        <Button asChild>
          <Link href="/admin/publikasi/create">
            <Plus className="mr-2 h-4 w-4" />
            Buat Publikasi Baru
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Publikasi ({publications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {publications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Eye className="mx-auto h-12 w-12 mb-2" />
                <p>Belum ada publikasi.</p>
              </div>
              <Button asChild>
                <Link href="/admin/publikasi/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat Publikasi Pertama
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Penulis</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Urutan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publications.map((pub) => (
                    <TableRow key={pub.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium line-clamp-2">{pub.title}</div>
                          <div className="text-sm text-muted-foreground">
                            /{pub.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[pub.type]}>
                          {typeLabels[pub.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{pub.author}</TableCell>
                      <TableCell className="text-sm">{formatDate(pub.date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pub.order}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/admin/publikasi/detail/${pub.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/admin/publikasi/edit/${pub.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pub.id, pub.title)}
                            disabled={deleting === pub.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
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