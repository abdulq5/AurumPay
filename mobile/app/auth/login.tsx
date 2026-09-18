import {
  Stack,
  useRouter,
} from 'expo-router';

import {
  KeyboardAvoidingView,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useState,
} from 'react';

import {
  useAuth,
} from '../../context/AuthContext';
import { colors } from '../../src/theme/colors';

const { gold, navy, pageBackground } = colors;


export default function LoginScreen() {


  const router =
    useRouter();

  const {
    requestOtp,
  } = useAuth();


  const [
    mobileNumber,
    setMobileNumber,
  ] =
    useState(
      ''
    );


  /*
   * Keep only numeric
   * characters in the
   * mobile number field.
   */

  function handleMobileChange(
    value:
      string
  ) {

    const cleanedValue =
      value.replace(
        /[^0-9]/g,
        ''
      );


    setMobileNumber(
      cleanedValue
    );

  }


  /*
   * Continue to OTP verification.
   *
   * Backend OTP integration
   * will be added later.
   */

  async function handleContinue() {

    if (
      mobileNumber.length !==
      10
    ) {

      return;

    }


    try {
      await requestOtp(mobileNumber, 'LOGIN');
    } catch {
      // Backend offline / demo mode
    }

    router.push({

      pathname:
        '/auth/otp',

      params: {

        mode:
          'LOGIN',

        mobileNumber,

      },

    });

  }


  /*
   * Navigate to signup.
   */

  function handleCreateAccount() {

    router.push(
      '/signup'
    );

  }


  const isValidMobileNumber =
    mobileNumber.length ===
    10;


  return (

    <KeyboardAvoidingView

      style={
        s.page
      }

      behavior={
        Platform.OS ===
        'ios'

          ? 'padding'

          : undefined
      }

    >

      <Stack.Screen

        options={{

          headerShown:
            false,

        }}

      />


      <ScrollView

        contentContainerStyle={
          s.content
        }

        keyboardShouldPersistTaps=
          "handled"

        showsVerticalScrollIndicator={
          false
        }

      >


        {/* BRAND SECTION */}

        <View
          style={
            s.brandSection
          }
        >

          <View
            style={
              s.logoContainer
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


          <Text
            style={
              s.brandTagline
            }
          >
            Digital gold,
            made simple.
          </Text>

        </View>


        {/* LOGIN CARD */}

        <View
          style={
            s.loginCard
          }
        >

          <Text
            style={
              s.title
            }
          >
            Welcome back
          </Text>


          <Text
            style={
              s.subtitle
            }
          >
            Enter your mobile number
            to securely access your
            AurumPay account.
          </Text>


          {/* MOBILE NUMBER */}

          <Text
            style={
              s.inputLabel
            }
          >
            Mobile number
          </Text>


          <View
            style={
              s.mobileInputContainer
            }
          >

            <View
              style={
                s.countryCodeContainer
              }
            >

              <Text
                style={
                  s.countryCode
                }
              >
                +91
              </Text>

            </View>


            <TextInput

              style={
                s.mobileInput
              }

              value={
                mobileNumber
              }

              onChangeText={
                handleMobileChange
              }

              placeholder=
                "Enter mobile number"

              placeholderTextColor=
                "#98A2B3"

              keyboardType=
                "number-pad"

              maxLength={
                10
              }

            />

          </View>


          {/* CONTINUE */}

          <TouchableOpacity

            style={[

              s.continueButton,

              !isValidMobileNumber

                ? s.disabledButton

                : null,

            ]}

            onPress={
              handleContinue
            }

            disabled={
              !isValidMobileNumber
            }

            activeOpacity={
              0.85
            }

          >

            <Text
              style={
                s.continueButtonText
              }
            >
              Continue
            </Text>

          </TouchableOpacity>


          {/* SECURITY TEXT */}

          <Text
            style={
              s.securityText
            }
          >
            We'll send a secure OTP
            to verify your mobile number.
          </Text>


          {/* DIVIDER */}

          <View
            style={
              s.dividerRow
            }
          >

            <View
              style={
                s.divider
              }
            />


            <Text
              style={
                s.dividerText
              }
            >
              NEW TO AURUMPAY?
            </Text>


            <View
              style={
                s.divider
              }
            />

          </View>


          {/* CREATE ACCOUNT */}

          <TouchableOpacity

            style={
              s.createAccountButton
            }

            onPress={
              handleCreateAccount
            }

            activeOpacity={
              0.8
            }

          >

            <Text
              style={
                s.createAccountText
              }
            >
              Create an account
            </Text>

          </TouchableOpacity>

        </View>


        {/* FOOTER */}

        <Text
          style={
            s.footerText
          }
        >
          By continuing, you agree to
          AurumPay's Terms of Service
          and Privacy Policy.
        </Text>


      </ScrollView>

    </KeyboardAvoidingView>

  );

}


const s =
  StyleSheet.create({


    page: {

      flex:
        1,

      backgroundColor:
        pageBackground,

    },


    content: {

      flexGrow:
        1,

      padding:
        20,

      paddingTop:
        70,

      paddingBottom:
        35,

    },


    /*
     * BRAND
     */

    brandSection: {

      alignItems:
        'center',

      marginBottom:
        38,

    },


    logoContainer: {

      width:
        72,

      height:
        72,

      borderRadius:
        24,

      backgroundColor:
        navy,

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    logoText: {

      fontSize:
        34,

      fontWeight:
        '900',

      color:
        gold,

    },


    brandName: {

      marginTop:
        16,

      fontSize:
        28,

      fontWeight:
        '900',

      color:
        navy,

      letterSpacing:
        -0.5,

    },


    brandTagline: {

      marginTop:
        6,

      fontSize:
        14,

      color:
        '#667085',

    },


    /*
     * LOGIN CARD
     */

    loginCard: {

      backgroundColor:
        '#FFFFFF',

      borderRadius:
        28,

      padding:
        24,

      borderWidth:
        1,

      borderColor:
        '#E7E9EC',

    },


    title: {

      fontSize:
        26,

      fontWeight:
        '900',

      color:
        navy,

    },


    subtitle: {

      marginTop:
        8,

      fontSize:
        14,

      lineHeight:
        21,

      color:
        '#667085',

    },


    /*
     * INPUT
     */

    inputLabel: {

      marginTop:
        28,

      marginBottom:
        9,

      fontSize:
        13,

      fontWeight:
        '800',

      color:
        navy,

    },


    mobileInputContainer: {

      height:
        58,

      flexDirection:
        'row',

      borderWidth:
        1,

      borderColor:
        '#D0D5DD',

      borderRadius:
        16,

      backgroundColor:
        '#FFFFFF',

      overflow:
        'hidden',

    },


    countryCodeContainer: {

      width:
        58,

      justifyContent:
        'center',

      alignItems:
        'center',

      borderRightWidth:
        1,

      borderRightColor:
        '#E7E9EC',

      backgroundColor:
        '#F9FAFB',

    },


    countryCode: {

      fontSize:
        15,

      fontWeight:
        '800',

      color:
        navy,

    },


    mobileInput: {

      flex:
        1,

      paddingHorizontal:
        16,

      fontSize:
        16,

      fontWeight:
        '600',

      color:
        navy,

    },


    /*
     * BUTTON
     */

    continueButton: {

      marginTop:
        22,

      height:
        56,

      borderRadius:
        17,

      backgroundColor:
        gold,

      alignItems:
        'center',

      justifyContent:
        'center',

    },


    disabledButton: {

      opacity:
        0.45,

    },


    continueButtonText: {

      fontSize:
        16,

      fontWeight:
        '900',

      color:
        navy,

    },


    securityText: {

      marginTop:
        13,

      textAlign:
        'center',

      fontSize:
        11,

      lineHeight:
        17,

      color:
        '#98A2B3',

    },


    /*
     * DIVIDER
     */

    dividerRow: {

      marginTop:
        28,

      flexDirection:
        'row',

      alignItems:
        'center',

    },


    divider: {

      flex:
        1,

      height:
        1,

      backgroundColor:
        '#E7E9EC',

    },


    dividerText: {

      marginHorizontal:
        12,

      fontSize:
        9,

      fontWeight:
        '800',

      letterSpacing:
        0.8,

      color:
        '#98A2B3',

    },


    /*
     * CREATE ACCOUNT
     */

    createAccountButton: {

      marginTop:
        22,

      height:
        54,

      borderRadius:
        17,

      borderWidth:
        1,

      borderColor:
        '#D0D5DD',

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFFFFF',

    },


    createAccountText: {

      fontSize:
        15,

      fontWeight:
        '800',

      color:
        navy,

    },


    /*
     * FOOTER
     */

    footerText: {

      marginTop:
        28,

      textAlign:
        'center',

      fontSize:
        11,

      lineHeight:
        17,

      color:
        '#98A2B3',

    },

  });