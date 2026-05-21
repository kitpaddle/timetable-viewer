import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC = join(ROOT, 'public')

const W = 1200, H = 630
const CYAN   = '#22d3ee'
const DARK   = '#292929'
const DARKER = '#1a1a1a'
const TEXT   = '#f0f0f0'
const MUTED  = '#999999'
const DIM    = '#555555'

// Render icon directly from SVG with a corrected viewBox so the circle stroke isn't clipped
const rawSvg = readFileSync(join(PUBLIC, 'favicon.svg'), 'utf8')
const fixedSvg = rawSvg.replace('viewBox="1 1 30 30"', 'viewBox="-1 -1 34 34"')

async function icon(size) {
  return sharp(Buffer.from(fixedSvg)).resize(size, size).png().toBuffer()
}

async function render(svg, overlays, file) {
  let p = sharp(Buffer.from(svg))
  if (overlays.length) p = p.composite(overlays)
  await p.png().toFile(file)
  console.log('✓', file)
}

// 1. Departure board — rows of fake departures, cyan times
async function opt1() {
  const ic = await icon(54)
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="#111111"/>
    <rect width="${W}" height="82" fill="${DARKER}"/>
    <text x="60" y="54" font-family="Courier New,monospace" font-size="32" font-weight="bold" fill="${CYAN}" letter-spacing="3">AVGANGAR.SE</text>
    <rect x="0" y="82" width="${W}" height="3" fill="${CYAN}"/>

    <rect x="40" y="103" width="1120" height="96" fill="#1e1e1e" rx="4"/>
    <text x="80"  y="162" font-family="Courier New,monospace" font-size="42" fill="${TEXT}">8</text>
    <text x="155" y="162" font-family="Courier New,monospace" font-size="42" fill="${TEXT}">Centralen</text>
    <text x="1130" y="162" font-family="Courier New,monospace" font-size="42" fill="${CYAN}" text-anchor="end">2 min</text>

    <rect x="40" y="214" width="1120" height="96" fill="#1a1a1a" rx="4"/>
    <text x="80"  y="273" font-family="Courier New,monospace" font-size="42" fill="${TEXT}">14</text>
    <text x="155" y="273" font-family="Courier New,monospace" font-size="42" fill="${TEXT}">Odenplan</text>
    <text x="1130" y="273" font-family="Courier New,monospace" font-size="42" fill="${CYAN}" text-anchor="end">5 min</text>

    <rect x="40" y="325" width="1120" height="96" fill="#1e1e1e" rx="4"/>
    <text x="80"  y="384" font-family="Courier New,monospace" font-size="42" fill="${TEXT}">T1</text>
    <text x="155" y="384" font-family="Courier New,monospace" font-size="42" fill="${TEXT}">Morby centrum</text>
    <text x="1130" y="384" font-family="Courier New,monospace" font-size="42" fill="${CYAN}" text-anchor="end">8 min</text>

    <rect x="0" y="447" width="${W}" height="1" fill="#333"/>
    <text x="60" y="510" font-family="Arial,sans-serif" font-size="26" fill="${MUTED}">Realtidsavgangar for kollektivtrafik i hela Sverige</text>
    <text x="60" y="568" font-family="Arial,sans-serif" font-size="20" fill="${DIM}">avgangar.se</text>
  </svg>`
  await render(svg, [{ input: ic, top: 14, left: W - 54 - 14 }], join(PUBLIC, 'og-option-1.png'))
}

// 2. Cyan stripe left — icon on stripe, clean text right
async function opt2() {
  const sz = 150
  const ic = await icon(sz)
  const STRIPE = 250
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${DARK}"/>
    <rect width="${STRIPE}" height="${H}" fill="${CYAN}"/>
    <text x="${STRIPE + 60}" y="205" font-family="Arial,sans-serif" font-size="78" font-weight="bold" fill="${TEXT}">Avg&#229;ngar.se</text>
    <rect x="${STRIPE + 60}" y="222" width="830" height="3" fill="${CYAN}"/>
    <text x="${STRIPE + 60}" y="278" font-family="Arial,sans-serif" font-size="30" fill="${MUTED}">Realtidsavg&#229;ngar f&#246;r kollektivtrafik</text>
    <text x="${STRIPE + 60}" y="320" font-family="Arial,sans-serif" font-size="30" fill="${MUTED}">i hela Sverige</text>
    <text x="${STRIPE + 60}" y="440" font-family="Arial,sans-serif" font-size="22" fill="${DIM}">Bussar &#183; T&#229;g &#183; Tunnelbana &#183; Sp&#229;rvagn &#183; F&#228;rjor</text>
  </svg>`
  const top  = Math.round((H - sz) / 2)
  const left = Math.round((STRIPE - sz) / 2)
  await render(svg, [{ input: ic, top, left }], join(PUBLIC, 'og-option-2.png'))
}

// 3. Split panel — solid cyan left, icon centred; dark right with text
async function opt3() {
  const sz = 200
  const ic = await icon(sz)
  const SPLIT = 400
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${DARK}"/>
    <rect width="${SPLIT}" height="${H}" fill="${CYAN}"/>
    <text x="${SPLIT + 60}" y="228" font-family="Arial,sans-serif" font-size="70" font-weight="bold" fill="${TEXT}">Avg&#229;ngar.se</text>
    <text x="${SPLIT + 60}" y="284" font-family="Arial,sans-serif" font-size="28" fill="${MUTED}">Realtidsavg&#229;ngar f&#246;r</text>
    <text x="${SPLIT + 60}" y="324" font-family="Arial,sans-serif" font-size="28" fill="${MUTED}">kollektivtrafik i Sverige</text>
    <rect x="${SPLIT + 60}" y="358" width="620" height="2" fill="${CYAN}"/>
    <text x="${SPLIT + 60}" y="410" font-family="Arial,sans-serif" font-size="22" fill="${DIM}">Bussar &#183; T&#229;g &#183; Tunnelbana &#183; Sp&#229;rvagn</text>
  </svg>`
  const top  = Math.round((H - sz) / 2)
  const left = Math.round((SPLIT - sz) / 2)
  await render(svg, [{ input: ic, top, left }], join(PUBLIC, 'og-option-3.png'))
}

// 4. Terminal — icon left of cyan vertical rule, text right; cyan bottom bar
async function opt4() {
  const sz = 260
  const ic = await icon(sz)
  const ICON_X = 60
  const SEP    = ICON_X + sz + 50
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="${DARKER}"/>
    <rect x="0" y="${H - 5}" width="${W}" height="5" fill="${CYAN}"/>
    <rect x="${SEP}" y="80" width="2" height="${H - 160}" fill="${CYAN}"/>
    <text x="${SEP + 60}" y="264" font-family="Arial,sans-serif" font-size="62" font-weight="bold" fill="${TEXT}" letter-spacing="2">AVGANGAR.SE</text>
    <text x="${SEP + 60}" y="320" font-family="Courier New,monospace" font-size="26" fill="${MUTED}">Realtidsavg&#229;ngar f&#246;r kollektivtrafik</text>
    <text x="${SEP + 60}" y="358" font-family="Courier New,monospace" font-size="26" fill="${MUTED}">i hela Sverige</text>
    <text x="${SEP + 60}" y="470" font-family="Courier New,monospace" font-size="20" fill="${DIM}">Bussar &#183; T&#229;g &#183; Tunnelbana &#183; Sp&#229;rvagn &#183; F&#228;rjor</text>
  </svg>`
  const top = Math.round((H - sz) / 2)
  await render(svg, [{ input: ic, top, left: ICON_X }], join(PUBLIC, 'og-option-4.png'))
  await render(svg, [{ input: ic, top, left: ICON_X }], join(PUBLIC, 'og-image.png'))
}

// 5. Retro scoreboard — large monospace AVGÅNGAR, dot grid, large icon centred on right
async function opt5() {
  const sz = 280
  const ic = await icon(sz)
  const ICON_X = W - sz - 50
  const ICON_Y = Math.round((H - sz) / 2)

  const dots = []
  for (let col = 0; col < 21; col++) {
    for (let row = 0; row < 11; row++) {
      dots.push(`<circle cx="${col * 57 + 28}" cy="${row * 57 + 28}" r="1.8" fill="#1c1c1c"/>`)
    }
  }

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="#0c0c0c"/>
    ${dots.join('\n    ')}
    <text x="55" y="270" font-family="Courier New,monospace" font-size="122" font-weight="bold" fill="${CYAN}">AVGANGAR</text>
    <text x="58" y="352" font-family="Courier New,monospace" font-size="52"  fill="${TEXT}" letter-spacing="12">.SE</text>
    <rect x="55" y="372" width="420" height="4" fill="${CYAN}"/>
    <text x="55" y="432" font-family="Courier New,monospace" font-size="25" fill="${MUTED}">Realtidsavgangar for kollektivtrafik</text>
    <text x="55" y="468" font-family="Courier New,monospace" font-size="25" fill="${MUTED}">i hela Sverige</text>
    <text x="55" y="578" font-family="Courier New,monospace" font-size="19" fill="#3a3a3a">Bussar  Tag  Tunnelbana  Sparvagn  Farja</text>
  </svg>`
  await render(svg, [{ input: ic, top: ICON_Y, left: ICON_X }], join(PUBLIC, 'og-option-5.png'))
}

async function main() {
  await Promise.all([opt1(), opt2(), opt3(), opt4(), opt5()])
  console.log('\nAll 5 options in public/ — pick your favourite (1–5).')
}

main().catch(err => { console.error(err); process.exit(1) })
