import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { API_INFO } from './consts.js';

import opstiniRoutes from './api/routes/opstini.routes.js';
import naseleniMestaRoutes from './api/routes/naselen-mesta.routes.js';
import uliciRoutes from './api/routes/ulici.routes.js';
import uliciCrRoutes from './api/routes/ulici-cr.routes.js';
import kukniBroeviRoutes from './api/routes/kukni-broevi.routes.js';
import stanoviRoutes from './api/routes/stanovi.routes.js';
import parceliRoutes from './api/routes/parceli.routes.js';
import parceliDeloviRoutes from './api/routes/parceli-delovi.routes.js';
import zgradiRoutes from './api/routes/zgradi.routes.js';
import objektiRoutes from './api/routes/objekti.routes.js';
import logAktivnostiRoutes from './api/routes/log-aktivnosti.routes.js';
import korishniciRoutes from './api/routes/korisnici.routes.js';
import prijaviRoutes from './api/routes/prijavi.routes.js';
import uliciOpstiniRefRoutes from './api/routes/ulici-opstini-ref.routes.js';

const app = new OpenAPIHono();

app.get('/health', (c) => c.json({ healthy: true }));

app.route('/api/opstini', opstiniRoutes);
app.route('/api/naseleni-mesta', naseleniMestaRoutes);
app.route('/api/ulici', uliciRoutes);
app.route('/api/ulici-cr', uliciCrRoutes);
app.route('/api/kukni-broevi', kukniBroeviRoutes);
app.route('/api/stanovi', stanoviRoutes);
app.route('/api/parceli', parceliRoutes);
app.route('/api/parceli-delovi', parceliDeloviRoutes);
app.route('/api/zgradi', zgradiRoutes);
app.route('/api/objekti', objektiRoutes);
app.route('/api/log-aktivnosti', logAktivnostiRoutes);
app.route('/api/korisnici', korishniciRoutes);
app.route('/api/prijavi', prijaviRoutes);
app.route('/api/ulici-opstini-ref', uliciOpstiniRefRoutes);

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: API_INFO,
});

app.get('/docs', swaggerUI({ url: '/openapi.json' }));

export default app;

