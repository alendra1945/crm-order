import { fetchClientQuery, queryClient } from '@/lib/fetch-client';
import { ResponseWithPagination } from '@/types/base';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const ReportTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
  documentTarget: z.string().min(1, 'Document Target is required.'),
  isDefault: z.boolean().default(false),
});

export const ReportTemplateSchemaFromApi = ReportTemplateSchema.extend({
  id: z.string(),
  createdAt: z
    .string()
    .optional()
    .transform((v) => new Date(v || '')),
  updatedAt: z
    .string()
    .optional()
    .transform((v) => new Date(v || '')),
});

export type ReportTemplate = z.infer<typeof ReportTemplateSchema>;
export type ReportTemplateFromApi = z.infer<typeof ReportTemplateSchemaFromApi>;

// Report Template: Queries
export async function getAllReportTemplates({ params }: { params?: Record<string, any> }) {
  const { data, error } = await fetchClientQuery<ResponseWithPagination<ReportTemplateFromApi[]>>({
    url: '/reporting-template',
    method: 'GET',
    params,
  });
  if (error || !data) {
    throw new Error(error || 'Something went wrong');
  }
  return data;
}

export const getAllReportTemplateQuery = (rawParams?: Record<string, any>) => {
  const params = { page: 1, limit: 20, ...(rawParams || {}) };
  return queryClient.fetchQuery({
    queryKey: ['get-all-report-templates', params],
    queryFn: async () => await getAllReportTemplates({ params }),
  });
};

export const useCreateReportTemplateMutation = () => {
  return useMutation({
    mutationFn: async (payload: ReportTemplate) => {
      const { data: res, error } = await fetchClientQuery({
        url: '/reporting-template',
        method: 'POST',
        body: payload,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-report-templates'] });
    },
  });
};

export const useDeleteReportTemplateMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/reporting-template/${id}`,
        method: 'DELETE',
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-report-templates'] });
    },
  });
};

export const useDetailReportTemplateQuery = (id?: string) => {
  return useQuery({
    queryKey: ['get-detail-report-template', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await fetchClientQuery<
        ReportTemplateFromApi & {
          id: string;
          source: {
            elements: Record<string, any>[];
            footers: Record<string, any>;
            headers: Record<string, any>;
            watermark: Record<string, any>;
          };
          metadata: {
            page_settings: Record<string, any>;
          };
        }
      >({
        url: `/reporting-template/${id}`,
        method: 'GET',
      });
      if (error || !data) {
        throw new Error(error || 'Something went wrong');
      }
      return data;
    },
  });
};

export const useUpdateReportTemplateMutation = () => {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ReportTemplate }) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/reporting-template/${id}`,
        method: 'PUT',
        body: payload,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      queryClient.invalidateQueries({ queryKey: ['get-detail-report-template', id] });
      return res;
    },
  });
};
