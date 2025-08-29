import { Main } from '@/components/layout/main';
import { TableCardReportTemplate } from '@/components/reporting-templates/table-card';
import { defaultColums } from '@/components/reporting-templates/table-columns';
import { TableDataProvider } from '@/components/table/table-provider';

export default function ReportTemplatePage() {
  return (
    <Main>
      <TableDataProvider columns={defaultColums}>
        <TableCardReportTemplate />
      </TableDataProvider>
    </Main>
  );
}
