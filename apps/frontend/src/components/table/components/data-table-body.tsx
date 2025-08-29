import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DataTableCell } from "./data-table-cell";
import { type Table } from "@tanstack/react-table";
import { VirtualItem, Virtualizer } from "@tanstack/virtual-core";

import { Row } from "@tanstack/table-core";
import { cn } from "@/lib/utils";
export interface IDataTableBody<T> {
  table: Table<T>;
  onClick?: (prop: T) => void;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualPaddingLeft: number | undefined;
  virtualPaddingRight: number | undefined;
  virtualColumns: VirtualItem[];
}

export function DataTableBody<T>(props: IDataTableBody<T>) {
  const {
    table,
    virtualColumns,
    rowVirtualizer,
    virtualPaddingRight,
    virtualPaddingLeft,
  } = props;
  const virtualRows = rowVirtualizer.getVirtualItems();
  const { rows } = table.getRowModel();
  return (
    <TableBody
      style={{
        display: "grid",
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: "relative",
      }}
    >
      {virtualRows.map((virtualRow) => {
        const row = rows[virtualRow.index] as unknown as Row<T>;
        const visibleCells = row.getVisibleCells();

        return (
          <TableRow
            onClick={() => props.onClick && props.onClick(row.original)}
            key={row.id}
            className={cn(
              "border-0 group/row-table",
              props.onClick && "cursor-pointer"
            )}
            data-index={virtualRow.index}
            ref={(node) => rowVirtualizer.measureElement(node)}
            style={{
              display: "flex",
              position: "absolute",
              transform: `translateY(${virtualRow.start}px)`,
              width: "100%",
            }}
          >
            {virtualPaddingLeft ? (
              <TableCell
                style={{ display: "flex", width: virtualPaddingLeft }}
                className="px-5 py-3"
              />
            ) : null}
            {virtualColumns.map((vc) => {
              const cell = visibleCells[vc.index];
              return <DataTableCell cell={cell as any} key={cell.id} />;
            })}
            {virtualPaddingRight ? (
              <TableCell
                style={{ display: "flex", width: virtualPaddingRight }}
                className="px-5 py-3"
              />
            ) : null}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
