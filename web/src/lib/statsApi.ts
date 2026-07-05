export type BuildYearPoint = { year: number; count: number };
export type MunicipalityCount = { opstina: string; count: number };
export type UsageBreakdown = { usageType: string; count: number };
export type ApplicationsPoint = { month: string; count: number };
export type ParcelAreaBucket = { bucket: string; count: number };

async function getJson<T>(path: string, params: Record<string, string | undefined> = {}): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(key, value);
  }
  const qs = query.toString();
  const res = await fetch(`/api/stats/${path}${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

export function fetchBuildYears(yearFrom?: string, yearTo?: string) {
  return getJson<BuildYearPoint[]>('build-years', { yearFrom, yearTo });
}

export function fetchPropertiesByMunicipality() {
  return getJson<MunicipalityCount[]>('properties-by-municipality');
}

export function fetchUsageBreakdown(usageType?: string) {
  return getJson<UsageBreakdown[]>('usage-breakdown', { usageType });
}

export function fetchApplicationsOverTime(dateFrom?: string, dateTo?: string, classification?: string) {
  return getJson<ApplicationsPoint[]>('applications-over-time', { dateFrom, dateTo, classification });
}

export function fetchParcelAreaDistribution(usageType?: string) {
  return getJson<ParcelAreaBucket[]>('parcel-area-distribution', { usageType });
}
