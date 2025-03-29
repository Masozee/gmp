// Import the PrismaClient
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking mail data...');

  // Check mail categories
  console.log('\n=== Mail Categories ===');
  const categories = await prisma.mailCategory.findMany({
    orderBy: { name: 'asc' }
  });
  
  console.table(categories.map(c => ({
    id: c.id,
    name: c.name,
    code: c.code,
    description: c.description
  })));

  // Check mail counter
  console.log('\n=== Mail Counter ===');
  const counters = await prisma.mailCounter.findMany();
  
  console.table(counters.map(c => ({
    id: c.id,
    year: c.year,
    counter: c.counter
  })));

  // Check mail records
  console.log('\n=== Mail Records ===');
  const mails = await prisma.mail.findMany({
    include: {
      category: true
    },
    orderBy: { date: 'desc' }
  });
  
  console.table(mails.map(m => ({
    id: m.id,
    mailNumber: m.mailNumber,
    subject: m.subject,
    type: m.type,
    status: m.status,
    date: m.date.toISOString().split('T')[0],
    sender: m.sender,
    recipient: m.recipient,
    category: m.category.name,
    categoryCode: m.category.code
  })));

  console.log(`\nTotal mail records: ${mails.length}`);
  console.log(`Outgoing mail: ${mails.filter(m => m.type === 'OUTGOING').length}`);
  console.log(`Incoming mail: ${mails.filter(m => m.type === 'INCOMING').length}`);
}

main()
  .catch((e) => {
    console.error('Error checking mail data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 