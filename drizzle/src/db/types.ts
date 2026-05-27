import {
  opstini,
  naselenMesta,
  uliciCr,
  ulici,
  kukniBoevi,
  stanovi,
  parceli,
  parceliDelovi,
  zgradi,
  objekti,
  logAktivnosti,
  korisnici,
  prijavi,
  uliciOpstiniRef,
} from "./schema";

export type Opstina = typeof opstini.$inferSelect;
export type NewOpstina = typeof opstini.$inferInsert;

export type NaselenMesto = typeof naselenMesta.$inferSelect;
export type NewNaselenMesto = typeof naselenMesta.$inferInsert;

export type UlicaCr = typeof uliciCr.$inferSelect;
export type NewUlicaCr = typeof uliciCr.$inferInsert;

export type Ulica = typeof ulici.$inferSelect;
export type NewUlica = typeof ulici.$inferInsert;

export type KukenBroj = typeof kukniBoevi.$inferSelect;
export type NewKukenBroj = typeof kukniBoevi.$inferInsert;

export type Stan = typeof stanovi.$inferSelect;
export type NewStan = typeof stanovi.$inferInsert;

export type Parcel = typeof parceli.$inferSelect;
export type NewParcel = typeof parceli.$inferInsert;

export type ParcelDel = typeof parceliDelovi.$inferSelect;
export type NewParcelDel = typeof parceliDelovi.$inferInsert;

export type Zgrada = typeof zgradi.$inferSelect;
export type NewZgrada = typeof zgradi.$inferInsert;

export type Objekt = typeof objekti.$inferSelect;
export type NewObjekt = typeof objekti.$inferInsert;

export type LogAktivnost = typeof logAktivnosti.$inferSelect;
export type NewLogAktivnost = typeof logAktivnosti.$inferInsert;

export type Korisnik = typeof korisnici.$inferSelect;
export type NewKorisnik = typeof korisnici.$inferInsert;

export type Prijava = typeof prijavi.$inferSelect;
export type NewPrijava = typeof prijavi.$inferInsert;

export type UlicaOpstinRef = typeof uliciOpstiniRef.$inferSelect;
export type NewUlicaOpstinRef = typeof uliciOpstiniRef.$inferInsert;
