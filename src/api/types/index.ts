import type { z } from '@hono/zod-openapi';
import type { OpstinSchema } from '../schemas/opstini.js';
import type { NaselenMestoSchema, OpstinaBriefSchema } from '../schemas/naseleni-mesta.js';
import type { UlicaSchema, NaselenMestoBriefSchema as UlicaNaselenMestoBriefSchema } from '../schemas/ulici.js';
import type { UlicaCrSchema } from '../schemas/ulici-cr.js';
import type { KukenBrojSchema } from '../schemas/kukni-broevi.js';
import type { StanSchema } from '../schemas/stanovi.js';
import type { ParcelaSchema } from '../schemas/parceli.js';
import type { ParcelDelSchema } from '../schemas/parceli-delovi.js';
import type { ZgradaSchema } from '../schemas/zgradi.js';
import type { ObjektSchema } from '../schemas/objekti.js';
import type { LogAktivnostSchema } from '../schemas/log-aktivnosti.js';
import type { KorisnikSchema } from '../schemas/korisnici.js';
import type { PrijavaSchema } from '../schemas/prijavi.js';
import type { UlicaOpstinRefSchema } from '../schemas/ulici-opstini-ref.js';

export type Opstina = z.infer<typeof OpstinSchema>;
export type OpstinaBrief = z.infer<typeof OpstinaBriefSchema>;

export type NaselenMesto = z.infer<typeof NaselenMestoSchema>;
export type NaselenMestoBrief = z.infer<typeof UlicaNaselenMestoBriefSchema>;

export type Ulica = z.infer<typeof UlicaSchema>;
export type UlicaCr = z.infer<typeof UlicaCrSchema>;

export type KukenBroj = z.infer<typeof KukenBrojSchema>;
export type Stan = z.infer<typeof StanSchema>;

export type Parcela = z.infer<typeof ParcelaSchema>;
export type ParcelDel = z.infer<typeof ParcelDelSchema>;

export type Zgrada = z.infer<typeof ZgradaSchema>;
export type Objekt = z.infer<typeof ObjektSchema>;

export type LogAktivnost = z.infer<typeof LogAktivnostSchema>;
export type Korisnik = z.infer<typeof KorisnikSchema>;
export type Prijava = z.infer<typeof PrijavaSchema>;
export type UlicaOpstinRef = z.infer<typeof UlicaOpstinRefSchema>;
