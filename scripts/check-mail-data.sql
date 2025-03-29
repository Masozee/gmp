-- Check mail categories
SELECT * FROM mail_categories;

-- Check mail counter
SELECT * FROM mail_counters;

-- Check mail records
SELECT m.id, m."mailNumber", m.subject, m.type, m.status, m.date, m.sender, m.recipient, 
       mc.name as category_name, mc.code as category_code
FROM mails m
JOIN mail_categories mc ON m."categoryId" = mc.id
ORDER BY m.date DESC; 