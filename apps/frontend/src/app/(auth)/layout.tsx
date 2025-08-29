import Image from 'next/image';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center sm:w-[480px] shadow'>
        <div className='flex flex-col items-center justify-center bg-slate-900  text-white rounded-t-2xl py-3 space-y-2 shadow'>
          <Image src='/logo.png' alt='logo' width={200} height={40} />
        </div>
        {children}
      </div>
    </div>
  );
}
