"use client";

import LegalPageLayout from '@/components/layout/LegalPageLayout';

const termsSections = [
    {
      "title": "Terms of Service - Introduction",
      "content": "Effective Date: October 26, 2023\n\nWelcome to Dynamic Pi Wallet View! These Terms of Service ('Terms') govern your use of the Dynamic Pi Wallet View application and any related services (collectively, the 'Service'). By accessing or using our Service, you agree to be bound by these Terms."
    },
    {
      "title": "1. Acceptance of Terms",
      "content": "By using Dynamic Pi Wallet View, you confirm that you have read, understood, and agree to these Terms. If you do not agree with any part of these Terms, you must not use the Service."
    },
    {
      "title": "2. Description of Service",
      "content": "Dynamic Pi Wallet View is a third-party application designed to provide users with a dashboard to view their Pi Network related metrics, including Pi balance, mining rate, team member information, and node performance. Dynamic Pi Wallet View is not an official Pi Network application and is not a wallet. It does not store your private keys or facilitate Pi transactions."
    },
    {
      "title": "3. Use of Service",
      "content": "You agree to use the Service only for its intended purposes and in accordance with all applicable laws and regulations. You are responsible for maintaining the confidentiality of any account information related to your use of the Pi Network when interfacing with any third-party application."
    },
    {
      "title": "4. Data Accuracy and Mock Data",
      "content": "Currently, Dynamic Pi Wallet View utilizes mock data for demonstration and development purposes. In a live environment connected to the Pi Network, the accuracy of the data displayed would depend on the information made available by the Pi Network APIs and the data you authorize for access. Dynamic Pi Wallet View does not guarantee the absolute accuracy or timeliness of data that originates from the Pi Network."
    },
    {
      "title": "5. Disclaimer of Warranties",
      "content": "The Service is provided 'as is' and 'as available' without any warranties of any kind, express or implied. Dynamic Pi Wallet View does not warrant that the Service will be uninterrupted, error-free, or completely secure. Dynamic Pi Wallet View is not affiliated with the Pi Core Team or the Pi Network."
    },
    {
      "title": "6. Limitation of Liability",
      "content": "To the fullest extent permitted by law, Dynamic Pi Wallet View shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Service; (b) any conduct or content of any third party on the Service; or (c) unauthorized access, use, or alteration of your transmissions or content, even if Dynamic Pi Wallet View has been advised of the possibility of such damages."
    },
    {
      "title": "7. Intellectual Property",
      "content": "The Dynamic Pi Wallet View name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Dynamic Pi Wallet View or its licensors. Pi Network and the Pi logo are trademarks of the Pi Community Company. This Service is not endorsed by or affiliated with the Pi Network."
    },
    {
      "title": "8. Changes to Terms",
      "content": "We reserve the right to modify these Terms at any time. We will endeavor to provide notice of any significant changes. Your continued use of the Service after such changes constitutes your acceptance of the new Terms."
    },
    {
      "title": "9. Contact Us",
      "content": "If you have any questions about these Terms, please contact us at legal@example.com."
    }
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      pageTitle="Terms of Service"
      sections={termsSections}
      displayMode="accordion"
    />
  );
}
