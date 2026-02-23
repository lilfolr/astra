import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../App';
import {
  FileText,
  Award,
  RotateCcw,
  UserX,
  PlusCircle,
  Circle,
} from 'lucide-react-native';
import SciFiBackground from '../components/SciFiBackground';
import Colors from '../theme/colors';
import { useCrew, starshipService, type Crew } from '../data';
import { getAuth } from '@react-native-firebase/auth';

interface CrewCardProps {
  member: Crew & { id: string };
}

const formatRelativeTime = (epoch: number) => {
  const diffMs = Date.now() - epoch;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'JUST NOW';
  if (diffMins < 60) return `${diffMins}M AGO`;
  if (diffHours < 24) return `${diffHours}H AGO`;
  return `${diffDays}D AGO`;
};

const CrewCard = ({ member }: CrewCardProps) => {
  const statusColor =
    member.role === 'captain' ? Colors.neonOrange : Colors.cyan;
  const displayStatus = member.status || 'pending';
  const displayLastSeen = formatRelativeTime(member.lastSeen);

  return (
    <View style={[styles.card, { borderLeftColor: statusColor }]}>
      <View style={styles.cardHeader}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            LAST SEEN: {displayLastSeen}
          </Text>
          <Circle size={8} fill={statusColor} color={statusColor} />
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.avatarContainer}>
          <View
            style={[styles.avatarBorder, { borderColor: statusColor + '4D' }]}
          >
            {member.avatar ? (
              <Image source={{ uri: member.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarPlaceholderText}>
                  {member.name.charAt(0)}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.memberName}>{member.name}</Text>
          <View style={styles.roleContainer}>
            <Text style={[styles.memberRole, { color: statusColor }]}>
              {member.role.toUpperCase()}
            </Text>
            <Text style={[styles.memberStatusText, { color: statusColor }]}>
              [{displayStatus.toUpperCase()}]
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonGrid}>
        <TouchableOpacity style={styles.actionButton}>
          <FileText size={14} color={Colors.grey} />
          <Text style={styles.actionButtonText}>MISSION LOG</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Award size={14} color={Colors.grey} />
          <Text style={styles.actionButtonText}>ADJUST RANK/CREDITS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <RotateCcw size={14} color={Colors.grey} />
          <Text style={styles.actionButtonText}>VIEW REGISTRATION TOKEN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <UserX size={14} color={Colors.grey} />
          <Text style={styles.actionButtonText}>DISABLE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

type RosterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Roster'
>;

interface Props {
  navigation: RosterScreenNavigationProp;
}

const RosterScreen: React.FC<Props> = ({ navigation }) => {
  const [starshipId, setStarshipId] = useState<string | null>(null);
  const { crew, loading, error } = useCrew(starshipId);

  useEffect(() => {
    const discoverStarship = async () => {
      const currentUser = getAuth().currentUser;
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
  }, []);

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>FLEET ROSTER</Text>
            <View style={styles.overrideContainer}>
              <View style={styles.pulseContainer}>
                <View style={styles.pulseDot} />
              </View>
              <Text style={styles.overrideText}>
                CAPTAIN'S OVERRIDE: ACTIVE
              </Text>
            </View>
          </View>
        </View>

        {/* Crew List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={Colors.cyan} size="large" />
              <Text style={styles.loadingText}>SCANNING LIFE SIGNS...</Text>
            </View>
          ) : error ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>UPLINK ERROR: {error}</Text>
            </View>
          ) : crew.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                NO LIFE SIGNS DETECTED IN FLEET ROSTER
              </Text>
            </View>
          ) : (
            crew.map(member => <CrewCard key={member.id} member={member} />)
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Footer Action */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.recruitButton}
            onPress={() => navigation.navigate('Recruit')}
          >
            <View style={styles.hudCornerTL} />
            <View style={styles.hudCornerTR} />
            <View style={styles.hudCornerBL} />
            <View style={styles.hudCornerBR} />
            <PlusCircle color={Colors.cyan} size={20} />
            <Text style={styles.recruitButtonText}>RECRUIT NEW UNIT</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.white,
    fontStyle: 'italic',
    letterSpacing: -1,
  },
  overrideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  pulseContainer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neonOrange + '40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neonOrange,
  },
  overrideText: {
    fontSize: 10,
    color: Colors.neonOrange,
    fontWeight: '700',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: 'rgba(16, 30, 34, 0.7)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(13, 185, 242, 0.1)',
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  infoContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  memberRole: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  roleContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  memberStatusText: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 16,
  },
  loadingText: {
    color: Colors.cyan,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.neonOrange,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: Colors.cyan,
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flex: 1,
    minWidth: '45%',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.grey,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'rgba(11, 11, 11, 0.9)',
  },
  recruitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 30, 34, 0.8)',
    borderWidth: 2,
    borderColor: Colors.cyan,
    borderRadius: 8,
    paddingVertical: 16,
    position: 'relative',
  },
  recruitButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  // HUD Corners
  hudCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.cyan,
  },
  hudCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.cyan,
  },
  hudCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 10,
    height: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.cyan,
  },
  hudCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.cyan,
  },
});

export default RosterScreen;
