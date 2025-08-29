'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function FormProfile() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
        <CardDescription>update your information</CardDescription>
      </CardHeader>
    </Card>
  );
}
