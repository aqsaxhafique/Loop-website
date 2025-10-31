const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const API_URL = process.env.API_URL || 'https://bakinlane-server.netlify.app/.netlify/functions';
const SITE_DOMAIN = process.env.SITE_DOMAIN || 'https://www.loop.pk';

async function fetchProducts() {
  try {
    // Try fetching from API first
    const resp = await axios.get(`${API_URL}/api/products`);
    if (resp.status === 200 && Array.isArray(resp.data.products)) {
      return resp.data.products;
    }
    console.error('Unexpected products response', resp.status);
    return [];
  } catch (e) {
    console.warn('Failed to fetch products from API, falling back to local file if available');
    // If API fetch fails (user may not have API during local development), try local products file
    try {
      const localPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
      if (fs.existsSync(localPath)) {
        const content = fs.readFileSync(localPath, 'utf8');
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return parsed;
        if (Array.isArray(parsed.products)) return parsed.products;
      }
    } catch (err) {
      console.error('Failed reading local products file:', err.message || err);
    }

    console.error('No products available for sitemap generation (API and local file both unavailable).');
    return [];
  }
}

function buildSitemap(urls) {
  const lastmod = new Date().toISOString().split('T')[0];
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  urls.forEach((u) => {
    lines.push('  <url>');
    lines.push(`    <loc>${u}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push('    <changefreq>weekly</changefreq>');
    lines.push('    <priority>0.80</priority>');
    lines.push('  </url>');
  });

  lines.push('</urlset>');
  return lines.join('\n');
}

async function main() {
  console.log('Generating sitemap from products API...');
  const products = await fetchProducts();

  // Core pages to include
  const urls = [
    `${SITE_DOMAIN}/`,
    `${SITE_DOMAIN}/products`,
    `${SITE_DOMAIN}/about`,
  ];

  // Add product pages
  products.forEach((p) => {
    // assume product.id is the route param used in app
    if (p && p.id) {
      urls.push(`${SITE_DOMAIN}/products/${encodeURIComponent(p.id)}`);
    }
  });

  const sitemap = buildSitemap(urls);

  const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, sitemap, 'utf8');
  console.log('Sitemap written to', outPath);
}

main().catch((e) => {
  console.error('Sitemap generation failed', e);
  process.exit(1);
});
