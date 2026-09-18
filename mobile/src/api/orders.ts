import { apiRequest } from './client';

export type PriceLockResponse = {
  lockId: string;
  quantityGrams: number;
  pricePerGram: number;
  amount: number;
  expiresAt: string;
  status: string;
};

export type BuyOrderResponse = {
  orderId: string;
  status: string;
  quantityGrams: number;
  pricePerGram: number;
  totalAmount: number;
};

export type PaymentResponse = {
  paymentId: string;
  providerPaymentId: string;
  status: string;
  amount: number;
  currency: string;
};

export function createPriceLock(amount: number) {
  return apiRequest<PriceLockResponse>('/api/v1/gold/price-locks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
}

export function createBuyOrder(priceLockId: string, idempotencyKey: string) {
  return apiRequest<BuyOrderResponse>('/api/v1/gold/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceLockId, idempotencyKey }),
  });
}

export function createPayment(
  orderId: string,
  idempotencyKey: string,
  paymentMethod: string,
) {
  return apiRequest<PaymentResponse>('/api/v1/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, idempotencyKey, paymentMethod }),
  });
}