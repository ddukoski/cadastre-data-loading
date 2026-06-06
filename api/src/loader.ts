import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { sql, type SQL } from 'drizzle-orm';
import { db } from './db/index.js';
import {
  opstini,
  naseleniMesta,
  ulici,
  uliciCr,
  kukniBoevi,
  stanovi,
  parceli,
  parceliDelovi,
  zgradi,
  objekti,
  prijavi,
  logAktivnosti,
  korisnici,
  uliciOpstiniRef,
} from './db/schema.js';

const DEFAULT_DATASET_PATH =
  '/media/duko/New Volume/kataster_harvest/katastar_harvest_output/data';
const DEFAULT_BATCH_SIZE = 500;

export type TableName =
  | 'opstini'
  | 'naselen_mesta'
  | 'ulici'
  | 'ulici_cr'
  | 'kukni_broevi'
  | 'stanovi'
  | 'parceli'
  | 'parceli_delovi'
  | 'zgradi'
  | 'objekti'
  | 'prijavi'
  | 'log_aktivnosti'
  | 'korisnici'
  | 'ulici_opstini_ref';

export interface LoaderOptions {
  datasetPath?: string;
  tables?: TableName[];
  limit?: number;
  verbose?: boolean;
  batchSize?: number;
  storeGeometry?: boolean;
}

type GeometryValue = string | SQL<unknown>;

type WithGeometry<T> = T extends { geometry?: unknown }
  ? Omit<T, 'geometry'> & { geometry?: GeometryValue | null }
  : T;

type InsertByTable = {
  opstini: WithGeometry<typeof opstini.$inferInsert>;
  naselen_mesta: WithGeometry<typeof naseleniMesta.$inferInsert>;
  ulici: WithGeometry<typeof ulici.$inferInsert>;
  ulici_cr: WithGeometry<typeof uliciCr.$inferInsert>;
  kukni_broevi: WithGeometry<typeof kukniBoevi.$inferInsert>;
  stanovi: WithGeometry<typeof stanovi.$inferInsert>;
  parceli: WithGeometry<typeof parceli.$inferInsert>;
  parceli_delovi: WithGeometry<typeof parceliDelovi.$inferInsert>;
  zgradi: WithGeometry<typeof zgradi.$inferInsert>;
  objekti: WithGeometry<typeof objekti.$inferInsert>;
  prijavi: WithGeometry<typeof prijavi.$inferInsert>;
  log_aktivnosti: WithGeometry<typeof logAktivnosti.$inferInsert>;
  korisnici: WithGeometry<typeof korisnici.$inferInsert>;
  ulici_opstini_ref: WithGeometry<typeof uliciOpstiniRef.$inferInsert>;
};

interface SourceFile<T extends TableName = TableName> {
  table: T;
  filePath: string;
  sourceName: string;
}

interface EndpointInfo {
  itemName?: string;
  serviceName?: string;
  endpointIdReadable?: string;
}

export class CadastreLoader {
  private readonly datasetPath: string;
  private readonly tables?: TableName[];
  private readonly limit?: number;
  private readonly verbose: boolean;
  private readonly batchSize: number;
  private readonly storeGeometry: boolean;

  constructor(options: LoaderOptions = {}) {
    this.datasetPath = options.datasetPath ?? DEFAULT_DATASET_PATH;
    this.tables = options.tables;
    this.limit = options.limit;
    this.verbose = options.verbose ?? false;
    this.batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
    this.storeGeometry = options.storeGeometry ?? true;
  }

  async loadAll(): Promise<void> {
    const sources = this.discoverSources();
    if (sources.length === 0) {
      if (this.tables) {
        console.warn(`Warning: no matching sources found for table(s): ${this.tables.join(', ')} — skipping.`);
        return;
      }
      throw new Error(`No records.jsonl files found under ${this.datasetPath}`);
    }

    for (const source of sources) {
      await this.loadFile(source);
    }
  }

  private discoverSources(): SourceFile[] {
    if (!fs.existsSync(this.datasetPath)) {
      throw new Error(`Dataset path not found: ${this.datasetPath}`);
    }

    const sources: SourceFile[] = [];
    const entries = fs.readdirSync(this.datasetPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const dirPath = path.join(this.datasetPath, entry.name);
      const recordsFile = path.join(dirPath, 'records.jsonl');
      if (!fs.existsSync(recordsFile)) continue;

      const endpointInfo = this.readEndpointInfo(dirPath);
      const table = this.detectTable(entry.name, endpointInfo);
      if (!table) {
        if (this.verbose) {
          console.log(`Skipping unknown dataset: ${entry.name}`);
        }
        continue;
      }

      if (this.tables && !this.tables.includes(table)) continue;

      sources.push({
        table,
        filePath: recordsFile,
        sourceName: entry.name,
      });
    }

    return sources;
  }

  private readEndpointInfo(dirPath: string): EndpointInfo | null {
    const infoPath = path.join(dirPath, 'endpoint_info.json');
    if (!fs.existsSync(infoPath)) return null;

    try {
      const raw = fs.readFileSync(infoPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const endpoint = parsed.endpoint ?? {};

      return {
        itemName: endpoint.item_name,
        serviceName: endpoint.service_name,
        endpointIdReadable: endpoint.endpoint_id_readable,
      };
    } catch (error) {
      if (this.verbose) {
        console.log(`Failed to read endpoint_info.json in ${dirPath}`);
      }
      return null;
    }
  }

  private detectTable(dirName: string, info: EndpointInfo | null): TableName | null {
    const rules: Array<{ table: TableName; keywords: string[] }> = [
      { table: 'ulici_opstini_ref', keywords: ['ulici_opstini', 'ulici opstini', 'ulici_opstini_union', 'улици општини'] },
      { table: 'ulici_cr', keywords: ['ulici_cr', 'ulici cr', 'cr_street', 'cr street', 'ulicicr', 'улици цр', 'улици од цр', ' цр'] },
      { table: 'naselen_mesta', keywords: ['naselen_mesta', 'naselen mesta', 'settlement', 'насел'] },
      { table: 'kukni_broevi', keywords: ['kukni', 'broevi', 'куќни', 'броеви'] },
      { table: 'parceli_delovi', keywords: ['parceli_delovi', 'parceli delovi', 'parcel parts'] },
      { table: 'parceli', keywords: ['parceli', 'parcels', 'парцели'] },
      { table: 'zgradi', keywords: ['zgradi', 'zgrada', 'building', 'ekat', 'згради'] },
      { table: 'objekti', keywords: ['objekti', 'objekt', 'објекти'] },
      { table: 'stanovi', keywords: ['stanovi', 'apartments', 'станови'] },
      { table: 'ulici', keywords: ['ulici', 'street', 'улици'] },
      { table: 'opstini', keywords: ['opstini', 'municip', 'општини', 'општин'] },
      { table: 'korisnici', keywords: ['korisnici', 'users', 'корисници'] },
      { table: 'prijavi', keywords: ['prijavi', 'prijava', 'submission', 'request', 'пријави', 'забелешки', 'коментари'] },
      { table: 'log_aktivnosti', keywords: ['log_aktivnosti', 'aktivnosti', 'audit', 'активности'] },
    ];

    const match = (label: string): TableName | null => {
      for (const rule of rules) {
        if (rule.keywords.some((kw) => label.includes(kw))) return rule.table;
      }
      return null;
    };

    // Try item_name first (most specific); skip attachment and statistics tables
    if (info?.itemName) {
      const itemLabel = info.itemName.toLowerCase();
      if (itemLabel.includes('attach') || itemLabel.includes('статист')) return null;
      const result = match(itemLabel);
      if (result) return result;
    }

    // Fallback: dir name + service name + endpoint readable (no item_name to avoid double-matching)
    const fullLabel = [dirName, info?.serviceName, info?.endpointIdReadable]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return match(fullLabel);
  }

  private async loadFile(source: SourceFile): Promise<void> {
    if (!fs.existsSync(source.filePath)) return;

    const fileStream = fs.createReadStream(source.filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let readCount = 0;
    let insertedCount = 0;
    let errorCount = 0;
    let batch: Array<InsertByTable[TableName]> = [];

    console.log(`Loading ${source.table} from ${source.sourceName}`);

    for await (const line of rl) {
      if (!line.trim()) continue;

      try {
        readCount++;
        const record = JSON.parse(line);
        const attrs = record.attributes ?? {};
        const geom = record.geometry ?? null;

        const row = this.buildInsert(source.table, attrs, geom);
        if (!row) continue;

        batch.push(row);

        if (batch.length >= this.batchSize) {
          await this.insertBatch(source.table, batch);
          insertedCount += batch.length;
          batch = [];
        }

        if (this.limit && insertedCount >= this.limit) {
          rl.close();
          break;
        }
      } catch (error) {
        errorCount += 1;
        if (errorCount <= 5) {
          console.error(`Error processing record ${readCount}:`, error);
        }
      }
    }

    if (batch.length > 0) {
      await this.insertBatch(source.table, batch);
      insertedCount += batch.length;
    }

    console.log(
      `Finished ${source.table}: read=${readCount}, inserted=${insertedCount}, errors=${errorCount}`,
    );
  }

  private async insertBatch(
    table: TableName,
    rows: Array<InsertByTable[TableName]>,
  ): Promise<void> {
    if (rows.length === 0) return;

    const safeInsert = async (tableRef: any, rowsToInsert: any[], name: string) => {
      try {
        await db.insert(tableRef).values(rowsToInsert).onConflictDoNothing();
      } catch (err) {
        console.error(`Bulk insert failed for ${name}, falling back to single-row inserts:`, err instanceof Error ? err.message : err);
        for (const r of rowsToInsert) {
          try {
            await db.insert(tableRef).values([r]).onConflictDoNothing();
          } catch (e) {
            console.error(`Row insert failed for ${name}, skipping row:`, e instanceof Error ? e.message : e);
          }
        }
      }
    };

    switch (table) {
      case 'opstini':
        await safeInsert(opstini, rows as InsertByTable['opstini'][], 'opstini');
        break;
      case 'naselen_mesta':
        await safeInsert(naseleniMesta, rows as InsertByTable['naselen_mesta'][], 'naselen_mesta');
        break;
      case 'ulici':
        await safeInsert(ulici, rows as InsertByTable['ulici'][], 'ulici');
        break;
      case 'ulici_cr':
        await safeInsert(uliciCr, rows as InsertByTable['ulici_cr'][], 'ulici_cr');
        break;
      case 'kukni_broevi':
        await safeInsert(kukniBoevi, rows as InsertByTable['kukni_broevi'][], 'kukni_broevi');
        break;
      case 'stanovi':
        await safeInsert(stanovi, rows as InsertByTable['stanovi'][], 'stanovi');
        break;
      case 'parceli':
        await safeInsert(parceli, rows as InsertByTable['parceli'][], 'parceli');
        break;
      case 'parceli_delovi':
        await safeInsert(parceliDelovi, rows as InsertByTable['parceli_delovi'][], 'parceli_delovi');
        break;
      case 'zgradi':
        await safeInsert(zgradi, rows as InsertByTable['zgradi'][], 'zgradi');
        break;
      case 'objekti':
        await safeInsert(objekti, rows as InsertByTable['objekti'][], 'objekti');
        break;
      case 'prijavi':
        await safeInsert(prijavi, rows as InsertByTable['prijavi'][], 'prijavi');
        break;
      case 'log_aktivnosti':
        await safeInsert(logAktivnosti, rows as InsertByTable['log_aktivnosti'][], 'log_aktivnosti');
        break;
      case 'korisnici':
        await safeInsert(korisnici, rows as InsertByTable['korisnici'][], 'korisnici');
        break;
      case 'ulici_opstini_ref':
        await safeInsert(uliciOpstiniRef, rows as InsertByTable['ulici_opstini_ref'][], 'ulici_opstini_ref');
        break;
      default:
        break;
    }
  }

  private buildInsert(
    table: TableName,
    attrs: Record<string, unknown>,
    geom: unknown,
  ): InsertByTable[TableName] | null {
    const geometry = this.buildGeometryValue(geom);

    switch (table) {
      case 'opstini':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          globalid: this.getString(attrs, ['globalid']),
          numericId: this.getInteger(attrs, ['numeric_id', 'numericid', 'id']),
          name: this.getString(attrs, ['name', 'opstina']),
          nameMk: this.getString(attrs, ['name_mk', 'namemk', 'opstina_ime']),
          maticenbro: this.getString(attrs, ['maticenbro', 'maticen_broj']),
          codeTu: this.getString(attrs, ['code_tu', 'opstina_sifra']),
          shapeLeng: this.getNumber(attrs, ['shape_leng', 'shape_length', 'st_length', 'st_length(shape)']),
          shapeArea: this.getNumber(attrs, ['shape_area', 'st_area', 'st_area(shape)']),
          geometry,
        };
      case 'naselen_mesta':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid_1', 'objectid']),
          globalid: this.getString(attrs, ['globalid']),
          mestoUid: this.getString(attrs, ['mesto_uid']),
          mestoSifra: this.getString(attrs, ['mesto_sifra']),
          mestoIme: this.getString(attrs, ['mesto_ime']),
          opstinaSifra: this.getString(attrs, ['opstina_sifra']),
          opstinaIme: this.getString(attrs, ['opstina_ime']),
          stArea: this.getNumber(attrs, ['st_area', 'st_area(shape)']),
          stLength: this.getNumber(attrs, ['st_length', 'st_length(shape)']),
          rawAttributes: JSON.stringify(attrs),
          geometry,
        };
      case 'ulici_cr':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1', 'objectid_p_key']),
          globalid: this.getString(attrs, ['globalid']),
          ulicaIme: this.getString(attrs, ['ulica_ime']),
          ulicaSifraCr: this.getString(attrs, ['ulica_sifra_cr', 'cr_street_code']),
          ioTip: this.getString(attrs, ['io_tip']),
          mestoIme: this.getString(attrs, ['mesto_ime']),
          mestoSifra: this.getString(attrs, ['mesto_sifra']),
          objectCode: this.getString(attrs, ['object_code']),
          flagCr: this.getInteger(attrs, ['flag_cr']),
          flagForDelete: this.getInteger(attrs, ['flag_for_delete']),
        };
      case 'ulici':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1', 'objectid_']),
          globalid: this.getString(attrs, ['globalid']),
          globalidOld: this.getString(attrs, ['globalid_old']),
          idUlica: this.getString(attrs, ['id_ulica', 'pk_street_segment']),
          imeNaUlica: this.getString(attrs, ['ime_na_ulica', 'ulica_ime']),
          imeNovaUlica: this.getString(attrs, ['ime_nova_ulica']),
          imeNaUlicaAl: this.getString(attrs, ['ime_na_ulica_al']),
          imeNaUlicaEn: this.getString(attrs, ['ime_na_ulica_en']),
          uliciCrFk: this.getString(attrs, ['ulici_cr_fk', 'cr_street_code']),
          tabla: this.getString(attrs, ['tabla']),
          status: this.getString(attrs, ['status']),
          statusUlica: this.getString(attrs, ['status_ulica']),
          nevalidniUlici: this.getString(attrs, ['nevalidni_ulici']),
          nacinNaSobiranje: this.getString(attrs, ['nacin_na_sobiranje']),
          interenStatus: this.getString(attrs, ['interen_status']),
          tehnickiBroj: this.getString(attrs, ['tehnicki_broj']),
          imeNaUlicaOpstina: this.getString(attrs, ['ime_na_ulica_opstina']),
          statusOpstina: this.getString(attrs, ['status_opstina']),
          promeneta_grafika: this.getString(attrs, ['promeneta_grafika']),
          mestoSifra: this.getString(attrs, ['mesto_sifra']),
          zabeleskaodkontrola: this.getString(attrs, ['zabeleskaodkontrola']),
          zabeleskaOdOpstini: this.getString(attrs, ['zabeleska_od_opstini']),
          zabeleskaOpstiniTeks: this.getString(attrs, ['zabeleska_opstini_teks']),
          stLength: this.getNumber(attrs, ['st_length', 'st_length(shape)']),
          geometry,
        };
      case 'kukni_broevi':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          globalid: this.getString(attrs, ['globalid']),
          globalidOld: this.getString(attrs, ['globalid_old']),
          syncGlobalid: this.getString(attrs, ['sync_globalid']),
          syncObjectid: this.getInteger(attrs, ['sync_objectid']),
          idUlica: this.getString(attrs, ['id_ulica']),
          imeNaUlica: this.getString(attrs, ['ime_na_ulica']),
          imeNaUlicaAl: this.getString(attrs, ['ime_na_ulica_al']),
          uliciCrFk: this.getString(attrs, ['ulici_cr_fk']),
          fkStreets: this.getString(attrs, ['fk_streets']),
          fkStreet: this.getString(attrs, ['fk_street']),
          kukenBroj: this.getInteger(attrs, ['kuken_broj']),
          kukenBrojInteger: this.getInteger(attrs, ['kuken_broj_integer']),
          dodatokNaKukenBroj: this.getString(attrs, ['dodatok_na_kuken_broj']),
          brojNaVlez: this.getString(attrs, ['broj_na_vlez']),
          idVlez: this.getInteger(attrs, ['id_vlez']),
          brojNaKatovi: this.getInteger(attrs, ['broj_na_katovi']),
          brojNaStanovi: this.getInteger(attrs, ['broj_na_stanovi']),
          tabla: this.getString(attrs, ['tabla']),
          nacinNaSobiranje: this.getString(attrs, ['nacin_na_sobiranje']),
          klasifikacija: this.getString(attrs, ['klasifikacija']),
          godinaGradba: this.getString(attrs, ['godina_gradba']),
          materijalGradba: this.getString(attrs, ['materijal_gradba']),
          godinaNadgradba: this.getString(attrs, ['godina_nadgradba']),
          godinaDogradba: this.getString(attrs, ['godina_dogradba']),
          godinaRekonstrukcija: this.getString(attrs, ['godina_rekonstrukcija']),
          tipRek: this.getString(attrs, ['tip_rek']),
          fasada: this.getString(attrs, ['fasada']),
          terasi: this.getString(attrs, ['terasi']),
          garaza: this.getString(attrs, ['garaza']),
          parking: this.getString(attrs, ['parking']),
          lift: this.getString(attrs, ['lift']),
          struja: this.getString(attrs, ['struja']),
          vodovod: this.getString(attrs, ['vodovod']),
          kanalizacija: this.getString(attrs, ['kanalizacija']),
          greenje: this.getString(attrs, ['greenje']),
          gas: this.getString(attrs, ['gas']),
          pribliznaKvadratura: this.getString(attrs, ['priblizna_kvadratura']),
          imeNaSpecijalenObjekt: this.getString(attrs, ['ime_na_specijalen_objekt']),
          imeNaSpecijalenObjektAl: this.getString(attrs, ['ime_na_specijalen_objekt_al']),
          vidNaSpecijalenObjekt: this.getString(attrs, ['vid_na_specijalen_objekt']),
          imeNaSpecijalenObjektTeren: this.getString(attrs, ['ime_na_specijalen_objekt_teren']),
          imeNaSpecijalenObjektOpstina: this.getString(attrs, ['ime_na_specijalen_objekt_opstin']),
          tipNaSpecijalenObjektTeren: this.getString(attrs, ['tip_na_specijalen_objekt_teren']),
          tipNaSpecijalenObjektOpstina: this.getString(attrs, ['tip_na_specijalen_objekt_opstin']),
          status: this.getString(attrs, ['status']),
          interenStatus: this.getString(attrs, ['interen_status']),
          statusTeren: this.getString(attrs, ['status_teren']),
          statusOdTeren: this.getString(attrs, ['status_od_teren']),
          globalNevalidni: this.getString(attrs, ['global_nevalidni']),
          kontrolaNaPodatoci: this.getString(attrs, ['kontrola_na_podatoci']),
          imeNaUlicaOpstina: this.getString(attrs, ['ime_na_ulica_opstina']),
          kukenBrojOpstina: this.getString(attrs, ['kuken_broj_opstina']),
          dodatokNaKukenBrojOpstina: this.getString(attrs, ['dodatok_na_kuken_broj_opstina']),
          brojNaVlezOpstina: this.getString(attrs, ['broj_na_vlez_opstina']),
          tablaOpstina: this.getString(attrs, ['tabla_opstina']),
          statusOpstina: this.getString(attrs, ['status_opstina']),
          promeneta_grafika: this.getString(attrs, ['promeneta_grafika']),
          xGps: this.getNumber(attrs, ['x_gps']),
          yGps: this.getNumber(attrs, ['y_gps']),
          x: this.getNumber(attrs, ['x']),
          y: this.getNumber(attrs, ['y']),
          gpsZabeleska: this.getString(attrs, ['gps_zabeleska']),
          mestoIme: this.getString(attrs, ['mesto_ime']),
          mestoSifra: this.getString(attrs, ['mesto_sifra']),
          opstina: this.getString(attrs, ['opstina']),
          els: this.getString(attrs, ['els']),
          cdpCcId: this.getString(attrs, ['cdp_cc_id']),
          cdpId: this.getString(attrs, ['cdp_id']),
          ccId: this.getString(attrs, ['cc_id']),
          parcelNumber: this.getString(attrs, ['parcel_number']),
          buildingNumber: this.getInteger(attrs, ['building_number']),
          cdpNameMk: this.getString(attrs, ['cdp_name_mk']),
          cdpNameLat: this.getString(attrs, ['cdp_name_lat']),
          ccNameMk: this.getString(attrs, ['cc_name_mk']),
          ccNameLat: this.getString(attrs, ['cc_name_lat']),
          parcelId: this.getInteger(attrs, ['parcel_id']),
          calledPlaceName: this.getString(attrs, ['called_place_name']),
          propertyListNumber: this.getInteger(attrs, ['property_list_number']),
          pkAddress: this.getString(attrs, ['pk_address']),
          pKey: this.getString(attrs, ['p_key']),
          codDp: this.getString(attrs, ['cod_dp']),
          codCc: this.getString(attrs, ['cod_cc']),
          foreignKey: this.getInteger(attrs, ['foreign_key']),
          zabeleskaodkontrola: this.getString(attrs, ['zabeleskaodkontrola']),
          zabeleskaOdOpstini: this.getString(attrs, ['zabeleska_od_opstini']),
          zabeleskaOpstiniTeks: this.getString(attrs, ['zabeleska_opstini_teks']),
          zabeleskaTeren: this.getString(attrs, ['zabeleska_teren']),
          zabeleska: this.getString(attrs, ['zabeleska']),
          statusAkn: this.getString(attrs, ['status_akn']),
          timestamp_: this.getDate(attrs, ['timestamp_']),
          action_: this.getString(attrs, ['action_']),
          hasAttachment: this.getInteger(attrs, ['has_attachment']),
          geometry,
        };
      case 'stanovi':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          globalid: this.getString(attrs, ['globalid']),
          globalidAddresses: this.getString(attrs, ['globalid_addresses']),
          idVlez: this.getInteger(attrs, ['id_vlez']),
          kat: this.getInteger(attrs, ['kat']),
          vidNaKat: this.getString(attrs, ['vid_na_kat']),
          tipNaKat: this.getString(attrs, ['tip_na_kat']),
          brojNaKat: this.getString(attrs, ['broj_na_kat']),
          brojNaStan: this.getString(attrs, ['broj_na_stan']),
          statusStan: this.getString(attrs, ['status_stan']),
          validniStanovi: this.getString(attrs, ['validni_stanovi']),
          infoZaStanLokal: this.getString(attrs, ['info_za_stan_lokal']),
          nacinNaSobiranje: this.getString(attrs, ['nacin_na_sobiranje']),
          mestoSifra: this.getString(attrs, ['mesto_sifra']),
          interenStatus: this.getString(attrs, ['interen_status']),
          zabeleskaodkontrola: this.getString(attrs, ['zabeleskaodkontrola']),
          zabeleskaOdOpstini: this.getString(attrs, ['zabeleska_od_opstini']),
          zabeleskaOpstiniTeks: this.getString(attrs, ['zabeleska_opstini_teks']),
        };
      case 'parceli':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          parcelId: this.getInteger(attrs, ['parcel_id']),
          cdpCcId: this.getString(attrs, ['cdp_cc_id']),
          cdpId: this.getString(attrs, ['cdp_id']),
          ccId: this.getString(attrs, ['cc_id']),
          parcelNumber: this.getString(attrs, ['parcel_number']),
          propertyListNumber: this.getInteger(attrs, ['property_list_number']),
          calledPlaceName: this.getString(attrs, ['called_place_name']),
          ccNameLat: this.getString(attrs, ['cc_name_lat']),
          ccNameMk: this.getString(attrs, ['cc_name_mk']),
          cdpNameLat: this.getString(attrs, ['cdp_name_lat']),
          cdpNameMk: this.getString(attrs, ['cdp_name_mk']),
          shapeLength: this.getNumber(attrs, ['shape_length', 'shape_leng', 'st_length', 'st_length(shape)']),
          shapeArea: this.getNumber(attrs, ['shape_area', 'st_area', 'st_area(shape)']),
          geometry,
        };
      case 'parceli_delovi':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          parcelId: this.getInteger(attrs, ['parcel_id']),
          parcelpartId: this.getInteger(attrs, ['parcelpart_id']),
          cdpCcId: this.getString(attrs, ['cdp_cc_id']),
          cdpId: this.getInteger(attrs, ['cdp_id']),
          ccId: this.getInteger(attrs, ['cc_id']),
          parcelNumber: this.getString(attrs, ['parcel_number']),
          buildingNumber: this.getInteger(attrs, ['building_number']),
          propertyListNumber: this.getInteger(attrs, ['property_list_number']),
          calledPlaceName: this.getString(attrs, ['called_place_name']),
          map: this.getInteger(attrs, ['map']),
          sketch: this.getInteger(attrs, ['sketch']),
          usageCode: this.getInteger(attrs, ['usage_code']),
          usageCode1: this.getInteger(attrs, ['usage_code_1']),
          usageShortname: this.getString(attrs, ['usage_shortname']),
          usageFullname: this.getString(attrs, ['usage_fullname']),
          classId: this.getInteger(attrs, ['class_id']),
          areaM2: this.getNumber(attrs, ['area_m2']),
          usageRightId: this.getInteger(attrs, ['usage_right_id']),
          propertyRightId: this.getInteger(attrs, ['property_right_id']),
          changesbookNumber: this.getInteger(attrs, ['changesbook_number']),
          changeDate: this.getDate(attrs, ['change_date']),
          hashdiff: this.getString(attrs, ['hashdiff']),
          shapeLength: this.getNumber(attrs, ['shape_length', 'shape_leng', 'st_length', 'st_length(shape)']),
          shapeArea: this.getNumber(attrs, ['shape_area', 'st_area', 'st_area(shape)']),
          geometry,
        };
      case 'zgradi':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          bldnId: this.getInteger(attrs, ['bldn_id']),
          parcelId: this.getInteger(attrs, ['parcel_id']),
          parcelpartId: this.getInteger(attrs, ['parcelpart_id']),
          cdpCcId: this.getString(attrs, ['cdp_cc_id']),
          cdpId: this.getString(attrs, ['cdp_id']),
          ccId: this.getString(attrs, ['cc_id']),
          parcelNumber: this.getString(attrs, ['parcel_number']),
          buildingNumber: this.getInteger(attrs, ['building_number']),
          newBuildingNumber: this.getInteger(attrs, ['new_building_number']),
          propertyListNumber: this.getInteger(attrs, ['property_list_number']),
          calledPlaceName: this.getString(attrs, ['called_place_name']),
          map: this.getInteger(attrs, ['map']),
          sketch: this.getInteger(attrs, ['sketch']),
          usageCode: this.getInteger(attrs, ['usage_code']),
          usageCode1: this.getInteger(attrs, ['usage_code_1']),
          usageShortname: this.getString(attrs, ['usage_shortname']),
          usageFullname: this.getString(attrs, ['usage_fullname']),
          classId: this.getInteger(attrs, ['class_id']),
          areaM2: this.getNumber(attrs, ['area_m2']),
          buildMaterialId: this.getInteger(attrs, ['build_material_id']),
          floorsNumber: this.getInteger(attrs, ['floors_number']),
          appartmentsNumber: this.getInteger(attrs, ['appartments_number']),
          buildYear: this.getInteger(attrs, ['build_year']),
          usageRightId: this.getInteger(attrs, ['usage_right_id']),
          propertyRightId: this.getInteger(attrs, ['property_right_id']),
          changesbookNumber: this.getInteger(attrs, ['changesbook_number']),
          changeDate: this.getDate(attrs, ['change_date']),
          hashdiff: this.getString(attrs, ['hashdiff']),
          stArea: this.getNumber(attrs, ['st_area', 'st_area(shape)']),
          stLength: this.getNumber(attrs, ['st_length', 'st_length(shape)']),
          geometry,
        };
      case 'objekti':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          globalid: this.getString(attrs, ['globalid']),
          sifraOdd: this.getInteger(attrs, ['sifra_odd']),
          sifraKo: this.getInteger(attrs, ['sifra_ko']),
          kOddeleni: this.getString(attrs, ['k_oddeleni']),
          kOpstina: this.getString(attrs, ['k_opstina']),
          parcela: this.getString(attrs, ['parcela']),
          parcn: this.getInteger(attrs, ['parcn']),
          subn: this.getInteger(attrs, ['subn']),
          bldn: this.getInteger(attrs, ['bldn']),
          idParc: this.getString(attrs, ['id_parc']),
          idPp: this.getString(attrs, ['id_pp']),
          mesto: this.getString(attrs, ['mesto']),
          sifraKult: this.getInteger(attrs, ['sifra_kult']),
          kultura: this.getString(attrs, ['kultura']),
          opsConcat: this.getString(attrs, ['ops_concat']),
          stArea: this.getNumber(attrs, ['st_area', 'st_area(shape)']),
          stLength: this.getNumber(attrs, ['st_length', 'st_length(shape)']),
          geometry,
        };
      case 'prijavi':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          name: this.getString(attrs, ['name']),
          surname: this.getString(attrs, ['surname']),
          eMail: this.getString(attrs, ['e_mail', 'email']),
          phoneNumber: this.getString(attrs, ['phone_number']),
          submissionDatetime: this.getDate(attrs, ['submission_datetime']),
          note: this.getString(attrs, ['note']),
          fkParcel: this.getInteger(attrs, ['fk_parcel']),
          fkAddress: this.getInteger(attrs, ['fk_address']),
          streetName: this.getString(attrs, ['street_name']),
          houseNumber: this.getInteger(attrs, ['house_number']),
          letter: this.getString(attrs, ['letter']),
          entrance: this.getString(attrs, ['entrance']),
          classification: this.getString(attrs, ['classification']),
        };
      case 'log_aktivnosti':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          globalid: this.getString(attrs, ['globalid']),
          username: this.getString(attrs, ['username']),
          editedFc: this.getString(attrs, ['edited_fc']),
          objectId: this.getString(attrs, ['object_id']),
          operationType: this.getString(attrs, ['operation_type']),
          dateTime: this.getDate(attrs, ['date_time']),
        };
      case 'korisnici':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          globalid: this.getString(attrs, ['globalid']),
          username: this.getString(attrs, ['username']),
          nasMestoId: this.getString(attrs, ['nas_mesto_id']),
          nasMestoIme: this.getString(attrs, ['nas_mesto_ime']),
          opstinaIme: this.getString(attrs, ['opstina_ime']),
        };
      case 'ulici_opstini_ref':
        return {
          arcgisObjectid: this.getInteger(attrs, ['objectid', 'objectid_1']),
          globalid: this.getString(attrs, ['globalid']),
          ulicaIme: this.getString(attrs, ['ulica_ime']),
          ulicaSifraCr: this.getString(attrs, ['ulica_sifra_cr']),
          mestoIme: this.getString(attrs, ['mesto_ime']),
          mestoSifra: this.getString(attrs, ['mesto_sifra']),
          imeNaUlicaOpstina: this.getString(attrs, ['ime_na_ulica_opstina']),
          statusOpstina: this.getString(attrs, ['status_opstina']),
        };
      default:
        return null;
    }
  }

  private buildGeometryValue(geom: unknown): SQL | null {
    if (!this.storeGeometry || !geom) return null;
    const geojson = this.toGeoJson(geom);
    if (!geojson) return null;
    return sql`ST_GeomFromGeoJSON(${JSON.stringify(geojson)})`;
  }

  private toGeoJson(geom: unknown): Record<string, unknown> | null {
    if (!geom || typeof geom !== 'object') return null;
    const geometry = geom as Record<string, unknown>;

    if (typeof geometry.x === 'number' && typeof geometry.y === 'number') {
      return { type: 'Point', coordinates: [geometry.x, geometry.y] };
    }

    if (Array.isArray(geometry.points)) {
      return { type: 'MultiPoint', coordinates: geometry.points };
    }

    if (Array.isArray(geometry.paths)) {
      const paths = geometry.paths as unknown[];
      if (paths.length === 1) {
        return { type: 'LineString', coordinates: paths[0] };
      }
      return { type: 'MultiLineString', coordinates: paths };
    }

    if (Array.isArray(geometry.rings)) {
      const rings = geometry.rings as unknown[];
      if (rings.length === 0) return null;
      return { type: 'Polygon', coordinates: rings };
    }

    return null;
  }

  private getAttr(attrs: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
      if (key in attrs) return attrs[key];
    }
    return null;
  }

  private getString(attrs: Record<string, unknown>, keys: string[]): string | null {
    const value = this.getAttr(attrs, keys);
    if (value === null || value === undefined) return null;
    return String(value);
  }

  private getNumber(attrs: Record<string, unknown>, keys: string[]): number | null {
    const value = this.getAttr(attrs, keys);
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  private getInteger(attrs: Record<string, unknown>, keys: string[]): number | null {
    const num = this.getNumber(attrs, keys);
    if (num === null) return null;
    return Math.trunc(num);
  }

  private getDate(attrs: Record<string, unknown>, keys: string[]): Date | null {
    const value = this.getAttr(attrs, keys);
    if (value === null || value === undefined || value === '') return null;
    if (value instanceof Date) return value;
    if (typeof value === 'number') return new Date(value);
    const asNumber = Number(value);
    if (!Number.isNaN(asNumber)) return new Date(asNumber);
    const parsed = new Date(String(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
