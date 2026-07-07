export type LanguageType =
  | 'en' // English
  | 'fil' // Filipino (standardized Tagalog)
  | 'ceb' // Cebuano/Bisaya
  | 'ilo' // Ilocano
  | 'hil' // Hiligaynon/Ilonggo
  | 'war' // Waray
  | 'pam' // Kapampangan
  | 'bcl' // Bikol
  | 'pag' // Pangasinan
  | 'mag' // Maguindanao
  | 'tsg' // Tausug
  | 'mdh'; // Maranao

export interface NavigationItem {
  label: string;
  /** Optional i18n key for the label; falls back to `label` when absent. */
  labelKey?: string;
  href: string;
  /** Lucide React icon name (e.g. 'Building2'). Resolved via lucide-react. */
  icon?: string;
  children?: NavigationItem[];
}
