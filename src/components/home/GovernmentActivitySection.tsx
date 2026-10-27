import SectionHeader from '../ui/SectionHeader';
import CategoryGrid from '../ui/CategoryGrid';
import { useTranslation } from '../../hooks/useTranslation';

import { governmentCategories } from '../../data/yamlLoader';

interface Category {
  category: string;
  slug: string;
  description: string;
  icon: string;
  href?: string;
}

interface GovernmentActivitySectionProps {
  title?: string;
  description?: string;
  index?: string;
}

export default function GovernmentActivitySection({
  title,
  description,
  index = '02',
}: GovernmentActivitySectionProps = {}) {
  const { t } = useTranslation();

  const categories = governmentCategories.categories as Category[];

  return (
    <section id="government" className="container-gov py-10">
      <SectionHeader
        index={index}
        label={t('governmentActivity.eyebrow')}
        title={title || t('governmentActivity.title')}
        description={description || t('governmentActivity.description')}
      />
      <CategoryGrid
        items={categories.map(c => ({
          key: c.slug,
          to: c.href ?? `/government/${c.slug}`,
          title: c.category,
          description: c.description,
          icon: c.icon,
        }))}
      />
    </section>
  );
}
