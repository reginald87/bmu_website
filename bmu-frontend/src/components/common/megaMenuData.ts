import {
  GraduationCap,
  University,
  FlaskConical,
  Building2,
  Users,
  Globe,
  Newspaper,
  HeartHandshake,
  LogIn,
  type LucideIcon,
} from 'lucide-react';

export interface MegaLink {
  key: string;
  to: string;
}

export interface MegaColumn {
  headingKey?: string;
  links: MegaLink[];
}

export interface MegaGroup {
  key: string;
  labelKey: string;
  to: string;
  titleKey: string;
  feature: { icon: LucideIcon; descKey: string; to: string };
  columns: MegaColumn[];
}

export const megaGroups: Record<string, MegaGroup> = {
  about: {
    key: 'about',
    labelKey: 'nav.about',
    to: '/about',
    titleKey: 'megaMenu.about_title',
    feature: { icon: University, descKey: 'megaMenu.about_featured_desc', to: '/about' },
    columns: [
      {
        links: [
          { key: 'megaMenu.about_link1', to: '/about/history' },
          { key: 'megaMenu.about_link2', to: '/about/vision-mission' },
          { key: 'megaMenu.about_link10', to: '/about/governance' },
          { key: 'megaMenu.about_link3', to: '/about/leadership' },
          { key: 'megaMenu.about_link5', to: '/about/rankings' },
        ],
      },
      {
        links: [
          { key: 'megaMenu.about_link4', to: '/gallery' },
          { key: 'nav.about_campusLife', to: '/about/campus' },
          { key: 'megaMenu.about_link11', to: '/people' },
          { key: 'megaMenu.about_link12', to: '/about/staff' },
          { key: 'megaMenu.about_link13', to: '/about/documents' },
          { key: 'nav.about_contact', to: '/contact' },
        ],
      },
    ],
  },
  academics: {
    key: 'academics',
    labelKey: 'nav.academics',
    to: '/academics',
    titleKey: 'megaMenu.academics_title',
    feature: { icon: GraduationCap, descKey: 'megaMenu.academics_featured_desc', to: '/academics' },
    columns: [
      {
        headingKey: 'megaMenu.academics_heading2',
        links: [
          { key: 'megaMenu.academics_link4', to: '/academics/programs' },
          { key: 'nav.academics_admissions', to: '/academics/admissions' },
          { key: 'nav.academics_calendar', to: '/academics/calendar' },
          { key: 'nav.academics_library', to: '/academics/library' },
        ],
      },
      {
        headingKey: 'nav.academicUnits',
        links: [
          { key: 'megaMenu.academics_link12', to: '/academics/colleges' },
          { key: 'megaMenu.academics_link13', to: '/academics/faculties' },
          { key: 'megaMenu.academics_link14', to: '/academics/departments' },
          { key: 'nav.academicUnits', to: '/academic-units' },
        ],
      },
    ],
  },
  research: {
    key: 'research',
    labelKey: 'nav.research',
    to: '/research',
    titleKey: 'megaMenu.research_title',
    feature: { icon: FlaskConical, descKey: 'megaMenu.research_featured_desc', to: '/research' },
    columns: [
      {
        links: [
          { key: 'nav.research_centers', to: '/research/centers' },
          { key: 'nav.research_publications', to: '/research/publications' },
          { key: 'nav.research_funding', to: '/research/funding' },
          { key: 'nav.research_collaborations', to: '/research/collaborations' },
        ],
      },
      {
        links: [
          { key: 'megaMenu.research_link2', to: '/research/faculty' },
          { key: 'megaMenu.research_link3', to: '/research/centers' },
          { key: 'megaMenu.research_link5', to: '/research/funding' },
          { key: 'megaMenu.research_link6', to: '/research/collaborations' },
          { key: 'nav.research_innovation', to: '/research/innovation' },
          { key: 'nav.research_universityProjects', to: '/research/university-projects' },
        ],
      },
    ],
  },
  colleges: {
    key: 'colleges',
    labelKey: 'nav.colleges',
    to: '/academics/colleges',
    titleKey: 'megaMenu.colleges_title',
    feature: { icon: Building2, descKey: 'megaMenu.colleges_featured_desc', to: '/academics/colleges' },
    columns: [
      {
        headingKey: 'nav.academicUnits_colleges',
        links: [
          { key: 'megaMenu.academics_link12', to: '/academics/colleges' },
          { key: 'megaMenu.academics_link13', to: '/academics/faculties' },
          { key: 'megaMenu.academics_link14', to: '/academics/departments' },
        ],
      },
      {
        headingKey: 'megaMenu.institutes_title',
        links: [
          { key: 'megaMenu.institutes_link1', to: '/institutes/foreign-languages' },
          { key: 'megaMenu.institutes_link3', to: '/institutes/research' },
          { key: 'megaMenu.institutes_link4', to: '/centres/career' },
          { key: 'megaMenu.institutes_link5', to: '/centres/foundation-studies' },
          { key: 'megaMenu.institutes_link6', to: '/centres/cpd' },
          { key: 'megaMenu.institutes_link7', to: '/centres/innovation' },
        ],
      },
    ],
  },
  campusLife: {
    key: 'campusLife',
    labelKey: 'nav.about_campusLife',
    to: '/about/campus',
    titleKey: 'megaMenu.campusLife_title',
    feature: { icon: Users, descKey: 'megaMenu.campusLife_featured_desc', to: '/about/campus' },
    columns: [
      {
        headingKey: 'megaMenu.campusLife_title',
        links: [
          { key: 'megaMenu.campusLife_link1', to: '/about/campus#housing' },
          { key: 'megaMenu.campusLife_link2', to: '/about/campus#dining' },
          { key: 'megaMenu.campusLife_link3', to: '/about/campus#wellness' },
          { key: 'megaMenu.campusLife_link4', to: '/about/campus#organizations' },
          { key: 'megaMenu.campusLife_link5', to: '/about/campus#diversity' },
          { key: 'megaMenu.campusLife_link6', to: '/about/campus#safety' },
        ],
      },
      {
        links: [
          { key: 'megaMenu.campusLife_link7', to: '/gallery' },
          { key: 'megaMenu.campusLife_link8', to: '/contact' },
        ],
      },
    ],
  },
  international: {
    key: 'international',
    labelKey: 'nav.international',
    to: '/international',
    titleKey: 'megaMenu.international_title',
    feature: { icon: Globe, descKey: 'megaMenu.international_featured_desc', to: '/international' },
    columns: [
      {
        headingKey: 'megaMenu.international_title',
        links: [
          { key: 'megaMenu.international_link1', to: '/international' },
          { key: 'megaMenu.international_link2', to: '/international/students' },
          { key: 'megaMenu.international_link4', to: '/international/visitors' },
          { key: 'megaMenu.international_link5', to: '/international/exchange' },
        ],
      },
      {
        links: [
          { key: 'megaMenu.international_link6', to: '/international/partnerships' },
        ],
      },
    ],
  },
  newsEvents: {
    key: 'newsEvents',
    labelKey: 'nav.newsEvents',
    to: '/news',
    titleKey: 'megaMenu.newsEvents_title',
    feature: { icon: Newspaper, descKey: 'megaMenu.newsEvents_featured_desc', to: '/news' },
    columns: [
      {
        headingKey: 'megaMenu.newsEvents_news',
        links: [
          { key: 'megaMenu.newsEvents_link1', to: '/news' },
          { key: 'megaMenu.newsEvents_link2', to: '/news/announcements' },
          { key: 'megaMenu.newsEvents_link3', to: '/news/press-releases' },
        ],
      },
      {
        headingKey: 'megaMenu.newsEvents_events',
        links: [
          { key: 'megaMenu.newsEvents_link4', to: '/events' },
          { key: 'megaMenu.newsEvents_link5', to: '/events/calendar' },
          { key: 'megaMenu.newsEvents_link6', to: '/events/past' },
        ],
      },
    ],
  },
  impact: {
    key: 'impact',
    labelKey: 'nav.impact',
    to: '/impact',
    titleKey: 'megaMenu.impact_title',
    feature: { icon: HeartHandshake, descKey: 'megaMenu.impact_featured_desc', to: '/impact' },
    columns: [
      {
        headingKey: 'nav.impact_areas',
        links: [
          { key: 'megaMenu.impact_link7', to: '/impact/sdg-dashboard' },
          { key: 'nav.impact_community', to: '/impact/community' },
          { key: 'nav.impact_sustainability', to: '/impact/sustainability' },
          { key: 'nav.impact_health', to: '/impact/health' },
        ],
      },
      {
        headingKey: 'nav.impact_overview',
        links: [
          { key: 'nav.impact', to: '/impact' },
          { key: 'nav.impact_externalPartners', to: '/impact/external-partners' },
        ],
      },
    ],
  },
  portals: {
    key: 'portals',
    labelKey: 'nav.portals',
    to: '/portals',
    titleKey: 'megaMenu.portals_title',
    feature: { icon: LogIn, descKey: 'megaMenu.portals_featured_desc', to: '/portals' },
    columns: [
      {
        headingKey: 'megaMenu.portals_title',
        links: [
          { key: 'nav.portals_applicant', to: '/portals/applicant' },
          { key: 'nav.portals_student', to: '/portals/login' },
          { key: 'nav.portals_alumni', to: '/portals/alumni' },
          { key: 'nav.portals', to: '/portals' },
        ],
      },
      {
        headingKey: 'nav.quickLinks',
        links: [
          { key: 'nav.jobs', to: '/careers/jobs' },
          { key: 'nav.archive', to: '/archive' },
          { key: 'nav.newsEvents_announcements', to: '/announcements' },
          { key: 'nav.impact_externalPartners', to: '/impact/external-partners' },
        ],
      },
    ],
  },
};
