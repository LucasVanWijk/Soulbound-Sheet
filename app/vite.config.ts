import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Pages serves the site from /Soulbound-Sheet/; the rules data lives one level up in knowledge-base/.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { fs: { allow: ['..'] } },
});
