import {
  Stack,
  useRouter,
} from 'expo-router';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';

import {
  useState,
} from 'react';

import {
  useAuth,
} from '../../../context/AuthContext';

import { colors } from '../../../src/theme/colors';

const { gold, navy, pageBackground, dangerRed } = colors;


export default function PersonalDetailsScreen() {


  const router =
    useRouter();


  const {
    user,
  } =
    useAuth();


  /*
   * Personal information.
   *
  * Name is prefilled from the
  * authenticated account when available.
   */

  const [
    fullName,
    setFullName,
  ] =
    useState(
      user?.fullName || ''
    );


  const [
    dateOfBirth,
    setDateOfBirth,
  ] =
    useState(
      ''
    );


  const [
    dateOfBirthValue,
    setDateOfBirthValue,
  ] = useState(
    new Date(
      2000,
      0,
      1
    )
  );


  const [
    isDateOfBirthPickerVisible,
    setIsDateOfBirthPickerVisible,
  ] = useState(false);


  const [
    address,
    setAddress,
  ] =
    useState(
      ''
    );


  /*
   * Validation errors.
   */

  const [
    fullNameError,
    setFullNameError,
  ] =
    useState(
      ''
    );


  const [
    dateOfBirthError,
    setDateOfBirthError,
  ] =
    useState(
      ''
    );


  const [
    addressError,
    setAddressError,
  ] =
    useState(
      ''
    );


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


  function handleDateOfBirthChange(
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) {

    setIsDateOfBirthPickerVisible(false);


    if (
      event.type !==
      'set'
      ||
      !selectedDate
    ) {

      return;

    }


    setDateOfBirthValue(
      selectedDate
    );

    setDateOfBirth(
      formatDate(
        selectedDate
      )
    );

    setDateOfBirthError(
      ''
    );

  }


  function handleContinue() {


    /*
     * Reset errors.
     */

    setFullNameError(
      ''
    );


    setDateOfBirthError(
      ''
    );


    setAddressError(
      ''
    );


    let hasError =
      false;


    if (
      !fullName.trim()
    ) {

      setFullNameError(
        'Please enter your full name.'
      );

      hasError =
        true;

    }


    if (
      !dateOfBirth.trim()
    ) {

      setDateOfBirthError(
        'Please enter your date of birth.'
      );

      hasError =
        true;

    }


    if (
      !address.trim()
    ) {

      setAddressError(
        'Please enter your residential address.'
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
     * Later this information will
     * be stored through the KYC API.
     *
     * For the frontend flow,
     * continue to document selection.
     */

    router.push(
      '/auth/kyc/pan-details'
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
          Personal details
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
          Tell us about yourself
        </Text>


        <Text
          style={
            s.subtitle
          }
        >
          Please make sure your details
          match your government-issued
          identity document.
        </Text>


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
            value={
              fullName
            }
            onChangeText={
              value => {

                setFullName(
                  value
                );

                setFullNameError(
                  ''
                );

              }
            }
            placeholder={
              'Enter your full legal name'
            }
            placeholderTextColor={
              '#98A2B3'
            }
            style={[
              s.input,

              fullNameError
                ?
                s.inputError
                :
                null,
            ]}
          />


          {
            fullNameError
              ?
              (
                <Text
                  style={
                    s.errorText
                  }
                >
                  {fullNameError}
                </Text>
              )
              :
              null
          }


          {/* DATE OF BIRTH */}

          <Text
            style={
              s.label
            }
          >
            Date of birth
          </Text>


          <TouchableOpacity
            activeOpacity={
              0.8
            }
            style={[
              s.input,
              s.datePickerButton,

              dateOfBirthError
                ?
                s.inputError
                :
                null,
            ]}
            onPress={() =>
              setIsDateOfBirthPickerVisible(
                true
              )
            }
          >

            <Text
              style={[
                s.datePickerText,

                !dateOfBirth
                  ?
                  s.datePickerPlaceholder
                  :
                  null,
              ]}
            >
              {dateOfBirth || 'DD / MM / YYYY'}
            </Text>

          </TouchableOpacity>


          {
            dateOfBirthError
              ?
              (
                <Text
                  style={
                    s.errorText
                  }
                >
                  {dateOfBirthError}
                </Text>
              )
              :
              null
          }


          {/* ADDRESS */}

          <Text
            style={
              s.label
            }
          >
            Residential address
          </Text>


          <TextInput
            value={
              address
            }
            onChangeText={
              value => {

                setAddress(
                  value
                );

                setAddressError(
                  ''
                );

              }
            }
            placeholder={
              'Enter your residential address'
            }
            placeholderTextColor={
              '#98A2B3'
            }
            multiline={
              true
            }
            textAlignVertical={
              'top'
            }
            style={[
              s.input,
              s.addressInput,

              addressError
                ?
                s.inputError
                :
                null,
            ]}
          />


          {
            addressError
              ?
              (
                <Text
                  style={
                    s.errorText
                  }
                >
                  {addressError}
                </Text>
              )
              :
              null
          }


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
            ℹ
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
              Why do we need this?
            </Text>


            <Text
              style={
                s.infoDescription
              }
            >
              Your details help us verify
              your identity and keep your
              AurumPay account secure.
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
          isDateOfBirthPickerVisible
        }
        transparent
        animationType="fade"
        onRequestClose={() =>
          setIsDateOfBirthPickerVisible(
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
                dateOfBirthValue
              }
              mode="date"
              display="calendar"
              maximumDate={
                new Date()
              }
              onChange={
                handleDateOfBirthChange
              }
            />

            <TouchableOpacity
              style={
                s.datePickerDoneButton
              }
              onPress={() =>
                setIsDateOfBirthPickerVisible(
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
      minHeight:
        54,

      paddingHorizontal:
        16,

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

      marginBottom:
        20,
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


    addressInput: {
      height:
        104,

      paddingTop:
        15,
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
     * INFO
     */

    infoCard: {
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


    infoIcon: {
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
        17,

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


    primaryButtonText: {
      fontSize:
        16,

      fontWeight:
        '800',

      color:
        navy,
    },


  });