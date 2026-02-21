import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../App';
import SciFiBackground from '../../components/SciFiBackground';
import SciFiButton from '../../components/SciFiButton';
import { useTheme } from '../../theme/ThemeContext';
import { Orbit, Zap, Terminal } from 'lucide-react-native';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const [pulseAnim] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerItem}>
            <Orbit color={theme.colors.primary} size={16} opacity={0.8} />
            <Text style={[styles.headerText, { color: theme.colors.text }]}>NET: SECURE</Text>
          </View>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>ASTRA OS v4.2</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Reactor Core Graphic */}
          <View style={styles.reactorContainer}>
            <Animated.View
              style={[
                styles.reactorRing,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: 0.3,
                  borderColor: theme.colors.border
                }
              ]}
            />
            <View style={[styles.reactorRing, styles.reactorRingInner, { borderColor: theme.colors.border }]} />
            <View style={[styles.coreIconContainer, {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border
            }]}>
              <Zap color={theme.colors.primary} size={48} />
            </View>
          </View>

          <View style={styles.titles}>
            <Text style={[styles.title, { color: theme.colors.text }]}>NEURAL LINK</Text>
            <Text style={[styles.subtitle, { color: theme.colors.primary, opacity: 0.7 }]}>INITIALIZING CONNECTION...</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <SciFiButton
            title="Initialize New Fleet"
            variant="primary"
            onPress={() => navigation.navigate('Signup')}
          />
          <SciFiButton
            title="Join Existing Fleet"
            variant="secondary"
            onPress={() => navigation.navigate('JoinFleet')}
          />
          <SciFiButton
            title="Commander Sign-In"
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
          />
        </View>

        {/* Terminal Log */}
        <View style={[styles.terminal, {
          backgroundColor: theme.dark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)',
          borderTopColor: theme.colors.border
        }]}>
          <View style={styles.terminalHeader}>
            <Terminal color={theme.colors.primary} size={14} opacity={0.6} />
            <Text style={[styles.terminalText, { color: theme.colors.textSecondary }]}>
              <Text style={{ color: theme.colors.primary }}>SHIP_AI:</Text> Awaiting instructions to bridge neural link.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </SciFiBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    opacity: 0.6,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactorContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  reactorRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
  },
  reactorRingInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderStyle: 'dashed',
  },
  coreIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    textAlign: 'center',
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  terminal: {
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  terminalText: {
    fontSize: 10,
    fontFamily: 'monospace',
    lineHeight: 14,
  },
});

export default WelcomeScreen;
