'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Settings, Image, Unplug, Share2 } from 'lucide-react';

export default function ConfigPage() {
  const configOptions = [
    {
      title: 'Slider Homepage',
      description: 'Kelola slide yang ditampilkan pada halaman utama website',
      icon: SlidersHorizontal,
      href: '/admin/config/homepage-slides',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Mitra Strategis',
      description: 'Kelola daftar mitra dan partner organisasi',
      icon: Unplug,
      href: '/admin/config/partners',
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Media Sosial',
      description: 'Kelola tautan media sosial yang ditampilkan di footer',
      icon: Share2,
      href: '/admin/config/social-media',
      color: 'text-purple-600 bg-purple-100',
    },
    // Add more config options here in the future
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Konfigurasi Website</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan dan konfigurasi website
        </p>
      </div>

      {/* Configuration Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card key={option.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${option.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {option.description}
                </CardDescription>
                <Button asChild className="w-full">
                  <Link href={option.href}>
                    <Settings className="mr-2 h-4 w-4" />
                    Kelola
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Future Configuration Options Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Image className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Konfigurasi Lainnya</h3>
          <p className="text-muted-foreground text-center">
            Opsi konfigurasi lainnya akan ditambahkan di sini
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
