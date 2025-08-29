import { Main } from '@/components/layout/main';
import { TableCardOrder } from '@/components/orders/table-card';
import { defaultColums } from '@/components/orders/table-columns';
import { TableDataProvider } from '@/components/table/table-provider';

export default function CardOrderPage() {
  return (
    <Main>
      <TableDataProvider columns={defaultColums}>
        <TableCardOrder />
      </TableDataProvider>
    </Main>
  );
}
