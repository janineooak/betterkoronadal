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
        labelKey: 'nav.departments',
        href: '/government/departments',
        icon: 'Building2',
      },
      {
        label: 'Office of the City Mayor',
        labelKey: 'nav.mayorOffice',
        href: '/government/departments/executive',
        icon: 'UserRound',
      },
      {
        label: 'Sangguniang Panlungsod',
        labelKey: 'nav.sanggunian',
        href: '/government/departments/legislative',
        icon: 'Users',
      },
      {
        label: 'City Officials',
        labelKey: 'nav.cityOfficials',
        href: '/government/city-officials',
        icon: 'Contact',
      },
      {
        label: 'Barangays',
        labelKey: 'nav.barangays',
        href: '/barangays',
        icon: 'MapPin',
      },
      {
        label: 'News & Announcements',
        labelKey: 'nav.news',
        href: '/government/news',
        icon: 'Newspaper',
      },
      {
        label: 'Guides & Regulations',
        labelKey: 'nav.guides',
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
        labelKey: 'nav.demographics',
        href: '/statistics',
        icon: 'Users',
      },
      {
        label: 'Competitiveness',
        labelKey: 'nav.competitiveness',
        href: '/statistics/competitiveness',
        icon: 'Trophy',
      },
      {
        label: 'City Income',
        labelKey: 'nav.cityIncome',
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
        labelKey: 'nav.transparency',
        href: '/transparency',
        icon: 'FileSearch',
      },
      {
        label: 'Procurement Opportunities',
        labelKey: 'nav.procurement',
        href: '/procurements',
        icon: 'FileText',
      },
      {
        label: 'Flood Control Projects',
        labelKey: 'nav.floodControl',
        href: '/flood-control',
        icon: 'Waves',
      },
      {
        label: 'Regional LGU Directory',
        labelKey: 'nav.regionalDirectory',
        href: '/regional-directory',
        icon: 'Building2',
      },
      {
        label: "Citizen's Charter",
        labelKey: 'nav.citizensCharter',
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
      titleKey: 'footer.sections.about',
      links: [
        {
          label: 'About the City',
          labelKey: 'footer.links.aboutCity',
          href: '/about',
        },
        {
          label: 'City History',
          labelKey: 'footer.links.cityHistory',
          href: '/history',
        },
        {
          label: 'Barangays',
          labelKey: 'footer.links.barangays',
          href: '/barangays',
        },
        {
          label: 'Visit Koronadal',
          labelKey: 'footer.links.visitKoronadal',
          href: '/tourism',
        },
        {
          label: 'City Government',
          labelKey: 'footer.links.cityGovernment',
          href: '/government/departments',
        },
        {
          label: 'City Officials',
          labelKey: 'footer.links.cityOfficials',
          href: '/government/city-officials',
        },
        {
          label: 'Contact Us',
          labelKey: 'footer.links.contactUs',
          href: '/contact',
        },
        {
          label: 'Emergency Hotlines',
          labelKey: 'footer.links.emergencyHotlines',
          href: '/hotlines',
        },
      ],
    },
    {
      title: 'Services',
      titleKey: 'footer.sections.services',
      links: [
        {
          label: 'All Services',
          labelKey: 'footer.links.allServices',
          href: '/services',
        },
        ...(servicesData.categories as Category[])
          .slice(0, 6)
          .map(category => ({
            label: category.category,
            href: `/services/${category.slug}`,
          })),
        {
          label: 'Search the site',
          labelKey: 'footer.links.searchSite',
          href: '/search',
        },
      ],
    },
    {
      title: 'Data & Transparency',
      titleKey: 'footer.sections.dataTransparency',
      links: [
        {
          label: 'Population & Demographics',
          labelKey: 'footer.links.populationDemographics',
          href: '/statistics',
        },
        {
          label: 'Competitiveness',
          labelKey: 'footer.links.competitiveness',
          href: '/statistics/competitiveness',
        },
        {
          label: 'City Income',
          labelKey: 'footer.links.cityIncome',
          href: '/statistics/municipal-income',
        },
        {
          label: 'Procurement Opportunities',
          labelKey: 'footer.links.procurement',
          href: '/procurements',
        },
        {
          label: 'Flood Control Projects',
          labelKey: 'footer.links.floodControl',
          href: '/flood-control',
        },
        {
          label: 'Regional LGU Directory',
          labelKey: 'footer.links.regionalDirectory',
          href: '/regional-directory',
        },
      ],
    },
    {
      title: 'Government',
      titleKey: 'footer.sections.government',
      links: [
        {
          label: "Citizen's Charter",
          labelKey: 'footer.links.citizensCharter',
          href: '/citizens-charter',
        },
        {
          label: 'Transparency & Full Disclosure',
          labelKey: 'footer.links.transparency',
          href: '/transparency',
        },
        {
          label: 'Sources & References',
          labelKey: 'footer.links.sources',
          href: '/sources',
        },
        {
          label: 'Open Data',
          labelKey: 'footer.links.openData',
          href: 'https://data.gov.ph',
        },
        {
          label: 'Freedom of Information',
          labelKey: 'footer.links.foi',
          href: 'https://www.foi.gov.ph',
        },
        {
          label: 'Official Gazette',
          labelKey: 'footer.links.officialGazette',
          href: 'https://www.officialgazette.gov.ph',
        },
      ],
    },
  ],
  socialLinks: [] as { label: string; href: string }[],
};
