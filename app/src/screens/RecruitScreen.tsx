import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../App';
import SciFiBackground from '../components/SciFiBackground';
import SciFiButton from '../components/SciFiButton';
import SciFiInput from '../components/SciFiInput';
import Colors from '../theme/colors';
import { ArrowLeft, UserPlus } from 'lucide-react-native';
import { starshipService, type Crew } from '../data';
import { getAuth } from '@react-native-firebase/auth';

type RecruitScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Recruit'
>;

interface Props {
  navigation: RecruitScreenNavigationProp;
}

const RecruitScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecruit = async () => {
    if (!name) {
      Alert.alert('Error', 'Please provide a Unit Name.');
      return;
    }

    setLoading(true);
    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found.');
      }

      const starship = await starshipService.getStarshipByCaptainId(
        currentUser.uid,
      );
      const starshipId = starship?.starshipId || currentUser.uid;

      const registrationCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const registrationCodeExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;

      const newCrew: Crew = {
        name,
        role: 'crew',
        credits: 0,
        xp: 0,
        level: 1,
        createdDate: Date.now(),
        registrationCode,
        registrationCodeExpiry,
        status: 'pending',
        lastSeen: Date.now(),
      };

      await starshipService.addCrewMember(starshipId, newCrew);
      Alert.alert('Success', `${name} has been added!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Recruitment failed:', error);
      Alert.alert('Failed to add member', error.message);
    } finally {
      setLoading(false);
    }
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
              <Text style={styles.headerTitle}>ADD FAMILY MEMBER</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.description}>
                Add a new member to your family below.
              </Text>

              <SciFiInput
                label="Name"
                placeholder="Enter Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <View style={styles.actions}>
                <SciFiButton
                  title={loading ? 'ADDING...' : 'ADD MEMBER'}
                  onPress={handleRecruit}
                  variant="primary"
                  disabled={loading}
                  icon={
                    <UserPlus
                      color={Colors.white}
                      size={18}
                      style={{ marginLeft: 8 }}
                    />
                  }
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
