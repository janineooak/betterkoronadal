import Section from '../components/ui/Section';
import { useParams, Link } from 'react-router-dom';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import {
  governmentCategories,
  getCategorySubcategories,
  type Subcategory,
  type CategoryIndex,
} from '../data/yamlLoader';
import * as LucideIcons from 'lucide-react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import GovernmentActivitySection from '../components/home/GovernmentActivitySection';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Banner } from '@bettergov/kapwa/banner';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Government: React.FC = () => {
  const { t } = useTranslation();
  const { category } = useParams();
  const [categoryIndex, setCategoryIndex] = useState<CategoryIndex>({
    layout: 'list',
    pages: [],
  });
  const [loading, setLoading] = useState(false);
  const subcategories: Subcategory[] = categoryIndex.pages;

  const getCategory = () => {
    return governmentCategories.categories.find(c => c.slug === category);
  };

  const categoryData = getCategory();
  const Icon = LucideIcons[
    categoryData?.icon as keyof typeof LucideIcons
  ] as React.ComponentType<{ className?: string }>;

  // Group pages by their optional `subcategory` label, preserving first-seen
  // order. Pages without a subcategory fall under an empty-string group, which
  // renders without a heading (backward compatible with ungrouped categories).
  const groupedSubcategories = subcategories.reduce<
    Array<{ label: string; pages: Subcategory[] }>
  >((groups, page) => {
    const label = page.subcategory ?? '';
    const existing = groups.find(g => g.label === label);
    if (existing) {
      existing.pages.push(page);
    } else {
      groups.push({ label, pages: [page] });
    }
    return groups;
  }, []);
  const hasGroups = groupedSubcategories.some(g => g.label !== '');

  const renderCards = (pages: Subcategory[]) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) =>
      categoryIndex.layout === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children}
        </div>
      ) : (
        <div className="space-y-4">{children}</div>
      );

    return (
      <Wrapper>
        {pages.map(subcategory => (
          <Link
            key={subcategory.slug}
            to={`/government/${category}/${subcategory.slug}`}
          >
            <Card
              hoverable
              className={
                categoryIndex.layout === 'grid'
                  ? 'h-full border-t-4 border-primary-500'
                  : 'mb-4'
              }
            >
              <CardContent>
                <h4 className="flex items-center gap-2 text-lg font-medium text-gray-900">
                  <Icon className="h-5 w-5 shrink-0 text-primary-600" />
                  <span>{subcategory.name}</span>
                </h4>
                {subcategory.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {subcategory.description}
                  </p>
                )}
                <span className="inline-block px-2 py-1 mt-2 text-xs font-medium rounded-sm bg-gray-100 text-gray-800">
                  {categoryData?.category || category}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Wrapper>
    );
  };

  useEffect(() => {
    if (category && categoryData) {
      setLoading(true);
      getCategorySubcategories(category)
        .then(setCategoryIndex)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [category, categoryData]);

  if (!category) {
    return (
      <>
        <SEO
          title={t('pages.services.seoTitle')}
          description={t('pages.services.seoDescription', {
            government: import.meta.env.VITE_GOVERNMENT_NAME,
          })}
          keywords={t('pages.services.seoKeywords')}
        />
        <GovernmentActivitySection
          title={t('pages.services.allServicesTitle')}
          description={t('pages.services.seoDescription', {
            government: import.meta.env.VITE_GOVERNMENT_NAME,
          })}
        />
      </>
    );
  }
  if (!categoryData) {
    return (
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        <Banner
          type="error"
          title={t('pages.government.categoryNotFoundTitle')}
          description={t('pages.government.categoryNotFoundDescription')}
          icon
        />
      </Section>
    );
  }

  return (
    <>
      <SEO
        title={categoryData.category || category}
        description={categoryData.description}
        keywords={t('pages.services.categoryKeywords', {
          category: categoryData.category,
        })}
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" />
        <Icon className="h-8 w-8 mb-4 text-primary-600 rounded-md" />
        <Heading>{categoryData.category || category}</Heading>
        <Text className="text-gray-600 mb-6">{categoryData.description}</Text>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Text>{t('pages.services.loading')}</Text>
          </div>
        ) : (
          <>
            {categoryIndex.title && (
              <Heading level={3}>{categoryIndex.title}</Heading>
            )}
            {categoryIndex.description && (
              <Text className="text-gray-600 mb-4">
                {categoryIndex.description}
              </Text>
            )}
            {subcategories.length === 0 ? (
              <Banner
                type="info"
                title={t('pages.government.comingSoonTitle')}
                description={t('pages.government.comingSoonDescription', {
                  category: categoryData.category,
                })}
                icon
              />
            ) : hasGroups ? (
              <div className="space-y-8">
                {groupedSubcategories.map(group => (
                  <div key={group.label || 'ungrouped'}>
                    {group.label && (
                      <Heading level={3} className="mb-4">
                        {group.label}
                      </Heading>
                    )}
                    {renderCards(group.pages)}
                  </div>
                ))}
              </div>
            ) : (
              renderCards(subcategories)
            )}
          </>
        )}
      </Section>
    </>
  );
};

export default Government;
