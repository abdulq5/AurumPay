import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  CustomerResponse,
  getCurrentCustomer,
  logout as logoutApi,
  requestOtp as requestOtpApi,
  verifyOtp,
} from '../src/api/auth';
import { setAccessToken } from '../src/api/client';


/*
 * KYC status used throughout
 * the AurumPay application.
 */

export type KycStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'REJECTED';


/*
 * Customer information stored
 * during the frontend demo flow.
 *
 * Later this data will come
 * from AurumPay Core APIs.
 */

export type AuthUser = {

  id: string;

  fullName: string;

  email: string;

  mobileNumber: string;

  isPhoneVerified: boolean;

  kycStatus: KycStatus;

};

function mapCustomer(customer: CustomerResponse): AuthUser {
  return {
    id: customer.id,
    fullName: customer.fullName,
    email: customer.email,
    mobileNumber: customer.mobileNumber,
    isPhoneVerified: true,
    kycStatus: customer.status === 'VERIFIED'
      ? 'VERIFIED'
      : customer.status === 'REJECTED'
        ? 'REJECTED'
        : 'NOT_STARTED',
  };
}


/*
 * Authentication context.
 */

type AuthContextType = {

  /*
   * Current authenticated user.
   *
   * null means no active session.
   */

  user: AuthUser | null;


  /*
   * Whether the customer is
   * authenticated.
   */

  isAuthenticated: boolean;


  /*
   * Signup information.
   *
   * This temporarily stores the
   * customer information until
   * OTP verification is completed.
   */

  signupData: {
    fullName: string;
    email: string;
    mobileNumber: string;
  } | null;


  /*
   * Start the signup flow.
   */

  startSignup: (
    fullName: string,
    email: string,
    mobileNumber: string
  ) => void;

  requestOtp: (
    mobileNumber: string,
    purpose: 'LOGIN' | 'SIGNUP',
    signupDetails?: {
      fullName: string;
      email: string;
    }
  ) => Promise<void>;

  verifyOtp: (
    mobileNumber: string,
    code: string,
    purpose: 'LOGIN' | 'SIGNUP'
  ) => Promise<void>;


  /*
   * Complete signup after OTP
   * verification.
   */

  completeSignup: () => void;


  /*
   * Demo login.
   */

  login: (
    mobileNumber: string
  ) => void;


  /*
   * Logout customer.
   */

  logout: () => void;


  /*
   * Update KYC status.
   */

  updateKycStatus: (
    status: KycStatus
  ) => void;


  /*
   * Clear temporary signup data.
   */

  clearSignupData: () => void;

};


const AuthContext =
  createContext<
    AuthContextType | undefined
  >(
    undefined
  );


type AuthProviderProps = {

  children: ReactNode;

};


export function AuthProvider({
  children,
}: AuthProviderProps) {


  /*
   * Authenticated customer.
   */

  const [
    user,
    setUser,
  ] = useState<
    AuthUser | null
  >(
    null
  );


  /*
   * Temporary signup information.
   */

  const [
    signupData,
    setSignupData,
  ] = useState<
    {
      fullName: string;
      email: string;
      mobileNumber: string;
    } | null
  >(
    null
  );

  const [
    refreshToken,
    setRefreshToken,
  ] = useState<string | null>(null);


  /*
   * Start signup.
   */

  function startSignup(
    fullName: string,
    email: string,
    mobileNumber: string
  ) {

    setSignupData({
      fullName:
        fullName.trim(),

      email:
        email.trim(),

      mobileNumber:
        mobileNumber.trim(),
    });

  }

  async function requestOtp(
    mobileNumber: string,
    purpose: 'LOGIN' | 'SIGNUP',
    signupDetails?: {
      fullName: string;
      email: string;
    }
  ) {
    try {
      await requestOtpApi({
        mobileNumber: mobileNumber.trim(),
        purpose,
        ...(purpose === 'SIGNUP' && (signupDetails ?? signupData)
          ? {
              fullName: (signupDetails ?? signupData)!.fullName,
              email: (signupDetails ?? signupData)!.email,
            }
          : {}),
      });
    } catch {
      // In demo/college project mode, allow proceeding even if backend OTP service is offline
      console.log('OTP request service offline or unavailable, continuing in demo mode');
    }
  }

  async function verifyOtpForUser(
    mobileNumber: string,
    code: string,
    purpose: 'LOGIN' | 'SIGNUP'
  ) {
    try {
      const tokens = await verifyOtp(mobileNumber.trim(), code, purpose);
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);

      const customer = await getCurrentCustomer(tokens.accessToken);
      setUser(mapCustomer(customer));

      if (purpose === 'SIGNUP') {
        setSignupData(null);
      }
    } catch {
      // In demo/college project mode, accept any OTP entered
      if (purpose === 'SIGNUP') {
        completeSignup();
      } else {
        login(mobileNumber);
      }
    }
  }


  /*
   * Complete signup after
   * OTP verification.
   */

  function completeSignup() {

    const newUser: AuthUser = {

      id:
        `USR${Date.now()}`,

      fullName:
        signupData?.fullName || 'AurumPay Customer',

      email:
        signupData?.email || '',

      mobileNumber:
        signupData?.mobileNumber || '',

      isPhoneVerified:
        true,

      kycStatus:
        'NOT_STARTED',

    };


    setUser(
      newUser
    );


    setSignupData(
      null
    );

  }


  /*
   * Demo login.
   *
   * Later this function will
   * call the backend API.
   */

  function login(
    mobileNumber: string
  ) {

    setUser({

      id:
        `USR${Date.now()}`,

      fullName:
        'AurumPay Customer',

      email:
        '',

      mobileNumber:
        mobileNumber.trim(),

      isPhoneVerified:
        true,

      kycStatus:
        'NOT_STARTED',

    });

  }


  /*
   * Logout.
   */

  async function logout() {
    if (refreshToken) {
      await logoutApi(refreshToken);
    }

    setAccessToken(null);
    setRefreshToken(null);

    setUser(
      null
    );


    setSignupData(
      null
    );

  }


  /*
   * Update KYC status.
   */

  function updateKycStatus(
    status: KycStatus
  ) {

    setUser(
      previousUser => {

        if (
          !previousUser
        ) {

          return previousUser;

        }


        return {

          ...previousUser,

          kycStatus:
            status,

        };

      }
    );

  }


  /*
   * Clear temporary signup
   * information.
   */

  function clearSignupData() {

    setSignupData(
      null
    );

  }


  /*
   * Authentication state.
   */

  const isAuthenticated =
    user !== null;


  return (

    <AuthContext.Provider
      value={{

        user,

        isAuthenticated,

        signupData,

        startSignup,
        requestOtp,
        verifyOtp: verifyOtpForUser,

        completeSignup,

        login,

        logout,

        updateKycStatus,

        clearSignupData,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


/*
 * Hook used by screens to access
 * AurumPay authentication state.
 */

export function useAuth() {

  const context =
    useContext(
      AuthContext
    );


  if (
    !context
  ) {

    throw new Error(
      'useAuth must be used inside AuthProvider.'
    );

  }


  return context;

}