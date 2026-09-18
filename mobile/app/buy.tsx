import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
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
import { getGoldQuote } from '../src/api/gold';
import { formatGold, formatMoney } from '../src/utils/format';
import { colors } from '../src/theme/colors';

const { gold, navy } = colors;

const MIN_PURCHASE_AMOUNT = 100;

type BuyMode = 'amount' | 'quantity';

export default function BuyGoldScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<BuyMode>('amount');
  const [input, setInput] = useState('');
  const [goldPrice, setGoldPrice] = useState(6320);

  useEffect(() => {
    getGoldQuote()
      .then((quote) => setGoldPrice(quote.buyPricePerGram))
      .catch(() => undefined);
  }, []);

  const numericValue = Number(input.replace(/,/g, '')) || 0;

  const goldQuantity =
    mode === 'amount'
      ? numericValue / goldPrice
      : numericValue;

  const payableAmount =
    mode === 'quantity'
      ? numericValue * goldPrice
      : numericValue;

  const isValid =
    numericValue > 0 &&
    payableAmount >= MIN_PURCHASE_AMOUNT;

  const formattedGold = formatGold(goldQuantity);

  const formattedAmount = formatMoney(payableAmount);

  function handleProceed() {
    if (!isValid) {
      Alert.alert(
        'Enter a valid amount',
        `Minimum purchase amount is ₹${MIN_PURCHASE_AMOUNT}.`
      );
      return;
    }

    router.push({
      pathname: '/buy-review-order',
      params: {
        goldQuantity: formattedGold,
        payableAmount: payableAmount.toFixed(2),
        goldPrice: goldPrice.toString(),
      },
    });
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
          title: 'Buy Gold',
          headerStyle: {
            backgroundColor: '#F7F8FA',
          },
          headerShadowVisible: false,
        }}
      />

      <Text style={s.title}>Buy Digital Gold</Text>

      <Text style={s.subtitle}>
        Purchase 24K digital gold securely through AurumPay.
      </Text>

      <View style={s.priceCard}>
        <View>
          <Text style={s.priceLabel}>
            CURRENT SELLING PRICE
          </Text>

          <Text style={s.price}>
            ₹{formatMoney(goldPrice)}
            <Text style={s.perGram}> / g</Text>
          </Text>

          <Text style={s.purity}>
            24K • 99.99% Pure Gold
          </Text>
        </View>

        <View style={s.goldBadge}>
          <Text style={s.goldBadgeText}>Au</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>
        How would you like to buy?
      </Text>

      <View style={s.modeRow}>
        <TouchableOpacity
          style={[
            s.modeButton,
            mode === 'amount' && s.modeButtonActive,
          ]}
          onPress={() => {
            setMode('amount');
            setInput('');
          }}
        >
          <Text
            style={[
              s.modeText,
              mode === 'amount' && s.modeTextActive,
            ]}
          >
            By Amount
          </Text>

          <Text
            style={[
              s.modeSubText,
              mode === 'amount' && s.modeSubTextActive,
            ]}
          >
            ₹ INR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.modeButton,
            mode === 'quantity' && s.modeButtonActive,
          ]}
          onPress={() => {
            setMode('quantity');
            setInput('');
          }}
        >
          <Text
            style={[
              s.modeText,
              mode === 'quantity' && s.modeTextActive,
            ]}
          >
            By Quantity
          </Text>

          <Text
            style={[
              s.modeSubText,
              mode === 'quantity' && s.modeSubTextActive,
            ]}
          >
            Grams
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.inputSection}>
        <Text style={s.inputLabel}>
          {mode === 'amount'
            ? 'Enter purchase amount'
            : 'Enter gold quantity'}
        </Text>

        <View style={s.inputBox}>
          <Text style={s.inputPrefix}>
            {mode === 'amount' ? '₹' : 'g'}
          </Text>

          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder={
              mode === 'amount'
                ? '10,000'
                : '1.0000'
            }
            placeholderTextColor="#98A2B3"
            keyboardType="decimal-pad"
          />
        </View>

        {mode === 'amount' && (
          <Text style={s.minimumText}>
            Minimum purchase amount: ₹
            {formatMoney(MIN_PURCHASE_AMOUNT)}
          </Text>
        )}

        {mode === 'quantity' && (
          <Text style={s.minimumText}>
            Minimum purchase amount: ₹
            {formatMoney(MIN_PURCHASE_AMOUNT)}
          </Text>
        )}
      </View>

      <View style={s.summaryCard}>
        <Text style={s.summaryTitle}>
          Order Summary
        </Text>

        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>
            Gold selling price
          </Text>

          <Text style={s.summaryValue}>
            ₹{formatMoney(goldPrice)} / g
          </Text>
        </View>

        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>
            Gold quantity
          </Text>

          <Text style={s.summaryValue}>
            {formattedGold} g
          </Text>
        </View>

        <View style={s.summaryRow}>
          <Text style={s.summaryLabel}>
            Transaction fee
          </Text>

          <Text style={s.summaryValue}>
            ₹0.00
          </Text>
        </View>

        <View style={s.divider} />

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>
            Total payable
          </Text>

          <Text style={s.totalValue}>
            ₹{formattedAmount}
          </Text>
        </View>
      </View>

      <View style={s.infoCard}>
        <Text style={s.infoTitle}>
          What happens next?
        </Text>

        <Text style={s.infoText}>
          Your order will be created at the applicable gold selling price.
          After successful payment confirmation, the corresponding digital
          gold will be credited to your AurumPay wallet.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          s.proceedButton,
          !isValid && s.proceedButtonDisabled,
        ]}
        onPress={handleProceed}
      >
        <Text style={s.proceedText}>
          Review Order
        </Text>
      </TouchableOpacity>

      <Text style={s.disclaimer}>
        Demo pricing is currently being used. Live pricing and payment
        processing will be connected to AurumPay Core.
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
    fontSize: 28,
    fontWeight: '800',
    color: navy,
    marginTop: 10,
  },

  subtitle: {
    fontSize: 15,
    color: '#667085',
    lineHeight: 22,
    marginTop: 6,
  },

  priceCard: {
    marginTop: 24,
    backgroundColor: navy,
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceLabel: {
    fontSize: 11,
    letterSpacing: 1.1,
    color: '#BFC8D3',
  },

  price: {
    marginTop: 7,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  perGram: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C9D1D9',
  },

  purity: {
    marginTop: 5,
    fontSize: 13,
    color: '#E6C76A',
  },

  goldBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goldBadgeText: {
    fontSize: 24,
    fontWeight: '800',
    color: navy,
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: '800',
    color: navy,
  },

  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },

  modeButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    alignItems: 'center',
  },

  modeButtonActive: {
    borderColor: gold,
    backgroundColor: '#FFF8E7',
  },

  modeText: {
    fontSize: 15,
    fontWeight: '800',
    color: navy,
  },

  modeTextActive: {
    color: gold,
  },

  modeSubText: {
    marginTop: 3,
    fontSize: 12,
    color: '#98A2B3',
  },

  modeSubTextActive: {
    color: '#8B6A1C',
  },

  inputSection: {
    marginTop: 22,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: navy,
    marginBottom: 8,
  },

  inputBox: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  inputPrefix: {
    fontSize: 18,
    fontWeight: '800',
    color: gold,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: navy,
  },

  minimumText: {
    marginTop: 7,
    fontSize: 12,
    color: '#667085',
  },

  summaryCard: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF0F2',
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: navy,
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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

  divider: {
    height: 1,
    backgroundColor: '#EEF0F2',
    marginVertical: 6,
  },

  totalRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: navy,
  },

  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: gold,
  },

  infoCard: {
    marginTop: 20,
    backgroundColor: '#EEF4FF',
    borderRadius: 18,
    padding: 16,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: navy,
  },

  infoText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: '#52606D',
  },

  proceedButton: {
    marginTop: 24,
    backgroundColor: gold,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  proceedButtonDisabled: {
    opacity: 0.5,
  },

  proceedText: {
    fontSize: 16,
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