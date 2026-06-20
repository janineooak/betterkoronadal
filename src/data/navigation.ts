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
  icon?: string;
}

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Services',
    href: '/services',
    icon: 'LayoutGrid',
    children: (servicesData.categories as Category[]).map(category => ({
      label: category.category,
      href: `/services/${category.slug}`,
      icon: category.icon,
    })),
  },
  {
    label: 'Government',
    href: '/government/departments',
    icon: 'Landmark',
    children: [
      {
        label: 'Departments & Offices',
        href: '/government/departments',
        icon: 'Building2',
      },
      {
        label: 'Office of the City Mayor',
        href: '/government/departments/executive',
        icon: 'UserRound',
      },
      {
        label: 'Sangguniang Panlungsod',
        href: '/government/departments/legislative',
        icon: 'Users',
      },
      {
        label: 'City Officials',
        href: '/government/city-officials',
        icon: 'Contact',
      },
      {
        label: 'Barangays',
        href: '/barangays',
        icon: 'MapPin',
      },
      {
        label: 'News & Announcements',
        href: '/government/news',
        icon: 'Newspaper',
      },
      {
        label: 'Guides & Regulations',
        href: '/government/guides-and-regulations',
        icon: 'BookOpen',
      },
    ],
  },
  {
    label: 'Statistics',
    href: '/statistics',
    icon: 'BarChart3',
    children: [
      {
        label: 'Demographics',
        href: '/statistics',
        icon: 'Users',
      },
      {
        label: 'Competitiveness',
        href: '/statistics/competitiveness',
        icon: 'Trophy',
      },
      {
        label: 'City Income',
        href: '/statistics/municipal-income',
        icon: 'Wallet',
      },
    ],
  },
  {
    label: 'Transparency',
    href: '/transparency',
    icon: 'FileSearch',
    children: [
      {
        label: 'Transparency & Full Disclosure',
        href: '/transparency',
        icon: 'FileSearch',
      },
      {
        label: 'Procurement Opportunities',
        href: '/procurements',
        icon: 'FileText',
      },
      {
        label: 'Flood Control Projects',
        href: '/flood-control',
        icon: 'Waves',
      },
      {
        label: 'Regional LGU Directory',
        href: '/regional-directory',
        icon: 'Building2',
      },
      {
        label: "Citizen's Charter",
        href: '/citizens-charter',
        icon: 'ScrollText',
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
        { label: 'City History', href: '/history' },
        { label: 'Barangays', href: '/barangays' },
        { label: 'Visit Koronadal', href: '/tourism' },
        { label: 'City Government', href: '/government/departments' },
        { label: 'City Officials', href: '/government/city-officials' },
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
        { label: 'Search the site', href: '/search' },
      ],
    },
    {
      title: 'Data & Transparency',
      links: [
        { label: 'Population & Demographics', href: '/statistics' },
        { label: 'Competitiveness', href: '/statistics/competitiveness' },
        { label: 'City Income', href: '/statistics/municipal-income' },
        { label: 'Procurement Opportunities', href: '/procurements' },
        { label: 'Flood Control Projects', href: '/flood-control' },
        { label: 'Regional LGU Directory', href: '/regional-directory' },
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
  socialLinks: [] as { label: string; href: string }[],
};
