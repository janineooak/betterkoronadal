import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Clock, Siren } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const mapsQuery = encodeURIComponent(
    'Koronadal City Hall, Brgy. Zone III, Koronadal City, South Cotabato'
  );

  return (
    <>
      <SEO
        title={t('pages.contact.seoTitle')}
        description={t('pages.contact.seoDescription')}
        keywords={t('pages.contact.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.contact.breadcrumbHome'), href: '/' },
              { label: t('pages.contact.breadcrumbContact'), href: '/contact' },
            ]}
          />

          <Heading>{t('pages.contact.title')}</Heading>
          <p className="text-gray-600 mb-8 max-w-3xl">
            {t('pages.contact.introBefore')}{' '}
            <Link to="/hotlines" className="text-primary-600 underline">
              {t('pages.contact.introHotlinesLink')}
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
                      <p className="font-semibold text-gray-900">
                        {t('pages.contact.cityHallLabel')}
                      </p>
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
                      <p className="font-semibold text-gray-900">
                        {t('pages.contact.trunklineLabel')}
                      </p>
                      <a
                        href="tel:+63832286095"
                        className="text-sm text-primary-600 underline"
                      >
                        (083) 228-6095
                      </a>
                      <p className="mt-1 text-xs text-gray-500">
                        {t('pages.contact.trunklineNote')}
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
                      <p className="font-semibold text-gray-900">
                        {t('pages.contact.emailLabel')}
                      </p>
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
                        {t('pages.contact.facebookPageName')}
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
                        {t('pages.contact.officeHoursLabel')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('pages.contact.officeHoursValue')}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {t('pages.contact.officeHoursNote')}
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
                  title={t('pages.contact.mapTitle')}
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
                {t('pages.contact.openInMaps')}
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
                      {t('pages.contact.emergencyTitle')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('pages.contact.emergencyBefore')}{' '}
                      <strong>Korona-911</strong>{' '}
                      {t('pages.contact.emergencyMiddle')} <strong>911</strong>.{' '}
                      {t('pages.contact.emergencyAfter')}{' '}
                      <Link
                        to="/hotlines"
                        className="text-primary-600 underline"
                      >
                        {t('pages.contact.emergencyHotlinesLink')}
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
