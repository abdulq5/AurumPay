import {
  Stack,
  useLocalSearchParams,
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


export default function SelfieIntroductionScreen() {


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


  function handleContinue() {


    router.push({
      pathname:
        '/auth/kyc/selfie-camera',

      params: {

        documentType:
          documentType ??
          'AADHAAR',

        documentNumber:
          documentNumber ??
          '',

      },
    });

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
          Identity verification
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


      <ScrollView
        contentContainerStyle={
          s.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >


        {/* ICON */}

        <View
          style={
            s.iconContainer
          }
        >

          <Text
            style={
              s.icon
            }
          >
            ◉
          </Text>

        </View>


        {/* TITLE */}

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
          We need a quick selfie to
          confirm that you are the
          owner of the document.
        </Text>


        {/* REQUIREMENTS */}

        <View
          style={
            s.requirementsCard
          }
        >

          <Text
            style={
              s.requirementsTitle
            }
          >
            Before you continue
          </Text>


          <View
            style={
              s.requirementRow
            }
          >

            <Text
              style={
                s.check
              }
            >
              ✓
            </Text>

            <Text
              style={
                s.requirementText
              }
            >
              Make sure your face is
              clearly visible.
            </Text>

          </View>


          <View
            style={
              s.requirementRow
            }
          >

            <Text
              style={
                s.check
              }
            >
              ✓
            </Text>

            <Text
              style={
                s.requirementText
              }
            >
              Remove sunglasses or
              anything covering your face.
            </Text>

          </View>


          <View
            style={
              s.requirementRow
            }
          >

            <Text
              style={
                s.check
              }
            >
              ✓
            </Text>

            <Text
              style={
                s.requirementText
              }
            >
              Use a well-lit environment.
            </Text>

          </View>


        </View>


        {/* CONTINUE */}

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
            Continue to camera
          </Text>

        </TouchableOpacity>


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


    scrollContent: {
      paddingHorizontal:
        24,

      paddingTop:
        40,

      paddingBottom:
        36,
    },


    iconContainer: {
      width:
        88,

      height:
        88,

      borderRadius:
        44,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFF3D2',
    },


    icon: {
      fontSize:
        42,

      color:
        gold,
    },


    title: {
      marginTop:
        32,

      fontSize:
        30,

      fontWeight:
        '800',

      color:
        navy,
    },


    subtitle: {
      marginTop:
        12,

      fontSize:
        16,

      lineHeight:
        25,

      color:
        '#667085',
    },


    requirementsCard: {
      marginTop:
        32,

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


    requirementsTitle: {
      fontSize:
        17,

      fontWeight:
        '800',

      color:
        navy,
    },


    requirementRow: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',

      marginTop:
        20,
    },


    check: {
      width:
        24,

      height:
        24,

      borderRadius:
        12,

      overflow:
        'hidden',

      textAlign:
        'center',

      fontSize:
        14,

      fontWeight:
        '800',

      color:
        gold,
    },


    requirementText: {
      flex:
        1,

      marginLeft:
        12,

      fontSize:
        14,

      lineHeight:
        21,

      color:
        '#475467',
    },


    primaryButton: {
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


  });