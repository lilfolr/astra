import React, { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../App';
import {
  ClipboardList,
  CheckCircle2,
  UserPlus,
  LayoutGrid,
  Zap,
  CircleDollarSign,
  MapPin,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import SciFiBackground from '../components/SciFiBackground';
import Colors from '../theme/colors';
import {
  useMissions,
  useModules,
  useCrew,
  starshipService,
  type Mission,
} from '../data';
import { getAuth } from '@react-native-firebase/auth';

type MissionsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Missions'
>;

interface Props {
  navigation: MissionsScreenNavigationProp;
}

type TabType = 'my' | 'all' | 'available';

const MissionsScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('my');
  const [starshipId, setStarshipId] = useState<string | null>(null);
  const currentUser = getAuth().currentUser;

  const {
    missions,
    loading: missionsLoading,
    error: missionsError,
  } = useMissions(starshipId);
  const { modules, loading: modulesLoading } = useModules(starshipId);
  const { crew } = useCrew(starshipId);

  const myCrewMember = useMemo(() => {
    return crew.find(c => c.uid === currentUser?.uid);
  }, [crew, currentUser]);

  const isCaptain = myCrewMember?.role === 'captain';

  useEffect(() => {
    const discoverStarship = async () => {
      if (currentUser) {
        try {
          const starship = await starshipService.getStarshipByCaptainId(
            currentUser.uid,
          );
          setStarshipId(starship?.starshipId || currentUser.uid);
        } catch (err) {
          console.error('Error discovering starship:', err);
          setStarshipId(currentUser.uid);
        }
      }
    };
    discoverStarship();
  }, [currentUser]);

  const filteredMissions = useMemo(() => {
    if (!missions) return [];

    switch (activeTab) {
      case 'my':
        return missions.filter(
          m => m.assignedTo === currentUser?.uid && m.status !== 'completed',
        );
      case 'available':
        return missions.filter(
          m => (!m.assignedTo || m.assignedTo === '') && m.status === 'pending',
        );
      case 'all':
      default:
        return missions;
    }
  }, [missions, activeTab, currentUser]);

  const handleAssignToMe = async (missionId: string) => {
    if (!starshipId || !currentUser) return;
    try {
      await starshipService.updateMission(starshipId, missionId, {
        assignedTo: currentUser.uid,
        status: 'active', // Move to active immediately? User said "let users change the state... doing, done, complete".
        // "doing" likely corresponds to 'active'.
      });
    } catch {
      Alert.alert('Error', 'Failed to assign mission');
    }
  };

  const handleChangeStatus = async (
    missionId: string,
    newStatus: Mission['status'],
  ) => {
    if (!starshipId) return;
    try {
      await starshipService.updateMission(starshipId, missionId, {
        status: newStatus,
      });
    } catch {
      Alert.alert('Error', 'Failed to update mission status');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4ade80';
      case 'medium':
        return '#facc15';
      case 'hard':
        return '#ef4444';
      default:
        return Colors.cyan;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'PENDING';
      case 'active':
        return 'IN PROGRESS';
      case 'under_review':
        return 'UNDER REVIEW';
      case 'completed':
        return 'COMPLETED';
      default:
        return status.toUpperCase();
    }
  };

  const renderMissionCard = (mission: Mission & { id: string }) => {
    const module = modules.find(m => m.id === mission.moduleId);
    const assignedUser = crew.find(c => c.uid === mission.assignedTo);

    return (
      <View key={mission.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.difficultyBadge,
              { borderColor: getDifficultyColor(mission.difficulty) },
            ]}
          >
            <Zap
              size={10}
              color={getDifficultyColor(mission.difficulty)}
              fill={getDifficultyColor(mission.difficulty)}
            />
            <Text
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(mission.difficulty) },
              ]}
            >
              {mission.difficulty.toUpperCase()}
            </Text>
          </View>
          <View style={styles.rewardContainer}>
            <CircleDollarSign size={14} color={Colors.neonOrange} />
            <Text style={styles.rewardText}>{mission.creditReward} CR</Text>
          </View>
        </View>

        <Text style={styles.missionTitle}>{mission.title}</Text>
        <Text style={styles.missionDescription} numberOfLines={2}>
          {mission.description}
        </Text>

        <View style={styles.locationContainer}>
          <MapPin size={12} color={Colors.cyan} opacity={0.7} />
          <Text style={styles.locationText}>
            {module?.name || 'Unknown Module'} (
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.assignmentInfo}>
            {assignedUser ? (
              <Text style={styles.assignedToText}>
                Assigned to:{' '}
                <Text style={{ color: Colors.cyan }}>{assignedUser.name}</Text>
              </Text>
            ) : (
              <Text
                style={[styles.assignedToText, { color: Colors.neonOrange }]}
              >
                UNASSIGNED
              </Text>
            )}
            <Text style={styles.statusLabel}>
              STATUS: {getStatusLabel(mission.status)}
            </Text>
          </View>

          <View style={styles.actionsContainer}>
            {mission.status === 'pending' &&
              (!mission.assignedTo ||
                mission.assignedTo === '' ||
                mission.assignedTo === currentUser?.uid) && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.assignButton]}
                  onPress={() => handleAssignToMe(mission.id)}
                >
                  <UserPlus size={16} color={Colors.deepObsidian} />
                  <Text style={styles.assignButtonText}>START</Text>
                </TouchableOpacity>
              )}

            {mission.assignedTo === currentUser?.uid &&
              mission.status === 'active' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.doneButton]}
                  onPress={() => handleChangeStatus(mission.id, 'under_review')}
                >
                  <CheckCircle2 size={16} color={Colors.deepObsidian} />
                  <Text style={styles.doneButtonText}>DONE</Text>
                </TouchableOpacity>
              )}

            {mission.status === 'under_review' && isCaptain && (
              <TouchableOpacity
                style={[styles.actionButton, styles.verifyButton]}
                onPress={() => handleChangeStatus(mission.id, 'completed')}
              >
                <ShieldCheck size={16} color={Colors.deepObsidian} />
                <Text style={styles.verifyButtonText}>VERIFY</Text>
              </TouchableOpacity>
            )}

            {mission.status === 'completed' && (
              <View style={styles.completedBadge}>
                <CheckCircle2 size={16} color={Colors.cyan} />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ChevronRight
              size={24}
              color={Colors.cyan}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>CHORES</Text>
            <Text style={styles.headerSubtitle}>CURRENT OPERATIONAL TASKS</Text>
          </View>
          <ClipboardList
            size={28}
            color={Colors.cyan}
            style={styles.headerIcon}
          />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'my' && styles.activeTab]}
            onPress={() => setActiveTab('my')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'my' && styles.activeTabText,
              ]}
            >
              MY CHORES
            </Text>
            {activeTab === 'my' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'available' && styles.activeTabText,
              ]}
            >
              AVAILABLE
            </Text>
            {activeTab === 'available' && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' && styles.activeTabText,
              ]}
            >
              ALL
            </Text>
            {activeTab === 'all' && <View style={styles.activeTabIndicator} />}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {missionsLoading || modulesLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={Colors.cyan} size="large" />
              <Text style={styles.loadingText}>ACCESSING CHORE DATA...</Text>
            </View>
          ) : missionsError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>
                UPLINK ERROR: {missionsError}
              </Text>
            </View>
          ) : filteredMissions.length === 0 ? (
            <View style={styles.centered}>
              <LayoutGrid size={48} color={Colors.cyan} opacity={0.2} />
              <Text style={styles.emptyText}>
                NO CHORES FOUND IN THIS SECTOR
              </Text>
            </View>
          ) : (
            filteredMissions.map(renderMissionCard)
          )}
          <View style={styles.footerSpacing} />
        </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 10,
    color: Colors.cyan,
    fontWeight: 'bold',
    letterSpacing: 1,
    opacity: 0.8,
  },
  headerIcon: {
    marginLeft: 'auto',
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderRadius: 6,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
  },
  activeTabText: {
    color: Colors.cyan,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 20,
    height: 2,
    backgroundColor: Colors.cyan,
    borderRadius: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(16, 30, 35, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  difficultyText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  missionTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  missionDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  locationText: {
    color: 'rgba(0, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 12,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignedToText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    fontWeight: '600',
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.cyan,
    letterSpacing: 0.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  assignButton: {
    backgroundColor: Colors.cyan,
  },
  assignButtonText: {
    color: Colors.deepObsidian,
    fontSize: 10,
    fontWeight: '900',
  },
  doneButton: {
    backgroundColor: Colors.neonOrange,
  },
  doneButtonText: {
    color: Colors.deepObsidian,
    fontSize: 10,
    fontWeight: '900',
  },
  verifyButton: {
    backgroundColor: '#4ade80',
  },
  verifyButtonText: {
    color: Colors.deepObsidian,
    fontSize: 10,
    fontWeight: '900',
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.cyan,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    gap: 16,
  },
  loadingText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
  },
  errorText: {
    color: Colors.neonOrange,
    fontSize: 12,
    textAlign: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerSpacing: {
    height: 100,
  },
});

export default MissionsScreen;
