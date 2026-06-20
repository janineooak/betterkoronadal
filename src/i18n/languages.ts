import type { LanguageType } from '../types';

export interface LanguageInfo {
  code: LanguageType;
  name: string;
  nativeName: string;
}

export const LANGUAGES: Record<LanguageType, LanguageInfo> = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  fil: { code: 'fil', name: 'Tagalog', nativeName: 'Filipino/Tagalog' },
  ceb: { code: 'ceb', name: 'Cebuano', nativeName: 'Bisaya/Sinugboanon' },
  ilo: { code: 'ilo', name: 'Ilocano', nativeName: 'Ilokano' },
  hil: { code: 'hil', name: 'Hiligaynon', nativeName: 'Hiligaynon' },
  war: { code: 'war', name: 'Waray', nativeName: 'Waray-Waray' },
  pam: { code: 'pam', name: 'Kapampangan', nativeName: 'Kapampangan' },
  bcl: { code: 'bcl', name: 'Bikol', nativeName: 'Bikol Central' },
  pag: { code: 'pag', name: 'Pangasinan', nativeName: 'Pangasinan' },
  mag: { code: 'mag', name: 'Maguindanao', nativeName: 'Maguindanaon' },
  tsg: { code: 'tsg', name: 'Tausug', nativeName: 'Bahasa Sūg' },
  mdh: { code: 'mdh', name: 'Maranao', nativeName: 'Meranaw' },
};

export const DEFAULT_LANGUAGE: LanguageType = 'en';

/**
 * Languages with a translation file under `public/locales/{code}/common.json`.
 * Only these are offered in the language switcher; the rest of LANGUAGES are
 * declared for future use and would fall back to English if shown.
 */
export const AVAILABLE_LANGUAGE_CODES: LanguageType[] = ['en', 'hil'];

export const AVAILABLE_LANGUAGES: LanguageInfo[] = AVAILABLE_LANGUAGE_CODES.map(
  code => LANGUAGES[code]
);
