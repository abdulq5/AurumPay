import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useWallet,
} from '../context/WalletContext';

import {
  redemptionProducts,
} from '../src/redemption/redemptionProducts';
import { colors } from '../src/theme/colors';
import { formatMoney } from '../src/utils/format';

const { gold, navy, dangerRed } = colors;

const successGreen =
  '#15803D';


/*
 * Current demo redemption rate.
 *
 * Later this should come from
 * AurumPay Core / Gold Pricing API.
 */

const currentRedemptionGoldRate =
  6320;


export default function ReviewRedemptionScreen() {


  const router =
    useRouter();


  /*
   * Get selected product ID.
   */

  const params =
    useLocalSearchParams<{
      productId?:
        string |
        string[];
    }>();


  /*
   * Expo Router can sometimes
   * return route parameters as arrays.
   */

  const productId =
    Array.isArray(
      params.productId
    )

      ? params.productId[0]

      : params.productId;


  /*
   * Get wallet information.
   *
   * IMPORTANT:
   *
   * Gold is NOT removed here.
   *
   * Final wallet deduction happens
   * only after successful redemption
   * in payment-success.tsx.
   */

  const {
    goldBalance,
  } =
    useWallet();


  /*
   * Find selected product.
   */

  const product =
    redemptionProducts.find(

      item =>
        item.id ===
        productId

    );


  /*
   * Product safety check.
   */

  if (
    !product
  ) {

    return (

      <View
        style={s.errorPage}
      >

        <Stack.Screen
          options={{
            headerShown:
              true,

            title:
              'Review Redemption',
          }}
        />


        <Text
          style={s.errorTitle}
        >
          Product not found
        </Text>


        <Text
          style={s.errorText}
        >
          The selected redemption
          product could not be found.
        </Text>


        <TouchableOpacity
          style={s.errorButton}
          onPress={() =>
            router.replace(
              '/redeem'
            )
          }
        >

          <Text
            style={s.errorButtonText}
          >
            Back to Redemption
          </Text>

        </TouchableOpacity>

      </View>

    );

  }


  /*
   * Product is guaranteed to exist
   * after the safety check.
   */

  const selectedProduct =
    product;


  /*
   * Calculate total gold required
   * to completely pay for product.
   */

  const goldRequired =
    selectedProduct.totalAmount /
    currentRedemptionGoldRate;


  /*
   * Use maximum available gold,
   * but never more than the
   * amount required.
   */

  const goldUsed =
    Math.min(
      goldBalance,
      goldRequired
    );


  /*
   * Value of digital gold used.
   *
   * Clamp the value so it can
   * never exceed the product value
   * because of decimal precision.
   */

  const goldValueUsed =
    Math.min(

      selectedProduct.totalAmount,

      goldUsed *
      currentRedemptionGoldRate

    );


  /*
   * Remaining cash amount.
   *
   * Small floating point values
   * are normalized to zero.
   */

  const calculatedRemainingPayment =
    selectedProduct.totalAmount -
    goldValueUsed;


  const remainingPayment =
    calculatedRemainingPayment <=
    0.01

      ? 0

      : Number(
          calculatedRemainingPayment
            .toFixed(
              2
            )
        );


  /*
   * Product is fully covered
   * when remaining payment is zero.
   */

  const hasEnoughGold =
    remainingPayment <= 0;


  /*
   * Format currency.
   */


  /*
   * CONFIRM REDEMPTION
   *
   * IMPORTANT:
   *
   * Gold is NOT deducted here.
   *
   * Full gold redemption:
   * Go directly to payment-success.
   *
   * Partial gold redemption:
   * Go to payment.tsx first.
   */

  function handleConfirmRedemption() {


    /*
     * Safety validation.
     */

    if (
      goldUsed <= 0 ||
      goldValueUsed <= 0
    ) {

      return;

    }


    /*
     * ============================
     * FULL GOLD REDEMPTION
     * ============================
     *
     * No cash payment is required.
     *
     * Therefore DO NOT send this
     * transaction to payment.tsx.
     *
     * Go directly to payment-success
     * where redeemGold() will deduct
     * the gold exactly once.
     */

    if (
      hasEnoughGold
    ) {

      router.replace({

        pathname:
          '/payment-success',

        params: {

          transactionType:
            'REDEMPTION',


          productId:
            selectedProduct.id,


          productName:
            selectedProduct.name,


          paymentMode:
            'FULL_GOLD',


          goldUsed:
            goldUsed.toString(),


          goldValueApplied:
            goldValueUsed.toString(),


          cashRequired:
            '0',


          cashAmountPaid:
            '0',


          totalAmount:
            selectedProduct.totalAmount.toString(),


          goldRate:
            currentRedemptionGoldRate.toString(),


          paymentMethod:
            'Digital Gold',

        },

      });


      return;

    }


    /*
     * ============================
     * PARTIAL GOLD REDEMPTION
     * ============================
     *
     * Available digital gold is
     * applied first.
     *
     * Remaining amount is paid
     * through payment.tsx.
     *
     * Wallet is still NOT deducted
     * here.
     */

    router.push({

      pathname:
        '/payment',

      params: {

        transactionType:
          'REDEMPTION',


        productId:
          selectedProduct.id,


        productName:
          selectedProduct.name,


        paymentMode:
          'PARTIAL_GOLD',


        goldUsed:
          goldUsed.toString(),


        goldValueApplied:
          goldValueUsed.toString(),


        cashRequired:
          remainingPayment.toString(),


        totalAmount:
          selectedProduct.totalAmount.toString(),


        goldRate:
          currentRedemptionGoldRate.toString(),

      },

    });

  }


  /*
   * Go back to product selection.
   */

  function handleEditOrder() {

    router.back();

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
            'Review Redemption',


          headerStyle: {

            backgroundColor:
              '#F7F8FA',

          },


          headerShadowVisible:
            false,

        }}

      />


      {/* PAGE HEADER */}

      <Text
        style={s.title}
      >
        Review your redemption
      </Text>


      <Text
        style={s.subtitle}
      >
        Review how your digital gold
        will be used toward this
        product.
      </Text>


      {/* PRODUCT CARD */}

      <View
        style={s.productCard}
      >

        <Text
          style={s.productLabel}
        >
          SELECTED PRODUCT
        </Text>


        <Text
          style={s.productName}
        >
          {selectedProduct.name}
        </Text>


        <Text
          style={s.productMeta}
        >
          {selectedProduct.category}
          {' • '}
          {selectedProduct.goldWeight}
          {' g'}
        </Text>


        <View
          style={s.productDivider}
        />


        <View
          style={s.productRow}
        >

          <Text
            style={s.productRowLabel}
          >
            Total product value
          </Text>


          <Text
            style={s.productRowValue}
          >
            ₹
            {formatMoney(
              selectedProduct.totalAmount
            )}
          </Text>

        </View>

      </View>


      {/* GOLD SUMMARY */}

      <View
        style={s.summaryCard}
      >

        <Text
          style={s.summaryTitle}
        >
          Gold Redemption Summary
        </Text>


        <View
          style={s.summaryRow}
        >

          <Text
            style={s.summaryLabel}
          >
            Available digital gold
          </Text>


          <Text
            style={s.summaryValue}
          >
            {goldBalance.toFixed(
              4
            )}
            {' g'}
          </Text>

        </View>


        <View
          style={s.summaryRow}
        >

          <Text
            style={s.summaryLabel}
          >
            Redemption rate
          </Text>


          <Text
            style={s.summaryValue}
          >
            ₹
            {formatMoney(
              currentRedemptionGoldRate
            )}
            {' / g'}
          </Text>

        </View>


        <View
          style={s.summaryRow}
        >

          <Text
            style={s.summaryLabel}
          >
            Gold used
          </Text>


          <Text
            style={s.goldUsedValue}
          >
            {goldUsed.toFixed(
              4
            )}
            {' g'}
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
            {formatMoney(
              goldValueUsed
            )}
          </Text>

        </View>


        <View
          style={s.dividerLight}
        />


        <View
          style={s.remainingRow}
        >

          <Text
            style={s.remainingLabel}
          >
            Remaining payment
          </Text>


          <Text
            style={

              hasEnoughGold

                ? s.fullyCovered

                : s.remainingPayment

            }
          >
            ₹
            {formatMoney(
              remainingPayment
            )}
          </Text>

        </View>

      </View>


      {/* STATUS CARD */}

      <View

        style={[

          s.statusCard,

          hasEnoughGold

            ? s.successCard

            : s.warningCard,

        ]}

      >

        <Text

          style={[

            s.statusTitle,

            hasEnoughGold

              ? s.successTitle

              : s.warningTitle,

          ]}

        >

          {

            hasEnoughGold

              ? 'Your gold fully covers this product'

              : 'Additional payment is required'

          }

        </Text>


        <Text
          style={s.statusText}
        >

          {

            hasEnoughGold

              ? 'No additional cash payment is required. Your digital gold will be deducted only after the redemption is successfully completed.'

              : 'Your available digital gold will be applied first. You will pay the remaining amount using your selected payment method.'

          }

        </Text>

      </View>


      {/* CONFIRM BUTTON */}

      <TouchableOpacity

        style={[

          s.confirmButton,

          goldUsed <= 0

            ? s.disabledButton

            : null,

        ]}

        onPress={
          handleConfirmRedemption
        }

        disabled={
          goldUsed <= 0
        }

      >

        <Text
          style={s.confirmButtonText}
        >

          {

            hasEnoughGold

              ? 'Confirm Redemption'

              : `Use Gold & Pay ₹${formatMoney(
                  remainingPayment
                )}`

          }

        </Text>

      </TouchableOpacity>


      {/* EDIT BUTTON */}

      <TouchableOpacity

        style={s.editButton}

        onPress={
          handleEditOrder
        }

      >

        <Text
          style={s.editButtonText}
        >
          Back to Products
        </Text>

      </TouchableOpacity>


      {/* DISCLAIMER */}

      <Text
        style={s.disclaimer}
      >
        This is a demonstration
        redemption flow. Final product
        pricing, gold settlement and
        delivery will be handled by
        AurumPay Core in a future
        development phase.
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
      marginTop: 10,
      fontSize: 28,
      fontWeight: '800',
      color: navy,
    },

    subtitle: {
      marginTop: 8,
      fontSize: 15,
      lineHeight: 22,
      color: '#667085',
    },

    productCard: {
      marginTop: 28,
      backgroundColor: navy,
      borderRadius: 22,
      padding: 22,
    },

    productLabel: {
      color: '#BFC8D3',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
    },

    productName: {
      marginTop: 10,
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '800',
    },

    productMeta: {
      marginTop: 5,
      color: '#BFC8D3',
      fontSize: 14,
    },

    productDivider: {
      height: 1,
      backgroundColor: '#304357',
      marginVertical: 18,
    },

    productRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    productRowLabel: {
      color: '#BFC8D3',
      fontSize: 14,
    },

    productRowValue: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '800',
    },

    summaryCard: {
      marginTop: 22,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: '#E7E9EC',
    },

    summaryTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: navy,
      marginBottom: 20,
    },

    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },

    summaryLabel: {
      fontSize: 14,
      color: '#667085',
    },

    summaryValue: {
      fontSize: 14,
      fontWeight: '700',
      color: navy,
    },

    goldUsedValue: {
      fontSize: 15,
      fontWeight: '800',
      color: gold,
    },

    dividerLight: {
      height: 1,
      backgroundColor: '#E7E9EC',
      marginVertical: 6,
    },

    remainingRow: {
      marginTop: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    remainingLabel: {
      fontSize: 17,
      fontWeight: '800',
      color: navy,
    },

    remainingPayment: {
      fontSize: 20,
      fontWeight: '800',
      color: dangerRed,
    },

    fullyCovered: {
      fontSize: 20,
      fontWeight: '800',
      color: successGreen,
    },

    statusCard: {
      marginTop: 22,
      padding: 18,
      borderRadius: 20,
    },

    successCard: {
      backgroundColor: '#DCFCE7',
    },

    warningCard: {
      backgroundColor: '#FFF8E7',
    },

    statusTitle: {
      fontSize: 15,
      fontWeight: '800',
    },

    successTitle: {
      color: successGreen,
    },

    warningTitle: {
      color: '#8B6A1C',
    },

    statusText: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 18,
      color: '#667085',
    },

    confirmButton: {
      marginTop: 28,
      height: 58,
      borderRadius: 17,
      backgroundColor: gold,
      alignItems: 'center',
      justifyContent: 'center',
    },

    disabledButton: {
      opacity: 0.5,
    },

    confirmButtonText: {
      fontSize: 16,
      fontWeight: '800',
      color: navy,
    },

    editButton: {
      marginTop: 12,
      height: 54,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: '#D0D5DD',
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },

    editButtonText: {
      fontSize: 16,
      fontWeight: '800',
      color: navy,
    },

    errorPage: {
      flex: 1,
      padding: 24,
      backgroundColor: '#F7F8FA',
      justifyContent: 'center',
      alignItems: 'center',
    },

    errorTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: navy,
    },

    errorText: {
      marginTop: 10,
      fontSize: 14,
      lineHeight: 21,
      color: '#667085',
      textAlign: 'center',
    },

    errorButton: {
      marginTop: 24,
      height: 52,
      paddingHorizontal: 22,
      borderRadius: 16,
      backgroundColor: gold,
      justifyContent: 'center',
      alignItems: 'center',
    },

    errorButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color: navy,
    },

    disclaimer: {
      marginTop: 18,
      textAlign: 'center',
      fontSize: 11,
      lineHeight: 17,
      color: '#98A2B3',
    },

  });