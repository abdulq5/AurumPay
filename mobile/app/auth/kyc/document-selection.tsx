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

import {
  useState,
} from 'react';

import { colors } from '../../../src/theme/colors';

const { gold, navy, pageBackground } = colors;


type DocumentType =
  | 'NATIONAL_ID'
  | 'PASSPORT'
  | 'DRIVING_LICENSE';


export default function DocumentSelectionScreen() {


  const router =
    useRouter();


  const [
    selectedDocument,
    setSelectedDocument,
  ] =
    useState<
      DocumentType | null
    >(
      null
    );


  function handleContinue() {


    if (
      !selectedDocument
    ) {

      return;

    }


    router.push({
      pathname:
        '/auth/kyc/document-details',

      params: {
        documentType:
          selectedDocument,
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
          Identity document
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
          style={
            s.progressSegment
          }
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


        {/* TITLE */}

        <Text
          style={
            s.title
          }
        >
          Choose your document
        </Text>


        <Text
          style={
            s.subtitle
          }
        >
          Select a valid government-issued
          identity document for verification.
        </Text>


        {/* DOCUMENT OPTIONS */}

        <View
          style={
            s.documentsContainer
          }
        >


          {/* NATIONAL ID */}

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={[
              s.documentCard,

              selectedDocument ===
              'NATIONAL_ID'

                ?

                s.documentCardSelected

                :

                null,
            ]}
            onPress={
              () =>
                setSelectedDocument(
                  'NATIONAL_ID'
                )
            }
          >

            <View
              style={
                s.documentIcon
              }
            >

              <Text
                style={
                  s.documentIconText
                }
              >
                ID
              </Text>

            </View>


            <View
              style={
                s.documentTextContainer
              }
            >

              <Text
                style={
                  s.documentTitle
                }
              >
                National ID
              </Text>


              <Text
                style={
                  s.documentDescription
                }
              >
                Government-issued national
                identity card.
              </Text>

            </View>


            <View
              style={[
                s.radioOuter,

                selectedDocument ===
                'NATIONAL_ID'

                  ?

                  s.radioOuterSelected

                  :

                  null,
              ]}
            >

              {
                selectedDocument ===
                'NATIONAL_ID'

                  ?

                  (
                    <View
                      style={
                        s.radioInner
                      }
                    />
                  )

                  :

                  null
              }

            </View>

          </TouchableOpacity>


          {/* PASSPORT */}

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={[
              s.documentCard,

              selectedDocument ===
              'PASSPORT'

                ?

                s.documentCardSelected

                :

                null,
            ]}
            onPress={
              () =>
                setSelectedDocument(
                  'PASSPORT'
                )
            }
          >

            <View
              style={
                s.documentIcon
              }
            >

              <Text
                style={
                  s.documentIconText
                }
              >
                P
              </Text>

            </View>


            <View
              style={
                s.documentTextContainer
              }
            >

              <Text
                style={
                  s.documentTitle
                }
              >
                Passport
              </Text>


              <Text
                style={
                  s.documentDescription
                }
              >
                A valid passport issued
                by your country.
              </Text>

            </View>


            <View
              style={[
                s.radioOuter,

                selectedDocument ===
                'PASSPORT'

                  ?

                  s.radioOuterSelected

                  :

                  null,
              ]}
            >

              {
                selectedDocument ===
                'PASSPORT'

                  ?

                  (
                    <View
                      style={
                        s.radioInner
                      }
                    />
                  )

                  :

                  null
              }

            </View>

          </TouchableOpacity>


          {/* DRIVING LICENSE */}

          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={[
              s.documentCard,

              selectedDocument ===
              'DRIVING_LICENSE'

                ?

                s.documentCardSelected

                :

                null,
            ]}
            onPress={
              () =>
                setSelectedDocument(
                  'DRIVING_LICENSE'
                )
            }
          >

            <View
              style={
                s.documentIcon
              }
            >

              <Text
                style={
                  s.documentIconText
                }
              >
                DL
              </Text>

            </View>


            <View
              style={
                s.documentTextContainer
              }
            >

              <Text
                style={
                  s.documentTitle
                }
              >
                Driving licence
              </Text>


              <Text
                style={
                  s.documentDescription
                }
              >
                A valid government-issued
                driving licence.
              </Text>

            </View>


            <View
              style={[
                s.radioOuter,

                selectedDocument ===
                'DRIVING_LICENSE'

                  ?

                  s.radioOuterSelected

                  :

                  null,
              ]}
            >

              {
                selectedDocument ===
                'DRIVING_LICENSE'

                  ?

                  (
                    <View
                      style={
                        s.radioInner
                      }
                    />
                  )

                  :

                  null
              }

            </View>

          </TouchableOpacity>


        </View>


        {/* INFORMATION CARD */}

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


          <View
            style={
              s.infoTextContainer
            }
          >

            <Text
              style={
                s.infoTitle
              }
            >
              Use an original document
            </Text>


            <Text
              style={
                s.infoDescription
              }
            >
              Your document should be valid,
              clearly readable and not expired.
            </Text>

          </View>

        </View>


        {/* CONTINUE */}

        <TouchableOpacity
          activeOpacity={
            selectedDocument
              ?

              0.85

              :

              1
          }
          disabled={
            !selectedDocument
          }
          style={[
            s.primaryButton,

            !selectedDocument

              ?

              s.primaryButtonDisabled

              :

              null,
          ]}
          onPress={
            handleContinue
          }
        >

          <Text
            style={[
              s.primaryButtonText,

              !selectedDocument

                ?

                s.primaryButtonTextDisabled

                :

                null,
            ]}
          >
            Continue
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
     * CONTENT
     */

    scrollContent: {
      paddingHorizontal:
        24,

      paddingTop:
        30,

      paddingBottom:
        36,
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
     * DOCUMENT OPTIONS
     */

    documentsContainer: {
      marginTop:
        28,

      gap:
        14,
    },


    documentCard: {
      minHeight:
        104,

      padding:
        18,

      borderRadius:
        20,

      flexDirection:
        'row',

      alignItems:
        'center',

      borderWidth:
        1,

      borderColor:
        '#E7E9EC',

      backgroundColor:
        '#FFFFFF',
    },


    documentCardSelected: {
      borderColor:
        gold,

      borderWidth:
        2,

      backgroundColor:
        '#FFFDF7',
    },


    documentIcon: {
      width:
        52,

      height:
        52,

      borderRadius:
        16,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFF3D2',
    },


    documentIconText: {
      fontSize:
        15,

      fontWeight:
        '800',

      color:
        gold,
    },


    documentTextContainer: {
      flex:
        1,

      marginLeft:
        14,

      marginRight:
        10,
    },


    documentTitle: {
      fontSize:
        16,

      fontWeight:
        '800',

      color:
        navy,
    },


    documentDescription: {
      marginTop:
        5,

      fontSize:
        12,

      lineHeight:
        18,

      color:
        '#667085',
    },


    /*
     * RADIO
     */

    radioOuter: {
      width:
        24,

      height:
        24,

      borderRadius:
        12,

      borderWidth:
        2,

      borderColor:
        '#D0D5DD',

      alignItems:
        'center',

      justifyContent:
        'center',
    },


    radioOuterSelected: {
      borderColor:
        gold,
    },


    radioInner: {
      width:
        12,

      height:
        12,

      borderRadius:
        6,

      backgroundColor:
        gold,
    },


    /*
     * INFORMATION
     */

    infoCard: {
      flexDirection:
        'row',

      marginTop:
        22,

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


    infoTextContainer: {
      flex:
        1,

      marginLeft:
        10,
    },


    infoTitle: {
      fontSize:
        13,

      fontWeight:
        '800',

      color:
        navy,
    },


    infoDescription: {
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
     * BUTTON
     */

    primaryButton: {
      height:
        56,

      marginTop:
        28,

      borderRadius:
        16,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        gold,
    },


    primaryButtonDisabled: {
      backgroundColor:
        '#E4E7EC',
    },


    primaryButtonText: {
      fontSize:
        16,

      fontWeight:
        '800',

      color:
        navy,
    },


    primaryButtonTextDisabled: {
      color:
        '#98A2B3',
    },


  });