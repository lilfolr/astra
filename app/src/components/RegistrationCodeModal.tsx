import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { X, RefreshCcw } from 'lucide-react-native';
import Colors from '../theme/colors';
import { starshipService } from '../data';

interface RegistrationCodeModalProps {
  visible: boolean;
  onClose: () => void;
  starshipId: string;
  crewId: string;
}

const RegistrationCodeModal: React.FC<RegistrationCodeModalProps> = ({
  visible,
  onClose,
  starshipId,
  crewId,
}) => {
  const [code, setCode] = useState('');
  const [expiry, setExpiry] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const updateTimer = () => {
      const remaining = expiry - Date.now();
      if (remaining <= 0) {
        setTimeLeft('EXPIRED');
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [expiry, visible]);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await starshipService.refreshRegistrationCode(
        starshipId,
        crewId,
      );
      setCode(result.registrationCode);
      setExpiry(result.registrationCodeExpiry);
    } catch (error) {
      console.error('Failed to refresh code:', error);
    } finally {
      setLoading(false);
    }
  }, [crewId, starshipId]);

  useEffect(() => {
    if (visible) {
      handleRefresh();
    }
  }, [visible, handleRefresh]);

  const qrData = JSON.stringify({
    s: starshipId,
    c: crewId,
    t: code,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color={Colors.white} size={24} />
          </TouchableOpacity>

          <Text style={styles.title}>REGISTRATION TOKEN</Text>
          <Text style={styles.subtitle}>SCAN TO JOIN FLEET</Text>

          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <QRCode value={qrData} size={200} backgroundColor="transparent" />
            </View>
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color={Colors.cyan} size="large" />
              </View>
            )}
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>MANUAL OVERRIDE CODE</Text>
            <Text style={styles.codeValue}>{code}</Text>
          </View>

          <View style={styles.expiryContainer}>
            <Text style={styles.expiryLabel}>EXPIRY</Text>
            <Text
              style={[
                styles.expiryValue,
                timeLeft === 'EXPIRED' && { color: Colors.neonOrange },
              ]}
            >
              {timeLeft}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={loading}
          >
            <RefreshCcw
              color={Colors.cyan}
              size={18}
              style={[styles.refreshIcon, loading && styles.disabledIcon]}
            />
            <Text style={styles.refreshButtonText}>
              {loading ? 'RE-ESTABLISHING...' : 'REFRESH SIGNAL'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'rgba(16, 30, 34, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cyan,
    width: '100%',
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  title: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 8,
  },
  subtitle: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 24,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 24,
    position: 'relative',
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 30, 34, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  codeLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  codeValue: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
  },
  expiryContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  expiryLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  expiryValue: {
    color: Colors.cyan,
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  refreshIcon: {
    marginRight: 8,
  },
  disabledIcon: {
    opacity: 0.5,
  },
});

export default RegistrationCodeModal;
