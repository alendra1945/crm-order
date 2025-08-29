'use client';

import { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  total: {
    label: 'Total',
  },
  male: {
    label: 'Male',
    color: 'var(--chart-1)',
  },
  female: {
    label: 'Female',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

export function OrderOverview() {
  return <div />;
}
