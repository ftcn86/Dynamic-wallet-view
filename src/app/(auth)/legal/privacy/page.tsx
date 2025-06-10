
"use client";

import LegalPageLayout from '@/components/layout/LegalPageLayout';

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      pageTitleKey="legal.privacyTitle"
      sectionsKey="legal.privacySections"
      displayMode="accordion"
    />
  );
}
