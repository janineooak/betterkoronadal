import yaml from 'js-yaml';

// Type definitions for the services data
export interface Subcategory {
  name: string;
  slug: string;
  description?: string;
  subcategory?: string; // Optional grouping label within a category page
}

export interface Category {
  category: string;
  slug: string;
  description: string;
  icon: string;
  subcategories?: Subcategory[]; // Keep for backward compatibility
}

export interface CategoryData {
  categories: Category[];
  description: string;
}

export interface CategoryIndexData {
  title?: string;
  description?: string;
  layout?: 'grid' | 'list';
  pages: Subcategory[];
}

// Import the YAML file as raw text (English base + Hiligaynon variants)
import servicesYamlContent from './services.yaml?raw';
import governmentActivitiesYamlContent from './government.yaml?raw';
import servicesYamlHil from './services.hil.yaml?raw';
import governmentActivitiesYamlHil from './government.hil.yaml?raw';

// Import all category index files statically (English base)
import healthServicesIndex from '../../content/services/health-services/index.yaml?raw';
import educationIndex from '../../content/services/education/index.yaml?raw';
import businessIndex from '../../content/services/business/index.yaml?raw';
import socialWelfareIndex from '../../content/services/social-welfare/index.yaml?raw';
import agricultureFisheriesIndex from '../../content/services/agriculture-fisheries/index.yaml?raw';
import infrastructurePublicWorksIndex from '../../content/services/infrastructure-public-works/index.yaml?raw';
import garbageWasteDisposalIndex from '../../content/services/garbage-waste-disposal/index.yaml?raw';
import environmentIndex from '../../content/services/environment/index.yaml?raw';
import disasterPreparednessIndex from '../../content/services/disaster-preparedness/index.yaml?raw';
import housingLandUseIndex from '../../content/services/housing-land-use/index.yaml?raw';
import civilRegistryIndex from '../../content/services/civil-registry/index.yaml?raw';
import taxesAndPropertyIndex from '../../content/services/taxes-and-property/index.yaml?raw';
import buildingConstructionIndex from '../../content/services/building-construction/index.yaml?raw';
import transportIndex from '../../content/services/transport/index.yaml?raw';
import employmentIndex from '../../content/services/employment/index.yaml?raw';
import governmentDepartmentsIndex from '../../content/government/departments/index.yaml?raw';
import governmentReportsAndStatisticsIndex from '../../content/government/reports-and-statistics/index.yaml?raw';
import governmentGuidesAndRegulationsIndex from '../../content/government/guides-and-regulations/index.yaml?raw';

// Hiligaynon index variants
import healthServicesIndexHil from '../../content/services/health-services/index.hil.yaml?raw';
import educationIndexHil from '../../content/services/education/index.hil.yaml?raw';
import businessIndexHil from '../../content/services/business/index.hil.yaml?raw';
import socialWelfareIndexHil from '../../content/services/social-welfare/index.hil.yaml?raw';
import agricultureFisheriesIndexHil from '../../content/services/agriculture-fisheries/index.hil.yaml?raw';
import infrastructurePublicWorksIndexHil from '../../content/services/infrastructure-public-works/index.hil.yaml?raw';
import garbageWasteDisposalIndexHil from '../../content/services/garbage-waste-disposal/index.hil.yaml?raw';
import environmentIndexHil from '../../content/services/environment/index.hil.yaml?raw';
import disasterPreparednessIndexHil from '../../content/services/disaster-preparedness/index.hil.yaml?raw';
import housingLandUseIndexHil from '../../content/services/housing-land-use/index.hil.yaml?raw';
import civilRegistryIndexHil from '../../content/services/civil-registry/index.hil.yaml?raw';
import taxesAndPropertyIndexHil from '../../content/services/taxes-and-property/index.hil.yaml?raw';
import buildingConstructionIndexHil from '../../content/services/building-construction/index.hil.yaml?raw';
import transportIndexHil from '../../content/services/transport/index.hil.yaml?raw';
import employmentIndexHil from '../../content/services/employment/index.hil.yaml?raw';
import governmentDepartmentsIndexHil from '../../content/government/departments/index.hil.yaml?raw';
import governmentReportsAndStatisticsIndexHil from '../../content/government/reports-and-statistics/index.hil.yaml?raw';
import governmentGuidesAndRegulationsIndexHil from '../../content/government/guides-and-regulations/index.hil.yaml?raw';

// Create a mapping of category slugs to their YAML content, per language.
const categoryIndexMaps: Record<string, { [key: string]: string }> = {
  en: {
    'health-services': healthServicesIndex,
    education: educationIndex,
    business: businessIndex,
    'social-welfare': socialWelfareIndex,
    'agriculture-fisheries': agricultureFisheriesIndex,
    'infrastructure-public-works': infrastructurePublicWorksIndex,
    'garbage-waste-disposal': garbageWasteDisposalIndex,
    environment: environmentIndex,
    'disaster-preparedness': disasterPreparednessIndex,
    'housing-land-use': housingLandUseIndex,
    'civil-registry': civilRegistryIndex,
    'taxes-and-property': taxesAndPropertyIndex,
    'building-construction': buildingConstructionIndex,
    transport: transportIndex,
    employment: employmentIndex,
    departments: governmentDepartmentsIndex,
    'reports-and-statistics': governmentReportsAndStatisticsIndex,
    'guides-and-regulations': governmentGuidesAndRegulationsIndex,
  },
  hil: {
    'health-services': healthServicesIndexHil,
    education: educationIndexHil,
    business: businessIndexHil,
    'social-welfare': socialWelfareIndexHil,
    'agriculture-fisheries': agricultureFisheriesIndexHil,
    'infrastructure-public-works': infrastructurePublicWorksIndexHil,
    'garbage-waste-disposal': garbageWasteDisposalIndexHil,
    environment: environmentIndexHil,
    'disaster-preparedness': disasterPreparednessIndexHil,
    'housing-land-use': housingLandUseIndexHil,
    'civil-registry': civilRegistryIndexHil,
    'taxes-and-property': taxesAndPropertyIndexHil,
    'building-construction': buildingConstructionIndexHil,
    transport: transportIndexHil,
    employment: employmentIndexHil,
    departments: governmentDepartmentsIndexHil,
    'reports-and-statistics': governmentReportsAndStatisticsIndexHil,
    'guides-and-regulations': governmentGuidesAndRegulationsIndexHil,
  },
};

// English remains the canonical map for callers that don't pass a language
// (navigation, search index) — those stay in the source language.
const categoryIndexMap = categoryIndexMaps.en;

// Parse the YAML content (English is the source of truth for structure)
export const serviceCategories: CategoryData = yaml.load(
  servicesYamlContent
) as CategoryData;

export const governmentCategories: CategoryData = yaml.load(
  governmentActivitiesYamlContent
) as CategoryData;

const serviceCategoriesByLang: Record<string, CategoryData> = {
  en: serviceCategories,
  hil: yaml.load(servicesYamlHil) as CategoryData,
};
const governmentCategoriesByLang: Record<string, CategoryData> = {
  en: governmentCategories,
  hil: yaml.load(governmentActivitiesYamlHil) as CategoryData,
};

/**
 * Merges translated text fields onto the English base by slug, so structure
 * (slug, icon, layout, href) always comes from English and only the
 * human-readable text is localized. Any entry missing from the translation
 * falls back to English.
 */
function mergeCategories(base: Category[], loc?: Category[]): Category[] {
  if (!loc) return base;
  const bySlug = new Map(loc.map(c => [c.slug, c]));
  return base.map(b => {
    const t = bySlug.get(b.slug);
    return t
      ? {
          ...b,
          category: t.category ?? b.category,
          description: t.description ?? b.description,
        }
      : b;
  });
}

/** Service categories for a language, falling back to English per entry. */
export function getServiceCategories(lang: string = 'en'): CategoryData {
  const loc = serviceCategoriesByLang[lang];
  if (!loc || lang === 'en') return serviceCategories;
  return {
    ...serviceCategories,
    categories: mergeCategories(serviceCategories.categories, loc.categories),
  };
}

/** Government categories for a language, falling back to English per entry. */
export function getGovernmentCategories(lang: string = 'en'): CategoryData {
  const loc = governmentCategoriesByLang[lang];
  if (!loc || lang === 'en') return governmentCategories;
  return {
    ...governmentCategories,
    categories: mergeCategories(
      governmentCategories.categories,
      loc.categories
    ),
  };
}

export interface CategoryIndex {
  title?: string;
  description?: string;
  layout: 'grid' | 'list';
  pages: Subcategory[];
}

/** Merges translated page text onto the English pages by slug. */
function mergePages(base: Subcategory[], loc?: Subcategory[]): Subcategory[] {
  if (!loc) return base;
  const bySlug = new Map(loc.map(p => [p.slug, p]));
  return base.map(b => {
    const t = bySlug.get(b.slug);
    return t
      ? {
          ...b,
          name: t.name ?? b.name,
          description: t.description ?? b.description,
          subcategory: t.subcategory ?? b.subcategory,
        }
      : b;
  });
}

// Function to load category index data, localized with per-page English
// fallback. Structure (slug, layout) always comes from the English file.
export async function loadCategoryIndex(
  categorySlug: string,
  lang: string = 'en'
): Promise<CategoryIndex> {
  const baseContent = categoryIndexMap[categorySlug];
  if (!baseContent) {
    return { layout: 'list', pages: [] };
  }
  try {
    const base = yaml.load(baseContent) as CategoryIndexData;
    let loc: CategoryIndexData | undefined;
    const locContent = categoryIndexMaps[lang]?.[categorySlug];
    if (lang !== 'en' && locContent) {
      try {
        loc = yaml.load(locContent) as CategoryIndexData;
      } catch {
        loc = undefined; // fall back to English on parse failure
      }
    }
    return {
      title: loc?.title ?? base.title,
      description: loc?.description ?? base.description,
      layout: base.layout ?? 'list',
      pages: mergePages(base.pages || [], loc?.pages),
    };
  } catch (parseError) {
    console.warn(
      `Failed to parse YAML content for category ${categorySlug}:`,
      parseError
    );
    return { layout: 'list', pages: [] };
  }
}

// Function to get subcategories for a category (with caching, keyed by lang)
const categoryCache = new Map<string, CategoryIndex>();

export async function getCategorySubcategories(
  categorySlug: string,
  lang: string = 'en'
): Promise<CategoryIndex> {
  const cacheKey = `${lang}:${categorySlug}`;
  if (categoryCache.has(cacheKey)) {
    return categoryCache.get(cacheKey)!;
  }

  const result = await loadCategoryIndex(categorySlug, lang);
  categoryCache.set(cacheKey, result);
  return result;
}

/** Returns true if a slug has a registered index in categoryIndexMap */
export function isNestedCategory(slug: string): boolean {
  return slug in categoryIndexMap;
}
