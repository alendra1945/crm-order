'use client';
import { cn, updateEditorStyle } from '@/lib/utils';
import { useEffect, useMemo, useRef } from 'react';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  developerMode?: boolean;
  pageData?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  globalData?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  pageSettings?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  elementsData?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  extendComponent?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  onUpdate?: (data: { pageSettings: Record<string, any>; elementsData: Record<string, any> }) => void;
  onOpenImageGalery?: (callback: (imageUrl: string) => void) => void;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'reporting-template-design': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Props;
    }
  }
}

type ReportTemplateDesignElement = HTMLElement & Props;

export const ReportTemplateDesignPreview = ({
  content,
  className,
}: {
  content: string;
  className?: string;
} & Props) => {
  const cleanContent = useMemo(() => content.replace(/math-field-node/g, 'math-field read-only'), [content]);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: cleanContent as string }} // eslint-disable-line
      className={cn('gkvis-prose gk-flex gk-flex-col', className)}
    />
  );
};

export const ReportTemplateDesign = ({ className, ...assignableProps }: Props) => {
  const ref = useRef<ReportTemplateDesignElement | null>(null);

  useEffect(() => {
    (window as any).process = { env: { NODE_ENV: {} } };
    const scriptId = 'reporting-template-design-web';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '/report-design/reporting-template-design-web.js';
      script.type = 'module';
      document.body.appendChild(script);
    }
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    assignableProps['style'] = updateEditorStyle(assignableProps['style']);

    Object.assign(ref.current, assignableProps);
    Object.assign(ref.current, { class: className });
  }, [assignableProps, className]);

  // @ts-ignore
  return <reporting-template-design ref={ref} />;
};
