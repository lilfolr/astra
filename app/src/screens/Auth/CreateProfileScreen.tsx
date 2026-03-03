import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../App';
import SciFiBackground from '../../components/SciFiBackground';
import SciFiButton from '../../components/SciFiButton';
import SciFiInput from '../../components/SciFiInput';
import Colors from '../../theme/colors';
import { UserCircle, Rocket } from 'lucide-react-native';
import { getAuth } from '@react-native-firebase/auth';
import { serverTimestamp } from '@react-native-firebase/firestore';
import { starshipService } from '../../data';

type CreateProfileScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'CreateProfile'
>;

interface Props {
  navigation: CreateProfileScreenNavigationProp;
}

const CreateProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const starshipId = currentUser.uid; // Use UID as starshipId for new captains

      // 1. Create the starship document
      await starshipService.createStarship(starshipId, {
        starshipId,
        primaryCaptainId: currentUser.uid,
        name: `${name}'s Starship`,
        hullIntegrity: 100,
        incompleteMissionCount: 0,
        status: 'nominal',
        lastUpdate: serverTimestamp(),
      });

      // 2. Create the captain's crew profile
      await starshipService.addCrewMember(starshipId, {
        uid: currentUser.uid,
        name: name.trim(),
        role: 'captain',
        credits: 0,
        xp: 0,
        level: 1,
        createdDate: Date.now(),
        registrationCode: '',
        registrationCodeExpiry: 0,
        status: 'stable',
        lastSeen: Date.now(),
      });

      // 3. Link user to starship (redundant but ensures mapping exists)
      await starshipService.linkUserToStarship(currentUser.uid, starshipId);

      navigation.replace('CommandDeck');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Setup Failed', error.message);
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
          >
            <View style={styles.content}>
              <UserCircle
                color={Colors.cyan}
                size={80}
                style={{ marginBottom: 20 }}
              />
              <Text style={styles.title}>CREATE PROFILE</Text>
              <Text style={styles.subtitle}>[ STEP 2: SETUP ]</Text>
              <Text style={styles.description}>
                Welcome, Captain. Please enter your name to initialize your
                starship's command systems.
              </Text>

              <View style={styles.form}>
                <SciFiInput
                  label="CAPTAIN NAME"
                  placeholder="Enter your name..."
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  icon={
                    <UserCircle color={Colors.cyan} size={18} opacity={0.5} />
                  }
                />

                <SciFiButton
                  title={loading ? 'INITIALIZING...' : 'START MISSION'}
                  onPress={handleCreateProfile}
                  variant="primary"
                  icon={
                    <Rocket
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  form: {
    width: '100%',
    gap: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 24,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
});

export default CreateProfileScreen;
