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
import { ArrowLeft, Trash2, ClipboardList } from 'lucide-react-native';
import { starshipService, useModules, type Mission } from '../data';
import * as v from 'valibot';
import { MissionSchema } from '../data/models/schemas';

type MissionFormScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'MissionForm'
>;
type MissionFormScreenRouteProp = RouteProp<AuthStackParamList, 'MissionForm'>;

interface Props {
  navigation: MissionFormScreenNavigationProp;
  route: MissionFormScreenRouteProp;
}

const DIFFICULTIES = [
  { id: 'easy', label: 'EASY', color: '#4ade80' },
  { id: 'medium', label: 'MEDIUM', color: '#facc15' },
  { id: 'hard', label: 'HARD', color: '#ef4444' },
] as const;

const MissionFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { starshipId, mission: existingMission } = route.params;
  const isEditing = !!existingMission;

  const { modules } = useModules(starshipId);

  const [title, setTitle] = useState(existingMission?.title || '');
  const [description, setDescription] = useState(
    existingMission?.description || '',
  );
  const [difficulty, setDifficulty] = useState<Mission['difficulty']>(
    existingMission?.difficulty || 'easy',
  );
  const [creditReward, setCreditReward] = useState(
    existingMission?.creditReward?.toString() || '100',
  );
  const [moduleId, setModuleId] = useState(existingMission?.moduleId || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const missionData: Mission = {
        title,
        description,
        difficulty,
        creditReward: parseInt(creditReward, 10) || 0,
        moduleId: moduleId || undefined,
        assignedTo: existingMission?.assignedTo || '',
        status: existingMission?.status || 'pending',
      };

      // Validate
      v.parse(MissionSchema, missionData);

      if (isEditing && existingMission) {
        await starshipService.updateMission(
          starshipId,
          existingMission.id,
          missionData,
        );
      } else {
        await starshipService.addMission(starshipId, missionData);
      }

      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving mission:', error);
      if (v.isValiError(error)) {
        Alert.alert(
          'Validation Error',
          error.issues.map(i => i.message).join('\n'),
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to save mission');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingMission) return;

    Alert.alert(
      'DECOMMISSION MISSION',
      `Are you sure you want to remove the mission "${title}"?`,
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'REMOVE',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await starshipService.deleteMission(
                starshipId,
                existingMission.id,
              );
              navigation.goBack();
            } catch (error: any) {
              console.error('Error deleting mission:', error);
              Alert.alert('Error', error.message || 'Failed to delete mission');
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
            {isEditing ? 'EDIT CHORE' : 'ADD CHORE'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>CHORE DETAILS</Text>
              <View style={styles.sectionLine} />
            </View>

            <SciFiInput
              label="Chore Title"
              value={title}
              onChangeText={setTitle}
              placeholder="E.G. SCAN FOR RADIATION..."
            />

            <SciFiInput
              label="Instructions"
              value={description}
              onChangeText={setDescription}
              placeholder="DETAILED_ORDERS..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>DIFFICULTY</Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.difficultyGrid}>
              {DIFFICULTIES.map(d => (
                <TouchableOpacity
                  key={d.id}
                  style={[
                    styles.difficultyItem,
                    difficulty === d.id && {
                      borderColor: d.color,
                      backgroundColor: `${d.color}20`,
                    },
                  ]}
                  onPress={() => setDifficulty(d.id)}
                >
                  <Text
                    style={[
                      styles.difficultyItemText,
                      difficulty === d.id && { color: d.color },
                    ]}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>REWARD & LOCATION</Text>
              <View style={styles.sectionLine} />
            </View>

            <SciFiInput
              label="Credit Reward"
              value={creditReward}
              onChangeText={setCreditReward}
              placeholder="100"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Select Module (Room)</Text>
            <View style={styles.moduleGrid}>
              {modules.map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.moduleItem,
                    moduleId === m.id && styles.moduleItemActive,
                  ]}
                  onPress={() => setModuleId(m.id)}
                >
                  <Text
                    style={[
                      styles.moduleItemText,
                      moduleId === m.id && styles.moduleItemTextActive,
                    ]}
                  >
                    {m.name}
                  </Text>
                </TouchableOpacity>
              ))}
              {modules.length === 0 && (
                <Text style={styles.emptyText}>NO MODULES DETECTED</Text>
              )}
            </View>
          </View>

          <View style={{ height: 40 }} />

          <SciFiButton
            title={isEditing ? 'Update Chore' : 'Add Chore'}
            onPress={handleSave}
            disabled={loading}
            icon={
              loading ? (
                <ActivityIndicator
                  color={Colors.deepObsidian}
                  style={{ marginLeft: 10 }}
                />
              ) : (
                <ClipboardList
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
              <Text style={styles.deleteButtonText}>DECOMMISSION MISSION</Text>
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
  label: {
    fontSize: 12,
    color: Colors.cyan,
    marginBottom: 8,
    fontWeight: 'bold',
    marginTop: 10,
  },
  difficultyGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  difficultyItemText: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  moduleItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    borderRadius: 6,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
  },
  moduleItemActive: {
    borderColor: Colors.cyan,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
  },
  moduleItemText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  moduleItemTextActive: {
    color: Colors.white,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
    fontStyle: 'italic',
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

export default MissionFormScreen;
