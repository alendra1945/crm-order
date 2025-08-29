import { useState } from 'react';
import { useTableDataContext } from '@/hooks/use-table-hooks';
import { modalEventSubject } from '@/hooks/use-modal-store';
import { useSubscribe } from '@/hooks/use-subscribe';
import {
  getAllReportTemplateQuery,
  useDeleteReportTemplateMutation,
  ReportTemplateFromApi,
} from '@/hooks/use-report-template-query';
import { toast } from 'sonner';

export const useReportTemplateTableData = () => {
  const [page, setActivePage] = useState(1);
  const [totalData, setTotalData] = useState(10);
  const [{ isLoading }, { setIsLoading, setInternalData }] = useTableDataContext<ReportTemplateFromApi>();
  const { mutateAsync: deleteReportTemplateQuery } = useDeleteReportTemplateMutation();

  const fetchDataReportTemplate = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getAllReportTemplateQuery({
        page: page,
        limit: 10,
      });
      setInternalData(data.data || []);
      setTotalData(data.pagination.total);
      return data;
    } catch (error) {
      toast.error('Failed to fetch report templates');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReportTemplate = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteReportTemplateQuery(id);
      setActivePage(1);
      fetchDataReportTemplate(1);
      toast.success('Report template deleted successfully');
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to delete report template');
    }
  };

  useSubscribe({
    subject: modalEventSubject,
    next: async ({ type, data, status }) => {
      if (status === 'close' && type === 'alertConfirmation' && data?.isConfirm && data?.detail?.id) {
        deleteReportTemplate(data.detail.id);
      }
      if (status === 'close' && type === 'createReportTemplate' && data?.refetchTemplates) {
        setActivePage(1);
        fetchDataReportTemplate(1);
      }
    },
    disabled: false,
  });

  return {
    fetchDataReportTemplate,
    page,
    totalData,
    isLoading,
    setActivePage,
  };
};
