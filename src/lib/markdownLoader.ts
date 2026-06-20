/**
 * Utility to load markdown content dynamically based on slug
 */

/**
 * Replaces {PLACEHOLDER} tokens using JSON data first, then VITE_ env vars.
 */
function interpolate(
  content: string,
  data: Record<string, unknown> = {}
): string {
  return content.replace(/\{([A-Z0-9_]+)\}/g, (match, key) => {
    if (key in data) return String(data[key]);
    const value = import.meta.env[`VITE_${key}`];
    return value !== undefined ? String(value) : match;
  });
}

export interface MarkdownContent {
  content: string;
  title?: string;
  description?: string;
  data?: Record<string, unknown>;
}

/** Default (source) language — base files have no language suffix. */
const DEFAULT_LANG = 'en';

/**
 * Loads a raw markdown file for a given language, falling back to the base
 * (English) file when no translation exists for that slug. Returns null only
 * if even the base file is missing.
 */
async function importMarkdown(
  dir: string,
  categorySlug: string,
  documentSlug: string,
  lang: string
): Promise<string | null> {
  // Try the language-specific file first (e.g. `executive.hil.md`).
  if (lang && lang !== DEFAULT_LANG) {
    try {
      const localized = await import(
        `../../content/${dir}/${categorySlug}/${documentSlug}.${lang}.md?raw`
      );
      return localized.default;
    } catch {
      // No translation for this slug — fall back to the base file below.
    }
  }
  try {
    const base = await import(
      `../../content/${dir}/${categorySlug}/${documentSlug}.md?raw`
    );
    return base.default;
  } catch {
    return null;
  }
}

/**
 * Loads markdown content from the appropriate content directory.
 * Also attempts to load a companion JSON file (same slug) for template
 * variable substitution and structured data.
 * @param documentSlug - The document slug (filename without .md extension)
 * @param categorySlug - The category slug (parent directory)
 * @param categoryType - Whether this is a 'service' or 'government' document
 * @param lang - Active UI language; loads `{slug}.{lang}.md` when available
 */
export async function loadMarkdownContent(
  documentSlug: string,
  categorySlug: string,
  categoryType: 'service' | 'government',
  lang: string = DEFAULT_LANG
): Promise<MarkdownContent> {
  try {
    const dir = categoryType === 'government' ? 'government' : 'services';

    // Try to load companion JSON for template data (language-agnostic).
    let data: Record<string, unknown> = {};
    try {
      const jsonModule = await import(
        `../../content/${dir}/${categorySlug}/${documentSlug}.json`
      );
      data = jsonModule.default;
    } catch {
      // No companion JSON — that's fine
    }

    const raw = await importMarkdown(dir, categorySlug, documentSlug, lang);
    if (raw === null) {
      throw new Error(`Document not found: ${documentSlug}`);
    }
    const content = interpolate(raw, data);

    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : undefined;

    const descriptionMatch = content.match(/^#\s+.+$\n\n(.+?)(?:\n\n|$)/s);
    const description = descriptionMatch
      ? descriptionMatch[1].replace(/^>\s*/, '').trim()
      : undefined;

    return { content, title, description, data };
  } catch (error) {
    console.error(
      `Failed to load markdown content for document: ${documentSlug}`,
      error
    );
    throw new Error(`Document not found: ${documentSlug}`);
  }
}
