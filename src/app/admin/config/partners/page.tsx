'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Upload
} from 'lucide-react';

interface Partner {
  id: number;
  name: string;
  logo: string;
  url: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface PartnerFormData {
  name: string;
  logo: string;
  url: string;
  order: number;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    logo: '',
    url: '',
    order: 1
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch partners
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/partners', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }

      const data = await response.json();
      setPartners(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  // Create partner
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const response = await fetch('/api/admin/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create partner');
      }

      setIsCreateModalOpen(false);
      setFormData({ name: '', logo: '', url: '', order: 1 });
      fetchPartners();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create partner');
    } finally {
      setFormLoading(false);
    }
  };

  // Update partner
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;

    setFormLoading(true);

    try {
      const response = await fetch(`/api/admin/partners/${editingPartner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update partner');
      }

      setIsEditModalOpen(false);
      setEditingPartner(null);
      setFormData({ name: '', logo: '', url: '', order: 1 });
      fetchPartners();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update partner');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete partner
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mitra ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete partner');
      }

      fetchPartners();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete partner');
    }
  };

  // Open edit modal
  const openEditModal = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logo: partner.logo,
      url: partner.url || '',
      order: partner.order
    });
    setIsEditModalOpen(true);
  };

  // Get next available order number
  const getNextOrder = () => {
    if (partners.length === 0) return 1;
    return Math.max(...partners.map(p => p.order)) + 1;
  };

  // Open create modal
  const openCreateModal = () => {
    setFormData({
      name: '',
      logo: '',
      url: '',
      order: getNextOrder()
    });
    setIsCreateModalOpen(true);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Filter partners based on search term
  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PartnerForm = ({ onSubmit }: { 
    onSubmit: (e: React.FormEvent) => void;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Mitra</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Masukkan nama mitra"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo URL</Label>
        <Input
          id="logo"
          value={formData.logo}
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
          placeholder="/images/partner/logo.png"
          required
        />
        <p className="text-sm text-muted-foreground">
          Path relatif dari folder public, contoh: /images/partner/logo.png
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Website URL (Opsional)</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order">Urutan Tampil</Label>
        <Input
          id="order"
          type="number"
          min="1"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
          required
        />
        <p className="text-sm text-muted-foreground">
          Angka yang lebih kecil akan ditampilkan lebih dulu
        </p>
      </div>

      {formData.logo && (
        <div className="space-y-2">
          <Label>Preview Logo</Label>
          <div className="border rounded-lg p-4 flex justify-center">
            <Image
              src={formData.logo}
              alt="Logo preview"
              width={100}
              height={100}
              className="object-contain"
              onError={() => {
                // Handle image load error
              }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
          }}
        >
          Batal
        </Button>
        <Button type="submit" disabled={formLoading}>
          {formLoading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Mitra Strategis</h1>
          <p className="text-muted-foreground">
            Kelola daftar mitra dan partner organisasi
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Mitra
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama mitra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Partners List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Mitra ({filteredPartners.length})</CardTitle>
          <CardDescription>
            Semua mitra strategis yang terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button onClick={fetchPartners} className="mt-4">
                Coba Lagi
              </Button>
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                <Upload className="h-12 w-12" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Tidak ada mitra</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Tidak ada mitra yang sesuai dengan pencarian.' : 'Belum ada mitra yang ditambahkan.'}
              </p>
              {!searchTerm && (
                <Button onClick={openCreateModal} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Mitra Pertama
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 relative">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-sm">{partner.name}</h3>
                    <Badge variant="secondary">Urutan: {partner.order}</Badge>
                    
                    {partner.url && (
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Kunjungi Website
                      </a>
                    )}
                  </div>

                  <div className="flex justify-center space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(partner)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(partner.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Sheet open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <SheetContent className="max-w-md">
          <SheetHeader>
            <SheetTitle>Tambah Mitra Baru</SheetTitle>
            <SheetDescription>
              Tambahkan mitra strategis baru ke dalam daftar
            </SheetDescription>
          </SheetHeader>
          <PartnerForm onSubmit={handleCreate} />
        </SheetContent>
      </Sheet>

      {/* Edit Modal */}
      <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <SheetContent className="max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Mitra</SheetTitle>
            <SheetDescription>
              Ubah informasi mitra strategis
            </SheetDescription>
          </SheetHeader>
          <PartnerForm onSubmit={handleUpdate} />
        </SheetContent>
      </Sheet>
    </div>
  );
} 