import {
  RedemptionProduct,
} from '../../../types/redemption';


/*
 * AurumPay Redemption Catalogue
 *
 * Mock catalogue for the current
 * development/demo phase.
 *
 * Later this catalogue can come from:
 *
 * Merchant Catalogue API
 *        ↓
 * AurumPay Backend
 *        ↓
 * AurumPay Mobile App
 */


export const redemptionProducts:
  RedemptionProduct[] = [


  /*
   * ============================
   * GOLD COINS
   * ============================
   */


  {
    id: 'coin-1g',

    name:
      'AurumPay Gold Coin - 1g',

    category:
      'COIN',

    description:
      'Certified 1 gram AurumPay physical gold coin suitable for investment and gifting.',

    purity:
      '24K',

    goldContent:
      '99.99% Fine Gold',

    designStyle:
      'Classic Minted',

    productCode:
      'AP-COIN-1G',

    goldWeight:
      1,

    grossWeight:
      1,

    netGoldWeight:
      1,

    goldValue:
      6320,

    designCharges:
      0,

    makingCharges:
      0,

    stoneCharges:
      0,

    packagingCharges:
      50,

    deliveryCharges:
      50,

    otherCharges:
      0,

    taxAmount:
      0,

    totalAmount:
      6420,

    merchantId:
      'aurumpay-demo-merchant',

    merchantName:
      'AurumPay Demo Merchant',
  },


  {
    id: 'coin-5g',

    name:
      'AurumPay Gold Coin - 5g',

    category:
      'COIN',

    description:
      'Certified 5 gram AurumPay physical gold coin suitable for investment, gifting and long-term holding.',

    purity:
      '24K',

    goldContent:
      '99.99% Fine Gold',

    designStyle:
      'Classic Minted',

    productCode:
      'AP-COIN-5G',

    goldWeight:
      5,

    grossWeight:
      5,

    netGoldWeight:
      5,

    goldValue:
      31600,

    designCharges:
      0,

    makingCharges:
      0,

    stoneCharges:
      0,

    packagingCharges:
      100,

    deliveryCharges:
      200,

    otherCharges:
      0,

    taxAmount:
      0,

    totalAmount:
      31900,

    merchantId:
      'aurumpay-demo-merchant',

    merchantName:
      'AurumPay Demo Merchant',
  },


  {
    id: 'coin-10g',

    name:
      'AurumPay Gold Coin - 10g',

    category:
      'COIN',

    description:
      'Certified 10 gram AurumPay physical gold coin suitable for investment and premium gifting.',

    purity:
      '24K',

    goldContent:
      '99.99% Fine Gold',

    designStyle:
      'Premium Minted',

    productCode:
      'AP-COIN-10G',

    goldWeight:
      10,

    grossWeight:
      10,

    netGoldWeight:
      10,

    goldValue:
      63200,

    designCharges:
      0,

    makingCharges:
      0,

    stoneCharges:
      0,

    packagingCharges:
      200,

    deliveryCharges:
      300,

    otherCharges:
      0,

    taxAmount:
      0,

    totalAmount:
      63700,

    merchantId:
      'aurumpay-demo-merchant',

    merchantName:
      'AurumPay Demo Merchant',
  },


  /*
   * ============================
   * GOLD BARS
   * ============================
   */


  {
    id: 'bar-5g',

    name:
      'AurumPay Gold Bar - 5g',

    category:
      'BAR',

    description:
      'Certified 5 gram AurumPay physical gold bar designed for secure investment and long-term gold ownership.',

    purity:
      '24K',

    goldContent:
      '99.99% Fine Gold',

    designStyle:
      'Investment Bar',

    productCode:
      'AP-BAR-5G',

    goldWeight:
      5,

    grossWeight:
      5,

    netGoldWeight:
      5,

    goldValue:
      31600,

    designCharges:
      0,

    makingCharges:
      0,

    stoneCharges:
      0,

    packagingCharges:
      50,

    deliveryCharges:
      100,

    otherCharges:
      0,

    taxAmount:
      0,

    totalAmount:
      31750,

    merchantId:
      'aurumpay-demo-merchant',

    merchantName:
      'AurumPay Demo Merchant',
  },


  {
    id: 'bar-10g',

    name:
      'AurumPay Gold Bar - 10g',

    category:
      'BAR',

    description:
      'Certified 10 gram AurumPay physical gold bar suitable for investment and long-term physical gold storage.',

    purity:
      '24K',

    goldContent:
      '99.99% Fine Gold',

    designStyle:
      'Investment Bar',

    productCode:
      'AP-BAR-10G',

    goldWeight:
      10,

    grossWeight:
      10,

    netGoldWeight:
      10,

    goldValue:
      63200,

    designCharges:
      0,

    makingCharges:
      0,

    stoneCharges:
      0,

    packagingCharges:
      100,

    deliveryCharges:
      150,

    otherCharges:
      0,

    taxAmount:
      0,

    totalAmount:
      63450,

    merchantId:
      'aurumpay-demo-merchant',

    merchantName:
      'AurumPay Demo Merchant',
  },


  {
    id: 'bar-20g',

    name:
      'AurumPay Gold Bar - 20g',

    category:
      'BAR',

    description:
      'Certified 20 gram AurumPay physical gold bar for customers looking to convert a larger portion of their digital gold into physical gold.',

    purity:
      '24K',

    goldContent:
      '99.99% Fine Gold',

    designStyle:
      'Premium Investment Bar',

    productCode:
      'AP-BAR-20G',

    goldWeight:
      20,

    grossWeight:
      20,

    netGoldWeight:
      20,

    goldValue:
      126400,

    designCharges:
      0,

    makingCharges:
      0,

    stoneCharges:
      0,

    packagingCharges:
      150,

    deliveryCharges:
      250,

    otherCharges:
      0,

    taxAmount:
      0,

    totalAmount:
      126800,

    merchantId:
      'aurumpay-demo-merchant',

    merchantName:
      'AurumPay Demo Merchant',
  },


  /*
   * ============================
   * JEWELLERY
   * ============================
   */


  {
    id: 'ring-classic',

    name:
      'Classic Gold Ring',

    category:
      'JEWELLERY',

    description:
      'Elegant classic gold ring available through an AurumPay jewellery partner and suitable for daily wear or gifting.',

    purity:
      '22K',

    goldContent:
      '91.6% Gold',

    designStyle:
      'Classic',

    productCode:
      'AP-JEW-RING-001',

    goldWeight:
      5,

    grossWeight:
      5,

    netGoldWeight:
      5,

    goldValue:
      31600,

    designCharges:
      1000,

    makingCharges:
      4500,

    stoneCharges:
      0,

    packagingCharges:
      100,

    deliveryCharges:
      200,

    otherCharges:
      0,

    taxAmount:
      298,

    totalAmount:
      37698,

    merchantId:
      'aurumpay-demo-merchant',

    merchantName:
      'AurumPay Demo Merchant',
  },


  {
    id: 'chain-classic',

    name:
      'Classic Gold Chain',

    category:
      'JEWELLERY',

    description:
      'Classic 22K gold chain available through an AurumPay jewellery partner with a timeless design suitable for regular wear.',

    purity:
      '22K',

    goldContent:
      '91.6% Gold',

    designStyle:
      'Classic',

    productCode:
      'AP-JEW-CHAIN-001',

    goldWeight:
      10,

    grossWeight:
      10,

    netGoldWeight:
      10,

    goldValue:
      63200,

    designCharges:
      2000,

    makingCharges:
      9000,

    stoneCharges:
      0,

    packagingCharges:
      150,

    deliveryCharges:
      300,

    otherCharges:
      0,

    taxAmount:
      746,

    totalAmount:
      75396,

    merchantId:
      'aurumpay-demo-merchant',

    merchantName:
      'AurumPay Demo Merchant',
  },


  {
    id: 'necklace-stone',

    name:
      'Gold Necklace with Stones',

    category:
      'JEWELLERY',

    description:
      'Premium 22K gold necklace with decorative stones available through an AurumPay jewellery partner.',

    purity:
      '22K',

    goldContent:
      '91.6% Gold',

    designStyle:
      'Traditional Stone Design',

    productCode:
      'AP-JEW-NECK-001',

    goldWeight:
      12,

    grossWeight:
      14,

    netGoldWeight:
      12,

    stoneWeight:
      2,

    stoneDetails:
      'Decorative stones, total weight approximately 2 grams.',

    goldValue:
      75840,

    designCharges:
      4000,

    makingCharges:
      12000,

    stoneCharges:
      5000,

    packagingCharges:
      250,

    deliveryCharges:
      300,

    otherCharges:
      0,

    taxAmount:
      1000,

    totalAmount:
      98390,

    merchantId:
      'aurumpay-demo-merchant',

    merchantName:
      'AurumPay Demo Merchant',
  },

];