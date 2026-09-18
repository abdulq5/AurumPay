import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {
  SafeAreaView,
  Modal,
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

import { colors } from '../../../src/theme/colors';

const { gold, navy, pageBackground, dangerRed } = colors;


type DocumentType =
  | 'AADHAAR'
  | 'PAN'
  | 'VOTER_ID'
  | 'PASSPORT'
  | 'DRIVING_LICENSE';


export default function DocumentDetailsScreen() {


  const router =
    useRouter();


  const {
    documentType,
  } =
    useLocalSearchParams<{
      documentType?: string;
    }>();


  const selectedDocument =
    documentType as
    DocumentType | undefined;


  const [
    documentNumber,
    setDocumentNumber,
  ] =
    useState(
      ''
    );


  const [
    documentNumberError,
    setDocumentNumberError,
  ] =
    useState(
      ''
    );


  const [
    expiryDate,
    setExpiryDate,
  ] =
    useState(
      ''
    );


  const [
    expiryDateValue,
    setExpiryDateValue,
  ] = useState(
    new Date()
  );


  const [
    isExpiryDatePickerVisible,
    setIsExpiryDatePickerVisible,
  ] = useState(false);

  const [
    expiryDateError,
    setExpiryDateError,
  ] =
    useState(
      ''
    );


  /*
   * Aadhaar and PAN cards
   * do not have an expiry date.
   */

  const requiresExpiryDate =
    selectedDocument ===
    'PASSPORT'
    ||
    selectedDocument ===
    'DRIVING_LICENSE';


  function formatDate(
    value: Date
  ) {

    const day = value
      .getDate()
      .toString()
      .padStart(2, '0');

    const month = (
      value.getMonth() +
      1
    )
      .toString()
      .padStart(2, '0');

    return `${day} / ${month} / ${value.getFullYear()}`;

  }


  function handleExpiryDateChange(
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) {

    setIsExpiryDatePickerVisible(false);


    if (
      event.type !==
      'set'
      ||
      !selectedDate
    ) {

      return;

    }


    setExpiryDateValue(
      selectedDate
    );

    setExpiryDate(
      formatDate(
        selectedDate
      )
    );

    setExpiryDateError(
      ''
    );

  }


  /*
   * Get document-specific
   * title.
   */

  function getDocumentTitle() {


    if (
      selectedDocument ===
      'AADHAAR'
    ) {

      return 'Aadhaar details';

    }


    if (
      selectedDocument ===
      'PAN'
    ) {

      return 'PAN card details';

    }


    if (
      selectedDocument ===
      'PASSPORT'
    ) {

      return 'Passport details';

    }


    if (
      selectedDocument ===
      'VOTER_ID'
    ) {

      return 'Voter ID details';

    }


    if (
      selectedDocument ===
      'DRIVING_LICENSE'
    ) {

      return 'Driving licence details';

    }


    return 'Document details';

  }


  /*
   * Get document number label.
   */

  function getDocumentNumberLabel() {


    if (
      selectedDocument ===
      'AADHAAR'
    ) {

      return 'Aadhaar number';

    }


    if (
      selectedDocument ===
      'PAN'
    ) {

      return 'PAN number';

    }


    if (
      selectedDocument ===
      'PASSPORT'
    ) {

      return 'Passport number';

    }


    if (
      selectedDocument ===
      'VOTER_ID'
    ) {

      return 'Voter ID number';

    }


    if (
      selectedDocument ===
      'DRIVING_LICENSE'
    ) {

      return 'Driving licence number';

    }


    return 'Document number';

  }


  /*
   * Get document number
   * placeholder.
   */

  function getDocumentNumberPlaceholder() {

    if (
      selectedDocument ===
      'AADHAAR'
    ) {

      return 'Enter your 12-digit Aadhaar number';

    }


    if (
      selectedDocument ===
      'PAN'
    ) {

      return 'Enter your PAN number';

    }


    if (
      selectedDocument ===
      'PASSPORT'
    ) {

      return 'Enter your passport number';

    }


    if (
      selectedDocument ===
      'VOTER_ID'
    ) {

      return 'Enter your Voter ID number';

    }


    if (
      selectedDocument ===
      'DRIVING_LICENSE'
    ) {

      return 'Enter your driving licence number';

    }


    return 'Enter your document number';

  }


  /*
   * Get document description.
   */

  function getDocumentDescription() {


    if (
      selectedDocument ===
      'AADHAAR'
    ) {

      return (
        'Enter the details exactly as '
        +
        'shown on your Aadhaar card.'
      );

    }


    if (
      selectedDocument ===
      'PAN'
    ) {

      return (
        'Enter the details exactly as '
        +
        'shown on your PAN card.'
      );

    }


    if (
      selectedDocument ===
      'PASSPORT'
    ) {

      return (
        'Enter the details exactly as '
        +
        'shown on your passport.'
      );

    }


    if (
      selectedDocument ===
      'VOTER_ID'
    ) {

      return (
        'Enter the details exactly as '
        +
        'shown on your Voter ID.'
      );

    }


    if (
      selectedDocument ===
      'DRIVING_LICENSE'
    ) {

      return (
        'Enter the details exactly as '
        +
        'shown on your driving licence.'
      );

    }


    return (
      'Enter the details exactly as '
      +
      'shown on your identity document.'
    );

  }


  /*
   * Validate Aadhaar number.
   *
   * Demo validation:
   * exactly 12 digits.
   */

  function isValidAadhaar(
    value: string
  ) {

    return /^\d{12}$/.test(
      value
    );

  }


  /*
   * Validate PAN number.
   *
   * Standard PAN format:
   * ABCDE1234F
   */

  function isValidPan(
    value: string
  ) {

    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
      value.toUpperCase()
    );

  }


  /*
   * Handle continue.
   */

  function handleContinue() {


    setDocumentNumberError(
      ''
    );


    setExpiryDateError(
      ''
    );


    let hasError =
      false;


    const cleanedDocumentNumber =
      documentNumber
        .trim()
        .toUpperCase();


    /*
     * DOCUMENT NUMBER
     */

    if (
      !cleanedDocumentNumber
    ) {

      setDocumentNumberError(
        'Please enter your document number.'
      );


      hasError =
        true;

    }


    else if (
      selectedDocument ===
      'AADHAAR'
      &&
      !isValidAadhaar(
        documentNumber.trim()
      )
    ) {

      setDocumentNumberError(
        'Please enter a valid 12-digit Aadhaar number.'
      );


      hasError =
        true;

    }


    else if (
      selectedDocument ===
      'PAN'
      &&
      !isValidPan(
        cleanedDocumentNumber
      )
    ) {

      setDocumentNumberError(
        'Please enter a valid PAN number.'
      );


      hasError =
        true;

    }


    /*
     * EXPIRY DATE
     */

    if (
      requiresExpiryDate
      &&
      !expiryDate.trim()
    ) {

      setExpiryDateError(
        'Please enter the expiry date.'
      );


      hasError =
        true;

    }


    if (
      hasError
    ) {

      return;

    }


    /*
     * Next:
     * Capture the physical
     * identity document.
     */

    router.push({

      pathname:
        '/auth/kyc/document-capture',

      params: {

        documentType:
          selectedDocument ??
          'AADHAAR',

        documentNumber:
          selectedDocument ===
          'AADHAAR'

            ? documentNumber
                .trim()

            : cleanedDocumentNumber,

        expiryDate:
          requiresExpiryDate

            ? expiryDate.trim()

            : '',

        captureCount:
          selectedDocument ===
          'AADHAAR'
          ||
          selectedDocument ===
          'PASSPORT'
            ? '2'
            : '1',

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
          Document details
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
        keyboardShouldPersistTaps={
          'handled'
        }
      >


        {/* TITLE */}

        <Text
          style={
            s.title
          }
        >
          {getDocumentTitle()}
        </Text>


        <Text
          style={
            s.subtitle
          }
        >
          {getDocumentDescription()}
        </Text>


        {/* FORM */}

        <View
          style={
            s.formCard
          }
        >


          {/* DOCUMENT NUMBER */}

          <Text
            style={
              s.label
            }
          >
            {getDocumentNumberLabel()}
          </Text>


          <TextInput
            value={
              documentNumber
            }
            onChangeText={
              value => {

                let updatedValue =
                  value;


                /*
                 * Aadhaar should only
                 * contain digits.
                 */

                if (
                  selectedDocument ===
                  'AADHAAR'
                ) {

                  updatedValue =
                    value.replace(
                      /[^0-9]/g,
                      ''
                    );

                }


                setDocumentNumber(
                  updatedValue
                );


                setDocumentNumberError(
                  ''
                );

              }
            }
            placeholder={
              getDocumentNumberPlaceholder()
            }
            placeholderTextColor={
              '#98A2B3'
            }
            autoCapitalize={
              selectedDocument ===
              'AADHAAR'

                ? 'none'

                : 'characters'
            }
            keyboardType={
              selectedDocument ===
              'AADHAAR'

                ? 'numeric'

                : 'default'
            }
            maxLength={
              selectedDocument ===
              'AADHAAR'

                ? 12

                : selectedDocument ===
                  'PAN'

                  ? 10

                  : undefined
            }
            style={[
              s.input,

              documentNumberError
                ?
                s.inputError
                :
                null,
            ]}
          />


          {
            documentNumberError
              ?
              (
                <Text
                  style={
                    s.errorText
                  }
                >
                  {documentNumberError}
                </Text>
              )
              :
              null
          }


          {/* EXPIRY DATE */}

          {
            requiresExpiryDate

              ?

              (

                <View>

                  <Text
                    style={
                      s.label
                    }
                  >
                    Expiry date
                  </Text>


                  <TextInput
                    value={
                      expiryDate
                    }
                    onChangeText={
                      value => {

                        setExpiryDate(
                          value
                        );


                        setExpiryDateError(
                          ''
                        );

                      }
                    }
                    placeholder={
                      'DD / MM / YYYY'
                    }
                    placeholderTextColor={
                      '#98A2B3'
                    }
                    keyboardType={
                      'numeric'
                    }
                    maxLength={
                      10
                    }
                    style={[
                      s.input,

                      expiryDateError
                        ?
                        s.inputError
                        :
                        null,
                    ]}
                  />


                  {
                    expiryDateError
                      ?
                      (
                        <Text
                          style={
                            s.errorText
                          }
                        >
                          {expiryDateError}
                        </Text>
                      )
                      :
                      null
                  }

                </View>

              )

              :

              null
          }


        </View>


        {/* SECURITY INFORMATION */}

        <View
          style={
            s.securityCard
          }
        >

          <View
            style={
              s.securityIconContainer
            }
          >

            <Text
              style={
                s.securityIcon
              }
            >
              🔒
            </Text>

          </View>


          <View
            style={
              s.securityTextContainer
            }
          >

            <Text
              style={
                s.securityTitle
              }
            >
              Your information is secure
            </Text>


            <Text
              style={
                s.securityDescription
              }
            >
              Your document information is
              securely processed only for
              identity verification.
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
            Continue
          </Text>

        </TouchableOpacity>


      </ScrollView>


      <Modal
        visible={
          isExpiryDatePickerVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setIsExpiryDatePickerVisible(
            false
          )
        }
      >

        <View
          style={
            s.datePickerOverlay
          }
        >

          <View
            style={
              s.datePickerCard
            }
          >

            <DateTimePicker
              value={
                expiryDateValue
              }
              mode="date"
              display="calendar"
              minimumDate={
                new Date()
              }
              onChange={
                handleExpiryDateChange
              }
            />

            <TouchableOpacity
              style={
                s.datePickerDoneButton
              }
              onPress={() =>
                setIsExpiryDatePickerVisible(
                  false
                )
              }
            >

              <Text
                style={
                  s.datePickerDoneText
                }
              >
                Done
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>


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
     * FORM
     */

    formCard: {
      marginTop:
        28,

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


    label: {
      marginBottom:
        8,

      fontSize:
        13,

      fontWeight:
        '800',

      color:
        navy,
    },


    input: {
      height:
        54,

      paddingHorizontal:
        16,

      marginBottom:
        20,

      borderRadius:
        14,

      borderWidth:
        1,

      borderColor:
        '#DDE1E6',

      backgroundColor:
        '#FFFFFF',

      fontSize:
        15,

      color:
        navy,
    },


    datePickerButton: {
      justifyContent:
        'center',
    },


    datePickerText: {
      fontSize:
        15,

      color:
        navy,
    },


    datePickerPlaceholder: {
      color:
        '#98A2B3',
    },


    datePickerOverlay: {
      flex:
        1,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        'rgba(7, 26, 45, 0.35)',
    },


    datePickerCard: {
      padding:
        20,

      borderRadius:
        20,

      backgroundColor:
        '#FFFFFF',
    },


    datePickerDoneButton: {
      height:
        48,

      marginTop:
        12,

      borderRadius:
        14,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        gold,
    },


    datePickerDoneText: {
      fontSize:
        15,

      fontWeight:
        '800',

      color:
        navy,
    },


    inputError: {
      borderColor:
        dangerRed,
    },


    errorText: {
      marginTop:
        -12,

      marginBottom:
        16,

      fontSize:
        12,

      color:
        dangerRed,
    },


    /*
     * SECURITY
     */

    securityCard: {
      flexDirection:
        'row',

      marginTop:
        20,

      padding:
        16,

      borderRadius:
        18,

      backgroundColor:
        '#EEF4FF',
    },


    securityIconContainer: {
      width:
        38,

      height:
        38,

      borderRadius:
        19,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        '#FFFFFF',
    },


    securityIcon: {
      fontSize:
        17,
    },


    securityTextContainer: {
      flex:
        1,

      marginLeft:
        12,
    },


    securityTitle: {
      fontSize:
        13,

      fontWeight:
        '800',

      color:
        navy,
    },


    securityDescription: {
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