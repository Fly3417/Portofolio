#!/usr/bin/env node
/* ============================================================
   server.js — SevenByte Portfolio
   Native HTTP server, zero dependency
   usage: node server.js [port]
   ============================================================ */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const url  = require('url');

const PORT = parseInt(process.argv[2], 10) || 8080;
const HOST = '0.0.0.0';
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.txt':  'text/plain; charset=utf-8',
  '.map':  'application/json; charset=utf-8',
};

const server = http.createServer((req, res) => {
  // log minimal
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);

  // hanya GET & HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('405 method not allowed');
  }

  // parse path
  let urlPath;
  try {
    urlPath = decodeURIComponent(url.parse(req.url).pathname || '/');
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('400 bad request');
  }

  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  // resolve + traversal guard
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 forbidden');
  }

  // stat dulu
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 not found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    };

    if (req.method === 'HEAD') {
      res.writeHead(200, headers);
      return res.end();
    }

    res.writeHead(200, headers);
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) res.writeHead(500);
      res.end('500 read error');
    });
    stream.pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[!] port ${PORT} sudah dipakai. coba port lain: node server.js ${PORT + 1}`);
  } else {
    console.error('[!] server error:', err.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  ▸ SevenByte portfolio server');
  console.log('  ─────────────────────────────');
  console.log(`  [+] listening  : http://${HOST}:${PORT}`);
  console.log(`  [+] local      : http://localhost:${PORT}`);
  console.log(`  [+] root       : ${ROOT}`);
  console.log(`  [+] stop       : Ctrl+C`);
  console.log('');
});

// graceful shutdown
['SIGINT', 'SIGTERM'].forEach(sig => {
  process.on(sig, () => {
    console.log(`\n[+] ${sig} received, shutting down...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 2000).unref();
  });
});
