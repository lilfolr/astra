import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { Key, ArrowLeft, Ship } from 'lucide-react-native';

type JoinFleetScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'JoinFleet'
>;

interface Props {
  navigation: JoinFleetScreenNavigationProp;
}

const JoinFleetScreen: React.FC<Props> = ({ navigation }) => {
  const [accessCode, setAccessCode] = useState('');

  const handleJoin = () => {
    console.log('Joining fleet with code:', accessCode);
    navigation.navigate('CreateProfile');
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
              <Text style={styles.headerTitle}>JOIN FAMILY</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.description}>
                Enter the invite code provided by your parent to join your
                family.
              </Text>

              <SciFiInput
                label="Invite Code"
                placeholder="ACCESS CODE"
                value={accessCode}
                onChangeText={setAccessCode}
                autoCapitalize="characters"
                icon={<Key color={Colors.cyan} size={18} opacity={0.5} />}
              />

              <View style={styles.actions}>
                <SciFiButton
                  title="Join Family"
                  onPress={handleJoin}
                  variant="primary"
                  icon={
                    <Ship
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
    marginTop: 20,
  },
});

export default JoinFleetScreen;
