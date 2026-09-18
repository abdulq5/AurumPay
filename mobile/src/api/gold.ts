import { apiRequest } from './client';

export type GoldQuote = {
  quoteId: string;
  currency: string;
  purity: string;
  buyPricePerGram: number;
  sellPricePerGram: number;
  source: string;
  validUntil: string;
};

export function getGoldQuote() {
  return apiRequest<GoldQuote>('/api/v1/gold/quote');
}