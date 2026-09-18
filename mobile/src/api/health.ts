import { apiRequest } from './client';

export type HealthResponse = {
  service: string;
  status: string;
  timestamp: string;
};

export function checkBackendHealth() {
  return apiRequest<HealthResponse>('/api/v1/health');
}