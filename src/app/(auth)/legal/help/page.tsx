"use client";

import LegalPageLayout from '@/components/layout/LegalPageLayout';

const helpSections = [
    {
      "title": "Welcome to Help & Support!",
      "content": "**What is Dynamic Pi Wallet View?**\nDynamic Pi Wallet View is a third-party application designed to offer a dynamic and user-friendly interface for viewing your Pi Network related metrics. This includes your Pi balance, current mining rate, insights into your team's activity, and performance data if you operate a Pi Node."
    },
    {
      "title": "Is Dynamic Pi Wallet View an official Pi Network App?",
      "content": "No, Dynamic Pi Wallet View is an independent application developed by enthusiasts. It is not officially affiliated with, endorsed, or sponsored by the Pi Core Team or the Pi Network."
    },
    {
      "title": "How accurate is the data shown in Dynamic Pi Wallet View?",
      "content": "Currently, Dynamic Pi Wallet View uses MOCK (SIMULATED) DATA for all its features. This is for demonstration and development purposes. In a future version intended for live use, data accuracy would depend on the information provided by the official Pi Network APIs and the permissions you grant."
    },
    {
      "title": "Key Features Overview",
      "content": "*   **Dashboard:** At-a-glance view of your total Pi balance, mining rate, and active team members.\n*   **Balance Breakdown:** Detailed view of your Pi balance, including transferable, unverified, and locked-up amounts.\n*   **Balance Fluctuation Chart:** Visual representation of your balance changes over time.\n*   **Badge Showcase:** Display of earned badges within the Pi Network ecosystem (mocked).\n*   **Team Insights:** Information about your team members, their status, and contributions (mocked).\n*   **Node Analysis:** For node operators, metrics like uptime and performance score (mocked).\n*   **Settings:** Customize theme preferences."
    },
    {
      "title": "Troubleshooting Common Issues",
      "content": "*   **App not loading or showing errors:** As Dynamic Pi Wallet View currently uses mock data, persistent errors might indicate a problem with the application itself. Please try refreshing. If issues continue, contact support.\n*   **Data seems incorrect:** Remember, all data in this version is simulated. It does not reflect your actual Pi Network account."
    },
    {
      "title": "Contacting Support",
      "content": "If you have questions specific to the Dynamic Pi Wallet View application, encounter bugs, or have feedback, please email us at support@example.com.\n\nFor any questions or issues regarding your actual Pi Network account, mining, KYC, or official Pi Network policies, please refer to the support channels provided by the Pi Network (e.g., in-app support in the official Pi app, official Pi Network website and community channels)."
    }
];

export default function HelpPage() {
  return (
    <LegalPageLayout
      pageTitle="Help & Support"
      sections={helpSections}
      displayMode="accordion"
    />
  );
}
