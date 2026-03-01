import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
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
  Plus,
  ArrowRight,
} from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../App';
import { useModules, useDiscoverStarship } from '../data';

type CommandDeckScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'CommandDeck'
>;

interface Props {
  navigation: CommandDeckScreenNavigationProp;
}

const CommandDeck: React.FC<Props> = ({ navigation }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  const { starshipId, loading: discovering } = useDiscoverStarship();
  const { modules, loading: modulesLoading } = useModules(starshipId);

  const loading = discovering || modulesLoading;

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
              <Text style={styles.integrityBarLabel}>FAMILY STATUS</Text>
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
                STAYING SAFE
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
              Family is doing great! /// New chore assigned in Kitchen ///
              Everyone is active today /// Welcome back!
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
                <Text style={styles.statValue}>Cadet</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View>
                <Text style={styles.statLabel}>POINTS</Text>
                <Text style={styles.statValue}>450 CR</Text>
              </View>
              <CircleDollarSign color={Colors.cyan} size={24} />
            </View>
          </View>

          {/* Ship Schematic / Modules */}
          <View style={styles.schematicContainer}>
            <View style={styles.schematicHeader}>
              <Text style={styles.schematicTitle}>HOME LAYOUT</Text>
              <TouchableOpacity
                style={styles.addModuleButton}
                onPress={() =>
                  starshipId &&
                  navigation.navigate('ModuleForm', { starshipId })
                }
              >
                <Plus color={Colors.deepObsidian} size={14} />
                <Text style={styles.addModuleButtonText}>ADD ROOM</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.schematicPlaceholder}>
              {loading ? (
                <ActivityIndicator color={Colors.cyan} />
              ) : modules.length === 0 ? (
                <TouchableOpacity
                  style={styles.emptyModules}
                  onPress={() =>
                    starshipId &&
                    navigation.navigate('ModuleForm', { starshipId })
                  }
                >
                  <Plus color={Colors.cyan} size={32} opacity={0.5} />
                  <Text style={styles.emptyModulesText}>ADD ROOM</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.moduleList}>
                  {modules.map(module => {
                    const IconComponent =
                      (Icons as any)[module.icon] || Icons.Box;
                    return (
                      <TouchableOpacity
                        key={module.id}
                        style={styles.moduleCard}
                        onPress={() =>
                          starshipId &&
                          navigation.navigate('ModuleForm', {
                            starshipId,
                            module,
                          })
                        }
                      >
                        <View style={styles.moduleIconContainer}>
                          <IconComponent color={Colors.cyan} size={20} />
                        </View>
                        <View style={styles.moduleInfo}>
                          <Text style={styles.moduleName}>{module.name}</Text>
                        </View>
                        <ArrowRight
                          color={Colors.cyan}
                          size={16}
                          opacity={0.5}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => navigation.navigate('Missions')}
          >
            <View style={styles.tabIconContainer}>
              <ClipboardList color={Colors.cyan} size={24} />
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
  schematicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  schematicTitle: {
    color: Colors.cyan,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  addModuleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cyan,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  addModuleButtonText: {
    color: Colors.deepObsidian,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  schematicPlaceholder: {
    flex: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    borderStyle: 'dashed',
    padding: 15,
    justifyContent: 'center',
  },
  emptyModules: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyModulesText: {
    color: Colors.cyan,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    opacity: 0.6,
  },
  moduleList: {
    gap: 10,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 30, 35, 0.6)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.1)',
  },
  moduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  moduleRealName: {
    color: 'rgba(0, 255, 255, 0.5)',
    fontSize: 10,
    fontWeight: '600',
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
