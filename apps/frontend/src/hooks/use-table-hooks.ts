import { createContext, useContext } from "react";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";

export enum ActiveTableMode {
  NONE = "",
  LOAD_DATA = "LOAD_DATA",
}
export type TableColumnData = Record<string, any>;
export interface TableProviderState {
  table: TableType<TableColumnData>;
  pagination: PaginationTable;
  globalFilter: string;
  isLoading: boolean;
  active: {
    mode: ActiveTableMode;
  };
}

export type PaginationTable = {
  pageIndex: number;
  pageSize: number;
  usePagination: boolean;
};
export interface TableProviderAction<T> {
  setInternalData: React.Dispatch<React.SetStateAction<T[]>>;
  setInternalColumns: React.Dispatch<React.SetStateAction<ColumnDef<T>[]>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationTable>>;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setColumnPinning: React.Dispatch<
    React.SetStateAction<{
      right: string[];
      left: string[];
    }>
  >;
  setIsLoading(isLoading: boolean): void;
}
export type TableContext<T> = [TableProviderState, TableProviderAction<T>];

function createTableContext<T>() {
  return createContext<TableContext<T> | null>(null);
}
export const TableDataProviderContext = createTableContext<any>();

export function useTableDataContext<TData>() {
  const context = useContext(
    TableDataProviderContext as ReturnType<typeof createTableContext<TData>>
  );

  if (!context) {
    throw new Error("Cannot use TableDataContext outside TableDataProvider");
  }
  return context;
}
