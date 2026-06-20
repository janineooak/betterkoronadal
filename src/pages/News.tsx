import { useEffect, useRef, useState } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SEO from '../components/SEO';
import { Banner } from '@bettergov/kapwa/banner';
import { useTranslation } from 'react-i18next';

// The City Government's official Facebook page. Reference only — this is an
// independent, community-built portal and is not affiliated with the City.
const FACEBOOK_URL =
  import.meta.env.VITE_FACEBOOK_URL ||
  'https://facebook.com/CityGovernmentofKoronadal';

// Facebook's Page Plugin renders between 180px and 500px wide.
const MIN_WIDTH = 320;
const MAX_WIDTH = 500;
const PLUGIN_HEIGHT = 800;

const buildPluginSrc = (width: number) => {
  const params = new URLSearchParams({
    href: FACEBOOK_URL,
    tabs: 'timeline',
    width: String(width),
    height: String(PLUGIN_HEIGHT),
    smallheader: 'false',
    adapt_container_width: 'true',
    hide_cover: 'false',
    show_facepile: 'true',
  });
  return `https://www.facebook.com/plugins/page.php?${params.toString()}`;
};

const News: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(MAX_WIDTH);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const available = el.clientWidth;
      setWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, available)));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title={t('pages.news.seoTitle')}
        description={t('pages.news.seoDescription')}
        keywords={t('pages.news.seoKeywords')}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        <Newspaper className="h-8 w-8 mb-4 text-primary-600 rounded-md" />
        <Heading>{t('pages.news.heading')}</Heading>
        <Text className="text-gray-600 mb-6">{t('pages.news.intro')}</Text>

        <Banner
          type="info"
          title={t('pages.news.bannerTitle')}
          description={t('pages.news.bannerDescription')}
          icon
        />

        <div ref={containerRef} className="mt-6 flex flex-col items-center">
          <iframe
            title={t('pages.news.iframeTitle')}
            src={buildPluginSrc(width)}
            width={width}
            height={PLUGIN_HEIGHT}
            style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
            scrolling="no"
            frameBorder={0}
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            className="rounded-md bg-white"
          />

          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            {t('pages.news.viewOnFacebook')}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Section>
    </>
  );
};

export default News;
