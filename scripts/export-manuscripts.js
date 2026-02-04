const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '..', 'manuscript-exports');

// Create output directory
fs.mkdirSync(outputDir, { recursive: true });

// Strip XML tags and clean up text
function extractText(xml) {
  if (!xml) return '';

  // Extract title
  const titleMatch = xml.match(/<article-title[^>]*>([\s\S]*?)<\/article-title>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, ' ').trim() : '';

  // Extract abstract
  const abstractMatch = xml.match(/<abstract[^>]*>([\s\S]*?)<\/abstract>/i);
  const abstract = abstractMatch ? abstractMatch[1].replace(/<[^>]+>/g, ' ').trim() : '';

  // Extract body
  const bodyMatch = xml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, ' ').trim() : '';

  // Clean up whitespace
  const clean = (text) => text.replace(/\s+/g, ' ').trim();

  let output = '';
  if (title) output += 'TITLE:\n' + clean(title) + '\n\n';
  if (abstract) output += 'ABSTRACT:\n' + clean(abstract) + '\n\n';
  if (body) output += 'FULL TEXT:\n' + clean(body);

  return output || xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Sanitize filename
function sanitize(name) {
  return name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 80);
}

const client = new Client({ connectionString: 'postgresql://postgres:postgres@localhost:5433/postgres' });

async function main() {
  await client.connect();

  const res = await client.query(`
    SELECT m.title, m.id, f.doi, f."xmlData"
    FROM "Manuscript" m
    JOIN "ManuscriptSource" ms ON ms."manuscriptId" = m.id
    JOIN "f1000Document" f ON f.doi = ms.doi
  `);

  console.log('Found ' + res.rows.length + ' manuscripts with full text\n');

  res.rows.forEach((row, idx) => {
    const filename = sanitize(row.title) + '.txt';
    const filepath = path.join(outputDir, filename);
    const content = extractText(row.xmlData);
    fs.writeFileSync(filepath, content);
    console.log((idx + 1) + '. ' + filename);
  });

  console.log('\n✓ Saved to: ' + outputDir);
  await client.end();
}

main().catch(err => {
  console.error('Error:', err.message);
  client.end();
});
