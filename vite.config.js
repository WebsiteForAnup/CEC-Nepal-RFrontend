import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(() => {
  // Determine if we are running the JS (src) or TS (src2) version
  const isTypeScript = process.env.APP_ENV === 'ts';
  const targetDir = isTypeScript ? 'src2' : 'src';
  const outDir = process.env.BUILD_PATH || './docs';

  return {
    root: targetDir,
    publicDir: path.resolve(__dirname, 'public'),
    plugins: [react()],
    // If your index.html files live inside src/src2, set the root. 
    // Otherwise, keep root as project root and adjust your index.html scripts.
    resolve: {
      alias: {
        '@': path.resolve(__dirname, targetDir),
      },
    },
    build: {
      outDir: path.resolve(__dirname, outDir),
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});