import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useEffect,
  useRef,
} from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useWallet } from '../context/WalletContext';
import { colors } from '../src/theme/colors';
import { formatGold, formatMoney } from '../src/utils/format';

const { gold, navy, successGreen } = colors;

export default function SellSuccessScreen() {
  const router = useRouter();

  /*
   * Get wallet data and functions.
   */

  const {
    goldBalance,
    removeGold,
  } = useWallet();

  /*
   * Prevent the same sale from being
   * processed multiple times.
   */

  const hasProcessedSale = useRef(false);

  /*
   * Receive transaction details from
   * sell-review.tsx.
   */

  const params = useLocalSearchParams<{
    quantity?: string;
    amount?: string;
    price?: string;
    balance?: string;
    remaining?: string;
  }>();

  /*
   * Convert parameters safely.
   */

  const sellQuantity =
    Number(
      String(params.quantity || '0')
        .replace(/,/g, '')
    ) || 0;

  const saleAmount =
    Number(
      String(params.amount || '0')
        .replace(/,/g, '')
    ) || 0;

  const sellPrice =
    Number(
      String(params.price || '0')
        .replace(/,/g, '')
    ) || 0;

  /*
   * Process the successful sale.
   *
   * removeGold will:
   *
   * 1. Deduct gold from wallet.
   * 2. Reduce totalInvested
   *    proportionally.
   * 3. Create one SELL transaction.
   */

  useEffect(() => {
    if (
      sellQuantity > 0 &&
      saleAmount > 0 &&
      sellPrice > 0 &&
      !hasProcessedSale.current
    ) {
      const saleSuccessful =
        removeGold(
          sellQuantity,
          saleAmount,
          sellPrice
        );

      if (saleSuccessful) {
        hasProcessedSale.current = true;
      }
    }
  }, [
    sellQuantity,
    saleAmount,
    sellPrice,
    removeGold,
  ]);

  /*
   * Current remaining balance from
   * WalletContext.
   */

  const formattedRemainingBalance = formatGold(goldBalance);

  /*
   * Format transaction values.
   */

  const formattedSellQuantity = formatGold(sellQuantity);
  const formattedSaleAmount = formatMoney(saleAmount);
  const formattedSellPrice = formatMoney(sellPrice);

  /*
   * Navigate to wallet.
   */

  function handleViewWallet() {
    router.replace('/wallet');
  }

  /*
   * Navigate home.
   */

  function handleGoHome() {
    router.replace('/');
  }

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={s.content}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Sale Successful',
          headerStyle: {
            backgroundColor: '#F7F8FA',
          },
          headerShadowVisible: false,

          /*
           * Prevent navigating back into
           * the sale confirmation flow.
           */

          headerLeft: () => null,
        }}
      />

      {/* SUCCESS ICON */}

      <View style={s.successIcon}>
        <Text style={s.successCheck}>
          ✓
        </Text>
      </View>

      {/* TITLE */}

      <Text style={s.title}>
        Sale Successful!
      </Text>

      <Text style={s.subtitle}>
        Your digital gold has been successfully
        sold.
      </Text>

      {/* SALE AMOUNT CARD */}

      <View style={s.successCard}>
        <Text style={s.amountLabel}>
          SALE AMOUNT
        </Text>

        <Text style={s.amount}>
          ₹{formattedSaleAmount}
        </Text>

        <View style={s.dividerDark} />

        <View style={s.detailRow}>
          <Text style={s.detailLabel}>
            Digital gold sold
          </Text>

          <Text style={s.detailValue}>
            {formattedSellQuantity} g
          </Text>
        </View>

        <View style={s.detailRow}>
          <Text style={s.detailLabel}>
            Sell price
          </Text>

          <Text style={s.detailValue}>
            ₹{formattedSellPrice} / g
          </Text>
        </View>
      </View>

      {/* TRANSACTION DETAILS */}

      <View style={s.detailsCard}>
        <Text style={s.detailsTitle}>
          Transaction Details
        </Text>

        <View style={s.transactionRow}>
          <Text style={s.transactionLabel}>
            Sale status
          </Text>

          <Text style={s.successStatus}>
            Successful
          </Text>
        </View>

        <View style={s.transactionRow}>
          <Text style={s.transactionLabel}>
            Transaction fee
          </Text>

          <Text style={s.transactionValue}>
            ₹0.00
          </Text>
        </View>
      </View>

      {/* UPDATED WALLET */}

      <View style={s.walletCard}>
        <View style={s.walletIcon}>
          <Text style={s.walletIconText}>
            Au
          </Text>
        </View>

        <View style={s.walletContent}>
          <Text style={s.walletTitle}>
            Gold Wallet Updated
          </Text>

          <Text style={s.walletText}>
            Your remaining gold balance is{' '}
            {formattedRemainingBalance} g.
          </Text>
        </View>
      </View>

      {/* ACTION BUTTONS */}

      <TouchableOpacity
        style={s.walletButton}
        onPress={handleViewWallet}
      >
        <Text style={s.walletButtonText}>
          View Gold Wallet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.homeButton}
        onPress={handleGoHome}
      >
        <Text style={s.homeButtonText}>
          Back to Home
        </Text>
      </TouchableOpacity>

      {/* DISCLAIMER */}

      <Text style={s.disclaimer}>
        This is a demonstration transaction.
        Live settlement and transaction
        processing will be connected to
        AurumPay Core in a future
        development phase.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F7F8FA',
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
    fontSize: 14,
    color: '#BFC8D3',
  },

  detailValue: {
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
    fontSize: 14,
    color: '#667085',
  },

  transactionValue: {
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