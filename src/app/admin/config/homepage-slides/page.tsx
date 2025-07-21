'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, Image as ImageIcon, Map, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface HomepageSlide {
  id: number;
  type: 'map' | 'image';
  order: number;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  title_en?: string;
  subtitle_en?: string;
  description_en?: string;
  buttonText_en?: string;
  buttonLink_en?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NewSlide {
  type: 'map' | 'image';
  order: number;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  title_en?: string;
  subtitle_en?: string;
  description_en?: string;
  buttonText_en?: string;
  buttonLink_en?: string;
  isActive: boolean;
}

export default function HomepageSlidesPage() {
  const [slides, setSlides] = useState<HomepageSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HomepageSlide | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newSlide, setNewSlide] = useState<NewSlide>({
    type: 'image',
    order: 1,
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    title_en: '',
    subtitle_en: '',
    description_en: '',
    buttonText_en: '',
    buttonLink_en: '',
    isActive: true,
  });

  // Fetch slides
  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/homepage-slides');
      if (!response.ok) throw new Error('Failed to fetch slides');
      const data = await response.json();
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Gagal memuat data slider');
    } finally {
      setLoading(false);
    }
  };

  // Create slide
  const createSlide = async () => {
    try {
      const response = await fetch('/api/admin/homepage-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSlide),
      });
      
      if (!response.ok) throw new Error('Failed to create slide');
      
      toast.success('Slide berhasil ditambahkan');
      setShowAddForm(false);
      setNewSlide({
        type: 'image',
        order: slides.length + 1,
        title: '',
        subtitle: '',
        description: '',
        image: '',
        buttonText: '',
        buttonLink: '',
        title_en: '',
        subtitle_en: '',
        description_en: '',
        buttonText_en: '',
        buttonLink_en: '',
        isActive: true,
      });
      fetchSlides();
    } catch (error) {
      console.error('Error creating slide:', error);
      toast.error('Gagal menambahkan slide');
    }
  };

  // Update slide
  const updateSlide = async (slide: HomepageSlide) => {
    try {
      const response = await fetch(`/api/admin/homepage-slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide),
      });
      
      if (!response.ok) throw new Error('Failed to update slide');
      
      toast.success('Slide berhasil diperbarui');
      setEditingSlide(null);
      fetchSlides();
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Gagal memperbarui slide');
    }
  };

  // Delete slide
  const deleteSlide = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus slide ini?')) return;
    
    try {
      const response = await fetch(`/api/admin/homepage-slides/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete slide');
      
      toast.success('Slide berhasil dihapus');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Gagal menghapus slide');
    }
  };

  // Move slide up/down
  const moveSlide = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === slides.length - 1)
    ) return;

    const newOrder = direction === 'up' ? slides[currentIndex].order - 1 : slides[currentIndex].order + 1;
    const targetSlide = slides.find(s => s.order === newOrder);
    
    if (!targetSlide) return;

    try {
      // Swap orders
      await fetch(`/api/admin/homepage-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slides[currentIndex], order: newOrder }),
      });

      await fetch(`/api/admin/homepage-slides/${targetSlide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...targetSlide, order: slides[currentIndex].order }),
      });

      fetchSlides();
    } catch (error) {
      console.error('Error moving slide:', error);
      toast.error('Gagal memindahkan slide');
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File, isEditing: boolean) => {
    setUploading(true);
    try {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File terlalu besar. Maksimal 10MB.');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipe file tidak didukung. Gunakan JPEG, PNG, GIF, atau WebP.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Upload gagal');
      }
      
      if (isEditing) {
        setEditingSlide(prev => prev ? { ...prev, image: data.url } : null);
      } else {
        setNewSlide(prev => ({ ...prev, image: data.url }));
      }
      
      toast.success(`Gambar berhasil diupload: ${data.filename}`);
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengupload gambar';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const renderSlideForm = (slide: HomepageSlide | NewSlide, isEditing: boolean) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipe Slide</Label>
          <Select
            value={slide.type}
            onValueChange={(value: 'map' | 'image') => 
              isEditing 
                ? setEditingSlide(prev => prev ? { ...prev, type: value } : null)
                : setNewSlide(prev => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="map">Peta Interaktif</SelectItem>
              <SelectItem value="image">Gambar dengan Konten</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="order">Urutan</Label>
          <Input
            type="number"
            min="1"
            value={slide.order}
            onChange={(e) => 
              isEditing 
                ? setEditingSlide(prev => prev ? { ...prev, order: parseInt(e.target.value) } : null)
                : setNewSlide(prev => ({ ...prev, order: parseInt(e.target.value) }))
            }
          />
        </div>
      </div>

      {/* Indonesian Content fields */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h4 className="font-medium text-gray-800">Konten Bahasa Indonesia</h4>
        </div>

        <div>
          <Label htmlFor="title">Judul</Label>
          <Input
            value={slide.title || ''}
            onChange={(e) => 
              isEditing 
                ? setEditingSlide(prev => prev ? { ...prev, title: e.target.value } : null)
                : setNewSlide(prev => ({ ...prev, title: e.target.value }))
            }
            placeholder={slide.type === 'map' ? 'Understanding Youth Engagement and Civic Space in Indonesia' : 'Judul slide'}
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Subjudul</Label>
          <Input
            value={slide.subtitle || ''}
            onChange={(e) => 
              isEditing 
                ? setEditingSlide(prev => prev ? { ...prev, subtitle: e.target.value } : null)
                : setNewSlide(prev => ({ ...prev, subtitle: e.target.value }))
            }
            placeholder={slide.type === 'map' ? 'Laporan Survei Keterlibatan Sipil Anak Muda' : 'Subjudul slide'}
          />
        </div>

        <div>
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            value={slide.description || ''}
            onChange={(e) => 
              isEditing 
                ? setEditingSlide(prev => prev ? { ...prev, description: e.target.value } : null)
                : setNewSlide(prev => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            placeholder={slide.type === 'map' 
              ? 'Jelajahi data survei tentang keterlibatan sipil anak muda Indonesia. Hover pada peta untuk melihat statistik per wilayah.' 
              : 'Deskripsi konten slide'
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="buttonText">Teks Tombol</Label>
            <Input
              value={slide.buttonText || ''}
              onChange={(e) => 
                isEditing 
                  ? setEditingSlide(prev => prev ? { ...prev, buttonText: e.target.value } : null)
                  : setNewSlide(prev => ({ ...prev, buttonText: e.target.value }))
              }
              placeholder={slide.type === 'map' ? 'Lihat Laporan Lengkap' : 'Pelajari Lebih Lanjut'}
            />
          </div>

          <div>
            <Label htmlFor="buttonLink">Link Tombol</Label>
            <Input
              value={slide.buttonLink || ''}
              onChange={(e) => 
                isEditing 
                  ? setEditingSlide(prev => prev ? { ...prev, buttonLink: e.target.value } : null)
                  : setNewSlide(prev => ({ ...prev, buttonLink: e.target.value }))
              }
              placeholder={slide.type === 'map' ? '/ruang-sipil' : '/tentang-kami/tujuan'}
            />
          </div>
        </div>
      </div>

      {/* English Content fields */}
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-2">
          <h4 className="font-medium text-gray-800">English Content (Optional)</h4>
          <p className="text-sm text-gray-500">Leave empty to use Indonesian content as fallback</p>
        </div>

        <div>
          <Label htmlFor="title_en">Title (English)</Label>
          <Input
            value={slide.title_en || ''}
            onChange={(e) => 
              isEditing 
                ? setEditingSlide(prev => prev ? { ...prev, title_en: e.target.value } : null)
                : setNewSlide(prev => ({ ...prev, title_en: e.target.value }))
            }
            placeholder={slide.type === 'map' ? 'Understanding Youth Engagement and Civic Space in Indonesia' : 'English slide title'}
          />
        </div>

        <div>
          <Label htmlFor="subtitle_en">Subtitle (English)</Label>
          <Input
            value={slide.subtitle_en || ''}
            onChange={(e) => 
              isEditing 
                ? setEditingSlide(prev => prev ? { ...prev, subtitle_en: e.target.value } : null)
                : setNewSlide(prev => ({ ...prev, subtitle_en: e.target.value }))
            }
            placeholder={slide.type === 'map' ? 'Youth Civic Engagement Survey Report' : 'English slide subtitle'}
          />
        </div>

        <div>
          <Label htmlFor="description_en">Description (English)</Label>
          <Textarea
            value={slide.description_en || ''}
            onChange={(e) => 
              isEditing 
                ? setEditingSlide(prev => prev ? { ...prev, description_en: e.target.value } : null)
                : setNewSlide(prev => ({ ...prev, description_en: e.target.value }))
            }
            rows={3}
            placeholder={slide.type === 'map' 
              ? 'Explore survey data on Indonesian youth civic engagement. Hover over the map to see regional statistics.' 
              : 'English slide content description'
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="buttonText_en">Button Text (English)</Label>
            <Input
              value={slide.buttonText_en || ''}
              onChange={(e) => 
                isEditing 
                  ? setEditingSlide(prev => prev ? { ...prev, buttonText_en: e.target.value } : null)
                  : setNewSlide(prev => ({ ...prev, buttonText_en: e.target.value }))
              }
              placeholder={slide.type === 'map' ? 'View Full Report' : 'Learn More'}
            />
          </div>

          <div>
            <Label htmlFor="buttonLink_en">Button Link (English)</Label>
            <Input
              value={slide.buttonLink_en || ''}
              onChange={(e) => 
                isEditing 
                  ? setEditingSlide(prev => prev ? { ...prev, buttonLink_en: e.target.value } : null)
                  : setNewSlide(prev => ({ ...prev, buttonLink_en: e.target.value }))
              }
              placeholder={slide.type === 'map' ? '/en/civic-space' : '/en/about-us/mission'}
            />
          </div>
        </div>
      </div>

      {/* Image-specific fields */}
      {slide.type === 'image' && (
        <div>
          <Label htmlFor="image">Gambar</Label>
          <div className="space-y-3">
            {/* Image Upload */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && !uploading) {
                    handleImageUpload(file, isEditing);
                  }
                }}
                disabled={uploading}
                className="hidden"
                id={`image-upload-${isEditing ? 'edit' : 'new'}`}
              />
              <label
                htmlFor={`image-upload-${isEditing ? 'edit' : 'new'}`}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium cursor-pointer transition-colors ${
                  uploading 
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Upload className={`w-4 h-4 mr-2 ${uploading ? 'animate-spin' : ''}`} />
                {uploading ? 'Mengupload...' : 'Upload Gambar'}
              </label>
              {slide.image && (
                <span className="text-sm text-green-600">✓ Gambar tersedia</span>
              )}
            </div>
            
            {/* URL Input as alternative */}
            <div>
              <Label htmlFor="image-url" className="text-sm text-gray-500">Atau masukkan URL gambar</Label>
              <Input
                id="image-url"
                value={slide.image || ''}
                onChange={(e) => 
                  isEditing 
                    ? setEditingSlide(prev => prev ? { ...prev, image: e.target.value } : null)
                    : setNewSlide(prev => ({ ...prev, image: e.target.value }))
                }
                placeholder="/images/bg/example.jpg"
                className="mt-1"
              />
            </div>
            
            {/* Image Preview */}
            {slide.image && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 border">
                <Image
                  src={slide.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map-specific fields */}
      {slide.type === 'map' && (
        <>
          <div>
            <Label htmlFor="map-image">Gambar Poster/Card</Label>
            <div className="space-y-3">
              {/* Image Upload */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && !uploading) {
                      handleImageUpload(file, isEditing);
                    }
                  }}
                  disabled={uploading}
                  className="hidden"
                  id={`map-image-upload-${isEditing ? 'edit' : 'new'}`}
                />
                <label
                  htmlFor={`map-image-upload-${isEditing ? 'edit' : 'new'}`}
                  className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium cursor-pointer transition-colors ${
                    uploading 
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  <Upload className={`w-4 h-4 mr-2 ${uploading ? 'animate-spin' : ''}`} />
                  {uploading ? 'Mengupload...' : 'Upload Gambar Card'}
                </label>
                {slide.image && (
                  <span className="text-sm text-green-600">✓ Gambar tersedia</span>
                )}
              </div>
              
              {/* URL Input as alternative */}
              <div>
                <Label htmlFor="map-image-url" className="text-sm text-gray-500">Atau masukkan URL gambar</Label>
                <Input
                  id="map-image-url"
                  value={slide.image || ''}
                  onChange={(e) => 
                    isEditing 
                      ? setEditingSlide(prev => prev ? { ...prev, image: e.target.value } : null)
                      : setNewSlide(prev => ({ ...prev, image: e.target.value }))
                  }
                  placeholder="/images/report/pub-1.jpg"
                  className="mt-1"
                />
              </div>
              
              {/* Image Preview */}
              {slide.image && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 border">
                  <Image
                    src={slide.image}
                    alt="Preview gambar card"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Informasi Peta Interaktif</h4>
            <p className="text-sm text-blue-700 mb-2">
              Peta interaktif akan menampilkan data survei keterlibatan sipil anak muda Indonesia dengan fitur:
            </p>
            <ul className="text-xs text-blue-600 list-disc list-inside space-y-1">
              <li>Hover pada provinsi untuk melihat statistik per wilayah</li>
              <li>Data demografi, aktivisme, dan keterlibatan politik</li>
              <li>Overlay card dengan gambar poster, judul, subjudul, deskripsi, dan tombol</li>
              <li>Responsif dan interaktif untuk semua perangkat</li>
            </ul>
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          checked={slide.isActive}
          onCheckedChange={(checked) => 
            isEditing 
              ? setEditingSlide(prev => prev ? { ...prev, isActive: checked } : null)
              : setNewSlide(prev => ({ ...prev, isActive: checked }))
          }
        />
        <Label>Aktif</Label>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <p className="text-muted-foreground">Memuat data slider...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Slider Homepage</h1>
          <p className="text-muted-foreground">
            Kelola slide yang ditampilkan di halaman utama
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Slide
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tambah Slide Baru</CardTitle>
          </CardHeader>
          <CardContent>
            {renderSlideForm(newSlide, false)}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="mr-2 h-4 w-4" />
                Batal
              </Button>
              <Button onClick={createSlide}>
                <Save className="mr-2 h-4 w-4" />
                Simpan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slides List */}
      <div className="space-y-4">
        {slides.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                Belum ada slide
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Tambahkan slide pertama untuk homepage
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Slide
              </Button>
            </CardContent>
          </Card>
        ) : (
          slides
            .sort((a, b) => a.order - b.order)
            .map((slide) => (
              <Card key={slide.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {slide.type === 'map' ? (
                        <Map className="h-5 w-5 text-blue-500" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <CardTitle className="text-lg">
                          {slide.type === 'map' ? 'Peta Interaktif' : slide.title || 'Slide Gambar'}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Urutan: {slide.order} • {slide.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={slide.isActive ? 'default' : 'secondary'}>
                        {slide.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSlide(slide.id, 'up')}
                        disabled={slide.order === 1}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSlide(slide.id, 'down')}
                        disabled={slide.order === slides.length}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSlide(slide)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSlide(slide.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {slide.type === 'image' && (
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        {slide.image && (
                          <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={slide.image}
                              alt={slide.title || 'Slide preview'}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {slide.subtitle && (
                          <p className="text-sm text-primary font-medium">{slide.subtitle}</p>
                        )}
                        {slide.description && (
                          <p className="text-sm text-muted-foreground">{slide.description}</p>
                        )}
                        {slide.buttonText && slide.buttonLink && (
                          <div className="text-xs text-muted-foreground">
                            Tombol: {slide.buttonText} → {slide.buttonLink}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}

                {/* Edit Form */}
                {editingSlide?.id === slide.id && (
                  <CardContent className="border-t">
                    <div className="space-y-4">
                      <h4 className="font-medium">Edit Slide</h4>
                      {renderSlideForm(editingSlide, true)}
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEditingSlide(null)}>
                          <X className="mr-2 h-4 w-4" />
                          Batal
                        </Button>
                        <Button onClick={() => updateSlide(editingSlide)}>
                          <Save className="mr-2 h-4 w-4" />
                          Simpan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
