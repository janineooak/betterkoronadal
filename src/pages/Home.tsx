import Hero from '../components/sections/Hero';
import WeatherWidget from '../components/home/WeatherWidget';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
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
        <WeatherWidget />
        <ServicesSection />
        <GovernmentActivitySection />
      </main>
    </>
  );
};

export default Home;
