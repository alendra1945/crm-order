import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
// import { exportExcel, exportExcelData } from "@/lib/table-utils";

export interface IDataTableExport<T> {
  onUserExport?: (data: T[]) => void;
}

export function DataTableExport<T>({ onUserExport }: IDataTableExport<T>) {
  const onPress = () => {
    // const col = table.getAllColumns();
    // const data = exportExcelData(
    //   table.options.data,
    //   col,
    //   exportProps?.excludeColumns ?? []
    // );
    // if (onUserExport) {
    //   onUserExport(data);
    // } else {
    //   exportExcel(data, exportProps?.exportFileName ?? "");
    // }
  };

  return (
    <Button
      onClick={onPress}
      aria-label='Export data'
      variant='ghost'
      size='sm'
      className='ml-auto h-8 lg:flex text-zinc-600 text-base'
    >
      <DownloadIcon className='mr-2 size-4' />
      Export
    </Button>
  );
}
