import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Universal Backblaze B2 proxy plugin for local development.
 *
 * Problem: B2's native API endpoints (authorize, get-upload-url) never send
 * CORS headers. The upload pod URLs (pod-XXX.backblaze.com) also return 401
 * on CORS preflights from browsers — even when bucket CORS rules are set.
 *
 * Solution: A custom Vite middleware at /b2-proxy that acts as a transparent
 * server-side HTTP forwarder. ALL B2 requests in dev mode go to localhost:3000
 * first (same-origin = no CORS preflight), then the middleware forwards them
 * to the actual B2 URL specified in the X-B2-Target-URL request header.
 */
function b2ProxyPlugin() {
  return {
    name: 'b2-universal-proxy',
    configureServer(server) {
      server.middlewares.use('/b2-proxy', async (req, res) => {
        // All responses from this route get CORS headers so the browser
        // doesn't complain about the same-origin response either.
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Max-Age', '3600');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        const targetUrl = req.headers['x-b2-target-url'];
        if (!targetUrl || typeof targetUrl !== 'string') {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing X-B2-Target-URL header' }));
          return;
        }

        // Collect request body (binary-safe)
        const bodyChunks = [];
        for await (const chunk of req) bodyChunks.push(chunk);
        const body = Buffer.concat(bodyChunks);

        // Forward only meaningful headers — strip browser/proxy-specific ones
        const SKIP = new Set([
          'host', 'origin', 'referer', 'connection',
          'x-b2-target-url',
          'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest',
          'sec-fetch-user', 'priority', 'cookie',
          'upgrade-insecure-requests',
        ]);
        const forwardHeaders = {};
        for (const [k, v] of Object.entries(req.headers)) {
          if (!SKIP.has(k.toLowerCase())) forwardHeaders[k] = v;
        }

        try {
          const upstream = await fetch(targetUrl, {
            method: req.method,
            headers: forwardHeaders,
            body: body.length > 0 ? body : undefined,
          });

          res.statusCode = upstream.status;
          upstream.headers.forEach((v, k) => {
            // Skip hop-by-hop headers that must not be forwarded
            if (['transfer-encoding', 'connection', 'keep-alive'].includes(k.toLowerCase())) return;
            res.setHeader(k, v);
          });

          const responseBody = await upstream.arrayBuffer();
          res.end(Buffer.from(responseBody));
        } catch (err) {
          console.error('[b2-proxy] Upstream error:', err.message);
          res.statusCode = 502;
          res.end(JSON.stringify({ error: 'B2 proxy upstream error: ' + err.message }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  // Determine if we are running the JS (src) or TS (src2) version
  const isTypeScript = process.env.APP_ENV === 'ts';
  const targetDir = isTypeScript ? 'src2' : 'src';
  const outDir = process.env.BUILD_PATH || './docs';

  return {
    root: targetDir,
    publicDir: path.resolve(__dirname, 'public'),
    envDir: path.resolve(__dirname),
    plugins: [react(), b2ProxyPlugin()],
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
      // No proxy rules needed — b2ProxyPlugin handles all B2 traffic
    },
  };
});