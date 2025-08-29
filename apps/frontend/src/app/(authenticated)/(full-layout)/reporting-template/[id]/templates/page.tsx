import { ReportingTemplateDesignEditorSection } from '@/components/reporting-templates/reporting-template-design-editor';
import React from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReportTemplate({ params }: Props) {
  const { id } = await params;
  return <ReportingTemplateDesignEditorSection params={{ id }} />;
}
