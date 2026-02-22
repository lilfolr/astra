import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SciFiBackground from '../components/SciFiBackground';
import {
  Rocket,
  Settings,
  ClipboardList,
  Users,
  ShoppingBag,
  CircleDollarSign,
  Zap,
  Moon,
  Sun
} from 'lucide-react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../App';
import { useTheme } from '../theme/ThemeContext';

type CommandDeckScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'CommandDeck'>;

interface Props {
  navigation: CommandDeckScreenNavigationProp
}

const CommandDeck : React.FC<Props>= ({navigation}) => {
  const { theme, toggleTheme } = useTheme();
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
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={theme.dark ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.background}
        />

        {/* Header */}
        <View style={[styles.header, {
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.dark ? 'rgba(16, 30, 35, 0.8)' : 'rgba(255, 255, 255, 0.8)'
        }]}>
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Rocket color={theme.colors.primary} size={24} style={styles.headerIcon} />
              <Text style={[styles.title, { color: theme.colors.text }]}>COMMAND DECK</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity onPress={toggleTheme}>
                {theme.dark ? (
                  <Sun color={theme.colors.primary} size={24} />
                ) : (
                  <Moon color={theme.colors.primary} size={24} />
                )}
              </TouchableOpacity>
              <TouchableOpacity>
                <Settings color={theme.colors.primary} size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.integrityBarContainer}>
            <View style={styles.integrityBarLabelContainer}>
              <Text style={[styles.integrityBarLabel, { color: theme.colors.primary }]}>HULL INTEGRITY</Text>
              <Text style={[styles.integrityValue, { color: theme.colors.primary }]}>85%</Text>
            </View>
            <View style={[styles.integrityBarBackground, {
              backgroundColor: theme.dark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)',
              borderColor: theme.colors.border
            }]}>
              <View style={[styles.integrityBarFill, {
                width: '85%',
                backgroundColor: theme.colors.primary
              }]} />
            </View>
            <View style={styles.integritySubtextContainer}>
              <Text style={[styles.integritySubtext, { color: theme.colors.textSecondary }]}>SYSTEMS STABLE</Text>
              <Animated.Text style={[styles.integritySubtext, { color: theme.colors.textSecondary, opacity: pulseAnim }]}>
                SHIELDS ACTIVE
              </Animated.Text>
            </View>
          </View>

          {/* Mission Status Component */}
          <View style={[styles.missionSummary, {
            backgroundColor: theme.dark ? 'rgba(0, 255, 255, 0.05)' : 'rgba(0, 113, 113, 0.05)',
            borderColor: theme.colors.border
          }]}>
            <View style={styles.missionItem}>
              <Text style={[styles.missionLabel, { color: theme.colors.textSecondary }]}>TOTAL MISSIONS</Text>
              <Text style={[styles.missionValue, { color: theme.colors.text }]}>12</Text>
            </View>
            <View style={[styles.missionDivider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.missionItem}>
              <Text style={[styles.missionLabel, { color: theme.colors.textSecondary }]}>ASSIGNED TO ME</Text>
              <Text style={[styles.missionValue, { color: theme.colors.text }]}>3</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Scrolling Ticker */}
          <View style={[styles.tickerContainer, {
            backgroundColor: theme.colors.glass,
            borderColor: theme.colors.border
          }]}>
            <Text style={[styles.tickerText, { color: theme.colors.primary }]} numberOfLines={1}>
              SCANNING SECTOR 7G... /// ANOMALY DETECTED IN MESS HALL /// LIFE SUPPORT SYSTEMS OPTIMAL /// INCOMING TRANSMISSION FROM HQ...
            </Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, {
              backgroundColor: theme.colors.inputBg,
              borderColor: theme.colors.border
            }]}>
              <View style={[styles.rankIconContainer, { borderColor: theme.colors.primary }]}>
                <Zap color={theme.colors.primary} size={20} opacity={0.3} />
                <Text style={[styles.rankLevel, { color: theme.colors.text }]}>L4</Text>
              </View>
              <View>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>RANK</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>Cadet</Text>
              </View>
            </View>
            <View style={[styles.statCard, {
              backgroundColor: theme.colors.inputBg,
              borderColor: theme.colors.border
            }]}>
              <View>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>CREDITS</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>450 CR</Text>
              </View>
              <CircleDollarSign color={theme.colors.primary} size={24} />
            </View>
          </View>

          {/* Ship Schematic Placeholder */}
          <View style={styles.schematicContainer}>
            <Text style={[styles.schematicTitle, { color: theme.colors.primary }]}>SHIP SCHEMATIC: HOME BASE</Text>
            <View style={[styles.schematicPlaceholder, {
              backgroundColor: theme.colors.glass,
              borderColor: theme.colors.border
            }]}>
              {/* Blank for now */}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Tab Bar */}
        <View style={[styles.tabBar, {
          backgroundColor: theme.dark ? 'rgba(16, 30, 35, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: theme.colors.border
        }]}>
          <TouchableOpacity style={styles.tabItem}>
            <View style={[styles.tabIconContainer, styles.activeTabIcon, {
              borderColor: theme.colors.warning,
              backgroundColor: theme.dark ? 'rgba(255, 95, 31, 0.1)' : 'rgba(194, 65, 12, 0.1)'
            }]}>
              <ClipboardList color={theme.colors.warning} size={24} />
            </View>
            <Text style={[styles.tabLabel, { color: theme.colors.text }]}>MISSIONS</Text>
          </TouchableOpacity>
          <View style={[styles.tabDivider, { backgroundColor: theme.colors.border }]} />

          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Roster')}>
            <View style={[styles.tabIconContainer, {
              backgroundColor: theme.colors.glass,
              borderColor: theme.colors.border
            }]}>
              <Users color={theme.colors.primary} size={24} />
            </View>
            <Text style={[styles.tabLabel, { color: theme.colors.text }]}>ROSTER</Text>
          </TouchableOpacity>
          <View style={[styles.tabDivider, { backgroundColor: theme.colors.border }]} />
          <TouchableOpacity style={styles.tabItem}>
            <View style={[styles.tabIconContainer, {
              backgroundColor: theme.colors.glass,
              borderColor: theme.colors.border
            }]}>
              <ShoppingBag color={theme.colors.primary} size={24} />
            </View>
            <Text style={[styles.tabLabel, { color: theme.colors.text }]}>STORE</Text>
          </TouchableOpacity>
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
    padding: 20,
    borderBottomWidth: 1,
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
    letterSpacing: 2,
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
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  integrityValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  integrityBarBackground: {
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 2,
  },
  integrityBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  integritySubtextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  integritySubtext: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  missionSummary: {
    flexDirection: 'row',
    borderRadius: 4,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
  },
  missionItem: {
    flex: 1,
    alignItems: 'center',
  },
  missionLabel: {
    fontSize: 8,
    letterSpacing: 1,
    marginBottom: 2,
  },
  missionValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  missionDivider: {
    width: 1,
    marginHorizontal: 10,
  },
  content: {
    padding: 20,
    paddingBottom: 120, // Space for tab bar
  },
  tickerContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 4,
    marginBottom: 20,
    marginHorizontal: -20, // Bleed to edges
    paddingHorizontal: 20,
  },
  tickerText: {
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
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  rankIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rankLevel: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 8,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  schematicContainer: {
    flex: 1,
    minHeight: 300,
  },
  schematicTitle: {
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  schematicPlaceholder: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  activeTabIcon: {
    // Specific warning color handled in-line
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tabDivider: {
    width: 1,
    height: 30,
  },
});

export default CommandDeck;
