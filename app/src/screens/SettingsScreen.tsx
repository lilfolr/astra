import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../App';
import {
  Settings,
  User,
  Bell,
  Volume2,
  Palette,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plane,
  ShieldCheck,
  Users,
  Trash2,
  Download,
} from 'lucide-react-native';
import SciFiBackground from '../components/SciFiBackground';
import Colors from '../theme/colors';
import {
  useCrew,
  useDiscoverStarship,
  useStarship,
  starshipService,
} from '../data';
import { getAuth, signOut } from '@react-native-firebase/auth';

type SettingsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Settings'
>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { starshipId, loading: discovering } = useDiscoverStarship();
  const { starship, loading: starshipLoading } = useStarship(starshipId);
  const { crew, loading: crewLoading } = useCrew(starshipId);
  const currentUser = getAuth().currentUser;
  const myCrewMember = crew.find(c => c.uid === currentUser?.uid);
  const myCrewId = myCrewMember?.id;

  const loading = discovering || starshipLoading || crewLoading;

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
    } catch {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const toggleVacationMode = async (value: boolean) => {
    if (!starshipId) return;
    try {
      await starshipService.updateStarship(starshipId, { vacationMode: value });
    } catch {
      Alert.alert('Error', 'Failed to update vacation mode');
    }
  };

  const toggleAutoValidate = async (value: boolean) => {
    if (!starshipId) return;
    try {
      await starshipService.updateStarship(starshipId, { autoValidate: value });
    } catch {
      Alert.alert('Error', 'Failed to update auto-validate');
    }
  };

  const updateCrewSetting = async (key: string, value: any) => {
    if (!starshipId || !myCrewId) return;
    try {
      await starshipService.updateCrewMember(starshipId, myCrewId, {
        [key]: value,
      });
    } catch {
      Alert.alert('Error', `Failed to update ${key}`);
    }
  };

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    action: React.ReactNode,
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>{icon}</View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.settingAction}>{action}</View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SciFiBackground>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.cyan} size="large" />
        </View>
      </SciFiBackground>
    );
  }

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={Colors.cyan} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SETTINGS</Text>
          <Settings size={24} color={Colors.cyan} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Section */}
          {renderSectionHeader('PROFILE')}
          {renderSettingItem(
            <User size={20} color={Colors.cyan} />,
            myCrewMember?.name || 'Recruit',
            'Edit your name and profile details',
            <ChevronRight size={20} color={Colors.grey} />,
            () => navigation.navigate('CreateProfile'), // Using existing profile screen for now
          )}

          {/* UI Section */}
          {renderSectionHeader('UI')}
          {renderSettingItem(
            <Palette size={20} color={Colors.cyan} />,
            'Theme',
            `Current: ${myCrewMember?.theme || 'auto'}`.toUpperCase(),
            <View style={styles.themeSelector}>
              {['light', 'dark', 'auto'].map(t => (
                <TouchableOpacity
                  key={t}
                  onPress={() => updateCrewSetting('theme', t)}
                  style={[
                    styles.themeOption,
                    myCrewMember?.theme === t && styles.themeOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      myCrewMember?.theme === t && styles.themeOptionTextActive,
                    ]}
                  >
                    {t.charAt(0).toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>,
          )}
          {renderSettingItem(
            <Bell size={20} color={Colors.cyan} />,
            'Notifications',
            'Stay updated on mission status',
            <Switch
              value={myCrewMember?.notificationsEnabled ?? true}
              onValueChange={v => updateCrewSetting('notificationsEnabled', v)}
              trackColor={{ false: '#333', true: Colors.cyan + '80' }}
              thumbColor={
                (myCrewMember?.notificationsEnabled ?? true)
                  ? Colors.cyan
                  : '#666'
              }
            />,
          )}
          {renderSettingItem(
            <Volume2 size={20} color={Colors.cyan} />,
            'Audio FX',
            'Play system sounds and alerts',
            <Switch
              value={myCrewMember?.audioEffectsEnabled ?? true}
              onValueChange={v => updateCrewSetting('audioEffectsEnabled', v)}
              trackColor={{ false: '#333', true: Colors.cyan + '80' }}
              thumbColor={
                (myCrewMember?.audioEffectsEnabled ?? true)
                  ? Colors.cyan
                  : '#666'
              }
            />,
          )}

          {/* Ship Configuration */}
          {renderSectionHeader('SHIP CONFIGURATION')}
          {renderSettingItem(
            <Plane size={20} color={Colors.cyan} />,
            'Vacation Mode',
            'Disable all chore timers',
            <Switch
              value={starship?.vacationMode ?? false}
              onValueChange={toggleVacationMode}
              trackColor={{ false: '#333', true: Colors.neonOrange + '80' }}
              thumbColor={starship?.vacationMode ? Colors.neonOrange : '#666'}
            />,
          )}
          {renderSettingItem(
            <ShieldCheck size={20} color={Colors.cyan} />,
            'Auto-validate',
            'Skip peer verification for chores',
            <Switch
              value={starship?.autoValidate ?? false}
              onValueChange={toggleAutoValidate}
              trackColor={{ false: '#333', true: Colors.cyan + '80' }}
              thumbColor={starship?.autoValidate ? Colors.cyan : '#666'}
            />,
          )}

          {/* Crew Management */}
          {renderSectionHeader('CREW MANAGEMENT')}
          {renderSettingItem(
            <Users size={20} color={Colors.cyan} />,
            'Family Roster',
            'Manage family members and roles',
            <ChevronRight size={20} color={Colors.grey} />,
            () => navigation.navigate('Roster'),
          )}

          {/* Data & Privacy */}
          {renderSectionHeader('DATA & PRIVACY')}
          {renderSettingItem(
            <Download size={20} color={Colors.cyan} />,
            'Export Data',
            'Download a copy of your records',
            <ChevronRight size={20} color={Colors.grey} />,
            () =>
              Alert.alert(
                'Export',
                'Data export requested. You will receive a link shortly.',
              ),
          )}
          {renderSettingItem(
            <Trash2 size={20} color={Colors.neonOrange} />,
            'Delete Data',
            'Permanently erase all ship data',
            <ChevronRight size={20} color={Colors.grey} />,
            () =>
              Alert.alert(
                'Confirm Deletion',
                'This action cannot be undone. Are you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete Everything',
                    style: 'destructive',
                    onPress: () =>
                      Alert.alert('Deleted', 'Data erasure initiated.'),
                  },
                ],
              ),
          )}

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.neonOrange} />
            <Text style={styles.logoutButtonText}>TERMINATE SESSION</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </SciFiBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
    backgroundColor: 'rgba(11, 11, 11, 0.8)',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 20,
  },
  sectionHeader: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 25,
    marginBottom: 10,
    opacity: 0.8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  settingAction: {
    marginLeft: 10,
  },
  themeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 2,
  },
  themeOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  themeOptionActive: {
    backgroundColor: Colors.cyan,
  },
  themeOptionText: {
    color: Colors.grey,
    fontSize: 10,
    fontWeight: 'bold',
  },
  themeOptionTextActive: {
    color: Colors.deepObsidian,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 40,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.neonOrange + '40',
    backgroundColor: Colors.neonOrange + '10',
  },
  logoutButtonText: {
    color: Colors.neonOrange,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SettingsScreen;
