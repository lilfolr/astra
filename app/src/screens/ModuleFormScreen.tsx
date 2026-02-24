import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../App';
import SciFiBackground from '../components/SciFiBackground';
import SciFiButton from '../components/SciFiButton';
import SciFiInput from '../components/SciFiInput';
import Colors from '../theme/colors';
import {
  ArrowLeft,
  Utensils,
  Zap,
  HeartPulse,
  Leaf,
  Cpu,
  Shield,
  Box,
  Camera,
  Tv,
  Info,
  Trash2,
} from 'lucide-react-native';
import { starshipService } from '../data';
import * as v from 'valibot';
import { ModuleSchema } from '../data/models/schemas';

type ModuleFormScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ModuleForm'
>;
type ModuleFormScreenRouteProp = RouteProp<AuthStackParamList, 'ModuleForm'>;

interface Props {
  navigation: ModuleFormScreenNavigationProp;
  route: ModuleFormScreenRouteProp;
}

const COMMON_ROOMS = [
  {
    id: 'mess_hall',
    name: 'KITCHEN',
    realWorldRoom: 'KITCHEN',
    icon: 'Utensils',
    subtext: 'KITCHEN',
    IconComponent: Utensils,
  },
  {
    id: 'engine_room',
    name: 'LAUNDRY',
    realWorldRoom: 'LAUNDRY',
    icon: 'Zap',
    subtext: 'LAUNDRY',
    IconComponent: Zap,
  },
  {
    id: 'life_support',
    name: 'BATHROOM',
    realWorldRoom: 'BATHROOM',
    icon: 'HeartPulse',
    subtext: 'BATHROOM',
    IconComponent: HeartPulse,
  },
  {
    id: 'garden',
    name: 'OUTSIDE',
    realWorldRoom: 'OUTSIDE',
    icon: 'Leaf',
    subtext: 'OUTSIDE',
    IconComponent: Leaf,
  },
];

const AVAILABLE_ICONS = [
  { name: 'Utensils', Icon: Utensils },
  { name: 'Zap', Icon: Zap },
  { name: 'HeartPulse', Icon: HeartPulse },
  { name: 'Leaf', Icon: Leaf },
  { name: 'Cpu', Icon: Cpu },
  { name: 'Shield', Icon: Shield },
  { name: 'Box', Icon: Box },
  { name: 'Camera', Icon: Camera },
  { name: 'Tv', Icon: Tv },
  { name: 'Info', Icon: Info },
];

const ModuleFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { starshipId, module: existingModule } = route.params;
  const isEditing = !!existingModule;

  const [name, setName] = useState(existingModule?.name || '');
  const [realWorldRoom, setRealWorldRoom] = useState(
    existingModule?.realWorldRoom || '',
  );
  const [icon, setIcon] = useState(existingModule?.icon || 'Box');
  const [loading, setLoading] = useState(false);

  const handleSelectCommonRoom = (room: (typeof COMMON_ROOMS)[0]) => {
    setName(room.name);
    setRealWorldRoom(room.realWorldRoom);
    setIcon(room.icon);
  };

  const handleSave = async () => {
    if (!name || !realWorldRoom || !icon) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const moduleData = {
        name,
        realWorldRoom,
        icon,
        incompleteMissions: existingModule?.incompleteMissions || [],
      };

      // Validate
      v.parse(ModuleSchema, moduleData);

      if (isEditing && existingModule) {
        await starshipService.updateModule(
          starshipId,
          existingModule.id,
          moduleData,
        );
      } else {
        await starshipService.addModule(starshipId, moduleData);
      }

      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving module:', error);
      if (v.isValiError(error)) {
        Alert.alert(
          'Validation Error',
          error.issues.map(i => i.message).join('\n'),
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to save module');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingModule) return;

    Alert.alert(
      'REMOVE ROOM',
      `Are you sure you want to remove the ${name}? This will delete all chores in this room.`,
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'REMOVE',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await starshipService.deleteModule(starshipId, existingModule.id);
              navigation.goBack();
            } catch (error: any) {
              console.error('Error deleting module:', error);
              Alert.alert('Error', error.message || 'Failed to delete module');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SciFiBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft color={Colors.cyan} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'EDIT ROOM' : 'ADD ROOM'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Architecture Selector */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>ROOM TEMPLATES</Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.grid}>
              {COMMON_ROOMS.map(room => {
                const isSelected =
                  name === room.name &&
                  realWorldRoom === room.realWorldRoom &&
                  icon === room.icon;
                return (
                  <TouchableOpacity
                    key={room.id}
                    style={[
                      styles.gridItem,
                      isSelected && styles.gridItemActive,
                    ]}
                    onPress={() => handleSelectCommonRoom(room)}
                  >
                    <View style={styles.hudCornerTL} />
                    <View style={styles.hudCornerBR} />
                    <room.IconComponent
                      color={isSelected ? Colors.neonOrange : Colors.cyan}
                      size={32}
                    />
                    <Text
                      style={[
                        styles.gridItemText,
                        isSelected && styles.gridItemTextActive,
                      ]}
                    >
                      {room.name}
                    </Text>
                    <Text style={styles.gridItemSubtext}>{room.subtext}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Custom ID Assignment */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>ROOM DETAILS</Text>
              <View style={styles.sectionLine} />
            </View>

            <SciFiInput
              label="Room Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter room name..."
            />
            <SciFiInput
              label="Real World Room"
              value={realWorldRoom}
              onChangeText={setRealWorldRoom}
              placeholder="Enter room type..."
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>CHOOSE ICON</Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.iconGrid}>
              {AVAILABLE_ICONS.map(({ name: iconName, Icon }) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconItem,
                    icon === iconName && styles.iconItemActive,
                  ]}
                  onPress={() => setIcon(iconName)}
                >
                  <Icon
                    color={icon === iconName ? Colors.cyan : Colors.white}
                    size={24}
                    opacity={icon === iconName ? 1 : 0.5}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 40 }} />

          <SciFiButton
            title={isEditing ? 'Update Room' : 'Add Room'}
            onPress={handleSave}
            disabled={loading}
            icon={
              loading ? (
                <ActivityIndicator
                  color={Colors.deepObsidian}
                  style={{ marginLeft: 10 }}
                />
              ) : (
                <Zap
                  color={Colors.deepObsidian}
                  size={20}
                  style={{ marginLeft: 10 }}
                />
              )
            }
          />

          {isEditing && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              disabled={loading}
            >
              <Trash2 color={Colors.neonOrange} size={16} />
              <Text style={styles.deleteButtonText}>REMOVE ROOM</Text>
            </TouchableOpacity>
          )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 255, 255, 0.3)',
    backgroundColor: 'rgba(16, 30, 35, 0.95)',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: Colors.cyan,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.cyan,
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 110,
  },
  gridItemActive: {
    backgroundColor: 'rgba(255, 95, 31, 0.05)',
    borderColor: 'rgba(255, 95, 31, 0.4)',
  },
  gridItemText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 8,
    letterSpacing: 1,
  },
  gridItemTextActive: {
    color: Colors.neonOrange,
  },
  gridItemSubtext: {
    fontSize: 8,
    color: 'rgba(0, 255, 255, 0.4)',
    marginTop: 2,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: 'rgba(16, 30, 35, 0.6)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(13, 185, 242, 0.2)',
  },
  iconItem: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconItemActive: {
    borderColor: Colors.cyan,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
  },
  hudCornerTL: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 10,
    height: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: Colors.cyan,
  },
  hudCornerBR: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: Colors.cyan,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 95, 31, 0.3)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 95, 31, 0.05)',
  },
  deleteButtonText: {
    color: Colors.neonOrange,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ModuleFormScreen;
