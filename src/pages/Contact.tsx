import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Clock, Siren } from 'lucide-react';

const Contact: React.FC = () => {
  const mapsQuery = encodeURIComponent(
    'Koronadal City Hall, Brgy. Zone III, Koronadal City, South Cotabato'
  );

  return (
    <>
      <SEO
        title="Contact the City Government of Koronadal"
        description="Public contact details for the City Government of Koronadal — City Hall address, trunkline, email, Facebook page, and office hours — compiled by betterKoronadal for residents' convenience."
        keywords="Koronadal city hall contact, Koronadal trunkline, Koronadal city government email, Koronadal address"
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: 'Home', href: '/' },
              { label: 'Contact', href: '/contact' },
            ]}
          />

          <Heading>Contact the City Government</Heading>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Below are the{' '}
            <strong>
              public contact details of the City Government of Koronadal
            </strong>
            , compiled here for your convenience. betterKoronadal is an
            independent community portal and cannot process city transactions on
            the city&rsquo;s behalf. For life-threatening emergencies, call the{' '}
            <Link to="/hotlines" className="text-primary-600 underline">
              city emergency hotlines
            </Link>
            .
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Contact details */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="h-full">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-6 w-6 shrink-0 text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">City Hall</p>
                      <p className="text-sm text-gray-600">
                        New City Hall Grounds, Purok Villegas, Brgy. Zone III,
                        Koronadal City, South Cotabato 9506
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Phone className="h-6 w-6 shrink-0 text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Trunkline</p>
                      <a
                        href="tel:+63832286095"
                        className="text-sm text-primary-600 underline"
                      >
                        (083) 228-6095
                      </a>
                      <p className="mt-1 text-xs text-gray-500">
                        Ask the operator to connect you to a specific city
                        office.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 shrink-0 text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a
                        href="mailto:info.koronadalcity@gmail.com"
                        className="text-sm text-primary-600 underline break-all"
                      >
                        info.koronadalcity@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Facebook className="h-6 w-6 shrink-0 text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Facebook</p>
                      <a
                        href="https://facebook.com/CityGovernmentofKoronadal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 underline"
                      >
                        City Government of Koronadal
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Clock className="h-6 w-6 shrink-0 text-primary-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Office Hours
                      </p>
                      <p className="text-sm text-gray-600">
                        Monday to Friday, 8:00 AM – 5:00 PM (except holidays)
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Some frontline services may follow a no-noon-break
                        schedule. Confirm with the office concerned.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="flex flex-col">
              <Card className="h-full overflow-hidden">
                <iframe
                  title="Map of Koronadal City Hall"
                  className="h-72 w-full border-0 lg:h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                />
              </Card>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm text-primary-600 underline"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Emergency callout */}
          <div className="mt-10">
            <Card className="border-l-4 border-red-500">
              <CardContent>
                <div className="flex items-start gap-3">
                  <Siren className="h-6 w-6 shrink-0 text-red-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      In an emergency
                    </p>
                    <p className="text-sm text-gray-600">
                      Call the city emergency hotline{' '}
                      <strong>Korona-911</strong> or dial the national emergency
                      number <strong>911</strong>. See the full list on the{' '}
                      <Link
                        to="/hotlines"
                        className="text-primary-600 underline"
                      >
                        Hotlines page
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>
      </main>
    </>
  );
};

export default Contact;
