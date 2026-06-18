import React, { useState } from 'react';
import { X, Menu, ChevronDown, Globe, Search } from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import type { LanguageType } from '../../types/index';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n/languages';

// Toggle to re-enable the language switcher once translations are ready.
const SHOW_LANGUAGE_SWITCHER = false;

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
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar with language switcher and additional links */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 flex justify-end items-center h-10">
          <div className="flex items-center space-x-4">
            <Link
              to="/hotlines"
              className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              🚨 Hotlines
            </Link>
            <Link
              to="/about"
              className="text-xs text-gray-800 hover:text-primary-600 transition-colors"
            >
              About the City
            </Link>
            <Link
              to="/tourism"
              className="text-xs text-gray-800 hover:text-primary-600 transition-colors"
            >
              Visit
            </Link>
            <a
              href="https://southcotabato.gov.ph"
              className="text-xs text-gray-800 hover:text-primary-600 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              South Cotabato
            </a>
            <a
              href="https://www.gov.ph"
              className="text-xs text-gray-800 hover:text-primary-600 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              Official Gov.ph
            </a>
            <a
              href="https://koronadal.gov.ph"
              className="text-xs text-gray-800 hover:text-primary-600 transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              Official Website
            </a>
            {SHOW_LANGUAGE_SWITCHER && (
              <div className="hidden md:block">
                <select
                  value={i18n.language}
                  onChange={e => changeLanguage(e.target.value as LanguageType)}
                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 hover:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
                >
                  {Object.entries(LANGUAGES).map(([code, lang]) => (
                    <option key={code} value={code}>
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
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/Better.png"
                alt="BetterKoronadal.org logo"
                className="h-12 w-12 mr-3"
              />
              <div>
                <div className="text-black font-bold">
                  {import.meta.env.VITE_GOVERNMENT_NAME}
                </div>
                <div className="text-xs text-gray-800">
                  {t('site_description')}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-8 pr-24">
            {mainNavigation.map(item => (
              <div key={item.label} className="relative group">
                <a
                  href={item.href}
                  className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  {t(`navbar.${item.label.replace(' ', '').toLowerCase()}`)}
                  {item.children && (
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-800 group-hover:text-primary-600 transition-colors" />
                  )}
                </a>
                {item.children && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[640px] max-w-[92vw] opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <span className="text-sm font-semibold text-gray-900">
                          {t(
                            `navbar.${item.label
                              .replace(' ', '')
                              .toLowerCase()}`
                          )}
                        </span>
                        <Link
                          to={item.href}
                          className="text-xs font-medium text-primary-600 hover:text-primary-700"
                        >
                          View all &rarr;
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
                            className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                            role="menuitem"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/search"
              className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              <Search className="h-4 w-4 mr-1" />
              Search
            </Link>
            <Link
              to="/about"
              className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/hotlines"
              className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Hotlines
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
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
        <div className="container mx-auto px-2 pt-2 pb-4 space-y-1 border-t border-gray-200 bg-white">
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-500"
                    >
                      {child.label}
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
            Search
          </Link>
          <Link
            to="/about"
            onClick={closeMenu}
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            Contact
          </Link>
          <Link
            to="/hotlines"
            onClick={closeMenu}
            className="block px-4 py-2 text-base font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            🚨 Hotlines
          </Link>
          {SHOW_LANGUAGE_SWITCHER && (
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-800 mr-2" />
                <select
                  value={i18n.language}
                  onChange={e => changeLanguage(e.target.value as LanguageType)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 hover:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
                >
                  {Object.entries(LANGUAGES).map(([code, lang]) => (
                    <option key={code} value={code}>
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
