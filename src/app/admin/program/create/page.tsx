'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProgramSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  imagePosition: 'left' | 'right';
  backgroundColor?: 'white' | 'gray';
}

export default function CreateProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    subtitle: '',
    subtitleEn: '',
    description: '',
    descriptionEn: '',
    slug: '',
    heroImage: '',
    isActive: true,
    order: 0,
  });

  const [sections, setSections] = useState<ProgramSection[]>([]);
  const [sectionsEn, setSectionsEn] = useState<ProgramSection[]>([]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !prev.slug ? { slug: generateSlug(value) } : {})
    }));
  };

  const addSection = (language: 'id' | 'en') => {
    const newSection: ProgramSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
      imagePosition: 'left',
      backgroundColor: 'white'
    };

    if (language === 'id') {
      setSections(prev => [...prev, newSection]);
    } else {
      setSectionsEn(prev => [...prev, newSection]);
    }
  };

  const updateSection = (id: string, field: string, value: any, language: 'id' | 'en') => {
    const updateSections = language === 'id' ? setSections : setSectionsEn;
    updateSections(prev => prev.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const removeSection = (id: string, language: 'id' | 'en') => {
    const updateSections = language === 'id' ? setSections : setSectionsEn;
    updateSections(prev => prev.filter(section => section.id !== id));
  };

  const handleImageUpload = async (file: File, field: string, sectionId?: string) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (sectionId) {
          updateSection(sectionId, 'image', data.url, 'id');
        } else {
          handleInputChange(field, data.url);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const programData = {
        ...formData,
        content: JSON.stringify(sections),
        contentEn: JSON.stringify(sectionsEn),
      };

      const response = await fetch('/api/admin/program', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
      });

      if (response.ok) {
        router.push('/admin/program');
      } else {
        const error = await response.json();
        alert(error.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const renderSectionEditor = (section: ProgramSection, language: 'id' | 'en') => (
    <Card key={section.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Bagian {language === 'id' ? 'Indonesia' : 'English'}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => removeSection(section.id, language)}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Judul Bagian</Label>
          <Input
            value={section.title}
            onChange={(e) => updateSection(section.id, 'title', e.target.value, language)}
            placeholder="Masukkan judul bagian"
          />
        </div>

        <div>
          <Label>Konten</Label>
          <Textarea
            value={section.content}
            onChange={(e) => updateSection(section.id, 'content', e.target.value, language)}
            placeholder="Masukkan konten bagian"
            rows={6}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Posisi Gambar</Label>
            <select
              value={section.imagePosition}
              onChange={(e) => updateSection(section.id, 'imagePosition', e.target.value, language)}
              className="w-full p-2 border rounded"
            >
              <option value="left">Kiri</option>
              <option value="right">Kanan</option>
            </select>
          </div>

          <div>
            <Label>Background</Label>
            <select
              value={section.backgroundColor}
              onChange={(e) => updateSection(section.id, 'backgroundColor', e.target.value, language)}
              className="w-full p-2 border rounded"
            >
              <option value="white">Putih</option>
              <option value="gray">Abu-abu</option>
            </select>
          </div>
        </div>

        <div>
          <Label>Gambar Bagian</Label>
          <div className="mt-2">
            {section.image && (
              <div className="mb-2">
                <Image
                  src={section.image}
                  alt="Preview"
                  width={200}
                  height={150}
                  className="rounded object-cover"
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, '', section.id);
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/admin/program">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Tambah Program Baru</h1>
            <p className="text-muted-foreground">
              Buat program baru dengan konten yang kaya
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
            <TabsTrigger value="content-id">Konten Indonesia</TabsTrigger>
            <TabsTrigger value="content-en">Konten English</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar Program</CardTitle>
                <CardDescription>
                  Masukkan informasi dasar tentang program
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Judul Program (Indonesia)</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Masukkan judul program"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">Judul Program (English)</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      placeholder="Enter program title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subtitle">Subtitle (Indonesia)</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      placeholder="Masukkan subtitle"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitleEn">Subtitle (English)</Label>
                    <Input
                      id="subtitleEn"
                      value={formData.subtitleEn}
                      onChange={(e) => handleInputChange('subtitleEn', e.target.value)}
                      placeholder="Enter subtitle"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="slug">Slug URL</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="program-slug"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description">Deskripsi (Indonesia)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Masukkan deskripsi program"
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionEn">Deskripsi (English)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                      placeholder="Enter program description"
                      rows={4}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="heroImage">Gambar Hero</Label>
                  <div className="mt-2">
                    {formData.heroImage && (
                      <div className="mb-2">
                        <Image
                          src={formData.heroImage}
                          alt="Hero Preview"
                          width={300}
                          height={200}
                          className="rounded object-cover"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'heroImage');
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order">Urutan</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    />
                    <Label htmlFor="isActive">Aktif</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content-id">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Konten Indonesia</h2>
                <Button type="button" onClick={() => addSection('id')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Bagian
                </Button>
              </div>
              {sections.map(section => renderSectionEditor(section, 'id'))}
            </div>
          </TabsContent>

          <TabsContent value="content-en">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Konten English</h2>
                <Button type="button" onClick={() => addSection('en')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </div>
              {sectionsEn.map(section => renderSectionEditor(section, 'en'))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/program">Batal</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Program
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 