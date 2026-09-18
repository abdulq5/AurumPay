import {
  Stack,
  useRouter,
} from 'expo-router';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../src/theme/colors';

const { gold, navy, pageBackground } = colors;


export default function WelcomeScreen() {


  const router =
    useRouter();


  /*
   * Navigate to the Signup screen.
   *
   * Actual Expo Router path:
   * app/auth/signup.tsx
   */

  function handleCreateAccount() {

    router.push(
      '/auth/signup'
    );

  }


  /*
   * Navigate to the Login screen.
   *
   * Actual Expo Router path:
   * app/auth/login.tsx
   */

  function handleSignIn() {

    router.push(
      '/auth/login'
    );

  }


  return (

    <View
      style={s.page}
    >


      <Stack.Screen
        options={{
          headerShown:
            false,
        }}
      />


      {/* TOP PREMIUM AREA */}

      <View
        style={s.hero}
      >


        {/* BRAND */}

        <View
          style={s.brandRow}
        >

          <View
            style={s.logoCircle}
          >

            <Text
              style={s.logoText}
            >
              A
            </Text>

          </View>


          <Text
            style={s.brandName}
          >
            AurumPay
          </Text>

        </View>


        {/* HERO CONTENT */}

        <View
          style={s.heroContent}
        >

          <Text
            style={s.heroEyebrow}
          >
            DIGITAL GOLD. REAL VALUE.
          </Text>


          <Text
            style={s.heroTitle}
          >
            Your gold,{'\n'}
            your financial freedom.
          </Text>


          <Text
            style={s.heroDescription}
          >
            Buy, sell, pay, redeem and
            borrow against gold — all
            in one secure experience.
          </Text>

        </View>


      </View>


      {/* BOTTOM CONTENT */}

      <View
        style={s.bottomSection}
      >


        {/* FEATURES */}

        <View
          style={s.featuresRow}
        >

          <View
            style={s.featureItem}
          >

            <Text
              style={s.featureIcon}
            >
              Buy
            </Text>


            <Text
              style={s.featureText}
            >
              Gold
            </Text>

          </View>


          <View
            style={s.featureDivider}
          />


          <View
            style={s.featureItem}
          >

            <Text
              style={s.featureIcon}
            >
              Sell
            </Text>


            <Text
              style={s.featureText}
            >
              Anytime
            </Text>

          </View>


          <View
            style={s.featureDivider}
          />


          <View
            style={s.featureItem}
          >

            <Text
              style={s.featureIcon}
            >
              Pay
            </Text>


            <Text
              style={s.featureText}
            >
              With Gold
            </Text>

          </View>

        </View>


        <View
          style={s.featuresRowBottom}
        >

          <View
            style={s.featureItem}
          >

            <Text
              style={s.featureIcon}
            >
              Redeem
            </Text>


            <Text
              style={s.featureText}
            >
              Physical Gold
            </Text>

          </View>


          <View
            style={s.featureDivider}
          />


          <View
            style={s.featureItem}
          >

            <Text
              style={s.featureIcon}
            >
              Loan
            </Text>


            <Text
              style={s.featureText}
            >
              Against Gold
            </Text>

          </View>

        </View>


        {/* PRIMARY BUTTON */}

        <TouchableOpacity
          activeOpacity={
            0.85
          }
          style={
            s.primaryButton
          }
          onPress={
            handleCreateAccount
          }
        >

          <Text
            style={
              s.primaryButtonText
            }
          >
            Create Account
          </Text>

        </TouchableOpacity>


        {/* SECONDARY BUTTON */}

        <TouchableOpacity
          activeOpacity={
            0.85
          }
          style={
            s.secondaryButton
          }
          onPress={
            handleSignIn
          }
        >

          <Text
            style={
              s.secondaryButtonText
            }
          >
            I already have an account
          </Text>

        </TouchableOpacity>


        {/* FOOTNOTE */}

        <Text
          style={
            s.footnote
          }
        >
          By continuing, you agree to
          AurumPay's Terms and Privacy
          Policy.
        </Text>


      </View>


    </View>

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


    /*
     * HERO
     */

    hero: {
      flex:
        1.05,

      backgroundColor:
        navy,

      paddingHorizontal:
        24,

      paddingTop:
        64,

      borderBottomLeftRadius:
        34,

      borderBottomRightRadius:
        34,

      overflow:
        'hidden',
    },


    /*
     * BRAND
     */

    brandRow: {
      flexDirection:
        'row',

      alignItems:
        'center',
    },


    logoCircle: {
      width:
        42,

      height:
        42,

      borderRadius:
        21,

      backgroundColor:
        gold,

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    logoText: {
      fontSize:
        22,

      fontWeight:
        '900',

      color:
        navy,
    },


    brandName: {
      marginLeft:
        10,

      fontSize:
        22,

      fontWeight:
        '800',

      color:
        '#FFFFFF',
    },


    /*
     * HERO CONTENT
     */

    heroContent: {
      marginTop:
        52,
    },


    heroEyebrow: {
      fontSize:
        11,

      fontWeight:
        '800',

      letterSpacing:
        1.5,

      color:
        '#D8B35A',
    },


    heroTitle: {
      marginTop:
        14,

      fontSize:
        34,

      lineHeight:
        42,

      fontWeight:
        '900',

      color:
        '#FFFFFF',
    },


    heroDescription: {
      marginTop:
        16,

      maxWidth:
        '80%',

      fontSize:
        15,

      lineHeight:
        23,

      color:
        '#BFC8D3',
    },


    /*
     * GOLD VISUAL
     */

    /*
     * BOTTOM
     */

    bottomSection: {
      flex:
        0.95,

      paddingHorizontal:
        24,

      paddingTop:
        26,

      paddingBottom:
        24,
    },


    /*
     * FEATURES
     */

    featuresRow: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',
    },


    featuresRowBottom: {
      marginTop:
        20,

      flexDirection:
        'row',

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    featureItem: {
      flex:
        1,

      alignItems:
        'center',
    },


    featureIcon: {
      fontSize:
        14,

      fontWeight:
        '900',

      color:
        navy,
    },


    featureText: {
      marginTop:
        4,

      fontSize:
        10,

      textAlign:
        'center',

      color:
        '#667085',
    },


    featureDivider: {
      width:
        1,

      height:
        32,

      backgroundColor:
        '#E7E9EC',
    },


    /*
     * BUTTONS
     */

    primaryButton: {
      marginTop:
        30,

      height:
        58,

      borderRadius:
        18,

      backgroundColor:
        gold,

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    primaryButtonText: {
      fontSize:
        16,

      fontWeight:
        '900',

      color:
        navy,
    },


    secondaryButton: {
      marginTop:
        12,

      height:
        54,

      borderRadius:
        18,

      borderWidth:
        1,

      borderColor:
        '#D0D5DD',

      backgroundColor:
        '#FFFFFF',

      justifyContent:
        'center',

      alignItems:
        'center',
    },


    secondaryButtonText: {
      fontSize:
        15,

      fontWeight:
        '800',

      color:
        navy,
    },


    /*
     * FOOTNOTE
     */

    footnote: {
      marginTop:
        16,

      textAlign:
        'center',

      fontSize:
        10,

      lineHeight:
        15,

      color:
        '#98A2B3',
    },


  });