import {
  RedemptionCalculation,
  RedemptionPaymentMode,
  RedemptionProduct,
} from '../../../types/redemption';


/*
 * AurumPay Redemption Calculation Engine
 *
 * This file is the single source of truth
 * for all redemption calculations.
 *
 * Every redemption screen must use this
 * calculation instead of independently
 * calculating gold usage or remaining
 * payment.
 */


/*
 * Round financial values safely.
 */

function roundMoney(
  value: number
) {

  return Number(
    value.toFixed(2)
  );

}


/*
 * Round gold quantities.
 *
 * Digital gold is stored with
 * higher precision than currency.
 */

function roundGold(
  value: number
) {

  return Number(
    value.toFixed(6)
  );

}


/*
 * Apply available value to an
 * invoice component.
 *
 * Returns:
 *
 * applied value
 * remaining available value
 */

function applyToComponent(

  availableValue: number,

  componentValue: number

) {

  const applied =
    Math.min(
      availableValue,
      componentValue
    );


  const remainingValue =
    availableValue -
    applied;


  return {

    applied:
      roundMoney(
        applied
      ),

    remainingValue:
      roundMoney(
        Math.max(
          0,
          remainingValue
        )
      ),

  };

}


/*
 * Calculate complete redemption.
 *
 * Parameters:
 *
 * availableGold
 *   Customer's current digital
 *   gold balance in grams.
 *
 * goldRate
 *   Applicable redemption value
 *   per gram.
 *
 * product
 *   Selected redemption product.
 *
 * paymentMode
 *   Customer's selected way of
 *   using digital gold.
 */

export function calculateRedemption(

  availableGold: number,

  goldRate: number,

  product: RedemptionProduct,

  paymentMode: RedemptionPaymentMode

): RedemptionCalculation {


  /*
   * Basic validation.
   *
   * Invalid values return a safe
   * zero calculation instead of
   * producing NaN.
   */

  const safeAvailableGold =
    Number.isFinite(
      availableGold
    ) &&
    availableGold > 0

      ? availableGold

      : 0;


  const safeGoldRate =
    Number.isFinite(
      goldRate
    ) &&
    goldRate > 0

      ? goldRate

      : 0;


  /*
   * Read and safely normalize
   * every invoice component.
   */

  const goldComponent =
    Math.max(
      0,
      product.goldValue || 0
    );


  const designCharges =
    Math.max(
      0,
      product.designCharges || 0
    );


  const makingCharges =
    Math.max(
      0,
      product.makingCharges || 0
    );


  const stoneCharges =
    Math.max(
      0,
      product.stoneCharges || 0
    );


  const packagingCharges =
    Math.max(
      0,
      product.packagingCharges || 0
    );


  const deliveryCharges =
    Math.max(
      0,
      product.deliveryCharges || 0
    );


  const otherCharges =
    Math.max(
      0,
      product.otherCharges || 0
    );


  const taxAmount =
    Math.max(
      0,
      product.taxAmount || 0
    );


  /*
   * Calculate invoice total from
   * components.
   *
   * This prevents a screen from
   * depending only on a potentially
   * incorrect totalAmount.
   */

  const calculatedInvoiceTotal =
    goldComponent +
    designCharges +
    makingCharges +
    stoneCharges +
    packagingCharges +
    deliveryCharges +
    otherCharges +
    taxAmount;


  /*
   * Use the calculated total as
   * the authoritative amount.
   *
   * Catalogue data should still
   * keep totalAmount synchronized
   * with this value.
   */

  const totalInvoiceAmount =
    roundMoney(
      calculatedInvoiceTotal
    );


  /*
   * Total monetary value available
   * from the customer's digital gold.
   */

  const availableGoldValue =
    safeAvailableGold *
    safeGoldRate;


  /*
   * Values applied to individual
   * invoice components.
   */

  let goldComponentApplied =
    0;


  let designChargesApplied =
    0;


  let makingChargesApplied =
    0;


  let stoneChargesApplied =
    0;


  let packagingChargesApplied =
    0;


  let deliveryChargesApplied =
    0;


  let otherChargesApplied =
    0;


  let taxApplied =
    0;


  /*
   * GOLD COMPONENT ONLY
   *
   * Digital gold can only pay the
   * physical gold component.
   *
   * All other charges remain
   * payable separately.
   */

  if (
    paymentMode ===
    'GOLD_COMPONENT_ONLY'
  ) {

    goldComponentApplied =
      Math.min(
        availableGoldValue,
        goldComponent
      );

  }


  /*
   * MAXIMUM GOLD
   *
   * Apply available digital gold
   * toward the complete invoice.
   *
   * Invoice allocation order:
   *
   * 1. Gold component
   * 2. Design charges
   * 3. Making charges
   * 4. Stone charges
   * 5. Packaging
   * 6. Delivery
   * 7. Other charges
   * 8. Tax
   */

  if (
    paymentMode ===
    'MAXIMUM_GOLD'
  ) {

    let remainingGoldValue =
      availableGoldValue;


    const goldResult =
      applyToComponent(
        remainingGoldValue,
        goldComponent
      );


    goldComponentApplied =
      goldResult.applied;


    remainingGoldValue =
      goldResult.remainingValue;


    const designResult =
      applyToComponent(
        remainingGoldValue,
        designCharges
      );


    designChargesApplied =
      designResult.applied;


    remainingGoldValue =
      designResult.remainingValue;


    const makingResult =
      applyToComponent(
        remainingGoldValue,
        makingCharges
      );


    makingChargesApplied =
      makingResult.applied;


    remainingGoldValue =
      makingResult.remainingValue;


    const stoneResult =
      applyToComponent(
        remainingGoldValue,
        stoneCharges
      );


    stoneChargesApplied =
      stoneResult.applied;


    remainingGoldValue =
      stoneResult.remainingValue;


    const packagingResult =
      applyToComponent(
        remainingGoldValue,
        packagingCharges
      );


    packagingChargesApplied =
      packagingResult.applied;


    remainingGoldValue =
      packagingResult.remainingValue;


    const deliveryResult =
      applyToComponent(
        remainingGoldValue,
        deliveryCharges
      );


    deliveryChargesApplied =
      deliveryResult.applied;


    remainingGoldValue =
      deliveryResult.remainingValue;


    const otherResult =
      applyToComponent(
        remainingGoldValue,
        otherCharges
      );


    otherChargesApplied =
      otherResult.applied;


    remainingGoldValue =
      otherResult.remainingValue;


    const taxResult =
      applyToComponent(
        remainingGoldValue,
        taxAmount
      );


    taxApplied =
      taxResult.applied;

  }


  /*
   * FULL GOLD
   *
   * Customer attempts to cover
   * the complete invoice using
   * digital gold.
   *
   * If sufficient gold exists,
   * cashRequired becomes zero.
   *
   * If insufficient gold exists,
   * all available gold is applied
   * and the remainder becomes
   * cashRequired.
   *
   * Allocation follows the same
   * invoice order as MAXIMUM_GOLD.
   */

  if (
    paymentMode ===
    'FULL_GOLD'
  ) {

    let remainingGoldValue =
      availableGoldValue;


    const goldResult =
      applyToComponent(
        remainingGoldValue,
        goldComponent
      );


    goldComponentApplied =
      goldResult.applied;


    remainingGoldValue =
      goldResult.remainingValue;


    const designResult =
      applyToComponent(
        remainingGoldValue,
        designCharges
      );


    designChargesApplied =
      designResult.applied;


    remainingGoldValue =
      designResult.remainingValue;


    const makingResult =
      applyToComponent(
        remainingGoldValue,
        makingCharges
      );


    makingChargesApplied =
      makingResult.applied;


    remainingGoldValue =
      makingResult.remainingValue;


    const stoneResult =
      applyToComponent(
        remainingGoldValue,
        stoneCharges
      );


    stoneChargesApplied =
      stoneResult.applied;


    remainingGoldValue =
      stoneResult.remainingValue;


    const packagingResult =
      applyToComponent(
        remainingGoldValue,
        packagingCharges
      );


    packagingChargesApplied =
      packagingResult.applied;


    remainingGoldValue =
      packagingResult.remainingValue;


    const deliveryResult =
      applyToComponent(
        remainingGoldValue,
        deliveryCharges
      );


    deliveryChargesApplied =
      deliveryResult.applied;


    remainingGoldValue =
      deliveryResult.remainingValue;


    const otherResult =
      applyToComponent(
        remainingGoldValue,
        otherCharges
      );


    otherChargesApplied =
      otherResult.applied;


    remainingGoldValue =
      otherResult.remainingValue;


    const taxResult =
      applyToComponent(
        remainingGoldValue,
        taxAmount
      );


    taxApplied =
      taxResult.applied;

  }


  /*
   * Calculate total value applied
   * from digital gold.
   */

  const goldValueApplied =
    roundMoney(

      goldComponentApplied +
      designChargesApplied +
      makingChargesApplied +
      stoneChargesApplied +
      packagingChargesApplied +
      deliveryChargesApplied +
      otherChargesApplied +
      taxApplied

    );


  /*
   * Calculate physical digital
   * gold quantity consumed.
   */

  const goldUsed =
    safeGoldRate > 0

      ? roundGold(
          goldValueApplied /
          safeGoldRate
        )

      : 0;


  /*
   * Calculate remaining wallet
   * gold balance.
   */

  const goldRemaining =
    roundGold(

      Math.max(
        0,
        safeAvailableGold -
        goldUsed
      )

    );


  /*
   * Remaining invoice amount
   * payable through cash, card,
   * UPI or another payment method.
   */

  const cashRequired =
    roundMoney(

      Math.max(
        0,
        totalInvoiceAmount -
        goldValueApplied
      )

    );


  /*
   * Return the complete
   * synchronized calculation.
   */

  return {


    /*
     * CUSTOMER GOLD POSITION
     */

    availableGold:
      roundGold(
        safeAvailableGold
      ),


    goldUsed,


    goldRemaining,


    /*
     * TOTAL DIGITAL GOLD VALUE
     */

    goldValueApplied,


    /*
     * INVOICE ALLOCATION
     */

    goldComponentApplied:
      roundMoney(
        goldComponentApplied
      ),


    designChargesApplied:
      roundMoney(
        designChargesApplied
      ),


    makingChargesApplied:
      roundMoney(
        makingChargesApplied
      ),


    stoneChargesApplied:
      roundMoney(
        stoneChargesApplied
      ),


    packagingChargesApplied:
      roundMoney(
        packagingChargesApplied
      ),


    deliveryChargesApplied:
      roundMoney(
        deliveryChargesApplied
      ),


    otherChargesApplied:
      roundMoney(
        otherChargesApplied
      ),


    taxApplied:
      roundMoney(
        taxApplied
      ),


    /*
     * CASH PAYMENT
     */

    cashRequired,


    /*
     * COMPLETE INVOICE
     */

    totalInvoiceAmount,


    /*
     * CUSTOMER SELECTION
     */

    paymentMode,

  };

}