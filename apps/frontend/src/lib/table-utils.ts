import { compareItems, rankItem } from '@tanstack/match-sorter-utils';
import { Column } from '@tanstack/react-table';
import { FilterFn, SortingFn, sortingFns } from '@tanstack/table-core';
import { CSSProperties } from 'react';
// import { utils, writeFile } from "xlsx";

export function getCommonPinningStyles<T>(column: Column<T>): CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-3px 0 3px -3px #E4E4E5 inset'
      : isFirstRightPinnedColumn
        ? '3px 0 3px -3px #E4E4E5 inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.98 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}

// eslint-disable-next-line
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // eslint-disable-line
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value, {
    threshold: 3,
  });

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
// eslint-disable-next-line
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;
  // eslint-disable-next-line
  if ((rowA.columnFiltersMeta[columnId] as any)?.itemRank && (rowB.columnFiltersMeta[columnId] as any)?.itemRank) {
    dir = compareItems(
      (rowA.columnFiltersMeta[columnId] as any)?.itemRank, // eslint-disable-line
      (rowB.columnFiltersMeta[columnId] as any)?.itemRank // eslint-disable-line
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export function exportExcelData<T>(rows: T[], columns: Column<T>[], excludeColumns: string[]): T[] {
  const data: T[] = [];
  const naming: Record<string, any> = {};
  const columnOption: Record<string, any[]> = {};
  // for (let i = 0; i < columns.length; i++) {
  //   const col = columns[i];
  //   if (excludeColumns.length > 0 && excludeColumns.includes(col.id)) {
  //     continue;
  //   }
  //   if ((col.columnDef as any)?.accessorKey?.startsWith("[headerId]")) {
  //     columnOption[(col.columnDef as any).accessorKey] =
  //       col.columnDef?.meta?.options || [];
  //   }
  //   naming[(col.columnDef as any).accessorKey] =
  //     typeof col.columnDef.header === "string"
  //       ? String(col.columnDef.header)
  //       : String(col.columnDef?.meta?.header || col.columnDef.id);
  // }

  // rows.forEach((item) => {
  //   const obj = item as { [K: string]: any };
  //   const tempObj: { [k: string]: any } = {};
  //   for (const objKey in naming) {
  //     if (objKey.startsWith("[headerId]")) {
  //       if (columnOption[objKey]?.length) {
  //         const selectedOption = columnOption[objKey].find(
  //           (c) => c.id === obj[objKey]
  //         );
  //         tempObj[naming[objKey]] = selectedOption?.label || "-";
  //       }
  //     } else {
  //       tempObj[naming[objKey]] = obj[objKey] || "-";
  //     }
  //   }
  //   data.push(tempObj as T);
  // });
  return data;
}

export function exportExcel<T>(data: T[], exportFilename: string) {
  // try {
  //   const wb = utils.book_new();
  //   const ws = utils.json_to_sheet(data);
  //   utils.book_append_sheet(wb, ws, 'Exported');
  //   writeFile(wb, exportFilename.concat('.xlsx'));
  // } catch (ex: any) {
  //   alert(ex.message);
  // }
}
