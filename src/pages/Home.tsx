import Hero from '../components/sections/Hero';
import WeatherWidget from '../components/home/WeatherWidget';
import EarthquakeWidget from '../components/home/EarthquakeWidget';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import Section from '../components/ui/Section';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="BetterKoronadal.org is an independent, community-built portal that makes information and services for the City of Koronadal easier to find. Not the official city website."
        keywords="BetterKoronadal.org, Koronadal, Marbel, South Cotabato, SOCCSKSARGEN, community portal, unofficial, city services, hotlines"
      />
      <main className="flex-grow">
        <Hero />
        <Section className="bg-gray-50">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <WeatherWidget />
            <EarthquakeWidget />
          </div>
        </Section>
        <ServicesSection />
        <GovernmentActivitySection />
      </main>
    </>
  );
};

export default Home;
