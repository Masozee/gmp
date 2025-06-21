"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
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
}

export default function CreatePublikasiPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PublikasiData>({
    title: '',
    slug: '',
    type: 'artikel',
    author: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    content: '',
    image_url: '',
    pdf_url: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/publikasi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/publikasi');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal membuat publikasi');
      }
    } catch (error) {
      console.error('Error creating publikasi:', error);
      alert('Terjadi kesalahan saat membuat publikasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/publikasi">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Buat Publikasi Baru</h1>
          <p className="text-muted-foreground">Tambahkan publikasi baru ke dalam sistem</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Publikasi</CardTitle>
          <CardDescription>
            Isi form di bawah untuk membuat publikasi baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Masukkan judul publikasi"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                  required
                />
              </div>
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
                    <SelectItem value="riset">Riset</SelectItem>
                    <SelectItem value="artikel">Artikel</SelectItem>
                    <SelectItem value="dampak">Dampak</SelectItem>
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

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi singkat publikasi"
                required
              />
            </div>

            <WysiwygEditor
              label="Konten *"
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              placeholder="Tulis konten publikasi di sini..."
              height={400}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                type="image"
                label="Gambar Utama"
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              />

              <FileUpload
                type="pdf"
                label="File PDF"
                value={formData.pdf_url}
                onChange={(url) => setFormData(prev => ({ ...prev, pdf_url: url }))}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/publikasi">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Menyimpan...' : 'Simpan Publikasi'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 