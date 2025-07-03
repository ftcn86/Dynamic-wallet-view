"use client";

import LegalPageLayout from '@/components/layout/LegalPageLayout';

const privacySections = [
    {
      "title": "Privacy Policy - Introduction",
      "content": "Effective Date: October 26, 2023\n\nDynamic Pi Wallet View ('we', 'us', or 'our') is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our Dynamic Pi Wallet View application (the 'Service')."
    },
    {
      "title": "1. Our Relationship with Pi Network",
      "content": "Dynamic Pi Wallet View is an independent, third-party application. It is NOT an official application of the Pi Network or the Pi Core Team. This policy describes data handling by Dynamic Pi Wallet View, not by the Pi Network itself. For Pi Network's privacy practices, please refer to their official privacy policy."
    },
    {
      "title": "2. Information We Handle",
      "content": "When you use Dynamic Pi Wallet View, the application is designed to display information related to your Pi Network account, which may include:\n- Your Pi balance and its breakdown (e.g., transferable, unverified, lockups).\n- Your current Pi mining rate.\n- Information about your team members (e.g., name, status, contribution), as potentially made available by Pi Network APIs.\n- Node performance data (if you are a node operator and this data is accessible).\n- Profile information you might provide directly within Dynamic Pi Wallet View (e.g., display name, bio).\n\n**Important Note on Current Version:** The current version of Dynamic Pi Wallet View uses MOCK (simulated) DATA for all features. No actual connection to your Pi Network account is made, and no real Pi Network data is fetched or stored by Dynamic Pi Wallet View."
    },
    {
      "title": "3. How We Would Use Information (If Connected to Live Data)",
      "content": "If Dynamic Pi Wallet View were connected to live Pi Network data (which it currently is not), the information would be used solely to:\n- Provide you with the dashboard features: displaying your Pi-related metrics, team insights, and node analysis.\n- Allow you to customize your application experience (e.g., theme, language).\nWe would not sell your personal information. Access to your Pi Network data would require your explicit authorization through Pi Network's official mechanisms."
    },
    {
      "title": "4. Data Storage and Security",
      "content": "Dynamic Pi Wallet View is designed as a viewer or interface. It would not store sensitive Pi Network data like private keys. Application preferences (theme, language) are stored locally on your device. If handling real data, we would implement reasonable security measures to protect the information displayed."
    },
    {
      "title": "5. Third-Party Services and Advertisements",
      "content": "Dynamic Pi Wallet View does not share your Pi Network specific data with third-party advertisers. The application may contain placeholder elements for advertisements which are not functional in the current mock version and do not track you."
    },
    {
      "title": "6. Your Choices and Rights",
      "content": "Control over your Pi Network data resides with your Pi Network account and its official platform. Dynamic Pi Wallet View, as a third-party viewer, would only display data based on permissions you grant via the Pi Network. Profile information entered directly into Dynamic Pi Wallet View can be managed by you within the app."
    },
    {
      "title": "7. Children's Privacy",
      "content": "Dynamic Pi Wallet View is not intended for use by children under the age of 13 (or the relevant age in your jurisdiction). We do not knowingly collect personal information from children."
    },
    {
      "title": "8. Changes to This Privacy Policy",
      "content": "We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy within the application or on our website."
    },
    {
      "title": "9. Contact Us",
      "content": "If you have any questions about this Privacy Policy, please contact us at privacy@example.com."
    }
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      pageTitle="Privacy Policy"
      sections={privacySections}
      displayMode="accordion"
    />
  );
}
