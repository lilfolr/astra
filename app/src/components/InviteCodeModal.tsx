import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { X } from 'lucide-react-native';
import Colors from '../theme/colors';
import SciFiButton from './SciFiButton';

interface InviteCodeModalProps {
  visible: boolean;
  onClose: () => void;
  starshipId: string;
  registrationCode: string;
  expiry: number;
  memberName: string;
}

const InviteCodeModal: React.FC<InviteCodeModalProps> = ({
  visible,
  onClose,
  starshipId,
  registrationCode,
  expiry,
  memberName,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 10000); // Update every 10 seconds
    return () => clearInterval(timer);
  }, []);

  const qrData = JSON.stringify({
    starshipId,
    code: registrationCode,
  });

  const timeLeft = Math.max(0, Math.floor((expiry - now) / 60000));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>INVITE CODE: {memberName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={Colors.white} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={qrData}
                size={200}
                color={Colors.cyan}
                backgroundColor="transparent"
              />
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.codeLabel}>MANUAL ENTRY CODE:</Text>
            <Text style={styles.codeValue}>{registrationCode}</Text>
            <Text style={styles.expiryText}>
              EXPIRES IN: {timeLeft} MINUTES
            </Text>
          </View>

          <SciFiButton title="DONE" onPress={onClose} variant="primary" />
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cyan,
    width: '100%',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 4,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(13, 185, 242, 0.3)',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  codeLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  codeValue: {
    color: Colors.cyan,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 8,
    marginBottom: 12,
  },
  expiryText: {
    color: Colors.neonOrange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

export default InviteCodeModal;
