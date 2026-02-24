import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import SciFiBackground from '../components/SciFiBackground';
import {
  Rocket,
  Settings,
  ClipboardList,
  Users,
  ShoppingBag,
  CircleDollarSign,
  Zap,
} from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../App';

type CommandDeckScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'CommandDeck'
>;

interface Props {
  navigation: CommandDeckScreenNavigationProp;
}

const CommandDeck: React.FC<Props> = ({ navigation }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.deepObsidian}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Rocket color={Colors.cyan} size={24} style={styles.headerIcon} />
              <Text style={styles.title}>DASHBOARD</Text>
            </View>
            <TouchableOpacity>
              <Settings color={Colors.cyan} size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.integrityBarContainer}>
            <View style={styles.integrityBarLabelContainer}>
              <Text style={styles.integrityBarLabel}>HOUSE STATUS</Text>
              <Text style={styles.integrityValue}>85%</Text>
            </View>
            <View style={styles.integrityBarBackground}>
              <View style={[styles.integrityBarFill, { width: '85%' }]} />
            </View>
            <View style={styles.integritySubtextContainer}>
              <Text style={styles.integritySubtext}>ALL GOOD</Text>
              <Animated.Text
                style={[styles.integritySubtext, { opacity: pulseAnim }]}
              >
                PROTECTED
              </Animated.Text>
            </View>
          </View>

          {/* Mission Status Component */}
          <View style={styles.missionSummary}>
            <View style={styles.missionItem}>
              <Text style={styles.missionLabel}>TOTAL CHORES</Text>
              <Text style={styles.missionValue}>12</Text>
            </View>
            <View style={styles.missionDivider} />
            <View style={styles.missionItem}>
              <Text style={styles.missionLabel}>MY CHORES</Text>
              <Text style={styles.missionValue}>3</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Scrolling Ticker */}
          <View style={styles.tickerContainer}>
            <Text style={styles.tickerText} numberOfLines={1}>
              CHECKING HOME... /// MESS DETECTED IN KITCHEN /// EVERYTHING IS
              RUNNING SMOOTHLY /// MESSAGE FROM PARENTS...
            </Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.rankIconContainer}>
                <Zap color={Colors.cyan} size={20} opacity={0.3} />
                <Text style={styles.rankLevel}>L4</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>LEVEL</Text>
                <Text style={styles.statValue}>Junior</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View>
                <Text style={styles.statLabel}>POINTS</Text>
                <Text style={styles.statValue}>450 PTS</Text>
              </View>
              <CircleDollarSign color={Colors.cyan} size={24} />
            </View>
          </View>

          {/* Ship Schematic Placeholder */}
          <View style={styles.schematicContainer}>
            <Text style={styles.schematicTitle}>HOME MAP</Text>
            <View style={styles.schematicPlaceholder}>
              {/* Blank for now */}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem}>
            <View style={[styles.tabIconContainer, styles.activeTabIcon]}>
              <ClipboardList color={Colors.neonOrange} size={24} />
            </View>
            <Text style={styles.tabLabel}>CHORES</Text>
          </TouchableOpacity>
          <View style={styles.tabDivider} />

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('Roster')}
          >
            <View style={styles.tabIconContainer}>
              <Users color={Colors.cyan} size={24} />
            </View>
            <Text style={styles.tabLabel}>FAMILY</Text>
          </TouchableOpacity>
          <View style={styles.tabDivider} />
          <TouchableOpacity style={styles.tabItem}>
            <View style={styles.tabIconContainer}>
              <ShoppingBag color={Colors.cyan} size={24} />
            </View>
            <Text style={styles.tabLabel}>SHOP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SciFiBackground>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    width: '100%',
    marginTop: 20,
  },
  navButton: {
    width: '100%',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.3)',
    backgroundColor: 'rgba(16, 30, 35, 0.8)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  integrityBarContainer: {
    width: '100%',
    marginBottom: 15,
  },
  integrityBarLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  integrityBarLabel: {
    color: 'rgba(0, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  integrityValue: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: 'bold',
  },
  integrityBarBackground: {
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    overflow: 'hidden',
    padding: 2,
  },
  integrityBarFill: {
    height: '100%',
    backgroundColor: Colors.cyan,
    borderRadius: 4,
  },
  integritySubtextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  integritySubtext: {
    color: 'rgba(0, 255, 255, 0.6)',
    fontSize: 8,
    fontWeight: 'bold',
  },
  missionSummary: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderRadius: 4,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.1)',
  },
  missionItem: {
    flex: 1,
    alignItems: 'center',
  },
  missionLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 8,
    letterSpacing: 1,
    marginBottom: 2,
  },
  missionValue: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  missionDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  content: {
    padding: 20,
    paddingBottom: 120, // Space for tab bar
  },
  tickerContainer: {
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    paddingVertical: 4,
    marginBottom: 20,
    marginHorizontal: -20, // Bleed to edges
    paddingHorizontal: 20,
  },
  tickerText: {
    color: 'rgba(0, 255, 255, 0.8)',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(16, 30, 35, 0.7)',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  rankIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rankLevel: {
    position: 'absolute',
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(0, 255, 255, 0.6)',
    fontSize: 8,
    letterSpacing: 1,
  },
  statValue: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  schematicContainer: {
    flex: 1,
    minHeight: 300,
  },
  schematicTitle: {
    color: Colors.cyan,
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  schematicPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 80,
    backgroundColor: 'rgba(16, 30, 35, 0.9)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  activeTabIcon: {
    backgroundColor: 'rgba(255, 95, 31, 0.1)',
    borderColor: 'rgba(255, 95, 31, 0.3)',
  },
  tabLabel: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tabDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
  },
});

export default CommandDeck;
