// npm run build:notes. Requires Playwright + Chromium (npm i -D playwright; npx playwright install chromium).
// Uses a local HTTP server and the app's own diagrams/notation; no remote fonts or services.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createRequire } from 'node:module';
import { UNITS } from '../js/lessons/index.js';
import { pdfPath, NOTES_VERSION } from '../js/notes.js';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch (error) {
  if (!process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES) throw error;
  ({ chromium } = createRequire(resolve(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES, 'playwright/package.json'))('playwright'));
}
const root = resolve(new URL('..', import.meta.url).pathname);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  const path = resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!path.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try { res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream'); res.end(await readFile(path)); }
  catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html#/notes/library`);
  await page.waitForSelector('.notes-chapter .notes-example svg');
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await mkdir(resolve(root, 'notes'), { recursive: true });
  for (const id of [...UNITS.map(u => u.id), 'all', 'intermediate', 'advanced']) {
    await page.evaluate(id => document.querySelectorAll('.notes-chapter').forEach(el => { el.style.display = (id==='all' ? el.dataset.chapter.startsWith('u') : id==='intermediate' ? el.dataset.chapter.startsWith('i') : id==='advanced' ? el.dataset.chapter.startsWith('a') : el.dataset.chapter===id) ? '' : 'none'; }), id);
    await page.pdf({ path: resolve(root, pdfPath(id)), format: 'Letter', preferCSSPageSize: true, printBackground: true,
      displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: `<div style="width:100%;text-align:center;font:8px Arial;color:#666">Piano Tutor · Chapter notes · ${NOTES_VERSION} · <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
    });
    console.log(pdfPath(id));
  }
  if (errors.length) throw new Error(errors.join('\n'));
  // Deterministic source fingerprint lets CI detect PDFs left behind by a curriculum edit.
  const { notesFingerprint } = await import('./notes-source.mjs');
  await writeFile(resolve(root, 'notes/source.sha256'), await notesFingerprint() + '\n');
} finally { await browser?.close(); await new Promise(r => server.close(r)); }
