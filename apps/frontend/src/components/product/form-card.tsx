'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Product,
  ProductSchema,
  ProductSchemaFromApi,
  useCreateProductMutation,
  useDetailProductQuery,
  useUpdateProductMutation,
} from '@/hooks/use-product-query';
import { typographyClassName } from '@/lib/contants';
import { cn } from '@/lib/utils';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';

type ProductFormProps = {
  isEdit?: boolean;
};

const defaultValues: Product = {
  sku: '',
  name: '',
  description: '',
  price: 0,
  category: '',
  quantity: 0,
  imageUrl: '',
};

export function ProductFormCard({ isEdit }: ProductFormProps) {
  const params = useParams<{ id: string }>();
  const { data } = useDetailProductQuery(isEdit ? params.id : undefined);
  const { mutateAsync: createProduct } = useCreateProductMutation();
  const { mutateAsync: updateProduct } = useUpdateProductMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: standardSchemaResolver(ProductSchema),
    values: {
      ...defaultValues,
      ...(isEdit && data && ProductSchemaFromApi.parse(data)),
    },
  });

  const onSubmit = async (values: Product) => {
    try {
      if (isEdit && params.id) {
        await updateProduct({ id: params.id, payload: values });
        toast.success('Product updated');
      } else {
        await createProduct(values);
        toast.success('Product created');
      }
      router.push('/products');
    } catch {
      if (isEdit) {
        toast.error('Product update failed');
      } else {
        toast.error('Product creation failed');
      }
    }
  };

  return (
    <div className='w-full h-full'>
      <Form {...form}>
        <form id='user-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-10 px-0.5'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold tracking-tight'>Product Form</h1>
            <Button>{isEdit ? 'Update' : 'Save'}</Button>
          </div>

          <div className='space-y-4'>
            <h2 className={cn(typographyClassName.h2, 'text-md font-bold')}>Basic Info</h2>
            <div className='grid md:grid-cols-3 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='sku'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='required'>SKU</FormLabel>
                    <FormControl className='w-full'>
                      <Input placeholder='SKU-0001' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='required'>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Product name' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='required'>Category</FormLabel>
                    <FormControl>
                      <Input placeholder='Category' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid md:grid-cols-3 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='required'>Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        placeholder='0'
                        className='col-span-4'
                        autoComplete='off'
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='required'>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0'
                        className='col-span-4'
                        autoComplete='off'
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='imageUrl'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://...' className='col-span-4' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <h2 className={cn(typographyClassName.h2, 'text-md font-bold')}>Description</h2>
            <div className='grid md:grid-cols-1 gap-x-2 items-start space-y-4'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel className='required'>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Description' className='w-full' autoComplete='off' {...field} />
                    </FormControl>
                    <FormMessage className='' />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
