/**
 * b2Service.ts
 *
 * Direct Backblaze B2 upload service for the React frontend.
 *
 * ── DEV mode ────────────────────────────────────────────────────────────────
 * ALL B2 HTTP calls (authorize, get-upload-url, AND the file upload itself)
 * are routed through the Vite /b2-proxy middleware defined in vite.config.js.
 * Because every request is same-origin (localhost:3000 → localhost:3000), the
 * browser never sends a CORS preflight to B2, bypassing all CORS issues.
 *
 * ── Production ──────────────────────────────────────────────────────────────
 * Requests go directly to B2. You must configure bucket CORS rules in the B2
 * console to allow your production origin, with allowedHeaders including:
 *   authorization, content-type, x-bz-file-name, x-bz-content-sha1
 *
 * SECURITY NOTE: B2 credentials are in the browser bundle. This admin page is
 * gated by Neon authentication so only signed-in admins can reach it.
 */

const KEY_ID      = import.meta.env.VITE_B2_APPLICATION_KEY_ID as string;
const APP_KEY     = import.meta.env.VITE_B2_APPLICATION_KEY    as string;
const BUCKET_ID   = import.meta.env.VITE_B2_BUCKET_ID          as string;
const BUCKET_NAME = import.meta.env.VITE_B2_BUCKET_NAME        as string;

// ─────────────────────────────────────────────────────────────────────────────
// Auth session cache
// ─────────────────────────────────────────────────────────────────────────────

interface B2AuthSession {
  authorizationToken: string;
  accountId: string;
  /** e.g. https://api006.backblazeb2.com */
  apiUrl: string;
  /** e.g. https://f006.backblazeb2.com */
  downloadUrl: string;
}

let cachedAuth: B2AuthSession | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// Core helper: route all B2 requests through /b2-proxy in dev mode
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrapper around `fetch` that transparently routes B2 API calls through the
 * Vite dev-server proxy in development, avoiding all browser CORS restrictions.
 * In production, the request goes directly to B2.
 *
 * @param targetUrl  The actual B2 API URL to call.
 * @param init       Standard `RequestInit` options (headers, method, body…).
 */
async function b2Fetch(targetUrl: string, init: RequestInit = {}): Promise<Response> {
  if (!import.meta.env.DEV) {
    // Production: call B2 directly (bucket CORS rules allow the prod origin)
    return fetch(targetUrl, init);
  }

  // Development: route through the Vite /b2-proxy middleware.
  // The middleware reads X-B2-Target-URL and forwards the full request server-side.
  const headers = new Headers(init.headers);
  headers.set('X-B2-Target-URL', targetUrl);

  return fetch('/b2-proxy', {
    ...init,
    headers,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SHA-1 via WebCrypto (required by B2 for upload integrity)
// ─────────────────────────────────────────────────────────────────────────────

async function sha1Hex(buffer: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-1', buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// B2 API steps
// ─────────────────────────────────────────────────────────────────────────────

async function authorizeB2(): Promise<B2AuthSession> {
  if (cachedAuth) return cachedAuth;

  const credentials = btoa(`${KEY_ID}:${APP_KEY}`);
  const res = await b2Fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
    headers: { Authorization: `Basic ${credentials}` },
  });

  if (!res.ok) {
    throw new Error(`B2 auth failed (${res.status}): ${await res.text()}`);
  }

  const d = await res.json();
  cachedAuth = {
    authorizationToken: d.authorizationToken,
    accountId: d.accountId,
    apiUrl: d.apiUrl,
    downloadUrl: d.downloadUrl,
  };
  return cachedAuth;
}

async function getUploadUrl(
  auth: B2AuthSession
): Promise<{ uploadUrl: string; uploadAuthToken: string }> {
  const res = await b2Fetch(`${auth.apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: 'POST',
    headers: {
      Authorization: auth.authorizationToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bucketId: BUCKET_ID }),
  });

  if (!res.ok) {
    throw new Error(`b2_get_upload_url failed (${res.status}): ${await res.text()}`);
  }

  const d = await res.json();
  return { uploadUrl: d.uploadUrl, uploadAuthToken: d.authorizationToken };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export interface B2UploadResult {
  fileId: string;
  fileName: string;
  /** Full public CDN download URL */
  publicUrl: string;
  contentType: string;
  size: number;
}

export type B2ProgressCallback = (pct: number) => void;

/**
 * Upload a File to Backblaze B2 and return its public download URL.
 *
 * @param file        The File object to upload.
 * @param folder      Folder prefix inside the bucket, e.g. "news/images".
 * @param onProgress  Optional callback with progress 0–100.
 */
export async function uploadToB2(
  file: File,
  folder = 'uploads',
  onProgress?: B2ProgressCallback
): Promise<B2UploadResult> {
  if (!KEY_ID || !APP_KEY || !BUCKET_ID) {
    throw new Error(
      'Backblaze B2 credentials not configured. ' +
        'Set VITE_B2_APPLICATION_KEY_ID, VITE_B2_APPLICATION_KEY, and VITE_B2_BUCKET_ID in your .env file.'
    );
  }

  // 1. Authorize (result cached for the page session)
  onProgress?.(5);
  const auth = await authorizeB2();

  // 2. Get one-time upload URL
  onProgress?.(15);
  const { uploadUrl, uploadAuthToken } = await getUploadUrl(auth);

  // 3. Read file into ArrayBuffer and compute SHA-1 checksum
  onProgress?.(25);
  const arrayBuffer = await file.arrayBuffer();
  const sha1 = await sha1Hex(arrayBuffer);

  // 4. Build a safe, unique remote path
  const safeName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_');
  const remoteName = `${folder}/${Date.now()}_${safeName}`;

  // 5. Upload
  //    • DEV:  via /b2-proxy middleware (same-origin, no CORS) — b2Fetch handles routing.
  //            We use fetch (not XHR) because real upload progress to localhost is instant.
  //    • PROD: via XHR to pod URL directly, with real upload progress events.
  onProgress?.(35);

  let publicUrl: string;

  if (import.meta.env.DEV) {
    // DEV: single fetch through proxy — progress jumps 35 → 100
    const uploadHeaders: Record<string, string> = {
      Authorization: uploadAuthToken,
      'X-Bz-File-Name': encodeURIComponent(remoteName),
      'Content-Type': file.type || 'application/octet-stream',
      'X-Bz-Content-Sha1': sha1,
    };

    const res = await b2Fetch(uploadUrl, {
      method: 'POST',
      headers: uploadHeaders,
      body: new Blob([arrayBuffer]),
    });

    if (!res.ok) {
      throw new Error(`B2 upload failed (${res.status}): ${await res.text()}`);
    }

    const result = await res.json();
    publicUrl = `${auth.downloadUrl}/file/${BUCKET_NAME}/${encodeURIComponent(result.fileName)}`;
    onProgress?.(100);
  } else {
    // PROD: XHR to pod URL for real upload progress events
    publicUrl = await new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);

      xhr.setRequestHeader('Authorization', uploadAuthToken);
      xhr.setRequestHeader('X-Bz-File-Name', encodeURIComponent(remoteName));
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.setRequestHeader('X-Bz-Content-Sha1', sha1);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress?.(Math.round(35 + (event.loaded / event.total) * 60));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const result = JSON.parse(xhr.responseText);
          const url = `${auth.downloadUrl}/file/${BUCKET_NAME}/${encodeURIComponent(result.fileName)}`;
          onProgress?.(100);
          resolve(url);
        } else {
          reject(new Error(`B2 upload failed (${xhr.status}): ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during B2 upload.'));
      xhr.send(new Blob([arrayBuffer]));
    });
  }

  return {
    fileId: '',
    fileName: remoteName,
    publicUrl,
    contentType: file.type,
    size: file.size,
  };
}

/** Clear the cached auth session (e.g. after receiving a B2 401 error) */
export function clearB2AuthCache(): void {
  cachedAuth = null;
}
