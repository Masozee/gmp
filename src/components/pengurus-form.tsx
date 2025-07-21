'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, X, Upload, User } from 'lucide-react';
import Image from 'next/image';

interface PengurusFormData {
  id?: number;
  type: 'board' | 'staff';
  name: string;
  position: string;
  bio: string;
  photo?: string;
  email?: string;
  socialMedia?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  order?: number;
  isActive?: boolean;
}

interface PengurusFormProps {
  pengurus?: PengurusFormData;
  onSave: (data: PengurusFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PengurusForm({ pengurus, onSave, onCancel, isLoading }: PengurusFormProps) {
  const [formData, setFormData] = useState<PengurusFormData>({
    type: 'staff',
    name: '',
    position: '',
    bio: '',
    photo: '',
    email: '',
    socialMedia: {
      instagram: '',
      linkedin: '',
      twitter: ''
    },
    order: 0,
    isActive: true,
    ...pengurus
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string>('');

  useEffect(() => {
    if (pengurus) {
      setFormData({
        type: pengurus.type || 'staff',
        name: pengurus.name || '',
        position: pengurus.position || '',
        bio: pengurus.bio || '',
        photo: pengurus.photo || '',
        email: pengurus.email || '',
        socialMedia: {
          instagram: pengurus.socialMedia?.instagram || '',
          linkedin: pengurus.socialMedia?.linkedin || '',
          twitter: pengurus.socialMedia?.twitter || ''
        },
        order: pengurus.order || 0,
        isActive: pengurus.isActive ?? true
      });
    }
    if (pengurus?.photo) {
      setPhotoPreview(pengurus.photo);
    }
  }, [pengurus]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    }

    if (!formData.position || !formData.position.trim()) {
      newErrors.position = 'Posisi harus diisi';
    }

    if (!formData.bio || !formData.bio.trim()) {
      newErrors.bio = 'Biografi harus diisi';
    }

    if (formData.type === 'staff' && formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server/cloud storage
      // For now, we'll create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      
      // In production, replace this with actual file upload logic
      handleInputChange('photo', previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving pengurus:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informasi Dasar</h3>
          
          {/* Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipe Pengurus</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleInputChange('type', value as 'board' | 'staff')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe pengurus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="board">Dewan Pengurus</SelectItem>
                <SelectItem value="staff">Tim Manajemen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Masukkan nama lengkap"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Posisi/Jabatan *</Label>
            <Input
              id="position"
              value={formData.position || ''}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder="Masukkan posisi atau jabatan"
              className={errors.position ? 'border-red-500' : ''}
            />
            {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biografi *</Label>
            <Textarea
              id="bio"
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Masukkan biografi singkat"
              rows={4}
              className={errors.bio ? 'border-red-500' : ''}
            />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
          </div>
        </div>

        <Separator />

        {/* Photo Upload */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Foto Profil</h3>
          
          <div className="flex items-start gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-dashed border-gray-300">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => setPhotoPreview('')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <Label htmlFor="photo" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                  <span>Upload Foto</span>
                </div>
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-1">
                Format: JPG, PNG. Maksimal 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Staff-specific fields */}
        {formData.type === 'staff' && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informasi Kontak</h3>
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Masukkan alamat email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
            </div>

            <Separator />

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Media Sosial</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.socialMedia?.instagram || ''}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="@username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.socialMedia?.linkedin || ''}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                    placeholder="username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.socialMedia?.twitter || ''}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Additional Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pengaturan Tambahan</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Urutan Tampilan</Label>
              <Input
                id="order"
                type="number"
                value={formData.order || 0}
                onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.isActive ? 'active' : 'inactive'} 
                onValueChange={(value) => handleInputChange('isActive', value === 'active')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button type="submit" disabled={isLoading} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Menyimpan...' : (pengurus ? 'Perbarui' : 'Simpan')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}