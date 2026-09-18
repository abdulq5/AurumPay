import {
  Stack,
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
  formatDate,
  formatGold,
  formatMoney,
  formatTime,
} from '../src/utils/format';
import { colors } from '../src/theme/colors';
import { TransactionTypeIcon } from '../src/components/TransactionTypeIcon';

const { gold, navy, successGreen, sellRed } = colors;

/*
 * Demo gold price.
 *
 * Later this will come from AurumPay Core
 * or a live gold pricing API.
 */

const currentGoldPrice = 6320;

export default function WalletScreen() {
  const router = useRouter();

  /*
   * Get wallet balance, investment
   * and transaction history.
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

  const walletValue =
    goldBalance * currentGoldPrice;

  /*
   * Format wallet values.
   */

  const formattedQuantity = formatGold(goldBalance);

  const formattedWalletValue = formatMoney(walletValue);

  const formattedPrice = formatMoney(currentGoldPrice);

  const formattedTotalInvested = formatMoney(totalInvested);

  /*
   * Navigate to Buy Gold.
   */

  function handleBuyGold() {
    router.push('/buy');
  }

  /*
   * Navigate to Sell Gold.
   */

  function handleSellGold() {
    if (goldBalance <= 0) {
      return;
    }

    router.push('/sell');
  }

  /*
   * Navigate back to home.
   */

  function handleBackHome() {
    router.replace('/');
  }

  /*
   * Open transaction details.
   *
   * We only pass the transaction ID.
   *
   * The details screen will retrieve
   * the complete transaction from
   * WalletContext.
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
   * Format transaction date.
   */

  function formatTransactionDate(date: string) {
    return formatDate(date, 'Unknown date');
  }

  /*
   * Format transaction time.
   */

  function formatTransactionTime(date: string) {
    return formatTime(date, '');
  }

  /*
   * Render one transaction.
   */

  function renderTransaction(
    transaction: WalletTransaction
  ) {
    const isBuy =
      transaction.type === 'BUY';

    const formattedAmount = formatMoney(transaction.amount);

    const formattedQuantity = formatGold(transaction.quantity);

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

        <TransactionTypeIcon type={transaction.type} variant="wallet" />

        {/* TRANSACTION INFORMATION */}

        <View
          style={s.transactionContent}
        >
          <View style={s.transactionTitleRow}>
            <Text
              style={s.transactionTitle}
            >
              {isBuy
                ? 'Gold Purchase'
                : 'Gold Sale'}
            </Text>

            <View
              style={[
                s.typeBadge,
                isBuy
                  ? s.buyBadge
                  : s.sellBadge,
              ]}
            >
              <Text
                style={[
                  s.typeBadgeText,
                  isBuy
                    ? s.buyBadgeText
                    : s.sellBadgeText,
                ]}
              >
                {transaction.type}
              </Text>
            </View>
          </View>

          <Text
            style={s.transactionDate}
          >
            {formatTransactionDate(
              transaction.date
            )}
            {' • '}
            {formatTransactionTime(
              transaction.date
            )}
          </Text>

          <Text
            style={s.transactionPrice}
          >
            ₹
            {formatMoney(transaction.price)}
            {' / g'}
          </Text>
        </View>

        {/* TRANSACTION VALUE */}

        <View
          style={s.transactionRight}
        >
          <Text
            style={[
              s.transactionAmount,
              isBuy
                ? s.buyAmount
                : s.sellAmount,
            ]}
          >
            {isBuy ? '+' : '−'} ₹
            {formattedAmount}
          </Text>

          <Text
            style={s.transactionQuantity}
          >
            {formattedQuantity} g
          </Text>

          <Text
            style={s.transactionArrow}
          >
            ›
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
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Gold Wallet',
          headerStyle: {
            backgroundColor: '#F7F8FA',
          },
          headerShadowVisible: false,
        }}
      />

      {/* TITLE */}

      <Text style={s.title}>
        Your Gold Wallet
      </Text>

      <Text style={s.subtitle}>
        View and manage your digital
        gold holdings.
      </Text>

      {/* GOLD BALANCE CARD */}

      <View style={s.balanceCard}>
        <View style={s.balanceHeader}>
          <View>
            <Text style={s.balanceLabel}>
              TOTAL GOLD BALANCE
            </Text>

            <Text
              style={s.balanceQuantity}
            >
              {formattedQuantity}

              <Text style={s.grams}>
                {' '}g
              </Text>
            </Text>
          </View>

          <View style={s.goldBadge}>
            <Text
              style={s.goldBadgeText}
            >
              Au
            </Text>
          </View>
        </View>

        <View
          style={s.dividerDark}
        />

        <View style={s.balanceRow}>
          <Text
            style={s.balanceValueLabel}
          >
            Current estimated value
          </Text>

          <Text
            style={s.balanceValue}
          >
            ₹{formattedWalletValue}
          </Text>
        </View>

        <View style={s.balanceRow}>
          <Text
            style={s.balanceValueLabel}
          >
            Current gold price
          </Text>

          <Text
            style={s.balanceValue}
          >
            ₹{formattedPrice} / g
          </Text>
        </View>
      </View>

      {/* WALLET SUMMARY */}

      {goldBalance > 0 && (
        <>
          <Text style={s.sectionTitle}>
            Wallet Summary
          </Text>

          <View style={s.summaryCard}>
            <View>
              <Text style={s.summaryLabel}>
                TOTAL INVESTED
              </Text>

              <Text style={s.summaryValue}>
                ₹{formattedTotalInvested}
              </Text>
            </View>

            <View style={s.summaryGoldIcon}>
              <Text
                style={
                  s.summaryGoldIconText
                }
              >
                Au
              </Text>
            </View>
          </View>
        </>
      )}

      {/* WALLET ACTIONS */}

      <Text style={s.sectionTitle}>
        Manage your gold
      </Text>

      <View style={s.actionRow}>
        <TouchableOpacity
          style={s.buyAction}
          onPress={handleBuyGold}
        >
          <View
            style={s.buyActionIcon}
          >
            <Text
              style={
                s.buyActionIconText
              }
            >
              +
            </Text>
          </View>

          <Text style={s.buyActionText}>
            Buy Gold
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.sellAction,
            goldBalance <= 0 &&
              s.actionDisabled,
          ]}
          onPress={handleSellGold}
          disabled={goldBalance <= 0}
        >
          <View
            style={s.sellActionIcon}
          >
            <Text
              style={
                s.sellActionIconText
              }
            >
              −
            </Text>
          </View>

          <Text
            style={s.sellActionText}
          >
            Sell Gold
          </Text>
        </TouchableOpacity>
      </View>

      {/* TRANSACTION HISTORY */}

      <Text style={s.sectionTitle}>
        Transaction History
      </Text>

      {transactions.length > 0 ? (
        <View
          style={s.transactionList}
        >
          {transactions.map(
            renderTransaction
          )}
        </View>
      ) : (
        <View style={s.emptyCard}>
          <View style={s.emptyIcon}>
            <Text
              style={s.emptyIconText}
            >
              Au
            </Text>
          </View>

          <Text style={s.emptyTitle}>
            No transactions yet
          </Text>

          <Text style={s.emptyText}>
            Your gold purchase and sale
            transactions will appear here.
          </Text>

          <TouchableOpacity
            style={s.emptyBuyButton}
            onPress={handleBuyGold}
          >
            <Text
              style={
                s.emptyBuyButtonText
              }
            >
              Buy Digital Gold
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* INFORMATION CARD */}

      <View style={s.infoCard}>
        <Text style={s.infoTitle}>
          About your digital gold
        </Text>

        <Text style={s.infoText}>
          Your wallet shows your current
          digital gold balance and transaction
          history. Live balances, market
          valuation, ownership records and
          settlement data will be connected
          to AurumPay Core in a future
          development phase.
        </Text>
      </View>

      {/* HOME BUTTON */}

      <TouchableOpacity
        style={s.homeButton}
        onPress={handleBackHome}
      >
        <Text style={s.homeButtonText}>
          Back to Home
        </Text>
      </TouchableOpacity>

      <Text style={s.disclaimer}>
        This wallet is currently operating
        in demonstration mode. Live balances
        and transaction records will be
        powered by AurumPay Core.
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

  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  goldBadge: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goldBadgeText: {
    fontSize: 24,
    fontWeight: '800',
    color: navy,
  },

  dividerDark: {
    height: 1,
    marginVertical: 22,
    backgroundColor: '#304357',
  },

  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  balanceValueLabel: {
    fontSize: 14,
    color: '#BFC8D3',
  },

  balanceValue: {
    fontSize: 15,
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

  summaryCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#98A2B3',
  },

  summaryValue: {
    marginTop: 7,
    fontSize: 22,
    fontWeight: '800',
    color: navy,
  },

  summaryGoldIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF4D6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryGoldIconText: {
    fontSize: 18,
    fontWeight: '800',
    color: gold,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },

  buyAction: {
    flex: 1,
    height: 120,
    borderRadius: 20,
    backgroundColor: gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sellAction: {
    flex: 1,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionDisabled: {
    opacity: 0.5,
  },

  buyActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor:
      'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  buyActionIconText: {
    fontSize: 27,
    fontWeight: '600',
    color: navy,
  },

  sellActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF4D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  sellActionIconText: {
    fontSize: 27,
    fontWeight: '600',
    color: gold,
  },

  buyActionText: {
    fontSize: 16,
    fontWeight: '800',
    color: navy,
  },

  sellActionText: {
    fontSize: 16,
    fontWeight: '800',
    color: navy,
  },

  transactionList: {
    gap: 10,
  },

  transactionCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  buyTransactionIcon: {
    backgroundColor: '#ECFDF3',
  },

  sellTransactionIcon: {
    backgroundColor: '#FEF2F2',
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

  transactionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  transactionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: navy,
  },

  typeBadge: {
    marginLeft: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },

  buyBadge: {
    backgroundColor: '#DCFCE7',
  },

  sellBadge: {
    backgroundColor: '#FEE2E2',
  },

  typeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },

  buyBadgeText: {
    color: successGreen,
  },

  sellBadgeText: {
    color: sellRed,
  },

  transactionDate: {
    marginTop: 5,
    fontSize: 11,
    color: '#98A2B3',
  },

  transactionPrice: {
    marginTop: 4,
    fontSize: 11,
    color: '#667085',
  },

  transactionRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },

  transactionAmount: {
    fontSize: 14,
    fontWeight: '800',
  },

  buyAmount: {
    color: successGreen,
  },

  sellAmount: {
    color: sellRed,
  },

  transactionQuantity: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: navy,
  },

  transactionArrow: {
    marginTop: 3,
    fontSize: 20,
    color: '#98A2B3',
  },

  emptyCard: {
    padding: 28,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
    alignItems: 'center',
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF4D6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIconText: {
    fontSize: 20,
    fontWeight: '800',
    color: gold,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '800',
    color: navy,
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: '#667085',
    textAlign: 'center',
  },

  emptyBuyButton: {
    marginTop: 20,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: gold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyBuyButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: navy,
  },

  infoCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#EEF4FF',
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: navy,
  },

  infoText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 21,
    color: '#52606D',
  },

  homeButton: {
    marginTop: 26,
    height: 56,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
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