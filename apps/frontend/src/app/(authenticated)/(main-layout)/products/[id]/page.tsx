import { Main } from '@/components/layout/main';
import { ProductFormCard } from '@/components/product/form-card';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  if (id == 'new') {
    return (
      <Main>
        <ProductFormCard />;
      </Main>
    );
  }
  return (
    <Main>
      <ProductFormCard isEdit />
    </Main>
  );
}
