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
  useState,
} from 'react';

import {
  useWallet,
} from '../context/WalletContext';

import {
  redemptionProducts,
} from '../src/redemption/redemptionProducts';

import {
  calculateRedemption,
} from '../src/redemption/redemptionCalculation';

import {
  RedemptionCalculation,
  RedemptionPaymentMode,
} from '../../types/redemption';
import { colors } from '../src/theme/colors';
import { formatMoney } from '../src/utils/format';

const { gold, navy, dangerRed, pageBackground } = colors;

const successGreen = '#15803D';


/*
 * Demo redemption rate.
 *
 * Later this must come from
 * AurumPay Core / Gold Pricing API.
 */

const customerGoldRate =
  6320;


export default function ReviewOrderScreen() {

  const router =
    useRouter();


  const params =
    useLocalSearchParams<{
      productId?: string;
    }>();


  const {
    goldBalance,
    redeemGold,
  } = useWallet();


  /*
   * Customer redemption choice.
   */

  const [
    paymentMode,
    setPaymentMode,
  ] =
    useState<
      RedemptionPaymentMode
    >(
      'MAXIMUM_GOLD'
    );


  /*
   * Find selected product.
   *
   * We use selectedProduct first so
   * TypeScript can safely verify that
   * the product exists before it is
   * used anywhere else.
   */

  const selectedProduct =
    redemptionProducts.find(
      item =>
        item.id ===
        params.productId
    );


  /*
   * Product safety check.
   */

  if (
    !selectedProduct
  ) {

    return (

      <View
        style={s.errorPage}
      >

        <Stack.Screen
          options={{
            title:
              'Review Order',
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
            Back to Products
          </Text>

        </TouchableOpacity>

      </View>

    );

  }


  /*
   * After the safety check,
   * selectedProduct is guaranteed
   * to exist.
   */

  const product =
    selectedProduct;


  /*
   * CENTRAL REDEMPTION
   * CALCULATION.
   */

  const calculation:
    RedemptionCalculation =
      calculateRedemption(

        goldBalance,

        customerGoldRate,

        product,

        paymentMode

      );


  /*
   * Format money.
   */


  /*
   * Select redemption mode.
   */

  function handleModeSelection(
    mode:
      RedemptionPaymentMode
  ) {

    setPaymentMode(
      mode
    );

  }


  /*
   * Continue redemption.
   */

  function handleContinue() {

    if (
      !Number.isFinite(
        calculation.goldUsed
      ) ||
      calculation.goldUsed <= 0
    ) {
      return;
    }


    /*
     * Deduct gold immediately only when
     * no cash payment is required.
     */
    if (
      calculation.cashRequired <=
      0.000001
    ) {

      const redemptionCompleted =
        redeemGold(
          calculation.goldUsed,
          calculation.goldValueApplied,
          product.id,
          product.name,
          paymentMode,
          0,
          customerGoldRate
        );


      if (
        !redemptionCompleted
      ) {
        return;
      }


            router.push({
        pathname:
          '/redemption-success',

        params: {
          productId:
            product.id,

          productName:
            product.name,

          paymentMode,

          goldUsed:
            calculation.goldUsed.toString(),

          goldValueApplied:
            calculation.goldValueApplied.toString(),

          cashAmountPaid:
            '0',

          totalAmount:
            product.totalAmount.toString(),

          goldBalanceAfter:
            calculation.goldRemaining.toString(),

          goldRate:
            customerGoldRate.toString(),
        },
      });

      return;
    }


    /*
     * For orders requiring cash, do not
     * deduct gold until payment succeeds.
     */
    router.push({
      pathname:
        '/complete-payment',

      params: {
        productId:
          product.id,

        paymentMode,

        goldRate:
          customerGoldRate.toString(),
      },
    });

  }


  /*
   * Return to product details.
   */

  function handleBack() {

    router.back();

  }


  return (

    <ScrollView
      style={s.page}
      contentContainerStyle={
        s.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >

      <Stack.Screen
        options={{
          headerShown: true,

          title:
            'Review Order',

          headerStyle: {
            backgroundColor:
              pageBackground,
          },

          headerShadowVisible:
            false,
        }}
      />


      {/* PAGE HEADER */}

      <Text
        style={s.title}
      >
        Review your order
      </Text>


      <Text
        style={s.subtitle}
      >
        Choose how your digital
        gold should be applied
        toward this purchase.
      </Text>


      {/* PRODUCT */}

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
          {product.name}
        </Text>


        <Text
          style={s.productMeta}
        >
          {product.purity ?? 'Gold'}

          {' • '}

          {(
            product.netGoldWeight ??
            product.goldWeight
          ).toFixed(2)}

          {' g gold'}
        </Text>


        <View
          style={s.productDivider}
        />


        <View
          style={s.productTotalRow}
        >

          <Text
            style={s.productTotalLabel}
          >
            Total invoice
          </Text>


          <Text
            style={s.productTotalValue}
          >
            ₹
            {
              formatMoney(
                product.totalAmount
              )
            }
          </Text>

        </View>

      </View>


      {/* WALLET POSITION */}

      <View
        style={s.walletCard}
      >

        <Text
          style={s.sectionTitle}
        >
          Your Digital Gold
        </Text>


        <View
          style={s.walletRow}
        >

          <Text
            style={s.walletLabel}
          >
            Available gold
          </Text>


          <Text
            style={s.walletValue}
          >
            {calculation.availableGold.toFixed(
              4
            )}

            {' g'}
          </Text>

        </View>


        <View
          style={s.walletRow}
        >

          <Text
            style={s.walletLabel}
          >
            Redemption rate
          </Text>


          <Text
            style={s.walletValue}
          >
            ₹
            {
              formatMoney(
                customerGoldRate
              )
            }

            {' / g'}
          </Text>

        </View>

      </View>


      {/* PAYMENT MODE */}

      <View
        style={s.modeSection}
      >

        <Text
          style={s.sectionTitle}
        >
          Choose how to use your gold
        </Text>


        {/* GOLD COMPONENT ONLY */}

        <TouchableOpacity
          style={[
            s.modeCard,

            paymentMode ===
            'GOLD_COMPONENT_ONLY'

              ? s.modeCardSelected

              : null,
          ]}
          onPress={() =>
            handleModeSelection(
              'GOLD_COMPONENT_ONLY'
            )
          }
        >

          <View
            style={s.modeTextContainer}
          >

            <Text
              style={s.modeTitle}
            >
              Gold Component Only
            </Text>


            <Text
              style={s.modeDescription}
            >
              Use digital gold only
              against the product's
              physical gold value.
            </Text>

          </View>


          <View
            style={[
              s.radioOuter,

              paymentMode ===
              'GOLD_COMPONENT_ONLY'

                ? s.radioSelected

                : null,
            ]}
          >

            {
              paymentMode ===
              'GOLD_COMPONENT_ONLY'

                ? (
                  <View
                    style={
                      s.radioInner
                    }
                  />
                )

                : null
            }

          </View>

        </TouchableOpacity>


        {/* MAXIMUM GOLD */}

        <TouchableOpacity
          style={[
            s.modeCard,

            paymentMode ===
            'MAXIMUM_GOLD'

              ? s.modeCardSelected

              : null,
          ]}
          onPress={() =>
            handleModeSelection(
              'MAXIMUM_GOLD'
            )
          }
        >

          <View
            style={s.modeTextContainer}
          >

            <Text
              style={s.modeTitle}
            >
              Use Maximum Gold
            </Text>


            <Text
              style={s.modeDescription}
            >
              Apply as much available
              digital gold as possible
              toward the total invoice.
            </Text>

          </View>


          <View
            style={[
              s.radioOuter,

              paymentMode ===
              'MAXIMUM_GOLD'

                ? s.radioSelected

                : null,
            ]}
          >

            {
              paymentMode ===
              'MAXIMUM_GOLD'

                ? (
                  <View
                    style={
                      s.radioInner
                    }
                  />
                )

                : null
            }

          </View>

        </TouchableOpacity>


        {/* FULL GOLD */}

        <TouchableOpacity
          style={[
            s.modeCard,

            paymentMode ===
            'FULL_GOLD'

              ? s.modeCardSelected

              : null,
          ]}
          onPress={() =>
            handleModeSelection(
              'FULL_GOLD'
            )
          }
        >

          <View
            style={s.modeTextContainer}
          >

            <Text
              style={s.modeTitle}
            >
              Full Gold Payment
            </Text>


            <Text
              style={s.modeDescription}
            >
              Attempt to settle the
              complete invoice using
              your digital gold balance.
            </Text>

          </View>


          <View
            style={[
              s.radioOuter,

              paymentMode ===
              'FULL_GOLD'

                ? s.radioSelected

                : null,
            ]}
          >

            {
              paymentMode ===
              'FULL_GOLD'

                ? (
                  <View
                    style={
                      s.radioInner
                    }
                  />
                )

                : null
            }

          </View>

        </TouchableOpacity>

      </View>


      {/* REDEMPTION CALCULATION */}

      <View
        style={s.summaryCard}
      >

        <Text
          style={s.sectionTitle}
        >
          Redemption Summary
        </Text>


        <SummaryRow
          label="Gold used"
          value={
            `${calculation.goldUsed.toFixed(
              4
            )} g`
          }
          valueStyle={
            s.goldValue
          }
        />


        <SummaryRow
          label="Digital gold value applied"
          value={
            `₹${formatMoney(
              calculation.goldValueApplied
            )}`
          }
        />


        <SummaryRow
          label="Gold remaining"
          value={
            `${calculation.goldRemaining.toFixed(
              4
            )} g`
          }
        />


        <View
          style={s.divider}
        />


        <Text
          style={s.breakdownTitle}
        >
          Invoice coverage
        </Text>


        <SummaryRow
          label="Gold component"
          value={
            `₹${formatMoney(
              calculation.goldComponentApplied
            )}`
          }
        />


        <SummaryRow
          label="Design charges"
          value={
            `₹${formatMoney(
              calculation.designChargesApplied
            )}`
          }
        />


        <SummaryRow
          label="Making charges"
          value={
            `₹${formatMoney(
              calculation.makingChargesApplied
            )}`
          }
        />


        {
          product.stoneCharges > 0 && (

            <SummaryRow
              label="Stone charges"
              value={
                `₹${formatMoney(
                  calculation.stoneChargesApplied
                )}`
              }
            />

          )
        }


        {
          product.packagingCharges > 0 && (

            <SummaryRow
              label="Packaging"
              value={
                `₹${formatMoney(
                  calculation.packagingChargesApplied
                )}`
              }
            />

          )
        }


        {
          product.deliveryCharges > 0 && (

            <SummaryRow
              label="Delivery"
              value={
                `₹${formatMoney(
                  calculation.deliveryChargesApplied
                )}`
              }
            />

          )
        }


        {
          product.otherCharges > 0 && (

            <SummaryRow
              label="Other charges"
              value={
                `₹${formatMoney(
                  calculation.otherChargesApplied
                )}`
              }
            />

          )
        }


        <SummaryRow
          label="Tax"
          value={
            `₹${formatMoney(
              calculation.taxApplied
            )}`
          }
        />


        <View
          style={s.divider}
        />


        <View
          style={s.cashRow}
        >

          <Text
            style={s.cashLabel}
          >
            Cash payment required
          </Text>


          <Text
            style={
              calculation.cashRequired >
              0

                ? s.cashRequired

                : s.cashZero
            }
          >
            ₹
            {
              formatMoney(
                calculation.cashRequired
              )
            }
          </Text>

        </View>

      </View>


      {/* STATUS */}

      <View
        style={[
          s.statusCard,

          calculation.cashRequired <=
          0.000001

            ? s.successCard

            : s.warningCard,
        ]}
      >

        <Text
          style={[
            s.statusTitle,

            calculation.cashRequired <=
            0.000001

              ? s.successTitle

              : s.warningTitle,
          ]}
        >

          {
            calculation.cashRequired <=
            0.000001

              ? 'Your order is fully covered'

              : 'Additional payment is required'
          }

        </Text>


        <Text
          style={s.statusText}
        >

          {
            calculation.cashRequired <=
            0.000001

              ? 'Your selected digital gold will fully settle the invoice. No additional payment is required.'

              : 'Your digital gold will be applied first. You will then complete payment for the remaining invoice amount.'
          }

        </Text>

      </View>


      {/* CONTINUE */}

      <TouchableOpacity
        style={[
          s.continueButton,

          calculation.goldUsed <= 0

            ? s.disabledButton

            : null,
        ]}
        disabled={
          calculation.goldUsed <= 0
        }
        onPress={
          handleContinue
        }
      >

        <Text
          style={s.continueButtonText}
        >

          {
            calculation.cashRequired <=
            0.000001

              ? 'Confirm Redemption'

              : `Continue to Pay ₹${formatMoney(
                  calculation.cashRequired
                )}`
          }

        </Text>

      </TouchableOpacity>


      {/* BACK */}

      <TouchableOpacity
        style={s.backButton}
        onPress={
          handleBack
        }
      >

        <Text
          style={s.backButtonText}
        >
          Back to Product Details
        </Text>

      </TouchableOpacity>

    </ScrollView>

  );

}


/*
 * Reusable summary row.
 */

type SummaryRowProps = {

  label:
    string;

  value:
    string;

  valueStyle?:
    object;

};


function SummaryRow({
  label,
  value,
  valueStyle,
}: SummaryRowProps) {

  return (

    <View
      style={s.summaryRow}
    >

      <Text
        style={s.summaryLabel}
      >
        {label}
      </Text>


      <Text
        style={[
          s.summaryValue,
          valueStyle,
        ]}
      >
        {value}
      </Text>

    </View>

  );

}


const s =
  StyleSheet.create({

    page: {
      flex: 1,
      backgroundColor:
        pageBackground,
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
      marginTop: 24,
      padding: 22,
      borderRadius: 22,
      backgroundColor:
        navy,
    },


    productLabel: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1,
      color: '#BFC8D3',
    },


    productName: {
      marginTop: 10,
      fontSize: 22,
      fontWeight: '800',
      color: '#FFFFFF',
    },


    productMeta: {
      marginTop: 6,
      fontSize: 13,
      color: '#BFC8D3',
    },


    productDivider: {
      height: 1,
      marginVertical: 18,
      backgroundColor:
        '#304357',
    },


    productTotalRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },


    productTotalLabel: {
      fontSize: 14,
      color: '#BFC8D3',
    },


    productTotalValue: {
      fontSize: 21,
      fontWeight: '800',
      color: '#FFFFFF',
    },


    walletCard: {
      marginTop: 22,
      padding: 20,
      borderRadius: 20,
      backgroundColor:
        '#FFFFFF',
      borderWidth: 1,
      borderColor:
        '#E7E9EC',
    },


    sectionTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: navy,
    },


    walletRow: {
      marginTop: 18,
      flexDirection: 'row',
      justifyContent:
        'space-between',
    },


    walletLabel: {
      fontSize: 14,
      color: '#667085',
    },


    walletValue: {
      fontSize: 14,
      fontWeight: '800',
      color: navy,
    },


    modeSection: {
      marginTop: 26,
    },


    modeCard: {
      marginTop: 14,
      padding: 18,
      borderRadius: 18,
      backgroundColor:
        '#FFFFFF',
      borderWidth: 1,
      borderColor:
        '#E7E9EC',
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems:
        'flex-start',
    },


    modeCardSelected: {
      borderColor:
        gold,
      borderWidth: 2,
      backgroundColor:
        '#FFFCF5',
    },


    modeTextContainer: {
      flex: 1,
      paddingRight: 14,
    },


    modeTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: navy,
    },


    modeDescription: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 18,
      color: '#667085',
    },


    radioOuter: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor:
        '#D0D5DD',
      justifyContent:
        'center',
      alignItems:
        'center',
    },


    radioSelected: {
      borderColor:
        gold,
    },


    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor:
        gold,
    },


    summaryCard: {
      marginTop: 26,
      padding: 20,
      borderRadius: 20,
      backgroundColor:
        '#FFFFFF',
      borderWidth: 1,
      borderColor:
        '#E7E9EC',
    },


    summaryRow: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },


    summaryLabel: {
      fontSize: 13,
      color: '#667085',
      flex: 1,
      paddingRight: 12,
    },


    summaryValue: {
      fontSize: 13,
      fontWeight: '800',
      color: navy,
    },


    goldValue: {
      color: gold,
    },


    divider: {
      height: 1,
      marginTop: 18,
      backgroundColor:
        '#E7E9EC',
    },


    breakdownTitle: {
      marginTop: 18,
      fontSize: 15,
      fontWeight: '800',
      color: navy,
    },


    cashRow: {
      marginTop: 18,
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },


    cashLabel: {
      fontSize: 16,
      fontWeight: '800',
      color: navy,
    },


    cashRequired: {
      fontSize: 21,
      fontWeight: '800',
      color: dangerRed,
    },


    cashZero: {
      fontSize: 21,
      fontWeight: '800',
      color: successGreen,
    },


    statusCard: {
      marginTop: 22,
      padding: 18,
      borderRadius: 20,
    },


    successCard: {
      backgroundColor:
        '#DCFCE7',
    },


    warningCard: {
      backgroundColor:
        '#FFF8E7',
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
      marginTop: 7,
      fontSize: 12,
      lineHeight: 19,
      color: '#667085',
    },


    continueButton: {
      marginTop: 28,
      height: 58,
      borderRadius: 17,
      backgroundColor:
        gold,
      alignItems: 'center',
      justifyContent:
        'center',
    },


    disabledButton: {
      opacity: 0.5,
    },


    continueButtonText: {
      fontSize: 16,
      fontWeight: '800',
      color: navy,
    },


    backButton: {
      marginTop: 12,
      height: 54,
      borderRadius: 17,
      borderWidth: 1,
      borderColor:
        '#D0D5DD',
      backgroundColor:
        '#FFFFFF',
      alignItems: 'center',
      justifyContent:
        'center',
    },


    backButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color: navy,
    },


    errorPage: {
      flex: 1,
      padding: 24,
      backgroundColor:
        pageBackground,
      justifyContent:
        'center',
      alignItems:
        'center',
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
      textAlign: 'center',
      color: '#667085',
    },


    errorButton: {
      marginTop: 24,
      height: 52,
      paddingHorizontal: 22,
      borderRadius: 16,
      backgroundColor:
        gold,
      justifyContent:
        'center',
      alignItems:
        'center',
    },


    errorButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color: navy,
    },

  });