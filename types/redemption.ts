/*
 * AurumPay Redemption Types
 *
 * These types define the complete
 * business data used for redeeming
 * digital gold against products.
 */


/*
 * Types of products available
 * for redemption.
 */

export type RedemptionCategory =
  | 'COIN'
  | 'BAR'
  | 'JEWELLERY';


/*
 * Ways in which digital gold
 * can be applied.
 */

export type RedemptionPaymentMode =
  | 'GOLD_COMPONENT_ONLY'
  | 'MAXIMUM_GOLD'
  | 'FULL_GOLD';


/*
 * Redemption transaction status.
 */

export type RedemptionStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';


/*
 * Complete redemption product.
 *
 * Supports:
 *
 * Coins
 * Bars
 * Jewellery
 */

export interface RedemptionProduct {


  /*
   * PRODUCT IDENTITY
   */

  id:
    string;


  name:
    string;


  category:
    RedemptionCategory;


  description:
    string;


  image?:
    string;


  /*
   * MERCHANT
   */

  merchantId:
    string;


  merchantName:
    string;


  /*
   * PRODUCT / DESIGN INFORMATION
   */

  designStyle?:
    string;


  productCode?:
    string;


  collection?:
    string;


  /*
   * GOLD INFORMATION
   */

  purity?:
    string;


  /*
   * Primary gold quantity.
   *
   * Represents the relevant
   * gold quantity of the
   * physical product.
   */

  goldWeight:
    number;


  /*
   * Complete physical product
   * weight.
   */

  grossWeight?:
    number;


  /*
   * Net gold weight.
   */

  netGoldWeight?:
    number;


  /*
   * Stone / non-gold weight.
   */

  stoneWeight?:
    number;


  /*
   * Stone details.
   */

  stoneDetails?:
    string;


  /*
   * Gold composition.
   *
   * Example:
   *
   * 91.6% Gold
   * 99.99% Fine Gold
   */

  goldContent?:
    string;


  /*
   * PRODUCT INVOICE
   */


  /*
   * Value of the physical
   * gold component.
   */

  goldValue:
    number;


  /*
   * Design charges.
   */

  designCharges:
    number;


  /*
   * Making / manufacturing
   * charges.
   */

  makingCharges:
    number;


  /*
   * Stone / gem charges.
   */

  stoneCharges:
    number;


  /*
   * Packaging charges.
   */

  packagingCharges:
    number;


  /*
   * Delivery charges.
   */

  deliveryCharges:
    number;


  /*
   * Other charges.
   */

  otherCharges:
    number;


  /*
   * Total tax amount.
   */

  taxAmount:
    number;


  /*
   * Optional tax rate for
   * invoice display.
   */

  taxRate?:
    number;


  /*
   * Final invoice amount.
   *
   * This should equal:
   *
   * Gold Value
   * + Design Charges
   * + Making Charges
   * + Stone Charges
   * + Packaging Charges
   * + Delivery Charges
   * + Other Charges
   * + Tax Amount
   */

  totalAmount:
    number;

}


/*
 * Snapshot of the redemption
 * gold rate used for a transaction.
 */

export interface RedemptionGoldRate {


  ratePerGram:
    number;


  rateType:
    'CUSTOMER_BUY_PRICE';


  lockedAt:
    string;


  expiresAt?:
    string;

}


/*
 * Complete redemption
 * calculation.
 */

export interface RedemptionCalculation {


  /*
   * CUSTOMER GOLD POSITION
   */

  availableGold:
    number;


  goldUsed:
    number;


  goldRemaining:
    number;


  /*
   * TOTAL VALUE GENERATED
   * FROM DIGITAL GOLD.
   */

  goldValueApplied:
    number;


  /*
   * INDIVIDUAL INVOICE
   * COMPONENTS COVERED
   * BY DIGITAL GOLD.
   */

  goldComponentApplied:
    number;


  designChargesApplied:
    number;


  makingChargesApplied:
    number;


  stoneChargesApplied:
    number;


  packagingChargesApplied:
    number;


  deliveryChargesApplied:
    number;


  otherChargesApplied:
    number;


  taxApplied:
    number;


  /*
   * REMAINING AMOUNT TO BE
   * PAID THROUGH CASH,
   * CARD OR UPI.
   */

  cashRequired:
    number;


  /*
   * COMPLETE INVOICE AMOUNT.
   */

  totalInvoiceAmount:
    number;


  /*
   * SELECTED PAYMENT MODE.
   */

  paymentMode:
    RedemptionPaymentMode;

}


/*
 * Complete redemption
 * transaction snapshot.
 */

export interface RedemptionTransaction {


  id:
    string;


  type:
    'REDEEM';


  status:
    RedemptionStatus;


  createdAt:
    string;


  /*
   * PRODUCT SNAPSHOT.
   */

  product:
    RedemptionProduct;


  /*
   * CUSTOMER PAYMENT CHOICE.
   */

  paymentMode:
    RedemptionPaymentMode;


  /*
   * GOLD RATE SNAPSHOT.
   */

  goldRate:
    RedemptionGoldRate;


  /*
   * CALCULATION SNAPSHOT.
   */

  calculation:
    RedemptionCalculation;


  /*
   * WALLET POSITION.
   */

  goldBalanceBefore:
    number;


  goldBalanceAfter:
    number;


  /*
   * FINANCIAL VALUES.
   */

  totalAmount:
    number;


  goldValueApplied:
    number;


  cashAmountPaid:
    number;


  /*
   * CASH PAYMENT METHOD.
   *
   * Examples:
   *
   * UPI
   * CARD
   * BANK_TRANSFER
   */

  paymentMethod?:
    string;


  /*
   * MERCHANT INFORMATION.
   */

  merchantId:
    string;


  merchantName:
    string;

}