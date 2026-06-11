import Hero from '../components/sections/Hero';
import ServicesSection from '../components/home/ServicesSection';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import SEO from '../components/SEO';

const Home: React.FC = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Official website of the City Government of Koronadal — capital of South Cotabato and regional center of SOCCSKSARGEN. Access city services, news, and information."
        keywords="Koronadal, City of Koronadal, Marbel, South Cotabato, SOCCSKSARGEN, city government, public services, permits, hotlines"
      />
      <main className="flex-grow">
        <Hero />
        <ServicesSection />
        <GovernmentActivitySection />
      </main>
    </>
  );
};

export default Home;
