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
  WalletTransaction,
} from '../context/WalletContext';
import {
  formatDateTimeParts,
  formatGold,
  formatMoney,
} from '../src/utils/format';
import { colors } from '../src/theme/colors';

const { gold, navy, successGreen, sellRed } = colors;

export default function TransactionDetailsScreen() {
  const router = useRouter();

  /*
   * Get transaction ID
   * from the URL.
   */

  const { id } =
    useLocalSearchParams<{
      id?: string;
    }>();

  /*
   * Get complete transaction
   * history from WalletContext.
   */

  const { transactions } =
    useWallet();

  /*
   * Find the transaction
   * matching the ID from URL.
   */

  const transaction =
    transactions.find(
      item => item.id === id
    );

  /*
   * Go back to wallet.
   */

  function handleBackToWallet() {
    router.replace('/wallet');
  }

  /*
   * If transaction does not exist.
   */

  if (!transaction) {
    return (
      <View style={s.notFoundPage}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: 'Transaction Details',
            headerStyle: {
              backgroundColor: '#F7F8FA',
            },
            headerShadowVisible: false,
          }}
        />

        <View style={s.notFoundCard}>
          <View style={s.notFoundIcon}>
            <Text style={s.notFoundIconText}>
              !
            </Text>
          </View>

          <Text style={s.notFoundTitle}>
            Transaction not found
          </Text>

          <Text style={s.notFoundText}>
            We could not find the transaction
            you are looking for.
          </Text>

          <TouchableOpacity
            style={s.walletButton}
            onPress={handleBackToWallet}
          >
            <Text style={s.walletButtonText}>
              Back to Wallet
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /*
   * Determine transaction type.
   */

  const isBuy =
    transaction.type === 'BUY';

  /*
   * Format transaction date.
   */

  const formattedDateTime = formatDateTimeParts(transaction.date);
  const formattedDate = formattedDateTime?.date ?? 'Invalid Date';
  const formattedTime = formattedDateTime?.time ?? 'Invalid Date';

  /*
   * Format quantity.
   */

  const formattedQuantity = formatGold(transaction.quantity);

  /*
   * Format transaction amount.
   */

  const formattedAmount = formatMoney(transaction.amount);

  /*
   * Format gold price.
   */

  const formattedPrice = formatMoney(transaction.price);

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={s.content}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Transaction Details',
          headerStyle: {
            backgroundColor: '#F7F8FA',
          },
          headerShadowVisible: false,
        }}
      />

      {/* TRANSACTION TYPE HEADER */}

      <View
        style={[
          s.heroCard,
          isBuy
            ? s.buyHeroCard
            : s.sellHeroCard,
        ]}
      >
        <View
          style={[
            s.heroIcon,
            isBuy
              ? s.buyHeroIcon
              : s.sellHeroIcon,
          ]}
        >
          <Text
            style={[
              s.heroIconText,
              isBuy
                ? s.buyHeroIconText
                : s.sellHeroIconText,
            ]}
          >
            {isBuy ? '+' : '−'}
          </Text>
        </View>

        <Text style={s.heroTitle}>
          {isBuy
            ? 'Gold Purchase'
            : 'Gold Sale'}
        </Text>

        <Text style={s.heroSubtitle}>
          {isBuy
            ? 'Digital gold successfully purchased'
            : 'Digital gold successfully sold'}
        </Text>

        <View
          style={[
            s.statusBadge,
            isBuy
              ? s.buyStatusBadge
              : s.sellStatusBadge,
          ]}
        >
          <View style={s.statusDot} />

          <Text
            style={[
              s.statusText,
              isBuy
                ? s.buyStatusText
                : s.sellStatusText,
            ]}
          >
            {transaction.status}
          </Text>
        </View>
      </View>

      {/* AMOUNT SUMMARY */}

      <View style={s.amountCard}>
        <Text style={s.amountLabel}>
          TRANSACTION AMOUNT
        </Text>

        <Text
          style={[
            s.amountValue,
            isBuy
              ? s.buyAmountValue
              : s.sellAmountValue,
          ]}
        >
          {isBuy ? '+' : '−'} ₹
          {formattedAmount}
        </Text>

        <Text style={s.quantitySummary}>
          {formattedQuantity} g of digital gold
        </Text>
      </View>

      {/* TRANSACTION DETAILS */}

      <Text style={s.sectionTitle}>
        Transaction Details
      </Text>

      <View style={s.detailsCard}>
        {/* TRANSACTION TYPE */}

        <DetailRow
          label="Transaction type"
          value={
            isBuy
              ? 'Buy Gold'
              : 'Sell Gold'
          }
          valueColor={
            isBuy
              ? successGreen
              : sellRed
          }
        />

        <View style={s.divider} />

        {/* GOLD QUANTITY */}

        <DetailRow
          label="Gold quantity"
          value={`${formattedQuantity} g`}
        />

        <View style={s.divider} />

        {/* GOLD PRICE */}

        <DetailRow
          label="Gold price"
          value={`₹${formattedPrice} / g`}
        />

        <View style={s.divider} />

        {/* TRANSACTION AMOUNT */}

        <DetailRow
          label="Transaction amount"
          value={`₹${formattedAmount}`}
          valueColor={navy}
        />

        <View style={s.divider} />

        {/* DATE */}

        <DetailRow
          label="Date"
          value={formattedDate}
        />

        <View style={s.divider} />

        {/* TIME */}

        <DetailRow
          label="Time"
          value={formattedTime}
        />

        <View style={s.divider} />

        {/* STATUS */}

        <DetailRow
          label="Status"
          value={transaction.status}
          valueColor={successGreen}
        />
      </View>

      {/* TRANSACTION ID */}

      <Text style={s.sectionTitle}>
        Reference Information
      </Text>

      <View style={s.referenceCard}>
        <Text style={s.referenceLabel}>
          TRANSACTION ID
        </Text>

        <Text
          style={s.transactionId}
          selectable
        >
          {transaction.id}
        </Text>

        <Text style={s.referenceText}>
          Keep this transaction ID for
          future reference.
        </Text>
      </View>

      {/* BACK TO WALLET */}

      <TouchableOpacity
        style={s.walletButton}
        onPress={handleBackToWallet}
      >
        <Text style={s.walletButtonText}>
          Back to Wallet
        </Text>
      </TouchableOpacity>

      <Text style={s.disclaimer}>
        This transaction is currently
        operating in demonstration mode.
        Final transaction settlement and
        ownership records will be powered
        by AurumPay Core.
      </Text>
    </ScrollView>
  );
}

/*
 * Reusable detail row.
 */

type DetailRowProps = {
  label: string;
  value: string;
  valueColor?: string;
};

function DetailRow({
  label,
  value,
  valueColor = navy,
}: DetailRowProps) {
  return (
    <View style={s.detailRow}>
      <Text style={s.detailLabel}>
        {label}
      </Text>

      <Text
        style={[
          s.detailValue,
          {
            color: valueColor,
          },
        ]}
      >
        {value}
      </Text>
    </View>
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

  /*
   * HERO
   */

  heroCard: {
    marginTop: 12,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
  },

  buyHeroCard: {
    backgroundColor: '#ECFDF3',
  },

  sellHeroCard: {
    backgroundColor: '#FEF2F2',
  },

  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buyHeroIcon: {
    backgroundColor: '#DCFCE7',
  },

  sellHeroIcon: {
    backgroundColor: '#FEE2E2',
  },

  heroIconText: {
    fontSize: 38,
    fontWeight: '800',
  },

  buyHeroIconText: {
    color: successGreen,
  },

  sellHeroIconText: {
    color: sellRed,
  },

  heroTitle: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '800',
    color: navy,
  },

  heroSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#667085',
    textAlign: 'center',
  },

  statusBadge: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  buyStatusBadge: {
    backgroundColor: '#DCFCE7',
  },

  sellStatusBadge: {
    backgroundColor: '#FEE2E2',
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: successGreen,
    marginRight: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },

  buyStatusText: {
    color: successGreen,
  },

  sellStatusText: {
    color: sellRed,
  },

  /*
   * AMOUNT
   */

  amountCard: {
    marginTop: 16,
    padding: 22,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
    alignItems: 'center',
  },

  amountLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#98A2B3',
  },

  amountValue: {
    marginTop: 9,
    fontSize: 30,
    fontWeight: '800',
  },

  buyAmountValue: {
    color: successGreen,
  },

  sellAmountValue: {
    color: sellRed,
  },

  quantitySummary: {
    marginTop: 7,
    fontSize: 13,
    color: '#667085',
  },

  /*
   * SECTIONS
   */

  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 19,
    fontWeight: '800',
    color: navy,
  },

  /*
   * DETAILS
   */

  detailsCard: {
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },

  detailRow: {
    minHeight: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailLabel: {
    flex: 1,
    fontSize: 13,
    color: '#667085',
  },

  detailValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEF0F2',
  },

  /*
   * REFERENCE
   */

  referenceCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFF8E7',
  },

  referenceLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#8A6A1F',
  },

  transactionId: {
    marginTop: 9,
    fontSize: 15,
    fontWeight: '800',
    color: navy,
  },

  referenceText: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: '#667085',
  },

  /*
   * BUTTON
   */

  walletButton: {
    marginTop: 28,
    height: 56,
    borderRadius: 17,
    backgroundColor: navy,
    alignItems: 'center',
    justifyContent: 'center',
  },

  walletButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /*
   * DISCLAIMER
   */

  disclaimer: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 17,
    color: '#98A2B3',
  },

  /*
   * NOT FOUND
   */

  notFoundPage: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F8FA',
  },

  notFoundCard: {
    marginTop: 60,
    padding: 28,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
    alignItems: 'center',
  },

  notFoundIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  notFoundIconText: {
    fontSize: 26,
    fontWeight: '800',
    color: sellRed,
  },

  notFoundTitle: {
    marginTop: 16,
    fontSize: 19,
    fontWeight: '800',
    color: navy,
  },

  notFoundText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    color: '#667085',
  },
});