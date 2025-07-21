'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Eye,
  Download,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Search,
  Filter
} from 'lucide-react';

interface VisitorStat {
  contentType: string;
  contentId: string;
  contentTitle: string;
  actionType: string;
  count: number;
}

interface DailyBreakdown {
  date: string;
  actionType: string;
  count: number;
}

export default function VisitorTrackingPage() {
  const [stats, setStats] = useState<VisitorStat[]>([]);
  const [dailyBreakdown, setDailyBreakdown] = useState<DailyBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    contentType: 'all',
    actionType: 'all',
    timeRange: '30',
    search: ''
  });

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.contentType && filters.contentType !== 'all') params.append('contentType', filters.contentType);
      if (filters.actionType && filters.actionType !== 'all') params.append('actionType', filters.actionType);
      if (filters.timeRange) params.append('timeRange', filters.timeRange);

      const response = await fetch(`/api/visitor-tracking?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data.data || []);
      setDailyBreakdown(data.dailyBreakdown || []);
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      setStats([]);
      setDailyBreakdown([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filters.contentType, filters.actionType, filters.timeRange]);

  const filteredStats = stats.filter(stat => 
    !filters.search || 
    stat.contentTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
    stat.contentId.toLowerCase().includes(filters.search.toLowerCase())
  );

  const totalViews = stats.filter(s => s.actionType === 'view').reduce((sum, s) => sum + s.count, 0);
  const totalDownloads = stats.filter(s => s.actionType === 'download').reduce((sum, s) => sum + s.count, 0);
  const uniqueContent = new Set(stats.map(s => s.contentId)).size;

  const resetFilters = () => {
    setFilters({
      contentType: 'all',
      actionType: 'all',
      timeRange: '30',
      search: ''
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Visitor Tracking Analytics</h1>
          <p className="text-muted-foreground">
            Track page views and downloads for publikasi and acara
          </p>
        </div>
        <Button onClick={fetchStats} disabled={isLoading}>
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last {filters.timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last {filters.timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueContent}</div>
            <p className="text-xs text-muted-foreground">
              Content pieces with activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. per Content</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {uniqueContent > 0 ? Math.round((totalViews + totalDownloads) / uniqueContent) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Views + downloads per content
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Content Type</label>
              <Select
                value={filters.contentType}
                onValueChange={(value) => setFilters(prev => ({ ...prev, contentType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="publikasi">Publikasi</SelectItem>
                  <SelectItem value="acara">Acara</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Action Type</label>
              <Select
                value={filters.actionType}
                onValueChange={(value) => setFilters(prev => ({ ...prev, actionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  <SelectItem value="view">Views</SelectItem>
                  <SelectItem value="download">Downloads</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Time Range</label>
              <Select
                value={filters.timeRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search content..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={resetFilters} className="w-full">
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Content Statistics</CardTitle>
          <CardDescription>
            Showing {filteredStats.length} results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : filteredStats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No data found for the selected filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStats.map((stat, index) => (
                <div
                  key={`${stat.contentType}-${stat.contentId}-${stat.actionType}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={stat.contentType === 'publikasi' ? 'default' : 'secondary'}>
                        {stat.contentType}
                      </Badge>
                      <Badge variant={stat.actionType === 'view' ? 'outline' : 'destructive'}>
                        {stat.actionType === 'view' ? (
                          <><Eye className="h-3 w-3 mr-1" /> Views</>
                        ) : (
                          <><Download className="h-3 w-3 mr-1" /> Downloads</>
                        )}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm">{stat.contentTitle}</h3>
                    <p className="text-xs text-muted-foreground">ID: {stat.contentId}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{stat.count}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.actionType === 'view' ? 'page views' : 'downloads'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 