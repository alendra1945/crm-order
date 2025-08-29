import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DownloadIcon, EyeOff, ListXIcon, XIcon } from 'lucide-react';
// import { exportExcel, exportExcelData } from "@/lib/table-utils";
import { useTableDataContext } from '@/hooks/use-table-hooks';
import dayjs from 'dayjs';

interface IDataTableFloatingBar<T> {
  onUserExport?: (rows: T[]) => void;
  onHide?: (rows: T[]) => void;
}
export function DataTableFloatingBar<T>({
  // onUserExport,
  onHide,
}: IDataTableFloatingBar<T>) {
  const [{ table }] = useTableDataContext();
  const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;
  const isRowSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();
  const naming: { [k: string]: any } = {};
  for (let i = 0; i < table.options.columns.length; i++) {
    const col = table.options.columns[i];
    naming[col.id as string] = col.header as string;
  }

  const currentFilters = table.getState().columnFilters.map((item: any) => {
    const fieldName = naming[item.id];
    if (item.value instanceof Array) {
      item.value = item.value.map((ii: any) => (!ii ? '♾️' : ii));
      // range filter
      return {
        columnId: item.id,
        filter: `${fieldName} In Range Of ( ${item.value.join(' - ')} )`,
      };
    }
    if (typeof item.value === 'string') {
      // either search string or select
      return {
        columnId: item.id,
        filter: `${fieldName} Equals/Contains '${item.value}'`,
      };
    }
    if (typeof item.value === 'object' && item.value !== null && !(item.value instanceof Array)) {
      if (Object.keys(item.value).includes('from')) {
        // datetime
        if (typeof item.value.from === 'string') {
          item.value.from = dayjs(item.value.from).format('yyyy/MM/dd');
          item.value.to = dayjs(item.value.to).format('yyyy/MM/dd');
        } else {
          item.value.from = dayjs(item.value.from).format('yyyy/MM/dd');
          item.value.to = dayjs(item.value.to).format('yyyy/MM/dd');
        }
        return {
          columnId: item.id,
          filter: `${fieldName} Is Between ( ${item.value.from} - ${item.value.to} )`,
        };
      }
    }
    return item;
  });
  const onRemoveColumnFilter = (columnId: string) => {
    table.setColumnFilters(table.getState().columnFilters.filter((item) => item.id !== columnId));
  };
  const onPressResetFilter = () => {
    table.resetColumnFilters();
    table.resetGlobalFilter();
  };
  const onHideInner = () => {
    // const rows = table.getSelectedRowModel().rows.map((item) => item.original);
    // onHide && onHide(rows);
  };
  const onExport = () => {
    // const rows = table.getSelectedRowModel().rows.map((item) => item.original);
    // const data = exportExcelData(
    //   rows,
    //   table.getAllColumns(),
    //   exportProps?.excludeColumns ?? [IS_ADD_COLUMN, "select"]
    // );
    // if (onUserExport) {
    //   onUserExport(data);
    // } else {
    //   exportExcel(data, exportProps?.exportFileName ?? "");
    // }
  };

  return (
    <div className='fixed inset-x-0 bottom-4 z-50 w-full px-4'>
      <div className='w-full overflow-x-auto space-y-2'>
        {isFiltered && (
          <div className='mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl'>
            <div className='flex h-7 items-center rounded-md border '>
              <Button onClick={onPressResetFilter} variant='outline' size='sm' className='h-8'>
                <XIcon className='w-4 h-4 mr-1' />
                Clear Filters
              </Button>
            </div>
            {currentFilters.length > 0 ? '●' : ''}
            {currentFilters.length > 0 &&
              currentFilters.map(
                (
                  f: {
                    columnId: string;
                    filter: string;
                  },
                  index: number
                ) => (
                  <Button
                    onClick={() => onRemoveColumnFilter(f.columnId)}
                    key={String(index).concat('--filter')}
                    variant='outline'
                    size='sm'
                    className='h-8'
                  >
                    <XIcon className='w-4 h-4 mr-1' />
                    {f.filter}
                  </Button>
                )
              )}
          </div>
        )}
        {isRowSelected && (
          <div className='mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl'>
            <div className='flex h-7 items-center rounded-md border '>
              <Button onClick={() => table.resetRowSelection()} variant='outline' size='sm' className='h-8'>
                <ListXIcon className='w-4 h-4 mr-1' />
                Clear Selection
              </Button>
            </div>
            ●
            {isRowSelected && onHide !== undefined ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='destructive' size='icon' className='h-8' onClick={onHideInner}>
                    <EyeOff className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hide current rows</p>
                </TooltipContent>
              </Tooltip>
            ) : null}
            <Tooltip>
              <TooltipTrigger>
                <Button onClick={onExport} variant='outline' size='icon' className='h-8'>
                  <DownloadIcon className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export current rows</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
