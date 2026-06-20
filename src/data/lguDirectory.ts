// Region XII (SOCCSKSARGEN) local-government directory — the cities and
// municipalities neighbouring Koronadal, with their mayors and vice mayors.
// Sourced from the BetterGov.ph government directory dataset and committed to
// src/data/generated/lgu-region-xii.json. Officials change after elections;
// treat as a convenience directory and verify against each LGU.
import raw from './generated/lgu-region-xii.json';

interface Official {
  name: string;
  contact?: string;
}

export interface LguEntry {
  name: string;
  zipCode?: string;
  mayor?: Official;
  viceMayor?: Official;
}

export interface LguProvince {
  province: string;
  entries: LguEntry[];
}

interface RawOfficial {
  name?: string;
  contact?: string;
}
interface RawUnit {
  city?: string;
  municipality?: string;
  zip_code?: string;
  mayor?: RawOfficial;
  vice_mayor?: RawOfficial;
}
interface RawProvince {
  province: string;
  cities?: RawUnit[];
  municipalities?: RawUnit[];
}
interface RawData {
  region: string;
  provinces: RawProvince[];
}

const data = raw as RawData;

const toEntry = (u: RawUnit, isCity: boolean): LguEntry => ({
  name: (isCity ? u.city : u.municipality) ?? '',
  zipCode: u.zip_code,
  mayor: u.mayor?.name
    ? { name: u.mayor.name, contact: u.mayor.contact }
    : undefined,
  viceMayor: u.vice_mayor?.name
    ? { name: u.vice_mayor.name, contact: u.vice_mayor.contact }
    : undefined,
});

export const LGU_REGION = data.region;

export const lguProvinces: LguProvince[] = data.provinces.map(p => ({
  province: p.province,
  entries: [
    ...(p.cities ?? []).map(c => toEntry(c, true)),
    ...(p.municipalities ?? []).map(m => toEntry(m, false)),
  ].sort((a, b) => a.name.localeCompare(b.name)),
}));
