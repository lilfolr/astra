import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Colors from '../theme/colors';

interface SciFiButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const SciFiButton: React.FC<SciFiButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  icon,
  disabled
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        style,
        disabled && styles.disabledButton
      ]}
    >
      <Text style={[
        styles.text,
        isPrimary ? styles.primaryText : styles.secondaryText,
        textStyle
      ]}>
        {title.toUpperCase()}
      </Text>
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: 'rgba(13, 185, 242, 0.1)',
    borderColor: Colors.cyan,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  primaryText: {
    color: Colors.cyan,
  },
  secondaryText: {
    color: Colors.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default SciFiButton;
