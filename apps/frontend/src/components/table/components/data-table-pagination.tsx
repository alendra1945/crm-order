import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTableDataContext } from '@/hooks/use-table-hooks';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';

export interface DataTablePaginationProps {
  pageSizeOptions?: number[];
}
const defaultPagination = [10, 20, 30, 40, 50, 100];
export function DataTablePagination<TData>({ pageSizeOptions = defaultPagination }: DataTablePaginationProps) {
  const [{ table, pagination }, { setPagination }] = useTableDataContext<TData>();
  if (!pagination.usePagination) {
    return <></>;
  }
  return (
    <div className='flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8'>
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <div className='flex-1 whitespace-nowrap text-base text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length.toLocaleString()} of{' '}
          {table.getFilteredRowModel().rows.length.toLocaleString()} row(s) selected.
        </div>
      ) : (
        <div></div>
      )}
      <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm text-gray-600'>Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              let pageIndex = table.getState().pagination.pageIndex;
              if (Number(value) > table.getFilteredRowModel().rows.length) {
                pageIndex = 0;
              }
              setPagination((prev) => ({
                ...prev,
                pageSize: Number(value),
                pageIndex: pageIndex,
              }));
            }}
          >
            <SelectTrigger className='h-10 w-[100px] focus:ring-transparent text-sm'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem className={'text-sm text-gray-600'} key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-center text-sm text-gray-600'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            aria-label='Go to first page'
            variant='outline'
            size={'icon'}
            className='hidden size-8 p-0 lg:flex  '
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: 0,
              }))
            }
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className='size-5' aria-hidden='true' />
          </Button>
          <Button
            aria-label='Go to previous page'
            variant='outline'
            size='icon'
            className='size-8 '
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex - 1,
              }))
            }
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className='size-4' aria-hidden='true' />
          </Button>
          <Button
            aria-label='Go to next page'
            variant='outline'
            size='icon'
            className='size-8 '
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className='size-4' aria-hidden='true' />
          </Button>
          <Button
            aria-label='Go to last page'
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex '
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: table.getPageCount() - 1,
              }))
            }
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className='size-4' aria-hidden='true' />
          </Button>
        </div>
      </div>
    </div>
  );
}
