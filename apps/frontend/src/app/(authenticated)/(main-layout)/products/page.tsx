import { Main } from '@/components/layout/main';
import { TableCardProduct } from '@/components/product/table-card';
import { defaultColums } from '@/components/product/table-columns';
import { TableDataProvider } from '@/components/table/table-provider';

export default function ProductPage() {
  return (
    <Main>
      <TableDataProvider columns={defaultColums}>
        <TableCardProduct />
      </TableDataProvider>
    </Main>
  );
}
