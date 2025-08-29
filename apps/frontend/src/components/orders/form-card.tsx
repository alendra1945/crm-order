'use client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { modalEventSubject, useModal } from '@/hooks/use-modal-store';
import {
  OrderSchemaToApi,
  StatusOrderSchema,
  useCreateOrderMutation,
  useDetailOrderQuery,
  useUpdateOrderMutation,
} from '@/hooks/use-order-query';
import { getAllProducts, Product } from '@/hooks/use-product-query';
import { useSubscribe } from '@/hooks/use-subscribe';
import { typographyClassName } from '@/lib/contants';
import { cn, formatCurrencyTOIDR } from '@/lib/utils';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useQuery } from '@tanstack/react-query';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { SelectDropdown } from '../base/select-dropdown';

type UserActionDialogProps = {
  isEdit?: boolean;
};

const defaultValues = {
  status: StatusOrderSchema.enum.PENDING,
  orderItems: [],
};

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
export function LeaveBalanceFormCard({ isEdit = false }: UserActionDialogProps) {
  const params = useParams<{ id: string }>();
  const { onOpen } = useModal();
  const { data } = useDetailOrderQuery(isEdit ? params.id : undefined);
  const { mutateAsync: createOrder } = useCreateOrderMutation();
  const { mutateAsync: updateOrder } = useUpdateOrderMutation();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const debouncedSearchTerm = useDebounce(search, 500);
  const { data: productsResp, isLoading: isProductsLoading } = useQuery({
    queryKey: ['search-products', { page: 1, limit: 10, search: debouncedSearchTerm }],
    queryFn: async () => await getAllProducts({ params: { page: 1, limit: 10, search: debouncedSearchTerm } }),
  });

  const resultDataProducts = useMemo(() => {
    return productsResp?.data || [];
  }, [productsResp?.data]);

  const form = useForm<z.infer<typeof OrderSchemaToApi>>({
    resolver: standardSchemaResolver(OrderSchemaToApi),
    values: {
      ...defaultValues,
      ...(isEdit && data ? OrderSchemaToApi.parse(data) : {}),
    },
  });
  console.log(form.formState.errors);
  const itemsUtil = useFieldArray({
    control: form.control,
    name: 'orderItems',
  });

  const selectedProducts = form.watch('orderItems');
  const productIds = selectedProducts.map((p) => p.productId);
  const anyZeroQty = selectedProducts.some((p) => p.quantity <= 0);
  const addProductToList = (p: Product & { id: string; quantity: number }) => {
    if (productIds.includes(p.id)) {
      const indexProduct = productIds.indexOf(p.id);
      const exitedProduct = itemsUtil.fields[indexProduct];
      itemsUtil.update(indexProduct, {
        ...exitedProduct,
        quantity: exitedProduct.quantity + 1,
        totalPrice: p.price * (exitedProduct.quantity + 1),
      });
    } else {
      itemsUtil.append({
        productId: p.id,
        productName: p.name,
        price: p.price,
        quantity: 1,
        totalPrice: p.price,
      });
    }
  };

  const updateProductQty = (index: number, qty: number) => {
    itemsUtil.update(index, {
      ...itemsUtil.fields[index],
      quantity: qty,
      totalPrice: qty * itemsUtil.fields[index].price,
    });
  };

  const removeProduct = (index: number) => {
    itemsUtil.remove(index);
  };

  const onSubmit = async (values: z.infer<typeof OrderSchemaToApi>) => {
    try {
      if (isEdit) {
        await updateOrder({ id: params.id, payload: values });
        toast.success('Order updated');
      } else {
        await createOrder(values);
        toast.success('Order created');
      }
      router.push('/orders');
    } catch (error: any) {
      const msg = error?.message;
      if (isEdit) {
        toast.error('Order update failed', {
          description: msg || '',
          duration: !msg ? 50000 : undefined,
        });
      } else {
        toast.error('Order creation failed', {
          description: msg || '',
          duration: !msg ? 50000 : undefined,
        });
      }
    }
  };
  const validateStatus = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.getValues('status') === StatusOrderSchema.enum.PAID) {
      onOpen('alertConfirmation', {
        alertConfirmation: {
          description: 'Are you sure you want to change this order status to paid?',
          detail: {},
        },
      });
    } else {
      form.handleSubmit(onSubmit)(e);
    }
  };
  useSubscribe({
    subject: modalEventSubject,
    next: async ({ type, data, status }) => {
      if (status === 'close' && type == 'alertConfirmation' && data?.isConfirm) {
        form.handleSubmit(onSubmit)({} as any);
      }
    },
    disabled: form.watch('status') !== StatusOrderSchema.enum.PAID,
  });
  const total = selectedProducts.reduce((acc, sp) => acc + (Number(sp.price) || 0) * (Number(sp.quantity) || 0), 0);
  return (
    <div className='w-full h-full'>
      <Form {...form}>
        <form id='leave-form' noValidate onSubmit={validateStatus} className='space-y-10 px-0.5'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold tracking-tight'>Order Details</h1>
            <div className='flex items-end gap-3'>
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='min-w-[200px]'>
                    <FormLabel className='required'>Status</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select status'
                      className='capitalize'
                      items={StatusOrderSchema.options.map((value) => ({
                        label: value.toLowerCase(),
                        value,
                      }))}
                    />
                  </FormItem>
                )}
              />
              <Button type='submit'>{isEdit ? 'Update' : 'Save'}</Button>
            </div>
          </div>
          {anyZeroQty && (
            <Alert variant='destructive' className='mt-2'>
              <AlertTitle>Invalid products</AlertTitle>
              <AlertDescription>Product quantity cannot be zero.</AlertDescription>
            </Alert>
          )}
          <div className='space-y-4'>
            <h2 className={cn(typographyClassName.h2, 'text-md font-bold')}>Products</h2>
            <div className='grid md:grid-cols-3 gap-x-2 items-start space-y-4'>
              <div className='flex flex-col'>
                <FormLabel className='required mb-2'>Select Product</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <div className='flex h-10 justify-between items-center px-4 rounded-md border border-input cursor-pointer'>
                      <span className={cn('text-muted-foreground')}>Search/Select...</span>
                      <ChevronsUpDown className='h-4 w-4 shrink-0 text-gray-800' />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className='w-[100vw] max-w-2xl px-4 py-3' align='center' side='bottom'>
                    <div className='relative mb-2'>
                      <Input
                        placeholder='Search products...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <div className='max-h-72 overflow-auto'>
                      {resultDataProducts.length ? (
                        resultDataProducts.map((prod) => {
                          const isSelected = !!selectedProducts.find((p) => p.productId === prod.id);
                          return (
                            <div
                              key={prod.id}
                              className='cursor-pointer py-2 px-1 flex items-center justify-between hover:bg-muted rounded'
                              onClick={() => addProductToList(prod)}
                            >
                              <div className='flex flex-col'>
                                <span className='font-medium'>{prod.name}</span>
                                <span className='text-xs text-muted-foreground'>
                                  {prod.sku} • {formatCurrencyTOIDR(Number(prod.price || 0))}
                                </span>
                              </div>
                              {isSelected && <CheckIcon className='h-5 w-5 text-green-600' />}
                            </div>
                          );
                        })
                      ) : (
                        <div className='text-sm text-muted-foreground py-2'>
                          {isProductsLoading ? 'Loading...' : 'No results found.'}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {!!selectedProducts.length && (
              <div className='grid gap-3'>
                {selectedProducts.map((sp, index) => {
                  const subtotal = (Number(sp.price) || 0) * (Number(sp.quantity) || 0);
                  return (
                    <div
                      key={sp.productId}
                      className='flex items-center justify-between border rounded-md p-3 bg-white'
                    >
                      <div className='flex flex-col'>
                        <span className='font-medium'>{sp.productName}</span>
                        <span className='text-xs text-muted-foreground'>
                          {formatCurrencyTOIDR(Number(sp.price || 0))} each
                        </span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-2'>
                          <FormLabel className='text-gray-500'>Qty</FormLabel>
                          <Input
                            type='number'
                            min={0}
                            className='w-24'
                            value={sp.quantity}
                            onChange={(e) => updateProductQty(index, Number(e.target.value))}
                          />
                        </div>
                        <div className='text-right'>
                          <div className='text-xs text-muted-foreground'>Subtotal</div>
                          <div className='font-medium'>{formatCurrencyTOIDR(subtotal)}</div>
                        </div>
                        <Button variant='destructive' type='button' onClick={() => removeProduct(index)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!!selectedProducts.length && (
              <div className='flex justify-end'>
                <div className='mt-4 rounded-md border p-4 w-full md:w-80 bg-white'>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>Items</span>
                    <span>{selectedProducts.length}</span>
                  </div>
                  <div className='flex justify-between text-base font-semibold mt-2'>
                    <span>Total</span>
                    <span>{formatCurrencyTOIDR(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
