import { useTranslation } from 'react-i18next';
import Hero from '../components/sections/Hero';
import WeatherWidget from '../components/home/WeatherWidget';
import EarthquakeWidget from '../components/home/EarthquakeWidget';
import ForexWidget from '../components/home/ForexWidget';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import SectionHeader from '../components/ui/SectionHeader';
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
        {/* Civic content first — services and government activity are what
            most visitors come for. Live utility widgets (weather, earthquake,
            forex) follow below. */}
        <ServicesSection />
        <GovernmentActivitySection />
        <section className="container-gov pt-10 pb-20">
          <SectionHeader
            index="03"
            label={t('pages.home.liveDataEyebrow')}
            title={t('pages.home.liveDataTitle')}
            description={t('pages.home.liveDataDescription')}
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <WeatherWidget />
            <EarthquakeWidget />
          </div>
          <div className="mt-8">
            <ForexWidget />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
