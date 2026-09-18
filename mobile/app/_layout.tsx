import {
  Stack,
  useRouter,
  useSegments,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';


import {
  WalletProvider,
} from '../context/WalletContext';


import {
  AuthProvider,
  useAuth,
} from '../context/AuthContext';


function RootNavigator() {


  const router =
    useRouter();


  const segments =
    useSegments();


  const {
    user,
    isAuthenticated,
  } =
    useAuth();


  const [
    isNavigationReady,
    setIsNavigationReady,
  ] = useState(false);


  useEffect(
    () => {


      /*
       * Get the current top-level
       * route segment.
       */

      const isInsideAuth =
        segments[0] ===
        'auth';


      /*
       * CUSTOMER IS NOT
       * AUTHENTICATED.
       *
       * Keep the customer inside
       * the authentication flow.
       */

      if (
        !isAuthenticated
      ) {

        if (
          !isInsideAuth &&
          segments[0] !== 'splash'
        ) {

          router.replace(
            '/splash'
          );

          return;

        }


        setIsNavigationReady(true);

        return;

      }


      /*
       * AUTHENTICATED CUSTOMER.
       *
       * Decide where the customer
       * should go based on KYC
       * status.
       */

      if (
        !user
      ) {

        setIsNavigationReady(true);

        return;

      }


      /*
       * KYC NOT STARTED.
       */

      if (
        user.kycStatus ===
        'NOT_STARTED'
      ) {

        if (
          !isInsideAuth
        ) {

          router.replace(
            '/auth/kyc/introduction'
          );

          return;

        }


        setIsNavigationReady(true);

        return;

      }


      /*
       * KYC IN PROGRESS.
       */

      if (
        user.kycStatus ===
        'IN_PROGRESS'
      ) {

        if (
          !isInsideAuth
        ) {

          router.replace(
            '/auth/kyc/introduction'
          );

          return;

        }


        setIsNavigationReady(true);

        return;

      }


      /*
       * KYC REJECTED.
       */

      if (
        user.kycStatus ===
        'REJECTED'
      ) {

        if (
          !isInsideAuth
        ) {

          router.replace(
            '/auth/kyc/introduction'
          );

          return;

        }


        setIsNavigationReady(true);

        return;

      }


      /*
       * KYC submitted or verified.
       *
       * Customers can use the app
       * while submitted KYC is under
       * review.
       */

      if (
        user.kycStatus ===
        'SUBMITTED'
        ||
        user.kycStatus ===
        'VERIFIED'
      ) {

        if (
          isInsideAuth
        ) {

          router.replace(
            '/'
          );

          return;

        }

      }
        setIsNavigationReady(true);



    },
    [
      isAuthenticated,
      user,
      segments,
      router,
    ]
  );


  if (
    !isNavigationReady
  ) {

    return null;

  }


  return (

    <Stack
      screenOptions={{
        headerShown:
          false,
      }}
    >


      {/* SPLASH + HOME */}

      <Stack.Screen
        name="splash"
      />

      <Stack.Screen
        name="index"
      />


      {/* AUTHENTICATION */}

      <Stack.Screen
        name="auth/welcome"
      />

      <Stack.Screen
        name="auth/login"
      />

      <Stack.Screen
        name="auth/signup"
      />

      <Stack.Screen
        name="auth/otp"
      />


      {/* KYC */}

      <Stack.Screen
        name="auth/kyc/introduction"
      />

      <Stack.Screen
        name="auth/kyc/personal-details"
      />

      <Stack.Screen
        name="auth/kyc/pan-details"
      />

      <Stack.Screen
        name="auth/kyc/document-choice"
      />

      <Stack.Screen
        name="auth/kyc/document-selection"
      />

      <Stack.Screen
        name="auth/kyc/document-details"
      />

      <Stack.Screen
        name="auth/kyc/document-capture"
      />

      <Stack.Screen
        name="auth/kyc/selfie-introduction"
      />

      <Stack.Screen
        name="auth/kyc/selfie-camera"
      />

      <Stack.Screen
        name="auth/kyc/selfie-review"
      />

      <Stack.Screen
        name="auth/kyc/kyc-submitted"
      />


      {/* BUY GOLD FLOW */}

      <Stack.Screen
        name="buy"
      />

      <Stack.Screen
        name="buy-review-order"
      />

      <Stack.Screen
        name="review-order"
      />

      <Stack.Screen
        name="payment"
      />

      <Stack.Screen
        name="payment-success"
      />


      {/* WALLET */}

      <Stack.Screen
        name="wallet"
      />


      {/* TRANSACTION DETAILS */}

      <Stack.Screen
        name="transaction-details"
      />


      {/* SELL GOLD FLOW */}

      <Stack.Screen
        name="sell"
      />

      <Stack.Screen
        name="sell-review"
      />

      <Stack.Screen
        name="sell-success"
      />


      {/* REDEMPTION FLOW */}

      <Stack.Screen
        name="redeem"
      />

      <Stack.Screen
        name="product-details"
      />

      <Stack.Screen
        name="review-redemption"
      />

      <Stack.Screen
        name="redemption-success"
      />


      {/* OTHER AURUMPAY FEATURES */}

      <Stack.Screen
        name="pay"
      />

      <Stack.Screen
        name="loan"
      />


    </Stack>

  );

}


export default function RootLayout() {

  return (

    <AuthProvider>

      <WalletProvider>

        <RootNavigator />

      </WalletProvider>

    </AuthProvider>

  );

}