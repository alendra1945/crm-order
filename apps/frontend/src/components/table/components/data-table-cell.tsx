import { flexRender } from '@tanstack/react-table';
import * as React from 'react';
import { CSSProperties } from 'react';
import { TableCell } from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/table-utils';
import { Cell } from '@tanstack/react-table';

export interface IDataTableCellEdit<T> {
  cell: Cell<T, unknown>;
}

export function DataTableCell<T>({ cell }: IDataTableCellEdit<T>) {
  const pinStyle = getCommonPinningStyles(cell.column);
  const combinedStyle: CSSProperties = {
    opacity: 1,
    position: 'relative',
    transition: 'width transform 0.2s ease-in-out',
    width: cell.column.getSize(),
    ...(pinStyle || {}),
    alignContent: 'center',
  };

  return (
    <TableCell style={combinedStyle} className='px-5 bg-white py-3 group-hover/row-table:bg-gray-50'>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
}
