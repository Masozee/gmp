import { db } from '@/lib/db/index';

async function createResearchTables() {
  try {
    console.log('Creating research tables...');
    
    // Create research_attributes table
    await db.run(`
      CREATE TABLE IF NOT EXISTS research_attributes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        column_name TEXT NOT NULL UNIQUE,
        label TEXT NOT NULL,
        class TEXT NOT NULL,
        is_ordered INTEGER NOT NULL,
        is_factor INTEGER NOT NULL,
        n_unique INTEGER NOT NULL,
        example_values TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create research_data table
    await db.run(`
      CREATE TABLE IF NOT EXISTS research_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        region_live TEXT,
        age INTEGER,
        gender TEXT,
        activism TEXT,
        political_exposure TEXT,
        polexp_tiktok TEXT,
        polexp_x TEXT,
        polexp_ig TEXT,
        polexp_yt TEXT,
        polexp_newsapp TEXT,
        polexp_newsconv TEXT,
        polexp_peers TEXT,
        polexp_peers_intensity TEXT,
        civspace_expression TEXT,
        civspace_rights TEXT,
        civspace_gather TEXT,
        civspace_discuss TEXT,
        civspace_critics TEXT,
        civspace_allabove TEXT,
        civspace_heard TEXT,
        civspace_understanding TEXT,
        civicspace_change TEXT,
        civicspace_lead_censoring TEXT,
        civicspace_lead_violence TEXT,
        civicspace_lead_presslimit TEXT,
        civicspace_lead_banning TEXT,
        civicspace_lead_repression TEXT,
        civicspace_lead_monopoly TEXT,
        civicspace_lead_accountability TEXT,
        civicspace_lead_allgood TEXT,
        civicspace_youth_union TEXT,
        civicspace_youth_gather TEXT,
        civicspace_youth_express TEXT,
        civicspace_youth_protect TEXT,
        civicspace_youth_resource TEXT,
        civicspace_youth_representation TEXT,
        civicspace_youth_chal_intimidation TEXT,
        civicspace_youth_chal_ban TEXT,
        civicspace_youth_chal_censoring TEXT,
        civicspace_youth_chal_unprotection TEXT,
        civicspace_youth_chal_safespace TEXT,
        civicspace_youth_chal_discrimination TEXT,
        civicspace_youth_chal_resource TEXT,
        gov_response_humanrights INTEGER,
        gov_response_environment INTEGER,
        gov_response_foodresource INTEGER,
        gov_response_vulnerablepop INTEGER,
        gov_response_healthaccess INTEGER,
        gov_response_eduaccess INTEGER,
        gov_response_poverty INTEGER,
        gov_response_inequality INTEGER,
        gov_response_economicopp INTEGER,
        elit_percep_national TEXT,
        elit_percep_local TEXT,
        issue_commited_voicing TEXT,
        issue_motiv_environment TEXT,
        issue_motiv_foodresources TEXT,
        issue_motiv_vulnerablepop TEXT,
        issue_motiv_humanrights TEXT,
        issue_motiv_healthaccess TEXT,
        issue_motiv_educaccess TEXT,
        issue_motiv_poverty TEXT,
        issue_motiv_inequality TEXT,
        issue_motiv_economicopp TEXT,
        issue_motiv_other TEXT,
        issue_motiv_text TEXT,
        issue_commited_resources INTEGER,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Research tables created successfully');
    
  } catch (error) {
    console.error('Error creating research tables:', error);
    throw error;
  }
}

// Run the table creation
createResearchTables()
  .then(() => {
    console.log('✅ Research tables created successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Research table creation failed:', error);
    process.exit(1);
  });