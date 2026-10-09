// Enforces bundle-size budgets so performance regressions are caught at build time.
// Runs automatically via the `postbuild` npm script, after `vite build`.
import { readFileSync, readdirSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const assets = join(dist, 'assets')
const KB = 1024

// Budgets (gzip). Give generous headroom; raise intentionally, never silently.
const BUDGETS = {
  initialGzip: 300 * KB, // entry + modulepreloaded chunks (first load)
  chunkGzip: 120 * KB, // any single JS chunk
  totalGzip: 1000 * KB, // every JS chunk combined
}

const gzipSize = (p) => gzipSync(readFileSync(p)).length

let html = ''
try {
  html = readFileSync(join(dist, 'index.html'), 'utf8')
} catch {
  console.error('check-bundle: dist/index.html not found — run `npm run build` first.')
  process.exit(1)
}

// The browser eagerly fetches the entry script and every modulepreloaded chunk.
const initialRefs = new Set()
for (const m of html.matchAll(/<(?:script|link)[^>]+?(?:src|href)="([^"]+\.js)"/g)) initialRefs.add(m[1])
for (const m of html.matchAll(/modulepreload[^>]*?href="([^"]+)"/g)) initialRefs.add(m[1])
const initialGzip = [...initialRefs].reduce(
  (sum, ref) => sum + gzipSize(join(dist, ref.replace(/^\//, ''))),
  0,
)

let totalGzip = 0
let maxChunk = { name: '', gzip: 0 }
for (const file of readdirSync(assets).filter((f) => f.endsWith('.js'))) {
  const g = gzipSize(join(assets, file))
  totalGzip += g
  if (g > maxChunk.gzip) maxChunk = { name: file, gzip: g }
}

const fmt = (n) => `${(n / KB).toFixed(0)} kB`
const rows = [
  { label: 'initial JS (gzip)', value: initialGzip, budget: BUDGETS.initialGzip },
  { label: `largest chunk (${maxChunk.name})`, value: maxChunk.gzip, budget: BUDGETS.chunkGzip },
  { label: 'total JS (gzip)', value: totalGzip, budget: BUDGETS.totalGzip },
]

let failed = false
console.log('\nBundle budget:')
for (const r of rows) {
  const ok = r.value <= r.budget
  if (!ok) failed = true
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.label.padEnd(40)} ${fmt(r.value).padStart(8)} / ${fmt(r.budget).padStart(8)}`)
}

if (failed) {
  console.error('\ncheck-bundle: bundle is over budget. Reduce the payload or update scripts/check-bundle.mjs if the growth is intentional.')
  process.exit(1)
}
console.log('check-bundle: within budget.\n')
