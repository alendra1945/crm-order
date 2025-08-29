import { fetchClientQuery, queryClient } from '@/lib/fetch-client';
import { ResponseWithPagination } from '@/types/base';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const OrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required.').default(''),
  productName: z.string().default(''),
  quantity: z.number().min(1, 'Quantity is required.').default(0),
  price: z.number().min(1, 'Price is required.').default(0),
  totalPrice: z.number().min(1, 'Total Price is required.').default(0),
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const StatusOrderSchema = z.enum(['PENDING', 'PAID', 'CANCELLED']);
export type StatusOrder = z.infer<typeof StatusOrderSchema>;

export const OrderSchema = z.object({
  orderNumber: z.string().min(1, 'Order Number is required.').default(''),
  orderItems: z.array(OrderItemSchema),
  status: StatusOrderSchema.default('PENDING'),
  totalPrice: z.number().min(1, 'Total Price is required.').default(0),
});

export const OrderSchemaFromApi = OrderSchema.omit({}).extend({
  id: z.string().default(''),
  createdAt: z
    .string()
    .optional()
    .transform((v) => new Date(v || '')),
  updatedAt: z
    .string()
    .optional()
    .transform((v) => new Date(v || '')),
});

export const OrderSchemaToApi = OrderSchema.omit({
  orderNumber: true,
  totalPrice: true,
}).transform((v) => ({
  ...v,
  orderItems: v.orderItems || [],
}));

export type Order = z.infer<typeof OrderSchema>;

// Order: Queries
export async function getAllOrders({ params }: { params?: Record<string, any> }) {
  const { data, error } = await fetchClientQuery<ResponseWithPagination<Order[]>>({
    url: '/orders',
    method: 'GET',
    params,
  });
  if (error || !data) {
    throw new Error(error || 'Something went wrong');
  }
  return data;
}

export const getAllOrderQuery = (rawParams?: Record<string, any>) => {
  const params = { page: 1, limit: 20, ...(rawParams || {}) };
  return queryClient.fetchQuery({
    queryKey: ['get-all-orders', params],
    queryFn: async () => await getAllOrders({ params }),
  });
};

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: async (payload: z.infer<typeof OrderSchemaToApi>) => {
      const { data: res, error } = await fetchClientQuery({
        url: '/orders',
        method: 'POST',
        body: payload,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-orders'] });
    },
  });
};

export const useDeleteOrderMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/orders/${id}`,
        method: 'DELETE',
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-orders'] });
    },
  });
};

export const useDetailOrderQuery = (id?: string) => {
  return useQuery({
    queryKey: ['get-detail-order', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await fetchClientQuery<Order>({
        url: `/orders/${id}`,
        method: 'GET',
      });
      if (error || !data) {
        throw new Error(error || 'Something went wrong');
      }
      return data;
    },
  });
};

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: z.infer<typeof OrderSchemaToApi> }) => {
      const { data: res, error } = await fetchClientQuery({
        url: `/orders/${id}`,
        method: 'PUT',
        body: payload,
      });
      if (error || !res) {
        throw new Error(error || 'Something went wrong');
      }
      queryClient.invalidateQueries({ queryKey: ['get-detail-order', id] });
      return res;
    },
  });
};
