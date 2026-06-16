import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import SourceNote from '../components/ui/SourceNote';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';
import {
  PartyPopper,
  Trees,
  Mountain,
  Landmark,
  Utensils,
  Waves,
  Droplets,
  Sprout,
  ShoppingBag,
  Church,
  Tent,
} from 'lucide-react';

interface Attraction {
  name: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

// Places in or right around Koronadal City.
const cityAttractions: Attraction[] = [
  {
    name: 'Koronadal City Plaza (Rizal Park)',
    description:
      'The central civic plaza in the heart of the city — a gathering place for events, evening strolls, and city celebrations.',
    Icon: Trees,
  },
  {
    name: 'South Cotabato Provincial Capitol',
    description:
      'The seat of the provincial government. Koronadal is the capital of South Cotabato and the regional center of SOCCSKSARGEN.',
    Icon: Landmark,
  },
  {
    name: 'South Cotabato Community Museum',
    description:
      'On the Capitol grounds, the provincial museum houses artifacts and crafts of the Blaan, T’boli, and settler communities that shaped the region.',
    Icon: Landmark,
  },
  {
    name: 'Kalon Barak Skyline Ridge',
    description:
      'An elevated viewpoint at roughly 2,375 ft offering panoramic views toward Mt. Matutum, Mt. Apo, and a sea of clouds on cool mornings — a favourite for sunrise and sunset.',
    Icon: Mountain,
  },
  {
    name: 'Paraiso Verde Resort & Water Park',
    description:
      'Billed as the largest recreational water park in the SOCCSKSARGEN region, with pools, slides, and accommodations for a family day out.',
    Icon: Waves,
  },
  {
    name: 'The Farm at Carpenter Hill',
    description:
      'A highland agri-tourism spot in Brgy. Carpenter Hill with pineapple plantations and farm views, a short drive from the city centre.',
    Icon: Sprout,
  },
  {
    name: 'KCC Mall of Marbel',
    description:
      'The city’s main shopping mall — local restaurants, regional produce like mangoes and tilapia, and SOCCSKSARGEN souvenirs.',
    Icon: ShoppingBag,
  },
  {
    name: 'Diocese of Marbel & city churches',
    description:
      'Koronadal is the seat of the Catholic Diocese of Marbel. Parish churches across the city anchor major religious feasts and patronal fiestas.',
    Icon: Church,
  },
  {
    name: 'Local markets & cuisine',
    description:
      'As the "Hub of the South," Koronadal is a trade center for South Cotabato — explore its public markets, agricultural produce, and Mindanao flavors.',
    Icon: Utensils,
  },
];

// Famous provincial spots that are outside the city but commonly visited from it.
const dayTrips: Attraction[] = [
  {
    name: 'Seven Falls & Zipline, Lake Sebu',
    description:
      'Lake Sebu’s crown jewel: seven cascading waterfalls and one of the highest zipline rides in the country, about a 1–1.5 hr drive from Koronadal.',
    Icon: Droplets,
  },
  {
    name: 'Lake Sebu',
    description:
      'A highland lake at ~1,000 m and the cultural home of the T’boli dreamweavers — known for tilapia, lotus blooms, and the T’boli Museum.',
    Icon: Waves,
  },
  {
    name: 'Lake Holon (Lake Maughan), T’boli',
    description:
      'A pristine crater lake on Mt. Melibingoy reached by a guided trek — turquoise waters, camping, and stargazing for more adventurous visitors.',
    Icon: Tent,
  },
];

const Tourism: React.FC = () => {
  return (
    <>
      <SEO
        title="Visit Koronadal"
        description="Discover the City of Koronadal (Marbel) — the Hinugyaw Festival, the City Plaza, Kalon Barak Skyline Ridge, museums, churches, and the culture of the 'Hub of the South' in South Cotabato."
        keywords="visit Koronadal, Koronadal tourism, Hinugyaw Festival, Araw ng Koronadal, Kalon Barak, things to do Koronadal, South Cotabato tourist spots, Marbel"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Visit Koronadal', href: '/tourism' },
            ]}
          />

          <Heading>Visit Koronadal</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            Known as the <strong>&ldquo;Hub of the South,&rdquo;</strong> the
            City of Koronadal — also called <strong>Marbel</strong> — blends the
            cultures of its Blaan first peoples, Mindanao settlers, and a lively
            urban center. As the capital of South Cotabato and the regional seat
            of SOCCSKSARGEN, it&rsquo;s a natural starting point for exploring
            the region.
          </p>

          {/* Signature festival */}
          <Heading level={2}>The Hinugyaw Festival</Heading>
          <div className="mb-12 max-w-3xl">
            <Card className="border-l-4 border-primary-500">
              <CardContent>
                <div className="flex items-start gap-3">
                  <PartyPopper className="h-7 w-7 shrink-0 text-primary-600" />
                  <div className="text-gray-700">
                    <p>
                      <strong>Hinugyaw</strong> means &ldquo;merrymaking&rdquo;
                      in the local dialect, and the{' '}
                      <strong>Hinugyaw Festival</strong> is the city&rsquo;s
                      signature celebration. Held around the{' '}
                      <strong>Araw ng Koronadal</strong> (the city&rsquo;s
                      founding anniversary), it fills the streets with colourful
                      street-dancing contingents, music, and tributes to the
                      city&rsquo;s pioneer settlers.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Dates can shift year to year — check the city&rsquo;s
                      official channels for the current schedule before planning
                      a trip.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Places & highlights */}
          <Heading level={2}>Places &amp; Highlights</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {cityAttractions.map(({ name, description, Icon }) => (
              <Card key={name} className="h-full">
                <CardContent>
                  <Icon className="h-6 w-6 text-primary-600 mb-2" />
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="mt-1 text-sm text-gray-600">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Day trips beyond the city */}
          <Heading level={2}>Day Trips from Koronadal</Heading>
          <p className="text-gray-600 mb-4 max-w-3xl">
            Koronadal is the gateway to South Cotabato&rsquo;s natural wonders.
            These famous spots are outside the city but easily reached on a day
            trip.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {dayTrips.map(({ name, description, Icon }) => (
              <Card key={name} className="h-full">
                <CardContent>
                  <Icon className="h-6 w-6 text-primary-600 mb-2" />
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="mt-1 text-sm text-gray-600">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Practical links */}
          <Heading level={2}>Plan Your Visit</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl">
            <Link to="/about">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">About the City</p>
                  <p className="mt-1 text-sm text-gray-600">
                    History, profile, and the 27 barangays.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/hotlines">
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    Emergency Hotlines
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Useful numbers to keep handy while you&rsquo;re here.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <a
              href="https://koronadal.gov.ph/culture/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card hoverable className="h-full border-t-4 border-primary-500">
                <CardContent>
                  <p className="font-semibold text-gray-900">
                    Official Culture Page
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Culture and heritage on koronadal.gov.ph.
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>

          <SourceNote
            verified="June 2026"
            sources={[
              {
                label: 'City Government of Koronadal — Culture',
                href: 'https://koronadal.gov.ph/culture/',
                note: 'Hinugyaw Festival, heritage sites, cultural values',
              },
              {
                label:
                  'Vigattin Tourism — Araw ng Koronadal "Hinugyaw Festival"',
                href: 'https://www.vigattintourism.com/tourism/articles/Araw-ng-Koronadal-Hinugayaw-Festival',
              },
              {
                label: 'Camella — Top Things to Do in Koronadal City',
                href: 'https://www.camella.com.ph/top-things-to-do-in-koronadal-city-south-cotabato-philippines/',
              },
              {
                label: 'Out of Town Blog — Top Things to Do in Koronadal City',
                href: 'https://outoftownblog.com/things-to-do-in-koronadal-city/',
              },
            ]}
          />
        </Section>
      </main>
    </>
  );
};

export default Tourism;
