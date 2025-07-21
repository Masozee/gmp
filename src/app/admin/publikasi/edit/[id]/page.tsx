"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Eye, ExternalLink, FileText, Globe } from "lucide-react";
import { WysiwygEditor } from "@/components/ui/wysiwyg-editor";
import { FileUpload } from "@/components/ui/file-upload";

interface PublikasiData {
  title: string;
  title_en: string;
  slug: string;
  slug_en: string;
  type: 'riset' | 'artikel' | 'dampak';
  author: string;
  author_en: string;
  date: string;
  description: string;
  description_en: string;
  content: string;
  content_en: string;
  image_url: string;
  pdf_url: string;
  order: number;
}

const typeConfig = {
  riset: {
    label: 'Riset',
    label_en: 'Research',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: '🔬'
  },
  artikel: {
    label: 'Artikel',
    label_en: 'Article',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: '📄'
  },
  dampak: {
    label: 'Laporan Dampak',
    label_en: 'Impact Report',
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
  const [isEnglishEnabled, setIsEnglishEnabled] = useState(false);
  const [formData, setFormData] = useState<PublikasiData>({
    title: '',
    title_en: '',
    slug: '',
    slug_en: '',
    type: 'artikel',
    author: '',
    author_en: '',
    date: '',
    description: '',
    description_en: '',
    content: '',
    content_en: '',
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

  const handleTitleChange = (value: string, isEnglish = false) => {
    if (isEnglish) {
      setFormData(prev => ({
        ...prev,
        title_en: value,
        slug_en: generateSlug(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value)
      }));
    }
  };

  useEffect(() => {
    const fetchPublikasi = async () => {
      try {
        const response = await fetch(`/api/admin/publikasi/${id}`);
        if (response.ok) {
          const result = await response.json();
          const data = result.data || result;
          // Enable English by default, and populate with main data if English fields are empty
          setIsEnglishEnabled(true);
          
          setFormData({
            title: data.title || '',
            title_en: data.title_en || data.title || '',
            slug: data.slug || '',
            slug_en: data.slug_en || data.slug || '',
            type: data.type || 'artikel',
            author: data.author || '',
            author_en: data.author_en || data.author || '',
            date: data.date ? data.date.split('T')[0] : '',
            description: data.description || '',
            description_en: data.description_en || data.description || '',
            content: data.content || '',
            content_en: data.content_en || data.content || '',
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* English Version Toggle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Dukungan Bahasa Inggris
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Aktifkan untuk menambahkan versi bahasa Inggris dari publikasi ini
                </p>
              </div>
              <Switch
                checked={isEnglishEnabled}
                onCheckedChange={setIsEnglishEnabled}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>
          </CardHeader>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informasi Dasar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Indonesian Version */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">🇮🇩 Bahasa Indonesia</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Publikasi *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Masukkan judul publikasi"
                    required
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
                  <Label htmlFor="description">Deskripsi Singkat *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi singkat publikasi"
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* English Version */}
              {isEnglishEnabled && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">🇺🇸 English Version</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title_en">Publication Title</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) => handleTitleChange(e.target.value, true)}
                      placeholder="Enter publication title in English"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug_en">URL Slug (English)</Label>
                    <Input
                      id="slug_en"
                      value={formData.slug_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug_en: e.target.value }))}
                      placeholder="english-url-slug"
                    />
                    <p className="text-sm text-gray-500">
                      URL: /en/publications/{formData.slug_en}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author_en">Author (English)</Label>
                    <Input
                      id="author_en"
                      value={formData.author_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, author_en: e.target.value }))}
                      placeholder="Author name in English"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description_en">Short Description (English)</Label>
                    <Textarea
                      id="description_en"
                      value={formData.description_en}
                      onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                      placeholder="Brief description in English"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Shared Fields */}
            <Separator />
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
                <Label htmlFor="date">Tanggal Publikasi *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

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
                  Urutan lebih kecil tampil lebih dahulu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>Konten Publikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Indonesian Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">🇮🇩 Konten Bahasa Indonesia *</span>
                </div>
                <WysiwygEditor
                  label=""
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Tulis konten publikasi di sini..."
                  height={400}
                />
              </div>

              {/* English Content */}
              {isEnglishEnabled && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">🇺🇸 English Content</span>
                  </div>
                  <WysiwygEditor
                    label=""
                    value={formData.content_en}
                    onChange={(value) => setFormData(prev => ({ ...prev, content_en: value }))}
                    placeholder="Write content in English here..."
                    height={400}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Media & Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Media & Dokumen</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Preview URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Preview URLs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Indonesian Version</h4>
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
              
              {isEnglishEnabled && formData.slug_en && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">English Version</h4>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-2 py-1 rounded border flex-1">
                      /en/publications/{formData.slug_en}
                    </code>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/en/publications/${formData.slug_en}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/publikasi">
              Batal
            </Link>
          </Button>
          
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
}