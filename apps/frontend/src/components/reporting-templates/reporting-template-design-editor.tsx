'use client';
import { useDebounce } from '@/hooks/use-debounce';
import { useDetailReportTemplateQuery, useUpdateReportTemplateMutation } from '@/hooks/use-report-template-query';
import { cn } from '@/lib/utils';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { ReportTemplateDesign } from './report-template-design';

interface ReportingTemplateDesignEditorProps {
  params?: Record<string, string | undefined>;
  isLoading?: boolean;
}
const defaultParams = {};
export const ReportingTemplateDesignEditorSection = ({
  params = defaultParams,
}: ReportingTemplateDesignEditorProps) => {
  const { data: reportTemplateDetail } = useDetailReportTemplateQuery(params.id);
  const { mutateAsync: updateReportTemplate } = useUpdateReportTemplateMutation();
  const router = useRouter();
  const refElement = useRef<{
    source: Record<string, any>;
    pageSettings: Record<string, any>;
  }>({
    source: {},
    pageSettings: {},
  });
  const triggerSave = useDebounce(() => {
    handleOnSave();
  }, 20000);
  const handleOnSave = async (showToast = false) => {
    try {
      if (!reportTemplateDetail) return;
      await updateReportTemplate({
        id: params.id!,
        payload: {
          ...reportTemplateDetail!,
          source: refElement.current.source,
          metadata: {
            ...reportTemplateDetail?.metadata,
            page_settings: refElement.current.pageSettings,
          },
        } as any,
      });
      if (showToast) {
        toast.success('Report template updated successfully');
      }
    } catch (err: any) {
      toast.error(err?.data?.description || 'Something went wrong');
    }
  };

  return (
    <div className='text-[14px] fixed top-0 bottom-0 left-0 right-0 z-[20]r'>
      <nav
        className={cn(
          'bg-white h-[45px] px-4 border-b-[1px] border-gray-100 flex items-center justify-between gap-2 text-gray-700'
        )}
      >
        <aside className='flex items-center gap-4 w-full max-w-[350px]'>
          <Button
            variant='ghost'
            size='icon'
            className='text-gray-800'
            onClick={() => {
              router.push('/reporting-template');
            }}
          >
            <ArrowLeftIcon className='h-6 w-6' />
          </Button>
          <div className='flex flex-col w-full'>
            <span className='px-2 inline-block whitespace-nowrap w-10/12 text-lg text-ellipsis overflow-hidden capitalize font-semibold'>
              {reportTemplateDetail?.name}
            </span>
          </div>
        </aside>

        <aside className='flex items-center gap-2'>
          <Button className='!bg-gray-900 w-[150px] p-2 !text-white' type='submit' onClick={() => handleOnSave(true)}>
            Save
          </Button>
        </aside>
      </nav>
      {reportTemplateDetail?.id === params.id && (
        <ReportTemplateDesign
          globalData={{}}
          pageData={{}}
          onUpdate={(data) => {
            refElement.current.source = data.elementsData;
            refElement.current.pageSettings = data.pageSettings;
            triggerSave();
          }}
          pageSettings={reportTemplateDetail?.metadata?.page_settings || {}}
          elementsData={Array.isArray(reportTemplateDetail?.source) ? {} : reportTemplateDetail?.source}
          extendComponent={{}}
          onOpenImageGalery={() => {}}
          className='!h-[calc(100%-45px)]'
        />
      )}
    </div>
  );
};
