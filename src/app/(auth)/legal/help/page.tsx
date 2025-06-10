
"use client";

import LegalPageLayout from '@/components/layout/LegalPageLayout';

export default function HelpPage() {
  return (
    <LegalPageLayout
      pageTitleKey="legal.helpTitle"
      sectionsKey="legal.helpSections"
      displayMode="accordion"
    />
  );
}
