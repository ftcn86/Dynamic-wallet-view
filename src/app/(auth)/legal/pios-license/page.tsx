
"use client";

import LegalPageLayout from '@/components/layout/LegalPageLayout';

export default function PiosLicensePage() {
  return (
    <LegalPageLayout
      pageTitleKey="legal.piosLicenseTitle"
      contentKey="legal.piosLicenseContent"
      displayMode="markdown"
    />
  );
}
