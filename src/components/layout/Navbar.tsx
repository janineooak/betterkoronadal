import React, { useState } from 'react';
import {
  X,
  Menu,
  ChevronDown,
  Globe,
  Search,
  Info,
  Mail,
  Phone,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import type { LanguageType } from '../../types/index';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES } from '../../i18n/languages';

// Toggle to re-enable the language switcher once translations are ready.
const SHOW_LANGUAGE_SWITCHER = true;

// Resolve a Lucide icon by name (as stored in navigation data).
const NavIcon: React.FC<{ name?: string; className?: string }> = ({
  name,
  className,
}) => {
  if (!name) return null;
  const Icon = LucideIcons[name as keyof typeof LucideIcons] as
    React.ComponentType<{ className?: string }> | undefined;
  return Icon ? <Icon className={className} /> : null;
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { t, i18n } = useTranslation('common');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveMenu(null);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };

  const toggleSubmenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const changeLanguage = (newLanguage: LanguageType) => {
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav className="bg-white border-b-2 border-kapwa-brand-900 sticky top-0 z-50">
      {/* Top bar with language switcher and additional links */}
      <div className="bg-kapwa-brand-950 text-white">
        <div className="container-gov flex justify-start sm:justify-end items-center h-9 overflow-x-auto">
          <div className="flex items-center space-x-4">
            <Link
              to="/hotlines"
              className="text-xs text-kapwa-yellow-400 hover:text-kapwa-yellow-300 font-bold whitespace-nowrap transition-colors"
            >
              🚨 {t('navbar.hotlines')}
            </Link>
            <Link
              to="/about"
              className="text-xs text-white/80 hover:text-white whitespace-nowrap transition-colors"
            >
              {t('navbar.aboutTheCity')}
            </Link>
            <Link
              to="/tourism"
              className="text-xs text-white/80 hover:text-white whitespace-nowrap transition-colors"
            >
              {t('navbar.visit')}
            </Link>
            <a
              href="https://southcotabato.gov.ph"
              className="text-xs text-white/80 hover:text-white whitespace-nowrap transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              South Cotabato
            </a>
            <a
              href="https://www.gov.ph"
              className="text-xs text-white/80 hover:text-white whitespace-nowrap transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              {t('navbar.officialGovPh')}
            </a>
            <a
              href="https://koronadal.gov.ph"
              className="text-xs text-white/80 hover:text-white whitespace-nowrap transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              {t('navbar.officialWebsite')}
            </a>
            {SHOW_LANGUAGE_SWITCHER && (
              <div className="hidden md:block">
                <select
                  value={i18n.language}
                  onChange={e => changeLanguage(e.target.value as LanguageType)}
                  aria-label={t('navbar.selectLanguage', 'Select language')}
                  className="text-xs border border-white/30 px-2 py-0.5 bg-kapwa-brand-950 text-white hover:border-white focus:outline-none focus:border-white"
                >
                  {AVAILABLE_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container-gov">
        <div className="flex justify-between items-center gap-6 h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/Better.png"
                alt="BetterKoronadal.org logo"
                className="h-10 w-10 mr-3"
              />
              <div>
                <div className="font-black tracking-tight leading-none text-xl text-neutral-900">
                  Better<span className="text-kapwa-brand-900">Koronadal</span>
                  <span className="text-kapwa-red-600">.</span>
                </div>
                <div className="mt-1 hidden sm:block text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  {t('site_description')}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {mainNavigation.map(item => (
              <div key={item.label} className="relative group">
                <a
                  href={item.href}
                  className="flex items-center text-sm text-neutral-900 hover:text-kapwa-brand-900 font-semibold transition-colors"
                >
                  {t(`navbar.${item.label.replace(' ', '').toLowerCase()}`)}
                  {item.children && (
                    <ChevronDown className="ml-1 h-4 w-4 text-neutral-500 group-hover:text-kapwa-brand-900 transition-colors" />
                  )}
                </a>
                {item.children && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[640px] max-w-[92vw] opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="bg-white border-2 border-kapwa-brand-900 p-4 shadow-[6px_6px_0_0_var(--color-kapwa-brand-900)]">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-kapwa-brand-900">
                        <span className="eyebrow text-kapwa-brand-900">
                          {t(
                            `navbar.${item.label
                              .replace(' ', '')
                              .toLowerCase()}`
                          )}
                        </span>
                        <Link
                          to={item.href}
                          className="text-xs font-semibold text-neutral-900 hover:text-kapwa-brand-900"
                        >
                          {t('navbar.viewAll')} &rarr;
                        </Link>
                      </div>
                      <div
                        className="grid grid-cols-3 gap-x-4 gap-y-1"
                        role="menu"
                        aria-orientation="horizontal"
                      >
                        {item.children.map(child => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-800 hover:bg-kapwa-brand-50 hover:text-kapwa-brand-900 transition-colors"
                            role="menuitem"
                          >
                            <NavIcon
                              name={child.icon}
                              className="h-4 w-4 shrink-0 text-primary-600"
                            />
                            <span>
                              {child.labelKey ? t(child.labelKey) : child.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-5 text-sm font-semibold text-neutral-900">
            <Link
              to="/search"
              className="flex items-center hover:text-kapwa-brand-900 transition-colors"
            >
              <Search className="h-4 w-4 mr-1" />
              {t('navbar.search')}
            </Link>
            <Link
              to="/about"
              className="hover:text-kapwa-brand-900 transition-colors"
            >
              {t('navbar.about')}
            </Link>
            <Link
              to="/contact"
              className="hover:text-kapwa-brand-900 transition-colors"
            >
              {t('navbar.contact')}
            </Link>
            <Link
              to="/hotlines"
              className="inline-flex h-9 items-center gap-1.5 bg-kapwa-brand-900 px-4 text-white hover:bg-kapwa-brand-950 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {t('navbar.hotlines')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-neutral-900 border-2 border-kapwa-brand-900 hover:bg-kapwa-brand-50 focus:outline-none"
            >
              <span className="sr-only">{t('navbar.openMenu')}</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="container-gov pt-2 pb-4 space-y-1 border-t border-neutral-200 bg-white">
          {mainNavigation.map(item => (
            <div key={item.label}>
              <button
                onClick={() => toggleSubmenu(item.label)}
                className="w-full flex justify-between items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
              >
                {t(`navbar.${item.label.toLowerCase()}`)}
                {item.children && (
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      activeMenu === item.label ? 'transform rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              {item.children && activeMenu === item.label && (
                <div className="pl-6 py-2 space-y-1 bg-gray-50">
                  {item.children.map(child => (
                    <Link
                      key={child.label}
                      to={child.href}
                      onClick={closeMenu}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-500"
                    >
                      <NavIcon
                        name={child.icon}
                        className="h-4 w-4 shrink-0 text-primary-600"
                      />
                      <span>
                        {child.labelKey ? t(child.labelKey) : child.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/search"
            onClick={closeMenu}
            className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            <Search className="h-4 w-4 mr-2" />
            {t('navbar.search')}
          </Link>
          <Link
            to="/about"
            onClick={closeMenu}
            className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            <Info className="h-4 w-4 mr-2" />
            {t('navbar.about')}
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            <Mail className="h-4 w-4 mr-2" />
            {t('navbar.contact')}
          </Link>
          <Link
            to="/hotlines"
            onClick={closeMenu}
            className="flex items-center px-4 py-2 text-base font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Phone className="h-4 w-4 mr-2" />
            {t('navbar.hotlines')}
          </Link>
          {SHOW_LANGUAGE_SWITCHER && (
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-800 mr-2" />
                <select
                  value={i18n.language}
                  onChange={e => changeLanguage(e.target.value as LanguageType)}
                  aria-label={t('navbar.selectLanguage', 'Select language')}
                  className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 hover:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
                >
                  {AVAILABLE_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
