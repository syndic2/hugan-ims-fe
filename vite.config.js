import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from "vite-plugin-pwa";
import dotenv from 'dotenv';

import manifest from './manifest';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifest)],
  define: {
    'process.env': process.env
  }
})
