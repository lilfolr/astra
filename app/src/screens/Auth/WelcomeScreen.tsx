import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../App';
import SciFiBackground from '../../components/SciFiBackground';
import SciFiButton from '../../components/SciFiButton';
import Colors from '../../theme/colors';
import { Orbit, Zap, Terminal } from 'lucide-react-native';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
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
            <Orbit color={Colors.cyan} size={16} opacity={0.8} />
            <Text style={styles.headerText}>NET: SECURE</Text>
          </View>
          <Text style={styles.headerText}>ASTRA OS v4.2</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Reactor Core Graphic */}
          <View style={styles.reactorContainer}>
            <Animated.View
              style={[
                styles.reactorRing,
                { transform: [{ scale: pulseAnim }], opacity: 0.3 }
              ]}
            />
            <View style={[styles.reactorRing, styles.reactorRingInner]} />
            <View style={styles.coreIconContainer}>
              <Zap color={Colors.cyan} size={48} />
            </View>
          </View>

          <View style={styles.titles}>
            <Text style={styles.title}>NEURAL LINK</Text>
            <Text style={styles.subtitle}>INITIALIZING CONNECTION...</Text>
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
        <View style={styles.terminal}>
          <View style={styles.terminalHeader}>
            <Terminal color={Colors.cyan} size={14} opacity={0.6} />
            <Text style={styles.terminalText}>
              <Text style={{ color: Colors.cyan }}>SHIP_AI:</Text> Awaiting instructions to bridge neural link.
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
    color: Colors.white,
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
    borderColor: 'rgba(13, 185, 242, 0.2)',
  },
  reactorRingInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderStyle: 'dashed',
    borderColor: 'rgba(13, 185, 242, 0.3)',
  },
  coreIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(11, 11, 11, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(13, 185, 242, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: Colors.cyan,
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.5,
    // shadowRadius: 20,
    // elevation: 10,
  },
  titles: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(13, 185, 242, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: 'rgba(13, 185, 242, 0.7)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  terminalText: {
    color: 'rgba(13, 185, 242, 0.6)',
    fontSize: 10,
    fontFamily: 'monospace',
    lineHeight: 14,
  },
});

export default WelcomeScreen;
