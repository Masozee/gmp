import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db/index';
import { researchAttributes, researchData } from '@/lib/db/content-schema';

// Function to parse CSV line with semicolon separator
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Function to clean and convert values
function cleanValue(value: string): string | number {
  if (!value || value === '') {
    return 'Not Answer';
  }
  
  if (value === 'NA') {
    return 'Not Answer';
  }
  
  // Check if it's a number
  const numValue = Number(value);
  if (!isNaN(numValue) && isFinite(numValue)) {
    return numValue;
  }
  
  return value;
}

async function importResearchData() {
  try {
    console.log('Starting research data import...');
    
    // First, import attributes
    console.log('Importing research attributes...');
    const attributesPath = path.join(process.cwd(), 'src/data/atribut.csv');
    const attributesContent = fs.readFileSync(attributesPath, 'utf-8');
    const attributesLines = attributesContent.split('\n').filter(line => line.trim());
    
    // Skip BOM and header
    const attributesHeader = parseCSVLine(attributesLines[0].replace(/^\uFEFF/, ''));
    console.log('Attributes header:', attributesHeader);
    
    const attributesData = [];
    for (let i = 1; i < attributesLines.length; i++) {
      const values = parseCSVLine(attributesLines[i]);
      if (values.length >= 7) {
        attributesData.push({
          columnName: values[0],
          label: values[1],
          class: values[2],
          isOrdered: values[3] === 'TRUE',
          isFactor: values[4] === 'TRUE',
          nUnique: parseInt(values[5]) || 0,
          exampleValues: values[6] || null,
        });
      }
    }
    
    console.log(`Found ${attributesData.length} attribute records`);
    
    // Clear existing attributes and insert new ones
    await db.delete(researchAttributes);
    await db.insert(researchAttributes).values(attributesData);
    console.log('Research attributes imported successfully');
    
    // Now import research data
    console.log('Importing research data...');
    const dataPath = path.join(process.cwd(), 'src/data/data.csv');
    const dataContent = fs.readFileSync(dataPath, 'utf-8');
    const dataLines = dataContent.split('\n').filter(line => line.trim());
    
    // Skip BOM and header
    const dataHeader = parseCSVLine(dataLines[0].replace(/^\uFEFF/, ''));
    console.log(`Data header has ${dataHeader.length} columns`);
    
    const researchRecords = [];
    for (let i = 1; i < dataLines.length; i++) {
      const values = parseCSVLine(dataLines[i]);
      if (values.length >= dataHeader.length - 10) { // Allow some tolerance
        const record: any = {};
        
        // Map CSV columns to database fields
        dataHeader.forEach((header, index) => {
          const value = cleanValue(values[index] || '');
          
          switch (header) {
            case 'region_live':
              record.regionLive = value;
              break;
            case 'age':
              record.age = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'gender':
              record.gender = value;
              break;
            case 'activism':
              record.activism = value;
              break;
            case 'political_exsposure':
              record.politicalExposure = value;
              break;
            case 'polexsp_tiktok':
              record.polexpTiktok = value;
              break;
            case 'polexsp_x':
              record.polexpX = value;
              break;
            case 'polexsp_ig':
              record.polexpIg = value;
              break;
            case 'polexsp_yt':
              record.polexpYt = value;
              break;
            case 'polexsp_newsapp':
              record.polexpNewsapp = value;
              break;
            case 'polexsp_newsconv':
              record.polexpNewsconv = value;
              break;
            case 'polexsp_peers':
              record.polexpPeers = value;
              break;
            case 'polexsp_peers_intensity':
              record.polexpPeersIntensity = value;
              break;
            case 'civspace_expression':
              record.civspaceExpression = value;
              break;
            case 'civspace_rights':
              record.civspaceRights = value;
              break;
            case 'civspace_gather':
              record.civspaceGather = value;
              break;
            case 'civspace_discuss':
              record.civspaceDiscuss = value;
              break;
            case 'civspace_critics':
              record.civspaceCritics = value;
              break;
            case 'civspace_allabove':
              record.civspaceAllabove = value;
              break;
            case 'civspace_heard':
              record.civspaceHeard = value;
              break;
            case 'civspace_understanding':
              record.civspaceUnderstanding = value;
              break;
            case 'civicspace_change':
              record.civicspaceChange = value;
              break;
            case 'civicspace_lead_censoring':
              record.civicspaceLeadCensoring = value;
              break;
            case 'civicspace_lead_violence':
              record.civicspaceLeadViolence = value;
              break;
            case 'civicspace_lead_presslimit':
              record.civicspaceLeadPresslimit = value;
              break;
            case 'civicspace_lead_banning':
              record.civicspaceLeadBanning = value;
              break;
            case 'civicspace_lead_repression':
              record.civicspaceLeadRepression = value;
              break;
            case 'civicspace_lead_monopoly':
              record.civicspaceLeadMonopoly = value;
              break;
            case 'civicspace_lead_accountability':
              record.civicspaceLeadAccountability = value;
              break;
            case 'civicspace_lead_allgood':
              record.civicspaceLeadAllgood = value;
              break;
            case 'civicspace_youth_union':
              record.civicspaceYouthUnion = value;
              break;
            case 'civicspace_youth_gather':
              record.civicspaceYouthGather = value;
              break;
            case 'civicspace_youth_express':
              record.civicspaceYouthExpress = value;
              break;
            case 'civicspace_youth_protect':
              record.civicspaceYouthProtect = value;
              break;
            case 'civicspace_youth_resource':
              record.civicspaceYouthResource = value;
              break;
            case 'civicspace_youth_representation':
              record.civicspaceYouthRepresentation = value;
              break;
            case 'civicspace_youth_chal_intimidation':
              record.civicspaceYouthChalIntimidation = value;
              break;
            case 'civicspace_youth_chal_ban':
              record.civicspaceYouthChalBan = value;
              break;
            case 'civicspace_youth_chal_censoring':
              record.civicspaceYouthChalCensoring = value;
              break;
            case 'civicspace_youth_chal_unprotection':
              record.civicspaceYouthChalUnprotection = value;
              break;
            case 'civicspace_youth_chal_safespace':
              record.civicspaceYouthChalSafespace = value;
              break;
            case 'civicspace_youth_chal_discrimination':
              record.civicspaceYouthChalDiscrimination = value;
              break;
            case 'civicspace_youth_chal_resource':
              record.civicspaceYouthChalResource = value;
              break;
            case 'gov_response_humanrights':
              record.govResponseHumanrights = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'gov_response_environment':
              record.govResponseEnvironment = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'gov_response_foodresource':
              record.govResponseFoodresource = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'gov_response_vulnerabelpop':
              record.govResponseVulnerablepop = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'gov_response_healthaccess':
              record.govResponseHealthaccess = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'gov_response_eduaccess':
              record.govResponseEduaccess = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'gov_response_poverty':
              record.govResponsePoverty = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'gov_response_inequality':
              record.govResponseInequality = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'gov_response_economicopp':
              record.govResponseEconomicopp = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
            case 'elit_percep_national':
              record.elitPercepNational = value;
              break;
            case 'elit_percep_local':
              record.elitPercepLocal = value;
              break;
            case 'issue_commited_voicing':
              record.issueCommitedVoicing = value;
              break;
            case 'issue_motiv_environment':
              record.issueMotivEnvironment = value;
              break;
            case 'issue_motiv_foodresources':
              record.issueMotivFoodresources = value;
              break;
            case 'issue_motiv_vulnerablepop':
              record.issueMotivVulnerablepop = value;
              break;
            case 'issue_motiv_humanrights':
              record.issueMotivHumanrights = value;
              break;
            case 'issue_motiv_healthaccess':
              record.issueMotivHealthaccess = value;
              break;
            case 'issue_motiv_educaccess':
              record.issueMotivEducaccess = value;
              break;
            case 'issue_motiv_poverty':
              record.issueMotivPoverty = value;
              break;
            case 'issue_motiv_inequality':
              record.issueMotivInequality = value;
              break;
            case 'issue_motiv_economicopp':
              record.issueMotivEconomicopp = value;
              break;
            case 'issue_motiv_other':
              record.issueMotivOther = value;
              break;
            case 'issue_motiv_text':
              record.issueMotivText = value;
              break;
            case 'issue_commited_resources':
              record.issueCommitedResources = typeof value === 'number' ? value : (value === 'Not Answer' ? null : parseInt(value as string) || null);
              break;
          }
        });
        
        researchRecords.push(record);
      }
    }
    
    console.log(`Found ${researchRecords.length} research data records`);
    
    // Clear existing research data and insert new ones
    await db.delete(researchData);
    
    // Insert in batches to avoid memory issues
    const batchSize = 50;
    for (let i = 0; i < researchRecords.length; i += batchSize) {
      const batch = researchRecords.slice(i, i + batchSize);
      await db.insert(researchData).values(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(researchRecords.length / batchSize)}`);
    }
    
    console.log('Research data imported successfully');
    console.log('Import completed!');
    
  } catch (error) {
    console.error('Error importing research data:', error);
    throw error;
  }
}

// Run the import
importResearchData()
  .then(() => {
    console.log('✅ Research data import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Research data import failed:', error);
    process.exit(1);
  });