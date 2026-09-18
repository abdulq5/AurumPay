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

const { gold, navy, pageBackground, dangerRed } = colors;


export default function SignupScreen() {
  const router =
    useRouter();


  const {
    startSignup,
    requestOtp,
  } =
    useAuth();


  /*
   * Form state.
   */

  const [
    fullName,
    setFullName,
  ] =
    useState(
      ''
    );


  const [
    email,
    setEmail,
  ] =
    useState(
      ''
    );


  const [
    mobileNumber,
    setMobileNumber,
  ] =
    useState(
      ''
    );


  const [
    password,
    setPassword,
  ] =
    useState(
      ''
    );


  const [
    confirmPassword,
    setConfirmPassword,
  ] =
    useState(
      ''
    );


  /*
   * Password visibility.
   */

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(
      false
    );


  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] =
    useState(
      false
    );


  /*
   * Error message.
   */

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState(
      ''
    );


  /*
   * Validate email.
   */

  function isValidEmail(
    value: string
  ) {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailPattern.test(
      value.trim()
    );

  }


  /*
   * Validate mobile number.
   *
   * Demo currently expects
   * a 10-digit Indian number.
   */

  function isValidMobileNumber(
    value: string
  ) {

    const cleanedNumber =
      value.replace(
        /\D/g,
        ''
      );


    return cleanedNumber.length ===
      10;

  }


  /*
   * Continue to OTP verification.
   */

  async function handleCreateAccount() {


    setErrorMessage(
      ''
    );


    /*
     * Full name validation.
     */

    if (
      fullName.trim().length <
      2
    ) {

      setErrorMessage(
        'Please enter your full name.'
      );

      return;

    }


    /*
     * Email validation.
     */

    if (
      !isValidEmail(
        email
      )
    ) {

      setErrorMessage(
        'Please enter a valid email address.'
      );

      return;

    }


    /*
     * Mobile validation.
     */

    if (
      !isValidMobileNumber(
        mobileNumber
      )
    ) {

      setErrorMessage(
        'Please enter a valid 10-digit mobile number.'
      );

      return;

    }


    /*
     * Password validation.
     */

    if (
      password.length <
      6
    ) {

      setErrorMessage(
        'Password must contain at least 6 characters.'
      );

      return;

    }


    /*
     * Password confirmation.
     */

    if (
      password !==
      confirmPassword
    ) {

      setErrorMessage(
        'Passwords do not match.'
      );

      return;

    }


    /*
     * Clean mobile number.
     */

    const cleanedMobileNumber =
      mobileNumber.replace(
        /\D/g,
        ''
      );


    /*
     * Store signup information
     * temporarily in AuthContext.
     *
     * Password is intentionally
     * not stored in the frontend
     * demo AuthContext.
     *
     * In production, password
     * handling must be done
     * securely by the backend.
     */

    startSignup(

      fullName,

      email,

      cleanedMobileNumber

    );


    /*
     * Continue to OTP verification.
     */

    try {
      await requestOtp(cleanedMobileNumber, 'SIGNUP', {
        fullName: fullName.trim(),
        email: email.trim(),
      });
    } catch {
      // Backend offline / demo mode
    }

    router.push({
      pathname:
        '/auth/otp',

      params: {

        mode:
          'SIGNUP',

        mobileNumber:
          cleanedMobileNumber,

      },
    });

  }


  /*
   * Go to login.
   */

  function handleLogin() {

    router.replace(
      '/login'
    );

  }


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
            true,

          title:
            'Create Account',

          headerStyle: {
            backgroundColor:
              pageBackground,
          },

          headerShadowVisible:
            false,
        }}

      />


      <ScrollView
        contentContainerStyle={
          s.content
        }

        showsVerticalScrollIndicator={
          false
        }

        keyboardShouldPersistTaps=
          "handled"

      >


        {/* HEADER */}

        <View
          style={
            s.header
          }
        >

          <Text
            style={
              s.title
            }
          >
            Create your AurumPay account
          </Text>


          <Text
            style={
              s.subtitle
            }
          >
            Start managing your digital
            gold and access AurumPay
            services securely.
          </Text>

        </View>


        {/* FORM CARD */}

        <View
          style={
            s.formCard
          }
        >


          {/* FULL NAME */}

          <Text
            style={
              s.label
            }
          >
            Full name
          </Text>


          <TextInput

            style={
              s.input
            }

            value={
              fullName
            }

            onChangeText={
              setFullName
            }

            placeholder=
              "Enter your full name"

            placeholderTextColor=
              "#98A2B3"

            autoCapitalize=
              "words"

          />


          {/* EMAIL */}

          <Text
            style={[
              s.label,
              s.labelSpacing,
            ]}
          >
            Email address
          </Text>


          <TextInput
            style={
              s.input
            }
            value={
              email
            }
            onChangeText={
              setEmail
            }
            placeholder=
              "Enter your email address"
            placeholderTextColor=
              "#98A2B3"
            keyboardType=
              "email-address"
            autoCapitalize=
              "none"
            autoCorrect={
              false
            }
          />


          {/* MOBILE */}

          <Text
            style={[
              s.label,
              s.labelSpacing,
            ]}
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
                s.countryCode
              }
            >

              <Text
                style={
                  s.countryCodeText
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
                setMobileNumber
              }

              placeholder=
                "Enter mobile number"

              placeholderTextColor=
                "#98A2B3"

              keyboardType=
                "phone-pad"

              maxLength={
                10
              }

            />

          </View>


          {/* PASSWORD */}

          <Text
            style={[
              s.label,
              s.labelSpacing,
            ]}
          >
            Password
          </Text>


          <View
            style={
              s.passwordContainer
            }
          >

            <TextInput

              style={
                s.passwordInput
              }

              value={
                password
              }

              onChangeText={
                setPassword
              }

              placeholder=
                "Create a password"

              placeholderTextColor=
                "#98A2B3"

              secureTextEntry={
                !showPassword
              }

              autoCapitalize=
                "none"

              autoCorrect={
                false
              }

            />


            <TouchableOpacity

              style={
                s.passwordToggle
              }

              onPress={() =>
                setShowPassword(
                  previous =>
                    !previous
                )
              }

            >

              <Text
                style={
                  s.passwordToggleText
                }
              >
                {
                  showPassword

                    ? 'Hide'

                    : 'Show'
                }
              </Text>

            </TouchableOpacity>

          </View>


          {/* CONFIRM PASSWORD */}

          <Text
            style={[
              s.label,
              s.labelSpacing,
            ]}
          >
            Confirm password
          </Text>


          <View
            style={
              s.passwordContainer
            }
          >

            <TextInput

              style={
                s.passwordInput
              }

              value={
                confirmPassword
              }

              onChangeText={
                setConfirmPassword
              }

              placeholder=
                "Re-enter your password"

              placeholderTextColor=
                "#98A2B3"

              secureTextEntry={
                !showConfirmPassword
              }

              autoCapitalize=
                "none"

              autoCorrect={
                false
              }

            />


            <TouchableOpacity

              style={
                s.passwordToggle
              }

              onPress={() =>
                setShowConfirmPassword(
                  previous =>
                    !previous
                )
              }

            >

              <Text
                style={
                  s.passwordToggleText
                }
              >
                {
                  showConfirmPassword

                    ? 'Hide'

                    : 'Show'
                }
              </Text>

            </TouchableOpacity>

          </View>


          {/* PASSWORD NOTE */}

          <Text
            style={
              s.passwordNote
            }
          >
            Use at least 6 characters.
          </Text>


          {/* ERROR */}

          {
            errorMessage

              ? (

                <View
                  style={
                    s.errorBox
                  }
                >

                  <Text
                    style={
                      s.errorText
                    }
                  >
                    {
                      errorMessage
                    }
                  </Text>

                </View>

              )

              : null
          }


          {/* CREATE ACCOUNT */}

          <TouchableOpacity

            activeOpacity={
              0.85
            }

            style={
              s.createButton
            }

            onPress={
              handleCreateAccount
            }

          >

            <Text
              style={
                s.createButtonText
              }
            >
              Continue
            </Text>

          </TouchableOpacity>


        </View>


        {/* LOGIN */}

        <View
          style={
            s.loginRow
          }
        >

          <Text
            style={
              s.loginText
            }
          >
            Already have an account?
          </Text>


          <TouchableOpacity
            onPress={
              handleLogin
            }
          >

            <Text
              style={
                s.loginLink
              }
            >
              Sign in
            </Text>

          </TouchableOpacity>

        </View>


        {/* SECURITY NOTE */}

        <View
          style={
            s.securityCard
          }
        >

          <Text
            style={
              s.securityTitle
            }
          >
            Your security matters
          </Text>


          <Text
            style={
              s.securityText
            }
          >
            AurumPay uses verification
            and KYC checks to help
            protect your account and
            transactions.
          </Text>

        </View>


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
      padding:
        20,

      paddingBottom:
        40,
    },


    /*
     * HEADER
     */

    header: {
      marginTop:
        10,
    },


    brandIcon: {
      width:
        48,

      height:
        48,

      borderRadius:
        24,

      backgroundColor:
        gold,

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    brandIconText: {
      fontSize:
        24,

      fontWeight:
        '900',

      color:
        navy,
    },


    title: {
      marginTop:
        20,

      fontSize:
        28,

      lineHeight:
        35,

      fontWeight:
        '900',

      color:
        navy,
    },


    subtitle: {
      marginTop:
        10,

      fontSize:
        15,

      lineHeight:
        22,

      color:
        '#667085',
    },


    /*
     * FORM
     */

    formCard: {
      marginTop:
        28,

      padding:
        20,

      borderRadius:
        22,

      backgroundColor:
        '#FFFFFF',

      borderWidth:
        1,

      borderColor:
        '#E7E9EC',
    },


    label: {
      fontSize:
        13,

      fontWeight:
        '800',

      color:
        navy,
    },


    labelSpacing: {
      marginTop:
        20,
    },


    input: {
      marginTop:
        8,

      height:
        54,

      borderRadius:
        14,

      borderWidth:
        1,

      borderColor:
        '#D0D5DD',

      paddingHorizontal:
        15,

      fontSize:
        15,

      color:
        navy,

      backgroundColor:
        '#FFFFFF',
    },


    /*
     * MOBILE
     */

    mobileInputContainer: {
      marginTop:
        8,

      height:
        54,

      flexDirection:
        'row',

      alignItems:
        'center',

      borderWidth:
        1,

      borderColor:
        '#D0D5DD',

      borderRadius:
        14,

      overflow:
        'hidden',
    },


    countryCode: {
      height:
        '100%',

      paddingHorizontal:
        15,

      justifyContent:
        'center',

      backgroundColor:
        '#F7F8FA',

      borderRightWidth:
        1,

      borderRightColor:
        '#E7E9EC',
    },


    countryCodeText: {
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

      height:
        '100%',

      paddingHorizontal:
        14,

      fontSize:
        15,

      color:
        navy,
    },


    /*
     * PASSWORD
     */

    passwordContainer: {
      marginTop:
        8,

      height:
        54,

      flexDirection:
        'row',

      alignItems:
        'center',

      borderWidth:
        1,

      borderColor:
        '#D0D5DD',

      borderRadius:
        14,

      backgroundColor:
        '#FFFFFF',
    },


    passwordInput: {
      flex:
        1,

      height:
        '100%',

      paddingHorizontal:
        15,

      fontSize:
        15,

      color:
        navy,
    },


    passwordToggle: {
      paddingHorizontal:
        15,

      height:
        '100%',

      justifyContent:
        'center',
    },


    passwordToggleText: {
      fontSize:
        13,

      fontWeight:
        '800',

      color:
        gold,
    },


    passwordNote: {
      marginTop:
        8,

      fontSize:
        11,

      color:
        '#98A2B3',
    },


    /*
     * ERROR
     */

    errorBox: {
      marginTop:
        18,

      padding:
        12,

      borderRadius:
        12,

      backgroundColor:
        '#FEF2F2',

      borderWidth:
        1,

      borderColor:
        '#FECACA',
    },


    errorText: {
      fontSize:
        12,

      lineHeight:
        18,

      color:
        dangerRed,

      fontWeight:
        '600',
    },


    /*
     * CREATE BUTTON
     */

    createButton: {
      marginTop:
        22,

      height:
        56,

      borderRadius:
        17,

      backgroundColor:
        gold,

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    createButtonText: {
      fontSize:
        16,

      fontWeight:
        '900',

      color:
        navy,
    },


    /*
     * LOGIN
     */

    loginRow: {
      marginTop:
        22,

      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    loginText: {
      fontSize:
        13,

      color:
        '#667085',
    },


    loginLink: {
      marginLeft:
        6,

      fontSize:
        13,

      fontWeight:
        '900',

      color:
        gold,
    },


    /*
     * SECURITY
     */

    securityCard: {
      marginTop:
        28,

      padding:
        18,

      borderRadius:
        18,

      backgroundColor:
        '#EEF4FF',
    },


    securityTitle: {
      fontSize:
        14,

      fontWeight:
        '900',

      color:
        navy,
    },


    securityText: {
      marginTop:
        7,

      fontSize:
        12,

      lineHeight:
        19,

      color:
        '#475467',
    },


  });