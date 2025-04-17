// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tinaDirective from "./astro-tina-directive/register"

// https://astro.build/config
export default defineConfig({
	site: 'https://garanas.github.io',
	base: 'website-astro-tina',
	integrations: [mdx(), sitemap(), react(), tinaDirective()],
});
