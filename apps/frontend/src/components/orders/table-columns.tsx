'use client';
import { Badge } from '@/components/ui/badge';
import { useModal } from '@/hooks/use-modal-store';
import { OrderSchemaFromApi, StatusOrderSchema } from '@/hooks/use-order-query';
import { usePrintReportTemplateMutation } from '@/hooks/use-report-template-query';
import { cn, formatCurrencyTOIDR } from '@/lib/utils';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, PenIcon, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
interface OrderInterface {}
export interface ColumnsGradebook extends Omit<OrderInterface, 'student_first_name' | 'student_last_name'> {
  fullname: string;
  avatar: string;
}

type DataColumnOrder = z.infer<typeof OrderSchemaFromApi>;
type CellContextOrder = CellContext<DataColumnOrder, any>; //eslint-disable-line

const MenuColumn = ({ row }: CellContextOrder) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const handleDelete = () => {
    onOpen('alertConfirmation', {
      alertConfirmation: {
        detail: {
          id: row.original.id,
        },
      },
    });
  };
  return (
    <DropdownMenu>
      {StatusOrderSchema.safeParse(row.original.status).data !== 'PAID' && (
        <DropdownMenuTrigger className='hover:bg-neutral-900/5 size-6 [&_svg]:size-4 ml-auto cursor-pointer'>
          <EllipsisVertical />
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent className='shadow-none border-none rounded-sm'>
        <DropdownMenuItem
          onClick={() => {
            router.push(`/orders/${row.original.id}`);
          }}
        >
          <PenIcon className='size-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleDelete();
          }}
          className='text-red-400 hover:!text-red-500'
        >
          <Trash className='size-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DownloadButton = ({ row }: CellContextOrder) => {
  const { mutateAsync: printReportTemplate, isPending } = usePrintReportTemplateMutation('invoice');
  const handlePrint = async () => {
    try {
      await printReportTemplate({
        reportType: 'dashboard',
        orderId: row.original.id,
        name: row.original.orderNumber,
      });
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };
  return (
    <Button
      variant='outline'
      size='sm'
      className='text-sm text-gray-600 hover:text-gray-700 font-normal'
      disabled={isPending}
      onClick={handlePrint}
    >
      {isPending ? 'Generating...' : row.original.status === 'PAID' ? 'Download Invoice' : 'Download Proforma'}
    </Button>
  );
};
export const defaultColums: ColumnDef<DataColumnOrder>[] = [
  {
    header: 'Order',
    accessorKey: 'orderNumber',
    cell: ({ row, renderValue }) => {
      return (
        <div className='flex flex-col'>
          <p className='text-sm font-medium text-gray-800'>#{renderValue() as string}</p>
          <p className='text-xs text-gray-600'>{row.original.orderItems.length} items</p>
        </div>
      );
    },
    size: 220,
  },
  {
    header: 'Total',
    accessorKey: 'totalPrice',
    cell: ({ row }) => {
      return (
        <p className='text-sm text-gray-700 font-medium'>{formatCurrencyTOIDR(Number(row.original.totalPrice || 0))}</p>
      );
    },
    size: 120,
  },

  {
    header: 'Status',
    cell: ({ row }) => {
      const st = StatusOrderSchema.safeParse(row.original.status).data || 'PENDING';
      return (
        <Badge
          className={cn(
            'text-xs font-medium capitalize',
            st === 'PAID'
              ? 'border-green-500 text-green-600'
              : st === 'CANCELLED'
                ? 'border-rose-500 text-rose-600'
                : 'border-yellow-500 text-yellow-600'
          )}
          variant='outline'
        >
          {st.toLowerCase()}
        </Badge>
      );
    },
    size: 120,
  },
  {
    header: 'Download',
    accessorKey: 'createdAt',
    cell: DownloadButton,
  },
  {
    header: '',
    accessorKey: 'id',
    size: 5,
    cell: MenuColumn,
  },
];
