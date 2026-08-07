import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type LucideIconName = keyof typeof LucideIcons;

export const iconMap: Record<string, LucideIconName> = {
  GraduationCap: 'GraduationCap',
  Microscope: 'Microscope',
  Heart: 'Heart',
  Building2: 'Building2',
  ArrowRight: 'ArrowRight',
  BookOpen: 'BookOpen',
  Users: 'Users',
  Award: 'Award',
  Globe: 'Globe',
  Stethoscope: 'Stethoscope',
  FlaskConical: 'FlaskConical',
  Hospital: 'Hospital',
  Shield: 'Shield',
  Target: 'Target',
  Lightbulb: 'Lightbulb',
  Brain: 'Brain',
  HeartPulse: 'HeartPulse',
  Activity: 'Activity',
  BarChart: 'BarChart',
  TrendingUp: 'TrendingUp',
  Briefcase: 'Briefcase',
  Medal: 'Medal',
  Star: 'Star',
  CheckCircle: 'CheckCircle',
  Plus: 'Plus',
  Minus: 'Minus',
  X: 'X',
  Menu: 'Menu',
  ChevronRight: 'ChevronRight',
  ChevronLeft: 'ChevronLeft',
  ChevronUp: 'ChevronUp',
  ChevronDown: 'ChevronDown',
  Search: 'Search',
  Mail: 'Mail',
  Phone: 'Phone',
  MapPin: 'MapPin',
  ExternalLink: 'ExternalLink',
  Download: 'Download',
  Upload: 'Upload',
  File: 'File',
  FileText: 'FileText',
  Image: 'Image',
  Video: 'Video',
  Calendar: 'Calendar',
  Clock: 'Clock',
  Bell: 'Bell',
  Settings: 'Settings',
  User: 'User',
  LogIn: 'LogIn',
  LogOut: 'LogOut',
  Eye: 'Eye',
  EyeOff: 'EyeOff',
  Lock: 'Lock',
  Unlock: 'Unlock',
  RefreshCw: 'RefreshCw',
  Home: 'Home',
  Sun: 'Sun',
  Moon: 'Moon',
};

export function getLucideIcon(name: string): LucideIcon {
  const iconName = iconMap[name];
  if (!iconName) {
    console.warn(`Unknown icon name: ${name}`);
    return LucideIcons.HelpCircle as unknown as LucideIcon;
  }
  return LucideIcons[iconName] as unknown as LucideIcon;
}