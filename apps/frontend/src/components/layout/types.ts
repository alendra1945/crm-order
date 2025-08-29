import { LinkProps } from 'next/link';

type User = {
  name: string;
  email: string;
  avatar: string;
};

export type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
};

export type NavLink = BaseNavItem & {
  url: LinkProps['href'] | (string & {});
  items?: never;
};

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['href'] | (string & {}) })[];
  url?: never;
};

export type NavItem = NavCollapsible | NavLink;

export type NavGroup = {
  title: string;
  items: NavItem[];
};
