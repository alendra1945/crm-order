'use client';

import { AdvancedDataTable } from '@/components/table/components';
import { Order } from '@/hooks/use-order-query';
import { typographyClassName } from '@/lib/contants';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Pagination from '../base/pagination';
import { Button } from '../ui/button';
import { useOrderTableData } from './table-data';

export const TableCardOrder = () => {
  const { fetchDataOrder, page, totalData, setActivePage, isLoading } = useOrderTableData();
  const router = useRouter();
  useEffect(() => {
    fetchDataOrder(page);
  }, [page]);
  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className={typographyClassName.h3}>Order</h1>
        <div className='flex items-center space-x-2'>
          <Button
            onClick={() => {
              router.push('/orders/new');
            }}
          >
            Add Order
          </Button>
        </div>
      </div>

      {(isLoading || !!totalData) && (
        <div className='w-full rounded-lg min-h-[200px] h-[calc(100vh-150px)] shadow overflow-auto smooth-scroll overflow-x-hidden'>
          <AdvancedDataTable<Order> />
          <div className='flex justify-end px-2'>
            <Pagination limit={10} page={page} total={totalData} onPageChange={(page) => setActivePage(page)} />
          </div>
        </div>
      )}
      {!isLoading && !totalData && (
        <div className='w-full h-[calc(100vh-150px)] flex flex-col items-center justify-center'>
          <Image src='/empty.svg' alt='no-data' width={200} height={200} />
          <p className={typographyClassName.p}>No data available</p>
        </div>
      )}
    </>
  );
};
