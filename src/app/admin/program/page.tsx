'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Eye, Trash2, Globe } from 'lucide-react';
import { Program } from '@/lib/db/content-schema';

export default function AdminProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/admin/program');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs || []);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus program ini?')) return;

    try {
      const response = await fetch(`/api/admin/program/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPrograms(programs.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Program</h1>
          <p className="text-muted-foreground">
            Kelola program-program organisasi
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/program/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Program
          </Link>
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
              placeholder="Cari berdasarkan judul atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <p>Memuat program...</p>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? 'Tidak ada program yang ditemukan' : 'Belum ada program'}
            </p>
          </div>
        ) : (
          filteredPrograms.map((program) => (
            <Card key={program.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={program.heroImage || '/images/program/default-program.jpg'}
                  alt={program.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={program.isActive ? "default" : "secondary"}>
                    {program.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{program.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/program/${program.slug}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Lihat
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/program/edit/${program.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(program.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 