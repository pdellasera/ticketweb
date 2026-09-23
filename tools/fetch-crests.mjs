import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public', 'assets', 'teams')
const UA = { 'User-Agent': 'GameGate-ticketera/1.0 (contacto@gamegate.pa)' }

const TEAMS = [
  { name: 'Tauro FC', es: ['Tauro Fútbol Club'], en: ['Tauro F.C.', 'Tauro FC'] },
  { name: 'Plaza Amador', es: ['Club Deportivo Plaza Amador'], en: ['C.D. Plaza Amador', 'Plaza Amador'] },
  { name: 'Sporting San Miguelito', es: ['Sporting San Miguelito'], en: ['Sporting San Miguelito'] },
  { name: 'Alianza FC', es: ['Alianza FC (Panamá)'], en: ['Alianza F.C. (Panama)', 'Alianza F.C.'] },
  { name: 'CA Independiente', es: ['CA Independiente'], en: ['C.A. Independiente (Panama)', 'Club Atlético Independiente (Panama)'] },
  { name: 'San Francisco FC', es: ['San Francisco Fútbol Club'], en: ['San Francisco F.C.', 'San Francisco FC'] },
  { name: 'Árabe Unido', es: ['Árabe Unido', 'Club Deportivo Árabe Unido'], en: ['Árabe Unido', 'Arabe Unido', 'C.D. Arabe Unido', 'Deportivo Árabe Unido'] },
  { name: 'Potros del Este', es: ['Potros del Este'], en: ['Potros del Este'] },
  { name: 'Herrera FC', es: ['Herrera FC', 'Herrera F.C.'], en: ['Herrera FC', 'Herrera F.C.', 'Herrera Fútbol Club'] },
  { name: 'Veraguas United', es: ['Veraguas United', 'Veraguas United Fútbol Club'], en: ['Veraguas United', 'Veraguas United F.C.', 'Veraguas FC'] },
  { name: 'Universitario', es: ['CD Universitario', 'Club Deportivo Universitario'], en: ['C.D. Universitario', 'CD Universitario', 'Universitario (Panama)', 'Universitario FC'] },
  { name: 'Independiente FC', es: ['CA Independiente'], en: ['C.A. Independiente (Panama)'] },
]

const slug = (name) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function getJSON(url) {
  const res = await fetch(url, { headers: UA })
  if (!res.ok) return null
  return res.json()
}

// find crest file name from infobox wikitext (lang: 'es' | 'en')
async function crestFileName(lang, title) {
  const host = lang === 'es' ? 'es.wikipedia.org' : 'en.wikipedia.org'
  const json = await getJSON(`https://${host}/w/api.php?action=parse&page=${encodeURIComponent(title)}&prop=wikitext&format=json&redirects=1`)
  const wt = json?.parse?.wikitext?.['*'] ?? ''
  const m = wt.match(/\|\s*(image|imagen|escudo|crest|badge|logo)[^=|]*=\s*([^|\n]+)/i)
  if (!m) return null
  if (/size|width|height/i.test(m[1])) return null
  return m[2].trim().replace(/\[\[|\]\]|Archivo:|File:|Imagen:/gi, '').trim()
}

async function fileUrl(lang, file) {
  const host = lang === 'es' ? 'es.wikipedia.org' : 'en.wikipedia.org'
  const json = await getJSON(`https://${host}/w/api.php?action=query&titles=${encodeURIComponent('File:' + file)}&prop=imageinfo&iiprop=url&format=json`)
  for (const p of Object.values(json?.query?.pages ?? {})) {
    const u = p?.imageinfo?.[0]?.url
    if (u) return u
  }
  return null
}

const map = {}

for (const team of TEAMS) {
  let url = null
  for (const lang of ['es', 'en']) {
    for (const title of team[lang]) {
      const file = await crestFileName(lang, title)
      if (!file) continue
      const u = await fileUrl(lang, file)
      if (u) {
        url = u
        break
      }
    }
    if (url) break
  }
  if (!url) {
    console.log(`MISS  ${team.name}`)
    continue
  }
  try {
    const res = await fetch(url, { headers: UA })
    const buf = Buffer.from(await res.arrayBuffer())
    await sharp(buf).resize(200, 200, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 92 }).toFile(resolve(outDir, `${slug(team.name)}.webp`))
    map[team.name] = `/assets/teams/${slug(team.name)}.webp`
    console.log(`OK    ${team.name}  (${url.split('/').pop().slice(0, 50)})`)
  } catch (e) {
    console.log(`FAIL  ${team.name}: ${e.message}`)
  }
}

console.log('\n=== CREST_MAP ===')
console.log(JSON.stringify(map, null, 2))
