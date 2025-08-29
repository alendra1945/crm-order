import { modalEventSubject } from '@/hooks/use-modal-store';
import { getAllOrderQuery, Order, useDeleteOrderMutation } from '@/hooks/use-order-query';
import { useSubscribe } from '@/hooks/use-subscribe';
import { useTableDataContext } from '@/hooks/use-table-hooks';
import { useState } from 'react';
import { toast } from 'sonner';

export const useOrderTableData = () => {
  const [page, setActivePage] = useState(1);
  const [totalData, setTotalData] = useState(10);
  const [{ isLoading }, { setIsLoading, setInternalData }] = useTableDataContext<Order>();
  const { mutateAsync: deleteOrderQuery } = useDeleteOrderMutation();
  const fetchDataOrder = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getAllOrderQuery({
        page: page,
        limit: 10,
      });
      setInternalData(data.data || []);
      setTotalData(data.pagination.total);
      return data;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const deleteOrder = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteOrderQuery(id);
      setActivePage(1);
      fetchDataOrder(1);
      toast.success('Order deleted successfully');
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to delete order');
    }
  };
  useSubscribe({
    subject: modalEventSubject,
    next: async ({ type, data, status }) => {
      if (status === 'close' && type == 'alertConfirmation' && data?.isConfirm && data?.detail?.id) {
        deleteOrder(data.detail.id);
      }
    },
    disabled: false,
  });
  return {
    fetchDataOrder,
    page,
    totalData,
    isLoading,
    setActivePage,
  };
};
