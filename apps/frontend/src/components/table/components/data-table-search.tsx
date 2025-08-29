import { useTableDataContext } from "@/hooks/use-table-hooks";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableInput } from "./data-table-input";

export interface DataTableSearchProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DataTableSearch = ({
  className,
  ...props
}: DataTableSearchProps) => {
  const [{ globalFilter }, { setGlobalFilter }] = useTableDataContext();
  return (
    <div className={cn("relative", className)} {...props}>
      <SearchIcon
        size={16}
        className="absolute z-[1] left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
      />
      <DataTableInput
        placeholder="Search"
        className="pl-10"
        value={globalFilter ?? ""}
        onChange={(val) => setGlobalFilter(String(val || ""))}
      />
    </div>
  );
};
