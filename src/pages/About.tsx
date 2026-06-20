import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';
import { MapPin, Users, Landmark, CalendarDays } from 'lucide-react';

const quickFacts = [
  { label: 'Also known as', value: 'Marbel' },
  { label: 'Province', value: 'South Cotabato (capital)' },
  { label: 'Region', value: 'Region XII (SOCCSKSARGEN)' },
  { label: 'City classification', value: 'Component city' },
  { label: 'Population (2024)', value: '201,844' },
  { label: 'Land area', value: '277.00 km²' },
  { label: 'Barangays', value: '27' },
  { label: 'ZIP code', value: '9506' },
];

const barangays = [
  'Assumption',
  'Avanceña',
  'Cacub',
  'Caloocan',
  'Carpenter Hill',
  'Concepcion',
  'Esperanza',
  'General Paulino Santos',
  'Mabini',
  'Magsaysay',
  'Mambucal',
  'Morales',
  'Namnama',
  'New Pangasinan',
  'Paraiso',
  'Rotonda',
  'San Isidro',
  'San Jose',
  'San Roque',
  'Santa Cruz',
  'Santo Niño',
  'Sarabia',
  'Zone I',
  'Zone II',
  'Zone III',
  'Zone IV',
  'Zulueta',
];

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About the City of Koronadal"
        description="Learn about the City of Koronadal — also known as Marbel — the capital of South Cotabato and the regional center of SOCCSKSARGEN. History, profile, vision, and the city's 27 barangays."
        keywords="about Koronadal, Marbel, South Cotabato capital, SOCCSKSARGEN, Koronadal history, Koronadal barangays"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
            ]}
          />

          <Heading>About the City of Koronadal</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            The <strong>City of Koronadal</strong> — also known as{' '}
            <strong>Marbel</strong> — is the capital of the Province of{' '}
            <strong>South Cotabato</strong> and the regional center of{' '}
            <strong>SOCCSKSARGEN (Region XII)</strong>. Often called the{' '}
            <em>&ldquo;Hub of the South,&rdquo;</em> Koronadal is home to more
            than 201,000 residents across 27 barangays.
          </p>
          <p className="text-gray-600 mb-8 max-w-3xl">
            The city is guided by the vision{' '}
            <strong>
              &ldquo;One People, One Big Dream, One Koronadal!&rdquo;
            </strong>
          </p>

          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-12">
            {quickFacts.map(fact => (
              <Card key={fact.label} className="h-full">
                <CardContent>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {fact.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* History */}
          <Heading level={2}>History</Heading>
          <div className="max-w-3xl space-y-4 text-gray-700 mb-12">
            <p>
              The name <strong>Koronadal</strong> is believed to come from the
              Blaan words <em>&ldquo;koron&rdquo;</em> (or <em>kalon</em>),
              meaning cogon grass, and <em>&ldquo;nadal&rdquo;</em> or{' '}
              <em>datal</em>, meaning a wide plain — a reflection of the
              valley&rsquo;s original landscape.
            </p>
            <p>
              On <strong>August 18, 1947</strong>, President Manuel Roxas signed
              Executive Order No. 82 creating several municipalities in the old
              Cotabato province, including the municipality of{' '}
              <strong>Marbel</strong>. When the Province of South Cotabato was
              created under <strong>Republic Act No. 4849</strong> on July 18,
              1966, Koronadal was designated as its capital.
            </p>
            <p>
              Koronadal was converted into a <strong>component city</strong> by
              virtue of <strong>Republic Act No. 8803</strong> on{' '}
              <strong>October 8, 2000</strong>. Today it serves as the seat of
              the provincial government of South Cotabato and the regional
              center of SOCCSKSARGEN.
            </p>
            <p>
              <Link
                to="/history"
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                Read the full city history and the timeline of Koronadal&rsquo;s
                mayors &rarr;
              </Link>
            </p>
          </div>

          {/* At a glance icons */}
          <Heading level={2}>The City at a Glance</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <Card className="h-full">
              <CardContent>
                <Landmark className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-semibold text-gray-900">
                  Provincial capital
                </p>
                <p className="text-sm text-gray-600">
                  Seat of the South Cotabato provincial government.
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <MapPin className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-semibold text-gray-900">Regional center</p>
                <p className="text-sm text-gray-600">
                  Administrative hub of Region XII (SOCCSKSARGEN).
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <Users className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-semibold text-gray-900">201,844 residents</p>
                <p className="text-sm text-gray-600">
                  Based on the 2024 census by the PSA.
                </p>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardContent>
                <CalendarDays className="h-6 w-6 text-primary-600 mb-2" />
                <p className="font-semibold text-gray-900">Cityhood in 2000</p>
                <p className="text-sm text-gray-600">
                  Component city under RA 8803.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Barangays */}
          <Heading level={2}>The 27 Barangays</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            Koronadal is composed of 27 barangays. The most populous include
            General Paulino Santos, Santa Cruz, Santo Niño, Zone III, and
            Zulueta.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 mb-12">
            {barangays.map(name => (
              <div
                key={name}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Links */}
          <Heading level={2}>Learn More</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl">
            <Link to="/government/departments">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">City Government</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Meet the Mayor, Vice Mayor, and City Council.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/services">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">City Services</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Health, business, education, social welfare, and more.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/contact">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">Contact Us</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Reach the City Government of Koronadal.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: 'City Government of Koronadal — official website',
                href: 'https://koronadal.gov.ph',
                note: 'Profile, history, vision',
              },
              {
                label: 'Philippine Statistics Authority (PSA)',
                href: 'https://psa.gov.ph',
                note: '2024 census (201,844); 2020 census (195,398); land area',
              },
              {
                label: 'Koronadal, South Cotabato — Wikipedia',
                href: 'https://en.wikipedia.org/wiki/Koronadal',
                note: 'History: EO 82 (1947), RA 4849 (1966), RA 8803 (2000)',
              },
            ]}
          />
        </Section>
      </main>
    </>
  );
};

export default About;
