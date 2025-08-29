'use client';
import { Badge } from '@/components/ui/badge';
import { useModal } from '@/hooks/use-modal-store';
import { ReportTemplateFromApi } from '@/hooks/use-report-template-query';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { EllipsisVertical, NotebookText, PenIcon, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

type DataColumnReportTemplate = ReportTemplateFromApi & { id: string };
type CellContextReportTemplate = CellContext<DataColumnReportTemplate, any>; //eslint-disable-line

const MenuColumn = ({ row }: CellContextReportTemplate) => {
  const { onOpen } = useModal();
  const handleDelete = () => {
    onOpen('alertConfirmation', {
      alertConfirmation: {
        detail: {
          id: row.original.id,
        },
      },
    });
  };
  const router = useRouter();
  const onEdit = () => {
    onOpen('createReportTemplate', {
      reportTemplateData: {
        id: row.original.id,
        data: row.original,
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
            router.push(`/reporting-template/${row.original.id}/templates`);
          }}
        >
          <NotebookText className='size-4' />
          View Template
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
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
export const defaultColums: ColumnDef<DataColumnReportTemplate>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => {
      return (
        <div className='w-full flex flex-col gap-y-1'>
          <p className='text-sm text-gray-800 hover:text-gray-900 font-medium'>{row.original.name}</p>
          {row.original.description && <p className='text-xs text-gray-500'>{row.original.description}</p>}
        </div>
      );
    },
    size: 250,
  },

  {
    header: 'Document Target',
    accessorKey: 'documentTarget',
    cell: ({ row }) => {
      return (
        <div className='w-full'>
          <p className='text-sm capitalize text-gray-600 hover:text-gray-700 font-normal'>
            {row.original.documentTarget}
          </p>
        </div>
      );
    },
  },
  {
    header: 'Status',
    accessorKey: 'isDefault',
    cell: ({ row }) => {
      if (row.original.isDefault) {
        return (
          <Badge
            className={`text-xs font-medium ${
              row.original.isDefault
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-gray-500 text-gray-600 bg-gray-50'
            }`}
            variant='outline'
          >
            Using as Default
          </Badge>
        );
      }
      return <span className='text-xs font-medium text-gray-500'>-</span>;
    },
  },
  {
    header: 'Created Date',
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      return (
        <div className='w-full'>
          <p className='text-sm text-gray-600 hover:text-gray-700 font-normal'>
            {dayjs(row.original.createdAt).format('DD MMM YYYY')}
          </p>
        </div>
      );
    },
  },
  {
    header: '',
    accessorKey: 'id',
    size: 5,
    cell: MenuColumn,
  },
];
