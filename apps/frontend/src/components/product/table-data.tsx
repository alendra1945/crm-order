import { modalEventSubject } from '@/hooks/use-modal-store';
import { getAllProductQuery, Product, useDeleteProductMutation } from '@/hooks/use-product-query';
import { useSubscribe } from '@/hooks/use-subscribe';
import { useTableDataContext } from '@/hooks/use-table-hooks';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export const useProductTableData = () => {
  const [page, setActivePage] = useState(1);
  const [totalData, setTotalData] = useState(10);
  const [{ isLoading }, { setIsLoading, setInternalData }] = useTableDataContext<Product>();
  const { mutateAsync: deleteProductQuery } = useDeleteProductMutation();
  const fetchDataProduct = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getAllProductQuery({
        page: page,
        limit: 10,
      });
      setInternalData(data.data || []);
      setTotalData(data.pagination.total);
      return data;
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);
  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteProductQuery(id);
      setActivePage(1);
      fetchDataProduct(1);
      toast.success('Product deleted successfully');
    } catch {
      setIsLoading(false);
      toast.error('Failed to delete product');
    }
  };
  useSubscribe({
    subject: modalEventSubject,
    next: async ({ type, data, status }) => {
      if (status === 'close' && type == 'alertConfirmation' && data?.isConfirm && data?.detail?.id) {
        deleteProduct(data.detail.id);
      }
    },
    disabled: false,
  });
  return {
    fetchDataProduct,
    page,
    totalData,
    setActivePage,
    isLoading,
  };
};
