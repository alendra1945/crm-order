'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useModal } from '@/hooks/use-modal-store';
import {
  ReportTemplate,
  ReportTemplateSchema,
  ReportTemplateSchemaFromApi,
  useCreateReportTemplateMutation,
  useDetailReportTemplateQuery,
  useUpdateReportTemplateMutation,
} from '@/hooks/use-report-template-query';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { SelectDropdown } from '../base/select-dropdown';
import { Switch } from '../ui/switch';
const defaultValues: ReportTemplate = {
  name: '',
  description: '',
  documentTarget: '',
  isDefault: false,
};

export const documentTargetOptions = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Invoice', value: 'invoice' },
];
export const CreateReportingTemplateModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { mutateAsync: createReportTemplate } = useCreateReportTemplateMutation();
  const { mutateAsync: updateReportTemplate } = useUpdateReportTemplateMutation();
  const isModalOpen = isOpen && type === 'createReportTemplate';
  const isEdit = data?.reportTemplateData?.id;
  const reportTemplateId = data?.reportTemplateData?.id;

  const { data: reportTemplateDetail } = useDetailReportTemplateQuery(isEdit ? reportTemplateId : undefined);

  const form = useForm<z.infer<typeof ReportTemplateSchema>>({
    resolver: standardSchemaResolver(ReportTemplateSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEdit && reportTemplateDetail) {
      const parsedData = ReportTemplateSchemaFromApi.parse(reportTemplateDetail);
      form.reset({
        name: parsedData.name,
        description: parsedData.description || '',
        documentTarget: parsedData.documentTarget,
        isDefault: parsedData.isDefault,
      });
    } else if (!isEdit) {
      form.reset(defaultValues);
    }
  }, [isEdit, reportTemplateDetail, form]);

  const handleClose = useCallback(
    (isRefetch: boolean = false) => {
      form.reset(defaultValues);
      onClose({
        refetchTemplates: isRefetch,
      });
    },
    [form, onClose]
  );

  const onSubmit = async (values: ReportTemplate) => {
    try {
      if (isEdit) {
        await updateReportTemplate({ id: reportTemplateId!, payload: values });
        toast.success('Report template updated successfully');
      } else {
        await createReportTemplate(values);
        toast.success('Report template created successfully');
      }
      handleClose(true);
    } catch (error: any) {
      const msg = error?.message;
      if (isEdit) {
        toast.error('Report template update failed', {
          description: msg || 'Something went wrong',
        });
      } else {
        toast.error('Report template creation failed', {
          description: msg || 'Something went wrong',
        });
      }
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            {isEdit ? 'Edit Report Template' : 'Create Report Template'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='required'>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter template name' disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter template description' disabled={isLoading} rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='documentTarget'
                disabled={!!isEdit}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='required'>Document Target</FormLabel>

                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select document target'
                      disabled={isLoading || !!isEdit}
                      items={documentTargetOptions}
                      isControlled
                    />
                    {isEdit && (
                      <div className='text-sm text-red-500'>
                        Note: You cannot change the document target of an existing report template.
                      </div>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isDefault'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Default Template</FormLabel>
                      <div className='text-sm text-muted-foreground'>Mark this template as a default template</div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className='flex justify-end space-x-2 pt-4'>
              <Button type='button' variant='secondary' disabled={isLoading} onClick={() => handleClose(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
