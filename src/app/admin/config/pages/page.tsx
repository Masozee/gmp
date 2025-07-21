"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Eye, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { PageContent } from '@/lib/db/content-schema';

export default function PagesConfigPage() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/page-content');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page content?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/page-content/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPages(pages.filter(page => page.id !== id));
      } else {
        alert('Failed to delete page content');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page content');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Page Content Management</h1>
          <p className="text-gray-600 mt-2">Manage editable content for static pages</p>
        </div>
        <Link href="/admin/config/pages/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Page
          </Button>
        </Link>
      </div>

      {pages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-500 text-lg mb-4">No pages found</div>
            <Link href="/admin/config/pages/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Page
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{page.pageName}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{page.pageKey}</Badge>
                      <Badge variant={page.isActive ? "default" : "secondary"}>
                        {page.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={page.pageUrl} target="_blank">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/config/pages/edit/${page.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">URL:</span> 
                    <span className="ml-2 text-blue-600">{page.pageUrl}</span>
                  </div>
                  {page.heroTitle && (
                    <div>
                      <span className="font-medium">Hero Title:</span> 
                      <span className="ml-2">{page.heroTitle}</span>
                    </div>
                  )}
                  {page.heroSubtitle && (
                    <div>
                      <span className="font-medium">Hero Subtitle:</span> 
                      <span className="ml-2 text-gray-600">{page.heroSubtitle}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 