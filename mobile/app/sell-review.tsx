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
import { colors } from '../src/theme/colors';
import { formatGold, formatMoney } from '../src/utils/format';

const { gold, navy, successGreen } = colors;

export default function SellReviewScreen() {
  const router = useRouter();

  /*
   * Receive transaction details
   * from the Sell Gold screen.
   */

  const {
    quantity,
    amount,
    price,
    balance,
    remaining,
  } = useLocalSearchParams<{
    quantity?: string;
    amount?: string;
    price?: string;
    balance?: string;
    remaining?: string;
  }>();

  /*
   * Convert received parameters
   * into numbers safely.
   */

  const sellQuantity =
    Number(quantity) || 0;

  const saleAmount =
    Number(amount) || 0;

  const sellPrice =
    Number(price) || 0;

  const walletBalance =
    Number(balance) || 0;

  const remainingGold =
    Number(remaining) || 0;

  /*
   * Format values.
   */

  const formattedSellQuantity = formatGold(sellQuantity);
  const formattedWalletBalance = formatGold(walletBalance);
  const formattedRemainingGold = formatGold(remainingGold);
  const formattedSaleAmount = formatMoney(saleAmount);
  const formattedSellPrice = formatMoney(sellPrice);

  /*
   * Confirm sale.
   *
   * IMPORTANT:
   * The actual wallet deduction
   * will be added in the next step.
   */

  function handleConfirmSale() {
    if (
      sellQuantity <= 0 ||
      saleAmount <= 0 ||
      sellPrice <= 0
    ) {
      Alert.alert(
        'Invalid Sale',
        'The sale information is invalid. Please go back and try again.'
      );

      return;
    }

    router.push({
      pathname: '/sell-success',
      params: {
        quantity:
          sellQuantity.toString(),

        amount:
          saleAmount.toString(),

        price:
          sellPrice.toString(),

        balance:
          walletBalance.toString(),

        remaining:
          remainingGold.toString(),
      },
    });
  }

  /*
   * Go back to edit the quantity.
   */

  function handleEditSale() {
    router.back();
  }

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={s.content}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Review Sale',
          headerStyle: {
            backgroundColor: '#F7F8FA',
          },
          headerShadowVisible: false,
        }}
      />

      {/* TITLE */}

      <Text style={s.title}>
        Review Sale
      </Text>

      <Text style={s.subtitle}>
        Please review your sale details before
        confirming the transaction.
      </Text>

      {/* GOLD SALE CARD */}

      <View style={s.goldCard}>
        <View style={s.goldCardHeader}>
          <View>
            <Text style={s.goldCardLabel}>
              GOLD TO SELL
            </Text>

            <Text style={s.goldQuantity}>
              {formattedSellQuantity}

              <Text style={s.grams}>
                {' '}g
              </Text>
            </Text>
          </View>

          <View style={s.goldBadge}>
            <Text style={s.goldBadgeText}>
              Au
            </Text>
          </View>
        </View>

        <View style={s.darkDivider} />

        <View style={s.goldCardRow}>
          <Text style={s.goldCardRowLabel}>
            Current wallet balance
          </Text>

          <Text style={s.goldCardRowValue}>
            {formattedWalletBalance} g
          </Text>
        </View>

        <View style={s.goldCardRow}>
          <Text style={s.goldCardRowLabel}>
            Gold remaining after sale
          </Text>

          <Text style={s.goldCardRowValue}>
            {formattedRemainingGold} g
          </Text>
        </View>
      </View>

      {/* SALE DETAILS */}

      <Text style={s.sectionTitle}>
        Sale Details
      </Text>

      <View style={s.detailsCard}>
        <View style={s.detailRow}>
          <Text style={s.detailLabel}>
            Gold quantity
          </Text>

          <Text style={s.detailValue}>
            {formattedSellQuantity} g
          </Text>
        </View>

        <View style={s.divider} />

        <View style={s.detailRow}>
          <Text style={s.detailLabel}>
            Sell price
          </Text>

          <Text style={s.detailValue}>
            ₹{formattedSellPrice} / g
          </Text>
        </View>

        <View style={s.divider} />

        <View style={s.receiveRow}>
          <Text style={s.receiveLabel}>
            You will receive
          </Text>

          <Text style={s.receiveAmount}>
            ₹{formattedSaleAmount}
          </Text>
        </View>
      </View>

      {/* SETTLEMENT INFORMATION */}

      <Text style={s.sectionTitle}>
        Settlement
      </Text>

      <View style={s.settlementCard}>
        <View style={s.settlementIcon}>
          <Text style={s.settlementIconText}>
            ₹
          </Text>
        </View>

        <View style={s.settlementContent}>
          <Text style={s.settlementTitle}>
            Sale proceeds
          </Text>

          <Text style={s.settlementText}>
            In the production version, the
            sale amount will be settled to
            the customer's linked payment
            account.
          </Text>
        </View>
      </View>

      {/* INFORMATION */}

      <View style={s.infoCard}>
        <Text style={s.infoTitle}>
          Please note
        </Text>

        <Text style={s.infoText}>
          Once you confirm the sale, the
          selected quantity of gold will be
          deducted from your AurumPay Gold
          Wallet.
        </Text>

        <Text style={s.infoText}>
          The final settlement and transaction
          processing will be handled by
          AurumPay Core in the production
          version.
        </Text>
      </View>

      {/* CONFIRM BUTTON */}

      <TouchableOpacity
        style={s.confirmButton}
        onPress={handleConfirmSale}
      >
        <Text style={s.confirmButtonText}>
          Confirm Sale
        </Text>
      </TouchableOpacity>

      {/* EDIT BUTTON */}

      <TouchableOpacity
        style={s.editButton}
        onPress={handleEditSale}
      >
        <Text style={s.editButtonText}>
          Edit Sale
        </Text>
      </TouchableOpacity>

      {/* DISCLAIMER */}

      <Text style={s.disclaimer}>
        This is a demonstration transaction.
        Live pricing, settlement and transaction
        processing will be connected to
        AurumPay Core in a future development
        phase.
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

  goldCard: {
    marginTop: 24,
    padding: 22,
    borderRadius: 24,
    backgroundColor: navy,
  },

  goldCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  goldCardLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#BFC8D3',
  },

  goldQuantity: {
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

  goldBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goldBadgeText: {
    fontSize: 22,
    fontWeight: '800',
    color: navy,
  },

  darkDivider: {
    height: 1,
    marginVertical: 20,
    backgroundColor: '#304357',
  },

  goldCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  goldCardRowLabel: {
    flex: 1,
    fontSize: 13,
    color: '#BFC8D3',
  },

  goldCardRowValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontSize: 19,
    fontWeight: '800',
    color: navy,
  },

  detailsCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailLabel: {
    fontSize: 14,
    color: '#667085',
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '800',
    color: navy,
  },

  divider: {
    height: 1,
    marginVertical: 17,
    backgroundColor: '#EEF0F2',
  },

  receiveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  receiveLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: navy,
  },

  receiveAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: successGreen,
  },

  settlementCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
    flexDirection: 'row',
  },

  settlementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  settlementIconText: {
    fontSize: 22,
    fontWeight: '800',
    color: successGreen,
  },

  settlementContent: {
    flex: 1,
  },

  settlementTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: navy,
  },

  settlementText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 18,
    color: '#667085',
  },

  infoCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFF8E7',
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: navy,
  },

  infoText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
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

  confirmButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: navy,
  },

  editButton: {
    marginTop: 12,
    height: 54,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  editButtonText: {
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