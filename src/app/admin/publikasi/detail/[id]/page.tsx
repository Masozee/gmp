"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit, Eye, Trash2, ExternalLink } from "lucide-react";

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
  dampak: 'Laporan Dampak'
};

export default function PublicationDetailPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publication, setPublication] = useState<Publication | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const res = await fetch(`/api/admin/publikasi/${params.id}`);
        const json = await res.json();
        
        if (res.ok && json.success) {
          setPublication(json.data);
        } else {
          setError(json.error || "Failed to fetch publication");
        }
      } catch {
        setError("Failed to fetch publication");
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [params.id]);

  const handleDelete = async () => {
    if (!publication) return;
    
    if (!confirm(`Are you sure you want to delete "${publication.title}"?`)) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/publikasi/${publication.id}`, {
        method: "DELETE",
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete publication");
      }
      
      // Redirect to publications list after successful delete
      window.location.href = "/admin/publikasi";
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred while deleting");
      }
    } finally {
      setDeleting(false);
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
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-24" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error || "Publication not found"}</p>
            <Button asChild className="mt-4">
              <Link href="/admin/publikasi">Kembali ke Daftar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/publikasi">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Detail Publikasi</h1>
          <p className="text-muted-foreground">Lihat informasi lengkap publikasi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/publikasi/${publication.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Lihat Publik
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/publikasi/edit/${publication.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Judul</label>
                <p className="text-lg font-semibold">{publication.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Slug URL</label>
                <p className="font-mono text-sm bg-muted px-2 py-1 rounded">/{publication.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipe</label>
                <div className="mt-1">
                  <Badge className={typeColors[publication.type]}>
                    {typeLabels[publication.type]}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Penulis</label>
                <p>{publication.author}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tanggal Publikasi</label>
                <p>{formatDate(publication.date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Urutan Tampilan</label>
                <p>
                  <Badge variant="outline">{publication.order}</Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media & Links */}
        {(publication.image || publication.pdfUrl) && (
          <Card>
            <CardHeader>
              <CardTitle>Media & Tautan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {publication.image && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gambar Cover</label>
                  <div className="mt-2 space-y-2">
                    <img 
                      src={publication.image} 
                      alt={publication.title}
                      className="max-w-sm h-auto rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <p className="text-sm text-muted-foreground font-mono break-all">
                      {publication.image}
                    </p>
                  </div>
                </div>
              )}
              {publication.pdfUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">PDF Document</label>
                  <div className="mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Buka PDF
                      </a>
                    </Button>
                    <p className="text-sm text-muted-foreground font-mono break-all mt-1">
                      {publication.pdfUrl}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Konten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                {publication.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-muted-foreground">ID</label>
                <p>{publication.id}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground">Jumlah View</label>
                <p>{publication.count}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground">Dibuat</label>
                <p>{formatDate(publication.createdAt)}</p>
              </div>
              <div>
                <label className="font-medium text-muted-foreground">Terakhir Diupdate</label>
                <p>{formatDate(publication.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 