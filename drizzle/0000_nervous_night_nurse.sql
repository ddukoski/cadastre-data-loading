CREATE TABLE "korisnici" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"username" varchar(255) NOT NULL,
	"nas_mesto_id" varchar(50),
	"nas_mesto_ime" varchar(255),
	"opstina_ime" varchar(255),
	CONSTRAINT "korisnici_globalid_unique" UNIQUE("globalid")
);
--> statement-breakpoint
CREATE TABLE "kukni_broevi" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"globalid_old" varchar(50),
	"sync_globalid" varchar(50),
	"sync_objectid" integer,
	"id_ulica" varchar(50),
	"ime_na_ulica" varchar(255),
	"ime_na_ulica_al" varchar(255),
	"ulici_cr_fk" varchar(255),
	"fk_streets" varchar(50),
	"kuken_broj" smallint,
	"kuken_broj_integer" smallint,
	"dodatok_na_kuken_broj" varchar(50),
	"broj_na_vlez" varchar(50),
	"id_vlez" integer,
	"broj_na_katovi" smallint,
	"broj_na_stanovi" smallint,
	"tabla" varchar(50),
	"nacin_na_sobiranje" varchar(100),
	"klasifikacija" varchar(255),
	"godina_gradba" varchar(50),
	"materijal_gradba" varchar(100),
	"godina_nadgradba" varchar(50),
	"godina_dogradba" varchar(50),
	"godina_rekonstrukcija" varchar(50),
	"tip_rek" varchar(100),
	"fasada" varchar(100),
	"terasi" varchar(100),
	"garaza" varchar(50),
	"parking" varchar(50),
	"lift" varchar(50),
	"struja" varchar(50),
	"vodovod" varchar(50),
	"kanalizacija" varchar(50),
	"greenje" varchar(50),
	"gas" varchar(50),
	"priblizna_kvadratura" varchar(50),
	"ime_na_specijalen_objekt" varchar(255),
	"ime_na_specijalen_objekt_al" varchar(255),
	"vid_na_specijalen_objekt" varchar(255),
	"ime_na_specijalen_objekt_teren" varchar(255),
	"ime_na_specijalen_objekt_opstin" varchar(255),
	"tip_na_specijalen_objekt_teren" varchar(255),
	"tip_na_specijalen_objekt_opstin" varchar(255),
	"fk_street" varchar(50),
	"has_attachment" integer,
	"status" varchar(255),
	"interen_status" varchar(100),
	"status_teren" varchar(100),
	"status_od_teren" varchar(100),
	"global_nevalidni" varchar(100),
	"kontrola_na_podatoci" varchar(100),
	"ime_na_ulica_opstina" varchar(255),
	"kuken_broj_opstina" varchar(50),
	"dodatok_na_kuken_broj_opstina" varchar(50),
	"broj_na_vlez_opstina" varchar(50),
	"tabla_opstina" varchar(50),
	"status_opstina" varchar(100),
	"promeneta_grafika" varchar(50),
	"x_gps" double precision,
	"y_gps" double precision,
	"x" double precision,
	"y" double precision,
	"gps_zabeleska" text,
	"mesto_ime" varchar(255),
	"mesto_sifra" varchar(50),
	"opstina" varchar(255),
	"els" varchar(255),
	"cdp_cc_id" varchar(50),
	"cdp_id" varchar(50),
	"cc_id" varchar(50),
	"parcel_number" varchar(100),
	"building_number" smallint,
	"cdp_name_mk" varchar(255),
	"cdp_name_lat" varchar(255),
	"cc_name_mk" varchar(255),
	"cc_name_lat" varchar(255),
	"parcel_id" integer,
	"called_place_name" varchar(255),
	"property_list_number" integer,
	"pk_address" varchar(50),
	"p_key" varchar(50),
	"cod_dp" varchar(50),
	"cod_cc" varchar(50),
	"foreign_key" integer,
	"zabeleskaodkontrola" text,
	"zabeleska_od_opstini" text,
	"zabeleska_opstini_teks" text,
	"zabeleska_teren" text,
	"zabeleska" text,
	"status_akn" varchar(100),
	"timestamp_" timestamp,
	"action_" varchar(50),
	"geometry" geometry,
	CONSTRAINT "kukni_broevi_globalid_unique" UNIQUE("globalid")
);
--> statement-breakpoint
CREATE TABLE "log_aktivnosti" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"username" varchar(255),
	"edited_fc" varchar(100),
	"object_id" varchar(100),
	"operation_type" varchar(50),
	"date_time" timestamp,
	CONSTRAINT "log_aktivnosti_globalid_unique" UNIQUE("globalid")
);
--> statement-breakpoint
CREATE TABLE "naselen_mesta" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"mesto_uid" varchar(50),
	"mesto_sifra" varchar(50),
	"mesto_ime" varchar(255),
	"opstina_sifra" varchar(50),
	"opstina_ime" varchar(255),
	"st_area" double precision,
	"st_length" double precision,
	"raw_attributes" text,
	"geometry" geometry,
	CONSTRAINT "naselen_mesta_globalid_unique" UNIQUE("globalid"),
	CONSTRAINT "naselen_mesta_mesto_sifra_unique" UNIQUE("mesto_sifra")
);
--> statement-breakpoint
CREATE TABLE "objekti" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"sifra_odd" integer,
	"sifra_ko" integer,
	"k_oddeleni" varchar(50),
	"k_opstina" varchar(100),
	"parcela" varchar(100),
	"parcn" integer,
	"subn" integer,
	"bldn" integer,
	"id_parc" varchar(50),
	"id_pp" varchar(50),
	"mesto" varchar(255),
	"sifra_kult" integer,
	"kultura" varchar(100),
	"ops_concat" varchar(100),
	"st_area" double precision,
	"st_length" double precision,
	"geometry" geometry,
	CONSTRAINT "objekti_globalid_unique" UNIQUE("globalid")
);
--> statement-breakpoint
CREATE TABLE "opstini" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"numeric_id" integer,
	"name" varchar(255),
	"name_mk" varchar(255),
	"maticenbro" varchar(50),
	"code_tu" varchar(50),
	"shape_leng" double precision,
	"shape_area" double precision,
	"geometry" geometry,
	CONSTRAINT "opstini_globalid_unique" UNIQUE("globalid")
);
ALTER TABLE "opstini" ADD CONSTRAINT "opstini_code_tu_unique" UNIQUE("code_tu");
--> statement-breakpoint
CREATE TABLE "parceli" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"parcel_id" integer,
	"cdp_cc_id" varchar(50),
	"cdp_id" varchar(50),
	"cc_id" varchar(50),
	"parcel_number" varchar(100),
	"property_list_number" integer,
	"called_place_name" varchar(255),
	"cc_name_lat" varchar(255),
	"cc_name_mk" varchar(255),
	"cdp_name_lat" varchar(255),
	"cdp_name_mk" varchar(255),
	"shape_length" double precision,
	"shape_area" double precision,
	"geometry" geometry,
	CONSTRAINT "parceli_parcel_id_unique" UNIQUE("parcel_id")
);
--> statement-breakpoint
CREATE TABLE "parceli_delovi" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"parcel_id" integer,
	"parcelpart_id" integer,
	"cdp_cc_id" varchar(50),
	"cdp_id" smallint,
	"cc_id" smallint,
	"parcel_number" varchar(100),
	"building_number" smallint,
	"property_list_number" integer,
	"called_place_name" varchar(255),
	"map" smallint,
	"sketch" smallint,
	"usage_code" integer,
	"usage_code_1" smallint,
	"usage_shortname" varchar(100),
	"usage_fullname" varchar(255),
	"class_id" smallint,
	"area_m2" double precision,
	"usage_right_id" integer,
	"property_right_id" smallint,
	"changesbook_number" integer,
	"change_date" timestamp,
	"hashdiff" varchar(100),
	"shape_length" double precision,
	"shape_area" double precision,
	"geometry" geometry,
	CONSTRAINT "parceli_delovi_parcelpart_id_unique" UNIQUE("parcelpart_id")
);
--> statement-breakpoint
CREATE TABLE "prijavi" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"name" varchar(255),
	"surname" varchar(255),
	"e_mail" varchar(255),
	"phone_number" varchar(50),
	"submission_datetime" timestamp,
	"note" text,
	"fk_parcel" integer,
	"fk_address" integer,
	"street_name" varchar(255),
	"house_number" integer,
	"letter" varchar(10),
	"entrance" varchar(50),
	"classification" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "stanovi" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"globalid_addresses" varchar(50),
	"id_vlez" integer,
	"kat" smallint,
	"vid_na_kat" varchar(100),
	"tip_na_kat" varchar(100),
	"broj_na_kat" varchar(50),
	"broj_na_stan" varchar(50),
	"status_stan" varchar(100),
	"validni_stanovi" varchar(100),
	"info_za_stan_lokal" varchar(255),
	"nacin_na_sobiranje" varchar(100),
	"mesto_sifra" varchar(50),
	"interen_status" varchar(100),
	"zabeleskaodkontrola" text,
	"zabeleska_od_opstini" text,
	"zabeleska_opstini_teks" text,
	CONSTRAINT "stanovi_globalid_unique" UNIQUE("globalid")
);
--> statement-breakpoint
CREATE TABLE "ulici" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"globalid_old" varchar(50),
	"id_ulica" varchar(50),
	"ime_na_ulica" varchar(255),
	"ime_nova_ulica" varchar(255),
	"ime_na_ulica_al" varchar(255),
	"ime_na_ulica_en" varchar(255),
	"ulici_cr_fk" varchar(255),
	"tabla" varchar(50),
	"status" varchar(100),
	"status_ulica" varchar(100),
	"nevalidni_ulici" varchar(100),
	"nacin_na_sobiranje" varchar(100),
	"interen_status" varchar(100),
	"tehnicki_broj" varchar(50),
	"ime_na_ulica_opstina" varchar(255),
	"status_opstina" varchar(100),
	"promeneta_grafika" varchar(50),
	"mesto_sifra" varchar(50),
	"zabeleskaodkontrola" text,
	"zabeleska_od_opstini" text,
	"zabeleska_opstini_teks" text,
	"st_length" double precision,
	"geometry" geometry,
	CONSTRAINT "ulici_globalid_unique" UNIQUE("globalid")
);
--> statement-breakpoint
CREATE TABLE "ulici_cr" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"ulica_ime" varchar(255),
	"ulica_sifra_cr" varchar(50),
	"io_tip" varchar(50),
	"mesto_ime" varchar(255),
	"mesto_sifra" varchar(50),
	"object_code" varchar(50),
	"flag_cr" integer,
	"flag_for_delete" smallint,
	CONSTRAINT "ulici_cr_globalid_unique" UNIQUE("globalid"),
	CONSTRAINT "ulici_cr_ulica_sifra_cr_unique" UNIQUE("ulica_sifra_cr")
);
--> statement-breakpoint
CREATE TABLE "ulici_opstini_ref" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"globalid" varchar(50),
	"ulica_ime" varchar(255),
	"ulica_sifra_cr" varchar(50),
	"mesto_ime" varchar(255),
	"mesto_sifra" varchar(50),
	"ime_na_ulica_opstina" varchar(255),
	"status_opstina" varchar(100),
	CONSTRAINT "ulici_opstini_ref_globalid_unique" UNIQUE("globalid")
);
--> statement-breakpoint
CREATE TABLE "zgradi" (
	"id" serial PRIMARY KEY NOT NULL,
	"arcgis_objectid" integer,
	"bldn_id" integer,
	"parcel_id" integer,
	"parcelpart_id" integer,
	"cdp_cc_id" varchar(50),
	"cdp_id" varchar(50),
	"cc_id" varchar(50),
	"parcel_number" varchar(100),
	"building_number" smallint,
	"new_building_number" integer,
	"property_list_number" integer,
	"called_place_name" varchar(255),
	"map" smallint,
	"sketch" smallint,
	"usage_code" integer,
	"usage_code_1" smallint,
	"usage_shortname" varchar(100),
	"usage_fullname" varchar(255),
	"class_id" smallint,
	"area_m2" double precision,
	"build_material_id" smallint,
	"floors_number" smallint,
	"appartments_number" smallint,
	"build_year" smallint,
	"usage_right_id" integer,
	"property_right_id" smallint,
	"changesbook_number" integer,
	"change_date" timestamp,
	"hashdiff" varchar(100),
	"st_area" double precision,
	"st_length" double precision,
	"geometry" geometry,
	CONSTRAINT "zgradi_bldn_id_unique" UNIQUE("bldn_id")
);
--> statement-breakpoint
ALTER TABLE "korisnici" ADD CONSTRAINT "korisnici_nas_mesto_id_naselen_mesta_mesto_sifra_fk" FOREIGN KEY ("nas_mesto_id") REFERENCES "public"."naselen_mesta"("mesto_sifra") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kukni_broevi" ADD CONSTRAINT "kukni_broevi_mesto_sifra_naselen_mesta_mesto_sifra_fk" FOREIGN KEY ("mesto_sifra") REFERENCES "public"."naselen_mesta"("mesto_sifra") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kukni_broevi" ADD CONSTRAINT "kukni_broevi_parcel_id_parceli_parcel_id_fk" FOREIGN KEY ("parcel_id") REFERENCES "public"."parceli"("parcel_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "naselen_mesta" ADD CONSTRAINT "naselen_mesta_opstina_sifra_opstini_code_tu_fk" FOREIGN KEY ("opstina_sifra") REFERENCES "public"."opstini"("code_tu") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parceli_delovi" ADD CONSTRAINT "parceli_delovi_parcel_id_parceli_parcel_id_fk" FOREIGN KEY ("parcel_id") REFERENCES "public"."parceli"("parcel_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prijavi" ADD CONSTRAINT "prijavi_fk_parcel_parceli_parcel_id_fk" FOREIGN KEY ("fk_parcel") REFERENCES "public"."parceli"("parcel_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stanovi" ADD CONSTRAINT "stanovi_globalid_addresses_kukni_broevi_globalid_fk" FOREIGN KEY ("globalid_addresses") REFERENCES "public"."kukni_broevi"("globalid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stanovi" ADD CONSTRAINT "stanovi_mesto_sifra_naselen_mesta_mesto_sifra_fk" FOREIGN KEY ("mesto_sifra") REFERENCES "public"."naselen_mesta"("mesto_sifra") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ulici" ADD CONSTRAINT "ulici_mesto_sifra_naselen_mesta_mesto_sifra_fk" FOREIGN KEY ("mesto_sifra") REFERENCES "public"."naselen_mesta"("mesto_sifra") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ulici_cr" ADD CONSTRAINT "ulici_cr_mesto_sifra_naselen_mesta_mesto_sifra_fk" FOREIGN KEY ("mesto_sifra") REFERENCES "public"."naselen_mesta"("mesto_sifra") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ulici_opstini_ref" ADD CONSTRAINT "ulici_opstini_ref_mesto_sifra_naselen_mesta_mesto_sifra_fk" FOREIGN KEY ("mesto_sifra") REFERENCES "public"."naselen_mesta"("mesto_sifra") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "zgradi" ADD CONSTRAINT "zgradi_parcel_id_parceli_parcel_id_fk" FOREIGN KEY ("parcel_id") REFERENCES "public"."parceli"("parcel_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_korisnici_username" ON "korisnici" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_korisnici_nas_mesto_id" ON "korisnici" USING btree ("nas_mesto_id");--> statement-breakpoint
CREATE INDEX "idx_kukni_broevi_globalid" ON "kukni_broevi" USING btree ("globalid");--> statement-breakpoint
CREATE INDEX "idx_kukni_broevi_parcel_id" ON "kukni_broevi" USING btree ("parcel_id");--> statement-breakpoint
CREATE INDEX "idx_kukni_broevi_mesto_sifra" ON "kukni_broevi" USING btree ("mesto_sifra");--> statement-breakpoint
CREATE INDEX "idx_kukni_broevi_ulici_cr_fk" ON "kukni_broevi" USING btree ("ulici_cr_fk");--> statement-breakpoint
CREATE INDEX "idx_kukni_broevi_cdp_cc_id" ON "kukni_broevi" USING btree ("cdp_cc_id");--> statement-breakpoint
CREATE INDEX "idx_log_aktivnosti_username" ON "log_aktivnosti" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_log_aktivnosti_date_time" ON "log_aktivnosti" USING btree ("date_time");--> statement-breakpoint
CREATE INDEX "idx_log_aktivnosti_object_id" ON "log_aktivnosti" USING btree ("object_id");--> statement-breakpoint
CREATE INDEX "idx_naselen_mesta_opstina_sifra" ON "naselen_mesta" USING btree ("opstina_sifra");--> statement-breakpoint
CREATE INDEX "idx_naselen_mesta_ime" ON "naselen_mesta" USING btree ("mesto_ime");--> statement-breakpoint
CREATE INDEX "idx_objekti_globalid" ON "objekti" USING btree ("globalid");--> statement-breakpoint
CREATE INDEX "idx_objekti_sifra_odd_ko" ON "objekti" USING btree ("sifra_odd","sifra_ko");--> statement-breakpoint
CREATE INDEX "idx_objekti_parcn_subn_bldn" ON "objekti" USING btree ("parcn","subn","bldn");--> statement-breakpoint
CREATE INDEX "idx_opstini_code_tu" ON "opstini" USING btree ("code_tu");--> statement-breakpoint
CREATE INDEX "idx_opstini_name_mk" ON "opstini" USING btree ("name_mk");--> statement-breakpoint
CREATE INDEX "idx_parceli_parcel_id" ON "parceli" USING btree ("parcel_id");--> statement-breakpoint
CREATE INDEX "idx_parceli_cdp_cc_id" ON "parceli" USING btree ("cdp_cc_id");--> statement-breakpoint
CREATE INDEX "idx_parceli_parcel_number" ON "parceli" USING btree ("parcel_number");--> statement-breakpoint
CREATE INDEX "idx_parceli_cdp_id_cc_id" ON "parceli" USING btree ("cdp_id","cc_id");--> statement-breakpoint
CREATE INDEX "idx_parceli_delovi_parcel_id" ON "parceli_delovi" USING btree ("parcel_id");--> statement-breakpoint
CREATE INDEX "idx_parceli_delovi_usage_code" ON "parceli_delovi" USING btree ("usage_code");--> statement-breakpoint
CREATE INDEX "idx_parceli_delovi_cdp_cc_id" ON "parceli_delovi" USING btree ("cdp_cc_id");--> statement-breakpoint
CREATE INDEX "idx_prijavi_fk_parcel" ON "prijavi" USING btree ("fk_parcel");--> statement-breakpoint
CREATE INDEX "idx_prijavi_submission_datetime" ON "prijavi" USING btree ("submission_datetime");--> statement-breakpoint
CREATE INDEX "idx_prijavi_e_mail" ON "prijavi" USING btree ("e_mail");--> statement-breakpoint
CREATE INDEX "idx_stanovi_globalid_addresses" ON "stanovi" USING btree ("globalid_addresses");--> statement-breakpoint
CREATE INDEX "idx_stanovi_id_vlez" ON "stanovi" USING btree ("id_vlez");--> statement-breakpoint
CREATE INDEX "idx_stanovi_mesto_sifra" ON "stanovi" USING btree ("mesto_sifra");--> statement-breakpoint
CREATE INDEX "idx_ulici_globalid" ON "ulici" USING btree ("globalid");--> statement-breakpoint
CREATE INDEX "idx_ulici_mesto_sifra" ON "ulici" USING btree ("mesto_sifra");--> statement-breakpoint
CREATE INDEX "idx_ulici_ulici_cr_fk" ON "ulici" USING btree ("ulici_cr_fk");--> statement-breakpoint
CREATE INDEX "idx_ulici_cr_sifra" ON "ulici_cr" USING btree ("ulica_sifra_cr");--> statement-breakpoint
CREATE INDEX "idx_ulici_cr_mesto_sifra" ON "ulici_cr" USING btree ("mesto_sifra");--> statement-breakpoint
CREATE INDEX "idx_ulici_opstini_ref_sifra_cr" ON "ulici_opstini_ref" USING btree ("ulica_sifra_cr");--> statement-breakpoint
CREATE INDEX "idx_ulici_opstini_ref_mesto_sifra" ON "ulici_opstini_ref" USING btree ("mesto_sifra");--> statement-breakpoint
CREATE INDEX "idx_zgradi_bldn_id" ON "zgradi" USING btree ("bldn_id");--> statement-breakpoint
CREATE INDEX "idx_zgradi_parcel_id" ON "zgradi" USING btree ("parcel_id");--> statement-breakpoint
CREATE INDEX "idx_zgradi_cdp_cc_id" ON "zgradi" USING btree ("cdp_cc_id");--> statement-breakpoint
CREATE INDEX "idx_zgradi_usage_code" ON "zgradi" USING btree ("usage_code");