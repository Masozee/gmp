import { NextRequest, NextResponse } from 'next/server';
import { db, researchData, researchAttributes } from '@/lib/db';
import { sql, eq, and, or, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query parameters
    const filters = {
      age: searchParams.get('age')?.split(',').filter(Boolean) || [],
      gender: searchParams.get('gender')?.split(',').filter(Boolean) || [],
      region: searchParams.get('region')?.split(',').filter(Boolean) || [],
      activism: searchParams.get('activism')?.split(',').filter(Boolean) || [],
      politicalExposure: searchParams.get('politicalExposure')?.split(',').filter(Boolean) || []
    };

    // Build query conditions
    let conditions: any[] = [];
    
    if (filters.age.length > 0) {
      const ageNumbers = filters.age.map(age => parseInt(age)).filter(age => !isNaN(age));
      if (ageNumbers.length > 0) {
        conditions.push(inArray(researchData.age, ageNumbers));
      }
    }
    
    if (filters.gender.length > 0) {
      conditions.push(inArray(researchData.gender, filters.gender));
    }
    
    if (filters.region.length > 0) {
      conditions.push(inArray(researchData.regionLive, filters.region));
    }
    
    if (filters.activism.length > 0) {
      conditions.push(inArray(researchData.activism, filters.activism));
    }
    
    if (filters.politicalExposure.length > 0) {
      conditions.push(inArray(researchData.politicalExposure, filters.politicalExposure));
    }

    // Fetch filtered data
    let query = db.select().from(researchData);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const rawData = await query;

    // Process data into statistics
    const ageData = calculateDistribution(rawData, 'age');
    const genderData = calculateDistribution(rawData, 'gender');
    const regionalData = calculateDistribution(rawData, 'regionLive', {
      'West': 'Indonesia Barat',
      'Central': 'Indonesia Tengah', 
      'East': 'Indonesia Timur',
      'Overseas': 'Luar Negeri'
    });
    const activismData = calculateDistribution(rawData, 'activism');
    const politicalExposureData = calculateDistribution(rawData, 'politicalExposure');
    const civicSpaceUnderstandingData = calculateDistribution(rawData, 'civspaceUnderstanding');
    const civicSpaceHeardData = calculateDistribution(rawData, 'civspaceHeard');
    const civicspaceChangeData = calculateDistribution(rawData, 'civicspaceChange');
    const elitPercepNationalData = calculateDistribution(rawData, 'elitPercepNational');
    const elitPercepLocalData = calculateDistribution(rawData, 'elitPercepLocal');
    const issueCommitedVoicingData = calculateDistribution(rawData, 'issueCommitedVoicing');
    
    // Political exposure by platform (Yes/No analysis)
    const polexpTiktokData = calculateYesNoDistribution(rawData, 'polexpTiktok');
    const polexpXData = calculateYesNoDistribution(rawData, 'polexpX');
    const polexpIgData = calculateYesNoDistribution(rawData, 'polexpIg');
    const polexpYtData = calculateYesNoDistribution(rawData, 'polexpYt');
    const polexpNewsappData = calculateYesNoDistribution(rawData, 'polexpNewsapp');
    const polexpNewsconvData = calculateYesNoDistribution(rawData, 'polexpNewsconv');
    const polexpPeersData = calculateDistribution(rawData, 'polexpPeers');
    const polexpPeersIntensityData = calculateDistribution(rawData, 'polexpPeersIntensity');

    const processedData = {
      totalRespondents: rawData.length,
      
      // Age distribution
      ageDistribution: ageData.distribution,
      ageN: ageData.totalN,
      
      // Gender distribution 
      genderDistribution: genderData.distribution,
      genderN: genderData.totalN,
      
      // Regional distribution
      regionalData: regionalData.distribution,
      regionalN: regionalData.totalN,
      
      // Activism experience
      activismExperience: activismData.distribution,
      activismN: activismData.totalN,
      
      // Political exposure
      politicalExposure: politicalExposureData.distribution,
      politicalExposureN: politicalExposureData.totalN,
      
      // Civic space understanding
      civicSpaceUnderstanding: civicSpaceUnderstandingData.distribution,
      civicSpaceUnderstandingN: civicSpaceUnderstandingData.totalN,
      
      // Civic space heard
      civicSpaceHeard: civicSpaceHeardData.distribution,
      civicSpaceHeardN: civicSpaceHeardData.totalN,
      
      // Civic space change perception
      civicspaceChange: civicspaceChangeData.distribution,
      civicspaceChangeN: civicspaceChangeData.totalN,
      
      // Elite perception national
      elitPercepNational: elitPercepNationalData.distribution,
      elitPercepNationalN: elitPercepNationalData.totalN,
      
      // Elite perception local
      elitPercepLocal: elitPercepLocalData.distribution,
      elitPercepLocalN: elitPercepLocalData.totalN,
      
      // Issue committed voicing
      issueCommitedVoicing: issueCommitedVoicingData.distribution,
      issueCommitedVoicingN: issueCommitedVoicingData.totalN,
      
      // Political exposure by platform
      polexpTiktok: polexpTiktokData.distribution,
      polexpTiktokN: polexpTiktokData.totalN,
      polexpX: polexpXData.distribution,
      polexpXN: polexpXData.totalN,
      polexpIg: polexpIgData.distribution,
      polexpIgN: polexpIgData.totalN,
      polexpYt: polexpYtData.distribution,
      polexpYtN: polexpYtData.totalN,
      polexpNewsapp: polexpNewsappData.distribution,
      polexpNewsappN: polexpNewsappData.totalN,
      polexpNewsconv: polexpNewsconvData.distribution,
      polexpNewsconvN: polexpNewsconvData.totalN,
      polexpPeers: polexpPeersData.distribution,
      polexpPeersN: polexpPeersData.totalN,
      polexpPeersIntensity: polexpPeersIntensityData.distribution,
      polexpPeersIntensityN: polexpPeersIntensityData.totalN,
      
      // Government responsiveness (average scores 0-10 scale)
      govResponseStats: {
        humanrights: calculateAverage(rawData, 'govResponseHumanrights'),
        environment: calculateAverage(rawData, 'govResponseEnvironment'),
        poverty: calculateAverage(rawData, 'govResponsePoverty'),
        education: calculateAverage(rawData, 'govResponseEduaccess'),
        health: calculateAverage(rawData, 'govResponseHealthaccess'),
        foodresource: calculateAverage(rawData, 'govResponseFoodresource'),
        vulnerablepop: calculateAverage(rawData, 'govResponseVulnerablepop'),
        inequality: calculateAverage(rawData, 'govResponseInequality'),
        economicopp: calculateAverage(rawData, 'govResponseEconomicopp')
      },
      
      // Filter options for frontend
      filterOptions: {
        age: getUniqueValues(rawData, 'age').sort((a, b) => Number(a) - Number(b)),
        gender: getUniqueValues(rawData, 'gender'),
        region: getUniqueValues(rawData, 'regionLive'),
        activism: getUniqueValues(rawData, 'activism'),
        politicalExposure: getUniqueValues(rawData, 'politicalExposure')
      }
    };

    return NextResponse.json(processedData);
    
  } catch (error) {
    console.error('Error fetching ruang sipil data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ruang sipil data' },
      { status: 500 }
    );
  }
}

// Helper function to calculate distribution (including NA)
function calculateDistribution(data: any[], field: string, labelMap?: Record<string, string>) {
  const counts: Record<string, number> = {};
  const total = data.length;
  
  data.forEach(record => {
    const value = record[field];
    let label: string;
    
    if (!value || value === 'Not Answer') {
      label = 'Not Answer';
    } else {
      label = labelMap?.[value] || value;
    }
    
    counts[label] = (counts[label] || 0) + 1;
  });
  
  return {
    distribution: Object.entries(counts).map(([category, frequency]) => ({
      Variable: field,
      Question_Label: null,
      Category: category,
      Frequency: frequency,
      Percentage: ((frequency / total) * 100).toFixed(1),
      N: total
    })).sort((a, b) => b.Frequency - a.Frequency),
    totalN: total
  };
}

// Helper function to calculate Yes/No distribution (anything except NA is Yes)
function calculateYesNoDistribution(data: any[], field: string) {
  const total = data.length;
  let yesCount = 0;
  let noCount = 0;
  
  data.forEach(record => {
    const value = record[field];
    if (!value || value === 'Not Answer') {
      noCount++;
    } else {
      yesCount++;
    }
  });
  
  return {
    distribution: [
      {
        Variable: field,
        Question_Label: null,
        Category: 'Yes',
        Frequency: yesCount,
        Percentage: ((yesCount / total) * 100).toFixed(1),
        N: total
      },
      {
        Variable: field,
        Question_Label: null,
        Category: 'Not Answer',
        Frequency: noCount,
        Percentage: ((noCount / total) * 100).toFixed(1),
        N: total
      }
    ].sort((a, b) => b.Frequency - a.Frequency),
    totalN: total
  };
}

// Helper function to calculate average for numeric fields
function calculateAverage(data: any[], field: string) {
  const validValues = data
    .map(record => record[field])
    .filter(value => value !== null && value !== undefined && !isNaN(Number(value)))
    .map(value => Number(value));
    
  if (validValues.length === 0) return 0;
  
  return (validValues.reduce((sum, value) => sum + value, 0) / validValues.length).toFixed(1);
}

// Helper function to get unique values (including NA for filtering)
function getUniqueValues(data: any[], field: string) {
  const values = data
    .map(record => record[field])
    .filter(value => value !== null && value !== undefined);
    
  return [...new Set(values)].sort();
}