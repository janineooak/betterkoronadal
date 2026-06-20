import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Phone, Siren, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Hotline {
  name: string;
  numbers: string[];
  note?: string;
}

const cityHotlines: Hotline[] = [
  {
    name: 'Korona-911 — City Emergency Hotline',
    numbers: ['911', '(083) 228-2448', '(083) 310-3000', '(083) 310-2000'],
    note: 'Operated by the City Disaster Risk Reduction & Management Office (CDRRMO) for police, fire, medical, and rescue dispatch. Trunk lines 310-2000 to 310-2005 also reach the operations center.',
  },
  {
    name: 'CDRRMO Operations Center',
    numbers: ['(083) 228-2438', '0920 593 2201', '0917 879 5347'],
    note: 'City Disaster Risk Reduction & Management Office — disaster response and rescue coordination.',
  },
  {
    name: 'CHO Command Center — City Health Office',
    numbers: ['0947 229 9858', '0995 615 2357'],
    note: 'Medical emergencies and health concerns.',
  },
  {
    name: 'Koronadal City Police Station (PNP)',
    numbers: ['0949 706 9194', '(083) 228-5349'],
    note: 'Barangay Zone IV, City of Koronadal. Email: sckcpsa@gmail.com',
  },
  {
    name: 'Bureau of Fire Protection (BFP) Koronadal',
    numbers: ['160', '(083) 228-5519', '0919 363 5141'],
    note: 'Fire and rescue emergencies.',
  },
  {
    name: "Mayor's Office",
    numbers: ['(083) 228-5110'],
    note: 'Office of the City Mayor.',
  },
  {
    name: 'City Government of Koronadal — Trunkline',
    numbers: ['(083) 228-6095'],
    note: 'For city hall offices and general concerns. Ask the operator to connect you to a specific office.',
  },
];

// 24-hour Barangay Health Emergency Response Teams (BHERT), one per barangay.
const barangayHotlines: Hotline[] = [
  { name: 'Assumption', numbers: ['0907 370 9466', '0909 637 1650'] },
  {
    name: 'Avanceña',
    numbers: [
      '(083) 228-1500',
      '0912 643 6000',
      '0905 867 9675',
      '0945 110 3096',
    ],
  },
  { name: 'Cacub', numbers: ['0948 083 4469'] },
  {
    name: 'Caloocan',
    numbers: ['0912 540 6075', '0905 095 1321', '0977 676 9250'],
  },
  { name: 'Carpenter Hill', numbers: ['(083) 228-5810', '0906 387 1375'] },
  {
    name: 'Concepcion',
    numbers: ['(083) 228-1570', '0950 195 2561', '0966 732 4405'],
  },
  {
    name: 'Esperanza',
    numbers: ['0920 198 2743', '0916 870 1501', '0926 859 4228'],
  },
  {
    name: 'Gen. Paulino Santos (GPS)',
    numbers: [
      '(083) 228-2254',
      '0921 248 3339',
      '0920 808 6913',
      '0923 444 6864',
    ],
  },
  { name: 'Mabini', numbers: ['0998 569 8986', '0912 446 4428'] },
  { name: 'Magsaysay', numbers: ['0907 114 4523', '0912 270 6267'] },
  {
    name: 'Mambucal',
    numbers: ['0921 725 3809', '0921 534 4514', '0929 958 7499'],
  },
  {
    name: 'Morales',
    numbers: ['(083) 228-1306', '0928 559 0170', '0935 679 4204'],
  },
  {
    name: 'Namnama',
    numbers: [
      '0946 924 5452',
      '0926 999 5863',
      '0909 265 8730',
      '0918 299 4575',
    ],
  },
  {
    name: 'New Pangasinan',
    numbers: ['(083) 228-7974', '0910 732 8073', '0948 290 3268'],
  },
  {
    name: 'Paraiso',
    numbers: [
      '(083) 228-3250',
      '0918 588 6028',
      '0950 542 4981',
      '0926 815 3433',
    ],
  },
  {
    name: 'Rotonda',
    numbers: ['0956 036 3245', '0930 175 0441', '0917 163 9874'],
  },
  {
    name: 'San Isidro',
    numbers: [
      '(083) 552-3764',
      '0950 156 6046',
      '0907 659 0454',
      '0930 494 2637',
    ],
  },
  {
    name: 'San Jose',
    numbers: ['(083) 228-1450', '0938 369 6159', '0929 768 7452'],
  },
  {
    name: 'San Roque',
    numbers: ['0907 478 1626', '0956 607 7835', '0910 324 1261'],
  },
  {
    name: 'Saravia',
    numbers: [
      '(083) 228-5123',
      '0935 693 1088',
      '0907 230 5003',
      '0910 326 2944',
    ],
  },
  {
    name: 'Sta. Cruz',
    numbers: ['(083) 228-1250', '0910 286 0148', '0909 581 6659'],
  },
  {
    name: 'Sto. Niño',
    numbers: ['(083) 228-1963', '0998 950 6318', '0919 447 8183'],
  },
  {
    name: 'Topland',
    numbers: [
      '(083) 228-1550',
      '0910 287 0782',
      '0936 368 4238',
      '0917 777 2375',
      '0916 404 5475',
      '0967 635 8214',
    ],
  },
  {
    name: 'Zone I',
    numbers: ['(083) 877-2067', '0933 972 4009', '0926 722 2866'],
  },
  { name: 'Zone II', numbers: ['0909 124 5964', '0956 946 1218'] },
  {
    name: 'Zone III',
    numbers: [
      '(083) 553-0724',
      '0905 376 2212',
      '0912 635 2877',
      '0912 379 9391',
    ],
  },
  { name: 'Zone IV', numbers: ['(083) 228-4858', '0930 484 1439'] },
];

const nationalHotlines: Hotline[] = [
  {
    name: 'National Emergency Hotline',
    numbers: ['911'],
    note: 'Nationwide emergency hotline (police, fire, medical).',
  },
  {
    name: 'Philippine Red Cross',
    numbers: ['143'],
    note: 'Disaster response, blood services, and welfare assistance.',
  },
  {
    name: 'Department of Health (DOH)',
    numbers: ['1555'],
    note: 'National health concerns and information.',
  },
];

function HotlineCard({ hotline }: { hotline: Hotline }) {
  return (
    <Card className="h-full">
      <CardContent>
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 shrink-0 text-primary-600" />
          <div>
            <p className="font-semibold text-gray-900">{hotline.name}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {hotline.numbers.map(number => (
                <a
                  key={number}
                  href={`tel:${number.replace(/[^0-9+]/g, '')}`}
                  className="text-lg font-bold text-primary-700 underline"
                >
                  {number}
                </a>
              ))}
            </div>
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
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t('pages.hotlines.seoTitle')}
        description={t('pages.hotlines.seoDescription')}
        keywords={t('pages.hotlines.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.hotlines.breadcrumbHome'), href: '/' },
              {
                label: t('pages.hotlines.breadcrumbHotlines'),
                href: '/hotlines',
              },
            ]}
          />

          <Heading>{t('pages.hotlines.title')}</Heading>
          <p className="text-gray-600 mb-6 max-w-3xl">
            {t('pages.hotlines.introBefore')} <strong>Korona-911</strong>{' '}
            {t('pages.hotlines.introMiddle')} <strong>911</strong>.
          </p>

          {/* Prominent emergency banner */}
          <div className="mb-10 rounded-lg bg-red-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Siren className="h-8 w-8 shrink-0" />
              <div>
                <p className="text-sm uppercase tracking-wide opacity-90">
                  {t('pages.hotlines.cityEmergencyHotline')}
                </p>
                <a href="tel:911" className="text-3xl font-extrabold underline">
                  Korona-911
                </a>
              </div>
            </div>
          </div>

          {/* City hotlines */}
          <Heading level={2}>{t('pages.hotlines.cityOfKoronadal')}</Heading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-12">
            {cityHotlines.map(h => (
              <HotlineCard key={h.name} hotline={h} />
            ))}
          </div>

          {/* Barangay BHERT hotlines */}
          <Heading level={2}>{t('pages.hotlines.bhertTitle')}</Heading>
          <p className="text-gray-600 mb-6 max-w-3xl">
            {t('pages.hotlines.bhertIntro')}
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {barangayHotlines.map(h => (
              <HotlineCard key={h.name} hotline={h} />
            ))}
          </div>

          {/* National hotlines */}
          <Heading level={2}>{t('pages.hotlines.nationalHotlines')}</Heading>
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
                    {t('pages.hotlines.verifyTitle')}
                  </p>
                  <p className="mt-1">
                    {t('pages.hotlines.verifyBefore')}{' '}
                    <strong>Korona-911</strong>{' '}
                    {t('pages.hotlines.verifyTrunkline')}{' '}
                    <a
                      href="tel:+63832286095"
                      className="text-primary-600 underline"
                    >
                      (083) 228-6095
                    </a>{' '}
                    {t('pages.hotlines.verifyMiddle')}{' '}
                    <a
                      href="https://facebook.com/CityGovernmentofKoronadal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 underline"
                    >
                      {t('pages.hotlines.facebookPage')}
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
