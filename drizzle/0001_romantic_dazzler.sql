ALTER TABLE "korisnici" DROP CONSTRAINT "korisnici_nas_mesto_id_naselen_mesta_mesto_sifra_fk";
--> statement-breakpoint
ALTER TABLE "kukni_broevi" DROP CONSTRAINT "kukni_broevi_mesto_sifra_naselen_mesta_mesto_sifra_fk";
--> statement-breakpoint
ALTER TABLE "kukni_broevi" DROP CONSTRAINT "kukni_broevi_parcel_id_parceli_parcel_id_fk";
--> statement-breakpoint
ALTER TABLE "naselen_mesta" DROP CONSTRAINT "naselen_mesta_opstina_sifra_opstini_code_tu_fk";
--> statement-breakpoint
ALTER TABLE "parceli_delovi" DROP CONSTRAINT "parceli_delovi_parcel_id_parceli_parcel_id_fk";
--> statement-breakpoint
ALTER TABLE "prijavi" DROP CONSTRAINT "prijavi_fk_parcel_parceli_parcel_id_fk";
--> statement-breakpoint
ALTER TABLE "stanovi" DROP CONSTRAINT "stanovi_globalid_addresses_kukni_broevi_globalid_fk";
--> statement-breakpoint
ALTER TABLE "stanovi" DROP CONSTRAINT "stanovi_mesto_sifra_naselen_mesta_mesto_sifra_fk";
--> statement-breakpoint
ALTER TABLE "ulici" DROP CONSTRAINT "ulici_mesto_sifra_naselen_mesta_mesto_sifra_fk";
--> statement-breakpoint
ALTER TABLE "ulici_cr" DROP CONSTRAINT "ulici_cr_mesto_sifra_naselen_mesta_mesto_sifra_fk";
--> statement-breakpoint
ALTER TABLE "ulici_opstini_ref" DROP CONSTRAINT "ulici_opstini_ref_mesto_sifra_naselen_mesta_mesto_sifra_fk";
--> statement-breakpoint
ALTER TABLE "zgradi" DROP CONSTRAINT "zgradi_parcel_id_parceli_parcel_id_fk";
