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


const { gold, navy, pageBackground: background } = colors;

const muted =
  '#667085';

const border =
  '#E4E7EC';

const successGreen =
  '#15803D';

const dangerRed =
  '#B42318';


/*
 * DEMO REDEMPTION RATE
 *
 * This must match the rate used
 * by the redemption calculation
 * flow until the live pricing API
 * is connected.
 */

const currentRedemptionGoldRate =
  6320;


export default function ProductDetailsScreen() {

  const router =
    useRouter();


  /*
   * Get selected product ID
   * from the route.
   */

  const params =
    useLocalSearchParams<{
      productId?: string;
    }>();


  /*
   * Customer wallet.
   */

  const {
    goldBalance,
  } = useWallet();


  /*
   * Find selected product.
   */

  const product =
    redemptionProducts.find(
      item =>
        item.id ===
        params.productId
    );


  /*
   * Safe error screen.
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
            title:
              'Product Details',

            headerShown:
              true,
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
            Back to Catalogue
          </Text>

        </TouchableOpacity>

      </View>

    );

  }


  /*
   * CALCULATIONS
   *
   * Full invoice value converted
   * into equivalent grams of
   * digital gold.
   */

  const goldRequiredForFullInvoice =
    currentRedemptionGoldRate >
    0

      ? product.totalAmount /
        currentRedemptionGoldRate

      : 0;


  /*
   * Maximum invoice value that
   * customer's current gold can
   * theoretically cover.
   */

  const availableGoldValue =
    goldBalance *
    currentRedemptionGoldRate;


  /*
   * Gold remaining if the
   * complete invoice were paid
   * using digital gold.
   */

  const goldRemainingAfterFullPayment =
    Math.max(
      0,
      goldBalance -
      goldRequiredForFullInvoice
    );


  /*
   * Check whether the complete
   * invoice can theoretically
   * be covered by available gold.
   */

  const canFullyCover =
    goldBalance >=
    goldRequiredForFullInvoice;


  /*
   * Invoice integrity check.
   *
   * Display-only validation.
   *
   * Actual catalogue data should
   * already satisfy:
   *
   * totalAmount =
   * goldValue
   * + designCharges
   * + makingCharges
   * + stoneCharges
   * + packagingCharges
   * + deliveryCharges
   * + otherCharges
   * + taxAmount
   */

  const calculatedInvoiceTotal =

    product.goldValue +

    product.designCharges +

    product.makingCharges +

    product.stoneCharges +

    product.packagingCharges +

    product.deliveryCharges +

    product.otherCharges +

    product.taxAmount;


  const invoiceMatches =
    Math.abs(
      calculatedInvoiceTotal -
      product.totalAmount
    ) <
    0.01;


  /*
   * Format money.
   */


  /*
   * Format weight.
   */

  function formatWeight(
    value?: number
  ) {

    if (
      value === undefined ||
      value === null
    ) {

      return '-';

    }


    return (
      value.toFixed(
        3
      ) +
      ' g'
    );

  }


  /*
   * Continue to review order.
   *
   * No wallet changes happen here.
   *
   * review-order.tsx will handle:
   *
   * - payment mode selection
   * - final redemption calculation
   * - gold usage
   * - additional cash requirement
   */

  function handleContinue() {

    router.push({
      pathname:
        '/review-order',

      params: {

        productId:
          product!.id,

      },
    });

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
          title:
            'Product Details',

          headerShown:
            true,

          headerStyle: {
            backgroundColor:
              background,
          },

          headerShadowVisible:
            false,
        }}
      />


      {/* PAGE HEADER */}

      <Text
        style={s.title}
      >
        Product Details
      </Text>


      <Text
        style={s.subtitle}
      >
        Review complete product
        and invoice information
        before using your digital
        gold.
      </Text>


      {/* PRODUCT IDENTITY */}

      <View
        style={s.heroCard}
      >

        <Text
          style={s.categoryBadge}
        >
          {product.category}
        </Text>


        <Text
          style={s.productName}
        >
          {product.name}
        </Text>


        <Text
          style={s.merchantName}
        >
          Sold by{' '}
          {product.merchantName}
        </Text>


        {
          product.description
            ? (

              <Text
                style={s.description}
              >
                {product.description}
              </Text>

            )

            : null
        }

      </View>


      {/* PRODUCT INFORMATION */}

      <View
        style={s.card}
      >

        <Text
          style={s.cardTitle}
        >
          Product Information
        </Text>


        <InfoRow
          label="Category"
          value={
            product.category
          }
        />


        {
          product.productCode
            ? (

              <InfoRow
                label="Product Code"
                value={
                  product.productCode
                }
              />

            )

            : null
        }


        {
          product.collection
            ? (

              <InfoRow
                label="Collection"
                value={
                  product.collection
                }
              />

            )

            : null
        }


        {
          product.designStyle
            ? (

              <InfoRow
                label="Design"
                value={
                  product.designStyle
                }
              />

            )

            : null
        }


        <InfoRow
          label="Purity"
          value={
            product.purity ??
            '-'
          }
        />


        {
          product.goldContent
            ? (

              <InfoRow
                label="Gold Content"
                value={
                  product.goldContent
                }
              />

            )

            : null
        }

      </View>


      {/* WEIGHT INFORMATION */}

      <View
        style={s.card}
      >

        <Text
          style={s.cardTitle}
        >
          Weight & Gold Details
        </Text>


        <InfoRow
          label="Gold Weight"
          value={
            formatWeight(
              product.goldWeight
            )
          }
        />


        {
          product.grossWeight !==
          undefined

            ? (

              <InfoRow
                label="Gross Weight"
                value={
                  formatWeight(
                    product.grossWeight
                  )
                }
              />

            )

            : null
        }


        {
          product.netGoldWeight !==
          undefined

            ? (

              <InfoRow
                label="Net Gold Weight"
                value={
                  formatWeight(
                    product.netGoldWeight
                  )
                }
              />

            )

            : null
        }


        {
          product.stoneWeight !==
          undefined

            ? (

              <InfoRow
                label="Stone Weight"
                value={
                  formatWeight(
                    product.stoneWeight
                  )
                }
              />

            )

            : null
        }


        {
          product.stoneDetails
            ? (

              <InfoRow
                label="Stone Details"
                value={
                  product.stoneDetails
                }
              />

            )

            : null
        }

      </View>


      {/* BILL DETAILS */}

      <View
        style={s.card}
      >

        <Text
          style={s.cardTitle}
        >
          Bill Details
        </Text>


        <BillRow
          label="Gold Content Value"
          amount={
            product.goldValue
          }
        />


        {
          product.designCharges >
          0

            ? (

              <BillRow
                label="Design Charges"
                amount={
                  product.designCharges
                }
              />

            )

            : null
        }


        {
          product.makingCharges >
          0

            ? (

              <BillRow
                label="Making Charges"
                amount={
                  product.makingCharges
                }
              />

            )

            : null
        }


        {
          product.stoneCharges >
          0

            ? (

              <BillRow
                label="Stone Charges"
                amount={
                  product.stoneCharges
                }
              />

            )

            : null
        }


        {
          product.packagingCharges >
          0

            ? (

              <BillRow
                label="Packaging Charges"
                amount={
                  product.packagingCharges
                }
              />

            )

            : null
        }


        {
          product.deliveryCharges >
          0

            ? (

              <BillRow
                label="Delivery Charges"
                amount={
                  product.deliveryCharges
                }
              />

            )

            : null
        }


        {
          product.otherCharges >
          0

            ? (

              <BillRow
                label="Other Charges"
                amount={
                  product.otherCharges
                }
              />

            )

            : null
        }


        {
          product.taxAmount >
          0

            ? (

              <BillRow
                label="Tax"
                amount={
                  product.taxAmount
                }
              />

            )

            : null
        }


        <View
          style={s.divider}
        />


        <View
          style={s.totalRow}
        >

          <Text
            style={s.totalLabel}
          >
            Total Product Value
          </Text>


          <Text
            style={s.totalValue}
          >
            ₹
            {
              formatMoney(
                product.totalAmount
              )
            }
          </Text>

        </View>


        {
          !invoiceMatches
            ? (

              <Text
                style={s.invoiceWarning}
              >
                Invoice data needs
                verification.
              </Text>

            )

            : null
        }

      </View>


      {/* DIGITAL GOLD POSITION */}

      <View
        style={s.goldCard}
      >

        <Text
          style={s.goldCardTitle}
        >
          Your Digital Gold
        </Text>


        <View
          style={s.goldRow}
        >

          <Text
            style={s.goldLabel}
          >
            Available Digital Gold
          </Text>


          <Text
            style={s.goldValue}
          >
            {goldBalance.toFixed(
              4
            )}

            {' g'}
          </Text>

        </View>


        <View
          style={s.goldRow}
        >

          <Text
            style={s.goldLabel}
          >
            Current Redemption Rate
          </Text>


          <Text
            style={s.goldValue}
          >
            ₹
            {
              formatMoney(
                currentRedemptionGoldRate
              )
            }

            {' / g'}
          </Text>

        </View>


        <View
          style={s.goldRow}
        >

          <Text
            style={s.goldLabel}
          >
            Available Gold Value
          </Text>


          <Text
            style={s.goldValue}
          >
            ₹
            {
              formatMoney(
                availableGoldValue
              )
            }
          </Text>

        </View>


        <View
          style={s.goldDivider}
        />


        <View
          style={s.goldRow}
        >

          <Text
            style={s.goldLabelStrong}
          >
            Gold Required for Full Invoice
          </Text>


          <Text
            style={s.goldRequired}
          >
            {
              goldRequiredForFullInvoice
                .toFixed(
                  4
                )
            }

            {' g'}
          </Text>

        </View>


        {
          canFullyCover

            ? (

              <View
                style={s.coveredBox}
              >

                <Text
                  style={s.coveredTitle}
                >
                  Your wallet can fully
                  cover this product
                </Text>


                <Text
                  style={s.coveredText}
                >
                  Estimated remaining
                  digital gold after
                  full payment:{' '}

                  {
                    goldRemainingAfterFullPayment
                      .toFixed(
                        4
                      )
                  }

                  {' g'}
                </Text>

              </View>

            )

            : (

              <View
                style={s.insufficientBox}
              >

                <Text
                  style={s.insufficientTitle}
                >
                  Additional payment
                  may be required
                </Text>


                <Text
                  style={s.insufficientText}
                >
                  You can still use
                  your available digital
                  gold toward the product.
                  The final balance will
                  be calculated in the
                  next step.
                </Text>

              </View>

            )
        }

      </View>


      {/* CONTINUE */}

      <TouchableOpacity
        style={s.continueButton}
        onPress={
          handleContinue
        }
      >

        <Text
          style={
            s.continueButtonText
          }
        >
          Continue to Redemption
        </Text>

      </TouchableOpacity>


      {/* BACK */}

      <TouchableOpacity
        style={s.backButton}
        onPress={() =>
          router.back()
        }
      >

        <Text
          style={s.backButtonText}
        >
          Back to Catalogue
        </Text>

      </TouchableOpacity>


      {/* DISCLAIMER */}

      <Text
        style={s.disclaimer}
      >
        Final digital gold usage
        and any remaining payment
        will be calculated and
        confirmed before your
        wallet is updated.
      </Text>

    </ScrollView>

  );

}


/*
 * REUSABLE PRODUCT
 * INFORMATION ROW
 */

function InfoRow({

  label,

  value,

}: {

  label:
    string;

  value:
    string;

}) {

  return (

    <View
      style={s.infoRow}
    >

      <Text
        style={s.infoLabel}
      >
        {label}
      </Text>


      <Text
        style={s.infoValue}
      >
        {value}
      </Text>

    </View>

  );

}


/*
 * REUSABLE BILL ROW
 */

function BillRow({

  label,

  amount,

}: {

  label:
    string;

  amount:
    number;

}) {

  return (

    <View
      style={s.billRow}
    >

      <Text
        style={s.billLabel}
      >
        {label}
      </Text>


      <Text
        style={s.billValue}
      >
        ₹
        {
          formatMoney(amount, 2)
        }
      </Text>

    </View>

  );

}


const s =
  StyleSheet.create({

    page: {
      flex:
        1,

      backgroundColor:
        background,
    },


    content: {
      padding:
        20,

      paddingBottom:
        42,
    },


    title: {
      marginTop:
        8,

      fontSize:
        28,

      fontWeight:
        '800',

      color:
        navy,
    },


    subtitle: {
      marginTop:
        8,

      fontSize:
        15,

      lineHeight:
        22,

      color:
        muted,
    },


    heroCard: {
      marginTop:
        24,

      backgroundColor:
        navy,

      borderRadius:
        22,

      padding:
        22,
    },


    categoryBadge: {
      alignSelf:
        'flex-start',

      overflow:
        'hidden',

      color:
        '#F8E7B5',

      fontSize:
        11,

      fontWeight:
        '800',

      letterSpacing:
        1,
    },


    productName: {
      marginTop:
        10,

      color:
        '#FFFFFF',

      fontSize:
        23,

      lineHeight:
        30,

      fontWeight:
        '800',
    },


    merchantName: {
      marginTop:
        8,

      color:
        '#C8D1DA',

      fontSize:
        13,
    },


    description: {
      marginTop:
        16,

      color:
        '#D5DCE4',

      fontSize:
        14,

      lineHeight:
        21,
    },


    card: {
      marginTop:
        20,

      backgroundColor:
        '#FFFFFF',

      borderRadius:
        20,

      padding:
        20,

      borderWidth:
        1,

      borderColor:
        border,
    },


    cardTitle: {
      marginBottom:
        16,

      fontSize:
        18,

      fontWeight:
        '800',

      color:
        navy,
    },


    infoRow: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'flex-start',

      paddingVertical:
        11,

      borderBottomWidth:
        1,

      borderBottomColor:
        '#F0F2F5',
    },


    infoLabel: {
      flex:
        1,

      fontSize:
        14,

      color:
        muted,
    },


    infoValue: {
      flex:
        1,

      marginLeft:
        15,

      textAlign:
        'right',

      fontSize:
        14,

      fontWeight:
        '700',

      color:
        navy,
    },


    billRow: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom:
        13,
    },


    billLabel: {
      flex:
        1,

      fontSize:
        14,

      color:
        muted,
    },


    billValue: {
      marginLeft:
        14,

      fontSize:
        14,

      fontWeight:
        '700',

      color:
        navy,
    },


    divider: {
      height:
        1,

      backgroundColor:
        border,

      marginTop:
        4,

      marginBottom:
        16,
    },


    totalRow: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',
    },


    totalLabel: {
      fontSize:
        17,

      fontWeight:
        '800',

      color:
        navy,
    },


    totalValue: {
      fontSize:
        20,

      fontWeight:
        '800',

      color:
        navy,
    },


    invoiceWarning: {
      marginTop:
        12,

      color:
        dangerRed,

      fontSize:
        12,

      fontWeight:
        '700',
    },


    goldCard: {
      marginTop:
        20,

      backgroundColor:
        '#FFFDF7',

      borderRadius:
        20,

      padding:
        20,

      borderWidth:
        1,

      borderColor:
        '#F0DFAE',
    },


    goldCardTitle: {
      marginBottom:
        18,

      fontSize:
        18,

      fontWeight:
        '800',

      color:
        navy,
    },


    goldRow: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom:
        14,
    },


    goldLabel: {
      flex:
        1,

      fontSize:
        14,

      color:
        muted,
    },


    goldLabelStrong: {
      flex:
        1,

      fontSize:
        14,

      fontWeight:
        '800',

      color:
        navy,
    },


    goldValue: {
      marginLeft:
        12,

      fontSize:
        14,

      fontWeight:
        '800',

      color:
        navy,
    },


    goldRequired: {
      marginLeft:
        12,

      fontSize:
        15,

      fontWeight:
        '800',

      color:
        gold,
    },


    goldDivider: {
      height:
        1,

      backgroundColor:
        '#F0DFAE',

      marginTop:
        4,

      marginBottom:
        18,
    },


    coveredBox: {
      marginTop:
        10,

      padding:
        16,

      borderRadius:
        16,

      backgroundColor:
        '#ECFDF3',
    },


    coveredTitle: {
      fontSize:
        14,

      fontWeight:
        '800',

      color:
        successGreen,
    },


    coveredText: {
      marginTop:
        6,

      fontSize:
        12,

      lineHeight:
        18,

      color:
        '#475467',
    },


    insufficientBox: {
      marginTop:
        10,

      padding:
        16,

      borderRadius:
        16,

      backgroundColor:
        '#FFF4ED',
    },


    insufficientTitle: {
      fontSize:
        14,

      fontWeight:
        '800',

      color:
        dangerRed,
    },


    insufficientText: {
      marginTop:
        6,

      fontSize:
        12,

      lineHeight:
        18,

      color:
        '#475467',
    },


    continueButton: {
      marginTop:
        28,

      height:
        58,

      borderRadius:
        17,

      backgroundColor:
        gold,

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    continueButtonText: {
      fontSize:
        16,

      fontWeight:
        '800',

      color:
        navy,
    },


    backButton: {
      marginTop:
        12,

      height:
        54,

      borderRadius:
        17,

      backgroundColor:
        '#FFFFFF',

      borderWidth:
        1,

      borderColor:
        '#D0D5DD',

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    backButtonText: {
      fontSize:
        15,

      fontWeight:
        '800',

      color:
        navy,
    },


    disclaimer: {
      marginTop:
        18,

      paddingHorizontal:
        10,

      textAlign:
        'center',

      fontSize:
        11,

      lineHeight:
        17,

      color:
        '#98A2B3',
    },


    errorPage: {
      flex:
        1,

      padding:
        24,

      justifyContent:
        'center',

      alignItems:
        'center',

      backgroundColor:
        background,
    },


    errorTitle: {
      fontSize:
        24,

      fontWeight:
        '800',

      color:
        navy,
    },


    errorText: {
      marginTop:
        10,

      textAlign:
        'center',

      fontSize:
        14,

      lineHeight:
        21,

      color:
        muted,
    },


    errorButton: {
      marginTop:
        24,

      height:
        52,

      paddingHorizontal:
        22,

      borderRadius:
        16,

      justifyContent:
        'center',

      alignItems:
        'center',

      backgroundColor:
        gold,
    },


    errorButtonText: {
      fontSize:
        15,

      fontWeight:
        '800',

      color:
        navy,
    },

  });