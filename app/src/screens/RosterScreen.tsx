import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FileText,
  Award,
  RotateCcw,
  UserX,
  PlusCircle,
  Circle,
} from 'lucide-react-native';
import SciFiBackground from '../components/SciFiBackground';
import { useTheme } from '../theme/ThemeContext';

const CREW_MEMBERS = (theme: any) => [
  {
    id: '1',
    name: 'CADET LEO',
    role: 'Sector 7-G | Recon Unit',
    status: 'Link Stable',
    lastSeen: '2m ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8W__oMaDLWLzy1KlPHex9O5b3uJuYQZ98UDVOzMx7paQMKvpmkSETEyrjdNFV1AZI7IH_t1dIetQBrEdEZAEJveHqyYuAY_7tnHYnNo7vBrsY3u9SmsALiziao4Sc5LNuA9mAA4_-G5w4shEXzjZhtfk8yRWlen3juWRH1M7NAsAg5gOw8OBK3o9fVJ3PTpzkE-jljsZtBKGbbBPpQspKvbIbLndIVWUfnshwZXbOeIR7XasmgetlLR5PVbNRDaUClYKcACEsNU',
    borderColor: theme.colors.primary,
    statusColor: theme.colors.primary,
  },
  {
    id: '2',
    name: 'FIRST OFFICER SARAH',
    role: 'Command Core | Admin',
    status: 'Link Weak',
    lastSeen: '15m ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFLzn-01uTsvOOwZKHcWvQ3qyFiyUpiJoLQQPzso0twYWKHiuxIq_cWZwt4VVYrAgkiq6AnOffEzjes3DIBhYRzkjOiIUWOiWj5GkSZ55KDdmY2Gn2kmVC_0cyMIvXfIPhi7vnPpZIdnQWThda6FyFzRIEBCC2XGdDTNOLMdIJml2vHJrpe9du5AkfAGYO5SMwMIvndpPt_gPLfcYIJB7PLj6sTg7x7JQyEqE2R8m2C_0N7Yq3zlASYKtgUrARNKR1byX_m24da6o',
    borderColor: theme.colors.warning,
    statusColor: theme.colors.warning,
  },
  {
    id: '3',
    name: 'SPECIALIST MAYA',
    role: 'Science Lab | Restricted',
    status: 'Offline',
    lastSeen: '2h ago',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2o8rPaUiwFasThZKn2zK6wm3qD0f1KBR3ImcVfIiHX3KS-IHyyLxTrwP4YxKxaNADiUN8kF95jszk01wYxz4T1nceACKFLKMTY9LIyZt6v2Pw_A-8pngZEsssllalVkDvfVM2Jdp5MWk4sOeObxRIclzyyHIYP_TBBxLzevK3jJ8v8JmHrCLjqJRIk5UxqcQZxwmmQKdtIbChvgJdz0meXOqMJY_s34UClybVnKgDVL04zjFPssKhU46nA0_WNZA_zLToD4LoQSU',
    borderColor: theme.colors.textSecondary,
    statusColor: theme.colors.textSecondary,
    isOffline: true,
  },
];

const CrewCard = ({ member, theme }: { member: any, theme: any }) => (
  <View style={[styles.card, { borderLeftColor: member.borderColor, backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
    <View style={styles.cardHeader}>
      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { color: member.statusColor }]}>
          LAST SEEN: {member.lastSeen.toUpperCase()}
        </Text>
        <Circle
          size={8}
          fill={member.statusColor}
          color={member.statusColor}
        />
      </View>
    </View>

    <View style={styles.cardBody}>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatarBorder, { borderColor: member.statusColor + '4D' }]}>
          <Image
            source={{ uri: member.avatar }}
            style={[styles.avatar, member.isOffline && styles.offlineAvatar]}
          />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.memberName, { color: theme.colors.text }]}>{member.name}</Text>
        <Text style={[styles.memberRole, { color: member.statusColor }]}>
          {member.role.toUpperCase()}
        </Text>
      </View>
    </View>

    <View style={styles.buttonGrid}>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.glass, borderColor: theme.colors.border }]}>
        <FileText size={14} color={theme.colors.textSecondary} />
        <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>MISSION LOG</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.glass, borderColor: theme.colors.border }]}>
        <Award size={14} color={theme.colors.textSecondary} />
        <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>ADJUST RANK/CREDITS</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.glass, borderColor: theme.colors.border }]}>
        <RotateCcw size={14} color={theme.colors.textSecondary} />
        <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>RESET LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.glass, borderColor: theme.colors.border }]}>
        <UserX size={14} color={theme.colors.textSecondary} />
        <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>DISABLE</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RosterScreen = () => {
  const { theme } = useTheme();
  const crew = CREW_MEMBERS(theme);

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>FLEET ROSTER</Text>
            <View style={styles.overrideContainer}>
              <View style={[styles.pulseContainer, { backgroundColor: theme.colors.warning + '40' }]}>
                <View style={[styles.pulseDot, { backgroundColor: theme.colors.warning }]} />
              </View>
              <Text style={[styles.overrideText, { color: theme.colors.warning }]}>CAPTAIN'S OVERRIDE: ACTIVE</Text>
            </View>
          </View>
        </View>

        {/* Crew List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {crew.map((member) => (
            <CrewCard key={member.id} member={member} theme={theme} />
          ))}

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Footer Action */}
        <View style={[styles.footer, { backgroundColor: theme.dark ? 'rgba(11, 11, 11, 0.9)' : 'rgba(242, 242, 247, 0.9)' }]}>
          <TouchableOpacity style={[styles.recruitButton, { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.primary }]}>
            <View style={[styles.hudCornerTL, { borderColor: theme.colors.primary }]} />
            <View style={[styles.hudCornerTR, { borderColor: theme.colors.primary }]} />
            <View style={[styles.hudCornerBL, { borderColor: theme.colors.primary }]} />
            <View style={[styles.hudCornerBR, { borderColor: theme.colors.primary }]} />
            <PlusCircle color={theme.colors.primary} size={20} />
            <Text style={[styles.recruitButtonText, { color: theme.colors.text }]}>RECRUIT NEW UNIT</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  overrideText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  statsGrid: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statBox: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
  },
  statLabel: {
    fontSize: 10,
    opacity: 0.6,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  statValueTotal: {
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
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
  offlineAvatar: {
    opacity: 0.5,
  },
  infoContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  memberRole: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
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
    borderWidth: 1,
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
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  recruitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 16,
    position: 'relative',
  },
  recruitButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  footerText: {
    fontSize: 8,
    opacity: 0.4,
    fontWeight: '700',
    letterSpacing: 1,
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
  },
  hudCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  hudCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 10,
    height: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  hudCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});

export default RosterScreen;
