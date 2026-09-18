import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { formatGold, formatMoney } from '../src/utils/format';


/*
 * AurumPay
 *
 * Redemption Success Screen
 *
 * This screen is shown after:
 *
 * 1. Digital gold has been successfully deducted
 *    from the customer's wallet.
 *
 * AND
 *
 * 2. Any required cash payment has been
 *    successfully completed.
 *
 * The wallet update itself should already
 * have happened before navigating here.
 */


export default function RedemptionSuccess() {


  /*
   * Router.
   */

  const router =
    useRouter();


  /*
   * Receive redemption information.
   */

  const params =
    useLocalSearchParams();


  /*
   * Helper function.
   *
   * Expo Router parameters can sometimes
   * be string arrays, so this safely
   * converts them into a single string.
   */

  function getParam(
    value:
      | string
      | string[]
      | undefined
  ) {

    if (
      Array.isArray(
        value
      )
    ) {

      return (
        value[0] ??
        ''
      );

    }


    return (
      value ??
      ''
    );

  }


  /*
   * Redemption information.
   */

  const transactionId =
    getParam(
      params.transactionId
    );


  const productId =
    getParam(
      params.productId
    );


  const productName =
    getParam(
      params.productName
    );


  const paymentMode =
    getParam(
      params.paymentMode
    );


  /*
   * Financial values.
   */

  const goldUsed =
    Number(
      getParam(
        params.goldUsed
      )
    ) ||
    0;


  const goldValueApplied =
    Number(
      getParam(
        params.goldValueApplied
      )
    ) ||
    0;


  const cashAmountPaid =
    Number(
      getParam(
        params.cashAmountPaid
      )
    ) ||
    0;


  const totalAmount =
    Number(
      getParam(
        params.totalAmount
      )
    ) ||
    0;


  const goldBalanceAfter =
    Number(
      getParam(
        params.goldBalanceAfter
      )
    ) ||
    0;


  /*
   * Format currency.
   */

  function formatCurrency(amount: number) {
    return '₹' + formatMoney(amount, 2);
  }


  /*
   * Format gold quantity.
   */

  function formatGoldQuantity(quantity: number) {
    return `${formatGold(quantity)} g`;
  }


  /*
   * Format payment mode
   * into customer-friendly text.
   */

  function formatPaymentMode(
    mode: string
  ) {

    switch (
      mode
    ) {

      case 'GOLD_COMPONENT_ONLY':

        return (
          'Gold Component Only'
        );


      case 'MAXIMUM_GOLD':

        return (
          'Maximum Gold Used'
        );


      case 'FULL_GOLD':

        return (
          'Full Gold Payment'
        );


      default:

        return (
          mode ||
          'Redemption'
        );

    }

  }


  /*
   * Navigate to wallet.
   */

  function handleViewWallet() {

    router.replace(
      '/wallet'
    );

  }


  /*
   * Navigate back to
   * redemption catalogue.
   */

  function handleRedeemAgain() {

    router.replace(
      '/redeem'
    );

  }


  return (

    <SafeAreaView
      style={
        styles.safeArea
      }
    >

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
      >


        {/* SUCCESS ICON */}

        <View
          style={
            styles.successIcon
          }
        >

          <Text
            style={
              styles.successCheck
            }
          >
            ✓
          </Text>

        </View>


        {/* SUCCESS MESSAGE */}

        <Text
          style={
            styles.title
          }
        >
          Redemption Successful
        </Text>


        <Text
          style={
            styles.subtitle
          }
        >

          Your redemption request has been
          successfully placed.

        </Text>


        {/* PRODUCT CARD */}

        <View
          style={
            styles.card
          }
        >

          <Text
            style={
              styles.cardLabel
            }
          >
            PRODUCT
          </Text>


          <Text
            style={
              styles.productName
            }
          >
            {
              productName ||
              'Redeemed Product'
            }
          </Text>


          {
            productId
              ? (

                <Text
                  style={
                    styles.productId
                  }
                >

                  Product ID:
                  {' '}
                  {productId}

                </Text>

              )
              : null
          }

        </View>


        {/* PAYMENT SUMMARY */}

        <View
          style={
            styles.card
          }
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            Payment Summary
          </Text>


          <View
            style={
              styles.row
            }
          >

            <Text
              style={
                styles.rowLabel
              }
            >
              Total Product Value
            </Text>


            <Text
              style={
                styles.rowValue
              }
            >
              {
                formatCurrency(
                  totalAmount
                )
              }
            </Text>

          </View>


          <View
            style={
              styles.row
            }
          >

            <Text
              style={
                styles.rowLabel
              }
            >
              Digital Gold Used
            </Text>


            <Text
              style={
                styles.goldValue
              }
            >
              {
                formatGoldQuantity(
                  goldUsed
                )
              }
            </Text>

          </View>


          <View
            style={
              styles.row
            }
          >

            <Text
              style={
                styles.rowLabel
              }
            >
              Gold Value Applied
            </Text>


            <Text
              style={
                styles.goldValue
              }
            >
              {
                formatCurrency(
                  goldValueApplied
                )
              }
            </Text>

          </View>


          <View
            style={
              styles.row
            }
          >

            <Text
              style={
                styles.rowLabel
              }
            >
              Cash Amount Paid
            </Text>


            <Text
              style={
                styles.rowValue
              }
            >
              {
                formatCurrency(
                  cashAmountPaid
                )
              }
            </Text>

          </View>


          <View
            style={
              styles.divider
            }
          />


          <View
            style={
              styles.row
            }
          >

            <Text
              style={
                styles.paymentModeLabel
              }
            >
              Redemption Method
            </Text>


            <Text
              style={
                styles.paymentModeValue
              }
            >
              {
                formatPaymentMode(
                  paymentMode
                )
              }
            </Text>

          </View>

        </View>


        {/* WALLET SUMMARY */}

        <View
          style={
            styles.walletCard
          }
        >

          <Text
            style={
              styles.walletTitle
            }
          >
            Remaining Digital Gold
          </Text>


          <Text
            style={
              styles.walletBalance
            }
          >
            {
              formatGoldQuantity(
                goldBalanceAfter
              )
            }
          </Text>

        </View>


        {/* TRANSACTION INFORMATION */}

        {
          transactionId
            ? (

              <View
                style={
                  styles.transactionCard
                }
              >

                <Text
                  style={
                    styles.transactionLabel
                  }
                >
                  REDEMPTION TRANSACTION ID
                </Text>


                <Text
                  style={
                    styles.transactionId
                  }
                >
                  {transactionId}
                </Text>

              </View>

            )
            : null
        }


        {/* INFORMATION MESSAGE */}

        <View
          style={
            styles.infoBox
          }
        >

          <Text
            style={
              styles.infoText
            }
          >

            Your redemption request has been
            recorded successfully. Product
            processing and fulfilment will be
            handled by the merchant.

          </Text>

        </View>


        {/* VIEW WALLET BUTTON */}

        <TouchableOpacity
          style={
            styles.primaryButton
          }
          onPress={
            handleViewWallet
          }
          activeOpacity={
            0.85
          }
        >

          <Text
            style={
              styles.primaryButtonText
            }
          >
            View Wallet
          </Text>

        </TouchableOpacity>


        {/* REDEEM AGAIN BUTTON */}

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={
            handleRedeemAgain
          }
          activeOpacity={
            0.85
          }
        >

          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Redeem More Gold
          </Text>

        </TouchableOpacity>


      </ScrollView>

    </SafeAreaView>

  );

}


const styles =
  StyleSheet.create({


    safeArea: {

      flex:
        1,

      backgroundColor:
        '#FFFFFF',

    },


    scrollContent: {

      paddingHorizontal:
        20,

      paddingTop:
        30,

      paddingBottom:
        40,

    },


    successIcon: {

      width:
        86,

      height:
        86,

      borderRadius:
        43,

      backgroundColor:
        '#E8F8EE',

      justifyContent:
        'center',

      alignItems:
        'center',

      alignSelf:
        'center',

      marginBottom:
        18,

    },


    successCheck: {

      fontSize:
        48,

      fontWeight:
        '700',

      color:
        '#1E8E4E',

    },


    title: {

      fontSize:
        27,

      fontWeight:
        '700',

      color:
        '#14213D',

      textAlign:
        'center',

    },


    subtitle: {

      marginTop:
        10,

      fontSize:
        15,

      lineHeight:
        22,

      color:
        '#6B7280',

      textAlign:
        'center',

      marginBottom:
        28,

    },


    card: {

      backgroundColor:
        '#FFFFFF',

      borderRadius:
        16,

      padding:
        18,

      marginBottom:
        16,

      borderWidth:
        1,

      borderColor:
        '#E5E7EB',

    },


    cardLabel: {

      fontSize:
        11,

      fontWeight:
        '700',

      color:
        '#9CA3AF',

      letterSpacing:
        0.8,

      marginBottom:
        8,

    },


    productName: {

      fontSize:
        19,

      fontWeight:
        '700',

      color:
        '#14213D',

    },


    productId: {

      marginTop:
        8,

      fontSize:
        13,

      color:
        '#6B7280',

    },


    sectionTitle: {

      fontSize:
        18,

      fontWeight:
        '700',

      color:
        '#14213D',

      marginBottom:
        16,

    },


    row: {

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom:
        14,

    },


    rowLabel: {

      flex:
        1,

      fontSize:
        14,

      color:
        '#6B7280',

    },


    rowValue: {

      fontSize:
        14,

      fontWeight:
        '600',

      color:
        '#14213D',

    },


    goldValue: {

      fontSize:
        14,

      fontWeight:
        '700',

      color:
        '#B8860B',

    },


    divider: {

      height:
        1,

      backgroundColor:
        '#E5E7EB',

      marginVertical:
        6,

      marginBottom:
        18,

    },


    paymentModeLabel: {

      flex:
        1,

      fontSize:
        14,

      fontWeight:
        '600',

      color:
        '#14213D',

    },


    paymentModeValue: {

      flex:
        1,

      fontSize:
        13,

      fontWeight:
        '600',

      color:
        '#B8860B',

      textAlign:
        'right',

    },


    walletCard: {

      backgroundColor:
        '#14213D',

      borderRadius:
        18,

      padding:
        22,

      marginBottom:
        16,

      alignItems:
        'center',

    },


    walletTitle: {

      fontSize:
        14,

      color:
        '#D1D5DB',

      marginBottom:
        8,

    },


    walletBalance: {

      fontSize:
        28,

      fontWeight:
        '700',

      color:
        '#D4AF37',

    },


    transactionCard: {

      backgroundColor:
        '#F9FAFB',

      borderRadius:
        14,

      padding:
        16,

      marginBottom:
        16,

      borderWidth:
        1,

      borderColor:
        '#E5E7EB',

    },


    transactionLabel: {

      fontSize:
        10,

      fontWeight:
        '700',

      letterSpacing:
        0.7,

      color:
        '#9CA3AF',

      marginBottom:
        7,

    },


    transactionId: {

      fontSize:
        13,

      fontWeight:
        '600',

      color:
        '#14213D',

    },


    infoBox: {

      backgroundColor:
        '#FFF8E1',

      borderRadius:
        14,

      padding:
        16,

      marginBottom:
        22,

      borderWidth:
        1,

      borderColor:
        '#F4D77D',

    },


    infoText: {

      fontSize:
        13,

      lineHeight:
        20,

      color:
        '#6B5A00',

      textAlign:
        'center',

    },


    primaryButton: {

      height:
        56,

      borderRadius:
        14,

      backgroundColor:
        '#D4AF37',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginBottom:
        12,

    },


    primaryButtonText: {

      fontSize:
        16,

      fontWeight:
        '700',

      color:
        '#14213D',

    },


    secondaryButton: {

      height:
        54,

      borderRadius:
        14,

      backgroundColor:
        '#FFFFFF',

      borderWidth:
        1,

      borderColor:
        '#D4AF37',

      justifyContent:
        'center',

      alignItems:
        'center',

    },


    secondaryButtonText: {

      fontSize:
        16,

      fontWeight:
        '700',

      color:
        '#B8860B',

    },


  });