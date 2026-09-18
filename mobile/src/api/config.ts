const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = (
  configuredBaseUrl || 'http://10.10.10.245:8080'
).replace(/\/$/, '');