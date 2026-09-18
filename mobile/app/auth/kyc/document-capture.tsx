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
  useState,
  useRef,
} from 'react';

import { colors } from '../../../src/theme/colors';


const { gold, navy, pageBackground } = colors;


type DocumentType =
  | 'AADHAAR'
  | 'PAN_CARD'
  | 'VOTER_ID'
  | 'PASSPORT'
  | 'DRIVING_LICENSE';


export default function DocumentCaptureScreen() {


  const router =
    useRouter();


  const {
    documentType,
    documentNumber,
    nextStep,
    captureCount,
  } =
    useLocalSearchParams<{
      documentType?: string;
      documentNumber?: string;
      nextStep?: string;
      captureCount?: string;
    }>();


  const selectedDocument =
    documentType as
    DocumentType | undefined;


  const [
    permission,
    requestPermission,
  ] =
    useCameraPermissions();


  const [
    facing,
    setFacing,
  ] =
    useState<
      'front' | 'back'
    >(
      'back'
    );


  const cameraRef =
    useRef<CameraView>(
      null
    );


  const [
    capturedCount,
    setCapturedCount,
  ] = useState(0);


  const requiredCaptureCount =
    Number(captureCount) ||
    (selectedDocument === 'AADHAAR' || selectedDocument === 'PASSPORT'
      ? 2
      : 1);


  function getDocumentName() {


    if (
      selectedDocument ===
      'AADHAAR'
    ) {

      return 'Aadhaar card';

    }


    if (
      selectedDocument ===
      'PAN_CARD'
    ) {

      return 'PAN card';

    }


    if (
      selectedDocument ===
      'PASSPORT'
    ) {

      return 'Passport';

    }


    if (
      selectedDocument ===
      'VOTER_ID'
    ) {

      return 'Voter ID';

    }


    if (
      selectedDocument ===
      'DRIVING_LICENSE'
    ) {

      return 'Driving licence';

    }


    return 'Document';

  }


  function getCaptureInstruction() {

    const side =
      capturedCount === 0
        ? 'front'
        : 'back';


    if (
      requiredCaptureCount > 1
    ) {

      return `Place the ${side} side of your ${getDocumentName()} inside the frame.`;

    }


    if (
      selectedDocument ===
      'PASSPORT'
    ) {

      return (
        'Place the photo and personal '
        +
        'details page inside the frame.'
      );

    }


    return (
      'Place the front side of your '
      +
      getDocumentName()
      +
      ' inside the frame.'
    );

  }


  async function handleCapture() {

    const photo =
      await cameraRef.current?.takePictureAsync();


    if (
      !photo
    ) {

      return;

    }


    const nextCapturedCount =
      capturedCount +
      1;


    if (
      nextCapturedCount <
      requiredCaptureCount
    ) {

      setCapturedCount(
        nextCapturedCount
      );

      return;

    }


    if (
      nextStep ===
      'DOCUMENT_SELECTION'
    ) {

      router.replace(
        '/auth/kyc/document-choice'
      );

      return;

    }


    router.replace({
      pathname:
        '/auth/kyc/selfie-introduction',

      params: {

        documentType:
          selectedDocument ??
          'AADHAAR',

        documentNumber:
          documentNumber ??
          '',

      },
    });

  }


  /*
   * Camera permission loading.
   */

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


  /*
   * Camera permission denied.
   */

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
            to capture your identity document.
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
              Go back
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


      {/* HEADER */}

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
          Capture document
        </Text>


        <View
          style={
            s.headerSpacer
          }
        />


      </View>


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
          style={[
            s.progressSegment,
            s.progressSegmentActive,
          ]}
        />

        <View
          style={[
            s.progressSegment,
            s.progressSegmentActive,
          ]}
        />

        <View
          style={[
            s.progressSegment,
            s.progressSegmentActive,
          ]}
        />

      </View>


      {/* TITLE */}

      <View
        style={
          s.topContent
        }
      >

        <Text
          style={
            s.title
          }
        >
          Capture your document
        </Text>


        <Text
          style={
            s.subtitle
          }
        >
          {
            getCaptureInstruction()
          }
        </Text>

      </View>


      {/* CAMERA */}

      <View
        style={
          s.cameraContainer
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
            facing
          }
        />


        {/* DOCUMENT GUIDE */}

        <View
          pointerEvents={
            'none'
          }
          style={
            s.documentGuide
          }
        />


      </View>


      {/* CAMERA INFORMATION */}

      <View
        style={
          s.infoCard
        }
      >

        <Text
          style={
            s.infoIcon
          }
        >
          ✓
        </Text>


        <Text
          style={
            s.infoText
          }
        >
          Make sure the document is
          clearly visible and all four
          corners are inside the frame.
        </Text>

      </View>


      {/* CONTROLS */}

      <View
        style={
          s.controlsContainer
        }
      >


        <TouchableOpacity
          activeOpacity={
            0.8
          }
          style={
            s.flipButton
          }
          onPress={
            () =>

              setFacing(
                current =>

                  current ===
                  'back'
                    ?
                    'front'
                    :
                    'back'
              )
          }
        >

          <Text
            style={
              s.flipButtonIcon
            }
          >
            ↻
          </Text>

          <Text
            style={
              s.flipButtonText
            }
          >
            Flip
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          activeOpacity={
            0.85
          }
          style={
            s.captureButton
          }
          onPress={
            handleCapture
          }
        >

          <View
            style={
              s.captureButtonInner
            }
          />

        </TouchableOpacity>


        <View
          style={
            s.controlsSpacer
          }
        />


      </View>


      <Text
        style={
          s.captureLabel
        }
      >
        {requiredCaptureCount > 1
          ? `Capture ${capturedCount + 1} of ${requiredCaptureCount}`
          : 'Tap to capture'}
      </Text>


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


    /*
     * HEADER
     */

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


    /*
     * PROGRESS
     */

    progressContainer: {
      flexDirection:
        'row',

      gap:
        8,

      paddingHorizontal:
        24,

      paddingTop:
        10,
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
     * TOP CONTENT
     */

    topContent: {
      paddingHorizontal:
        24,

      paddingTop:
        28,
    },


    title: {
      fontSize:
        28,

      fontWeight:
        '800',

      letterSpacing:
        -0.5,

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


    /*
     * CAMERA
     */

    cameraContainer: {
      flex:
        1,

      marginHorizontal:
        24,

      marginTop:
        24,

      minHeight:
        280,

      borderRadius:
        24,

      overflow:
        'hidden',

      backgroundColor:
        '#101828',
    },


    camera: {
      flex:
        1,
    },


    documentGuide: {
      position:
        'absolute',

      top:
        '18%',

      left:
        '8%',

      right:
        '8%',

      bottom:
        '18%',

      borderRadius:
        20,

      borderWidth:
        3,

      borderColor:
        gold,
    },


    /*
     * INFORMATION
     */

    infoCard: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',

      marginHorizontal:
        24,

      marginTop:
        18,

      padding:
        16,

      borderRadius:
        18,

      backgroundColor:
        '#EEF4FF',
    },


    infoIcon: {
      width:
        24,

      height:
        24,

      borderRadius:
        12,

      textAlign:
        'center',

      fontSize:
        15,

      fontWeight:
        '800',

      color:
        '#175CD3',
    },


    infoText: {
      flex:
        1,

      marginLeft:
        10,

      fontSize:
        12,

      lineHeight:
        18,

      color:
        '#475467',
    },


    /*
     * CONTROLS
     */

    controlsContainer: {
      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      paddingHorizontal:
        24,

      marginTop:
        24,
    },


    flipButton: {
      position:
        'absolute',

      left:
        36,

      alignItems:
        'center',
    },


    flipButtonIcon: {
      fontSize:
        28,

      color:
        navy,
    },


    flipButtonText: {
      marginTop:
        3,

      fontSize:
        12,

      fontWeight:
        '700',

      color:
        '#475467',
    },


    captureButton: {
      width:
        76,

      height:
        76,

      borderRadius:
        38,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderWidth:
        5,

      borderColor:
        gold,

      backgroundColor:
        '#FFFFFF',
    },


    captureButtonInner: {
      width:
        56,

      height:
        56,

      borderRadius:
        28,

      backgroundColor:
        gold,
    },


    controlsSpacer: {
      position:
        'absolute',

      right:
        36,

      width:
        40,
    },


    captureLabel: {
      marginTop:
        10,

      marginBottom:
        22,

      textAlign:
        'center',

      fontSize:
        13,

      fontWeight:
        '700',

      color:
        '#667085',
    },


    /*
     * PERMISSION SCREEN
     */

    permissionContainer: {
      flex:
        1,

      paddingHorizontal:
        32,

      alignItems:
        'center',

      justifyContent:
        'center',
    },


    permissionTitle: {
      fontSize:
        26,

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
        23,

      textAlign:
        'center',

      color:
        '#667085',
    },


    primaryButton: {
      width:
        '100%',

      height:
        56,

      marginTop:
        32,

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
      marginTop:
        18,

      paddingVertical:
        10,

      paddingHorizontal:
        20,
    },


    secondaryButtonText: {
      fontSize:
        14,

      fontWeight:
        '700',

      color:
        '#667085',
    },


  });