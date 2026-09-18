import { StyleSheet, Text, View } from 'react-native';

import { TransactionType } from '../../context/WalletContext';
import { colors } from '../theme/colors';

type TransactionTypeIconProps = {
  type: TransactionType;
  variant: 'home' | 'wallet';
};

export function TransactionTypeIcon({ type, variant }: TransactionTypeIconProps) {
  const isBuy = type === 'BUY';
  const isHome = variant === 'home';

  return (
    <View
      style={[
        styles.icon,
        isHome ? styles.homeIcon : styles.walletIcon,
        isBuy
          ? isHome ? styles.homeBuyIcon : styles.walletBuyIcon
          : isHome ? styles.homeSellIcon : styles.walletSellIcon,
      ]}
    >
      <Text
        style={[
          styles.iconText,
          isBuy ? styles.buyIconText : styles.sellIconText,
        ]}
      >
        {isBuy ? '+' : '−'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  homeIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  walletIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  homeBuyIcon: {
    backgroundColor: '#DCFCE7',
  },
  homeSellIcon: {
    backgroundColor: '#FEE2E2',
  },
  walletBuyIcon: {
    backgroundColor: '#ECFDF3',
  },
  walletSellIcon: {
    backgroundColor: '#FEF2F2',
  },
  iconText: {
    fontSize: 24,
    fontWeight: '800',
  },
  buyIconText: {
    color: colors.successGreen,
  },
  sellIconText: {
    color: colors.sellRed,
  },
});