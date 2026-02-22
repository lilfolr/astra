import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../App';
import SciFiBackground from '../components/SciFiBackground';
import SciFiButton from '../components/SciFiButton';
import SciFiInput from '../components/SciFiInput';
import Colors from '../theme/colors';
import { ArrowLeft, UserPlus } from 'lucide-react-native';

type RecruitScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Recruit'>;

interface Props {
  navigation: RecruitScreenNavigationProp;
}

const RecruitScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleRecruit = () => {
    // For now, just go back. In a real app, we would save the data.
    navigation.goBack();
  };

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <SciFiButton
                title=""
                onPress={() => navigation.goBack()}
                variant="secondary"
                style={styles.backButton}
                icon={<ArrowLeft color={Colors.white} size={20} />}
              />
              <Text style={styles.headerTitle}>RECRUIT NEW UNIT</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.description}>
                Register a new unit to the Astra Fleet. Enter biometric data below.
              </Text>

              <SciFiInput
                label="Unit Name"
                placeholder="Enter Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <SciFiInput
                label="Unit Age"
                placeholder="Enter Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />

              <View style={styles.actions}>
                <SciFiButton
                  title="RECRUIT UNIT"
                  onPress={handleRecruit}
                  variant="primary"
                  icon={<UserPlus color={Colors.white} size={18} style={{ marginLeft: 8 }} />}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SciFiBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginVertical: 0,
    marginRight: 16,
  },
  headerTitle: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  form: {
    flex: 1,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  actions: {
    marginTop: 40,
  },
});

export default RecruitScreen;
