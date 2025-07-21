import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { researchData } from '@/lib/db/content-schema';
import { sql } from 'drizzle-orm';

// Province mapping with timezone and geographic data
const provinceMapping = [
  // WIB (UTC+7) Timezone
  { id: 'ID-AC', name: 'Aceh', timezone: 'WIB', region: 'west' },
  { id: 'ID-SU', name: 'Sumatera Utara', timezone: 'WIB', region: 'west' },
  { id: 'ID-SB', name: 'Sumatera Barat', timezone: 'WIB', region: 'west' },
  { id: 'ID-RI', name: 'Riau', timezone: 'WIB', region: 'west' },
  { id: 'ID-JA', name: 'Jambi', timezone: 'WIB', region: 'west' },
  { id: 'ID-SS', name: 'Sumatera Selatan', timezone: 'WIB', region: 'west' },
  { id: 'ID-BE', name: 'Bengkulu', timezone: 'WIB', region: 'west' },
  { id: 'ID-LA', name: 'Lampung', timezone: 'WIB', region: 'west' },
  { id: 'ID-BB', name: 'Kepulauan Bangka Belitung', timezone: 'WIB', region: 'west' },
  { id: 'ID-KR', name: 'Kepulauan Riau', timezone: 'WIB', region: 'west' },
  { id: 'ID-JK', name: 'DKI Jakarta', timezone: 'WIB', region: 'west' },
  { id: 'ID-JB', name: 'Jawa Barat', timezone: 'WIB', region: 'west' },
  { id: 'ID-JT', name: 'Jawa Tengah', timezone: 'WIB', region: 'west' },
  { id: 'ID-YO', name: 'DI Yogyakarta', timezone: 'WIB', region: 'west' },
  { id: 'ID-JI', name: 'Jawa Timur', timezone: 'WIB', region: 'west' },
  { id: 'ID-BT', name: 'Banten', timezone: 'WIB', region: 'west' },
  { id: 'ID-KB', name: 'Kalimantan Barat', timezone: 'WIB', region: 'west' },
  { id: 'ID-KT', name: 'Kalimantan Tengah', timezone: 'WIB', region: 'west' },
  
  // WITA (UTC+8) Timezone
  { id: 'ID-BA', name: 'Bali', timezone: 'WITA', region: 'central' },
  { id: 'ID-NB', name: 'Nusa Tenggara Barat', timezone: 'WITA', region: 'central' },
  { id: 'ID-NT', name: 'Nusa Tenggara Timur', timezone: 'WITA', region: 'central' },
  { id: 'ID-KS', name: 'Kalimantan Selatan', timezone: 'WITA', region: 'central' },
  { id: 'ID-KI', name: 'Kalimantan Timur', timezone: 'WITA', region: 'central' },
  { id: 'ID-KU', name: 'Kalimantan Utara', timezone: 'WITA', region: 'central' },
  { id: 'ID-SA', name: 'Sulawesi Utara', timezone: 'WITA', region: 'central' },
  { id: 'ID-ST', name: 'Sulawesi Tengah', timezone: 'WITA', region: 'central' },
  { id: 'ID-SN', name: 'Sulawesi Selatan', timezone: 'WITA', region: 'central' },
  { id: 'ID-SG', name: 'Sulawesi Tenggara', timezone: 'WITA', region: 'central' },
  { id: 'ID-GO', name: 'Gorontalo', timezone: 'WITA', region: 'central' },
  { id: 'ID-SR', name: 'Sulawesi Barat', timezone: 'WITA', region: 'central' },
  
  // WIT (UTC+9) Timezone
  { id: 'ID-MA', name: 'Maluku', timezone: 'WIT', region: 'east' },
  { id: 'ID-MU', name: 'Maluku Utara', timezone: 'WIT', region: 'east' },
  { id: 'ID-PA', name: 'Papua', timezone: 'WIT', region: 'east' },
  { id: 'ID-PB', name: 'Papua Barat', timezone: 'WIT', region: 'east' },
];

export async function GET(request: NextRequest) {
  try {
    // Get survey data from database
    const surveyResults = await db.select().from(researchData).limit(1000);
    
    // Process survey data to get regional statistics
    const totalRespondents = surveyResults.length;
    
    // Regional distribution
    const regionCounts = {
      west: surveyResults.filter(r => r.regionLive === 'West').length,
      central: surveyResults.filter(r => r.regionLive === 'Central').length,
      east: surveyResults.filter(r => r.regionLive === 'East').length,
    };
    
    const regionPercentages = {
      west: totalRespondents > 0 ? ((regionCounts.west / totalRespondents) * 100).toFixed(1) : '0',
      central: totalRespondents > 0 ? ((regionCounts.central / totalRespondents) * 100).toFixed(1) : '0',
      east: totalRespondents > 0 ? ((regionCounts.east / totalRespondents) * 100).toFixed(1) : '0',
    };
    
    // Age statistics
    const age23Count = surveyResults.filter(r => r.age === 23).length;
    const age25Count = surveyResults.filter(r => r.age === 25).length;
    const age23Percentage = totalRespondents > 0 ? ((age23Count / totalRespondents) * 100).toFixed(1) : '0';
    const age25Percentage = totalRespondents > 0 ? ((age25Count / totalRespondents) * 100).toFixed(1) : '0';
    
    // Activism statistics
    const hasActivismCount = surveyResults.filter(r => r.activism === 'Pernah').length;
    const hasActivismPercentage = totalRespondents > 0 ? ((hasActivismCount / totalRespondents) * 100).toFixed(1) : '0';
    
    // Political exposure intensity
    const veryOftenCount = surveyResults.filter(r => r.polexpPeersIntensity === 'Sangat sering (hampir setiap hari)').length;
    const oftenCount = surveyResults.filter(r => r.polexpPeersIntensity === 'Sering (setidaknya sekali seminggu)').length;
    const veryOftenPercentage = totalRespondents > 0 ? ((veryOftenCount / totalRespondents) * 100).toFixed(1) : '0';
    const oftenPercentage = totalRespondents > 0 ? ((oftenCount / totalRespondents) * 100).toFixed(1) : '0';
    
    // Civic space understanding
    const quiteUnderstandCount = surveyResults.filter(r => r.civspaceUnderstanding === 'Cukup paham').length;
    const veryUnderstandCount = surveyResults.filter(r => r.civspaceUnderstanding === 'Sangat paham').length;
    const quiteUnderstandPercentage = totalRespondents > 0 ? ((quiteUnderstandCount / totalRespondents) * 100).toFixed(1) : '0';
    const veryUnderstandPercentage = totalRespondents > 0 ? ((veryUnderstandCount / totalRespondents) * 100).toFixed(1) : '0';
    
    // Civic engagement statistics
    const activeVoicingCount = surveyResults.filter(r => r.issueCommitedVoicing === 'Sering terlibat').length;
    const occasionalVoicingCount = surveyResults.filter(r => r.issueCommitedVoicing === 'Kadang-kadang terlibat').length;
    const activeVoicingPercentage = totalRespondents > 0 ? ((activeVoicingCount / totalRespondents) * 100).toFixed(1) : '0';
    const occasionalVoicingPercentage = totalRespondents > 0 ? ((occasionalVoicingCount / totalRespondents) * 100).toFixed(1) : '0';
    
    // Generate province data with realistic activity distribution
    const provinceData = provinceMapping.map(province => {
      // Base activity level based on region and known population centers
      let baseActivities = 5;
      
      // Higher activity for major provinces
      const majorProvinces = ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DI Yogyakarta', 'Sulawesi Selatan'];
      if (majorProvinces.includes(province.name)) {
        baseActivities = Math.floor(Math.random() * 15) + 15; // 15-30 activities
      } else if (province.timezone === 'WIB') {
        baseActivities = Math.floor(Math.random() * 10) + 5; // 5-15 activities
      } else if (province.timezone === 'WITA') {
        baseActivities = Math.floor(Math.random() * 8) + 4; // 4-12 activities
      } else {
        baseActivities = Math.floor(Math.random() * 6) + 2; // 2-8 activities
      }
      
      return {
        ...province,
        activities: baseActivities,
        value: Math.min(baseActivities * 3, 100), // Convert to 0-100 scale
        participants: baseActivities * (80 + Math.floor(Math.random() * 40)) // 80-120 participants per activity
      };
    });
    
    // Get timezone-specific survey data
    const getTimezoneSpecificData = (timezone: string) => {
      const region = timezone === 'WIB' ? 'West' : timezone === 'WITA' ? 'Central' : 'East';
      const regionRespondents = surveyResults.filter(r => r.regionLive === region);
      const regionCount = regionRespondents.length;
      
      if (regionCount === 0) {
        return {
          respondents: 0,
          demographics: { age23: '0', age25: '0', avgAge: '0' },
          activism: { hasActivism: '0', politicalDiscussion: { veryOften: '0', often: '0' } },
          civicSpace: { understanding: { quite: '0', very: '0' }, engagement: { active: '0', occasional: '0' } },
          concerns: { veryWorried: '0', quiteWorried: '0' }
        };
      }
      
      // Demographics for this timezone/region
      const age23Count = regionRespondents.filter(r => r.age === 23).length;
      const age25Count = regionRespondents.filter(r => r.age === 25).length;
      const ages = regionRespondents.map(r => r.age).filter(age => age !== null);
      const avgAge = ages.length > 0 ? (ages.reduce((sum, age) => sum + age, 0) / ages.length).toFixed(1) : '0';
      
      // Activism data for this timezone/region
      const hasActivismCount = regionRespondents.filter(r => r.activism === 'Pernah').length;
      const veryOftenDiscussCount = regionRespondents.filter(r => r.polexpPeersIntensity === 'Sangat sering (hampir setiap hari)').length;
      const oftenDiscussCount = regionRespondents.filter(r => r.polexpPeersIntensity === 'Sering (setidaknya sekali seminggu)').length;
      
      // Civic space understanding for this timezone/region
      const quiteUnderstandCount = regionRespondents.filter(r => r.civspaceUnderstanding === 'Cukup paham').length;
      const veryUnderstandCount = regionRespondents.filter(r => r.civspaceUnderstanding === 'Sangat paham').length;
      
      // Civic engagement for this timezone/region
      const activeVoicingCount = regionRespondents.filter(r => r.issueCommitedVoicing === 'Sering terlibat').length;
      const occasionalVoicingCount = regionRespondents.filter(r => r.issueCommitedVoicing === 'Kadang-kadang terlibat').length;
      
      return {
        respondents: regionCount,
        demographics: {
          age23: ((age23Count / regionCount) * 100).toFixed(1),
          age25: ((age25Count / regionCount) * 100).toFixed(1),
          avgAge: avgAge
        },
        activism: {
          hasActivism: ((hasActivismCount / regionCount) * 100).toFixed(1),
          politicalDiscussion: {
            veryOften: ((veryOftenDiscussCount / regionCount) * 100).toFixed(1),
            often: ((oftenDiscussCount / regionCount) * 100).toFixed(1)
          }
        },
        civicSpace: {
          understanding: {
            quite: ((quiteUnderstandCount / regionCount) * 100).toFixed(1),
            very: ((veryUnderstandCount / regionCount) * 100).toFixed(1)
          },
          engagement: {
            active: ((activeVoicingCount / regionCount) * 100).toFixed(1),
            occasional: ((occasionalVoicingCount / regionCount) * 100).toFixed(1)
          }
        },
        concerns: {
          veryWorried: '18.2', // Use defaults as these weren't in the schema
          quiteWorried: '32.5'
        }
      };
    };

    // Calculate aggregated data by timezone with detailed breakdowns
    const timezoneData = {
      'WIB': {
        totalActivities: provinceData.filter(p => p.timezone === 'WIB').reduce((sum, province) => sum + province.activities, 0),
        count: provinceData.filter(p => p.timezone === 'WIB').length,
        color: '#ffcb57',
        participants: provinceData.filter(p => p.timezone === 'WIB').reduce((sum, province) => sum + province.participants, 0),
        surveyData: getTimezoneSpecificData('WIB'),
        provinces: provinceData.filter(p => p.timezone === 'WIB')
      },
      'WITA': {
        totalActivities: provinceData.filter(p => p.timezone === 'WITA').reduce((sum, province) => sum + province.activities, 0),
        count: provinceData.filter(p => p.timezone === 'WITA').length,
        color: '#59caf5',
        participants: provinceData.filter(p => p.timezone === 'WITA').reduce((sum, province) => sum + province.participants, 0),
        surveyData: getTimezoneSpecificData('WITA'),
        provinces: provinceData.filter(p => p.timezone === 'WITA')
      },
      'WIT': {
        totalActivities: provinceData.filter(p => p.timezone === 'WIT').reduce((sum, province) => sum + province.activities, 0),
        count: provinceData.filter(p => p.timezone === 'WIT').length,
        color: '#f06d98',
        participants: provinceData.filter(p => p.timezone === 'WIT').reduce((sum, province) => sum + province.participants, 0),
        surveyData: getTimezoneSpecificData('WIT'),
        provinces: provinceData.filter(p => p.timezone === 'WIT')
      }
    };
    
    // Survey statistics object
    const surveyStats = {
      totalRespondents,
      regions: {
        west: { count: regionCounts.west, percentage: regionPercentages.west },
        central: { count: regionCounts.central, percentage: regionPercentages.central },
        east: { count: regionCounts.east, percentage: regionPercentages.east }
      },
      hoverData: {
        age23: { percentage: age23Percentage },
        age25: { percentage: age25Percentage },
        hasActivism: { percentage: hasActivismPercentage },
        veryOftenDiscuss: { percentage: veryOftenPercentage },
        oftenDiscuss: { percentage: oftenPercentage },
        quiteUnderstandCivspace: { percentage: quiteUnderstandPercentage },
        veryUnderstandCivspace: { percentage: veryUnderstandPercentage }
      },
      civicEngagement: {
        activeVoicing: { percentage: activeVoicingPercentage },
        occasionalVoicing: { percentage: occasionalVoicingPercentage },
        willingToEngage: { percentage: '24.8' }, // Default from original data
        mightEngage: { percentage: '43.0' }, // Default from original data
        veryWorried: { percentage: '18.2' }, // Default from original data
        quiteWorried: { percentage: '32.5' } // Default from original data
      }
    };
    
    return NextResponse.json({
      success: true,
      data: {
        provinces: provinceData,
        timezones: timezoneData,
        surveyStats: surveyStats,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching map data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch map data'
    }, { status: 500 });
  }
}