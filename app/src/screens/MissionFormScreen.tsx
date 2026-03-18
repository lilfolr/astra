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
import { ArrowLeft, Trash2, ClipboardList, Plus, X } from 'lucide-react-native';
import { starshipService, useModules, useCrew, type Mission } from '../data';
import { getAuth } from '@react-native-firebase/auth';
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

const REWARD_PRESETS = [10, 50, 100];

const MissionFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { starshipId, mission: existingMission } = route.params;
  const isEditing = !!existingMission;

  const { modules } = useModules(starshipId);
  const { crew } = useCrew(starshipId);
  const currentUser = getAuth().currentUser;

  const isCaptain =
    crew.find(c => c.uid === currentUser?.uid)?.role === 'captain' ||
    existingMission === undefined; // If adding, assume captain for now as per app flow

  const [title, setTitle] = useState(existingMission?.title || '');
  const [description, setDescription] = useState(
    existingMission?.description || '',
  );
  const [difficulty, setDifficulty] = useState<Mission['difficulty']>(
    existingMission?.difficulty || 'easy',
  );
  const [creditReward, setCreditReward] = useState(
    existingMission?.creditReward?.toString() || '50',
  );
  const [isCustomReward, setIsCustomReward] = useState(
    existingMission?.creditReward
      ? !REWARD_PRESETS.includes(existingMission.creditReward)
      : false,
  );
  const [moduleId, setModuleId] = useState(existingMission?.moduleId || '');
  const [assignedTo, setAssignedTo] = useState(
    existingMission?.assignedTo || '',
  );
  const [tasks, setTasks] = useState(existingMission?.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTaskTitle.trim(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let missionStatus = existingMission?.status || 'pending';
      if (!isEditing) {
        missionStatus = assignedTo ? 'active' : 'pending';
      } else if (missionStatus === 'pending' && assignedTo) {
        missionStatus = 'active';
      } else if (missionStatus === 'active' && !assignedTo) {
        missionStatus = 'pending';
      }

      const missionData = {
        title,
        description,
        difficulty,
        creditReward: parseInt(creditReward, 10),
        moduleId,
        assignedTo,
        status: missionStatus,
        tasks: tasks,
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
      'DELETE CHORE',
      `Are you sure you want to remove the chore "${title}"?`,
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'DELETE',
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
              placeholder="E.G. CLEAN THE KITCHEN..."
            />

            <SciFiInput
              label="Instructions"
              value={description}
              onChangeText={setDescription}
              placeholder="CHORE DESCRIPTION..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>CHECKLIST TASKS</Text>
              <View style={styles.sectionLine} />
            </View>

            {tasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <Text style={styles.taskText}>{task.title}</Text>
                <TouchableOpacity onPress={() => handleRemoveTask(task.id)}>
                  <X size={16} color={Colors.neonOrange} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addTaskContainer}>
              <View style={{ flex: 1 }}>
                <SciFiInput
                  label=""
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  placeholder="ADD SUB-TASK..."
                />
              </View>
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={handleAddTask}
              >
                <Plus size={20} color={Colors.deepObsidian} />
              </TouchableOpacity>
            </View>
          </View>

          {isCaptain && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionLine} />
                <Text style={styles.sectionTitle}>ASSIGN TO</Text>
                <View style={styles.sectionLine} />
              </View>

              <View style={styles.moduleGrid}>
                <TouchableOpacity
                  style={[
                    styles.moduleItem,
                    assignedTo === '' && styles.moduleItemActive,
                  ]}
                  onPress={() => setAssignedTo('')}
                >
                  <Text
                    style={[
                      styles.moduleItemText,
                      assignedTo === '' && styles.moduleItemTextActive,
                    ]}
                  >
                    UNASSIGNED
                  </Text>
                </TouchableOpacity>
                {crew
                  .filter(member => member.uid && member.name)
                  .map(member => (
                    <TouchableOpacity
                      key={member.uid}
                      style={[
                        styles.moduleItem,
                        assignedTo === member.uid && styles.moduleItemActive,
                      ]}
                      onPress={() => setAssignedTo(member.uid!)}
                    >
                      <Text
                        style={[
                          styles.moduleItemText,
                          assignedTo === member.uid &&
                            styles.moduleItemTextActive,
                        ]}
                      >
                        {(member.name || '').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          )}

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

            <Text style={styles.label}>Reward (Points & XP)</Text>
            <View style={styles.rewardPresetsGrid}>
              {REWARD_PRESETS.map(preset => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.presetItem,
                    !isCustomReward &&
                      parseInt(creditReward, 10) === preset &&
                      styles.presetItemActive,
                  ]}
                  onPress={() => {
                    setCreditReward(preset.toString());
                    setIsCustomReward(false);
                  }}
                >
                  <Text
                    style={[
                      styles.presetItemText,
                      !isCustomReward &&
                        parseInt(creditReward, 10) === preset &&
                        styles.presetItemTextActive,
                    ]}
                  >
                    {preset}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.presetItem,
                  isCustomReward && styles.presetItemActive,
                ]}
                onPress={() => setIsCustomReward(true)}
              >
                <Text
                  style={[
                    styles.presetItemText,
                    isCustomReward && styles.presetItemTextActive,
                  ]}
                >
                  CUSTOM
                </Text>
              </TouchableOpacity>
            </View>

            {isCustomReward && (
              <SciFiInput
                label="Custom Reward Amount"
                value={creditReward}
                onChangeText={setCreditReward}
                placeholder="Enter custom amount"
                keyboardType="numeric"
              />
            )}

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
              <Text style={styles.deleteButtonText}>DELETE CHORE</Text>
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
  rewardPresetsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  presetItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    borderRadius: 8,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
  },
  presetItemActive: {
    borderColor: Colors.cyan,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
  },
  presetItemText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  presetItemTextActive: {
    color: Colors.white,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
    fontStyle: 'italic',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.1)',
  },
  taskText: {
    color: Colors.white,
    fontSize: 12,
    flex: 1,
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  addTaskButton: {
    backgroundColor: Colors.cyan,
    width: 44,
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4, // Align with input
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
