const fs = require('fs');

async function fetchDesigns() {
  const allDesigns = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 5) {
    console.log(`Fetching page ${page}...`);

    const response = await fetch(
      `https://www.n3dmelbourne.com/api/v1/designs?limit=200&page=${page}&include=details&locale=US`, {
      headers: {
        'Authorization': `Bearer ${process.env.N3D_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const transformed = data.data.map(d => {
      let category = 'Standard';
      const titleLower = d.title.toLowerCase();
      if (titleLower.includes('mega')) category = 'Mega';
      else if (['articuno', 'zapdos', 'moltres', 'mew', 'mewtwo', 'celebi', 
                'lugia', 'ho-oh', 'entei', 'raikou', 'suicune', 'kyogre', 
                'groudon', 'rayquaza', 'deoxys', 'jirachi', 'darkrai', 
                'arceus', 'dialga', 'palkia', 'giratina', 'zekrom'].some(
          legendary => titleLower.includes(legendary))) category = 'Event';
      else if (titleLower.includes('christmas') || titleLower.includes('halloween') ||
               titleLower.includes('love') || titleLower.includes('galarian')) category = 'Special';

      const colors = d.filaments.map(f => ({
        color: f.color,
        grams: Math.round(f.weight_grams * 100) / 100
      }));

      const totalGrams = d.total_weight_grams;
      const filamentCost = Math.round(totalGrams * 0.012 * 100) / 100;
      const price = 8.0;
      const profit = Math.round((price - filamentCost) * 100) / 100;

      let cleanName = d.pokemon?.name || d.title;
      cleanName = cleanName.replace(/\s*V\d+$/, '').trim();

      return {
        name: cleanName,
        originalName: d.title,
        category: category,
        price: price,
        colors: colors,
        totalGrams: totalGrams,
        filamentCost: filamentCost,
        profit: profit,
        url: `https://www.n3dmelbourne.com/design/${d.slug}`,
        slug: d.slug,
        lastUpdated: new Date().toISOString()
      };
    });

    allDesigns.push(...transformed);
    hasMore = data.pagination.has_next;
    page++;

    if (hasMore) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  return allDesigns;
}

async function main() {
  try {
    console.log('Starting sync...');
    const designs = await fetchDesigns();

    // Load existing designs
    let existingDesigns = [];
    try {
      const existing = fs.readFileSync('data/n3d-designs.json', 'utf8');
      existingDesigns = JSON.parse(existing);
      console.log(`Loaded ${existingDesigns.length} existing designs`);
    } catch (e) {
      console.log('No existing designs file found, creating new one');
    }

    // Find new designs
    const existingSlugs = new Set(existingDesigns.map(d => d.slug));
    const newDesigns = designs.filter(d => !existingSlugs.has(d.slug));

    // Save all designs
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/n3d-designs.json', JSON.stringify(designs, null, 2));
    console.log(`Saved ${designs.length} total designs to data/n3d-designs.json`);

    // Save new designs separately
    if (newDesigns.length > 0) {
      fs.writeFileSync('data/new-designs.json', JSON.stringify(newDesigns, null, 2));
      console.log(`Found ${newDesigns.length} NEW designs: ${newDesigns.map(d => d.name).join(', ')}`);

      // Set output for GitHub Actions
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_new=true\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `new_count=${newDesigns.length}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `new_names=${newDesigns.map(d => d.name).join(', ')}\n`);
    } else {
      console.log('No new designs found');
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_new=false\n`);
    }

    console.log('Sync completed successfully!');

  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
}

main();
