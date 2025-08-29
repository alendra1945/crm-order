import { type ClassValue, clsx } from 'clsx';
import * as crypto from 'crypto';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const COLORS: string[] = [
  '#F1416C',
  '#A838FF',
  '#FFC700',
  '#F9666E',
  '#d946ef',
  '#FFBB2C',
  '#35D29A',
  '#3699FF',
  '#7239EA',
  '#14b8a6',
  '#1d4ed8',
  '#be123c',
];
export function getRandomColorById(id: number): string {
  return COLORS[id % COLORS.length];
}
export function uuidToNumber(uuid: string, max = 1000000): number {
  const hash = crypto.createHash('sha256').update(uuid).digest('hex');
  // Take first 12 hex chars → convert to int
  const num = parseInt(hash.substring(0, 12), 16);
  return num % max;
}
export const updateEditorStyle = (styleProps?: React.CSSProperties) => {
  const cssStyle: Record<string, any> = {}; // eslint-disable-line
  if (styleProps) {
    for (const [key, value] of Object.entries(styleProps)) {
      const cssKey = key.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
      cssStyle[cssKey] = value;
    }
  }
  return cssStyle;
};

export function formatCurrencyTOIDR(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value);
}
