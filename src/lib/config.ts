/**
 * Application Configuration
 * 
 * This file manages all environment-specific configuration including:
 * - Pi Network API settings
 * - Environment detection
 * - Feature flags
 * - API endpoints
 */

export interface AppConfig {
  // Environment
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  
  // Pi Network Configuration
  piNetwork: {
    appId: string;
    apiKey: string;
    sandbox: boolean;
  };
  
  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  
  // Feature Flags
  features: {
    realPayments: boolean;
    realAuthentication: boolean;
    analytics: boolean;
    notifications: boolean;
  };
  
  // App Settings
  app: {
    name: string;
    version: string;
    description: string;
    supportEmail: string;
  };
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback: string = ''): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  return fallback;
}

/**
 * Detect if running in Pi Browser
 */
function isPiBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).Pi;
}

/**
 * Detect if running in sandbox mode
 */
function isSandboxMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check URL parameter for sandbox mode
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('sandbox') === 'true') return true;
  
  // Check global sandbox flag
  if ((window as any).__PI_SANDBOX_MODE__) return true;
  
  // Check if Pi SDK indicates sandbox mode
  if ((window as any).Pi?.sandbox) return true;
  
  return false;
}

/**
 * Application configuration
 */
export const config: AppConfig = {
  // Environment detection
  isDevelopment: getEnvVar('NODE_ENV') === 'development',
  isProduction: getEnvVar('NODE_ENV') === 'production',
  isTest: getEnvVar('NODE_ENV') === 'test',
  
  // Pi Network configuration
  piNetwork: {
    appId: getEnvVar('NEXT_PUBLIC_PI_APP_ID', 'dynamic-wallet-view'),
    apiKey: getEnvVar('NEXT_PUBLIC_PI_API_KEY', ''),
    sandbox: isSandboxMode(),
  },
  
  // API configuration
  api: {
    baseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000'),
    timeout: parseInt(getEnvVar('NEXT_PUBLIC_API_TIMEOUT', '10000')),
    retries: parseInt(getEnvVar('NEXT_PUBLIC_API_RETRIES', '3')),
  },
  
  // Feature flags
  features: {
    realPayments: isPiBrowser() && getEnvVar('NEXT_PUBLIC_ENABLE_REAL_PAYMENTS', 'false') === 'true',
    realAuthentication: isPiBrowser() && getEnvVar('NEXT_PUBLIC_ENABLE_REAL_AUTH', 'false') === 'true',
    analytics: getEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', 'false') === 'true',
    notifications: getEnvVar('NEXT_PUBLIC_ENABLE_NOTIFICATIONS', 'true') === 'true',
  },
  
  // App settings
  app: {
    name: 'Dynamic Wallet View',
    version: '1.0.0',
    description: 'A comprehensive dashboard for Pi Network users',
    supportEmail: 'support@dynamicwalletview.com',
  },
};

/**
 * Get Pi Network configuration for current environment
 */
export function getPiNetworkConfig() {
  return {
    appId: config.piNetwork.appId,
    apiKey: config.piNetwork.apiKey,
    sandbox: config.piNetwork.sandbox,
  };
}

/**
 * Check if real Pi Network features should be enabled
 */
export function shouldUseRealPiNetwork(): boolean {
  return isPiBrowser() && config.features.realAuthentication;
}

/**
 * Check if running in sandbox mode
 */
export function isInSandboxMode(): boolean {
  return config.piNetwork.sandbox;
}

/**
 * Get API endpoint URL
 */
export function getApiUrl(endpoint: string): string {
  return `${config.api.baseUrl}/api${endpoint}`;
}

/**
 * Get environment-specific settings
 */
export function getEnvironmentSettings() {
  return {
    isPiBrowser: isPiBrowser(),
    isSandbox: isSandboxMode(),
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    features: config.features,
  };
}

/**
 * Validate configuration
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required environment variables
  if (!config.piNetwork.appId) {
    errors.push('NEXT_PUBLIC_PI_APP_ID is required');
  }
  
  if (config.isProduction && !config.piNetwork.apiKey) {
    errors.push('NEXT_PUBLIC_PI_API_KEY is required in production');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Log configuration (development only)
 */
export function logConfig(): void {
  if (config.isDevelopment) {
    console.log('🔧 App Configuration:', {
      environment: getEnvVar('NODE_ENV'),
      isPiBrowser: isPiBrowser(),
      isSandbox: isSandboxMode(),
      features: config.features,
      api: {
        baseUrl: config.api.baseUrl,
        timeout: config.api.timeout,
      },
    });
  }
}

// Log configuration on import (development only)
if (config.isDevelopment) {
  logConfig();
} 