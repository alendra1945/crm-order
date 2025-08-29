import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAuthForm } from '@/components/auth/user-auth-form';
import { cn } from '@/lib/utils';
import { typographyClassName } from '@/lib/contants';

export default function Signin() {
  return (
    <Card className='gap-6 border-none rounded-none shadow-none'>
      <CardHeader>
        <CardTitle className={cn('text-lg tracking-tight', typographyClassName.h2)}>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password below to <br />
          log into your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserAuthForm redirectTo='/dashboard' />
      </CardContent>
    </Card>
  );
}
