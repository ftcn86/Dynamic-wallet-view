
"use client";

import LegalPageLayout from '@/components/layout/LegalPageLayout';

export default function TermsPage() {
  return (
    <LegalPageLayout
      pageTitleKey="legal.termsTitle"
      sectionsKey="legal.termsSections"
      displayMode="accordion"
    />
  );
}
