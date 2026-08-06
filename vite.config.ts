import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Set DISABLE_HMR=true to disable HMR.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      // CHOKIDAR_USEPOLLING is set by the Docker Compose "dev" service, since bind
      // mounts on Windows/macOS don't reliably forward native FS change events into
      // the Linux container, which otherwise breaks hot reload.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
        interval: 300,
      },
    },
  };
});
