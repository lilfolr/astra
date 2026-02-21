import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../App';
import SciFiBackground from '../../components/SciFiBackground';
import SciFiButton from '../../components/SciFiButton';
import { useTheme } from '../../theme/ThemeContext';
import { UserCircle } from 'lucide-react-native';

type CreateProfileScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'CreateProfile'>;

interface Props {
  navigation: CreateProfileScreenNavigationProp;
}

const CreateProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <UserCircle color={theme.colors.primary} size={80} style={{ marginBottom: 20 }} />
          <Text style={[styles.title, { color: theme.colors.text }]}>CREATE PROFILE</Text>
          <Text style={[styles.subtitle, { color: theme.colors.primary }]}>[ STAGE 2: BIOMETRIC INITIALIZATION ]</Text>
          <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
            This screen is under construction. Your neural link is being established.
          </Text>
          <SciFiButton
            title="Proceed to Command Deck"
            onPress={() => navigation.navigate('CommandDeck')}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    </SciFiBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 24,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
});

export default CreateProfileScreen;
