import 'dotenv/config';
import express from 'express';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync } from 'node:fs';
import path from 'node:path';
import { MENU_ITEMS } from '../src/data/menu.ts';

const app = express();
const production = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3000);
const origin = process.env.APP_ORIGIN || `http://localhost:${port}`;
const password = process.env.ADMIN_PASSWORD;
if (!password || password.length < 12) throw new Error('Defina ADMIN_PASSWORD no .env com pelo menos 12 caracteres.');
if (production && !origin.startsWith('https://')) throw new Error('Defina APP_ORIGIN com o endereço HTTPS do site.');
const salt = randomBytes(32);
const passwordHash = scryptSync(password, salt, 64);
const sessions = new Map<string, number>();
const attempts = new Map<string, { count: number; until: number }>();
const dataDir = path.resolve(process.env.DATA_DIR || 'data');
mkdirSync(dataDir, { recursive: true });
const uploadsDir = path.join(dataDir, 'uploads');
mkdirSync(uploadsDir, { recursive: true });
const file = path.join(dataDir, 'menu.json');
if (!existsSync(file)) writeFileSync(file, JSON.stringify({ revision: 1, items: MENU_ITEMS.map(item => ({ ...item, available: true, featured: ['el-patron', 'bart', 'homer'].includes(item.id) })) }, null, 2));
const read = () => JSON.parse(readFileSync(file, 'utf8'));
const tokenOf = (req: express.Request) => req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('escobart_session='))?.slice(17) || '';
const authorized = (req: express.Request) => (sessions.get(tokenOf(req)) || 0) > Date.now();
app.disable('x-powered-by');
app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); res.set('X-Content-Type-Options', 'nosniff'); next(); });
app.use('/api', (req, res, next) => {
  if (!['GET', 'HEAD'].includes(req.method) && req.headers.origin !== origin) { res.status(403).json({ error: 'Origem não autorizada.' }); return; }
  next();
});
app.use(express.json({ limit: '2mb' }));
app.get('/api/menu', (_req, res) => { const data = read(); res.json({ ...data, items: data.items.filter((item: any) => item.available !== false) }); });
app.post('/api/login', (req, res) => {
  const key = req.ip || 'unknown';
  const previous = attempts.get(key);
  const entry = previous && previous.until > Date.now() ? previous : { count: 0, until: Date.now() + 15 * 60_000 };
  if (entry.count >= 10) { res.status(429).json({ error: 'Muitas tentativas. Aguarde 15 minutos.' }); return; }
  entry.count++; attempts.set(key, entry);
  const input = req.body?.password;
  if (typeof input !== 'string' || input.length > 200 || !timingSafeEqual(scryptSync(input, salt, 64), passwordHash)) { res.status(401).json({ error: 'Senha incorreta.' }); return; }
  attempts.delete(key);
  sessions.delete(tokenOf(req));
  const token = randomBytes(32).toString('hex');
  sessions.set(token, Date.now() + 8 * 60 * 60_000);
  res.cookie('escobart_session', token, { httpOnly: true, sameSite: 'strict', secure: production, maxAge: 8 * 60 * 60_000, path: '/' });
  res.json({ ok: true });
});
app.post('/api/logout', (req, res) => { sessions.delete(tokenOf(req)); res.clearCookie('escobart_session', { path: '/' }); res.json({ ok: true }); });
app.use('/api/admin', (req, res, next) => { if (!authorized(req)) { res.status(401).json({ error: 'Entre novamente para continuar.' }); return; } next(); });
// Authenticate and check Origin before accepting any upload bytes.
app.post('/api/admin/images', express.raw({ type: ['image/jpeg', 'image/png', 'image/webp'], limit: '5mb' }), (req, res) => {
  const bytes = req.body;
  const mime = req.get('Content-Type')?.split(';')[0];
  const png = Buffer.isBuffer(bytes) && bytes.length >= 24 && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) && bytes.toString('ascii', 12, 16) === 'IHDR';
  const jpeg = Buffer.isBuffer(bytes) && bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 && bytes[bytes.length-2] === 255 && bytes[bytes.length-1] === 217;
  const webp = Buffer.isBuffer(bytes) && bytes.length >= 16 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  const extension = mime === 'image/png' && png ? 'png' : mime === 'image/jpeg' && jpeg ? 'jpg' : mime === 'image/webp' && webp ? 'webp' : null;
  if (!extension) { res.status(400).json({ error: 'Selecione uma imagem JPG, PNG ou WebP válida, de até 5 MB.' }); return; }
  const name = `${randomBytes(24).toString('hex')}.${extension}`;
  writeFileSync(path.join(uploadsDir, name), bytes, { flag: 'wx' });
  res.status(201).json({ url: `/uploads/${name}` });
});
app.get('/uploads/:name', (req, res) => {
  if (!/^[a-f0-9]{48}\.(jpg|png|webp)$/.test(req.params.name)) { res.sendStatus(404); return; }
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Content-Security-Policy', "default-src 'none'");
  res.sendFile(req.params.name, { root: uploadsDir, dotfiles: 'deny', maxAge: '1y', immutable: true }, error => { if (error && !res.headersSent) res.sendStatus(404); });
});
app.get('/api/admin/menu', (_req, res) => res.json(read()));
const categories = ['burgers', 'sides', 'drinks', 'desserts', 'cervejas', 'caipirinhas', 'destilados'];
app.put('/api/admin/menu', (req, res) => {
  const { items, revision } = req.body || {};
  const validString = (value: unknown, max: number) => typeof value === 'string' && value.length <= max;
  if (!Array.isArray(items) || items.length > 500 || !items.every(item => item &&
    validString(item.id, 80) && /^[a-zA-Z0-9-]+$/.test(item.id) &&
    validString(item.name, 120) && item.name.trim() && validString(item.description, 2000) &&
    Number.isFinite(item.price) && item.price >= 0 && item.price <= 100000 &&
    categories.includes(item.category) && validString(item.image, 2000) &&
    (/^https:\/\//i.test(item.image) || /^\/(?!\/)/.test(item.image)) &&
    Array.isArray(item.ingredients) && item.ingredients.length <= 100 && item.ingredients.every((s: unknown) => validString(s, 200)) &&
    (item.badge === undefined || validString(item.badge, 50)) &&
    typeof item.available === 'boolean' && typeof item.featured === 'boolean') || new Set(items.map(i => i.id)).size !== items.length) {
    res.status(400).json({ error: 'Confira os campos dos produtos. Use imagem HTTPS ou caminho /assets/… e preços válidos.' }); return;
  }
  const current = read();
  if (current.revision !== revision) { res.status(409).json({ error: 'O cardápio mudou em outra aba. Recarregue a página antes de editar novamente.' }); return; }
  const next = { revision: current.revision + 1, items: items.map(({id,name,description,price,image,category,ingredients,badge,available,featured}) => ({id,name:name.trim(),description,price:Math.round(price*100)/100,image,category,ingredients,badge,available,featured})) };
  writeFileSync(file + '.tmp', JSON.stringify(next, null, 2));
  renameSync(file + '.tmp', file);
  res.json(next);
});
app.use('/api', (_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));
if (production) {
  app.use(express.static(path.resolve('dist')));
  app.get('*', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error.message);
  res.status(error.status === 413 ? 413 : 500).json({ error: error.status === 413 ? 'O arquivo é muito grande. Envie uma imagem de até 5 MB.' : 'Não foi possível concluir. Tente novamente.' });
});
setInterval(() => { for (const [key, expiry] of sessions) if (expiry < Date.now()) sessions.delete(key); for (const [key, value] of attempts) if (value.until < Date.now()) attempts.delete(key); }, 60_000).unref();
app.listen(port, '0.0.0.0', () => console.log(`Escobart: ${origin} | Painel: ${origin}/admin`));
