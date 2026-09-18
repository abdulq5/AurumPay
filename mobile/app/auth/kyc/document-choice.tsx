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

import { useState } from 'react';

import { colors } from '../../../src/theme/colors';

const { gold, navy, pageBackground } = colors;

type DocumentType = 'AADHAAR' | 'DRIVING_LICENSE' | 'VOTER_ID' | 'PASSPORT';

const documents: Array<{ type: DocumentType; title: string; description: string }> = [
  { type: 'AADHAAR', title: 'Aadhaar', description: 'Aadhaar identity card' },
  { type: 'DRIVING_LICENSE', title: 'Driving licence', description: 'Government-issued driving licence' },
  { type: 'VOTER_ID', title: 'Voter ID', description: 'Election identity card' },
  { type: 'PASSPORT', title: 'Passport', description: 'Valid passport issued by your country' },
];

export default function DocumentChoiceScreen() {
  const router = useRouter();
  const { panSkipped } = useLocalSearchParams<{ panSkipped?: string }>();
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);

  function handleContinue() {
    if (!selectedDocument) return;

    router.push({
      pathname: '/auth/kyc/document-details',
      params: {
        documentType: selectedDocument,
        panSkipped: panSkipped ?? 'false',
      },
    });
  }

  return (
    <SafeAreaView style={s.page}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={s.header}>
        <TouchableOpacity style={s.backButton} onPress={() => router.back()}>
          <Text style={s.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Choose your document</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.title}>Choose your document</Text>
        <Text style={s.subtitle}>Select one document to continue verification.</Text>

        <View style={s.list}>
          {documents.map(document => {
            const isSelected = selectedDocument === document.type;
            return (
              <TouchableOpacity
                key={document.type}
                style={[s.documentCard, isSelected ? s.selectedCard : null]}
                onPress={() => setSelectedDocument(document.type)}
              >
                <View style={s.documentIcon}>
                  <Text style={s.documentIconText}>{document.title.slice(0, 2).toUpperCase()}</Text>
                </View>
                <View style={s.documentText}>
                  <Text style={s.documentTitle}>{document.title}</Text>
                  <Text style={s.documentDescription}>{document.description}</Text>
                </View>
                <View style={[s.radio, isSelected ? s.radioSelected : null]}>
                  {isSelected ? <View style={s.radioInner} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[s.primaryButton, !selectedDocument ? s.disabledButton : null]}
          disabled={!selectedDocument}
          onPress={handleContinue}
        >
          <Text style={s.primaryButtonText}>Continue</Text>
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
  content: { padding: 24, paddingTop: 30, paddingBottom: 36 },
  title: { fontSize: 28, fontWeight: '800', color: navy },
  subtitle: { marginTop: 10, fontSize: 15, lineHeight: 23, color: '#667085' },
  list: { marginTop: 28, gap: 14 },
  documentCard: {
    minHeight: 90,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E9EC',
    backgroundColor: '#FFFFFF',
  },
  selectedCard: { borderColor: gold, borderWidth: 2, backgroundColor: '#FFFDF7' },
  documentIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3D2',
  },
  documentIconText: { fontSize: 14, fontWeight: '800', color: gold },
  documentText: { flex: 1, marginLeft: 14, marginRight: 10 },
  documentTitle: { fontSize: 16, fontWeight: '800', color: navy },
  documentDescription: { marginTop: 5, fontSize: 12, lineHeight: 18, color: '#667085' },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: gold },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: gold },
  primaryButton: {
    height: 56,
    marginTop: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gold,
  },
  disabledButton: { backgroundColor: '#E4E7EC' },
  primaryButtonText: { fontSize: 16, fontWeight: '800', color: navy },
});
