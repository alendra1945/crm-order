'use client';

import { AdvancedDataTable } from '@/components/table/components';
import { Product } from '@/hooks/use-product-query';
import { typographyClassName } from '@/lib/contants';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Pagination from '../base/pagination';
import { Button } from '../ui/button';
import { useProductTableData } from './table-data';

export const TableCardProduct = () => {
  const { fetchDataProduct, page, totalData, setActivePage, isLoading } = useProductTableData();
  const router = useRouter();
  useEffect(() => {
    fetchDataProduct(page);
  }, [page, fetchDataProduct]);
  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className={typographyClassName.h3}>Product</h1>
        <div className='flex items-center space-x-2'>
          <Button
            onClick={() => {
              router.push('/products/new');
            }}
          >
            Add Product
          </Button>
        </div>
      </div>

      {(isLoading || !!totalData) && (
        <div className='w-full rounded-lg min-h-[200px] h-[calc(100vh-150px)] shadow overflow-auto smooth-scroll overflow-x-hidden'>
          <AdvancedDataTable<Product> />
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
