'use client';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ActiveTableMode,
  PaginationTable,
  TableColumnData,
  TableContext,
  TableDataProviderContext,
} from '@/hooks/use-table-hooks';
import { fuzzyFilter } from '@/lib/table-utils';
import { RankingInfo } from '@tanstack/match-sorter-utils';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Table as TableType,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { FilterFn } from '@tanstack/table-core';
import { PropsWithChildren, useCallback, useMemo, useState } from 'react';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    usingTooltip?: boolean;
    disablePinning?: boolean;
    disableResize?: boolean;
  }

  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export interface IAdvancedTableProps<T> {
  columns: ColumnDef<T>[];
  data?: T[];
  pagination?: PaginationTable;
}

export function TableDataProvider<T extends TableColumnData>({
  children,
  data,
  columns,
  pagination: defaultPagination,
}: PropsWithChildren<IAdvancedTableProps<T>>) {
  const [tableMode, setTableMode] = useState<ActiveTableMode>(ActiveTableMode.NONE);
  const [internalColumns, setInternalColumns] = useState<ColumnDef<T>[]>(columns || []);
  const [internalData, setInternalData] = useState<T[]>(data || []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnPinning, setColumnPinning] = useState<{
    right: string[];
    left: string[];
  }>({
    right: [],
    left: [],
  });

  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationTable>(
    defaultPagination || {
      pageIndex: 0,
      pageSize: 9999999999,
      usePagination: false,
    }
  );

  const table = useReactTable({
    data: internalData,
    columns: internalColumns,
    state: {
      columnFilters,
      columnVisibility,
      columnPinning,
      globalFilter,
      rowSelection,
      pagination,
    },
    filterFns: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: 'fuzzy',
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning as any,
    onColumnFiltersChange: setColumnFilters,

    onPaginationChange: (value) => {
      setPagination((prev) => {
        if (prev?.usePagination) {
          return prev;
        }
        return {
          ...prev,
          ...value,
        };
      });
    },

    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });
  const isLoading = useMemo(() => tableMode == ActiveTableMode.LOAD_DATA, [tableMode]);
  const setIsLoading = useCallback((isLoading: boolean) => {
    setTableMode(isLoading ? ActiveTableMode.LOAD_DATA : ActiveTableMode.NONE);
  }, []);

  const ctxValue: TableContext<T> = [
    {
      table: table as TableType<TableColumnData>,
      pagination,
      globalFilter,
      isLoading,
      active: {
        mode: tableMode,
      },
    },
    {
      setInternalData,
      setInternalColumns,
      setPagination,
      setGlobalFilter,
      setColumnPinning,
      setIsLoading,
    },
  ];

  return (
    <TooltipProvider>
      <TableDataProviderContext.Provider value={ctxValue}>{children}</TableDataProviderContext.Provider>
    </TooltipProvider>
  );
}
