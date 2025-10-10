const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'appthibanglaixe', 'Assets', 'Stuff', 'lythuyet_question.json');

function isLikelyImage(p) {
  return typeof p === 'string' && /[\s,]/.test(p) === false && /\.(png|jpe?g|gif|svg)$/i.test(p);
}

try {
  const raw = fs.readFileSync(jsonPath, 'utf8');
  const arr = JSON.parse(raw);
  const idCounts = new Map();
  const problems = [];

  arr.forEach((item, idx) => {
    const id = item.id;
    if (id !== undefined) idCounts.set(id, (idCounts.get(id) || 0) + 1);

    // options checks
    if (!('options' in item)) {
      // detect common typo
      if ('opstions' in item || 'option' in item) {
        problems.push({ idx, id, issue: 'options key typo (opstions/option) present' });
      } else {
        problems.push({ idx, id, issue: 'missing options' });
      }
    } else if (!Array.isArray(item.options)) {
      problems.push({ idx, id, issue: 'options is not an array' });
    }

    // image checks
    if (item.image) {
      if (typeof item.image !== 'string') {
        problems.push({ idx, id, issue: 'image is not a string' });
      } else {
        // suspicious characters (commas, spaces) or missing extension
        if (/[,\s]/.test(item.image)) problems.push({ idx, id, issue: `image path contains invalid characters: "${item.image}"` });
        if (!/\.(png|jpe?g|gif|svg)$/i.test(item.image)) problems.push({ idx, id, issue: `image path has unexpected extension or none: "${item.image}"` });
      }
    }
  });

  // report duplicate ids
  const dupIds = [...idCounts.entries()].filter(([k,v]) => v > 1).map(([k,v]) => ({ id:k, count:v }));

  console.log('Scan report:');
  console.log('Total items:', arr.length);
  if (dupIds.length) {
    console.log('Duplicate ids found:', dupIds);
  } else {
    console.log('No duplicate ids found.');
  }
  if (problems.length) {
    console.log('Problems found (index in array, id, issue):');
    problems.forEach(p => console.log(p));
  } else {
    console.log('No item-level problems detected.');
  }
} catch (err) {
  console.error('Error reading or parsing JSON:', err.message);
  process.exit(1);
}