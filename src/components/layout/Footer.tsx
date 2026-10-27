import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { footerNavigation } from '../../data/navigation';
import { Link } from 'react-router';
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
    <footer className="mt-auto bg-kapwa-brand-950 text-neutral-300">
      <div className="container-gov pt-14 pb-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-sm">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/Better.png"
                  alt={t('footer.logoAlt')}
                  className="h-10 w-10 mr-3"
                />

                <div>
                  <div className="font-black tracking-tight leading-none text-2xl text-white">
                    Better
                    <span className="text-kapwa-yellow-400">Koronadal</span>
                    <span className="text-kapwa-red-500">.</span>
                  </div>
                  <div className="mt-1 text-xs text-neutral-400">
                    {t('footer.tagline')}
                  </div>
                </div>
              </div>
              <p className="text-[15px] leading-snug text-neutral-300 mb-5">
                <Trans
                  i18nKey="footer.description"
                  components={{
                    strong: <strong className="text-white" />,
                    gov: (
                      <a
                        href="https://koronadal.gov.ph"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                      />
                    ),
                  }}
                />
              </p>
              <div className="flex gap-2">
                {footerNavigation.socialLinks.map(link => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="inline-flex h-9 w-9 items-center justify-center border border-white/30 text-white hover:border-white hover:bg-white hover:text-kapwa-brand-950 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getSocialIcon(link.label)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {footerNavigation.mainSections.map(section => (
            <div key={section.title}>
              <h3 className="eyebrow text-neutral-400 pb-3 border-b border-white/15">
                {t(section.titleKey, section.title)}
              </h3>
              <ul className="mt-3 space-y-2 text-[15px]">
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
                          className="text-neutral-200 hover:text-white transition-colors"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-neutral-200 hover:text-white transition-colors"
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

        <div className="border-t border-white/15 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6">
              <Link
                to="/about"
                className="text-neutral-200 hover:text-white transition-colors"
              >
                {t('navbar.about')}
              </Link>
              <Link
                to="/contact"
                className="text-neutral-200 hover:text-white transition-colors"
              >
                {t('navbar.contact')}
              </Link>
              <Link
                to="/hotlines"
                className="text-neutral-200 hover:text-white transition-colors"
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
