import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface SciFiButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const SciFiButton: React.FC<SciFiButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  icon
}) => {
  const { theme } = useTheme();
  const isPrimary = variant === 'primary';

  const primaryButtonStyle = {
    backgroundColor: theme.dark ? 'rgba(0, 255, 255, 0.1)' : 'rgba(0, 113, 113, 0.1)',
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
  };

  const secondaryButtonStyle = {
    backgroundColor: theme.colors.glass,
    borderColor: theme.colors.border,
  };

  const primaryTextStyle = {
    color: theme.colors.primary,
  };

  const secondaryTextStyle = {
    color: theme.colors.text,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        isPrimary ? primaryButtonStyle : secondaryButtonStyle,
        style
      ]}
    >
      <Text style={[
        styles.text,
        isPrimary ? primaryTextStyle : secondaryTextStyle,
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
  text: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default SciFiButton;
