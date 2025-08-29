'use client';

import { AdvancedDataTable } from '@/components/table/components';
import { ReportTemplateFromApi } from '@/hooks/use-report-template-query';
import { useEffect } from 'react';
import { useReportTemplateTableData } from './table-data';
import Pagination from '../base/pagination';
import { typographyClassName } from '@/lib/contants';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useModal } from '@/hooks/use-modal-store';

export const TableCardReportTemplate = () => {
  const { fetchDataReportTemplate, page, totalData, setActivePage, isLoading } = useReportTemplateTableData();

  const { onOpen } = useModal();

  const onCreate = () => {
    onOpen('createReportTemplate');
  };
  useEffect(() => {
    fetchDataReportTemplate(page);
  }, [page]);

  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className={typographyClassName.h3}>Report Templates</h1>
        <div className='flex items-center space-x-2'>
          <Button onClick={onCreate}>Add Report Template</Button>
        </div>
      </div>

      {(isLoading || !!totalData) && (
        <div className='w-full rounded-lg min-h-[200px] h-[calc(100vh-150px)] shadow overflow-auto smooth-scroll overflow-x-hidden'>
          <AdvancedDataTable<ReportTemplateFromApi> />
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
