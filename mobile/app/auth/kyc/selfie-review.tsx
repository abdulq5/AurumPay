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
  Image,
} from 'react-native';

import {
  useLocalSearchParams,
} from 'expo-router';

import {
  useAuth,
} from '../../../context/AuthContext';

import { colors } from '../../../src/theme/colors';

const { gold, navy, pageBackground } = colors;


export default function SelfieReviewScreen() {

  const router =
    useRouter();


  const {
    selfieUri,
  } =
    useLocalSearchParams<{
      selfieUri?: string;
    }>();


  const {
    updateKycStatus,
  } = useAuth();


  function handleSubmitVerification() {

    updateKycStatus(
      'SUBMITTED'
    );


    router.replace(
      '/auth/kyc/kyc-submitted'
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


      <View
        style={
          s.header
        }
      >

        <TouchableOpacity
          activeOpacity={
            0.7
          }
          style={
            s.backButton
          }
          onPress={
            () =>
              router.back()
          }
        >

          <Text
            style={
              s.backButtonText
            }
          >
            ‹
          </Text>

        </TouchableOpacity>


        <Text
          style={
            s.headerTitle
          }
        >
          Review selfie
        </Text>


        <View
          style={
            s.headerSpacer
          }
        />

      </View>


      <View
        style={
          s.content
        }
      >

        <Text
          style={
            s.title
          }
        >
          Review your selfie
        </Text>


        <Text
          style={
            s.subtitle
          }
        >
          Make sure your face is clearly visible
          before submitting your verification.
        </Text>


        <View
          style={
            s.imagePlaceholder
          }
        >

          {
            selfieUri ?
              <Image
                source={{
                  uri:
                    selfieUri,
                }}
                style={
                  s.selfieImage
                }
                resizeMode={
                  'cover'
                }
              />
              :
              <Text
                style={
                  s.placeholderText
                }
              >
                Your selfie
              </Text>
          }

        </View>


        <TouchableOpacity
          activeOpacity={
            0.85
          }
          style={
            s.primaryButton
          }
          onPress={
            handleSubmitVerification
          }
        >

          <Text
            style={
              s.primaryButtonText
            }
          >
            Submit verification
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          activeOpacity={
            0.7
          }
          style={
            s.secondaryButton
          }
          onPress={
            () =>
              router.back()
          }
        >

          <Text
            style={
              s.secondaryButtonText
            }
          >
            Retake selfie
          </Text>

        </TouchableOpacity>


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


    header: {
      height:
        62,

      paddingHorizontal:
        20,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',
    },


    backButton: {
      width:
        40,

      height:
        40,

      borderRadius:
        20,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFFFFF',

      borderWidth:
        1,

      borderColor:
        '#E7E9EC',
    },


    backButtonText: {
      marginTop:
        -3,

      fontSize:
        32,

      lineHeight:
        34,

      color:
        navy,
    },


    headerTitle: {
      fontSize:
        16,

      fontWeight:
        '800',

      color:
        navy,
    },


    headerSpacer: {
      width:
        40,
    },


    content: {
      flex:
        1,

      paddingHorizontal:
        24,

      paddingTop:
        30,
    },


    title: {
      fontSize:
        28,

      fontWeight:
        '800',

      color:
        navy,
    },


    subtitle: {
      marginTop:
        10,

      fontSize:
        15,

      lineHeight:
        23,

      color:
        '#667085',
    },


    imagePlaceholder: {
      flex:
        1,

      marginTop:
        30,

      marginBottom:
        30,

      borderRadius:
        28,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#DDE1E6',
    },


    selfieImage: {
      width:
        '100%',

      height:
        '100%',

      borderRadius:
        28,
    },


    placeholderText: {
      fontSize:
        15,

      fontWeight:
        '700',

      color:
        '#667085',
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


    secondaryButton: {
      height:
        52,

      marginTop:
        12,

      marginBottom:
        28,

      borderRadius:
        16,

      alignItems:
        'center',

      justifyContent:
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


  });