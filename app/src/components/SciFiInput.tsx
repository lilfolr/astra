import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import Colors from '../theme/colors';

interface SciFiInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
}

const SciFiInput: React.FC<SciFiInputProps> = ({ label, icon, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <View style={styles.inputWrapper}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
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
    color: 'rgba(0, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 30, 35, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(13, 185, 242, 0.2)',
    height: 56,
    paddingHorizontal: 12,
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default SciFiInput;
