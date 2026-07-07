import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';
import DynastySection from '../components/data/DynastySection';

interface Official {
  name: string;
  position: string;
  photo: string;
}

const executives: Official[] = [
  {
    name: 'Hon. Erlinda “Bing” Pabi-Araquil',
    position: 'City Mayor',
    photo: '/officials/araquil.png',
  },
  {
    name: 'Hon. Ma. Ester M. Catorce',
    position: 'City Vice Mayor · Presiding Officer',
    photo: '/officials/catorce.png',
  },
];

const councilors: Official[] = [
  {
    name: 'Hon. Maylene May S. Bascon-De Guzman',
    position: 'City Councilor',
    photo: '/officials/bascon-de-guzman.png',
  },
  {
    name: 'Hon. Edwin G. Abris',
    position: 'City Councilor',
    photo: '/officials/abris.png',
  },
  {
    name: 'Hon. Handel Dee R. Cadellino-Cubilo',
    position: 'City Councilor',
    photo: '/officials/cadellino-cubilo.png',
  },
  {
    name: 'Hon. Mark C. Lapidez',
    position: 'City Councilor',
    photo: '/officials/lapidez.png',
  },
  {
    name: 'Hon. Charene Kristelle C. Jumilla-Pama',
    position: 'City Councilor',
    photo: '/officials/jumilla-pama.png',
  },
  {
    name: 'Hon. Bernardo B. Hinay',
    position: 'City Councilor',
    photo: '/officials/hinay.png',
  },
  {
    name: 'Hon. John Rey P. Rodriguez',
    position: 'City Councilor',
    photo: '/officials/rodriguez.png',
  },
  {
    name: 'Hon. Ellen Grace N. Subere-Albios',
    position: 'City Councilor',
    photo: '/officials/subere-albios.png',
  },
  {
    name: 'Hon. Margarita D. Subaldo',
    position: 'City Councilor',
    photo: '/officials/subaldo.png',
  },
  {
    name: 'Hon. Suellen C. Ogena',
    position: 'City Councilor',
    photo: '/officials/ogena.png',
  },
];

const exOfficio: Official[] = [
  {
    name: 'Hon. Marvin Ian C. Gumbao',
    position: 'ABC President · Liga ng mga Barangay',
    photo: '/officials/gumbao.png',
  },
  {
    name: 'Hon. Delia P. Lawian',
    position: 'IP Mandatory Representative (IPMR)',
    photo: '/officials/lawian.png',
  },
  {
    name: 'Hon. Charles Ronn C. Trinidad',
    position: 'SK Federation President',
    photo: '/officials/trinidad.png',
  },
];

const OfficialCard: React.FC<{ official: Official; featured?: boolean }> = ({
  official,
  featured,
}) => (
  <Card className="h-full overflow-hidden">
    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
      <img
        src={official.photo}
        alt={official.name}
        loading="lazy"
        className="h-full w-full object-cover object-top"
      />
    </div>
    <CardContent>
      <p
        className={`font-semibold text-gray-900 ${
          featured ? 'text-lg' : 'text-base'
        }`}
      >
        {official.name}
      </p>
      <p className="mt-0.5 text-sm text-primary-600">{official.position}</p>
    </CardContent>
  </Card>
);

const CityOfficials: React.FC = () => {
  return (
    <>
      <SEO
        title="City Officials of Koronadal"
        description="Meet the elected officials of the City of Koronadal — Mayor Erlinda “Bing” Pabi-Araquil, Vice Mayor Ma. Ester M. Catorce, and the members of the Sangguniang Panlungsod (City Council) for the 2025–2028 term."
        keywords="Koronadal city officials, Koronadal mayor, vice mayor, Sangguniang Panlungsod, city councilors, Koronadal directory"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Government', href: '/government/departments' },
              {
                label: 'City Officials',
                href: '/government/city-officials',
              },
            ]}
          />

          <Heading>City Officials of Koronadal</Heading>
          <p className="text-gray-600 mb-12 max-w-3xl">
            Meet the elected leaders of the <strong>City of Koronadal</strong> —
            the City Mayor, the Vice Mayor, and the members of the{' '}
            <strong>Sangguniang Panlungsod (City Council)</strong> for the{' '}
            <strong>2025&ndash;2028 term</strong>.
          </p>

          {/* Executive */}
          <Heading level={2}>Office of the City Mayor</Heading>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl mb-12">
            {executives.map(official => (
              <OfficialCard key={official.name} official={official} featured />
            ))}
          </div>

          {/* Council */}
          <Heading level={2}>Sangguniang Panlungsod (City Council)</Heading>
          <p className="text-gray-600 mb-6 max-w-3xl">
            The ten regular members of the City Council, elected by the people
            of Koronadal.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-12">
            {councilors.map(official => (
              <OfficialCard key={official.name} official={official} />
            ))}
          </div>

          {/* Ex-officio */}
          <Heading level={2}>Ex-Officio Members</Heading>
          <p className="text-gray-600 mb-6 max-w-3xl">
            Representing the barangays, indigenous peoples, and the youth of
            Koronadal.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-12">
            {exOfficio.map(official => (
              <OfficialCard key={official.name} official={official} />
            ))}
          </div>

          {/* Independent political-family analysis (BetterGov open data) */}
          <DynastySection />

          {/* Links */}
          <Heading level={2}>Learn More</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl">
            <Link to="/government/departments/executive">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    Office of the City Mayor
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    The Mayor&rsquo;s mandate, programs, and how to reach the
                    office.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/government/departments/legislative">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    Sangguniang Panlungsod
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    The City Council&rsquo;s mandate, sessions, and contact
                    details.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/government/departments">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    Departments &amp; Offices
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    The offices that deliver the city&rsquo;s services.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: 'City Government of Koronadal — City Officials',
                href: 'https://koronadal.gov.ph/city-officials/',
                note: 'Names, positions, and official photographs',
              },
            ]}
          />
          <p className="mt-4 text-xs text-gray-500 max-w-3xl">
            Official photographs are courtesy of the City Government of
            Koronadal. Elected and ex-officio members should be re-verified
            after each election or change in leadership.
          </p>
        </Section>
      </main>
    </>
  );
};

export default CityOfficials;
