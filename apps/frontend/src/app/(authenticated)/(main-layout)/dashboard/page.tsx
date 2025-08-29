import { Main } from '@/components/layout/main';
import { OrderOverview } from '@/components/overview/order-overview';
import TotalOverview from '@/components/overview/total-overview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function DashboardPage() {
  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        <div className='flex items-center space-x-2'>
          <Button>Download</Button>
        </div>
      </div>
      <div className='w-full space-y-5'>
        <TotalOverview />
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Order Overview</CardTitle>
          </CardHeader>
          <CardContent className='ps-2'>
            <OrderOverview />
          </CardContent>
        </Card>
      </div>
    </Main>
  );
}
