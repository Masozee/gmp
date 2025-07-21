"use client"

import React, { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageContent } from '@/lib/db/content-schema';

interface PageSection {
  id: string;
  type: 'text' | 'image' | 'text_image' | 'list' | 'slideshow';
  title?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  items?: string[];
  slides?: Array<{
    image: string;
    description?: string;
    alt?: string;
  }>;
}

export default function EditPageContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    pageKey: '',
    pageName: '',
    pageUrl: '',
    heroTitle: '',
    heroSubtitle: '',
    heroBackgroundColor: '#f06d98',
    heroBackgroundImage: '',
    isActive: true,
  });
  
  const [sections, setSections] = useState<PageSection[]>([]);
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await fetch(`/api/admin/page-content/${resolvedParams.id}`);
        if (response.ok) {
          const data: PageContent = await response.json();
          setFormData({
            pageKey: data.pageKey,
            pageName: data.pageName,
            pageUrl: data.pageUrl,
            heroTitle: data.heroTitle || '',
            heroSubtitle: data.heroSubtitle || '',
            heroBackgroundColor: data.heroBackgroundColor || '#f06d98',
            heroBackgroundImage: data.heroBackgroundImage || '',
            isActive: data.isActive,
          });
          
          try {
            const parsedSections = JSON.parse(data.sections);
            setSections(parsedSections);
          } catch (error) {
            console.error('Error parsing sections:', error);
            setSections([]);
          }
        } else {
          alert('Failed to fetch page content');
          router.push('/admin/config/pages');
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
        alert('Failed to fetch page content');
        router.push('/admin/config/pages');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPageContent();
  }, [resolvedParams.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionChange = (id: string, field: string, value: any) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const addSection = () => {
    const newSection: PageSection = {
      id: Date.now().toString(),
      type: 'text',
      title: '',
      content: '',
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
  };

  const addListItem = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, items: [...(section.items || []), ''] }
        : section
    ));
  };

  const updateListItem = (sectionId: string, itemIndex: number, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items?.map((item, index) => 
              index === itemIndex ? value : item
            ) 
          }
        : section
    ));
  };

  const removeListItem = (sectionId: string, itemIndex: number) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: section.items?.filter((_, index) => index !== itemIndex) 
          }
        : section
    ));
  };

  const addSlide = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, slides: [...(section.slides || []), { image: '', description: '', alt: '' }] }
        : section
    ));
  };

  const updateSlide = (sectionId: string, slideIndex: number, field: string, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            slides: section.slides?.map((slide, index) => 
              index === slideIndex ? { ...slide, [field]: value } : slide
            ) 
          }
        : section
    ));
  };

  const removeSlide = (sectionId: string, slideIndex: number) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            slides: section.slides?.filter((_, index) => index !== slideIndex) 
          }
        : section
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/page-content/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sections: JSON.stringify(sections),
        }),
      });

      if (response.ok) {
        router.push('/admin/config/pages');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update page content');
      }
    } catch (error) {
      console.error('Error updating page content:', error);
      alert('Failed to update page content');
    } finally {
      setLoading(false);
    }
  };

  const renderSectionEditor = (section: PageSection) => {
    return (
      <Card key={section.id} className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Section {sections.indexOf(section) + 1}</CardTitle>
            <div className="flex gap-2">
              <select
                value={section.type}
                onChange={(e) => handleSectionChange(section.id, 'type', e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="text_image">Text + Image</option>
                <option value="list">List</option>
                <option value="slideshow">Slideshow</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSection(section.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`title-${section.id}`}>Section Title</Label>
            <Input
              id={`title-${section.id}`}
              value={section.title || ''}
              onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
              placeholder="Section title (optional)"
            />
          </div>

          {(section.type === 'text' || section.type === 'text_image') && (
            <div>
              <Label htmlFor={`content-${section.id}`}>Content</Label>
              <Textarea
                id={`content-${section.id}`}
                value={section.content || ''}
                onChange={(e) => handleSectionChange(section.id, 'content', e.target.value)}
                placeholder="Section content"
                rows={4}
              />
            </div>
          )}

          {(section.type === 'image' || section.type === 'text_image') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`image-${section.id}`}>Image URL</Label>
                <Input
                  id={`image-${section.id}`}
                  value={section.image || ''}
                  onChange={(e) => handleSectionChange(section.id, 'image', e.target.value)}
                  placeholder="Image URL"
                />
              </div>
              <div>
                <Label htmlFor={`imageAlt-${section.id}`}>Image Alt Text</Label>
                <Input
                  id={`imageAlt-${section.id}`}
                  value={section.imageAlt || ''}
                  onChange={(e) => handleSectionChange(section.id, 'imageAlt', e.target.value)}
                  placeholder="Image alt text"
                />
              </div>
            </div>
          )}

          {section.type === 'list' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>List Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addListItem(section.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              {section.items?.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) => updateListItem(section.id, index, e.target.value)}
                    placeholder={`List item ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeListItem(section.id, index)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {section.type === 'slideshow' && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Slideshow Images</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addSlide(section.id)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slide
                </Button>
              </div>
              {section.slides?.map((slide, index) => (
                <div key={index} className="border rounded p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="font-medium">Slide {index + 1}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSlide(section.id, index)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={slide.image}
                        onChange={(e) => updateSlide(section.id, index, 'image', e.target.value)}
                        placeholder="Image URL"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={slide.description || ''}
                        onChange={(e) => updateSlide(section.id, index, 'description', e.target.value)}
                        placeholder="Slide description"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Alt Text</Label>
                      <Input
                        value={slide.alt || ''}
                        onChange={(e) => updateSlide(section.id, index, 'alt', e.target.value)}
                        placeholder="Image alt text"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (initialLoading) {
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
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/config/pages">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Page Content</h1>
          <p className="text-gray-600 mt-1">Update editable page content</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pageKey">Page Key *</Label>
                <Input
                  id="pageKey"
                  name="pageKey"
                  value={formData.pageKey}
                  onChange={handleInputChange}
                  placeholder="e.g., tentang-kami-tujuan"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pageName">Page Name *</Label>
                <Input
                  id="pageName"
                  name="pageName"
                  value={formData.pageName}
                  onChange={handleInputChange}
                  placeholder="e.g., Tentang Kami - Tujuan"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pageUrl">Page URL *</Label>
              <Input
                id="pageUrl"
                name="pageUrl"
                value={formData.pageUrl}
                onChange={handleInputChange}
                placeholder="e.g., /tentang-kami/tujuan"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                name="heroTitle"
                value={formData.heroTitle}
                onChange={handleInputChange}
                placeholder="Hero section title"
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Textarea
                id="heroSubtitle"
                name="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={handleInputChange}
                placeholder="Hero section subtitle"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heroBackgroundColor">Background Color</Label>
                <Input
                  id="heroBackgroundColor"
                  name="heroBackgroundColor"
                  type="color"
                  value={formData.heroBackgroundColor}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="heroBackgroundImage">Background Image URL</Label>
                <Input
                  id="heroBackgroundImage"
                  name="heroBackgroundImage"
                  value={formData.heroBackgroundImage}
                  onChange={handleInputChange}
                  placeholder="Optional background image URL"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Page Sections</CardTitle>
              <Button type="button" variant="outline" onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sections.map(renderSectionEditor)}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Updating...' : 'Update Page Content'}
          </Button>
        </div>
      </form>
    </div>
  );
}
