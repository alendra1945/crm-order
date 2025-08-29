import { ColumnsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/table-core";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}
export function DataTableColumnVisibility<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Toggle columns"
          variant="ghost"
          size="sm"
          className="ml-auto hidden h-8 lg:flex text-zinc-600 text-base"
        >
          <ColumnsIcon className="mr-2 size-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 max-h-[400px] overflow-auto"
      >
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {/* <span className="truncate text-base capitalize font-inter">
                  {typeof column.columnDef.header === "string"
                    ? String(column.columnDef.header)
                    : String(
                        column.columnDef?.meta?.header || column.columnDef.id
                      )}
                </span> */}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
