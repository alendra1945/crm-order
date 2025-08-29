import { Button } from "@/components/ui/button";
import { useTableDataContext } from "@/hooks/use-table-hooks";
// import { ListChecksIcon, ListXIcon } from "lucide-react";

export function DataTableSelections<T>() {
  const [{ table }] = useTableDataContext<T>();
  // const { isSelecting, setIsSelecting } = useDataGridContext();
  const onPress = () => {
    table.resetRowSelection();
  };
  return (
    <Button
      onClick={onPress}
      aria-label="Toggle selection"
      variant="ghost"
      size="sm"
      className="ml-auto hidden h-8 lg:flex text-zinc-600 text-base"
    >
      {/* {isSelecting ? (
        <ListXIcon className="mr-2 size-4" />
      ) : (
        <ListChecksIcon className="mr-2 size-4" />
      )}
      {isSelecting ? "Reset Rows" : "Select Rows"} */}
    </Button>
  );
}
