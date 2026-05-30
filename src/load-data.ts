import 'dotenv/config';
import { CadastreLoader, type TableName } from './loader.js';
import { closeDb } from './db/index.js';

const args = process.argv.slice(2);

const getArgValue = (prefix: string): string | undefined => {
  const arg = args.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
};

const pathArg = args.find((value) => !value.startsWith('--'));
const datasetPath = (pathArg ?? process.env.DATASET_PATH)?.trim();

// Normalize dataset path (trim accidental whitespace)

const tableArg = getArgValue('--table=');
const limitArg = getArgValue('--limit=');
const batchArg = getArgValue('--batch-size=');
const noGeometry = args.includes('--no-geometry');
const verbose = args.includes('--verbose');

// datasetPath is optional — loader falls back to DEFAULT_DATASET_PATH if not provided

const tables = tableArg ? ([tableArg] as TableName[]) : undefined;
const limit = limitArg ? Number(limitArg) : undefined;
const batchSize = batchArg ? Number(batchArg) : undefined;

const loader = new CadastreLoader({
  datasetPath,
  tables,
  limit,
  batchSize,
  verbose,
  storeGeometry: !noGeometry,
});

const run = async () => {
  try {
    await loader.loadAll();
  } catch (error) {
    console.error('Loader failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
};

run();
