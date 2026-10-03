import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

// Development reads the preserved source pack; the build copies it to dist/art.
const artRoot = resolve('art/production/v01');
export default defineConfig({
  base: './',
  plugins: [react(), {
    name: 'local-art-pack',
    configureServer(server) {
      server.middlewares.use('/art', async (req, res, next) => {
        // Source JSON imports still belong to Vite's module pipeline.
        if (req.url?.startsWith('/production/v01/') || req.url?.startsWith('/ui-screens/')) { next(); return; }
        try {
          const path = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname);
          const file = resolve(artRoot, '.' + path);
          if (!file.startsWith(artRoot + sep) || !(await stat(file)).isFile()) { res.writeHead(404).end(); return; }
          const mime: Record<string,string> = { '.png':'image/png', '.svg':'image/svg+xml', '.html':'text/html; charset=utf-8', '.json':'application/json; charset=utf-8' };
          res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
          createReadStream(file).pipe(res);
        } catch { res.writeHead(404).end(); }
      });
    }
  }],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  build: { target: ['es2022', 'chrome109', 'safari16.4'], rollupOptions: { input: { game:resolve('index.html'), screens:resolve('ui-preview.html'), season:resolve('season-preview.html') } } }
});
