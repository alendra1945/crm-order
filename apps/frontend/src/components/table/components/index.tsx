'use client';
import { Table, TableHead, TableHeader, TableProps, TableRow } from '@/components/ui/table';
import { useTableDataContext } from '@/hooks/use-table-hooks';
import createEventSubPub, { Subject } from '@/lib/subject';
import { cn } from '@/lib/utils';
import { ColumnDef, ColumnSizingState } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';
import { IAdvancedTableProps } from '../table-provider';
import { DataTableBody } from './data-table-body';
import { DataTableHeader } from './data-table-header';
import { DataTablePagination } from './data-table-pagination';
import { DataTableSkeleton, DataTableSkeletonProps } from './data-table-skeleton';
export function AdvancedDataTable<T>({
  columns,
  data,
  className,
  skeletonSettings,
  tableSettings,
}: Omit<IAdvancedTableProps<T>, 'columns' | 'data' | 'pagination'> & {
  className?: string;
  columns?: IAdvancedTableProps<T>['columns'];
  data?: IAdvancedTableProps<T>['data'];
  skeletonSettings?: DataTableSkeletonProps;
  tableSettings?: TableProps;
}) {
  const tableColumnEventUpdate = useRef<Subject<ColumnDef<T>[]> | null>(null);
  const currentColumns = useRef<ColumnDef<T>[] | null>(null);

  const tableDataEventUpdate = useRef<Subject<T[]> | null>(null);
  const currentData = useRef<T[] | null>(null);
  const [{ table, isLoading }, { setInternalColumns, setInternalData }] = useTableDataContext<T>();

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const visibleColumns = table.getVisibleLeafColumns();
  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: (index) => visibleColumns[index].getSize(),
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 50,
  });
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    estimateSize: () => 33,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 100,
  });
  const virtualColumns = columnVirtualizer.getVirtualItems();
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight = columnVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }
  useEffect(() => {
    return () => {
      if (tableColumnEventUpdate.current) {
        tableColumnEventUpdate.current?.unsubscribe();
        tableColumnEventUpdate.current = null;
        currentColumns.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!tableColumnEventUpdate.current) {
      tableColumnEventUpdate.current = createEventSubPub<ColumnDef<T>[]>();
      tableColumnEventUpdate.current.subscribe({
        next: (newColumn) => {
          if (
            !currentColumns.current ||
            currentColumns.current.length !== newColumn.length ||
            JSON.stringify(currentColumns.current) !== JSON.stringify(newColumn)
          ) {
            currentColumns.current = newColumn;
            setInternalColumns(newColumn);
          }
        },
      });
    }
    if (columns) {
      tableColumnEventUpdate.current.next(columns || []);
    }
  }, [columns]); // eslint-disable-line

  useEffect(() => {
    return () => {
      if (tableDataEventUpdate.current) {
        tableDataEventUpdate.current?.unsubscribe();
        tableDataEventUpdate.current = null;
        currentData.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (!tableDataEventUpdate.current) {
      tableDataEventUpdate.current = createEventSubPub<T[]>();
      tableDataEventUpdate.current.subscribe({
        next: (newData) => {
          if (
            !currentColumns.current ||
            currentColumns.current.length !== newData.length ||
            JSON.stringify(currentColumns.current) !== JSON.stringify(newData)
          ) {
            currentData.current = newData;
            setInternalData(newData);
          }
        },
      });
    }
    if (data) {
      tableDataEventUpdate.current.next(data || []);
    }
  }, [data]); // eslint-disable-line
  useEffect(() => {
    if (tableContainerRef.current) {
      const currentTableSize = table.getCenterTotalSize();
      const rect = tableContainerRef.current.getBoundingClientRect();
      if (rect.width > currentTableSize) {
        const size = Math.floor((rect.width - currentTableSize) / visibleColumns.length) - 5;
        const sizes: ColumnSizingState = {};
        table.getAllLeafColumns().forEach((col) => {
          sizes[col.id] = col.getSize() + size;
        });
        table.setColumnSizing(sizes);
      }
    }
    table.getAllLeafColumns().forEach((col) => {});
  }, [table]);
  if (isLoading) {
    return (
      <DataTableSkeleton
        {...{
          columnCount: 5,
          withPagination: false,
          ...(skeletonSettings || {}),
        }}
      />
    );
  }

  return (
    <div className={cn('advanced-table-container w-full space-y-2.5')}>
      <div
        className={cn(
          'rounded-sm relative overflow-hidden smooth-scroll smooth-scroll-x [&>div]:border-l-0 [&>div]:border-t-0 [&>div]:w-full [&>div>table>tbody>tr:last-child>td]:border-b-0 smoth-scroll smoth-scroll-x',
          className
        )}
        ref={tableContainerRef}
      >
        <Table
          variant='dashed'
          {...(tableSettings || {})}
          className={cn('h-full', tableSettings?.className)}
          style={{
            display: 'grid',
            width: table.getCenterTotalSize() + 'px',
          }}
        >
          <TableHeader
            style={{
              display: 'grid',
              position: 'sticky',
              top: '0px',
            }}
            className='bg-[#f6f6f6]'
          >
            {table.getHeaderGroups().map((headerGroup, idx) => (
              <TableRow
                style={{ display: 'flex', width: '100%' }}
                key={`${headerGroup.id}_${idx}`}
                className='border-0 '
              >
                {virtualPaddingLeft ? <TableHead style={{ display: 'flex', width: virtualPaddingLeft }} /> : null}
                {virtualColumns.map((vc) => {
                  const header = headerGroup.headers[vc.index];
                  if (!header) {
                    return null;
                  }
                  return <DataTableHeader table={table} key={header.id} header={header} />;
                })}
                {virtualPaddingRight ? <TableHead style={{ display: 'flex', width: virtualPaddingRight }} /> : null}
              </TableRow>
            ))}
          </TableHeader>

          <DataTableBody
            virtualColumns={virtualColumns}
            virtualPaddingLeft={virtualPaddingLeft}
            virtualPaddingRight={virtualPaddingRight}
            rowVirtualizer={rowVirtualizer}
            onClick={() => {}}
            table={table}
          />
        </Table>
      </div>
      <DataTablePagination />
    </div>
  );
}
