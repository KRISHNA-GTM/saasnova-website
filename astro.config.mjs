// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static build for S3 + CloudFront.
// Pages build to /<path>/index.html; a CloudFront Function (deploy/cloudfront-function.js)
// maps clean URLs (/programs/ignite) to those objects and issues legacy 301s.
export default defineConfig({
  site: 'https://www.saasnova.ai',
  trailingSlash: 'never',
  build: {
    format: 'directory',
    assets: '_assets',
  },
  output: 'static',
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/thank-you') &&
        !page.includes('/404') &&
        !/\/(privacy|terms)\/?$/.test(page),
      serialize(item) {
        // Clean URLs without trailing slash to match canonical tags.
        item.url = item.url.replace(/\/$/, '') || 'https://www.saasnova.ai/';
        if (item.url === 'https://www.saasnova.ai') item.url = 'https://www.saasnova.ai/';
        return item;
      },
    }),
  ],
});
