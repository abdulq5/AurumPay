import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { getWallet } from '../src/api/wallet';


/*
 * Transaction types supported
 * by the wallet.
 */

export type TransactionType =
  | 'BUY'
  | 'SELL'
  | 'REDEMPTION';


/*
 * Individual wallet transaction.
 */

export type WalletTransaction = {
  id: string;

  type: TransactionType;

  quantity: number;

  amount: number;

  price: number;

  date: string;

  status: 'SUCCESS';

  /*
   * Optional redemption details.
   */

  productId?: string;

  productName?: string;

  paymentMode?: string;

  cashAmountPaid?: number;
};


/*
 * Wallet context.
 */

type WalletContextType = {

  goldBalance: number;

  totalInvested: number;


  /*
   * Complete transaction history.
   *
   * Newest transactions are stored first.
   */

  transactions: WalletTransaction[];


  /*
   * Add purchased gold.
   */

  addGold: (
    quantity: number,
    amount: number
  ) => void;


  /*
   * Remove gold through a sell
   * transaction.
   */

  removeGold: (
    quantity: number,
    amount: number,
    price: number
  ) => boolean;


  /*
   * Deduct gold used for
   * product redemption.
   */

  redeemGold: (
    quantity: number,
    goldValueApplied: number,
    productId: string,
    productName: string,
    paymentMode: string,
    cashAmountPaid: number,
    goldRate: number
  ) => boolean;


  /*
   * Reset wallet.
   */

  resetWallet: () => void;

  refreshWallet: () => Promise<void>;
};


const WalletContext =
  createContext<
    WalletContextType | undefined
  >(
    undefined
  );


type WalletProviderProps = {
  children: ReactNode;
};


export function WalletProvider({
  children,
}: WalletProviderProps) {

  const { isAuthenticated } = useAuth();


  const [
    goldBalance,
    setGoldBalance,
  ] = useState(0);


  const [
    totalInvested,
    setTotalInvested,
  ] = useState(0);

  async function refreshWallet() {
    if (!isAuthenticated) {
      return;
    }

    const wallet = await getWallet();
    setGoldBalance(wallet.availableGrams);
  }

  useEffect(() => {
    if (isAuthenticated) {
      refreshWallet().catch(() => undefined);
    }
  }, [isAuthenticated]);


  /*
   * Store complete transaction
   * history.
   */

  const [
    transactions,
    setTransactions,
  ] = useState<
    WalletTransaction[]
  >(
    []
  );


  /*
   * Generate transaction ID.
   */

  function generateTransactionId(
    type: TransactionType
  ) {

    const timestamp =
      Date.now()
        .toString()
        .slice(-10);


    const random =
      Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase();


    return `AUR${type}${timestamp}${random}`;

  }


  /*
   * Add purchased gold.
   */

  function addGold(
    quantity: number,
    amount: number
  ) {

    if (
      !Number.isFinite(
        quantity
      ) ||
      !Number.isFinite(
        amount
      ) ||
      quantity <= 0 ||
      amount <= 0
    ) {

      return;

    }


    /*
     * Calculate purchase price
     * per gram.
     */

    const price =
      amount /
      quantity;


    /*
     * Update gold balance.
     */

    setGoldBalance(
      previousBalance =>
        previousBalance +
        quantity
    );


    /*
     * Update invested amount.
     */

    setTotalInvested(
      previousInvestment =>
        previousInvestment +
        amount
    );


    /*
     * Create BUY transaction.
     */

    const transaction:
      WalletTransaction = {

      id:
        generateTransactionId(
          'BUY'
        ),

      type:
        'BUY',

      quantity,

      amount,

      price,

      date:
        new Date()
          .toISOString(),

      status:
        'SUCCESS',

    };


    /*
     * Add newest transaction
     * first.
     */

    setTransactions(
      previousTransactions => [
        transaction,
        ...previousTransactions,
      ]
    );

  }


  /*
   * Remove gold from wallet.
   *
   * Used for SELL transactions.
   */

  function removeGold(
    quantity: number,
    amount: number,
    price: number
  ) {

    if (
      !Number.isFinite(
        quantity
      ) ||
      !Number.isFinite(
        amount
      ) ||
      !Number.isFinite(
        price
      ) ||
      quantity <= 0 ||
      amount <= 0 ||
      price <= 0 ||
      quantity >
        goldBalance
    ) {

      return false;

    }


    const balanceBeforeSale =
      goldBalance;


    const investmentBeforeSale =
      totalInvested;


    const percentageSold =
      quantity /
      balanceBeforeSale;


    const investmentToRemove =
      investmentBeforeSale *
      percentageSold;


    const newGoldBalance =
      balanceBeforeSale -
      quantity;


    const newTotalInvested =
      investmentBeforeSale -
      investmentToRemove;


    setGoldBalance(

      newGoldBalance <=
      0.00000001

        ? 0

        : newGoldBalance

    );


    setTotalInvested(

      newTotalInvested <=
      0.00000001

        ? 0

        : newTotalInvested

    );


    /*
     * Create SELL transaction.
     */

    const transaction:
      WalletTransaction = {

      id:
        generateTransactionId(
          'SELL'
        ),

      type:
        'SELL',

      quantity,

      amount,

      price,

      date:
        new Date()
          .toISOString(),

      status:
        'SUCCESS',

    };


    setTransactions(
      previousTransactions => [
        transaction,
        ...previousTransactions,
      ]
    );


    return true;

  }


  /*
   * Redeem digital gold.
   *
   * This deducts gold from the
   * wallet and records a dedicated
   * REDEMPTION transaction.
   */

  function redeemGold(

    quantity: number,

    goldValueApplied: number,

    productId: string,

    productName: string,

    paymentMode: string,

    cashAmountPaid: number,

    goldRate: number

  ) {


    /*
     * Validate transaction.
     */

    if (

      !Number.isFinite(
        quantity
      ) ||

      !Number.isFinite(
        goldValueApplied
      ) ||

      !Number.isFinite(
        cashAmountPaid
      ) ||

      !Number.isFinite(
        goldRate
      ) ||

      quantity <= 0 ||

      goldValueApplied <= 0 ||

      goldRate <= 0 ||

      quantity >
        goldBalance

    ) {

      return false;

    }


    /*
     * Store values before redemption.
     */

    const balanceBeforeRedemption =
      goldBalance;


    const investmentBeforeRedemption =
      totalInvested;


    /*
     * Calculate proportional
     * investment reduction.
     */

    const percentageRedeemed =
      quantity /
      balanceBeforeRedemption;


    const investmentToRemove =
      investmentBeforeRedemption *
      percentageRedeemed;


    /*
     * Calculate new wallet balance.
     */

    const newGoldBalance =
      balanceBeforeRedemption -
      quantity;


    const newTotalInvested =
      investmentBeforeRedemption -
      investmentToRemove;


    /*
     * Update wallet.
     */

    setGoldBalance(

      newGoldBalance <=
      0.00000001

        ? 0

        : newGoldBalance

    );


    setTotalInvested(

      newTotalInvested <=
      0.00000001

        ? 0

        : newTotalInvested

    );


    /*
     * Create redemption
     * transaction.
     */

    const transaction:
      WalletTransaction = {

      id:
        generateTransactionId(
          'REDEMPTION'
        ),

      type:
        'REDEMPTION',

      quantity,

      /*
       * Amount represents the
       * value of digital gold
       * applied.
       */

      amount:
        goldValueApplied,

      price:
        goldRate,

      date:
        new Date()
          .toISOString(),

      status:
        'SUCCESS',

      productId,

      productName,

      paymentMode,

      cashAmountPaid,

    };


    /*
     * Add newest transaction first.
     */

    setTransactions(
      previousTransactions => [
        transaction,
        ...previousTransactions,
      ]
    );


    return true;

  }


  /*
   * Reset complete wallet.
   */

  function resetWallet() {

    setGoldBalance(
      0
    );


    setTotalInvested(
      0
    );


    setTransactions(
      []
    );

  }


  return (

    <WalletContext.Provider

      value={{

        goldBalance,

        totalInvested,

        transactions,

        addGold,

        removeGold,

        redeemGold,

        resetWallet,

        refreshWallet,

      }}

    >

      {children}

    </WalletContext.Provider>

  );

}


export function useWallet() {


  const context =
    useContext(
      WalletContext
    );


  if (
    !context
  ) {

    throw new Error(
      'useWallet must be used inside WalletProvider'
    );

  }


  return context;

}