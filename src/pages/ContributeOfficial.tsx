import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import SEO from '../components/SEO';
import { submitContribution, type ContributionInput } from '../lib/registryApi';

const KINDS: { value: ContributionInput['kind']; key: string }[] = [
  { value: 'edit', key: 'kindEdit' },
  { value: 'new_person', key: 'kindNewPerson' },
  { value: 'court_case', key: 'kindCourtCase' },
  { value: 'correction', key: 'kindCorrection' },
  { value: 'other', key: 'kindOther' },
];

const ContributeOfficial: React.FC = () => {
  const { t } = useTranslation();
  const [kind, setKind] = useState<ContributionInput['kind']>('edit');
  const [personName, setPersonName] = useState('');
  const [note, setNote] = useState('');
  const [sources, setSources] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const reset = () => {
    setKind('edit');
    setPersonName('');
    setNote('');
    setSources('');
    setSubmitterName('');
    setSubmitterEmail('');
    setDone(false);
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await submitContribution({
      kind,
      personName: personName.trim(),
      note: note.trim(),
      payload: {
        sources: sources
          .split(/\s+/)
          .map(s => s.trim())
          .filter(Boolean),
      },
      submitterName: submitterName.trim() || undefined,
      submitterEmail: submitterEmail.trim() || undefined,
    });
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.error || 'Failed.');
  };

  const field =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';
  const sensitive = kind === 'court_case';

  return (
    <>
      <SEO title={t('pages.contribute.title')} />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.registry.breadcrumbHome'), href: '/' },
              { label: t('pages.registry.title'), href: '/officials' },
              {
                label: t('pages.contribute.breadcrumb'),
                href: '/officials/contribute',
              },
            ]}
          />

          <Heading>{t('pages.contribute.title')}</Heading>
          <p className="mt-2 max-w-2xl text-gray-600">
            {t('pages.contribute.intro')}
          </p>

          {done ? (
            <div className="mt-8 max-w-2xl rounded-lg border border-green-200 bg-green-50 p-6">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                <p className="font-semibold">
                  {t('pages.contribute.successTitle')}
                </p>
              </div>
              <p className="mt-2 text-sm text-green-900">
                {t('pages.contribute.successBody')}
              </p>
              <div className="mt-4 flex gap-4 text-sm">
                <button onClick={reset} className="text-primary-700 underline">
                  {t('pages.contribute.submitAnother')}
                </button>
                <Link to="/officials" className="text-primary-700 underline">
                  {t('pages.contribute.backToRegistry')}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  {t('pages.contribute.kindLabel')}
                </label>
                <select
                  value={kind}
                  onChange={e =>
                    setKind(e.target.value as ContributionInput['kind'])
                  }
                  className={field}
                >
                  {KINDS.map(k => (
                    <option key={k.value} value={k.value}>
                      {t(`pages.contribute.${k.key}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  {t('pages.contribute.personNameLabel')}
                </label>
                <input
                  required
                  value={personName}
                  onChange={e => setPersonName(e.target.value)}
                  placeholder={t('pages.contribute.personNamePlaceholder')}
                  className={field}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  {t('pages.contribute.detailsLabel')}
                </label>
                <textarea
                  required
                  rows={5}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder={t('pages.contribute.detailsPlaceholder')}
                  className={field}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  {t('pages.contribute.sourcesLabel')}
                  {sensitive && <span className="text-red-600"> *</span>}
                </label>
                <textarea
                  required={sensitive}
                  rows={2}
                  value={sources}
                  onChange={e => setSources(e.target.value)}
                  placeholder={t('pages.contribute.sourcesPlaceholder')}
                  className={field}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800">
                    {t('pages.contribute.submitterNameLabel')}
                  </label>
                  <input
                    value={submitterName}
                    onChange={e => setSubmitterName(e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800">
                    {t('pages.contribute.submitterEmailLabel')}
                  </label>
                  <input
                    type="email"
                    value={submitterEmail}
                    onChange={e => setSubmitterEmail(e.target.value)}
                    className={field}
                  />
                </div>
              </div>

              <p className="flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                {t('pages.contribute.disclaimer')}
              </p>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {busy
                  ? t('pages.contribute.submitting')
                  : t('pages.contribute.submit')}
              </button>
            </form>
          )}
        </Section>
      </main>
    </>
  );
};

export default ContributeOfficial;
