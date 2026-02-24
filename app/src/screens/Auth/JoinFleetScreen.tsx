import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
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
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import BarcodeMask from 'react-native-barcode-mask';
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
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const handleJoin = async () => {
    if (!accessCode) {
      Alert.alert('Error', 'Please enter an identity token.');
      return;
    }

    setLoading(true);
    try {
      // Manual join requires knowing the starshipId and crewId too?
      // For manual join, we might need a different approach or the code includes them.
      // If it's just the 6-char code, we'd need to search for it.
      // But the user's manual entry is just "accessCode".
      // Let's assume for now manual join is not fully implemented or uses a different service method.
      console.log('Manual join attempted with code:', accessCode);
      Alert.alert(
        'Manual Join',
        'Manual entry requires a full token. Please use QR scan for now.',
      );
    } catch (error: any) {
      Alert.alert('Join Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScannedData = async (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.s && parsed.c && parsed.t) {
        setLoading(true);
        await starshipService.joinStarshipAsCrew(parsed.s, parsed.c, parsed.t);
        // Navigation happens via auth state change
      } else {
        setAccessCode(data);
        setIsScanning(false);
      }
    } catch {
      setAccessCode(data);
      setIsScanning(false);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0 && isScanning && !loading) {
        const value = codes[0].value;
        if (value) {
          handleScannedData(value);
        }
      }
    },
  });

  const startScanning = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Camera permission is required to scan QR codes.',
        );
        return;
      }
    }
    setIsScanning(true);
  };

  if (isScanning && device) {
    return (
      <View style={styles.scannerContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
        <BarcodeMask
          edgeColor={Colors.cyan}
          showAnimatedLine={true}
          width={250}
          height={250}
        />
        <SafeAreaView style={styles.scannerOverlay}>
          <SciFiButton
            title="Cancel Scan"
            onPress={() => setIsScanning(false)}
            variant="secondary"
            style={styles.cancelScanButton}
          />
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
                  title={loading ? 'Processing...' : 'Join Family'}
                  onPress={handleJoin}
                  variant="primary"
                  disabled={loading}
                  icon={
                    loading ? (
                      <ActivityIndicator
                        size="small"
                        color={Colors.white}
                        style={styles.buttonIcon}
                      />
                    ) : (
                      <Ship
                        color={Colors.white}
                        size={18}
                        style={styles.buttonIcon}
                      />
                    )
                  }
                />

                <View style={styles.divider}>
                  <View style={styles.line} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.line} />
                </View>

                <SciFiButton
                  title="Scan QR Code"
                  onPress={startScanning}
                  variant="secondary"
                  icon={
                    <QrCode
                      color={Colors.cyan}
                      size={18}
                      style={styles.buttonIcon}
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
    gap: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(0, 255, 255, 0.4)',
    paddingHorizontal: 16,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scannerOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cancelScanButton: {
    width: '100%',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default JoinFleetScreen;
