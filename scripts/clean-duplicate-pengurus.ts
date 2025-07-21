import { db } from '@/lib/db/index';
import { boardMembers, organizationStaff } from '@/lib/db/content-schema';
import { sql } from 'drizzle-orm';

async function cleanDuplicatePengurus() {
  try {
    console.log('Starting duplicate pengurus cleanup...');
    
    // Clean board members duplicates
    console.log('Cleaning board members duplicates...');
    const boardMembersList = await db.select().from(boardMembers);
    
    // Group by name to find duplicates
    const boardGrouped = boardMembersList.reduce((acc: any, member) => {
      const key = member.name.toLowerCase().trim();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(member);
      return acc;
    }, {});
    
    let boardDuplicatesRemoved = 0;
    for (const [name, members] of Object.entries(boardGrouped) as [string, any[]]) {
      if (members.length > 1) {
        console.log(`Found ${members.length} duplicates for board member: ${name}`);
        // Sort by creation date, keep the oldest one
        members.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const toKeep = members[0];
        const toDelete = members.slice(1);
        
        console.log(`Keeping board member ID ${toKeep.id}, removing ${toDelete.length} duplicates`);
        
        for (const duplicate of toDelete) {
          await db.delete(boardMembers).where(sql`id = ${duplicate.id}`);
          boardDuplicatesRemoved++;
        }
      }
    }
    
    // Clean organization staff duplicates
    console.log('Cleaning organization staff duplicates...');
    const staffList = await db.select().from(organizationStaff);
    
    // Group by name to find duplicates
    const staffGrouped = staffList.reduce((acc: any, staff) => {
      const key = staff.name.toLowerCase().trim();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(staff);
      return acc;
    }, {});
    
    let staffDuplicatesRemoved = 0;
    for (const [name, members] of Object.entries(staffGrouped) as [string, any[]]) {
      if (members.length > 1) {
        console.log(`Found ${members.length} duplicates for staff member: ${name}`);
        // Sort by creation date, keep the oldest one
        members.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const toKeep = members[0];
        const toDelete = members.slice(1);
        
        console.log(`Keeping staff member ID ${toKeep.id}, removing ${toDelete.length} duplicates`);
        
        for (const duplicate of toDelete) {
          await db.delete(organizationStaff).where(sql`id = ${duplicate.id}`);
          staffDuplicatesRemoved++;
        }
      }
    }
    
    console.log(`Cleanup completed!`);
    console.log(`Board members duplicates removed: ${boardDuplicatesRemoved}`);
    console.log(`Staff duplicates removed: ${staffDuplicatesRemoved}`);
    console.log(`Total duplicates removed: ${boardDuplicatesRemoved + staffDuplicatesRemoved}`);
    
    // Show final counts
    const finalBoardCount = await db.select({ count: sql`count(*)` }).from(boardMembers);
    const finalStaffCount = await db.select({ count: sql`count(*)` }).from(organizationStaff);
    
    console.log(`Final board members count: ${finalBoardCount[0].count}`);
    console.log(`Final staff count: ${finalStaffCount[0].count}`);
    
  } catch (error) {
    console.error('Error cleaning duplicate pengurus:', error);
    throw error;
  }
}

// Run the cleanup
cleanDuplicatePengurus()
  .then(() => {
    console.log('✅ Duplicate pengurus cleanup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Duplicate pengurus cleanup failed:', error);
    process.exit(1);
  });