import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useRef,
} from 'react';

import { colors } from '../../../src/theme/colors';

const { gold, navy, pageBackground } = colors;


export default function SelfieCameraScreen() {

  const router =
    useRouter();

  const {
    documentType,
    documentNumber,
  } =
    useLocalSearchParams<{
      documentType?: string;
      documentNumber?: string;
    }>();

  const [
    permission,
    requestPermission,
  ] =
    useCameraPermissions();

  const cameraRef =
    useRef<CameraView>(
      null
    );

  async function handleCapture() {

    const photo =
      await cameraRef.current?.takePictureAsync({
        quality: 0.8,
      });

    if (
      !photo?.uri
    ) {

      return;

    }

    router.push({
      pathname:
        '/auth/kyc/selfie-review',

      params: {
        selfieUri:
          photo.uri,

        documentType:
          documentType ??
          'AADHAAR',

        documentNumber:
          documentNumber ??
          '',
      },
    });

  }

  if (
    !permission
  ) {

    return (

      <SafeAreaView
        style={
          s.page
        }
      />

    );

  }

  if (
    !permission.granted
  ) {

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
            s.permissionContainer
          }
        >

          <Text
            style={
              s.permissionTitle
            }
          >
            Camera access required
          </Text>

          <Text
            style={
              s.permissionDescription
            }
          >
            AurumPay needs camera access
            to capture your selfie.
          </Text>

          <TouchableOpacity
            activeOpacity={
              0.85
            }
            style={
              s.primaryButton
            }
            onPress={
              requestPermission
            }
          >

            <Text
              style={
                s.primaryButtonText
              }
            >
              Allow camera access
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>

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
          Selfie verification
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
          Take a selfie
        </Text>


        <Text
          style={
            s.subtitle
          }
        >
          Position your face inside the frame
          and make sure your face is clearly visible.
        </Text>


        <View
          style={
            s.cameraPlaceholder
          }
        >

          <CameraView
            ref={
              cameraRef
            }
            style={
              s.camera
            }
            facing={
              'front'
            }
          />

        </View>


        <TouchableOpacity
          activeOpacity={
            0.85
          }
          style={
            s.primaryButton
          }
          onPress={
            handleCapture
          }
        >

          <Text
            style={
              s.primaryButtonText
            }
          >
            Take photo
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


    cameraPlaceholder: {
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


    camera: {
      flex:
        1,

      width:
        '100%',
    },


    cameraText: {
      fontSize:
        15,

      fontWeight:
        '700',

      color:
        '#667085',
    },


    permissionContainer: {
      flex:
        1,

      paddingHorizontal:
        24,

      alignItems:
        'center',

      justifyContent:
        'center',
    },


    permissionTitle: {
      fontSize:
        24,

      fontWeight:
        '800',

      textAlign:
        'center',

      color:
        navy,
    },


    permissionDescription: {
      marginTop:
        12,

      fontSize:
        15,

      lineHeight:
        22,

      textAlign:
        'center',

      color:
        '#667085',
    },


    primaryButton: {
      height:
        56,

      marginBottom:
        30,

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