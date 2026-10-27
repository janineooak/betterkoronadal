import SectionHeader from '../ui/SectionHeader';
import CategoryGrid from '../ui/CategoryGrid';
import { useTranslation } from '../../hooks/useTranslation';

import { getServiceCategories } from '../../data/yamlLoader';

interface Category {
  category: string;
  slug: string;
  description: string;
  icon: string;
}

export default function ServicesSection({
  title,
  description,
  index = '01',
}: {
  title?: string;
  description?: string;
  index?: string;
}) {
  const { t, i18n } = useTranslation();

  const categories = getServiceCategories(i18n.language)
    .categories as Category[];

  return (
    <section className="container-gov pt-16 pb-10">
      <SectionHeader
        index={index}
        label={t('services.eyebrow')}
        title={title || t('services.title')}
        description={description || t('services.description')}
        link={
          title
            ? undefined
            : { to: '/services', label: t('hero.viewAllServices') }
        }
      />
      <CategoryGrid
        items={categories.map(c => ({
          key: c.slug,
          to: `/services/${c.slug}`,
          title: c.category,
          description: c.description,
          icon: c.icon,
        }))}
      />
    </section>
  );
}
