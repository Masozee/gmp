"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  Trash2, 
  FileText, 
  Calendar, 
  User, 
  Hash, 
  Clock,
  Download,
  Copy,
  Check
} from "lucide-react";

interface Publication {
  id: number;
  slug: string;
  title: string;
  date: string;
  count: string;
  image_url: string | null;
  type: 'riset' | 'artikel' | 'dampak';
  pdf_url: string | null;
  author: string;
  description: string | null;
  order: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const typeConfig = {
  riset: {
    label: 'Riset',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: '🔬'
  },
  artikel: {
    label: 'Artikel',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: '📄'
  },
  dampak: {
    label: 'Laporan Dampak',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: '📊'
  }
};

export default function PublicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publication, setPublication] = useState<Publication | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchPublication = async () => {
      try {
        const res = await fetch(`/api/admin/publikasi/${resolvedParams.id}`);
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
  }, [resolvedParams]);

  const handleDelete = async () => {
    if (!publication) return;
    
    if (!confirm(`Apakah Anda yakin ingin menghapus "${publication.title}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/publikasi/${publication.id}`, {
        method: "DELETE",
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete publication");
      }
      
      window.location.href = "/admin/publikasi";
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Terjadi kesalahan saat menghapus publikasi");
      }
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/publikasi">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {error || "Publikasi tidak ditemukan"}
            </h3>
            <p className="text-red-600 mb-4">
              Publikasi yang Anda cari mungkin telah dihapus atau tidak tersedia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const typeInfo = typeConfig[publication.type];
  const publicUrl = `/publikasi/${publication.slug}`;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" size="sm" asChild>
        <Link href="/admin/publikasi">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Link>
      </Button>

      {/* Title Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{typeInfo.icon}</span>
          <Badge className={typeInfo.color}>
            {typeInfo.label}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
          {publication.title}
        </h1>
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{publication.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(publication.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{publication.count} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Hash className="h-4 w-4" />
            <span>#{publication.order}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={publicUrl} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Lihat Publik
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/publikasi/edit/${publication.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Main Content */}
      <Card>
        <CardContent className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informasi Publikasi</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Deskripsi</label>
                  <p className="mt-1 text-gray-700">
                    {publication.description || "Tidak ada deskripsi"}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                    URL Slug
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(publication.slug, 'slug')}
                      className="h-6 w-6 p-0"
                    >
                      {copied === 'slug' ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </label>
                  <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded mt-1 break-all">
                    /{publication.slug}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Metadata</label>
                  <div className="mt-1 space-y-1 text-sm">
                    <p><span className="font-medium">ID:</span> #{publication.id}</p>
                    <p><span className="font-medium">Dibuat:</span> {formatDateTime(publication.createdAt)}</p>
                    <p><span className="font-medium">Diupdate:</span> {formatDateTime(publication.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Section */}
          {(publication.image_url || publication.pdf_url) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Media & Dokumen</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Cover Image */}
                  {publication.image_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">Gambar Cover</label>
                      <div className="space-y-3">
                        <div className="relative w-full max-w-md">
                          <Image
                            src={publication.image_url}
                            alt={publication.title}
                            width={400}
                            height={200}
                            className="rounded-lg border shadow-sm object-cover w-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <span className="font-mono text-gray-600 break-all flex-1">
                            {publication.image_url}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(publication.image_url!, 'image')}
                          >
                            {copied === 'image' ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PDF Document */}
                  {publication.pdf_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">Dokumen PDF</label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{publication.title}.pdf</h4>
                            <p className="text-xs text-gray-600">Dokumen PDF publikasi</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" asChild>
                              <a href={publication.pdf_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-3 w-3" />
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={publication.pdf_url} download>
                                <Download className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <span className="font-mono text-gray-600 break-all flex-1">
                            {publication.pdf_url}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(publication.pdf_url!, 'pdf')}
                          >
                            {copied === 'pdf' ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Content */}
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Konten Publikasi</h3>
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: publication.content }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 