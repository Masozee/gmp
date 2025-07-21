'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Plus, ExternalLink, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface SocialMediaSetting {
  id: number;
  platform: string;
  url: string;
  displayName: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  platform: string;
  url: string;
  displayName: string;
  isActive: boolean;
  order: number;
}

const SocialMediaSettingsPage = () => {
  const [settings, setSettings] = useState<SocialMediaSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    platform: '',
    url: '',
    displayName: '',
    isActive: true,
    order: 0
  });

  // Social media platform icons
  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      facebook: '📘',
      instagram: '📷',
      twitter: '🐦',
      linkedin: '💼',
      youtube: '📺',
      tiktok: '🎵',
      telegram: '✈️',
      whatsapp: '💬',
      discord: '🎮',
      github: '🐙'
    };
    return icons[platform.toLowerCase()] || '🌐';
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/social-media');
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        toast.error('Failed to fetch social media settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error fetching social media settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingId 
      ? `/api/admin/social-media/${editingId}`
      : '/api/admin/social-media';
    
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchSettings();
        resetForm();
        setShowAddDialog(false);
        setEditingId(null);
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      toast.error('Error saving social media setting');
    }
  };

  // Handle delete with confirmation
  const handleDelete = async (id: number, displayName: string) => {
    if (!confirm(`Are you sure you want to delete the ${displayName} social media setting? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/social-media/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchSettings();
      } else {
        toast.error(data.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting setting:', error);
      toast.error('Error deleting social media setting');
    }
  };

  // Start editing
  const startEdit = (setting: SocialMediaSetting) => {
    setFormData({
      platform: setting.platform,
      url: setting.url,
      displayName: setting.displayName,
      isActive: setting.isActive,
      order: setting.order
    });
    setEditingId(setting.id);
    setShowAddDialog(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      displayName: '',
      isActive: true,
      order: 0
    });
    setEditingId(null);
  };

  // Toggle active status
  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/social-media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Status updated successfully');
        fetchSettings();
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Media Settings</h1>
          <p className="text-gray-600 mt-1">Manage social media links displayed in the footer</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Social Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Social Media Setting' : 'Add Social Media Setting'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Input
                  id="platform"
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="e.g., facebook, instagram, twitter"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g., Facebook, Instagram"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setShowAddDialog(false);
                  resetForm();
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent>
          {settings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No social media settings found</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowAddDialog(true)}
              >
                Add Your First Social Media Link
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getPlatformIcon(setting.platform)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{setting.displayName}</h3>
                        <Badge variant={setting.isActive ? "default" : "secondary"}>
                          {setting.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{setting.platform}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <a 
                          href={setting.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          {setting.url}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Order: {setting.order}</span>
                    
                    <Switch
                      checked={setting.isActive}
                      onCheckedChange={() => toggleActive(setting.id, setting.isActive)}
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(setting)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(setting.id, setting.displayName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaSettingsPage; 