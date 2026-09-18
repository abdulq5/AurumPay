import { apiRequest } from './client';

export type OtpRequest = {
  mobileNumber: string;
  purpose: 'LOGIN' | 'SIGNUP';
  fullName?: string;
  email?: string;
};

export type OtpResponse = {
  requestId: string;
  status: string;
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

export type CustomerResponse = {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  status: string;
};

export function requestOtp(request: OtpRequest) {
  return apiRequest<OtpResponse>('/api/v1/auth/otp/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function verifyOtp(
  mobileNumber: string,
  code: string,
  purpose: OtpRequest['purpose'],
) {
  return apiRequest<TokenResponse>('/api/v1/auth/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobileNumber, code, purpose }),
  });
}

export function getCurrentCustomer(accessToken: string) {
  return apiRequest<CustomerResponse>('/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function logout(refreshToken: string) {
  return apiRequest<void>('/api/v1/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
}