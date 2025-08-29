'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Product } from '@/hooks/use-product-query';
import { cn, formatCurrencyTOIDR, getRandomColorById } from '@/lib/utils';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, PenIcon, Trash } from 'lucide-react';
import CopyBtn from '../base/copy-btn';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

import { useModal } from '@/hooks/use-modal-store';
import { useRouter } from 'next/navigation';

type DataColumnProduct = Product & { id: string };
type CellContextProduct = CellContext<DataColumnProduct, any>;

export const MenuColumns = ({ row }: CellContextProduct) => {
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
      <DropdownMenuTrigger className='hover:bg-neutral-900/5 size-6 [&_svg]:size-4 ml-auto cursor-pointer'>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='shadow-none border-none rounded-sm'>
        <DropdownMenuItem
          onClick={() => {
            router.push(`/products/${row.original.id}`);
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

const ColumnProduct = ({ row, renderValue }: CellContextProduct) => {
  return (
    <div className={cn('flex items-center gap-2')}>
      <Avatar className={cn('size-8 shadow-xs')}>
        <AvatarFallback
          className='capitalize font-medium text-white text-xs'
          style={{
            backgroundColor: getRandomColorById(row.index),
          }}
        >
          {row.original.name?.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className='w-fit'>
        <p className='text-sm text-ellipsis font-medium text-gray-800'>{renderValue() as string}</p>
        <p className='text-xs text-ellipsis'>{row.original.sku}</p>
      </div>
    </div>
  );
};

export const defaultColums: ColumnDef<DataColumnProduct>[] = [
  {
    header: 'Product',
    accessorFn: (row) => row.name,
    cell: ColumnProduct,
    size: 250,
  },
  {
    header: 'SKU',
    accessorKey: 'sku',
    cell: ({ row }) => {
      return (
        <div className='w-full flex gap-x-5'>
          <p className='text-sm text-gray-600 hover:text-gray-700 font-medium'>{row.original.sku}</p>
          <CopyBtn value={row.original.sku} />
        </div>
      );
    },
  },
  {
    header: 'Category',
    accessorKey: 'category',
    cell: ({ row }) => {
      return <p className='text-sm text-gray-600 hover:text-gray-700 font-normal'>{row.original.category}</p>;
    },
  },
  {
    header: 'Price',
    accessorKey: 'price',
    cell: ({ row }) => {
      return (
        <p className='text-sm text-gray-600 hover:text-gray-700 font-normal'>
          {formatCurrencyTOIDR(Number(row.original.price || 0))}
        </p>
      );
    },
  },
  {
    header: 'Quantity',
    accessorKey: 'quantity',
    cell: ({ row }) => {
      return <p className='text-sm text-gray-600 hover:text-gray-700 font-normal'>{row.original.quantity}</p>;
    },
  },
  {
    header: '',
    accessorKey: 'id',
    size: 5,
    cell: MenuColumns,
  },
];
