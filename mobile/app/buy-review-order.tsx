import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { formatMoney, formatGold } from '../src/utils/format';
import { getNumberRouteParam } from '../src/utils/routeParams';
import { colors } from '../src/theme/colors';

const { gold, navy } = colors;


export default function BuyReviewOrderScreen() {

  const router = useRouter();


  /*
   * Receive parameters from Buy Gold screen.
   */

  const params =
    useLocalSearchParams<{
      goldQuantity?: string | string[];
      payableAmount?: string | string[];
      goldPrice?: string | string[];
    }>();


  /*
   * Safely resolve route parameters.
   */

  const goldQuantity = getNumberRouteParam(params.goldQuantity);
  const payableAmount = getNumberRouteParam(params.payableAmount);
  const goldPrice = getNumberRouteParam(params.goldPrice);


  /*
   * Validate the order.
   */

  const isValidOrder =
    goldQuantity > 0 &&
    payableAmount > 0 &&
    goldPrice > 0;


  /*
   * Format values for display.
   */

  const formattedGoldQuantity = formatGold(goldQuantity);
  const formattedPayableAmount = formatMoney(payableAmount, 2);
  const formattedGoldPrice = formatMoney(goldPrice);


  /*
   * Proceed to payment.
   */

  function handleProceedToPayment() {

    if (!isValidOrder) {

      Alert.alert(
        'Invalid Order',
        'The order details are missing or invalid. Please go back and enter your purchase amount again.'
      );

      return;

    }


    /*
     * IMPORTANT
     *
     * This is a BUY transaction.
     *
     * We explicitly send transactionType
     * so payment.tsx can distinguish
     * buying gold from redemption.
     */

    router.push({

      pathname: '/payment',

      params: {

        transactionType:
          'BUY',

        quantity:
          goldQuantity.toString(),

        amount:
          payableAmount.toString(),

        price:
          goldPrice.toString(),

      },

    });

  }


  /*
   * Cancel order.
   */

  function handleCancelOrder() {

    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this gold purchase order?',
      [

        {
          text: 'No',
          style: 'cancel',
        },

        {
          text: 'Yes, Cancel',
          style: 'destructive',

          onPress: () =>
            router.back(),
        },

      ]
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
          headerShown: true,
          title: 'Review Order',

          headerStyle: {
            backgroundColor:
              '#F7F8FA',
          },

          headerShadowVisible:
            false,
        }}
      />


      {/* HEADER */}

      <Text
        style={s.title}
      >
        Review your order
      </Text>


      <Text
        style={s.subtitle}
      >
        Please review your gold purchase details before proceeding to payment.
      </Text>


      {/* PRICE CARD */}

      <View
        style={s.priceCard}
      >

        <Text
          style={s.priceLabel}
        >
          GOLD SELLING PRICE
        </Text>


        <Text
          style={s.price}
        >
          ₹
          {formattedGoldPrice}

          <Text
            style={s.perGram}
          >
            {' '}
            / g
          </Text>

        </Text>


        <Text
          style={s.priceDescription}
        >
          Your purchase will be processed at the applicable gold selling price.
        </Text>

      </View>


      {/* ORDER DETAILS */}

      <View
        style={s.orderCard}
      >

        <Text
          style={s.cardTitle}
        >
          Order Details
        </Text>


        <View
          style={s.orderRow}
        >

          <Text
            style={s.orderLabel}
          >
            Gold quantity
          </Text>


          <Text
            style={s.orderValue}
          >
            {formattedGoldQuantity}
            {' g'}
          </Text>

        </View>


        <View
          style={s.orderRow}
        >

          <Text
            style={s.orderLabel}
          >
            Gold selling price
          </Text>


          <Text
            style={s.orderValue}
          >
            ₹
            {formattedGoldPrice}
            {' / g'}
          </Text>

        </View>


        <View
          style={s.orderRow}
        >

          <Text
            style={s.orderLabel}
          >
            Transaction fee
          </Text>


          <Text
            style={s.orderValue}
          >
            ₹0.00
          </Text>

        </View>


        <View
          style={s.divider}
        />


        <View
          style={s.totalRow}
        >

          <Text
            style={s.totalLabel}
          >
            Total payable
          </Text>


          <Text
            style={s.totalValue}
          >
            ₹
            {formattedPayableAmount}
          </Text>

        </View>

      </View>


      {/* PROCESS INFORMATION */}

      <View
        style={s.processCard}
      >

        <Text
          style={s.processTitle}
        >
          How your purchase works
        </Text>


        <Text
          style={s.processText}
        >
          1. You review and confirm your gold purchase order.
        </Text>


        <Text
          style={s.processText}
        >
          2. You complete the payment using the selected payment method.
        </Text>


        <Text
          style={s.processText}
        >
          3. AurumPay confirms the payment and purchase transaction.
        </Text>


        <Text
          style={s.processText}
        >
          4. The purchased digital gold is credited to your AurumPay wallet.
        </Text>

      </View>


      {/* PROCEED BUTTON */}

      <TouchableOpacity
        style={[
          s.paymentButton,

          !isValidOrder
            ? s.paymentButtonDisabled
            : null,
        ]}
        onPress={
          handleProceedToPayment
        }
      >

        <Text
          style={s.paymentButtonText}
        >
          Proceed to Payment
        </Text>

      </TouchableOpacity>


      {/* CANCEL */}

      <TouchableOpacity
        style={s.cancelButton}
        onPress={
          handleCancelOrder
        }
      >

        <Text
          style={s.cancelButtonText}
        >
          Cancel Order
        </Text>

      </TouchableOpacity>


      {/* FOOTER */}

      <Text
        style={s.footer}
      >
        After successful payment confirmation, the corresponding digital gold will be credited to your wallet.
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
      paddingBottom: 45,
    },


    /* HEADER */

    title: {
      marginTop: 10,
      fontSize: 28,
      fontWeight: '800',
      color: navy,
    },


    subtitle: {
      marginTop: 7,
      fontSize: 15,
      lineHeight: 22,
      color: '#667085',
    },


    /* PRICE CARD */

    priceCard: {
      marginTop: 24,
      backgroundColor: navy,
      borderRadius: 22,
      padding: 21,
    },


    priceLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.1,
      color: '#BFC8D3',
    },


    price: {
      marginTop: 8,
      fontSize: 34,
      fontWeight: '800',
      color: '#FFFFFF',
    },


    perGram: {
      fontSize: 16,
      fontWeight: '600',
      color: '#C9D1D9',
    },


    priceDescription: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 20,
      color: '#C9D1D9',
    },


    /* ORDER CARD */

    orderCard: {
      marginTop: 20,
      backgroundColor:
        '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor:
        '#E7E9EC',
    },


    cardTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: navy,
    },


    orderRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      marginTop: 18,
    },


    orderLabel: {
      fontSize: 15,
      color: '#667085',
    },


    orderValue: {
      fontSize: 15,
      fontWeight: '800',
      color: navy,
    },


    divider: {
      height: 1,
      backgroundColor:
        '#E7E9EC',
      marginVertical: 19,
    },


    totalRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },


    totalLabel: {
      fontSize: 18,
      fontWeight: '800',
      color: navy,
    },


    totalValue: {
      fontSize: 25,
      fontWeight: '800',
      color: gold,
    },


    /* PROCESS */

    processCard: {
      marginTop: 20,
      backgroundColor:
        '#EEF4FF',
      borderRadius: 20,
      padding: 19,
    },


    processTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: navy,
      marginBottom: 14,
    },


    processText: {
      fontSize: 14,
      lineHeight: 22,
      color: '#52606D',
      marginBottom: 9,
    },


    /* BUTTONS */

    paymentButton: {
      marginTop: 28,
      height: 58,
      borderRadius: 17,
      backgroundColor: gold,
      alignItems: 'center',
      justifyContent: 'center',
    },


    paymentButtonDisabled: {
      opacity: 0.5,
    },


    paymentButtonText: {
      fontSize: 17,
      fontWeight: '800',
      color: navy,
    },


    cancelButton: {
      marginTop: 12,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },


    cancelButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#98A2B3',
    },


    footer: {
      marginTop: 6,
      textAlign: 'center',
      fontSize: 11,
      lineHeight: 18,
      color: '#98A2B3',
    },

  });