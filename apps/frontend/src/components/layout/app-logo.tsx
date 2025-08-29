import * as React from 'react';
import Image from 'next/image';

export function AppLogo() {
  return (
    <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square w-full h-8 items-center justify-center rounded-lg'>
      <Image src='/logo.png' alt='logo' width={80} height={24} />
    </div>
  );
}
