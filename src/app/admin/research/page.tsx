'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Download, Filter, TrendingUp, Eye } from 'lucide-react';

interface ResearchAttribute {
  id: number;
  columnName: string;
  label: string;
  class: string;
  isOrdered: boolean;
  isFactor: boolean;
  nUnique: number;
  exampleValues: string | null;
}

interface ResearchDataRecord {
  id: number;
  regionLive: string | null;
  age: number | null;
  gender: string | null;
  activism: string | null;
  politicalExposure: string | null;
  civspaceHeard: string | null;
  civspaceUnderstanding: string | null;
  civicspaceChange: string | null;
  elitPercepNational: string | null;
  elitPercepLocal: string | null;
  issueCommitedVoicing: string | null;
  govResponseHumanrights: number | null;
  govResponseEnvironment: number | null;
  govResponsePoverty: number | null;
  issueCommitedResources: number | null;
  [key: string]: any;
}

export default function AdminResearchPage() {
  const [attributes, setAttributes] = useState<ResearchAttribute[]>([]);
  const [researchData, setResearchData] = useState<ResearchDataRecord[]>([]);
  const [filteredData, setFilteredData] = useState<ResearchDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview');
  const [selectedResponse, setSelectedResponse] = useState<ResearchDataRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch research attributes
        const attributesResponse = await fetch('/api/admin/research/attributes');
        if (attributesResponse.ok) {
          const attributesData = await attributesResponse.json();
          setAttributes(attributesData);
        }

        // Fetch research data
        const dataResponse = await fetch('/api/admin/research/data');
        if (dataResponse.ok) {
          const researchDataResponse = await dataResponse.json();
          setResearchData(researchDataResponse);
          setFilteredData(researchDataResponse);
        }
      } catch (error) {
        console.error('Error fetching research data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search and column selection
  useEffect(() => {
    let filtered = researchData;

    if (searchQuery) {
      filtered = filtered.filter(record => {
        if (selectedColumn === 'all') {
          return Object.values(record).some(value => 
            value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          const value = record[selectedColumn];
          return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        }
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedColumn, researchData]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Get label for column name
  const getColumnLabel = (columnName: string) => {
    const attribute = attributes.find(attr => attr.columnName === columnName);
    return attribute ? attribute.label : columnName;
  };

  // Key columns for overview
  const overviewColumns = [
    'regionLive', 'age', 'gender', 'activism', 'politicalExposure',
    'civspaceHeard', 'civspaceUnderstanding', 'civicspaceChange',
    'elitPercepNational', 'elitPercepLocal', 'issueCommitedVoicing'
  ];

  // View full response details
  const viewResponseDetails = (response: ResearchDataRecord) => {
    setSelectedResponse(response);
    setShowDetailsModal(true);
  };


  // Export functionality
  const exportToCSV = () => {
    const headers = selectedView === 'overview' 
      ? overviewColumns.map(col => getColumnLabel(col))
      : Object.keys(filteredData[0] || {}).filter(key => key !== 'id');
      
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => {
        const values = selectedView === 'overview'
          ? overviewColumns.map(col => row[col] || '')
          : Object.keys(row).filter(key => key !== 'id').map(key => row[key] || '');
        return values.map(val => `"${val}"`).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-data-${selectedView}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading research data...</div>
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
            <TrendingUp className="h-8 w-8" />
            Research Data
          </h1>
          <p className="text-muted-foreground">
            Survey data analysis and insights from civic space research
          </p>
        </div>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export {selectedView === 'overview' ? 'Overview' : 'Full'} Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{researchData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attributes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Age Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.min(...researchData.filter(r => r.age).map(r => r.age!))} - {Math.max(...researchData.filter(r => r.age).map(r => r.age!))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(researchData.filter(r => r.regionLive).map(r => r.regionLive)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search research data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Columns</SelectItem>
                {overviewColumns.map(column => (
                  <SelectItem key={column} value={column}>
                    {getColumnLabel(column)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedView} onValueChange={(value: 'overview' | 'detailed') => setSelectedView(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {researchData.length} records
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Research Data {selectedView === 'overview' ? 'Overview' : 'Detailed View'}</CardTitle>
          <CardDescription>
            {selectedView === 'overview' 
              ? 'Key demographic and civic engagement metrics'
              : 'Complete survey response data with all fields'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto w-full">
            <Table className="min-w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead className="w-16">ID</TableHead>
                  {selectedView === 'overview' ? (
                    overviewColumns.map(column => (
                      <TableHead key={column} className="min-w-24 max-w-48">
                        <div className="whitespace-normal break-words">
                          {getColumnLabel(column)}
                        </div>
                      </TableHead>
                    ))
                  ) : (
                    Object.keys(currentData[0] || {})
                      .filter(key => key !== 'id')
                      .map(key => (
                        <TableHead key={key} className="min-w-20 max-w-32">
                          <div className="whitespace-normal break-words">
                            {getColumnLabel(key)}
                          </div>
                        </TableHead>
                      ))
                  )}
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((record, index) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="text-xs font-mono px-2">
                        {record.id}
                      </Badge>
                    </TableCell>
                    {selectedView === 'overview' ? (
                      overviewColumns.map(column => (
                        <TableCell key={column} className="max-w-32">
                          {record[column] !== null && record[column] !== undefined ? (
                            <Badge 
                              variant={record[column] === 'Not Answer' ? 'secondary' : 'outline'} 
                              className="text-xs whitespace-normal break-words max-w-full inline-block"
                            >
                              {record[column]}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      ))
                    ) : (
                      Object.keys(record)
                        .filter(key => key !== 'id')
                        .map(key => (
                          <TableCell key={key} className="max-w-24">
                            {record[key] !== null && record[key] !== undefined ? (
                              <Badge 
                                variant={record[key] === 'Not Answer' ? 'secondary' : 'outline'} 
                                className="text-xs whitespace-normal break-words max-w-full inline-block"
                              >
                                {record[key]}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        ))
                    )}
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewResponseDetails(record)}
                        className="flex items-center gap-1 text-xs px-2 h-7"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-[95vw] w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Response Details - ID: {selectedResponse?.id}
            </DialogTitle>
            <DialogDescription>
              Complete survey response with all questions and answers
            </DialogDescription>
          </DialogHeader>
          
          {selectedResponse && (
            <div className="space-y-4">
              {/* Basic Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Demographics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm font-medium">Region:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.regionLive || 'Not Answer'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Age:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.age || 'Not Answer'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Gender:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.gender || 'Not Answer'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Activism Experience:</span>
                    <Badge variant="outline" className="ml-2">
                      {selectedResponse.activism || 'Not Answer'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* All Questions and Answers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Complete Survey Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(selectedResponse)
                      .filter(([key]) => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
                      .map(([key, value]) => {
                        const label = getColumnLabel(key);
                        const displayValue = value === null || value === undefined ? 'Not Answer' : value.toString();
                        
                        return (
                          <div key={key} className="border rounded-lg p-3">
                            <div className="flex flex-col space-y-2">
                              <span className="text-sm font-medium text-muted-foreground whitespace-normal break-words">
                                {label}
                              </span>
                              <Badge 
                                variant={displayValue === 'Not Answer' ? 'secondary' : 'outline'}
                                className="w-fit text-sm whitespace-normal break-words"
                              >
                                {displayValue}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Export Individual Response */}
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (selectedResponse) {
                      const csvContent = [
                        'Question,Answer',
                        ...Object.entries(selectedResponse)
                          .filter(([key]) => key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
                          .map(([key, value]) => {
                            const label = getColumnLabel(key);
                            const displayValue = value === null || value === undefined ? 'Not Answer' : value.toString();
                            return `"${label}","${displayValue}"`;
                          })
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `response-${selectedResponse.id}-${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export This Response
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}