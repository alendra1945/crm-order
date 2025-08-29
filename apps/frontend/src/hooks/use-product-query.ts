import { fetchClientQuery, queryClient } from '@/lib/fetch-client';
import { ResponseWithPagination } from '@/types/base';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const GenderSchema = z.enum(['MALE', 'FEMALE']);
export type Gender = z.infer<typeof GenderSchema>;

export const StatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'LEFT']);
export type Status = z.infer<typeof StatusSchema>;

export const ProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required.'),
  name: z.string().min(1, 'Name is required.'),
  description: z.string().min(1, 'Description is required.'),
  price: z.number().min(1, 'Price is required.'),
  category: z.string().min(1, 'Category is required.'),
  quantity: z.number().min(0, 'Quantity is required.'),
  imageUrl: z.string().min(1, 'Image URL is required.'),
});
export const ProductSchemaFromApi = ProductSchema.omit({}).extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProductSchemaToApi = ProductSchema.transform((data) => ({
  ...data,
}));

export type Product = z.infer<typeof ProductSchema>;

export async function getProductOverview() {
  const { data, error } = await fetchClientQuery<{
    totalProduct: number;
    totalInStockProduct: number;
    totalOutOfStock: number;
    totalOrder: number;
  }>({
    url: '/products/overview',
    method: 'GET',
  });
  if (error || !data) {
    throw new Error(error || 'Something went wrong');
  }
  return data;
}
export const useProductOverviewQuery = () => {
  return useQuery({
    queryKey: ['get-product-overview'],
    queryFn: async () => await getProductOverview(),
  });
};
export async function getAllProducts({ params }: { params?: Record<string, any> }) {
  const { data, error } = await fetchClientQuery<ResponseWithPagination<(Product & { id: string })[]>>({
    url: '/products',
    method: 'GET',
    params,
  });
  if (error || !data) {
    throw new Error(error || 'Something went wrong');
  }
  return data;
}

export const getAllProductQuery = (rawParams?: Record<string, any>) => {
  const params = { page: 1, limit: 20, ...(rawParams || {}) };
  return queryClient.fetchQuery({
    queryKey: ['get-all-product', params],
    queryFn: async () => await getAllProducts({ params: params }),
  });
};

export const useCreateProductMutation = () => {
  return useMutation({
    mutationFn: async (data: Product) => {
      const { data: res, error } = await fetchClientQuery({
        url: '/products',
        method: 'POST',
        body: data,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-product'] });
    },
  });
};

export const useDeleteProductMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/products/${id}`,
        method: 'DELETE',
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-product'] });
    },
  });
};

export const useDetailProductQuery = (id?: string) => {
  return useQuery({
    queryKey: ['get-detail-product', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await fetchClientQuery<Product>({
        url: `/products/${id}`,
        method: 'GET',
      });
      if (error || !data) {
        throw new Error(error || 'Something went wrong');
      }
      return data;
    },
  });
};

export const useUpdateProductMutation = () => {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Product }) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/products/${id}`,
        method: 'PUT',
        body: payload,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      queryClient.invalidateQueries({ queryKey: ['get-detail-product', id] });
      return res;
    },
  });
};
