# Pi Network Integration Guide

## Overview

This document provides comprehensive guidance for integrating Pi Network functionality into the Dynamic Wallet View application. The integration includes authentication, payments, and data fetching capabilities.

## Architecture

### Core Components

1. **Pi Network SDK Wrapper** (`src/lib/pi-network.ts`)
   - Type-safe interface for Pi Network SDK
   - Handles authentication, payments, and API calls
   - Environment detection and fallback mechanisms

2. **Service Layer** (`src/services/piService.ts`)
   - Abstracts data source (real vs mock)
   - Provides consistent API for components
   - Handles data conversion and transformation

3. **API Endpoints** (`src/app/api/`)
   - `/api/auth/pi` - Authentication and session management
   - `/api/user/me` - User data and profile information
   - `/api/payments` - Payment operations and history

4. **Configuration** (`src/lib/config.ts`)
   - Environment-specific settings
   - Feature flags and API configuration
   - Pi Network credentials management

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Pi Network Configuration
NEXT_PUBLIC_PI_APP_ID=your-app-id
NEXT_PUBLIC_PI_API_KEY=your-api-key

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_RETRIES=3

# Feature Flags
NEXT_PUBLIC_ENABLE_REAL_PAYMENTS=false
NEXT_PUBLIC_ENABLE_REAL_AUTH=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### 2. Pi Network App Registration

1. Visit the [Pi Network Developer Portal](https://developers.minepi.com/)
2. Create a new app
3. Configure authentication scopes:
   - `username` - Basic user information
   - `payments` - Payment capabilities
   - `roles` - User roles (optional)
4. Set up payment endpoints
5. Configure app settings and permissions

### 3. SDK Integration

The Pi Network SDK is automatically loaded when running in the Pi Browser. For development, the app falls back to mock data.

## Authentication Flow

### 1. User Login

```typescript
import { getAuthenticatedUser } from '@/services/piService';

const user = await getAuthenticatedUser();
```

### 2. Token Validation

```typescript
import { validatePiToken } from '@/services/piService';

const isValid = await validatePiToken(accessToken);
```

### 3. Session Management

```typescript
// Create session
const response = await fetch('/api/auth/pi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ accessToken, user })
});

// Validate session
const session = await fetch(`/api/auth/pi?token=${sessionToken}`);
```

## Payment Integration

### 1. Create Payment

```typescript
import { createPiPayment } from '@/services/piService';

const paymentData = {
  amount: 5.0,
  memo: 'Donation to Dynamic Wallet View',
  metadata: {
    type: 'donation',
    app: 'dynamic-wallet-view'
  }
};

const payment = await createPiPayment(paymentData);
```

### 2. Complete Payment

```typescript
import { completePiPayment } from '@/services/piService';

const completedPayment = await completePiPayment(payment);
```

### 3. Cancel Payment

```typescript
import { cancelPiPayment } from '@/services/piService';

const cancelledPayment = await cancelPiPayment(payment);
```

## Data Fetching

### 1. User Data

```typescript
import { getUserPiBalance, getTeamMembers, getNodeData } from '@/services/piService';

const [balance, team, nodeData] = await Promise.all([
  getUserPiBalance(accessToken),
  getTeamMembers(),
  getNodeData()
]);
```

### 2. Payment History

```typescript
import { getUserPaymentHistory } from '@/services/piService';

const transactions = await getUserPaymentHistory(accessToken);
```

## Environment Detection

The app automatically detects the environment and adjusts behavior accordingly:

```typescript
import { isPiBrowser, isPiTestnet } from '@/lib/pi-network';

if (isPiBrowser()) {
  // Use real Pi Network SDK
  const piSDK = getPiSDK();
  const authResult = await piSDK.authenticate(['username', 'payments']);
} else {
  // Use mock data for development
  const mockUser = await getAuthenticatedUser();
}
```

## API Endpoints

### Authentication

#### POST `/api/auth/pi`
Authenticate user with Pi Network token.

**Request:**
```json
{
  "accessToken": "pi_network_access_token",
  "user": {
    "uid": "user_id",
    "username": "username",
    "profile": {
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionToken": "session_token",
  "user": {
    "id": "user_id",
    "username": "username",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "expiresAt": 1640995200000
}
```

#### GET `/api/auth/pi?token=session_token`
Validate session token.

### User Data

#### GET `/api/user/me`
Get comprehensive user information.

**Headers:**
```
Authorization: Bearer session_token
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "username",
    "name": "John Doe",
    "email": "john@example.com",
    "totalBalance": 150.5,
    "miningRate": 0.0202,
    "isNodeOperator": true,
    "nodeUptimePercentage": 98.5,
    "balanceBreakdown": {
      "transferableToMainnet": 105.35,
      "totalUnverifiedPi": 45.15,
      "currentlyInLockups": 0
    },
    "teamMembers": [...],
    "badges": [...],
    "activityMetrics": {
      "userActiveMiningHours_LastWeek": 24,
      "userActiveMiningHours_LastMonth": 168,
      "activeMiningDays_LastWeek": 7,
      "activeMiningDays_LastMonth": 30
    }
  }
}
```

### Payments

#### POST `/api/payments`
Handle payment operations.

**Request:**
```json
{
  "action": "create",
  "paymentData": {
    "amount": 5.0,
    "memo": "Donation",
    "metadata": {
      "type": "donation"
    }
  }
}
```

#### GET `/api/payments`
Get payment history.

## Error Handling

### Common Errors

1. **Invalid Token**
   ```json
   {
     "error": "Invalid Pi Network access token",
     "status": 401
   }
   ```

2. **Payment Failed**
   ```json
   {
     "error": "Payment creation failed: Insufficient balance",
     "status": 400
   }
   ```

3. **Network Error**
   ```json
   {
     "error": "Failed to connect to Pi Network",
     "status": 503
   }
   ```

### Error Handling Best Practices

```typescript
try {
  const payment = await createPiPayment(paymentData);
  // Handle success
} catch (error) {
  if (error.message.includes('Insufficient balance')) {
    // Handle insufficient balance
  } else if (error.message.includes('Network error')) {
    // Handle network issues
  } else {
    // Handle generic errors
  }
}
```

## Security Considerations

### 1. Token Management
- Never store access tokens in localStorage
- Use secure session management
- Implement token refresh mechanisms

### 2. Payment Security
- Always validate payment amounts
- Implement proper error handling
- Use HTTPS in production

### 3. Data Privacy
- Minimize data collection
- Implement proper data retention policies
- Follow Pi Network privacy guidelines

## Testing

### 1. Development Testing
- Use mock data for development
- Test with different user scenarios
- Validate error handling

### 2. Pi Browser Testing
- Test in actual Pi Browser
- Validate real payment flows
- Test authentication scenarios

### 3. Production Testing
- Test with real Pi Network credentials
- Validate all API endpoints
- Test error scenarios

## Deployment

### 1. Environment Setup
- Configure production environment variables
- Set up proper API endpoints
- Configure SSL certificates

### 2. Monitoring
- Implement error logging
- Monitor API performance
- Track user interactions

### 3. Updates
- Keep Pi Network SDK updated
- Monitor for breaking changes
- Test updates thoroughly

## Troubleshooting

### Common Issues

1. **SDK Not Available**
   - Ensure running in Pi Browser
   - Check SDK initialization
   - Verify app configuration

2. **Authentication Failures**
   - Validate app credentials
   - Check token expiration
   - Verify scopes configuration

3. **Payment Issues**
   - Check user balance
   - Validate payment data
   - Verify network connectivity

### Debug Mode

Enable debug logging in development:

```typescript
import { logConfig } from '@/lib/config';

// Log configuration
logConfig();

// Check environment
console.log('Environment:', getEnvironmentSettings());
```

## Support

For issues related to:
- **Pi Network SDK**: [Pi Network Documentation](https://developers.minepi.com/)
- **App Integration**: Check this documentation
- **General Support**: Contact support@dynamicwalletview.com

## Version History

- **v1.0.0**: Initial Pi Network integration
- **v1.1.0**: Added payment functionality
- **v1.2.0**: Enhanced error handling and security 