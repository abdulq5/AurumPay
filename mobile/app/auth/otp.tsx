import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useAuth,
} from '../../context/AuthContext';
import { colors } from '../../src/theme/colors';

const { gold, navy, pageBackground, dangerRed } = colors;


export default function OtpScreen() {


  const router =
    useRouter();


  const {
    mode,
    mobileNumber,
  } =
    useLocalSearchParams<{
      mode?: string;
      mobileNumber?: string;
    }>();


  const {
    completeSignup,
    login,
    signupData,
    verifyOtp,
  } =
    useAuth();


  /*
   * OTP state.
   *
   * AurumPay currently uses a
   * 6-digit OTP interface.
   */

  const [
    otp,
    setOtp,
  ] = useState(
      [
        '',
        '',
        '',
        '',
        '',
        '',
      ]
    );


  /*
   * Demo countdown for resend OTP.
   */

  const [
    secondsRemaining,
    setSecondsRemaining,
  ] =
    useState(
      30
    );


  /*
   * Loading state while OTP is
   * being verified.
   */

  const [
    isVerifying,
    setIsVerifying,
  ] =
    useState(
      false
    );


  /*
   * References for automatically
   * moving between OTP boxes.
   */

  const inputRefs =
    useRef<
      Array<
        TextInput | null
      >
    >(
      []
    );


  /*
   * Determine whether this OTP
   * screen was opened from signup
   * or login.
   */

  const isSignup =
    mode?.toUpperCase() ===
    'SIGNUP';


  /*
   * Mobile number.
   *
   * For signup, we prefer the
   * value stored in AuthContext.
   *
   * For login, the value comes
   * from route parameters.
   */

  const displayMobileNumber =
    signupData?.mobileNumber ??
    mobileNumber ??
    '';


  /*
   * Countdown timer.
   */

  useEffect(
    () => {

      if (
        secondsRemaining <=
        0
      ) {

        return;

      }


      const timer =
        setTimeout(
          () => {

            setSecondsRemaining(
              previousSeconds =>
                previousSeconds -
                1
            );

          },
          1000
        );


      return () =>
        clearTimeout(
          timer
        );

    },
    [
      secondsRemaining,
    ]
  );


  /*
   * Automatically focus the first
   * OTP input when the screen
   * opens.
   */

  useEffect(
    () => {

      const timer =
        setTimeout(
          () => {

            inputRefs.current[
              0
            ]?.focus();

          },
          300
        );


      return () =>
        clearTimeout(
          timer
        );

    },
    []
  );


  /*
   * Update a single OTP digit.
   */

  function handleOtpChange(
    value: string,
    index: number
  ) {


    /*
     * Keep only numeric input.
     */

    const numericValue =
      value.replace(
        /[^0-9]/g,
        ''
      );


    /*
     * Handle OTP pasted into
     * the first or any OTP box.
     */

    if (
      numericValue.length >
      1
    ) {

      const pastedDigits =
        numericValue
          .slice(
            0,
            6
          )
          .split(
            ''
          );


      const updatedOtp =
        [
          ...otp,
        ];


      pastedDigits.forEach(
        (
          digit,
          digitIndex
        ) => {

          const targetIndex =
            index +
            digitIndex;


          if (
            targetIndex <
            6
          ) {

            updatedOtp[
              targetIndex
            ] =
              digit;

          }

        }
      );


      setOtp(
        updatedOtp
      );


      const lastFilledIndex =
        Math.min(
          index +
          pastedDigits.length,
          6
        );


      if (
        lastFilledIndex <
        6
      ) {

        inputRefs.current[
          lastFilledIndex
        ]?.focus();

      } else {

        Keyboard.dismiss();

      }


      return;

    }


    const updatedOtp =
      [
        ...otp,
      ];


    updatedOtp[
      index
    ] =
      numericValue;


    setOtp(
      updatedOtp
    );


    /*
     * Move to the next box when
     * a digit is entered.
     */

    if (
      numericValue &&
      index <
      5
    ) {

      inputRefs.current[
        index +
        1
      ]?.focus();

    }

  }


  /*
   * Handle backspace navigation.
   */

  function handleKeyPress(
    key: string,
    index: number
  ) {

    if (
      key ===
      'Backspace' &&
      !otp[index] &&
      index >
      0
    ) {

      inputRefs.current[
        index -
        1
      ]?.focus();

    }

  }


  /*
   * Verify OTP.
   *
   * For the current frontend demo,
   * any 6-digit OTP is accepted.
   *
   * Later this will call the
   * AurumPay authentication API.
   */

  async function handleVerifyOtp() {


    const enteredOtp =
      otp.join(
        ''
      );


    if (
      enteredOtp.length !==
      6
    ) {

      Alert.alert(
        'Enter OTP',
        'Please enter the complete 6-digit OTP.'
      );


      return;

    }


    setIsVerifying(
      true
    );


    try {
      await verifyOtp(
        displayMobileNumber,
        enteredOtp,
        isSignup ? 'SIGNUP' : 'LOGIN',
      );

      setIsVerifying(
        false
      );

      /*
       * SIGNUP FLOW
       */
      if (isSignup) {
        /*
         * New customers continue
         * directly to KYC.
         */
        router.replace(
          '/auth/kyc/introduction'
        );
        return;
      }

      /*
       * LOGIN FLOW
       */
      router.replace(
        '/'
      );
    } catch {
      setIsVerifying(false);
      // Fallback for demo / college project mode
      if (isSignup) {
        completeSignup();
        router.replace(
          '/auth/kyc/introduction'
        );
      } else {
        login(displayMobileNumber);
        router.replace(
          '/'
        );
      }
    }

  }


  /*
   * Resend OTP.
   */

  function handleResendOtp() {


    if (
      secondsRemaining >
      0
    ) {

      return;

    }


    /*
     * Clear existing OTP.
     */

    setOtp(
      [
        '',
        '',
        '',
        '',
        '',
        '',
      ]
    );


    /*
     * Restart countdown.
     */

    setSecondsRemaining(
      30
    );


    /*
     * Focus first OTP input.
     */

    setTimeout(
      () => {

        inputRefs.current[
          0
        ]?.focus();

      },
      100
    );


    Alert.alert(
      'OTP Sent',
      'A new verification code has been sent to your mobile number.'
    );

  }


  /*
   * Format mobile number for
   * customer display.
   */

  function formatMobileNumber(
    number: string
  ) {

    if (
      !number
    ) {

      return
        'your mobile number';

    }


    const cleanNumber =
      number.replace(
        /\s/g,
        ''
      );


    if (
      cleanNumber.length <=
      4
    ) {

      return cleanNumber;

    }


    const lastFourDigits =
      cleanNumber.slice(
        -4
      );


    return (
      `••••••${lastFourDigits}`
    );

  }


  return (

    <View
      style={
        s.page
      }
    >


      <Stack.Screen
        options={{
          headerShown:
            false,
        }}
      />


      <View
        style={
          s.content
        }
      >


        {/* BACK BUTTON */}

        <TouchableOpacity
          style={
            s.backButton
          }
          activeOpacity={
            0.8
          }
          onPress={() =>
            router.back()
          }
        >

          <Text
            style={
              s.backArrow
            }
          >
            ‹
          </Text>

        </TouchableOpacity>


        {/* BRAND */}

        <View
          style={
            s.brandContainer
          }
        >

          <View
            style={
              s.logoCircle
            }
          >

            <Text
              style={
                s.logoText
              }
            >
              A
            </Text>

          </View>


          <Text
            style={
              s.brandName
            }
          >
            AurumPay
          </Text>

        </View>


        {/* HEADER */}

        <Text
          style={
            s.title
          }
        >
          Verify your number
        </Text>


        <Text
          style={
            s.subtitle
          }
        >
          We sent a 6-digit
          verification code to
        </Text>


        <Text
          style={
            s.mobileNumber
          }
        >
          {
            formatMobileNumber(
              displayMobileNumber
            )
          }
        </Text>


        {/* OTP INPUT */}

        <View
          style={
            s.otpContainer
          }
        >

          {
            otp.map(
              (
                digit,
                index
              ) => (

                <TextInput
                  key={
                    index
                  }
                  ref={
                    element => {

                      inputRefs.current[
                        index
                      ] =
                        element;

                    }
                  }
                  value={
                    digit
                  }
                  onChangeText={
                    value =>
                      handleOtpChange(
                        value,
                        index
                      )
                  }
                  onKeyPress={
                    event =>
                      handleKeyPress(
                        event
                          .nativeEvent
                          .key,
                        index
                      )
                  }
                  style={[
                    s.otpInput,

                    digit
                      ? s.otpInputFilled
                      : null,
                  ]}
                  keyboardType={
                    'number-pad'
                  }
                  maxLength={
                    6
                  }
                  textAlign={
                    'center'
                  }
                  selectTextOnFocus={
                    true
                  }
                />

              )
            )
          }

        </View>


        {/* RESEND */}

        <View
          style={
            s.resendContainer
          }
        >

          {
            secondsRemaining >
            0

              ? (

                <Text
                  style={
                    s.resendWaitingText
                  }
                >
                  Resend code in{' '}

                  <Text
                    style={
                      s.countdownText
                    }
                  >
                    00:
                    {
                      secondsRemaining
                        .toString()
                        .padStart(
                          2,
                          '0'
                        )
                    }
                  </Text>

                </Text>

              )

              : (

                <TouchableOpacity
                  activeOpacity={
                    0.8
                  }
                  onPress={
                    handleResendOtp
                  }
                >

                  <Text
                    style={
                      s.resendButtonText
                    }
                  >
                    Resend OTP
                  </Text>

                </TouchableOpacity>

              )
          }

        </View>


        {/* VERIFY BUTTON */}

        <TouchableOpacity
          style={[
            s.verifyButton,

            isVerifying
              ? s.verifyButtonDisabled
              : null,
          ]}
          activeOpacity={
            0.85
          }
          disabled={
            isVerifying
          }
          onPress={
            handleVerifyOtp
          }
        >

          <Text
            style={
              s.verifyButtonText
            }
          >
            {
              isVerifying

                ? 'Verifying...'

                : 'Verify & Continue'
            }
          </Text>

        </TouchableOpacity>


        {/* DEMO INFORMATION */}

        <View
          style={
            s.demoCard
          }
        >

          <Text
            style={
              s.demoTitle
            }
          >
            Demo verification
          </Text>


          <Text
            style={
              s.demoText
            }
          >
            For the current AurumPay
            demo, enter any 6-digit
            OTP to continue.
          </Text>

        </View>


        {/* SECURITY NOTE */}

        <Text
          style={
            s.securityText
          }
        >
          For your security, never
          share your OTP with anyone.
          AurumPay will never ask for
          your verification code.
        </Text>


      </View>

    </View>

  );

}


const s =
  StyleSheet.create({


    /*
     * PAGE
     */

    page: {
      flex: 1,

      backgroundColor:
        pageBackground,
    },


    content: {
      flex: 1,

      paddingHorizontal:
        24,

      paddingTop:
        56,
    },


    /*
     * BACK
     */

    backButton: {
      width: 44,

      height: 44,

      borderRadius: 22,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFFFFF',

      borderWidth: 1,

      borderColor:
        '#E7E9EC',
    },


    backArrow: {
      marginTop: -4,

      fontSize: 34,

      lineHeight: 34,

      fontWeight:
        '400',

      color: navy,
    },


    /*
     * BRAND
     */

    brandContainer: {
      marginTop: 38,

      flexDirection:
        'row',

      alignItems:
        'center',
    },


    logoCircle: {
      width: 42,

      height: 42,

      borderRadius: 21,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor: gold,
    },


    logoText: {
      fontSize: 22,

      fontWeight:
        '900',

      color: navy,
    },


    brandName: {
      marginLeft: 11,

      fontSize: 22,

      fontWeight:
        '800',

      color: navy,
    },


    /*
     * HEADER
     */

    title: {
      marginTop: 44,

      fontSize: 30,

      fontWeight:
        '800',

      color: navy,
    },


    subtitle: {
      marginTop: 12,

      fontSize: 15,

      lineHeight: 22,

      color:
        '#667085',
    },


    mobileNumber: {
      marginTop: 4,

      fontSize: 15,

      fontWeight:
        '800',

      color: navy,
    },


    /*
     * OTP
     */

    otpContainer: {
      marginTop: 42,

      flexDirection:
        'row',

      justifyContent:
        'space-between',

      gap: 8,
    },


    otpInput: {
      flex: 1,

      height: 56,

      borderRadius: 14,

      borderWidth: 1.5,

      borderColor:
        '#D0D5DD',

      backgroundColor:
        '#FFFFFF',

      fontSize: 22,

      fontWeight:
        '800',

      color: navy,
    },


    otpInputFilled: {
      borderColor: gold,

      backgroundColor:
        '#FFFDF7',
    },


    /*
     * RESEND
     */

    resendContainer: {
      marginTop: 24,

      alignItems:
        'center',
    },


    resendWaitingText: {
      fontSize: 13,

      color:
        '#667085',
    },


    countdownText: {
      fontWeight:
        '800',

      color: navy,
    },


    resendButtonText: {
      fontSize: 14,

      fontWeight:
        '800',

      color: gold,
    },


    /*
     * VERIFY BUTTON
     */

    verifyButton: {
      height: 58,

      marginTop: 34,

      borderRadius: 16,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor: gold,
    },


    verifyButtonDisabled: {
      opacity: 0.65,
    },


    verifyButtonText: {
      fontSize: 16,

      fontWeight:
        '800',

      color: navy,
    },


    /*
     * DEMO
     */

    demoCard: {
      marginTop: 28,

      padding: 16,

      borderRadius: 16,

      backgroundColor:
        '#FFF8E8',

      borderWidth: 1,

      borderColor:
        '#F3E3B5',
    },


    demoTitle: {
      fontSize: 13,

      fontWeight:
        '800',

      color:
        '#8B6A1C',
    },


    demoText: {
      marginTop: 5,

      fontSize: 12,

      lineHeight: 18,

      color:
        '#667085',
    },


    /*
     * SECURITY
     */

    securityText: {
      marginTop: 26,

      paddingHorizontal: 14,

      textAlign:
        'center',

      fontSize: 11,

      lineHeight: 17,

      color:
        '#98A2B3',
    },

  });