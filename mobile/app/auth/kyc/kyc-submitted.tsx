import {
  Stack,
  useRouter,
} from 'expo-router';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '../../../src/theme/colors';

const { gold, navy, pageBackground } = colors;


export default function KycSubmittedScreen() {

  const router =
    useRouter();


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


      <View
        style={
          s.content
        }
      >


        <View
          style={
            s.successIcon
          }
        >

          <Text
            style={
              s.successIconText
            }
          >
            ✓
          </Text>

        </View>


        <Text
          style={
            s.title
          }
        >
          KYC submitted
        </Text>


        <Text
          style={
            s.subtitle
          }
        >
          Your identity verification has been
          submitted successfully.
        </Text>


        <View
          style={
            s.infoCard
          }
        >

          <Text
            style={
              s.infoTitle
            }
          >
            What happens next?
          </Text>


          <Text
            style={
              s.infoDescription
            }
          >
            We will review your submitted
            information. You will be notified
            once your KYC verification is complete.
          </Text>

        </View>


        <View
          style={
            s.bottomSection
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
              () =>
                router.replace(
                  '/'
                )
            }
          >

            <Text
              style={
                s.primaryButtonText
              }
            >
              Back to home
            </Text>

          </TouchableOpacity>

        </View>


      </View>

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
        100,

      alignItems:
        'center',
    },


    successIcon: {
      width:
        90,

      height:
        90,

      borderRadius:
        45,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#EAF7EF',
    },


    successIconText: {
      fontSize:
        46,

      fontWeight:
        '700',

      color:
        '#16803C',
    },


    title: {
      marginTop:
        28,

      fontSize:
        28,

      fontWeight:
        '800',

      color:
        navy,
    },


    subtitle: {
      marginTop:
        12,

      textAlign:
        'center',

      fontSize:
        15,

      lineHeight:
        23,

      color:
        '#667085',
    },


    infoCard: {
      width:
        '100%',

      marginTop:
        36,

      padding:
        20,

      borderRadius:
        20,

      backgroundColor:
        '#FFFFFF',

      borderWidth:
        1,

      borderColor:
        '#E7E9EC',
    },


    infoTitle: {
      fontSize:
        16,

      fontWeight:
        '800',

      color:
        navy,
    },


    infoDescription: {
      marginTop:
        10,

      fontSize:
        14,

      lineHeight:
        22,

      color:
        '#667085',
    },


    bottomSection: {
      width:
        '100%',

      marginTop:
        'auto',

      paddingBottom:
        24,
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


  });