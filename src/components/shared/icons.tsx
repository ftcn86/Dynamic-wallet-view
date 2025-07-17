
// This file consolidates commonly used solid-style SVG icons into one place.
// This avoids code duplication and makes it easier to manage and update icons.
// To add a new icon, simply define it here as a React component and export it.

import React from 'react';

export const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" fill="hsl(var(--primary))"/>
    <polyline points="14 2 14 8 20 8" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
    <line x1="16" y1="13" x2="8" y2="13" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
    <line x1="16" y1="17" x2="8" y2="17" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
    <line x1="10" y1="9" x2="8" y2="9" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
  </svg>
);

export const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="hsl(142.1 76.2% 42.2%)"/>
      <path d="m9 12 2 2 4-4" stroke="hsl(var(--primary-foreground))" strokeWidth="2"/>
    </svg>
);
  
export const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="hsl(var(--destructive))" strokeWidth="2" />
        <polyline points="16 17 21 12 16 7" stroke="hsl(var(--destructive))" strokeWidth="2" />
        <line x1="21" y1="12" x2="9" y2="12" stroke="hsl(var(--destructive))" strokeWidth="2" />
    </svg>
);

export const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="hsl(142.1 76.2% 42.2%)" strokeWidth="2" />
        <polyline points="22 4 12 14.01 9 11.01" stroke="hsl(142.1 76.2% 42.2%)" strokeWidth="3"/>
    </svg>
);

export const ShieldQuestionIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="hsl(var(--primary))"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="hsl(var(--primary-foreground))" strokeWidth="2" fill="none"/>
  </svg>
);

export const GiftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M20 12v10H4V12" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      <path d="M2 7h20v5H2z" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="hsl(var(--accent))" />
      <path d="M12 22V7" stroke="hsl(var(--primary))" strokeWidth="1.5" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="hsl(var(--accent))"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="hsl(var(--accent))"/>
    </svg>
);
  
export const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="m22 2-7 20-4-9-9-4Z" fill="hsl(var(--primary-foreground))" />
        <path d="m22 2-11 11" stroke="hsl(var(--primary))" strokeWidth="1" />
    </svg>
);

export const RocketIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M13.29,12.71,11.29,14.71,2,5,9.29,2,19,11.71,17.29,13.41,20,16.12,22,14,13.29,12.71ZM9.29,4.12,4,9.41l7.29,2.88,2.88,7.29,5.29-5.29L9.29,4.12Z" fill="hsl(var(--primary))"/>
        <path d="M21.41,17.83,19,15.41l-2.59,2.59,2.41,2.41a2,2,0,0,0,2.83,0h0a2,2,0,0,0,0-2.83Z" fill="hsl(var(--accent))"/>
    </svg>
);

export const ServerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" fill="hsl(220, 13%, 69%)"/>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" fill="hsl(220, 13%, 69%)"/>
        <line x1="6" y1="6" x2="6.01" y2="6" stroke="hsl(142.1 76.2% 42.2%)" strokeWidth="2.5"/>
        <line x1="6" y1="18" x2="6.01" y2="18" stroke="hsl(142.1 76.2% 42.2%)" strokeWidth="2.5"/>
    </svg>
);

export const ServerIconAccent = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" fill="hsl(var(--accent))"/>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" fill="hsl(var(--accent))" />
        <line x1="6" y1="6" x2="6.01" y2="6" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" />
        <line x1="6" y1="18" x2="6.01" y2="18" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" />
    </svg>
);

export const PaintbrushIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M18.37,3.63a2.12,2.12,0,0,0-3,0L13,6,6,13l-3,3,7,7,3-3,7-7,2.37-2.37a2.12,2.12,0,0,0,0-3Z" fill="hsl(var(--primary))"/>
        <path d="M6,13l3,3-4,4H17l-4-4,3-3-4.29-4.29-3.42,3.42Z" fill="hsl(var(--accent))" />
    </svg>
);

export const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" fill="hsl(var(--destructive))"/>
      <line x1="12" y1="9" x2="12" y2="13" stroke="hsl(var(--destructive-foreground))" strokeWidth="2"/>
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="hsl(var(--destructive-foreground))" strokeWidth="2"/>
    </svg>
);

export const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
);

export const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="hsl(48, 95.8%, 53.1%)"/>
    </svg>
);

export const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="8" r="7" fill="hsl(220, 13%, 69%)"/>
        <polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88" fill="hsl(var(--accent))"/>
    </svg>
);

export const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="hsl(142.1, 76.2%, 42.2%)" strokeWidth="2"/>
        <polyline points="17 6 23 6 23 12" stroke="hsl(142.1, 76.2%, 42.2%)" strokeWidth="2"/>
    </svg>
);

export const GaugeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0" fill="hsl(220, 13%, 69%)"/>
        <path d="m12 12-4 2" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        <path d="M12 14v4" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        <path d="M16 12-2 3" stroke="hsl(var(--foreground))" strokeWidth="1.5" transform="rotate(25 12 12)" />
    </svg>
);

export const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))"/>
        <line x1="2" y1="12" x2="22" y2="12" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5"/>
    </svg>
);

export const BlocksIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="7" y="7" width="10" height="10" rx="2" ry="2" fill="hsl(var(--primary))"/>
        <path d="M3 7V5a2 2 0 0 1 2-2h2" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <path d="M17 3h2a2 2 0 0 1 2 2v2" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke="hsl(var(--primary))" strokeWidth="2"/>
    </svg>
);

export const GitBranchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <line x1="6" y1="3" x2="6" y2="15" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <circle cx="18" cy="6" r="3" fill="hsl(var(--accent))" stroke="hsl(var(--accent))" strokeWidth="1.5"/>
        <circle cx="6" cy="18" r="3" fill="hsl(var(--primary))" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
        <path d="M18 9a9 9 0 0 1-9 9" stroke="hsl(var(--primary))" strokeWidth="2"/>
    </svg>
);

export const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M20 12V8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2-2H4a2 2 0 0 1-2-2v-2" fill="hsl(var(--primary))"/>
        <path d="M4 14v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" fill="hsl(var(--accent))"/>
        <path d="M18 12a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4z" fill="hsl(var(--primary))"/>
        <circle cx="16" cy="14" r="1" fill="hsl(var(--primary-foreground))" />
    </svg>
);

export const GaugeIconDashboard = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0" fill="hsl(var(--primary))" />
        <path d="m12 12-4 2" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M12 14v4" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" />
        <path d="M16 12-2 3" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" transform="rotate(25 12 12)" />
    </svg>
);

export const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="hsl(var(--primary))"/>
        <circle cx="8.5" cy="7" r="4" fill="hsl(var(--primary))"/>
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" fill="hsl(var(--accent))" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" fill="hsl(var(--accent))" stroke="hsl(var(--accent))" strokeWidth="2"/>
    </svg>
);

export const PieChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21.21 15.89A10 10 0 1 1 8.11 2.79" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <path d="M22 12A10 10 0 0 0 12 2v10z" fill="hsl(var(--primary))"/>
    </svg>
);

export const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M3 3v18h18" stroke="hsl(var(--foreground))" strokeWidth="2"/>
        <path d="M7 12h4v6H7z" fill="hsl(var(--primary))"/>
        <path d="M13 8h4v10h-4z" fill="hsl(var(--accent))"/>
    </svg>
);

export const TrophyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="1.5"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="1.5"/>
        <path d="M4 22h16" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="1.5"/>
        <path d="M10 14.66V22h4v-7.34" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="1.5"/>
        <path d="M12 15c-3.87 0-7-3.13-7-7V4h14v4c0 3.87-3.13 7-7 7z" fill="hsl(48, 95.8%, 53.1%)"/>
    </svg>
);

export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" fill="hsl(220, 13%, 69%)"/>
        <circle cx="12" cy="12" r="3" fill="hsl(var(--foreground))" />
    </svg>
);

export const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="5" fill="hsl(48, 95.8%, 53.1%)" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="2"/>
        <path d="M12 1v2" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 21v2" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M4.22 4.22l1.42 1.42" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M18.36 18.36l1.42 1.42" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M1 12h2" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 12h2" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M4.22 19.78l1.42-1.42" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="2" strokeLinecap="round" />
        <path d="M18.36 5.64l1.42-1.42" stroke="hsl(48, 95.8%, 53.1%)" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="hsl(var(--primary))" />
    </svg>
);

export const LaptopIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9h16z" fill="hsl(220, 13%, 69%)"/>
        <path d="M12 19h.01" stroke="hsl(var(--foreground))" strokeWidth="2" />
        <path d="M2 19h20" stroke="hsl(var(--foreground))" strokeWidth="2" />
    </svg>
);

export const BellIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="hsl(48, 95.8%, 53.1%)" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" fill="hsl(35.9, 91.1%, 56.9%)" />
    </svg>
);

export const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="hsl(220, 13%, 69%)"/>
        <polyline points="12 6 12 12 16 14" stroke="hsl(var(--foreground))" strokeWidth="2"/>
    </svg>
);

export const UserCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))"/>
        <circle cx="12" cy="10" r="3" fill="hsl(var(--primary-foreground))" />
        <path d="M7 18.662V19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-.338a4 4 0 0 0-3.12-3.953h-1.76a4 4 0 0 0-3.12 3.953Z" fill="hsl(var(--primary-foreground))" />
    </svg>
);

export const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <polyline points="17 8 12 3 7 8" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <line x1="12" y1="3" x2="12" y2="15" stroke="hsl(var(--primary))" strokeWidth="2"/>
    </svg>
);

export const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="hsl(var(--primary))"/>
    </svg>
);

export const BellIconAccent = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="hsl(var(--accent))" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" fill="hsl(35.9, 91.1%, 56.9%)"/>
    </svg>
);

export const MessageSquareIconAccent = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="hsl(var(--accent))"/>
    </svg>
);

export const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="hsl(48, 95.8%, 53.1%)"/>
        <line x1="12" y1="16" x2="12" y2="12" stroke="hsl(var(--foreground))" strokeWidth="2" />
        <line x1="12" y1="8" x2="12.01" y2="8" stroke="hsl(var(--foreground))" strokeWidth="2" />
    </svg>
);

export const ArrowDownLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M17 7 7 17" stroke="hsl(142.1 76.2% 42.2%)" strokeWidth="2" />
        <path d="M17 17H7V7" stroke="hsl(142.1 76.2% 42.2%)" strokeWidth="2" />
    </svg>
);

export const ArrowUpRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M7 17 17 7" stroke="hsl(var(--destructive))" strokeWidth="2" />
        <path d="M7 7h10v10" stroke="hsl(var(--destructive))" strokeWidth="2" />
    </svg>
);

export const CoinsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="8" cy="8" r="6" fill="hsl(48, 95.8%, 53.1%)"/>
        <path d="M18.09 10.72A6 6 0 1 1 10.72 18.09" fill="hsl(220, 13%, 69%)" />
        <path d="m14 6-3.1 3.1" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        <path d="m6 14 3.1-3.1" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        <path d="M14 14.8V18" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
        <path d="M6 10.2V6" stroke="hsl(var(--foreground))" strokeWidth="1.5" />
    </svg>
);

export const ExternalLinkIconSmall = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="hsl(var(--primary))"/>
        <polyline points="9 22 9 12 15 12 15 22" stroke="hsl(var(--primary-foreground))" strokeWidth="2" />
    </svg>
);

export const HelpCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="hsl(var(--primary))"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" fill="none"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="hsl(var(--primary-foreground))" strokeWidth="2" fill="none"/>
    </svg>
);

export const NetworkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="2" y="2" width="7" height="7" rx="2" ry="2" fill="hsl(var(--primary))"/>
        <rect x="15" y="2" width="7" height="7" rx="2" ry="2" fill="hsl(var(--primary))"/>
        <rect x="2" y="15" width="7" height="7" rx="2" ry="2" fill="hsl(var(--primary))"/>
        <rect x="15" y="15" width="7" height="7" rx="2" ry="2" fill="hsl(var(--primary))"/>
        <path d="M9 5.5H15" stroke="hsl(var(--accent))" strokeWidth="1.5" />
        <path d="M5.5 9V15" stroke="hsl(var(--accent))" strokeWidth="1.5" />
        <path d="M9 18.5H15" stroke="hsl(var(--accent))" strokeWidth="1.5" />
        <path d="M18.5 9V15" stroke="hsl(var(--accent))" strokeWidth="1.5" />
    </svg>
);

export const ListTreeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 12h-4" />
        <path d="M15 6h-4" />
        <path d="M17 18h-4" />
        <path d="M3 6h4" />
        <path d="M3 12h8" />
        <path d="M3 18h6" />
        <circle cx="4" cy="6" r="1" fill="hsl(var(--primary))" />
        <circle cx="6" cy="12" r="1" fill="hsl(var(--primary))" />
        <circle cx="5" cy="18" r="1" fill="hsl(var(--primary))" />
    </svg>
);

export const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="hsl(var(--primary))"/>
    </svg>
);

export const ShieldAlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="hsl(48, 95.8%, 53.1%)"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="hsl(var(--foreground))" strokeWidth="2" />
        <line x1="12" y1="16" x2="12.01" y2="16" stroke="hsl(var(--foreground))" strokeWidth="2" />
    </svg>
);

export const ShieldXIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="hsl(220, 13%, 69%)"/>
        <line x1="15" y1="9" x2="9" y2="15" stroke="hsl(var(--foreground))" strokeWidth="2" />
        <line x1="9" y1="9" x2="15" y2="15" stroke="hsl(var(--foreground))" strokeWidth="2" />
    </svg>
);

export const TargetIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="10" fill="hsl(var(--destructive))"/>
        <circle cx="12" cy="12" r="6" fill="hsl(var(--primary-foreground))"/>
        <circle cx="12" cy="12" r="2" fill="hsl(var(--destructive))"/>
    </svg>
);

export const CalendarDaysIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" fill="hsl(var(--primary))"/>
      <line x1="16" x2="16" y1="2" y2="6" stroke="hsl(var(--primary-foreground))" strokeWidth="2"/>
      <line x1="8" x2="8" y1="2" y2="6" stroke="hsl(var(--primary-foreground))" strokeWidth="2"/>
      <line x1="3" x2="21" y1="10" y2="10" stroke="hsl(var(--primary-foreground))" strokeWidth="2"/>
    </svg>
);

export const CheckCheck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6 7 17l-5-5"/>
    <path d="m22 10-7.5 7.5L13 16"/>
  </svg>
);
