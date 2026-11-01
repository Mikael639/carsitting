// Prépare les logos du défilé : chaque fichier de public/logos/ devient une image ivoire unie, légère,
// dans public/logos-ivoire/, avec ses dimensions dans src/data/logos.json.
// Le navigateur n'a ainsi plus de filtre à calculer sur 40 logos en mouvement (saccades sur tablette).
// Lancé automatiquement avant `npm run dev` et `npm run build` ; seule la forme (transparence) compte.
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const src = 'public/logos';
const out = 'public/logos-ivoire';
const IVOIRE = [0xf5, 0xf1, 0xe9];
const MAX_H = 240; // 2 × la plus grande hauteur affichée (≈ 100 px) : net sur écran Retina
const MAX_W = 900;

mkdirSync(out, { recursive: true });
mkdirSync('src/data', { recursive: true });

const sizes = {};
for (const file of readdirSync(src)) {
  const ext = extname(file).toLowerCase();
  if (!['.svg', '.png', '.webp', '.jpg'].includes(ext)) continue;
  const slug = basename(file, ext);
  const { data, info } = await sharp(join(src, file), { density: 300 })
    .resize({ width: MAX_W, height: MAX_H, fit: 'inside', withoutEnlargement: false })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = IVOIRE[0];
    data[i + 1] = IVOIRE[1];
    data[i + 2] = IVOIRE[2];
  }
  await sharp(data, { raw: info }).webp({ quality: 92, alphaQuality: 100 }).toFile(join(out, `${slug}.webp`));
  const meta = await sharp(join(out, `${slug}.webp`)).metadata();
  sizes[slug] = { w: meta.width, h: meta.height };
}
writeFileSync('src/data/logos.json', JSON.stringify(sizes, null, 2) + '\n');
console.log(`logos : ${Object.keys(sizes).length} images ivoire prêtes`);
