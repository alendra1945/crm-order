import { flexRender, Header, Table } from '@tanstack/react-table';
import { CSSProperties } from 'react';
import { TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  ArrowDownNarrowWideIcon,
  ArrowUpNarrowWideIcon,
  MoveLeftIcon,
  MoveRightIcon,
  PinOffIcon,
  ChevronsUpDown,
  PinIcon,
} from 'lucide-react';
import { getCommonPinningStyles } from '@/lib/table-utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipPortal } from '@/components/ui/tooltip';
export function DataTableHeader<T>({ header }: { header: Header<T, unknown>; table: Table<T> }) {
  const { column, isPlaceholder } = header;

  const pinStyle = getCommonPinningStyles(column);
  const combinedStyles: CSSProperties = {
    opacity: 1,
    position: 'relative',
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.column.getSize() * header.colSpan,
    zIndex: 0,
    ...(pinStyle || {}),
  };

  return (
    <TableHead
      className={'overflow-hidden h-10 flex items-center w-full'}
      colSpan={header.colSpan}
      style={combinedStyles}
    >
      <ContextMenu modal={false}>
        <ContextMenuTrigger asChild>
          <div className={'flex w-full flex-row items-center space-x-1'}>
            {column.columnDef.meta?.usingTooltip ? (
              <Tooltip>
                <TooltipTrigger asChild={!isPlaceholder}>
                  {isPlaceholder ? null : (
                    <Button
                      onClick={() => column.toggleSorting()}
                      aria-label={
                        column.getIsSorted() === 'desc'
                          ? 'Sorted descending. Click to sort ascending.'
                          : column.getIsSorted() === 'asc'
                            ? 'Sorted ascending. Click to sort descending.'
                            : 'Not sorted. Click to sort ascending.'
                      }
                      variant='ghost'
                      size='sm'
                      className='w-[calc(100%-20px)] hover:bg-transparent capitalize'
                    >
                      <div className='overflow-hidden flex-1 text-ellipsis text-[#505050] font-normal tracking-wide'>
                        {flexRender(column.columnDef.header, header.getContext())}
                      </div>
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent>{flexRender(column.columnDef.header, header.getContext())}</TooltipContent>
                </TooltipPortal>
              </Tooltip>
            ) : (
              <div className='w-[calc(100%-20px)] px-2 capitalize overflow-hidden text-[#505050] flex-1 text-ellipsis tracking-wide'>
                {flexRender(column.columnDef.header, header.getContext())}
              </div>
            )}

            {/* {!column.columnDef.meta?.disablePinning && !isPlaceholder && (
              <Tooltip>
                <TooltipTrigger>
                  {column.getIsPinned() ? (
                    <PinOffIcon className={'size-4 shrink-0 text-gray-600'} onClick={() => column.pin(false)} />
                  ) : (
                    <PinIcon className={'size-4 shrink-0 text-gray-600'} onClick={() => column.pin('left')} />
                  )}
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent>
                    <p>{column.getIsPinned() ? 'Unpin this column' : 'Pin this column'}</p>
                  </TooltipContent>
                </TooltipPortal>
              </Tooltip>
            )} */}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className='w-54 py-3 px-2 border-gray-200 shadow-xs'>
          {column.getIsPinned() ? (
            <ContextMenuItem
              className='gap-3 cursor-pointer text-xs font-medium text-gray-500 font-lexend'
              onClick={() => column.pin(false)}
            >
              Unpin
              <ContextMenuShortcut>
                <PinOffIcon className={'size-4 shrink-0 text-gray-600'} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          ) : null}
          {column.getIsPinned() ? null : (
            <ContextMenuItem
              className='gap-3 cursor-pointer text-xs font-medium text-gray-500 font-lexend'
              onClick={() => column.pin('left')}
            >
              Pin Left
              <ContextMenuShortcut>
                <MoveLeftIcon className={'size-4 shrink-0 text-gray-600'} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          )}
          {column.getIsPinned() ? null : (
            <ContextMenuItem
              className='gap-3 cursor-pointer text-xs font-medium text-gray-500 font-lexend'
              onClick={() => column.pin('right')}
            >
              Pin Right
              <ContextMenuShortcut>
                <MoveRightIcon className={'size-4 shrink-0 text-gray-600'} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          )}
          <ContextMenuSeparator />
          {column.getIsSorted() === 'asc' ? null : (
            <ContextMenuItem
              className='gap-3 cursor-pointer text-xs font-medium text-gray-500 font-lexend'
              onClick={() => column.toggleSorting(false)}
            >
              Sort Ascending
              <ContextMenuShortcut>
                <ArrowDownNarrowWideIcon className={'size-4 shrink-0 text-gray-600'} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          )}
          {column.getIsSorted() === 'desc' ? null : (
            <ContextMenuItem
              className='gap-3 cursor-pointer text-xs font-medium text-gray-500 font-lexend'
              onClick={() => column.toggleSorting(true)}
            >
              Sort Descending
              <ContextMenuShortcut>
                <ArrowUpNarrowWideIcon className={'size-4 shrink-0 text-gray-600'} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          )}
          {column.getIsSorted() === 'asc' || column.getIsSorted() === 'desc' ? (
            <ContextMenuItem
              className='gap-3 cursor-pointer text-xs font-medium text-gray-500 font-lexend'
              onClick={() => column.clearSorting()}
            >
              Clear Sorting
              <ContextMenuShortcut>
                <ChevronsUpDown className={'size-4 shrink-0 text-gray-600'} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>
      {!column.columnDef.meta?.disableResize && (
        <div
          {...{
            onDoubleClick: () => header.column.resetSize(),
            onMouseDown: header.getResizeHandler(),
            onTouchStart: header.getResizeHandler(),
            className: `h-full resizer ltr ${header.column.getIsResizing() ? 'isResizing' : ''}`,
          }}
        />
      )}
    </TableHead>
  );
}
