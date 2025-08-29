'use client';
import { useEffect, useState } from 'react';
import AlertConfirmModal from '@/components/dialog/alert-confirm-modal';
import { CreateReportingTemplateModal } from '@/components/reporting-templates/dialog-add-report';
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <AlertConfirmModal />
      <CreateReportingTemplateModal />
    </>
  );
};
