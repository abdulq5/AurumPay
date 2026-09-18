import {
  Stack,
  useRouter,
} from 'expo-router';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../../../src/theme/colors';

const { gold, navy, pageBackground } = colors;


export default function KycIntroductionScreen() {


  const router =
    useRouter();


  function handleContinue() {

    router.push(
      '/auth/kyc/personal-details'
    );

  }


  return (

    <SafeAreaView
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


      <ScrollView
        contentContainerStyle={
          s.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >


        {/* PROGRESS */}

        <View
          style={
            s.progressContainer
          }
        >

          <View
            style={[
              s.progressSegment,

              s.progressSegmentActive,
            ]}
          />


          <View
            style={
              s.progressSegment
            }
          />


          <View
            style={
              s.progressSegment
            }
          />


          <View
            style={
              s.progressSegment
            }
          />

        </View>


        {/* TOP ICON */}

        <View
          style={
            s.iconContainer
          }
        >

          <Text
            style={
              s.iconText
            }
          >
            ✓
          </Text>

        </View>


        {/* TITLE */}

        <Text
          style={
            s.title
          }
        >
          Verify your identity
        </Text>


        {/* SUBTITLE */}

        <Text
          style={
            s.subtitle
          }
        >
          Complete a quick identity
          verification to unlock the
          full AurumPay experience.
        </Text>


        {/* BENEFITS */}

        <View
          style={
            s.benefitsContainer
          }
        >


          <View
            style={
              s.benefitRow
            }
          >

            <View
              style={
                s.benefitIcon
              }
            >

              <Text
                style={
                  s.benefitIconText
                }
              >
                ✓
              </Text>

            </View>


            <View
              style={
                s.benefitTextContainer
              }
            >

              <Text
                style={
                  s.benefitTitle
                }
              >
                Secure your account
              </Text>


              <Text
                style={
                  s.benefitDescription
                }
              >
                Help us protect your
                AurumPay account and
                digital gold.
              </Text>

            </View>

          </View>


          <View
            style={
              s.benefitDivider
            }
          />


          <View
            style={
              s.benefitRow
            }
          >

            <View
              style={
                s.benefitIcon
              }
            >

              <Text
                style={
                  s.benefitIconText
                }
              >
                ✓
              </Text>

            </View>


            <View
              style={
                s.benefitTextContainer
              }
            >

              <Text
                style={
                  s.benefitTitle
                }
              >
                Unlock all features
              </Text>


              <Text
                style={
                  s.benefitDescription
                }
              >
                Buy, Sell, Pay, Redeem
                and access Gold Loans
                with AurumPay.
              </Text>

            </View>

          </View>


          <View
            style={
              s.benefitDivider
            }
          />


          <View
            style={
              s.benefitRow
            }
          >

            <View
              style={
                s.benefitIcon
              }
            >

              <Text
                style={
                  s.benefitIconText
                }
              >
                ✓
              </Text>

            </View>


            <View
              style={
                s.benefitTextContainer
              }
            >

              <Text
                style={
                  s.benefitTitle
                }
              >
                Quick and secure
              </Text>


              <Text
                style={
                  s.benefitDescription
                }
              >
                The verification process
                takes only a few minutes.
              </Text>

            </View>

          </View>


        </View>


        {/* PRIVACY CARD */}

        <View
          style={
            s.privacyCard
          }
        >

          <Text
            style={
              s.privacyIcon
            }
          >
            🔒
          </Text>


          <View
            style={
              s.privacyTextContainer
            }
          >

            <Text
              style={
                s.privacyTitle
              }
            >
              Your information is protected
            </Text>


            <Text
              style={
                s.privacyDescription
              }
            >
              Your personal information is
              securely handled and used
              only for identity verification.
            </Text>

          </View>

        </View>


        {/* BOTTOM AREA */}

        <View
          style={
            s.bottomContainer
          }
        >


          <TouchableOpacity
            activeOpacity={
              0.85
            }
            style={
              s.primaryButton
            }
            onPress={
              handleContinue
            }
          >

            <Text
              style={
                s.primaryButtonText
              }
            >
              Start verification
            </Text>

          </TouchableOpacity>


          <Text
            style={
              s.bottomText
            }
          >
            Usually takes less than
            5 minutes
          </Text>


        </View>


      </ScrollView>


    </SafeAreaView>

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
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        18,

      paddingBottom:
        148,
    },


    /*
     * PROGRESS
     */

    progressContainer: {
      flexDirection:
        'row',

      gap:
        8,
    },


    progressSegment: {
      flex:
        1,

      height:
        4,

      borderRadius:
        4,

      backgroundColor:
        '#E4E7EC',
    },


    progressSegmentActive: {
      backgroundColor:
        gold,
    },


    /*
     * TOP ICON
     */

    iconContainer: {
      width:
        82,

      height:
        82,

      marginTop:
        42,

      borderRadius:
        41,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFF3D2',
    },


    iconText: {
      fontSize:
        38,

      fontWeight:
        '700',

      color:
        gold,
    },


    /*
     * TITLE
     */

    title: {
      marginTop:
        28,

      fontSize:
        30,

      fontWeight:
        '800',

      letterSpacing:
        -0.5,

      color:
        navy,
    },


    subtitle: {
      marginTop:
        12,

      fontSize:
        16,

      lineHeight:
        24,

      color:
        '#667085',
    },


    /*
     * BENEFITS
     */

    benefitsContainer: {
      marginTop:
        34,

      padding:
        20,

      borderRadius:
        22,

      borderWidth:
        1,

      borderColor:
        '#E7E9EC',

      backgroundColor:
        '#FFFFFF',
    },


    benefitRow: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',
    },


    benefitIcon: {
      width:
        28,

      height:
        28,

      borderRadius:
        14,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFF3D2',
    },


    benefitIconText: {
      fontSize:
        15,

      fontWeight:
        '800',

      color:
        gold,
    },


    benefitTextContainer: {
      flex:
        1,

      marginLeft:
        14,
    },


    benefitTitle: {
      fontSize:
        15,

      fontWeight:
        '800',

      color:
        navy,
    },


    benefitDescription: {
      marginTop:
        5,

      fontSize:
        13,

      lineHeight:
        19,

      color:
        '#667085',
    },


    benefitDivider: {
      height:
        1,

      marginVertical:
        18,

      marginLeft:
        42,

      backgroundColor:
        '#EEF0F2',
    },


    /*
     * PRIVACY
     */

    privacyCard: {
      flexDirection:
        'row',

      marginTop:
        18,

      padding:
        16,

      borderRadius:
        18,

      backgroundColor:
        '#EEF4FF',
    },


    privacyIcon: {
      fontSize:
        20,
    },


    privacyTextContainer: {
      flex:
        1,

      marginLeft:
        12,
    },


    privacyTitle: {
      fontSize:
        13,

      fontWeight:
        '800',

      color:
        navy,
    },


    privacyDescription: {
      marginTop:
        5,

      fontSize:
        12,

      lineHeight:
        18,

      color:
        '#475467',
    },


    /*
     * BOTTOM
     */

    bottomContainer: {
      position:
        'absolute',

      left:
        24,

      right:
        24,

      bottom:
        0,

      paddingTop:
        12,

      paddingBottom:
        16,

      backgroundColor:
        pageBackground,
    },


    primaryButton: {
      height:
        56,

      borderRadius:
        16,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        gold,
    },


    primaryButtonText: {
      fontSize:
        16,

      fontWeight:
        '800',

      color:
        navy,
    },


    bottomText: {
      marginTop:
        14,

      textAlign:
        'center',

      fontSize:
        12,

      color:
        '#98A2B3',
    },


  });