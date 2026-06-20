import { useTranslation } from 'react-i18next';
import Hero from '../components/sections/Hero';
import WeatherWidget from '../components/home/WeatherWidget';
import EarthquakeWidget from '../components/home/EarthquakeWidget';
import ForexWidget from '../components/home/ForexWidget';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.home.seoTitle')}
        description={t('pages.home.seoDescription')}
        keywords={t('pages.home.seoKeywords')}
      />
      <main className="flex-grow">
        <Hero />
        <Section className="bg-gray-50">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <WeatherWidget />
            <EarthquakeWidget />
          </div>
          <div className="mt-8">
            <ForexWidget />
          </div>
        </Section>
        <ServicesSection />
        <GovernmentActivitySection />
      </main>
    </>
  );
};

export default Home;
