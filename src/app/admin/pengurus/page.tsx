'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, Users, Grid, List, Eye, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import PengurusForm from '@/components/pengurus-form';

interface PengurusData {
  id: number;
  name: string;
  position: string;
  department: string;
  type: 'board' | 'staff';
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  status: 'active' | 'inactive';
  bio: string;
  photo: string;
  socialMedia: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  order?: number;
  isActive?: boolean;
}

// Fetch pengurus data from API
const fetchPengurusData = async (): Promise<PengurusData[]> => {
  try {
    const response = await fetch('/api/admin/pengurus');
    if (!response.ok) {
      throw new Error('Failed to fetch pengurus data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching pengurus data:', error);
    return [];
  }
};

export default function AdminPengurusPage() {
  const [pengurusData, setPengurusData] = useState<PengurusData[]>([]);
  const [filteredData, setFilteredData] = useState<PengurusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedPengurus, setSelectedPengurus] = useState<PengurusData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPengurus, setEditingPengurus] = useState<PengurusData | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchPengurusData();
      setPengurusData(data);
      setFilteredData(data);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Filter data based on search and selections
  useEffect(() => {
    let filtered = pengurusData;

    if (searchQuery) {
      filtered = filtered.filter(pengurus => 
        pengurus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pengurus.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pengurus.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(pengurus => pengurus.department === selectedDepartment);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(pengurus => pengurus.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(pengurus => pengurus.type === selectedType);
    }

    setFilteredData(filtered);
  }, [searchQuery, selectedDepartment, selectedStatus, selectedType, pengurusData]);

  // Get unique departments
  const departments = [...new Set(pengurusData.map(p => p.department))];

  // View pengurus details
  const viewPengurusDetails = (pengurus: PengurusData) => {
    setSelectedPengurus(pengurus);
    setShowDetailsModal(true);
  };

  // Create new pengurus
  const handleCreatePengurus = () => {
    setEditingPengurus(null);
    setShowFormModal(true);
  };

  // Edit pengurus
  const handleEditPengurus = (pengurus: PengurusData) => {
    setEditingPengurus(pengurus);
    setShowFormModal(true);
  };

  // Save pengurus (create or update)
  const handleSavePengurus = async (formData: any) => {
    setFormLoading(true);
    try {
      if (editingPengurus) {
        // Update existing pengurus
        const response = await fetch(`/api/admin/pengurus/${editingPengurus.id}?type=${editingPengurus.type}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to update pengurus');
        }
      } else {
        // Create new pengurus
        const response = await fetch('/api/admin/pengurus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to create pengurus');
        }
      }

      // Reload data
      const data = await fetchPengurusData();
      setPengurusData(data);
      setFilteredData(data);
      
      // Close form
      setShowFormModal(false);
      setEditingPengurus(null);
    } catch (error) {
      console.error('Error saving pengurus:', error);
      alert('Gagal menyimpan data pengurus. Silakan coba lagi.');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete pengurus
  const handleDeletePengurus = async (pengurus: PengurusData) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus ${pengurus.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/pengurus/${pengurus.id}?type=${pengurus.type}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete pengurus');
      }

      // Reload data
      const data = await fetchPengurusData();
      setPengurusData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error deleting pengurus:', error);
      alert('Gagal menghapus data pengurus. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-500">Memuat data pengurus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Pengurus
          </h1>
          <p className="text-muted-foreground">
            Kelola data pengurus dan struktur organisasi Partisipasi Muda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreatePengurus} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Pengurus
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengurus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pengurusData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pengurusData.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tidak Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pengurusData.filter(p => p.status === 'inactive').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departemen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, posisi, atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pilih Departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Departemen</SelectItem>
                {departments.map((dept, index) => (
                  <SelectItem key={`dept-${index}-${dept}`} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="board">Dewan</SelectItem>
                <SelectItem value="staff">Staf</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Menampilkan {filteredData.length} dari {pengurusData.length} pengurus
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tampilan:</span>
              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Display */}
      {viewMode === 'cards' ? (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((pengurus) => (
            <Card key={`${pengurus.type}-${pengurus.id}`} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src={pengurus.photo}
                      alt={pengurus.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pengurus.name)}&background=59caf5&color=fff`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{pengurus.name}</CardTitle>
                    <CardDescription className="font-medium text-blue-600">
                      {pengurus.position}
                    </CardDescription>
                    <Badge variant={pengurus.status === 'active' ? 'default' : 'secondary'} className="text-xs mt-1">
                      {pengurus.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{pengurus.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{pengurus.email || 'Tidak ada email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Urutan: {pengurus.order || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewPengurusDetails(pengurus)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditPengurus(pengurus)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeletePengurus(pengurus)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardHeader>
            <CardTitle>Data Pengurus</CardTitle>
            <CardDescription>
              Tampilan tabel data pengurus organisasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Posisi</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Urutan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bergabung</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((pengurus) => (
                    <TableRow key={`${pengurus.type}-${pengurus.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                            <Image
                              src={pengurus.photo}
                              alt={pengurus.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pengurus.name)}&background=59caf5&color=fff`;
                              }}
                            />
                          </div>
                          <span className="font-medium">{pengurus.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {pengurus.position}
                      </TableCell>
                      <TableCell>{pengurus.department}</TableCell>
                      <TableCell>{pengurus.email || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {pengurus.order || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={pengurus.status === 'active' ? 'default' : 'secondary'}>
                          {pengurus.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(pengurus.joinDate).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewPengurusDetails(pengurus)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPengurus(pengurus)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeletePengurus(pengurus)}
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
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Detail Pengurus
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap pengurus organisasi
            </DialogDescription>
          </DialogHeader>
          
          {selectedPengurus && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={selectedPengurus.photo}
                    alt={selectedPengurus.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedPengurus.name)}&background=59caf5&color=fff`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedPengurus.name}</h3>
                  <p className="text-blue-600 font-medium">{selectedPengurus.position}</p>
                  <p className="text-muted-foreground">{selectedPengurus.department}</p>
                  <Badge variant={selectedPengurus.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                    {selectedPengurus.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Informasi Kontak</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedPengurus.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedPengurus.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedPengurus.location}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Informasi Organisasi</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Bergabung: </span>
                      {new Date(selectedPengurus.joinDate).toLocaleDateString('id-ID')}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Departemen: </span>
                      {selectedPengurus.department}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Biografi</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedPengurus.bio}
                </p>
              </div>

              {/* Social Media */}
              {(selectedPengurus.socialMedia.instagram || selectedPengurus.socialMedia.linkedin || selectedPengurus.socialMedia.twitter) && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Media Sosial</h4>
                  <div className="flex gap-4">
                    {selectedPengurus.socialMedia.instagram && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Instagram: </span>
                        {selectedPengurus.socialMedia.instagram}
                      </div>
                    )}
                    {selectedPengurus.socialMedia.linkedin && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">LinkedIn: </span>
                        {selectedPengurus.socialMedia.linkedin}
                      </div>
                    )}
                    {selectedPengurus.socialMedia.twitter && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Twitter: </span>
                        {selectedPengurus.socialMedia.twitter}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Form Modal */}
      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPengurus ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingPengurus ? 'Perbarui informasi pengurus' : 'Masukkan informasi pengurus baru'}
            </DialogDescription>
          </DialogHeader>
          <PengurusForm
            pengurus={editingPengurus || undefined}
            onSave={handleSavePengurus}
            onCancel={() => {
              setShowFormModal(false);
              setEditingPengurus(null);
            }}
            isLoading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}