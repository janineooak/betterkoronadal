import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Phone, Siren, Info } from 'lucide-react';

interface Hotline {
  name: string;
  number: string;
  note?: string;
}

const cityHotlines: Hotline[] = [
  {
    name: 'Korona-911 — City Emergency Hotline',
    number: '911',
    note: 'Operated by the City Disaster Risk Reduction & Management Office (CDRRMO) for police, fire, medical, and rescue dispatch.',
  },
  {
    name: 'City Government of Koronadal — Trunkline',
    number: '(083) 228-6095',
    note: 'For city hall offices and general concerns. Ask the operator to connect you to a specific office.',
  },
];

const nationalHotlines: Hotline[] = [
  {
    name: 'National Emergency Hotline',
    number: '911',
    note: 'Nationwide emergency hotline (police, fire, medical).',
  },
  {
    name: 'Philippine Red Cross',
    number: '143',
    note: 'Disaster response, blood services, and welfare assistance.',
  },
  {
    name: 'Department of Health (DOH)',
    number: '1555',
    note: 'National health concerns and information.',
  },
];

function HotlineCard({ hotline }: { hotline: Hotline }) {
  const tel = hotline.number.replace(/[^0-9+]/g, '');
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 shrink-0 text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900">{hotline.name}</p>
            <a
              href={`tel:${tel}`}
              className="text-lg font-bold text-primary-700 underline"
            >
              {hotline.number}
            </a>
            {hotline.note && (
              <p className="mt-1 text-sm text-gray-600">{hotline.note}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Hotlines: React.FC = () => {
  return (
    <>
      <SEO
        title="Emergency Hotlines"
        description="Emergency hotlines for the City of Koronadal, including Korona-911 and the city government trunkline, plus national emergency numbers."
        keywords="Koronadal hotlines, Korona-911, Koronadal emergency, CDRRMO, South Cotabato emergency numbers"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Hotlines', href: '/hotlines' },
            ]}
          />

          <Heading>Emergency Hotlines</Heading>
          <p className="text-gray-600 mb-6 max-w-3xl">
            Keep these numbers handy. In a life-threatening emergency in
            Koronadal, call <strong>Korona-911</strong> or the national
            emergency number <strong>911</strong>.
          </p>

          {/* Prominent emergency banner */}
          <div className="mb-10 rounded-lg bg-red-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Siren className="h-8 w-8 shrink-0" />
              <div>
                <p className="text-sm uppercase tracking-wide opacity-90">
                  City Emergency Hotline
                </p>
                <a href="tel:911" className="text-3xl font-extrabold underline">
                  Korona-911
                </a>
              </div>
            </div>
          </div>

          {/* City hotlines */}
          <Heading level={2}>City of Koronadal</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-12">
            {cityHotlines.map(h => (
              <HotlineCard key={h.name} hotline={h} />
            ))}
          </div>

          {/* National hotlines */}
          <Heading level={2}>National Hotlines</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {nationalHotlines.map(h => (
              <HotlineCard key={h.name} hotline={h} />
            ))}
          </div>

          {/* Note about per-agency local numbers */}
          <Card className="border-l-4 border-amber-500">
            <CardContent>
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 shrink-0 text-amber-600" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">
                    Looking for a specific agency?
                  </p>
                  <p className="mt-1">
                    For direct lines to the{' '}
                    <strong>Koronadal City Police (PNP)</strong>,{' '}
                    <strong>Bureau of Fire Protection (BFP)</strong>, the{' '}
                    <strong>CDRRMO</strong>, or the{' '}
                    <strong>South Cotabato Provincial Hospital</strong>, call{' '}
                    <strong>Korona-911</strong> or the city trunkline{' '}
                    <a
                      href="tel:+63832286095"
                      className="text-primary-600 underline"
                    >
                      (083) 228-6095
                    </a>{' '}
                    and ask to be connected. The latest verified directory is
                    also posted on the city&rsquo;s official{' '}
                    <a
                      href="https://facebook.com/CityGovernmentofKoronadal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 underline"
                    >
                      Facebook page
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>
      </main>
    </>
  );
};

export default Hotlines;
