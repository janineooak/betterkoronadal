import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { footerNavigation } from '../../data/navigation';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  const getSocialIcon = (label: string) => {
    switch (label) {
      case 'Facebook':
        return <Facebook className="h-5 w-5" />;
      case 'Twitter':
        return <Twitter className="h-5 w-5" />;
      case 'Instagram':
        return <Instagram className="h-5 w-5" />;
      case 'YouTube':
        return <Youtube className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Footer links are mostly internal routes, but a few point to external
  // government portals. react-router's <Link> only handles in-app routes, so
  // external (http) links must render as a plain anchor.
  const isExternal = (href: string) => /^https?:\/\//.test(href);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="mb-10 max-w-2xl">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/Better.png"
                alt={t('footer.logoAlt')}
                className="h-12 w-12 mr-3"
              />

              <div>
                <div className="font-bold">{t('site_name')}</div>
                <div className="text-xs text-gray-400">
                  {t('footer.tagline')}
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              <Trans
                i18nKey="footer.description"
                components={{
                  strong: <strong className="text-gray-300" />,
                  gov: (
                    <a
                      href="https://koronadal.gov.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    />
                  ),
                }}
              />
            </p>
            <div className="flex space-x-4">
              {footerNavigation.socialLinks.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getSocialIcon(link.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerNavigation.mainSections.map(section => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">
                {t(section.titleKey, section.title)}
              </h3>
              <ul className="space-y-2">
                {section.links.map(link => {
                  const labelKey = (link as { labelKey?: string }).labelKey;
                  const label = labelKey ? t(labelKey) : link.label;
                  return (
                    <li key={link.label}>
                      {isExternal(link.href) ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6">
              <Link
                to="/about"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t('navbar.about')}
              </Link>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t('navbar.contact')}
              </Link>
              <Link
                to="/hotlines"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t('navbar.hotlines')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
