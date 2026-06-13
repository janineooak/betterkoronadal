import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { footerNavigation } from '../../data/navigation';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/Better.png"
                alt="BetterKoronadal.org logo"
                className="h-12 w-12 mr-3"
              />

              <div>
                <div className="font-bold">{t('site_name')}</div>
                <div className="text-xs text-gray-400">
                  Community Portal · Unofficial
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              An independent, community-built portal that makes information and
              services for the City of Koronadal easier to find.{' '}
              <strong className="text-gray-300">
                Not affiliated with, operated by, or endorsed by the City
                Government of Koronadal.
              </strong>{' '}
              The official city website is{' '}
              <a
                href="https://koronadal.gov.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                koronadal.gov.ph
              </a>
              .
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

          {footerNavigation.mainSections.map(section => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
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
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/hotlines"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Hotlines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
