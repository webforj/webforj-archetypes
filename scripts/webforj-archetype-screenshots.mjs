/**
 * Archetype Screenshot Generator
 *
 * Boots a generated spring archetype via `mvn spring-boot:run`, waits for the
 * webforJ app to hydrate, then takes WebP screenshots in both light and dark
 * mode at 2x DPR. Outputs go to the webforJ documentation repo under
 * docs/static/img/archetypes/{light,dark}/<name>.webp.
 *
 * Usage:
 *   node webforj-archetype-screenshots.mjs <archetype>
 *
 * Examples:
 *   node webforj-archetype-screenshots.mjs sidemenu
 *   node webforj-archetype-screenshots.mjs tabs
 *
 * Prerequisites:
 *   - `.generated/<archetype>-spring` exists (run scripts/generate.cjs first)
 *   - Maven on PATH
 *   - `sips` (macOS) or `cwebp` installed for PNG -> WebP conversion
 */

import { chromium } from '@playwright/test';
import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARCHETYPE_ROOT = resolve(__dirname, '..');
const DOCS_IMG_ROOT = resolve(
  ARCHETYPE_ROOT,
  '../webforj-documentation/docs/static/img/archetypes'
);

const DEFAULT_VIEWPORT = { width: 860, height: 645 };
const DPR = 2;
const PORT = 8090;
const BASE_URL = `http://localhost:${PORT}`;
const BOOT_TIMEOUT_MS = 120_000;

// Per-archetype viewport. Smaller viewport = content gets scaled down less
// when placed into the fixed-size GalleryCard, so each UI element reads
// bigger / cleaner.
//  - sidemenu: 860x645 (drawer collapses below ~800px)
//  - tabs / blank: 720x540 (smaller = cleaner in the card)
//  - hello-world: 640x480
const VIEWPORTS = {
  tabs: { width: 720, height: 540 },
  blank: { width: 720, height: 540 },
  'hello-world': { width: 640, height: 480 },
};

// Per-archetype layout tweaks applied BEFORE screenshot. Repositions content
// only — does not change colors, backgrounds, or any visual style. Used when
// the archetype renders top-aligned but we want the content centered in the
// card screenshot.
const LAYOUT_CSS = {
  'hello-world': `
    dwc-window-center {
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      min-height: 100vh !important;
    }
    dwc-window-content {
      width: 100% !important;
    }
  `,
};


const archetype = process.argv[2];
if (!archetype) {
  console.error('Usage: node webforj-archetype-screenshots.mjs <archetype>');
  process.exit(1);
}

const projectDir = resolve(ARCHETYPE_ROOT, `.generated/${archetype}-spring`);
if (!existsSync(projectDir)) {
  console.error(`No project at ${projectDir} — run scripts/generate.cjs first.`);
  process.exit(1);
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function waitForServer(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

async function waitForHydration(page) {
  // webforJ keeps a LiveReload WebSocket open, so `networkidle` never fires.
  // Wait for `load` + app-level `appload` event + a paint settle instead.
  await page.waitForLoadState('load');
  await page.evaluate(
    () =>
      new Promise((res) => {
        let done = false;
        const finish = () => { if (!done) { done = true; res(); } };
        if (document.body?.hasAttribute('data-appload')) return finish();
        document.addEventListener('appload', finish, { once: true });
        const obs = new MutationObserver(() => {
          if (document.querySelector('.hydrated')) { obs.disconnect(); finish(); }
        });
        obs.observe(document.documentElement, {
          subtree: true, attributes: true, attributeFilter: ['class'],
        });
        setTimeout(finish, 8000);
      })
  );
  await page.waitForTimeout(1200);
}

function convertToWebp(filePath) {
  const tmpPng = filePath.replace(/\.webp$/, '.png');
  renameSync(filePath, tmpPng);
  try {
    execSync(`cwebp -q 90 "${tmpPng}" -o "${filePath}"`, { stdio: 'ignore' });
    unlinkSync(tmpPng);
    return;
  } catch {}
  renameSync(tmpPng, filePath);
  console.warn(`  WARN  kept ${filePath} as PNG (cwebp not found)`);
}

async function main() {
  const lightDir = resolve(DOCS_IMG_ROOT, 'light');
  const darkDir = resolve(DOCS_IMG_ROOT, 'dark');
  ensureDir(lightDir);
  ensureDir(darkDir);

  console.log(`Booting ${archetype}-spring on port ${PORT}...`);
  const mvn = spawn(
    'mvn',
    [
      '-q',
      'spring-boot:run',
      `-Dspring-boot.run.arguments=--server.port=${PORT} --webforj.devtools.browser.open=false`,
    ],
    {
      cwd: projectDir,
      stdio: 'inherit',
      detached: true,
    }
  );

  const killMvn = () => {
    if (mvn && !mvn.killed) {
      try {
        process.kill(-mvn.pid, 'SIGTERM');
      } catch {}
    }
  };
  process.on('SIGINT', () => { killMvn(); process.exit(130); });
  process.on('SIGTERM', () => { killMvn(); process.exit(143); });
  process.on('exit', killMvn);

  try {
    await waitForServer(BASE_URL, BOOT_TIMEOUT_MS);
    console.log('Server up, launching browser...');

    const browser = await chromium.launch({ headless: true });
    const viewport = VIEWPORTS[archetype] || DEFAULT_VIEWPORT;
    const layoutCss = LAYOUT_CSS[archetype];

    // Light
    const lightCtx = await browser.newContext({
      viewport,
      deviceScaleFactor: DPR,
      reducedMotion: 'reduce',
    });
    const lightPage = await lightCtx.newPage();
    await lightPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await waitForHydration(lightPage);
    if (layoutCss) {
      await lightPage.addStyleTag({ content: layoutCss });
      await lightPage.waitForTimeout(200);
    }
    const lightPath = resolve(lightDir, `${archetype}.webp`);
    await lightPage.screenshot({ path: lightPath, type: 'png' });
    await lightCtx.close();
    convertToWebp(lightPath);
    console.log(`  OK    light -> ${lightPath}`);

    // Dark
    const darkCtx = await browser.newContext({
      viewport,
      deviceScaleFactor: DPR,
      reducedMotion: 'reduce',
    });
    const darkPage = await darkCtx.newPage();
    await darkPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await waitForHydration(darkPage);
    await darkPage.evaluate(() => {
      document.documentElement.setAttribute('data-app-theme', 'dark');
    });
    await darkPage.waitForTimeout(600);
    if (layoutCss) {
      await darkPage.addStyleTag({ content: layoutCss });
      await darkPage.waitForTimeout(200);
    }
    const darkPath = resolve(darkDir, `${archetype}.webp`);
    await darkPage.screenshot({ path: darkPath, type: 'png' });
    await darkCtx.close();
    convertToWebp(darkPath);
    console.log(`  OK    dark  -> ${darkPath}`);

    await browser.close();
  } finally {
    console.log('Shutting down server...');
    killMvn();
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
