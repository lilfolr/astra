import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../App';
import SciFiBackground from '../../components/SciFiBackground';
import SciFiButton from '../../components/SciFiButton';
import SciFiInput from '../../components/SciFiInput';
import Colors from '../../theme/colors';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('CreateProfile');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Authentication Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      navigation.navigate('CreateProfile');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <SciFiButton
              title=""
              onPress={() => navigation.goBack()}
              variant="secondary"
              style={styles.backButton}
              icon={<ArrowLeft color={Colors.white} size={20} />}
            />
            <Text style={styles.headerTitle}>SECURE AUTHENTICATION</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.description}>
              Enter your credentials to establish a new fleet uplink.
            </Text>

            <SciFiInput
              label="Fleet_Admin_Email"
              placeholder="admin@astra.link"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Mail color={Colors.cyan} size={18} opacity={0.5} />}
            />

            <SciFiInput
              label="Access_Key"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Lock color={Colors.cyan} size={18} opacity={0.5} />}
            />

            <View style={styles.actions}>
              <SciFiButton
                title={loading ? "Authenticating..." : "Board Ship"}
                onPress={handleLogin}
                variant="primary"
                icon={<LogIn color={Colors.white} size={18} style={{ marginLeft: 8 }} />}
              />
              <SciFiButton
                title="Register New Account"
                onPress={handleSignUp}
                variant="secondary"
              />
            </View>
          </View>
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
    paddingHorizontal: 24,
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
    gap: 12,
  },
});

export default LoginScreen;
