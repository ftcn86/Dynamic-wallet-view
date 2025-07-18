"use client";

import { useEffect } from 'react';

/**
 * PiSDKInitializer Component
 * 
 * This component handles the initialization of the Pi Network SDK.
 * It runs on the client side and ensures the SDK is properly loaded and initialized.
 */
export function PiSDKInitializer() {
  useEffect(() => {
    // Initialize Pi Network SDK when component mounts
    const initializePiSDK = () => {
      if (typeof window !== 'undefined' && (window as any).Pi) {
        try {
          // Initialize Pi SDK with version 2.0 and sandbox flag
          (window as any).Pi.init({ 
            version: "2.0",
            sandbox: true  // Enable sandbox/testnet mode
          });
          console.log('✅ Pi Network SDK initialized successfully with sandbox mode');
          
          // Check if we're in sandbox mode
          const urlParams = new URLSearchParams(window.location.search);
          const sandboxMode = urlParams.get('sandbox') === 'true';
          
          if (sandboxMode) {
            console.log('🔧 Running in Pi Network sandbox mode');
            // Set sandbox flag for the app
            (window as any).__PI_SANDBOX_MODE__ = true;
          }
          
        } catch (error) {
          console.error('❌ Failed to initialize Pi Network SDK:', error);
        }
      } else {
        console.log('ℹ️ Pi Network SDK not available (running in regular browser)');
      }
    };

    // Try to initialize immediately
    initializePiSDK();

    // Also try after a short delay in case the script loads later
    const timeoutId = setTimeout(initializePiSDK, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // This component doesn't render anything
  return null;
} 