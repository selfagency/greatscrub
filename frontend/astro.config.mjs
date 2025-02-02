// @ts-check
import { defineConfig } from 'astro/config';

import pocketbase from 'astro-pocketbase';

// https://astro.build/config
export default defineConfig({
  integrations: [pocketbase()]
});