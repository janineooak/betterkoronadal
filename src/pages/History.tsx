import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Landmark,
  Flag,
  Building2,
  Award,
  ScrollText,
} from 'lucide-react';

// Key milestones in the city's history. `era` colours the timeline marker.
const milestones = [
  {
    date: 'June 3, 1939',
    title: 'The Marbel Settlement District is created',
    body: 'Commonwealth Act No. 441 established the Marbel Settlement District, opening the wide cogon plains of the Koronadal Valley to organized resettlement.',
    icon: Sprout,
  },
  {
    date: 'January 10, 1940',
    title: 'The first pioneer settlers arrive',
    body: 'Jesus M. Larrabaster oversaw the district as landless farmers from Luzon and the Visayas were recruited and given land. The first batch of eighteen pioneer settlers later grew, with their families and dependents, to 846 people.',
    icon: Sprout,
  },
  {
    date: 'November 18, 1942',
    title: 'Wartime tragedy under Japanese occupation',
    body: 'When USAFFE soldiers attacked the Japanese garrison, the occupying forces retaliated with a massacre of civilians — one of the darkest chapters in the valley’s history during the Second World War.',
    icon: Flag,
  },
  {
    date: 'October 20, 1944',
    title: 'Liberation',
    body: 'American forces arrived as part of the liberation of Mindanao, ending the occupation and reopening the path to civil government.',
    icon: Flag,
  },
  {
    date: 'August 18, 1947',
    title: 'The Municipality of Koronadal is born',
    body: 'President Manuel Roxas signed Executive Order No. 82, creating the Municipality of Koronadal with the district of Marbel as its seat of government.',
    icon: Landmark,
  },
  {
    date: 'January 1, 1948',
    title: 'Municipal government begins operations',
    body: 'The new municipal government formally opened with a first-year budget of ₱30,000.',
    icon: Landmark,
  },
  {
    date: 'January 2, 1952',
    title: 'The first elected officials take oath',
    body: 'Atty. Hilario de Pedro Sr. was sworn in as the first elected Municipal Mayor, beginning the era of local democratic government.',
    icon: Landmark,
  },
  {
    date: 'July 18, 1966',
    title: 'Capital of South Cotabato',
    body: 'Republic Act No. 4849 created the Province of South Cotabato and designated Koronadal as its provincial capital.',
    icon: Landmark,
  },
  {
    date: 'August 16 – October 8, 2000',
    title: 'Koronadal becomes a city',
    body: 'President Joseph Estrada signed Republic Act No. 8803 on August 16, 2000; the people ratified it in a plebiscite on October 8, 2000, converting Koronadal into a component city of South Cotabato.',
    icon: Building2,
  },
  {
    date: 'March 30, 2004',
    title: 'Regional center of SOCCSKSARGEN',
    body: 'Executive Order No. 304, issued by President Gloria Macapagal Arroyo, designated Koronadal City as the regional center and seat of Region XII (SOCCSKSARGEN).',
    icon: Award,
  },
  {
    date: 'March 2024',
    title: 'Promoted to a First Class Component City',
    body: 'Under Republic Act No. 11964, Koronadal was reclassified from a Third Class to a First Class Component City, reflecting decades of growth in revenue and population.',
    icon: Award,
  },
  {
    date: 'March 9, 2026',
    title: 'A succession in leadership',
    body: 'Mayor Eliordo U. Ogena passed away in office. Vice Mayor Erlinda “Bing” Pabi-Araquil succeeded to the mayoralty, with Ma. Ester M. Catorce assuming the office of Vice Mayor.',
    icon: ScrollText,
  },
];

// The 18 pioneer settlers named in the official city history.
const pioneers = [
  'Teodorico Aguirre',
  'Melquiado Alegria',
  'Quintin Buenavides',
  'Pedro Cenal',
  'Fernando Dignadice',
  'Melchor Fabie',
  'Gregorio Forro',
  'Maximo Mamon',
  'Francisco Sioco',
  'Sofronio Somblingo',
  'Rizalino Tirado',
  'Antonio Velarde',
  'Santiago Cepillo',
  'Valeriano Elisan',
  'Alvaro Batilaran Sr.',
  'Leoncio Sueno',
  'Agustin Perez',
  'Julian Subere',
];

interface Mayor {
  years: string;
  name: string;
  note?: string;
}

// Municipal mayors, from the Marbel Settlement District to cityhood.
const municipalMayors: Mayor[] = [
  {
    years: '1940–1941',
    name: 'Jesus M. Larrabaster',
    note: 'Overseer of the Marbel Settlement District',
  },
  {
    years: '1941–1943',
    name: 'Bai Luma Panat',
    note: 'First Municipal District Mayor',
  },
  { years: '1943–1947', name: 'Sergio B. Morales' },
  {
    years: '1947–1951',
    name: 'Kudanding I. Kamsa',
    note: 'First mayor of the new Municipality of Koronadal (EO 82)',
  },
  {
    years: '1951–1959',
    name: 'Hilario de Pedro Sr.',
    note: 'First elected Municipal Mayor',
  },
  { years: '1959–1963', name: 'Arturo Rojas Sr.' },
  {
    years: '1963–1972',
    name: 'Frederico M. Dizon Sr.',
    note: 'Koronadal named capital of South Cotabato (1966)',
  },
  { years: '1972–1975', name: 'Gerardo T. Calaliman' },
  { years: '1975–1986', name: 'Ismael D. Sueno' },
  { years: '1986–1988', name: 'Hilario L. de Pedro III' },
  {
    years: '1988–1998',
    name: 'Fernando Q. Miguel',
    note: 'Last mayor before cityhood',
  },
];

// City mayors, from the conversion to a city in 2000 to the present.
const cityMayors: Mayor[] = [
  {
    years: '1998–2001',
    name: 'Vicente R. de Jesus',
    note: 'First City Mayor of Koronadal',
  },
  {
    years: '2001–2007',
    name: 'Fernando Q. Miguel',
    note: 'Koronadal designated regional center of SOCCSKSARGEN (2004)',
  },
  { years: '2007–2010', name: 'Vicente R. de Jesus' },
  { years: '2010–2019', name: 'Peter B. Miguel' },
  {
    years: '2019–2026',
    name: 'Eliordo U. Ogena',
    note: 'Passed away in office, March 9, 2026',
  },
  {
    years: '2026–present',
    name: 'Erlinda “Bing” Pabi-Araquil',
    note: 'Incumbent; succeeded as Vice Mayor',
  },
];

const MayorList: React.FC<{ mayors: Mayor[] }> = ({ mayors }) => (
  <ol className="relative space-y-6 border-l-2 border-gray-200 pl-6">
    {mayors.map((mayor, i) => (
      <li key={`${mayor.name}-${i}`} className="relative">
        <span className="absolute -left-[1.95rem] top-1 h-3 w-3 rounded-full border-2 border-primary-500 bg-white" />
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
          {mayor.years}
        </p>
        <p className="text-base font-semibold text-gray-900">{mayor.name}</p>
        {mayor.note && <p className="text-sm text-gray-600">{mayor.note}</p>}
      </li>
    ))}
  </ol>
);

const History: React.FC = () => {
  return (
    <>
      <SEO
        title="History of the City of Koronadal"
        description="The history of Koronadal — from the Marbel Settlement District of 1939 and its eighteen pioneer settlers, through municipality and cityhood, to the present day — including a complete timeline of the city's mayors."
        keywords="Koronadal history, Marbel, Marbel Settlement District, Koronadal mayors, RA 8803 cityhood, South Cotabato capital, SOCCSKSARGEN regional center"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'City History', href: '/history' },
            ]}
          />

          <Heading>History of the City of Koronadal</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            From the wide cogon plains that gave it its name to its place today
            as the regional center of SOCCSKSARGEN, the story of{' '}
            <strong>Koronadal</strong> — long known as <strong>Marbel</strong> —
            is the story of settlers who turned a frontier valley into the{' '}
            <em>&ldquo;Hub of the South.&rdquo;</em>
          </p>

          {/* Etymology */}
          <Heading level={2} className="mt-12">
            What&rsquo;s in a Name
          </Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-3xl mb-12">
            <Card className="h-full border-t-4 border-primary-500">
              <CardContent>
                <p className="text-lg font-semibold text-gray-900">Koronadal</p>
                <p className="mt-1 text-sm text-gray-600">
                  From the Blaan words <em>koron</em> (or <em>kalon</em>),
                  meaning cogon grass, and <em>nadal</em> or <em>datal</em>,
                  meaning a wide plain — a name drawn straight from the
                  valley&rsquo;s landscape.
                </p>
              </CardContent>
            </Card>
            <Card className="h-full border-t-4 border-primary-500">
              <CardContent>
                <p className="text-lg font-semibold text-gray-900">Marbel</p>
                <p className="mt-1 text-sm text-gray-600">
                  The older name for the area, from a Blaan word for{' '}
                  <em>murky</em> or <em>muddy waters</em>, after the river that
                  runs through the plain. Many residents still call the city
                  Marbel today.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Heading level={2}>A Timeline of the City</Heading>
          <p className="text-gray-600 mb-8 max-w-3xl">
            The milestones that shaped Koronadal — from settlement district, to
            municipality, to city.
          </p>
          <ol className="relative max-w-3xl space-y-8 border-l-2 border-gray-200 pl-8 mb-12">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              return (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.6rem] flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-500 bg-white">
                    <Icon className="h-4 w-4 text-primary-600" />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                    {m.date}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {m.title}
                  </p>
                  <p className="text-gray-700">{m.body}</p>
                </li>
              );
            })}
          </ol>

          {/* Pioneer settlers */}
          <Heading level={2}>The Eighteen Pioneer Settlers</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            The first batch of pioneers who broke ground in the Marbel
            Settlement District in 1940. From this handful, the community grew
            to 846 people — the seed of the city Koronadal would become.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 mb-12">
            {pioneers.map(name => (
              <div
                key={name}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700"
              >
                {name}
              </div>
            ))}
          </div>

          {/* Mayors */}
          <Heading level={2}>The Mayors of Koronadal</Heading>
          <p className="text-gray-600 mb-8 max-w-3xl">
            A complete succession of those who have led Koronadal — from the
            overseers of the settlement district to the mayors of the city
            today.
          </p>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 mb-12">
            <div>
              <Heading level={4} className="!mb-1">
                Municipal Era
              </Heading>
              <p className="text-sm text-gray-500 mb-6">
                Marbel &amp; the Municipality of Koronadal, 1940&ndash;2000
              </p>
              <MayorList mayors={municipalMayors} />
            </div>
            <div>
              <Heading level={4} className="!mb-1">
                City Era
              </Heading>
              <p className="text-sm text-gray-500 mb-6">
                The City of Koronadal, 2000&ndash;present
              </p>
              <MayorList mayors={cityMayors} />
            </div>
          </div>
          <p className="text-xs text-gray-500 max-w-3xl mb-12">
            Note: terms of office in the earliest decades are drawn from the
            city&rsquo;s historical records and may be approximate. Several
            leaders served non-consecutive terms.
          </p>

          {/* Links */}
          <Heading level={2}>Learn More</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl">
            <Link to="/about">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">About the City</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Profile, vision, and the city&rsquo;s 27 barangays.
                  </p>
                </CardContent>
              </Card>
            </Link>
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
            <Link to="/tourism">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">Visit Koronadal</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Festivals, heritage, and places to see.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: 'City Government of Koronadal — City History',
                href: 'https://koronadal.gov.ph/city-history/',
                note: 'Settlement district, pioneer settlers, wartime history, cityhood',
              },
              {
                label: 'Koronadal, South Cotabato — Wikipedia',
                href: 'https://en.wikipedia.org/wiki/Koronadal',
                note: 'List of mayors and vice mayors; government history',
              },
              {
                label: 'Executive Order No. 82 (1947) — LawPhil',
                href: 'https://lawphil.net/executive/execord/eo1947/eo_82_1947.html',
                note: 'Creation of the Municipality of Koronadal',
              },
              {
                label: 'Republic Act No. 4849 (1966) — LawPhil',
                href: 'https://lawphil.net/statutes/repacts/ra1966/ra_4849_1966.html',
                note: 'Creation of South Cotabato; Koronadal as capital',
              },
              {
                label: 'Republic Act No. 8803 — Cityhood of Koronadal',
                href: 'https://lawphil.net/statutes/repacts/ra2000/ra_8803_2000.html',
                note: 'Conversion of Koronadal into a component city (2000)',
              },
            ]}
          />
        </Section>
      </main>
    </>
  );
};

export default History;
