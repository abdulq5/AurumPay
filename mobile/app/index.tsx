import {
  Link,
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
  formatGold,
  formatDate,
  formatMoney,
} from '../src/utils/format';
import { colors } from '../src/theme/colors';
import { TransactionTypeIcon } from '../src/components/TransactionTypeIcon';



const { gold, navy, successGreen, sellRed } = colors;

/*
 * Current demo gold price.
 *
 * Later this should come from your live
 * gold pricing API / AurumPay Core.
 */

const currentGoldPrice = 6320;

const actions = [
  ['Buy Gold', '/buy'],
  ['Sell Gold', '/sell'],
  ['Pay Merchant', '/pay'],
  ['Redeem', '/redeem'],
  ['Get Loan', '/loan'],
];

export default function Home() {
  /*
   * Router used to navigate
   * to transaction details.
   */

  const router = useRouter();

  /*
   * Get actual wallet data and
   * dynamic transaction history.
   */

  const {
    goldBalance,
    totalInvested,
    transactions,
  } = useWallet();

  /*
   * Calculate current estimated
   * wallet value.
   */

  const estimatedValue =
    goldBalance * currentGoldPrice;

  /*
   * Format gold balance.
   */

  const formattedGoldBalance = formatGold(goldBalance);

  /*
   * Format estimated value.
   */

  const formattedEstimatedValue = formatMoney(estimatedValue);

  /*
   * Format total invested amount.
   */

  const formattedTotalInvested = formatMoney(totalInvested);

  /*
   * Show only the latest three
   * transactions on the home screen.
   */

  const recentTransactions =
    transactions.slice(0, 3);

  /*
   * Format transaction date.
   */

  function formatTransactionDate(transaction: WalletTransaction) {
    return formatDate(transaction.date, 'Recently', true);
  }

  /*
   * Open transaction details.
   *
   * Pass the transaction ID.
   *
   * The transaction-details screen
   * will find the complete transaction
   * from WalletContext.
   */

  function handleTransactionPress(
    transaction: WalletTransaction
  ) {
    router.push({
      pathname: '/transaction-details',
      params: {
        id: transaction.id,
      },
    });
  }

  /*
   * Render one transaction.
   */

  function renderTransaction(
    transaction: WalletTransaction
  ) {
    const isBuy =
      transaction.type === 'BUY';

    const formattedQuantity = formatGold(transaction.quantity);

    const formattedAmount = formatMoney(transaction.amount);

    return (
      <TouchableOpacity
        key={transaction.id}
        style={s.transactionCard}
        onPress={() =>
          handleTransactionPress(
            transaction
          )
        }
        activeOpacity={0.75}
      >
        {/* TRANSACTION ICON */}

        <TransactionTypeIcon type={transaction.type} variant="home" />

        {/* TRANSACTION INFORMATION */}

        <View
          style={s.transactionContent}
        >
          <Text
            style={s.transactionTitle}
          >
            {isBuy
              ? 'Bought Digital Gold'
              : 'Sold Digital Gold'}
          </Text>

          <Text
            style={s.transactionDate}
          >
            {formatTransactionDate(
              transaction
            )}
          </Text>
        </View>

        {/* TRANSACTION VALUES */}

        <View
          style={s.transactionRight}
        >
          <Text
            style={[
              s.transactionQuantity,
              isBuy
                ? s.buyQuantity
                : s.sellQuantity,
            ]}
          >
            {isBuy ? '+' : '−'}
            {formattedQuantity} g
          </Text>

          <Text
            style={s.transactionAmount}
          >
            ₹{formattedAmount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView
      style={s.page}
      contentContainerStyle={s.content}
    >
      {/* HEADER */}

      <View style={s.header}>
        <View>
          <Text style={s.brand}>
            Aurum
            <Text
              style={{
                color: gold,
              }}
            >
              Pay
            </Text>
          </Text>

          <Text style={s.sub}>
            Your Gold. More Possibilities.
          </Text>
        </View>

        <View style={s.avatar}>
          <Text>OS</Text>
        </View>
      </View>

      {/* WALLET BALANCE CARD */}

      <View style={s.card}>
        <Text style={s.cardLabel}>
          DIGITAL GOLD BALANCE
        </Text>

        <Text style={s.balance}>
          {formattedGoldBalance} g
        </Text>

        <Text style={s.value}>
          ≈ ₹{formattedEstimatedValue}
        </Text>

        <View style={s.row}>
          <Text style={s.muted}>
            Available
          </Text>

          <Text style={s.available}>
            {formattedGoldBalance} g
          </Text>
        </View>
      </View>

      {/* WALLET SUMMARY */}

      {goldBalance > 0 && (
        <View style={s.investmentCard}>
          <Text style={s.investmentLabel}>
            TOTAL INVESTED
          </Text>

          <Text style={s.investmentValue}>
            ₹{formattedTotalInvested}
          </Text>
        </View>
      )}

      {/* ACTIONS */}

      <Text style={s.section}>
        What would you like to do?
      </Text>

      <View style={s.grid}>
        {actions.map(
          ([label, path]) => (
            <Link
              key={label}
              href={path as any}
              asChild
            >
              <TouchableOpacity
                style={s.action}
              >
                <Text
                  style={s.actionIcon}
                >
                  ◆
                </Text>

                <Text
                  style={s.actionText}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            </Link>
          )
        )}
      </View>

      {/* INFORMATION */}

      <View style={s.info}>
        <Text style={s.infoTitle}>
          Your gold, connected to more
          possibilities
        </Text>

        <Text style={s.infoText}>
          Invest in digital gold, pay
          merchants, redeem into jewellery
          and explore gold-backed lending.
        </Text>
      </View>

      {/* RECENT ACTIVITY */}

      <Text style={s.section}>
        Recent activity
      </Text>

      {recentTransactions.length > 0 ? (
        recentTransactions.map(
          renderTransaction
        )
      ) : (
        <View
          style={s.emptyActivity}
        >
          <Text
            style={s.emptyActivityText}
          >
            No gold transactions yet.
          </Text>
        </View>
      )}
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
    paddingTop: 60,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: navy,
  },

  sub: {
    color: '#667085',
    marginTop: 3,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8EDF2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* WALLET CARD */

  card: {
    backgroundColor: navy,
    borderRadius: 22,
    padding: 22,
    marginTop: 25,
  },

  cardLabel: {
    color: '#BFC8D3',
    fontSize: 12,
    letterSpacing: 1.2,
  },

  balance: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 8,
  },

  value: {
    color: '#E6C76A',
    fontSize: 18,
    marginTop: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#26394B',
  },

  muted: {
    color: '#8A96A3',
  },

  available: {
    color: '#FFF',
    fontWeight: '700',
  },

  /* INVESTMENT */

  investmentCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },

  investmentLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#98A2B3',
  },

  investmentValue: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: '800',
    color: navy,
  },

  /* SECTIONS */

  section: {
    fontSize: 18,
    fontWeight: '800',
    color: navy,
    marginTop: 28,
    marginBottom: 14,
  },

  /* ACTIONS */

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  action: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    width: '31%',
    minWidth: 95,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },

  actionIcon: {
    color: gold,
    fontSize: 20,
  },

  actionText: {
    color: navy,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },

  /* INFORMATION */

  info: {
    backgroundColor: '#FFF8E7',
    borderRadius: 18,
    padding: 18,
    marginTop: 22,
  },

  infoTitle: {
    color: navy,
    fontSize: 16,
    fontWeight: '800',
  },

  infoText: {
    color: '#667085',
    marginTop: 6,
    lineHeight: 20,
  },

  /* TRANSACTION HISTORY */

  transactionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E7E9EC',
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  buyTransactionIcon: {
    backgroundColor: '#DCFCE7',
  },

  sellTransactionIcon: {
    backgroundColor: '#FEE2E2',
  },

  transactionIconText: {
    fontSize: 24,
    fontWeight: '800',
  },

  buyTransactionIconText: {
    color: successGreen,
  },

  sellTransactionIconText: {
    color: sellRed,
  },

  transactionContent: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: navy,
  },

  transactionDate: {
    marginTop: 4,
    fontSize: 11,
    color: '#98A2B3',
  },

  transactionRight: {
    alignItems: 'flex-end',
  },

  transactionQuantity: {
    fontSize: 14,
    fontWeight: '800',
  },

  buyQuantity: {
    color: successGreen,
  },

  sellQuantity: {
    color: sellRed,
  },

  transactionAmount: {
    marginTop: 4,
    fontSize: 12,
    color: '#667085',
  },

  /* EMPTY STATE */

  emptyActivity: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },

  emptyActivityText: {
    color: '#667085',
    textAlign: 'center',
  },
});