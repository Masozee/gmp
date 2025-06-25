"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Eye, ExternalLink, FileText, Image as ImageIcon, Settings } from "lucide-react";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { FileUpload } from "@/components/ui/file-upload";

interface PublikasiData {
  title: string;
  slug: string;
  type: 'riset' | 'artikel' | 'dampak';
  author: string;
  date: string;
  description: string;
  content: string;
  image_url: string;
  pdf_url: string;
  order: number;
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

export default function EditPublikasiPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<PublikasiData>({
    title: '',
    slug: '',
    type: 'artikel',
    author: '',
    date: '',
    description: '',
    content: '',
    image_url: '',
    pdf_url: '',
    order: 1,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value)
    }));
  };

  useEffect(() => {
    const fetchPublikasi = async () => {
      try {
        const response = await fetch(`/api/admin/publikasi/${id}`);
        if (response.ok) {
          const result = await response.json();
          const data = result.data || result;
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            type: data.type || 'artikel',
            author: data.author || '',
            date: data.date ? data.date.split('T')[0] : '',
            description: data.description || '',
            content: data.content || '',
            image_url: data.image_url || data.image || '',
            pdf_url: data.pdf_url || data.pdfUrl || '',
            order: data.order || 1,
          });
        } else {
          alert('Gagal memuat data publikasi');
          router.push('/admin/publikasi');
        }
      } catch (error) {
        console.error('Error fetching publikasi:', error);
        alert('Terjadi kesalahan saat memuat data');
        router.push('/admin/publikasi');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchPublikasi();
    }
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/publikasi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/publikasi');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal mengupdate publikasi');
      }
    } catch (error) {
      console.error('Error updating publikasi:', error);
      alert('Terjadi kesalahan saat mengupdate publikasi');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-500">Memuat data publikasi...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const typeInfo = typeConfig[formData.type];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" size="sm" asChild>
        <Link href="/admin/publikasi">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Link>
      </Button>
      
      {/* Title Section */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{typeInfo.icon}</span>
          <Badge className={typeInfo.color}>
            {typeInfo.label}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
          Edit Publikasi
        </h1>
        <p className="text-gray-600 mb-4">
          {formData.title || 'Memuat judul publikasi...'}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/publikasi/detail/${id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/publikasi/${formData.slug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Lihat Publik
            </Link>
          </Button>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Informasi Dasar</span>
              <span className="sm:hidden">Dasar</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Konten</span>
              <span className="sm:hidden">Konten</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Media</span>
              <span className="sm:hidden">Media</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Pengaturan</span>
              <span className="sm:hidden">Setting</span>
            </TabsTrigger>
          </TabsList>

          <Card>
            <CardContent className="p-6">
              <TabsContent value="basic" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informasi Dasar</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Judul Publikasi *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="Masukkan judul publikasi"
                          required
                          className="text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug *</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="url-friendly-slug"
                          required
                        />
                        <p className="text-sm text-gray-500">
                          URL: /publikasi/{formData.slug}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi Singkat *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Deskripsi singkat publikasi yang akan ditampilkan di daftar publikasi"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="type">Jenis Publikasi *</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: 'riset' | 'artikel' | 'dampak') => 
                            setFormData(prev => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="riset">🔬 Riset</SelectItem>
                            <SelectItem value="artikel">📄 Artikel</SelectItem>
                            <SelectItem value="dampak">📊 Laporan Dampak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="author">Penulis *</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                          placeholder="Nama penulis"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">Tanggal Publikasi *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Konten Publikasi</h3>
                  <WysiwygEditor
                    label="Konten Publikasi *"
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                    placeholder="Tulis konten publikasi di sini..."
                    height={500}
                  />
                </div>
              </TabsContent>

              <TabsContent value="media" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Media & Dokumen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FileUpload
                          type="image"
                          label="Gambar Cover"
                          value={formData.image_url}
                          onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                        />
                        <p className="text-sm text-gray-500">Gambar yang akan ditampilkan sebagai cover publikasi</p>
                      </div>
                      
                      {formData.image_url && (
                        <div className="mt-4">
                          <Label className="text-sm text-gray-600">Preview:</Label>
                          <div className="mt-2 relative w-full max-w-sm">
                            <img
                              src={formData.image_url}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded-lg border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FileUpload
                          type="pdf"
                          label="Dokumen PDF"
                          value={formData.pdf_url}
                          onChange={(url) => setFormData(prev => ({ ...prev, pdf_url: url }))}
                        />
                        <p className="text-sm text-gray-500">File PDF yang dapat diunduh oleh pembaca</p>
                      </div>
                      
                      {formData.pdf_url && (
                        <div className="mt-4">
                          <Label className="text-sm text-gray-600">File PDF:</Label>
                          <div className="mt-2 flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <FileText className="h-8 w-8 text-red-500" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{formData.title}.pdf</p>
                              <p className="text-xs text-gray-600 break-all">{formData.pdf_url}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a href={formData.pdf_url} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pengaturan Publikasi</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="order">Urutan Tampilan</Label>
                        <Input
                          id="order"
                          type="number"
                          min="1"
                          value={formData.order}
                          onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                          placeholder="1"
                        />
                        <p className="text-sm text-gray-500">
                          Publikasi dengan urutan lebih kecil akan ditampilkan lebih dahulu
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Status Publikasi</Label>
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <div className="h-2 w-2 rounded-full" style={{backgroundColor: 'var(--success)'}}></div>
                          <span className="text-sm font-medium text-green-800">Aktif & Terpublikasi</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Publikasi ini akan terlihat oleh publik
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Preview URL</h4>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-white px-2 py-1 rounded border flex-1">
                          /publikasi/{formData.slug}
                        </code>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/publikasi/${formData.slug}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/publikasi">
                Batal
              </Link>
            </Button>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  const nextTab = activeTab === "basic" ? "content" : 
                                 activeTab === "content" ? "media" : 
                                 activeTab === "media" ? "settings" : "basic";
                  setActiveTab(nextTab);
                }}
              >
                {activeTab === "settings" ? "Kembali ke Dasar" : "Lanjut"}
              </Button>
              
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </div>
        </Tabs>
      </form>
    </div>
  );
} 