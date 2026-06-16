import type { NavigationItem } from '../types';
import { serviceCategories as servicesData } from './yamlLoader';

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  category: string;
  slug: string;
  subcategories: Subcategory[];
}

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Services',
    href: '/services',
    children: (servicesData.categories as Category[]).map(category => ({
      label: category.category,
      href: `/services/${category.slug}`,
    })),
  },
  {
    label: 'Government',
    href: '/government/departments',
    children: [
      { label: 'Departments & Offices', href: '/government/departments' },
      {
        label: 'Office of the City Mayor',
        href: '/government/departments/executive',
      },
      {
        label: 'Sangguniang Panlungsod',
        href: '/government/departments/legislative',
      },
      {
        label: 'Guides & Regulations',
        href: '/government/guides-and-regulations',
      },
      {
        label: 'Reports & Statistics',
        href: '/government/reports-and-statistics',
      },
      {
        label: 'Transparency & Full Disclosure',
        href: '/transparency',
      },
      {
        label: "Citizen's Charter",
        href: '/citizens-charter',
      },
    ],
  },
];

export const footerNavigation = {
  mainSections: [
    {
      title: 'About',
      links: [
        { label: 'About the City', href: '/about' },
        { label: 'Visit Koronadal', href: '/tourism' },
        { label: 'City Government', href: '/government/departments' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Emergency Hotlines', href: '/hotlines' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'All Services', href: '/services' },
        ...(servicesData.categories as Category[])
          .slice(0, 6)
          .map(category => ({
            label: category.category,
            href: `/services/${category.slug}`,
          })),
      ],
    },
    {
      title: 'Government',
      links: [
        { label: "Citizen's Charter", href: '/citizens-charter' },
        { label: 'Transparency & Full Disclosure', href: '/transparency' },
        { label: 'Sources & References', href: '/sources' },
        { label: 'Open Data', href: 'https://data.gov.ph' },
        { label: 'Freedom of Information', href: 'https://www.foi.gov.ph' },
        {
          label: 'Official Gazette',
          href: 'https://www.officialgazette.gov.ph',
        },
      ],
    },
  ],
  socialLinks: [
    {
      label: 'Facebook',
      href: 'https://facebook.com/CityGovernmentofKoronadal',
    },
  ],
};
