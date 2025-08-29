import { Button } from '../ui/button';

interface PaginationProps {
  limit: number;
  page: number;
  total: number;
  onPageChange?: (page: number) => void;
}

const Pagination = ({ limit, page, total = 1, onPageChange }: PaginationProps) => {
  const totalPage = Math.ceil(total / limit);
  const renderPageButtons = () => {
    if (totalPage <= 6) {
      return Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNum) => (
        <Button
          key={`page-${pageNum}`}
          variant='outline'
          size='sm'
          className={pageNum === page ? 'bg-gray-200 text-body' : 'text-body'}
          onClick={() => onPageChange && onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ));
    }

    const buttons = [];

    // Always show first page
    buttons.push(
      <Button
        key='page-1'
        variant='outline'
        size='sm'
        className={page === 1 ? 'bg-gray-200 text-body' : 'text-body'}
        onClick={() => onPageChange && onPageChange(1)}
      >
        1
      </Button>
    );

    if (page <= 4) {
      // Show first 4 pages
      for (let i = 2; i <= 4; i++) {
        buttons.push(
          <Button
            key={`page-${i}`}
            variant='outline'
            size='sm'
            className={i === page ? 'bg-gray-200 text-body' : 'text-body'}
            onClick={() => onPageChange && onPageChange(i)}
          >
            {i}
          </Button>
        );
      }
      buttons.push(
        <span key='dots-end' className='px-2'>
          ...
        </span>
      );
    } else if (page >= totalPage - 3) {
      // Show last 4 pages
      buttons.push(
        <span key='dots-start' className='px-2'>
          ...
        </span>
      );
      for (let i = totalPage - 3; i < totalPage; i++) {
        buttons.push(
          <Button
            key={`page-${i}`}
            variant='outline'
            size='sm'
            className={i === page ? 'bg-gray-200 text-body' : 'text-body'}
            onClick={() => onPageChange && onPageChange(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Show current page and neighbors
      buttons.push(
        <span key='dots-start' className='px-2'>
          ...
        </span>
      );
      for (let i = page - 1; i <= page + 1; i++) {
        buttons.push(
          <Button
            key={`page-${i}`}
            variant='outline'
            size='sm'
            className={i === page ? 'bg-gray-200 text-body' : 'text-body'}
            onClick={() => onPageChange && onPageChange(i)}
          >
            {i}
          </Button>
        );
      }
      buttons.push(
        <span key='dots-end' className='px-2'>
          ...
        </span>
      );
    }

    // Always show last page
    buttons.push(
      <Button
        key={`page-${totalPage}`}
        variant='outline'
        size='sm'
        className={page === totalPage ? 'bg-gray-200 text-body' : 'text-body'}
        onClick={() => onPageChange && onPageChange(totalPage)}
      >
        {totalPage}
      </Button>
    );

    return buttons;
  };

  const limits = limit || Math.ceil(total / totalPage);
  const start = page * limits - limits + 1;
  const end = page * limits;

  return (
    <div className='flex items-center justify-between py-4'>
      <div className='text-sm text-body'>
        Showing {start || 0} to {end || 0} of {total || 0} entries
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          disabled={page <= 1}
          onClick={() => onPageChange && onPageChange(page - 1)}
          className='text-body'
        >
          Previous
        </Button>
        {renderPageButtons()}
        <Button
          variant='outline'
          size='sm'
          disabled={page >= totalPage}
          onClick={() => onPageChange && onPageChange(page + 1)}
          className='text-body'
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
