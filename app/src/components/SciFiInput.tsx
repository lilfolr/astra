import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface SciFiInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
}

const SciFiInput: React.FC<SciFiInputProps> = ({ label, icon, ...props }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.dark ? 'rgba(0, 255, 255, 0.7)' : theme.colors.primary }]}>
        {label.toUpperCase()}
      </Text>
      <View style={[styles.inputWrapper, {
        backgroundColor: theme.colors.inputBg,
        borderColor: theme.colors.border
      }]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.placeholder}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 56,
    paddingHorizontal: 12,
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default SciFiInput;
