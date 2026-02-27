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
import { AuthStackParamList } from '../../App';
import SciFiBackground from '../../components/SciFiBackground';
import SciFiButton from '../../components/SciFiButton';
import SciFiInput from '../../components/SciFiInput';
import Colors from '../../theme/colors';
import { Key, ArrowLeft, Ship, QrCode } from 'lucide-react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { getAuth, signInAnonymously } from '@react-native-firebase/auth';
import { starshipService } from '../../data';

type JoinFleetScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'JoinFleet'
>;

interface Props {
  navigation: JoinFleetScreenNavigationProp;
}

const JoinFleetScreen: React.FC<Props> = ({ navigation }) => {
  const [accessCode, setAccessCode] = useState('');
  const [starshipId, setStarshipId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0 && codes[0].value) {
        try {
          const data = JSON.parse(codes[0].value);
          if (data.starshipId && data.code) {
            setStarshipId(data.starshipId);
            setAccessCode(data.code);
            setIsScanning(false);
          }
        } catch {
          console.error('Invalid QR code format');
        }
      }
    },
  });

  const handleJoin = async () => {
    if (!accessCode || !starshipId) {
      Alert.alert('Error', 'Please scan an invite QR code.');
      return;
    }

    setLoading(true);
    try {
      // For children joining via QR, we use anonymous auth
      const auth = getAuth();
      let user = auth.currentUser;

      if (!user) {
        const userCredential = await signInAnonymously(auth);
        user = userCredential.user;
      }

      if (!user) throw new Error('Failed to authenticate.');

      // We have starshipId and accessCode from QR code
      await starshipService.joinStarshipWithCode(
        starshipId,
        accessCode,
        user.uid,
      );

      // Success! Navigation will be handled by auth state change
    } catch (error: any) {
      console.error(error);
      Alert.alert('Join Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'granted') {
      setIsScanning(true);
    } else {
      Alert.alert(
        'Permission Denied',
        'Camera permission is required to scan QR codes.',
      );
    }
  };

  if (isScanning && device) {
    return (
      <View style={styles.container}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
        <SafeAreaView style={styles.scannerOverlay}>
          <View style={styles.scannerHeader}>
            <SciFiButton
              title=""
              onPress={() => setIsScanning(false)}
              variant="secondary"
              style={styles.backButton}
              icon={<ArrowLeft color={Colors.white} size={20} />}
            />
            <Text style={styles.headerTitle}>SCAN INVITE QR</Text>
          </View>
          <View style={styles.scannerFinder}>
            <View style={styles.scannerCornerTL} />
            <View style={styles.scannerCornerTR} />
            <View style={styles.scannerCornerBL} />
            <View style={styles.scannerCornerBR} />
          </View>
          <View style={styles.scannerFooter}>
            <Text style={styles.scannerHint}>
              POINT CAMERA AT THE QR CODE ON THE PARENT'S DEVICE
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
                Scan the QR code provided by your parent to join your family.
              </Text>

              <SciFiInput
                label="Starship ID (from QR)"
                placeholder="STARSHIP ID"
                value={starshipId}
                onChangeText={setStarshipId}
                autoCapitalize="none"
                editable={false}
              />

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
                  title="Scan QR Code"
                  onPress={startScanning}
                  variant="secondary"
                  style={{ marginBottom: 12 }}
                  icon={
                    <QrCode
                      color={Colors.white}
                      size={18}
                      style={{ marginRight: 8 }}
                    />
                  }
                />
                <SciFiButton
                  title={loading ? 'Joining...' : 'Join Family'}
                  onPress={handleJoin}
                  variant="primary"
                  disabled={loading}
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
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 24,
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  scannerFinder: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(13, 185, 242, 0.2)',
    position: 'relative',
  },
  scannerCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.cyan,
  },
  scannerCornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.cyan,
  },
  scannerCornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.cyan,
  },
  scannerCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.cyan,
  },
  scannerFooter: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scannerHint: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 8,
  },
});

export default JoinFleetScreen;
