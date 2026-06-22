import React from 'react';

export interface AppThemeConfig {
  themeMode: 'light' | 'dark';
  accentColor: 'purple' | 'emerald' | 'blue' | 'orange' | 'pink';
  borderRadius: 'none' | 'md' | 'lg' | 'full';
  springIntensity: 'calm' | 'snappy' | 'springy';
}

export type ComponentCategory =
  | 'Buttons'
  | 'Cards'
  | 'Modals'
  | 'Navbars'
  | 'Sidebars'
  | 'Forms'
  | 'Inputs'
  | 'Loaders'
  | 'Pricing tables'
  | 'Hero sections'
  | 'Dashboards'
  | 'Testimonials'
  | 'Footers'
  | 'Authentication UI'
  | 'Ecommerce UI';

export interface UIComponentItem {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  tags: ('New' | 'Popular' | 'Pro')[];
  codeJSX: string;
  codeTailwind: string;
  installation: string;
  // Dynamic component to run in preview
  previewRender: () => React.ReactElement;
  dependencies?: string[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  comment: string;
  rating: number;
}
