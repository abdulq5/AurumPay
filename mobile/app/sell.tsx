import {
  Stack,
  useRouter,
} from 'expo-router';

import {
  useMemo,
  useState,
} from 'react';
import { useEffect } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useWallet } from '../context/WalletContext';
import { getGoldQuote } from '../src/api/gold';
import { colors } from '../src/theme/colors';
import { formatGold, formatMoney } from '../src/utils/format';

const { gold, navy, successGreen } = colors;

/*
 * Demo pricing.
 *
 * Buy price is currently ₹6,320/g.
 * Sell price is intentionally lower,
 * reflecting the buy/sell spread.
 *
 * Later both prices will come from
 * AurumPay Core / live pricing API.
 */

const defaultBuyGoldPrice = 6320;
const defaultSellGoldPrice = 6200;

export default function SellGoldScreen() {
  const router = useRouter();

  /*
   * Get actual gold balance from WalletContext.
   */

  const {
    goldBalance,
  } = useWallet();

  /*
   * Quantity entered by customer.
   */

  const [quantityInput, setQuantityInput] =
    useState('');

  const [buyGoldPrice, setBuyGoldPrice] =
    useState(defaultBuyGoldPrice);

  const [sellGoldPrice, setSellGoldPrice] =
    useState(defaultSellGoldPrice);

  useEffect(() => {
    getGoldQuote()
      .then((quote) => {
        setBuyGoldPrice(quote.buyPricePerGram);
        setSellGoldPrice(quote.sellPricePerGram);
      })
      .catch(() => undefined);
  }, []);

  /*
   * Convert input into a valid number.
   */

  const sellQuantity = useMemo(() => {
    const parsedQuantity =
      Number(
        quantityInput
          .replace(/,/g, '')
          .trim()
      );

    if (
      !Number.isFinite(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      return 0;
    }

    return parsedQuantity;
  }, [quantityInput]);

  /*
   * Calculate sale amount.
   */

  const saleAmount =
    sellQuantity * sellGoldPrice;

  /*
   * Check whether entered quantity is valid.
   */

  const hasSufficientGold =
    sellQuantity > 0 &&
    sellQuantity <= goldBalance;

  /*
   * Calculate percentage of wallet
   * being sold.
   */

  const sellPercentage =
    goldBalance > 0
      ? (sellQuantity / goldBalance) * 100
      : 0;

  /*
   * Remaining gold after sale.
   */

  const remainingGold =
    Math.max(
      0,
      goldBalance - sellQuantity
    );

  /*
   * Formatting.
   */

  const formattedBalance = formatGold(goldBalance);
  const formattedSellQuantity = formatGold(sellQuantity);
  const formattedRemainingGold = formatGold(remainingGold);
  const formattedSaleAmount = formatMoney(saleAmount);
  const formattedSellPrice = formatMoney(sellGoldPrice);
  const formattedBuyPrice = formatMoney(buyGoldPrice);

  /*
   * Set quantity using percentage
   * of available gold.
   */

  function handlePercentage(
    percentage: number
  ) {
    if (goldBalance <= 0) {
      return;
    }

    const quantity =
      goldBalance * percentage;

    setQuantityInput(formatGold(quantity));
  }

  /*
   * Sell all available gold.
   */

  function handleSellAll() {
    if (goldBalance <= 0) {
      return;
    }

    setQuantityInput(formatGold(goldBalance));
  }

  /*
   * Continue to sale review.
   */

  function handleContinue() {
    if (goldBalance <= 0) {
      Alert.alert(
        'No Gold Available',
        'You do not currently have any digital gold available to sell.'
      );

      return;
    }

    if (sellQuantity <= 0) {
      Alert.alert(
        'Enter Quantity',
        'Please enter the quantity of gold you want to sell.'
      );

      return;
    }

    if (sellQuantity > goldBalance) {
      Alert.alert(
        'Insufficient Gold',
        `You currently have ${formattedBalance} g available in your wallet.`
      );

      return;
    }

    /*
     * Navigate to sale review.
     *
     * The actual wallet deduction will NOT
     * happen here.
     *
     * It will happen only after the sale
     * is confirmed successfully.
     */

    router.push({
      pathname: '/sell-review',
      params: {
        quantity:
          sellQuantity.toString(),

        amount:
          saleAmount.toString(),

        price:
          sellGoldPrice.toString(),

        balance:
          goldBalance.toString(),

        remaining:
          remainingGold.toString(),
      },
    });
  }

  /*
   * Return to wallet.
   */

  function handleBack() {
    router.back();
  }

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Sell Gold',
          headerStyle: {
            backgroundColor: '#F7F8FA',
          },
          headerShadowVisible: false,
        }}
      />

      {/* TITLE */}

      <Text style={s.title}>
        Sell Digital Gold
      </Text>

      <Text style={s.subtitle}>
        Sell your digital gold and receive
        the corresponding value.
      </Text>

      {/* AVAILABLE GOLD CARD */}

      <View style={s.balanceCard}>
        <Text style={s.balanceLabel}>
          AVAILABLE GOLD
        </Text>

        <Text style={s.balanceQuantity}>
          {formattedBalance}

          <Text style={s.grams}>
            {' '}g
          </Text>
        </Text>

        <View style={s.balanceDivider} />

        <View style={s.balanceBottomRow}>
          <Text style={s.balanceBottomLabel}>
            Available to sell
          </Text>

          <Text style={s.balanceBottomValue}>
            {formattedBalance} g
          </Text>
        </View>
      </View>

      {/* SELL PRICE CARD */}

      <View style={s.priceCard}>
        <View style={s.priceHeader}>
          <View>
            <Text style={s.priceLabel}>
              CURRENT SELL PRICE
            </Text>

            <Text style={s.sellPrice}>
              ₹{formattedSellPrice}

              <Text style={s.perGram}>
                {' '} / g
              </Text>
            </Text>
          </View>

          <View style={s.goldBadge}>
            <Text style={s.goldBadgeText}>
              Au
            </Text>
          </View>
        </View>

        <View style={s.priceInfoRow}>
          <Text style={s.priceInfoLabel}>
            Current buy price
          </Text>

          <Text style={s.priceInfoValue}>
            ₹{formattedBuyPrice} / g
          </Text>
        </View>

        <Text style={s.priceNote}>
          The selling price is lower than the
          buying price due to the buy/sell
          market spread.
        </Text>
      </View>

      {/* SELL QUANTITY */}

      <Text style={s.sectionTitle}>
        How much gold would you like to sell?
      </Text>

      <View style={s.inputCard}>
        <Text style={s.inputLabel}>
          GOLD QUANTITY
        </Text>

        <View style={s.inputRow}>
          <TextInput
            value={quantityInput}
            onChangeText={setQuantityInput}
            placeholder="0.0000"
            placeholderTextColor="#98A2B3"
            keyboardType="decimal-pad"
            style={s.input}
          />

          <Text style={s.inputUnit}>
            grams
          </Text>
        </View>
      </View>

      {/* QUICK SELECT */}

      <Text style={s.quickSelectLabel}>
        QUICK SELECT
      </Text>

      <View style={s.quickSelectRow}>
        <TouchableOpacity
          style={s.quickButton}
          onPress={() =>
            handlePercentage(0.25)
          }
        >
          <Text style={s.quickButtonText}>
            25%
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.quickButton}
          onPress={() =>
            handlePercentage(0.5)
          }
        >
          <Text style={s.quickButtonText}>
            50%
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.quickButton}
          onPress={() =>
            handlePercentage(0.75)
          }
        >
          <Text style={s.quickButtonText}>
            75%
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.quickButton}
          onPress={handleSellAll}
        >
          <Text style={s.quickButtonText}>
            MAX
          </Text>
        </TouchableOpacity>
      </View>

      {/* ERROR MESSAGE */}

      {sellQuantity > goldBalance &&
        goldBalance > 0 && (
          <View style={s.errorCard}>
            <Text style={s.errorText}>
              You cannot sell more gold than
              your available wallet balance.
            </Text>
          </View>
        )}

      {/* SALE SUMMARY */}

      <Text style={s.sectionTitle}>
        Sale Summary
      </Text>

      <View style={s.summaryCard}>
        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>
            Gold to sell
          </Text>

          <Text style={s.summaryValue}>
            {formattedSellQuantity} g
          </Text>
        </View>

        <View style={s.summaryDivider} />

        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>
            Sell price
          </Text>

          <Text style={s.summaryValue}>
            ₹{formattedSellPrice} / g
          </Text>
        </View>

        <View style={s.summaryDivider} />

        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>
            You will receive
          </Text>

          <Text style={s.receiveAmount}>
            ₹{formattedSaleAmount}
          </Text>
        </View>

        {sellQuantity > 0 &&
          sellQuantity <= goldBalance && (
            <>
              <View style={s.summaryDivider} />

              <View style={s.summaryRow}>
                <Text style={s.summaryLabel}>
                  Gold remaining
                </Text>

                <Text style={s.summaryValue}>
                  {formattedRemainingGold} g
                </Text>
              </View>
            </>
          )}
      </View>

      {/* SELL PROGRESS */}

      {sellQuantity > 0 &&
        sellQuantity <= goldBalance && (
          <View style={s.progressCard}>
            <Text style={s.progressText}>
              Selling{' '}
              {sellPercentage.toFixed(1)}%
              {' '}of your available gold.
            </Text>
          </View>
        )}

      {/* CONTINUE BUTTON */}

      <TouchableOpacity
        style={[
          s.continueButton,
          !hasSufficientGold &&
            s.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!hasSufficientGold}
      >
        <Text
          style={[
            s.continueButtonText,
            !hasSufficientGold &&
              s.continueButtonTextDisabled,
          ]}
        >
          Review Sale
        </Text>
      </TouchableOpacity>

      {/* BACK BUTTON */}

      <TouchableOpacity
        style={s.backButton}
        onPress={handleBack}
      >
        <Text style={s.backButtonText}>
          Back
        </Text>
      </TouchableOpacity>

      {/* DISCLAIMER */}

      <Text style={s.disclaimer}>
        This is a demonstration transaction.
        Live selling prices, settlement and
        transaction processing will be
        connected to AurumPay Core in a
        future development phase.
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

  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '800',
    color: navy,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22,
    color: '#667085',
  },

  balanceCard: {
    marginTop: 24,
    padding: 22,
    borderRadius: 24,
    backgroundColor: navy,
  },

  balanceLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#BFC8D3',
  },

  balanceQuantity: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  grams: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C9D1D9',
  },

  balanceDivider: {
    height: 1,
    marginVertical: 20,
    backgroundColor: '#304357',
  },

  balanceBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  balanceBottomLabel: {
    fontSize: 14,
    color: '#BFC8D3',
  },

  balanceBottomValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  priceCard: {
    marginTop: 18,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },

  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: '#98A2B3',
  },

  sellPrice: {
    marginTop: 6,
    fontSize: 26,
    fontWeight: '800',
    color: navy,
  },

  perGram: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667085',
  },

  goldBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF4D6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  goldBadgeText: {
    fontSize: 20,
    fontWeight: '800',
    color: gold,
  },

  priceInfoRow: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEF0F2',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  priceInfoLabel: {
    fontSize: 13,
    color: '#667085',
  },

  priceInfoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: navy,
  },

  priceNote: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    color: '#98A2B3',
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 19,
    fontWeight: '800',
    color: navy,
  },

  inputCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#98A2B3',
  },

  inputRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: navy,
    paddingVertical: 6,
  },

  inputUnit: {
    fontSize: 15,
    fontWeight: '700',
    color: '#667085',
  },

  quickSelectLabel: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#98A2B3',
  },

  quickSelectRow: {
    flexDirection: 'row',
    gap: 10,
  },

  quickButton: {
    flex: 1,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E4E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: navy,
  },

  errorCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#B91C1C',
  },

  summaryCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 14,
    color: '#667085',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '800',
    color: navy,
  },

  receiveAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: successGreen,
  },

  summaryDivider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: '#EEF0F2',
  },

  progressCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#EEF4FF',
  },

  progressText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#52606D',
  },

  continueButton: {
    marginTop: 28,
    height: 58,
    borderRadius: 17,
    backgroundColor: gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },

  continueButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: navy,
  },

  continueButtonTextDisabled: {
    color: '#98A2B3',
  },

  backButton: {
    marginTop: 12,
    height: 54,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
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