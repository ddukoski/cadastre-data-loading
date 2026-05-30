import {
  pgTable,
  serial,
  integer,
  smallint,
  varchar,
  text,
  doublePrecision,
  timestamp,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import { relations } from "drizzle-orm";

const geometry = customType<{ data: string | SQL; driverData: string }>({
  dataType() {
    return "geometry";
  },
});

export const opstini = pgTable(
  "opstini",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),

    numericId: integer("numeric_id"),

    name: varchar("name", { length: 255 }),
    nameMk: varchar("name_mk", { length: 255 }),

    maticenbro: varchar("maticenbro", { length: 50 }),
    codeTu: varchar("code_tu", { length: 50 }),

    shapeLeng: doublePrecision("shape_leng"),
    shapeArea: doublePrecision("shape_area"),

  },
  (t) => [
    index("idx_opstini_code_tu").on(t.codeTu),
    index("idx_opstini_name_mk").on(t.nameMk),
  ],
);

export const naseleniMesta = pgTable(
  "naselen_mesta",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),

    mestoUid: varchar("mesto_uid", { length: 50 }),
    mestoSifra: varchar("mesto_sifra", { length: 50 }).unique(),

    mestoIme: varchar("mesto_ime", { length: 255 }),

    opstinaSifra: varchar("opstina_sifra", { length: 50 }),
    opstinaIme: varchar("opstina_ime", { length: 255 }),

    stArea: doublePrecision("st_area"),
    stLength: doublePrecision("st_length"),

    // Raw attributes blob: store original feature attributes as JSON string
    rawAttributes: text("raw_attributes"),

    geometry: geometry("geometry"),
  },
  (t) => [
    index("idx_naselen_mesta_opstina_sifra").on(t.opstinaSifra),
    index("idx_naselen_mesta_ime").on(t.mestoIme),
  ],
);

export const uliciCr = pgTable(
  "ulici_cr",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),

    ulicaIme: varchar("ulica_ime", { length: 255 }),
    ulicaSifraCr: varchar("ulica_sifra_cr", { length: 50 }).unique(),

    ioTip: varchar("io_tip", { length: 50 }),

    mestoIme: varchar("mesto_ime", { length: 255 }),
    mestoSifra: varchar("mesto_sifra", { length: 50 }),

    objectCode: varchar("object_code", { length: 50 }),
    flagCr: integer("flag_cr"),
    flagForDelete: smallint("flag_for_delete"),
  },
  (t) => [
    index("idx_ulici_cr_sifra").on(t.ulicaSifraCr),
    index("idx_ulici_cr_mesto_sifra").on(t.mestoSifra),
  ],
);

export const ulici = pgTable(
  "ulici",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),
    globalidOld: varchar("globalid_old", { length: 50 }),

    idUlica: varchar("id_ulica", { length: 50 }),
    imeNaUlica: varchar("ime_na_ulica", { length: 255 }),
    imeNovaUlica: varchar("ime_nova_ulica", { length: 255 }),
    imeNaUlicaAl: varchar("ime_na_ulica_al", { length: 255 }),
    imeNaUlicaEn: varchar("ime_na_ulica_en", { length: 255 }),

    uliciCrFk: varchar("ulici_cr_fk", { length: 255 }),

    tabla: varchar("tabla", { length: 50 }),
    status: varchar("status", { length: 100 }),
    statusUlica: varchar("status_ulica", { length: 100 }),
    nevalidniUlici: varchar("nevalidni_ulici", { length: 100 }),
    nacinNaSobiranje: varchar("nacin_na_sobiranje", { length: 100 }),
    interenStatus: varchar("interen_status", { length: 100 }),
    tehnickiBroj: varchar("tehnicki_broj", { length: 50 }),

    imeNaUlicaOpstina: varchar("ime_na_ulica_opstina", { length: 255 }),
    statusOpstina: varchar("status_opstina", { length: 100 }),
    promeneta_grafika: varchar("promeneta_grafika", { length: 50 }),

    mestoSifra: varchar("mesto_sifra", { length: 50 }),

    zabeleskaodkontrola: text("zabeleskaodkontrola"),
    zabeleskaOdOpstini: text("zabeleska_od_opstini"),
    zabeleskaOpstiniTeks: text("zabeleska_opstini_teks"),

    stLength: doublePrecision("st_length"),

    geometry: geometry("geometry"),
  },
  (t) => [
    index("idx_ulici_globalid").on(t.globalid),
    index("idx_ulici_mesto_sifra").on(t.mestoSifra),
    index("idx_ulici_ulici_cr_fk").on(t.uliciCrFk),
  ],
);

export const kukniBoevi = pgTable(
  "kukni_broevi",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),
    globalidOld: varchar("globalid_old", { length: 50 }),
    syncGlobalid: varchar("sync_globalid", { length: 50 }),
    syncObjectid: integer("sync_objectid"),

    idUlica: varchar("id_ulica", { length: 50 }),
    imeNaUlica: varchar("ime_na_ulica", { length: 255 }),
    imeNaUlicaAl: varchar("ime_na_ulica_al", { length: 255 }),
    uliciCrFk: varchar("ulici_cr_fk", { length: 255 }),
    fkStreets: varchar("fk_streets", { length: 50 }),
    kukenBroj: smallint("kuken_broj"),
    kukenBrojInteger: smallint("kuken_broj_integer"),
    dodatokNaKukenBroj: varchar("dodatok_na_kuken_broj", { length: 50 }),
    brojNaVlez: varchar("broj_na_vlez", { length: 50 }),
    idVlez: integer("id_vlez"),

    brojNaKatovi: smallint("broj_na_katovi"),
    brojNaStanovi: smallint("broj_na_stanovi"),
    tabla: varchar("tabla", { length: 50 }),
    nacinNaSobiranje: varchar("nacin_na_sobiranje", { length: 100 }),
    klasifikacija: varchar("klasifikacija", { length: 255 }),
    godinaGradba: varchar("godina_gradba", { length: 50 }),
    materijalGradba: varchar("materijal_gradba", { length: 100 }),
    godinaNadgradba: varchar("godina_nadgradba", { length: 50 }),
    godinaDogradba: varchar("godina_dogradba", { length: 50 }),
    godinaRekonstrukcija: varchar("godina_rekonstrukcija", { length: 50 }),
    tipRek: varchar("tip_rek", { length: 100 }),
    fasada: varchar("fasada", { length: 100 }),
    terasi: varchar("terasi", { length: 100 }),
    garaza: varchar("garaza", { length: 50 }),
    parking: varchar("parking", { length: 50 }),
    lift: varchar("lift", { length: 50 }),
    struja: varchar("struja", { length: 50 }),
    vodovod: varchar("vodovod", { length: 50 }),
    kanalizacija: varchar("kanalizacija", { length: 50 }),
    greenje: varchar("greenje", { length: 50 }),
    gas: varchar("gas", { length: 50 }),
    pribliznaKvadratura: varchar("priblizna_kvadratura", { length: 50 }),

    imeNaSpecijalenObjekt: varchar("ime_na_specijalen_objekt", { length: 255 }),
    imeNaSpecijalenObjektAl: varchar("ime_na_specijalen_objekt_al", {
      length: 255,
    }),
    vidNaSpecijalenObjekt: varchar("vid_na_specijalen_objekt", { length: 255 }),
    
    // Additional fields from ArcGIS data (special object terrain variant)
    imeNaSpecijalenObjektTeren: varchar("ime_na_specijalen_objekt_teren", {
      length: 255,
    }),
    imeNaSpecijalenObjektOpstina: varchar("ime_na_specijalen_objekt_opstin", {
      length: 255,
    }),
    tipNaSpecijalenObjektTeren: varchar("tip_na_specijalen_objekt_teren", {
      length: 255,
    }),
    tipNaSpecijalenObjektOpstina: varchar("tip_na_specijalen_objekt_opstin", {
      length: 255,
    }),
    fkStreet: varchar("fk_street", { length: 50 }),
    hasAttachment: integer("has_attachment"),

    status: varchar("status", { length: 255 }),
    interenStatus: varchar("interen_status", { length: 100 }),
    statusTeren: varchar("status_teren", { length: 100 }),
    statusOdTeren: varchar("status_od_teren", { length: 100 }),
    globalNevalidni: varchar("global_nevalidni", { length: 100 }),
    kontrolaNaPodatoci: varchar("kontrola_na_podatoci", { length: 100 }),

    imeNaUlicaOpstina: varchar("ime_na_ulica_opstina", { length: 255 }),
    kukenBrojOpstina: varchar("kuken_broj_opstina", { length: 50 }),
    dodatokNaKukenBrojOpstina: varchar("dodatok_na_kuken_broj_opstina", {
      length: 50,
    }),
    brojNaVlezOpstina: varchar("broj_na_vlez_opstina", { length: 50 }),
    tablaOpstina: varchar("tabla_opstina", { length: 50 }),
    statusOpstina: varchar("status_opstina", { length: 100 }),
    promeneta_grafika: varchar("promeneta_grafika", { length: 50 }),

    xGps: doublePrecision("x_gps"),
    yGps: doublePrecision("y_gps"),
    x: doublePrecision("x"),
    y: doublePrecision("y"),
    gpsZabeleska: text("gps_zabeleska"),

    mestoIme: varchar("mesto_ime", { length: 255 }),
    mestoSifra: varchar("mesto_sifra", { length: 50 }),
    opstina: varchar("opstina", { length: 255 }),
    els: varchar("els", { length: 255 }),

    cdpCcId: varchar("cdp_cc_id", { length: 50 }),
    cdpId: varchar("cdp_id", { length: 50 }),
    ccId: varchar("cc_id", { length: 50 }),
    parcelNumber: varchar("parcel_number", { length: 100 }),
    buildingNumber: smallint("building_number"),
    cdpNameMk: varchar("cdp_name_mk", { length: 255 }),
    cdpNameLat: varchar("cdp_name_lat", { length: 255 }),
    ccNameMk: varchar("cc_name_mk", { length: 255 }),
    ccNameLat: varchar("cc_name_lat", { length: 255 }),
    parcelId: integer("parcel_id"),
    calledPlaceName: varchar("called_place_name", { length: 255 }),
    propertyListNumber: integer("property_list_number"),

    pkAddress: varchar("pk_address", { length: 50 }),
    pKey: varchar("p_key", { length: 50 }),
    codDp: varchar("cod_dp", { length: 50 }),
    codCc: varchar("cod_cc", { length: 50 }),
    foreignKey: integer("foreign_key"),

    zabeleskaodkontrola: text("zabeleskaodkontrola"),
    zabeleskaOdOpstini: text("zabeleska_od_opstini"),
    zabeleskaOpstiniTeks: text("zabeleska_opstini_teks"),
    zabeleskaTeren: text("zabeleska_teren"),
    zabeleska: text("zabeleska"),
    statusAkn: varchar("status_akn", { length: 100 }),
    
    // Audit/versioning fields
    timestamp_: timestamp("timestamp_"),
    action_: varchar("action_", { length: 50 }),

    geometry: geometry("geometry"),
  },
  (t) => [
    index("idx_kukni_broevi_globalid").on(t.globalid),
    index("idx_kukni_broevi_parcel_id").on(t.parcelId),
    index("idx_kukni_broevi_mesto_sifra").on(t.mestoSifra),
    index("idx_kukni_broevi_ulici_cr_fk").on(t.uliciCrFk),
    index("idx_kukni_broevi_cdp_cc_id").on(t.cdpCcId),
  ],
);

export const stanovi = pgTable(
  "stanovi",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),

    globalidAddresses: varchar("globalid_addresses", { length: 50 }),
    idVlez: integer("id_vlez"),

    kat: smallint("kat"),
    vidNaKat: varchar("vid_na_kat", { length: 100 }),
    tipNaKat: varchar("tip_na_kat", { length: 100 }),
    brojNaKat: varchar("broj_na_kat", { length: 50 }),
    brojNaStan: varchar("broj_na_stan", { length: 50 }),

    statusStan: varchar("status_stan", { length: 100 }),
    validniStanovi: varchar("validni_stanovi", { length: 100 }),
    infoZaStanLokal: varchar("info_za_stan_lokal", { length: 255 }),

    nacinNaSobiranje: varchar("nacin_na_sobiranje", { length: 100 }),
    mestoSifra: varchar("mesto_sifra", { length: 50 }),
    interenStatus: varchar("interen_status", { length: 100 }),

    zabeleskaodkontrola: text("zabeleskaodkontrola"),
    zabeleskaOdOpstini: text("zabeleska_od_opstini"),
    zabeleskaOpstiniTeks: text("zabeleska_opstini_teks"),
  },
  (t) => [
    index("idx_stanovi_globalid_addresses").on(t.globalidAddresses),
    index("idx_stanovi_id_vlez").on(t.idVlez),
    index("idx_stanovi_mesto_sifra").on(t.mestoSifra),
  ],
);

export const parceli = pgTable(
  "parceli",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),

    parcelId: integer("parcel_id").unique(),

    cdpCcId: varchar("cdp_cc_id", { length: 50 }),
    cdpId: varchar("cdp_id", { length: 50 }),
    ccId: varchar("cc_id", { length: 50 }),

    parcelNumber: varchar("parcel_number", { length: 100 }),

    propertyListNumber: integer("property_list_number"),

    calledPlaceName: varchar("called_place_name", { length: 255 }),

    ccNameLat: varchar("cc_name_lat", { length: 255 }),
    ccNameMk: varchar("cc_name_mk", { length: 255 }),
    cdpNameLat: varchar("cdp_name_lat", { length: 255 }),
    cdpNameMk: varchar("cdp_name_mk", { length: 255 }),

    shapeLength: doublePrecision("shape_length"),
    shapeArea: doublePrecision("shape_area"),

    geometry: geometry("geometry"),
  },
  (t) => [
    index("idx_parceli_parcel_id").on(t.parcelId),
    index("idx_parceli_cdp_cc_id").on(t.cdpCcId),
    index("idx_parceli_parcel_number").on(t.parcelNumber),
    index("idx_parceli_cdp_id_cc_id").on(t.cdpId, t.ccId),
  ],
);

export const parceliDelovi = pgTable(
  "parceli_delovi",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),

    parcelId: integer("parcel_id"),
    parcelpartId: integer("parcelpart_id").unique(),

    cdpCcId: varchar("cdp_cc_id", { length: 50 }),
    cdpId: smallint("cdp_id"),
    ccId: smallint("cc_id"),

    parcelNumber: varchar("parcel_number", { length: 100 }),
    buildingNumber: smallint("building_number"),
    propertyListNumber: integer("property_list_number"),
    calledPlaceName: varchar("called_place_name", { length: 255 }),

    map: smallint("map"),
    sketch: smallint("sketch"),

    usageCode: integer("usage_code"),
    usageCode1: smallint("usage_code_1"),
    usageShortname: varchar("usage_shortname", { length: 100 }),
    usageFullname: varchar("usage_fullname", { length: 255 }),

    classId: smallint("class_id"),

    areaM2: doublePrecision("area_m2"),

    usageRightId: integer("usage_right_id"),
    propertyRightId: smallint("property_right_id"),

    changesbookNumber: integer("changesbook_number"),
    changeDate: timestamp("change_date"),

    hashdiff: varchar("hashdiff", { length: 100 }),

    shapeLength: doublePrecision("shape_length"),
    shapeArea: doublePrecision("shape_area"),

    geometry: geometry("geometry"),
  },
  (t) => [
    index("idx_parceli_delovi_parcel_id").on(t.parcelId),
    index("idx_parceli_delovi_usage_code").on(t.usageCode),
    index("idx_parceli_delovi_cdp_cc_id").on(t.cdpCcId),
  ],
);

export const zgradi = pgTable(
  "zgradi",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),

    bldnId: integer("bldn_id").unique(),

    parcelId: integer("parcel_id"),
    parcelpartId: integer("parcelpart_id"),

    cdpCcId: varchar("cdp_cc_id", { length: 50 }),
    cdpId: varchar("cdp_id", { length: 50 }),
    ccId: varchar("cc_id", { length: 50 }),

    parcelNumber: varchar("parcel_number", { length: 100 }),
    buildingNumber: smallint("building_number"),
    newBuildingNumber: integer("new_building_number"),
    propertyListNumber: integer("property_list_number"),
    calledPlaceName: varchar("called_place_name", { length: 255 }),

    map: smallint("map"),
    sketch: smallint("sketch"),

    usageCode: integer("usage_code"),
    usageCode1: smallint("usage_code_1"),
    usageShortname: varchar("usage_shortname", { length: 100 }),
    usageFullname: varchar("usage_fullname", { length: 255 }),

    classId: smallint("class_id"),

    areaM2: doublePrecision("area_m2"),
    buildMaterialId: smallint("build_material_id"),
    floorsNumber: smallint("floors_number"),
    appartmentsNumber: smallint("appartments_number"),
    buildYear: smallint("build_year"),

    usageRightId: integer("usage_right_id"),
    propertyRightId: smallint("property_right_id"),

    changesbookNumber: integer("changesbook_number"),
    changeDate: timestamp("change_date"),

    hashdiff: varchar("hashdiff", { length: 100 }),

    stArea: doublePrecision("st_area"),
    stLength: doublePrecision("st_length"),

    geometry: geometry("geometry"),
  },
  (t) => [
    index("idx_zgradi_bldn_id").on(t.bldnId),
    index("idx_zgradi_parcel_id").on(t.parcelId),
    index("idx_zgradi_cdp_cc_id").on(t.cdpCcId),
    index("idx_zgradi_usage_code").on(t.usageCode),
  ],
);

export const objekti = pgTable(
  "objekti",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),

    sifraOdd: integer("sifra_odd"),
    sifraKo: integer("sifra_ko"),
    kOddeleni: varchar("k_oddeleni", { length: 50 }),
    kOpstina: varchar("k_opstina", { length: 100 }),

    parcela: varchar("parcela", { length: 100 }),
    parcn: integer("parcn"),
    subn: integer("subn"),
    bldn: integer("bldn"),
    idParc: varchar("id_parc", { length: 50 }),
    idPp: varchar("id_pp", { length: 50 }),

    mesto: varchar("mesto", { length: 255 }),

    sifraKult: integer("sifra_kult"),
    kultura: varchar("kultura", { length: 100 }),

    opsConcat: varchar("ops_concat", { length: 100 }),

    stArea: doublePrecision("st_area"),
    stLength: doublePrecision("st_length"),

    geometry: geometry("geometry"),
  },
  (t) => [
    index("idx_objekti_globalid").on(t.globalid),
    index("idx_objekti_sifra_odd_ko").on(t.sifraOdd, t.sifraKo),
    index("idx_objekti_parcn_subn_bldn").on(t.parcn, t.subn, t.bldn),
  ],
);

export const logAktivnosti = pgTable(
  "log_aktivnosti",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),

    username: varchar("username", { length: 255 }),
    editedFc: varchar("edited_fc", { length: 100 }),
    objectId: varchar("object_id", { length: 100 }),
    operationType: varchar("operation_type", { length: 50 }),
    dateTime: timestamp("date_time"),
  },
  (t) => [
    index("idx_log_aktivnosti_username").on(t.username),
    index("idx_log_aktivnosti_date_time").on(t.dateTime),
    index("idx_log_aktivnosti_object_id").on(t.objectId),
  ],
);

export const korisnici = pgTable(
  "korisnici",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),

    username: varchar("username", { length: 255 }).notNull(),

    nasMestoId: varchar("nas_mesto_id", { length: 50 }),
    nasMestoIme: varchar("nas_mesto_ime", { length: 255 }),
    opstinaIme: varchar("opstina_ime", { length: 255 }),
  },
  (t) => [
    index("idx_korisnici_username").on(t.username),
    index("idx_korisnici_nas_mesto_id").on(t.nasMestoId),
  ],
);

export const prijavi = pgTable(
  "prijavi",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),

    name: varchar("name", { length: 255 }),
    surname: varchar("surname", { length: 255 }),
    eMail: varchar("e_mail", { length: 255 }),
    phoneNumber: varchar("phone_number", { length: 50 }),

    submissionDatetime: timestamp("submission_datetime"),
    note: text("note"),

    fkParcel: integer("fk_parcel"),
    fkAddress: integer("fk_address"),

    streetName: varchar("street_name", { length: 255 }),
    houseNumber: integer("house_number"),
    letter: varchar("letter", { length: 10 }),
    entrance: varchar("entrance", { length: 50 }),
    classification: varchar("classification", { length: 255 }),
  },
  (t) => [
    index("idx_prijavi_fk_parcel").on(t.fkParcel),
    index("idx_prijavi_submission_datetime").on(t.submissionDatetime),
    index("idx_prijavi_e_mail").on(t.eMail),
  ],
);

export const uliciOpstiniRef = pgTable(
  "ulici_opstini_ref",
  {
    id: serial("id").primaryKey(),

    arcgisObjectid: integer("arcgis_objectid"),
    globalid: varchar("globalid", { length: 50 }).unique(),

    ulicaIme: varchar("ulica_ime", { length: 255 }),
    ulicaSifraCr: varchar("ulica_sifra_cr", { length: 50 }),

    mestoIme: varchar("mesto_ime", { length: 255 }),
    mestoSifra: varchar("mesto_sifra", { length: 50 }),

    imeNaUlicaOpstina: varchar("ime_na_ulica_opstina", { length: 255 }),
    statusOpstina: varchar("status_opstina", { length: 100 }),
  },
  (t) => [
    index("idx_ulici_opstini_ref_sifra_cr").on(t.ulicaSifraCr),
    index("idx_ulici_opstini_ref_mesto_sifra").on(t.mestoSifra),
  ],
);

export const opstiniRelations = relations(opstini, ({ many }) => ({
  naseleniMesta: many(naseleniMesta),
}));

export const naseleniMestaRelations = relations(
  naseleniMesta,
  ({ one, many }) => ({
    opstina: one(opstini, {
      fields: [naseleniMesta.opstinaSifra],
      references: [opstini.codeTu],
    }),
    ulici: many(ulici),
    uliciCr: many(uliciCr),
    kukniBoevi: many(kukniBoevi),
    stanovi: many(stanovi),
    korisnici: many(korisnici),
    uliciOpstiniRef: many(uliciOpstiniRef),
  }),
);

export const uliciCrRelations = relations(uliciCr, ({ one }) => ({
  naselenMesto: one(naseleniMesta, {
    fields: [uliciCr.mestoSifra],
    references: [naseleniMesta.mestoSifra],
  }),
}));

export const uliciRelations = relations(ulici, ({ one }) => ({
  naselenMesto: one(naseleniMesta, {
    fields: [ulici.mestoSifra],
    references: [naseleniMesta.mestoSifra],
  }),
}));

export const kukniBoeviRelations = relations(kukniBoevi, ({ one, many }) => ({
  naselenMesto: one(naseleniMesta, {
    fields: [kukniBoevi.mestoSifra],
    references: [naseleniMesta.mestoSifra],
  }),
  parcel: one(parceli, {
    fields: [kukniBoevi.parcelId],
    references: [parceli.parcelId],
  }),
  stanovi: many(stanovi),
}));

export const stanoviRelations = relations(stanovi, ({ one }) => ({
  address: one(kukniBoevi, {
    fields: [stanovi.globalidAddresses],
    references: [kukniBoevi.globalid],
  }),
  naselenMesto: one(naseleniMesta, {
    fields: [stanovi.mestoSifra],
    references: [naseleniMesta.mestoSifra],
  }),
}));

export const parceliRelations = relations(parceli, ({ many }) => ({
  delovi: many(parceliDelovi),
  zgradi: many(zgradi),
  kukniBoevi: many(kukniBoevi),
  prijavi: many(prijavi),
}));

export const parceliDeloviRelations = relations(parceliDelovi, ({ one }) => ({
  parcel: one(parceli, {
    fields: [parceliDelovi.parcelId],
    references: [parceli.parcelId],
  }),
}));

export const zgradiRelations = relations(zgradi, ({ one }) => ({
  parcel: one(parceli, {
    fields: [zgradi.parcelId],
    references: [parceli.parcelId],
  }),
}));

export const prijaviRelations = relations(prijavi, ({ one }) => ({
  parcel: one(parceli, {
    fields: [prijavi.fkParcel],
    references: [parceli.parcelId],
  }),
}));

export const korishniciRelations = relations(korisnici, ({ one }) => ({
  naselenMesto: one(naseleniMesta, {
    fields: [korisnici.nasMestoId],
    references: [naseleniMesta.mestoSifra],
  }),
}));

export const uliciOpstiniRefRelations = relations(
  uliciOpstiniRef,
  ({ one }) => ({
    naselenMesto: one(naseleniMesta, {
      fields: [uliciOpstiniRef.mestoSifra],
      references: [naseleniMesta.mestoSifra],
    }),
  }),
);
