import {
  Stack,
  useRouter,
} from 'expo-router';

import {
  SafeAreaView,
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

export default function PanDetailsScreen() {
  const router = useRouter();
  const [panNumber, setPanNumber] = useState('');
  const [error, setError] = useState('');

  function handleContinue() {
    const normalizedPan = panNumber.trim().toUpperCase();

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedPan)) {
      setError('Please enter a valid PAN number.');
      return;
    }

    router.push({
      pathname: '/auth/kyc/document-capture',
      params: {
        documentType: 'PAN_CARD',
        documentNumber: normalizedPan,
        nextStep: 'DOCUMENT_SELECTION',
      },
    });
  }

  function handleSkip() {
    router.push({
      pathname: '/auth/kyc/document-choice',
      params: { panSkipped: 'true' },
    });
  }

  return (
    <SafeAreaView style={s.page}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={s.header}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <Text style={s.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>PAN details</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={s.icon}>
          <Text style={s.iconText}>PAN</Text>
        </View>

        <Text style={s.title}>Enter your PAN details</Text>
        <Text style={s.subtitle}>
          Add your PAN number to continue with identity verification.
        </Text>

        <View style={s.card}>
          <Text style={s.label}>PAN number</Text>
          <TextInput
            value={panNumber}
            onChangeText={value => {
              setPanNumber(value.toUpperCase());
              setError('');
            }}
            placeholder="Enter your PAN number"
            placeholderTextColor="#98A2B3"
            autoCapitalize="characters"
            maxLength={10}
            style={[s.input, error ? s.inputError : null]}
          />
          {error ? <Text style={s.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity style={s.primaryButton} onPress={handleContinue}>
          <Text style={s.primaryButtonText}>Continue to capture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.skipButton} onPress={handleSkip}>
          <Text style={s.skipText}>Do not have PAN number</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: pageBackground },
  header: {
    height: 62,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
  },
  backButtonText: { marginTop: -3, fontSize: 32, color: navy },
  headerTitle: { fontSize: 16, fontWeight: '800', color: navy },
  headerSpacer: { width: 40 },
  content: { padding: 24, paddingTop: 38, paddingBottom: 36 },
  icon: {
    width: 82,
    height: 82,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3D2',
  },
  iconText: { fontSize: 18, fontWeight: '900', color: gold },
  title: { marginTop: 28, fontSize: 30, fontWeight: '800', color: navy },
  subtitle: { marginTop: 10, fontSize: 16, lineHeight: 24, color: '#667085' },
  card: {
    marginTop: 28,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E7E9EC',
    backgroundColor: '#FFFFFF',
  },
  label: { marginBottom: 8, fontSize: 13, fontWeight: '800', color: navy },
  input: {
    height: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDE1E6',
    fontSize: 15,
    color: navy,
  },
  inputError: { borderColor: dangerRed },
  errorText: { marginTop: 8, fontSize: 12, color: dangerRed },
  primaryButton: {
    height: 56,
    marginTop: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gold,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '800', color: navy },
  skipButton: { height: 52, marginTop: 12, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontSize: 15, fontWeight: '800', color: navy },
});
