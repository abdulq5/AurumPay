import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useState,
} from 'react';
import { createBuyOrder, createPayment, createPriceLock } from '../src/api/orders';
import {
  getNumberRouteParam,
  getRouteParam,
} from '../src/utils/routeParams';
import { colors } from '../src/theme/colors';
import { formatMoney } from '../src/utils/format';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';


const { gold, navy } = colors;


type PaymentMethod =
  | 'upi'
  | 'card'
  | 'bank';


export default function PaymentScreen() {


  const router =
    useRouter();


  /*
   * RECEIVE PARAMETERS
   *
   * This screen supports:
   *
   * 1. BUY
   * 2. REDEMPTION
   */

  const params =
    useLocalSearchParams<{

      transactionType?:
        string | string[];


      /*
       * BUY PARAMETERS
       */

      quantity?:
        string | string[];

      amount?:
        string | string[];

      price?:
        string | string[];


      /*
       * REDEMPTION PARAMETERS
       */

      productId?:
        string | string[];

      productName?:
        string | string[];

      paymentMode?:
        string | string[];

      goldUsed?:
        string | string[];

      goldValueApplied?:
        string | string[];

      cashRequired?:
        string | string[];

      totalAmount?:
        string | string[];

      goldRate?:
        string | string[];

    }>();


  /*
   * PAYMENT METHOD
   */

  const [
    selectedMethod,
    setSelectedMethod,
  ] =
    useState<PaymentMethod>(
      'upi'
    );


  /*
   * TRANSACTION TYPE
   */

  const transactionType =
    getRouteParam(
      params.transactionType
    ) ||
    'BUY';


  const isRedemption =
    transactionType ===
    'REDEMPTION';


  /*
   * BUY PARAMETERS
   */

  const quantity =
    getNumberRouteParam(
      params.quantity
    );


  const amount =
    getNumberRouteParam(
      params.amount
    );


  const price =
    getNumberRouteParam(
      params.price
    );


  /*
   * REDEMPTION PARAMETERS
   */

  const productId =
    getRouteParam(
      params.productId
    ) ||
    '';


  const productName =
    getRouteParam(
      params.productName
    ) ||
    '';


  const paymentMode =
    getRouteParam(
      params.paymentMode
    ) ||
    '';


  const goldUsed =
    getNumberRouteParam(
      params.goldUsed
    );


  const goldValueApplied =
    getNumberRouteParam(
      params.goldValueApplied
    );


  const cashRequired =
    getNumberRouteParam(
      params.cashRequired
    );


  const totalAmount =
    getNumberRouteParam(
      params.totalAmount
    );


  const goldRate =
    getNumberRouteParam(
      params.goldRate
    );


  /*
   * AMOUNT TO PAY
   *
   * BUY:
   * Full gold purchase amount.
   *
   * REDEMPTION:
   * Remaining cash amount.
   */

  const payableAmount =
    isRedemption

      ? cashRequired

      : amount;


  /*
   * VALIDATE BUY ORDER
   */

  const isValidBuyOrder =

    transactionType ===
    'BUY'

    &&

    quantity > 0

    &&

    amount > 0

    &&

    price > 0;


  /*
   * VALIDATE REDEMPTION ORDER
   */

  const isValidRedemptionOrder =

    transactionType ===
    'REDEMPTION'

    &&

    productId.length > 0

    &&

    productName.length > 0

    &&

    goldUsed > 0

    &&

    goldValueApplied > 0

    &&

    totalAmount > 0

    &&

    goldRate > 0

    &&

    cashRequired > 0;


  /*
   * FINAL VALIDATION
   */

  const isValidOrder =
    isRedemption

      ? isValidRedemptionOrder

      : isValidBuyOrder;



  /*
   * FORMAT GOLD QUANTITY
   */

  const formattedQuantity =
    quantity > 0

      ? quantity.toFixed(
          4
        )

      : '0.0000';


  /*
   * FORMAT GOLD USED
   */

  const formattedGoldUsed =
    goldUsed > 0

      ? goldUsed.toFixed(
          4
        )

      : '0.0000';


  /*
   * GET PAYMENT METHOD NAME
   */

  function getPaymentMethodName() {

    switch (
      selectedMethod
    ) {

      case 'upi':

        return 'UPI';


      case 'card':

        return (
          'Debit / Credit Card'
        );


      case 'bank':

        return (
          'Bank Transfer'
        );


      default:

        return 'UPI';

    }

  }


  /*
   * COMPLETE PAYMENT
   */

  async function handlePayment() {


    if (
      !isValidOrder
    ) {

      Alert.alert(

        'Invalid Payment',

        isRedemption

          ? 'Your redemption payment information is missing or invalid. Please go back and review your redemption order again.'

          : 'Your order information is missing or invalid. Please go back and create the gold purchase order again.'

      );


      return;

    }


    /*
     * REDEMPTION PAYMENT
     */

    if (
      isRedemption
    ) {

      Alert.alert(

        'Confirm Redemption Payment',

        `You are paying ₹${formatMoney(
          cashRequired
        )} using ${getPaymentMethodName()}.

Product: ${productName}

Digital gold applied: ${formattedGoldUsed} g

Gold value applied: ₹${formatMoney(
          goldValueApplied
        )}`,

        [

          {
            text:
              'Cancel',

            style:
              'cancel',
          },


          {
            text:
              'Complete Payment',

            onPress:
                () => {


                /*
                 * PAYMENT SUCCESSFUL
                 *
                 * IMPORTANT:
                 *
                 * Go directly to
                 * payment-success.tsx.
                 *
                 * payment-success.tsx
                 * executes redeemGold()
                 * and updates wallet.
                 */

                router.replace({

                  pathname:
                    '/payment-success',

                  params: {

                    transactionType:
                      'REDEMPTION',

                    productId,

                    productName,

                    paymentMode,

                    goldUsed:
                      goldUsed.toString(),

                    goldValueApplied:
                      goldValueApplied.toString(),

                    cashRequired:
                      cashRequired.toString(),

                    cashAmountPaid:
                      cashRequired.toString(),

                    totalAmount:
                      totalAmount.toString(),

                    goldRate:
                      goldRate.toString(),

                    paymentMethod:
                      getPaymentMethodName(),

                  },

                });


              },

          },

        ]

      );


      return;

    }


    /*
     * BUY PAYMENT
     */

    Alert.alert(

      'Confirm Payment',

      `You are paying ₹${formatMoney(
        amount
      )} using ${getPaymentMethodName()}.`,

      [

        {
          text:
            'Cancel',

          style:
            'cancel',
        },


        {
          text:
            'Complete Payment',

          onPress:
            async () => {
              try {
                const lock = await createPriceLock(amount);
                const order = await createBuyOrder(
                  lock.lockId,
                  `buy-${Date.now()}`,
                );
                const payment = await createPayment(
                  order.orderId,
                  `payment-${Date.now()}`,
                  getPaymentMethodName(),
                );


              /*
               * BUY SUCCESS
               */

              router.replace({

                pathname:
                  '/payment-success',

                params: {

                  transactionType:
                    'BUY',

                  quantity:
                    quantity.toString(),

                  amount:
                    amount.toString(),

                  price:
                    price.toString(),

                  paymentMethod:
                    getPaymentMethodName(),

                  orderId: order.orderId,

                  paymentId: payment.paymentId,

                  paymentStatus: payment.status,

                },

              });

              } catch {
                Alert.alert(
                  'Payment could not be created',
                  'Please check your connection and try again.',
                );
              }

            },

        },

      ]

    );

  }


  /*
   * RENDER PAYMENT METHOD
   */

  function renderPaymentMethod(

    id:
      PaymentMethod,

    title:
      string,

    description:
      string,

    icon:
      string

  ) {

    const isSelected =
      selectedMethod ===
      id;


    return (

      <TouchableOpacity

        key={id}

        style={[
          s.paymentMethod,

          isSelected &&
          s.paymentMethodSelected,
        ]}

        onPress={() =>
          setSelectedMethod(
            id
          )
        }

        activeOpacity={0.8}

      >

        <View
          style={s.paymentLeft}
        >

          <View
            style={s.iconCircle}
          >

            <Text
              style={s.iconText}
            >

              {icon}

            </Text>

          </View>


          <View
            style={s.paymentTextContainer}
          >

            <Text
              style={s.paymentTitle}
            >

              {title}

            </Text>


            <Text
              style={s.paymentDescription}
            >

              {description}

            </Text>

          </View>

        </View>


        <View

          style={[
            s.radio,

            isSelected &&
            s.radioSelected,
          ]}

        >

          {

            isSelected &&

            <View
              style={s.radioDot}
            />

          }

        </View>

      </TouchableOpacity>

    );

  }


  return (

    <ScrollView

      style={s.page}

      contentContainerStyle={
        s.content
      }

    >

      <Stack.Screen

        options={{

          headerShown:
            true,

          title:
            'Payment',

          headerStyle: {

            backgroundColor:
              '#F7F8FA',

          },

          headerShadowVisible:
            false,

        }}

      />


      <Text
        style={s.title}
      >

        Complete your payment

      </Text>


      <Text
        style={s.subtitle}
      >

        {

          isRedemption

            ? 'Pay the remaining amount after your digital gold has been applied.'

            : 'Choose a payment method to complete your gold purchase.'

        }

      </Text>


      {/* AMOUNT CARD */}

      <View
        style={s.amountCard}
      >

        <Text
          style={s.amountLabel}
        >

          {

            isRedemption

              ? 'REMAINING AMOUNT TO PAY'

              : 'TOTAL AMOUNT TO PAY'

          }

        </Text>


        <Text
          style={s.amount}
        >

          ₹
          {
            formatMoney(
              payableAmount
            )
          }

        </Text>

      </View>


      {/* REDEMPTION SUMMARY */}

      {

        isRedemption &&

        <View
          style={s.summaryCard}
        >

          <Text
            style={s.summaryTitle}
          >

            Redemption Summary

          </Text>


          <View
            style={s.summaryRow}
          >

            <Text
              style={s.summaryLabel}
            >
              Product
            </Text>


            <Text
              style={s.summaryValue}
            >
              {productName}
            </Text>

          </View>


          <View
            style={s.summaryRow}
          >

            <Text
              style={s.summaryLabel}
            >
              Digital gold used
            </Text>


            <Text
              style={s.summaryValue}
            >
              {formattedGoldUsed} g
            </Text>

          </View>


          <View
            style={s.summaryRow}
          >

            <Text
              style={s.summaryLabel}
            >
              Gold value applied
            </Text>


            <Text
              style={s.summaryValue}
            >
              ₹
              {
                formatMoney(
                  goldValueApplied
                )
              }
            </Text>

          </View>


          <View
            style={s.summaryRow}
          >

            <Text
              style={s.summaryLabel}
            >
              Total product value
            </Text>


            <Text
              style={s.summaryValue}
            >
              ₹
              {
                formatMoney(
                  totalAmount
                )
              }
            </Text>

          </View>

        </View>

      }


      {/* BUY SUMMARY */}

      {

        !isRedemption &&

        <View
          style={s.summaryCard}
        >

          <Text
            style={s.summaryTitle}
          >
            Purchase Summary
          </Text>


          <View
            style={s.summaryRow}
          >

            <Text
              style={s.summaryLabel}
            >
              Gold quantity
            </Text>


            <Text
              style={s.summaryValue}
            >
              {formattedQuantity} g
            </Text>

          </View>


          <View
            style={s.summaryRow}
          >

            <Text
              style={s.summaryLabel}
            >
              Gold price
            </Text>


            <Text
              style={s.summaryValue}
            >
              ₹
              {
                formatMoney(
                  price
                )
              }
              {' / g'}
            </Text>

          </View>

        </View>

      }


      {/* PAYMENT METHODS */}

      <Text
        style={s.sectionTitle}
      >
        Select payment method
      </Text>


      {

        renderPaymentMethod(

          'upi',

          'UPI',

          'Pay instantly using UPI.',

          '₹'

        )

      }


      {

        renderPaymentMethod(

          'card',

          'Debit / Credit Card',

          'Pay securely using your card.',

          '▣'

        )

      }


      {

        renderPaymentMethod(

          'bank',

          'Bank Transfer',

          'Pay using bank transfer.',

          '⇄'

        )

      }


      {/* SECURITY CARD */}

      <View
        style={s.securityCard}
      >

        <Text
          style={s.securityTitle}
        >
          Secure payment
        </Text>


        <Text
          style={s.securityText}
        >

          This is currently a demonstration
          payment flow. Production payments
          will be processed through AurumPay's
          payment infrastructure.

        </Text>

      </View>


      {/* PAY BUTTON */}

      <TouchableOpacity

        style={[
          s.payButton,

          !isValidOrder &&
          s.payButtonDisabled,
        ]}

        onPress={
          handlePayment
        }

        activeOpacity={0.8}

      >

        <Text
          style={s.payButtonText}
        >

          Pay ₹
          {
            formatMoney(
              payableAmount
            )
          }

        </Text>

      </TouchableOpacity>


      <Text
        style={s.disclaimer}
      >

        By continuing, you confirm that
        the order and payment details
        are correct.

      </Text>

    </ScrollView>

  );

}


const s =
  StyleSheet.create({

    page: {
      flex: 1,
      backgroundColor:
        '#F7F8FA',
    },

    content: {
      padding: 20,
      paddingBottom: 40,
    },

    title: {
      fontSize: 28,
      fontWeight: '800',
      color: navy,
    },

    subtitle: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 21,
      color: '#667085',
    },

    amountCard: {
      marginTop: 24,
      padding: 22,
      borderRadius: 20,
      backgroundColor: navy,
    },

    amountLabel: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: '#BFC8D3',
    },

    amount: {
      marginTop: 10,
      fontSize: 34,
      fontWeight: '800',
      color: '#FFFFFF',
    },

    summaryCard: {
      marginTop: 20,
      padding: 18,
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E7E9EC',
    },

    summaryTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: navy,
      marginBottom: 16,
    },

    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 13,
    },

    summaryLabel: {
      flex: 1,
      fontSize: 13,
      color: '#667085',
    },

    summaryValue: {
      flex: 1,
      textAlign: 'right',
      fontSize: 13,
      fontWeight: '700',
      color: navy,
    },

    sectionTitle: {
      marginTop: 26,
      marginBottom: 12,
      fontSize: 18,
      fontWeight: '800',
      color: navy,
    },

    paymentMethod: {
      marginBottom: 12,
      padding: 16,
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E4E7EC',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    paymentMethodSelected: {
      borderColor: gold,
      backgroundColor: '#FFFDF7',
    },

    paymentLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },

    iconCircle: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: '#FFF4D6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },

    iconText: {
      fontSize: 18,
      fontWeight: '800',
      color: gold,
    },

    paymentTextContainer: {
      flex: 1,
    },

    paymentTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: navy,
    },

    paymentDescription: {
      marginTop: 3,
      fontSize: 12,
      color: '#667085',
    },

    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: '#D0D5DD',
      alignItems: 'center',
      justifyContent: 'center',
    },

    radioSelected: {
      borderColor: gold,
    },

    radioDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: gold,
    },

    securityCard: {
      marginTop: 12,
      padding: 18,
      borderRadius: 18,
      backgroundColor: '#EEF4FF',
    },

    securityTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: navy,
    },

    securityText: {
      marginTop: 6,
      fontSize: 13,
      lineHeight: 20,
      color: '#52606D',
    },

    payButton: {
      marginTop: 26,
      height: 58,
      borderRadius: 17,
      backgroundColor: gold,
      alignItems: 'center',
      justifyContent: 'center',
    },

    payButtonDisabled: {
      opacity: 0.5,
    },

    payButtonText: {
      fontSize: 17,
      fontWeight: '800',
      color: navy,
    },

    disclaimer: {
      marginTop: 14,
      textAlign: 'center',
      fontSize: 11,
      lineHeight: 17,
      color: '#98A2B3',
    },

  });