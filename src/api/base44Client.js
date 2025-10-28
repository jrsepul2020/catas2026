import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68fe2533d29a8a290a08e305", 
  requiresAuth: true // Ensure authentication is required for all operations
});
