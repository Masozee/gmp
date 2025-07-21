'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PageContent {
  id: number;
  pageKey: string;
  pageName: string;
  pageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBackgroundColor: string;
  sections: any[];
  isActive: boolean;
}

const TestDynamicPage = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all pages
  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/page-content');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific page
  const fetchPage = async (pageKey: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/page-content?pageKey=${pageKey}`);
      const data = await response.json();
      setSelectedPage(data);
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Dynamic Content API Test</h1>
      
      {/* All Pages */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">All Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Card key={page.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{page.pageName}</CardTitle>
                <p className="text-sm text-gray-600">{page.pageUrl}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Hero Title:</strong> {page.heroTitle}</p>
                  <p className="text-sm"><strong>Sections:</strong> {page.sections?.length || 0}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => fetchPage(page.pageKey)}
                      disabled={loading}
                    >
                      Load Content
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(page.pageUrl, '_blank')}
                    >
                      Visit Page
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Page Details */}
      {selectedPage && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Page Content Details</h2>
          <Card>
            <CardHeader>
              <CardTitle>{selectedPage.pageName}</CardTitle>
              <p className="text-gray-600">{selectedPage.heroSubtitle}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Hero Section</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p><strong>Title:</strong> {selectedPage.heroTitle}</p>
                    <p><strong>Subtitle:</strong> {selectedPage.heroSubtitle}</p>
                    <p><strong>Background Color:</strong> 
                      <span 
                        className="inline-block w-4 h-4 ml-2 rounded border"
                        style={{ backgroundColor: selectedPage.heroBackgroundColor }}
                      ></span>
                      {selectedPage.heroBackgroundColor}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Sections ({selectedPage.sections?.length || 0})</h3>
                  <div className="space-y-2">
                    {selectedPage.sections?.map((section: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium text-blue-600">{section.type}</span>
                            {section.title && <span className="ml-2 text-gray-700">- {section.title}</span>}
                          </div>
                          <span className="text-xs text-gray-500">ID: {section.id}</span>
                        </div>
                        {section.content && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{section.content}</p>
                        )}
                        {section.items && (
                          <p className="text-sm text-gray-600 mt-1">{section.items.length} items</p>
                        )}
                        {section.slides && (
                          <p className="text-sm text-gray-600 mt-1">{section.slides.length} slides</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* API Endpoints */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Available API Endpoints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Public API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><code>GET /api/page-content?pageKey=...</code></p>
                <p className="text-xs text-gray-600">Fetch specific page content for frontend</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm"><code>GET /api/admin/page-content</code></p>
                <p className="text-xs text-gray-600">List all pages</p>
                <p className="text-sm"><code>POST /api/admin/page-content</code></p>
                <p className="text-xs text-gray-600">Create/update page content</p>
                <p className="text-sm"><code>GET /api/admin/page-content/[id]</code></p>
                <p className="text-xs text-gray-600">Get specific page by ID</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestDynamicPage; 