export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_TAGS = {
  OPSTINI: 'Opstini',
  NASELENI_MESTA: 'Naseleni Mesta',
  ULICI: 'Ulici',
  ULICI_CR: 'Ulici CR',
  KUKNI_BROEVI: 'Kukni Broevi',
  STANOVI: 'Stanovi',
  PARCELI: 'Parceli',
  PARCELI_DELOVI: 'Parceli Delovi',
  ZGRADI: 'Zgradi',
  OBJEKTI: 'Objekti',
  LOG_AKTIVNOSTI: 'Log Aktivnosti',
  KORISNICI: 'Korisnici',
  PRIJAVI: 'Prijavi',
  ULICI_OPSTINI_REF: 'Ulici Opstini Ref',
} as const;

export const API_INFO = {
  title: 'Cadastre API',
  version: '1.0.0',
  description: 'North Macedonia Cadastre & Address Register REST API',
} as const;
