import { apiRequest } from './client';

export type WalletResponse = {
  totalGrams: number;
  reservedGrams: number;
  encumberedGrams: number;
  availableGrams: number;
};

export function getWallet() {
  return apiRequest<WalletResponse>('/api/v1/customer/wallet');
}