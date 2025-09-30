// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages project site configuration
  site: 'https://shiotalab-tmu.github.io',
  base: '/',  // serve from root
  
  // Build configuration for static deployment
  output: 'static',
  
  // Optimize for GitHub Pages
  build: {
    assets: 'assets'  // Avoid "_astro" folder issues on GitHub Pages
  },
  
  // Force trailing slash for proper base tag behavior  
  trailingSlash: 'always'
});
