import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useEffect,
  useMemo,
  useRef,
} from 'react';

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
import { colors } from '../src/theme/colors';
import { formatGold, formatMoney } from '../src/utils/format';

const { gold, navy, successGreen } = colors;


export default function PaymentSuccessScreen() {


  const router =
    useRouter();


  /*
   * BUY and REDEMPTION wallet
   * functions.
   *
   * SELL is not touched anywhere.
   */

  const {
    addGold,
    redeemGold,
    refreshWallet,
  } =
    useWallet();


  /*
   * Prevent duplicate wallet
   * updates when screen re-renders.
   */

  const hasProcessedTransaction =
    useRef(
      false
    );


  /*
   * Receive BUY and REDEMPTION
   * transaction parameters.
   */

  const params =
    useLocalSearchParams<{

      transactionType?:
        string |
        string[];

      /*
       * BUY
       */

      quantity?:
        string |
        string[];

      amount?:
        string |
        string[];

      price?:
        string |
        string[];


      /*
       * REDEMPTION
       */

      productId?:
        string |
        string[];

      productName?:
        string |
        string[];

      paymentMode?:
        string |
        string[];

      goldUsed?:
        string |
        string[];

      goldValueApplied?:
        string |
        string[];

      cashRequired?:
        string |
        string[];

      cashAmountPaid?:
        string |
        string[];

      totalAmount?:
        string |
        string[];

      goldRate?:
        string |
        string[];

      paymentMethod?:
        string |
        string[];

      paymentStatus?:
        string |
        string[];

    }>();


  /*
   * Expo Router can sometimes
   * return parameter arrays.
   */

  function getSingleParam(
    value?:
      string |
      string[]
  ) {

    return Array.isArray(
      value
    )

      ? value[0]

      : value;

  }


  /*
   * Safely convert string
   * parameters to numbers.
   */

  function parseNumber(
    value:
      string |
      undefined,

    fallback = 0
  ) {

    const parsed =
      Number(

        String(
          value ??
          fallback
        )

          .replace(
            /,/g,
            ''
          )

          .replace(
            /₹/g,
            ''
          )

          .trim()

      );


    return Number.isFinite(
      parsed
    )

      ? parsed

      : fallback;

  }


  /*
   * TRANSACTION TYPE
   */

  const transactionType =
    getSingleParam(
      params.transactionType
    ) ||
    'BUY';


  const isRedemption =
    transactionType ===
    'REDEMPTION';


  /*
   * BUY VALUES
   */

  const quantity =
    parseNumber(
      getSingleParam(
        params.quantity
      ),
      0
    );


  const amount =
    parseNumber(
      getSingleParam(
        params.amount
      ),
      0
    );


  const price =
    parseNumber(
      getSingleParam(
        params.price
      ),
      6320
    );


  /*
   * REDEMPTION VALUES
   */

  const productId =
    getSingleParam(
      params.productId
    ) ||
    '';


  const productName =
    getSingleParam(
      params.productName
    ) ||
    'Redemption Product';


  const paymentMode =
    getSingleParam(
      params.paymentMode
    ) ||
    'MAXIMUM_GOLD';


  const goldUsed =
    parseNumber(
      getSingleParam(
        params.goldUsed
      ),
      0
    );


  const goldValueApplied =
    parseNumber(
      getSingleParam(
        params.goldValueApplied
      ),
      0
    );


  const cashAmountPaid =
    parseNumber(

      getSingleParam(
        params.cashAmountPaid
      ) ??
      getSingleParam(
        params.cashRequired
      ),

      0

    );


  const totalAmount =
    parseNumber(
      getSingleParam(
        params.totalAmount
      ),
      0
    );


  const goldRate =
    parseNumber(
      getSingleParam(
        params.goldRate
      ),
      6320
    );


  const paymentMethod =
    getSingleParam(
      params.paymentMethod
    ) ||
    'UPI';

  const paymentStatus =
    getSingleParam(
      params.paymentStatus
    );


  /*
   * PROCESS SUCCESSFUL
   * TRANSACTION.
   *
   * This is where wallet is updated.
   */

  useEffect(() => {


    /*
     * Prevent duplicate execution.
     */

    if (
      hasProcessedTransaction.current
    ) {

      return;

    }


    /*
     * ============================
     * BUY TRANSACTION
     * ============================
     *
     * Existing BUY functionality
     * remains unchanged.
     */

    if (
      !isRedemption
    ) {

      if (paymentStatus) {
        refreshWallet().catch(() => undefined);

        hasProcessedTransaction.current =
          true;

        return;
      }

      if (
        quantity > 0 &&
        amount > 0
      ) {

        addGold(
          quantity,
          amount
        );


        hasProcessedTransaction.current =
          true;

      }


      return;

    }


    /*
     * ============================
     * REDEMPTION TRANSACTION
     * ============================
     *
     * Gold is deducted here only
     * after successful payment.
     */

    if (
      goldUsed > 0 &&
      goldValueApplied > 0 &&
      productId.length > 0 &&
      goldRate > 0
    ) {

      const success =
        redeemGold(

          goldUsed,

          goldValueApplied,

          productId,

          productName,

          paymentMode,

          cashAmountPaid,

          goldRate

        );


      /*
       * Mark transaction processed
       * only when wallet successfully
       * deducts the gold.
       */

      if (
        success
      ) {

        hasProcessedTransaction.current =
          true;

      }

    }


  }, [

    isRedemption,

    quantity,

    amount,

    goldUsed,

    goldValueApplied,

    productId,

    productName,

    paymentMode,

    cashAmountPaid,

    goldRate,

    addGold,

    redeemGold,

  ]);


  /*
   * Format money.
   */


  /*
   * Demo transaction ID.
   */

  const transactionId =
    useMemo(() => {

      return `AUR${Date.now()
        .toString()
        .slice(
          -10
        )}`;

    }, []);


  function handleGoHome() {

    router.replace(
      '/'
    );

  }


  function handleViewWallet() {

    router.replace(
      '/wallet'
    );

  }


  /*
   * Main amount displayed.
   */

  const displayedAmount =
    isRedemption

      ? cashAmountPaid

      : amount;


  const formattedAmount =
    formatMoney(
      displayedAmount
    );


  return (

    <ScrollView
      style={s.page}
      contentContainerStyle={s.content}
    >

      <Stack.Screen
        options={{

          headerShown:
            true,

          title:

            isRedemption

              ? 'Redemption Successful'

              : 'Payment Successful',


          headerStyle: {
            backgroundColor:
              '#F7F8FA',
          },


          headerShadowVisible:
            false,


          headerLeft:
            () => null,

        }}
      />


      {/* SUCCESS ICON */}

      <View
        style={s.successIcon}
      >

        <Text
          style={s.successCheck}
        >
          ✓
        </Text>

      </View>


      {/* TITLE */}

      <Text
        style={s.title}
      >

        {
          isRedemption

            ? 'Redemption Successful!'

            : 'Payment Successful!'
        }

      </Text>


      <Text
        style={s.subtitle}
      >

        {
          isRedemption

            ? 'Your gold redemption has been successfully completed.'

            : 'Your digital gold purchase has been successfully completed.'
        }

      </Text>


      {/* MAIN SUCCESS CARD */}

      <View
        style={s.successCard}
      >

        <Text
          style={s.amountLabel}
        >

          {
            isRedemption

              ? 'CASH AMOUNT PAID'

              : 'AMOUNT PAID'
          }

        </Text>


        <Text
          style={s.amount}
        >
          ₹
          {formattedAmount}
        </Text>


        <View
          style={s.dividerDark}
        />


        {
          isRedemption

            ? (

              <>

                <View
                  style={s.detailRow}
                >

                  <Text
                    style={s.detailLabel}
                  >
                    Product
                  </Text>


                  <Text
                    style={s.detailValue}
                  >
                    {productName}
                  </Text>

                </View>


                <View
                  style={s.detailRow}
                >

                  <Text
                    style={s.detailLabel}
                  >
                    Digital gold redeemed
                  </Text>


                  <Text
                    style={s.detailValue}
                  >
                    {formatGold(
                      goldUsed
                    )}
                    {' g'}
                  </Text>

                </View>


                <View
                  style={s.detailRow}
                >

                  <Text
                    style={s.detailLabel}
                  >
                    Gold value applied
                  </Text>


                  <Text
                    style={s.detailValue}
                  >
                    ₹
                    {formatMoney(
                      goldValueApplied
                    )}
                  </Text>

                </View>


                <View
                  style={s.detailRow}
                >

                  <Text
                    style={s.detailLabel}
                  >
                    Total product amount
                  </Text>


                  <Text
                    style={s.detailValue}
                  >
                    ₹
                    {formatMoney(
                      totalAmount
                    )}
                  </Text>

                </View>

              </>

            )

            : (

              <>

                <View
                  style={s.detailRow}
                >

                  <Text
                    style={s.detailLabel}
                  >
                    Digital gold purchased
                  </Text>


                  <Text
                    style={s.detailValue}
                  >
                    {formatGold(
                      quantity
                    )}
                    {' g'}
                  </Text>

                </View>


                <View
                  style={s.detailRow}
                >

                  <Text
                    style={s.detailLabel}
                  >
                    Gold price
                  </Text>


                  <Text
                    style={s.detailValue}
                  >
                    ₹
                    {formatMoney(
                      price
                    )}
                    {' / g'}
                  </Text>

                </View>

              </>

            )
        }

      </View>


      {/* TRANSACTION DETAILS */}

      <View
        style={s.detailsCard}
      >

        <Text
          style={s.detailsTitle}
        >
          Transaction Details
        </Text>


        <View
          style={s.transactionRow}
        >

          <Text
            style={s.transactionLabel}
          >
            Transaction ID
          </Text>


          <Text
            style={s.transactionValue}
          >
            {transactionId}
          </Text>

        </View>


        <View
          style={s.transactionRow}
        >

          <Text
            style={s.transactionLabel}
          >
            Transaction type
          </Text>


          <Text
            style={s.transactionValue}
          >

            {
              isRedemption

                ? 'Gold Redemption'

                : 'Gold Purchase'
            }

          </Text>

        </View>


        <View
          style={s.transactionRow}
        >

          <Text
            style={s.transactionLabel}
          >
            Payment status
          </Text>


          <Text
            style={s.successStatus}
          >
            Successful
          </Text>

        </View>


        <View
          style={s.transactionRow}
        >

          <Text
            style={s.transactionLabel}
          >
            Payment method
          </Text>


          <Text
            style={s.transactionValue}
          >

            {
              isRedemption &&
              cashAmountPaid <= 0

                ? 'Digital Gold'

                : paymentMethod
            }

          </Text>

        </View>

      </View>


      {/* WALLET UPDATE */}

      <View
        style={s.walletCard}
      >

        <View
          style={s.walletIcon}
        >

          <Text
            style={s.walletIconText}
          >
            Au
          </Text>

        </View>


        <View
          style={s.walletContent}
        >

          <Text
            style={s.walletTitle}
          >

            {
              isRedemption

                ? 'Gold deducted from your wallet'

                : 'Gold credited to your wallet'
            }

          </Text>


          <Text
            style={s.walletText}
          >

            {
              isRedemption

                ? `${formatGold(
                    goldUsed
                  )} g of digital gold has been used for this redemption.`

                : `${formatGold(
                    quantity
                  )} g of digital gold has been added to your AurumPay wallet.`
            }

          </Text>

        </View>

      </View>


      {/* ACTION BUTTONS */}

      <TouchableOpacity
        style={s.walletButton}
        onPress={handleViewWallet}
      >

        <Text
          style={s.walletButtonText}
        >
          View Gold Wallet
        </Text>

      </TouchableOpacity>


      <TouchableOpacity
        style={s.homeButton}
        onPress={handleGoHome}
      >

        <Text
          style={s.homeButtonText}
        >
          Back to Home
        </Text>

      </TouchableOpacity>


      <Text
        style={s.disclaimer}
      >
        This is a demonstration transaction.
        Live payment processing, digital
        gold settlement and merchant
        fulfilment will be connected to
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

    successIcon: {
      width: 82,
      height: 82,
      borderRadius: 41,
      backgroundColor: '#DCFCE7',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 25,
    },

    successCheck: {
      fontSize: 42,
      fontWeight: '800',
      color: successGreen,
    },

    title: {
      marginTop: 20,
      textAlign: 'center',
      fontSize: 28,
      fontWeight: '800',
      color: navy,
    },

    subtitle: {
      marginTop: 8,
      textAlign: 'center',
      fontSize: 15,
      lineHeight: 22,
      color: '#667085',
    },

    successCard: {
      marginTop: 28,
      backgroundColor: navy,
      borderRadius: 22,
      padding: 22,
    },

    amountLabel: {
      fontSize: 11,
      letterSpacing: 1.2,
      color: '#BFC8D3',
    },

    amount: {
      marginTop: 8,
      fontSize: 36,
      fontWeight: '800',
      color: '#FFFFFF',
    },

    dividerDark: {
      height: 1,
      backgroundColor: '#304357',
      marginVertical: 20,
    },

    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },

    detailLabel: {
      flex: 1,
      fontSize: 14,
      color: '#BFC8D3',
    },

    detailValue: {
      flex: 1,
      textAlign: 'right',
      fontSize: 15,
      fontWeight: '800',
      color: '#FFFFFF',
    },

    detailsCard: {
      marginTop: 22,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: '#E7E9EC',
    },

    detailsTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: navy,
      marginBottom: 18,
    },

    transactionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },

    transactionLabel: {
      flex: 1,
      fontSize: 14,
      color: '#667085',
    },

    transactionValue: {
      flex: 1,
      textAlign: 'right',
      fontSize: 14,
      fontWeight: '700',
      color: navy,
    },

    successStatus: {
      fontSize: 14,
      fontWeight: '800',
      color: successGreen,
    },

    walletCard: {
      marginTop: 22,
      padding: 18,
      borderRadius: 20,
      backgroundColor: '#FFF8E7',
      flexDirection: 'row',
      alignItems: 'center',
    },

    walletIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: '#FBE7A5',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },

    walletIconText: {
      fontSize: 18,
      fontWeight: '800',
      color: '#8B6A1C',
    },

    walletContent: {
      flex: 1,
    },

    walletTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: navy,
    },

    walletText: {
      marginTop: 4,
      fontSize: 12,
      lineHeight: 18,
      color: '#667085',
    },

    walletButton: {
      marginTop: 28,
      height: 58,
      borderRadius: 17,
      backgroundColor: gold,
      alignItems: 'center',
      justifyContent: 'center',
    },

    walletButtonText: {
      fontSize: 17,
      fontWeight: '800',
      color: navy,
    },

    homeButton: {
      marginTop: 12,
      height: 54,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: '#D0D5DD',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },

    homeButtonText: {
      fontSize: 16,
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