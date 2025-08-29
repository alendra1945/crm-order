'use client';
import React from 'react';
import { QueryClientProvider as BaseQueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/fetch-client';

type Props = {
  children: React.ReactNode;
};

export function QueryClientProvider({ children }: Props) {
  return <BaseQueryClientProvider client={queryClient}>{children}</BaseQueryClientProvider>;
}
