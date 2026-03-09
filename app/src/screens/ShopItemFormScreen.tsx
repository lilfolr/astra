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
  ShoppingBag,
  Trash2,
  Tv,
  Gamepad2,
  Pizza,
  Zap,
  Ticket,
  Coffee,
  IceCream,
} from 'lucide-react-native';
import { starshipService } from '../data';
import * as v from 'valibot';
import { ShopItemSchema } from '../data/models/schemas';

type ShopItemFormScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'ShopItemForm'
>;
type ShopItemFormScreenRouteProp = RouteProp<
  AuthStackParamList,
  'ShopItemForm'
>;

interface Props {
  navigation: ShopItemFormScreenNavigationProp;
  route: ShopItemFormScreenRouteProp;
}

const SUGGESTIONS = [
  {
    name: '30m Screen Time',
    price: 50,
    description: 'Extra 30 minutes of digital exploration.',
    icon: 'Tv',
  },
  {
    name: 'Treat / Dessert',
    price: 30,
    description: 'Single serving of high-calorie rations.',
    icon: 'IceCream',
  },
  {
    name: 'Small Toy/Gift',
    price: 100,
    description: 'A minor physical item for the collection.',
    icon: 'Gamepad2',
  },
  {
    name: 'Outing to Zoo',
    price: 500,
    description: 'Excursion to the local biological reserve.',
    icon: 'Ticket',
  },
  {
    name: 'Pizza Night',
    price: 300,
    description: 'The family shares a circular nutrient disc.',
    icon: 'Pizza',
  },
];

const AVAILABLE_ICONS = [
  { name: 'Tv', Icon: Tv },
  { name: 'IceCream', Icon: IceCream },
  { name: 'Gamepad2', Icon: Gamepad2 },
  { name: 'Ticket', Icon: Ticket },
  { name: 'Pizza', Icon: Pizza },
  { name: 'Zap', Icon: Zap },
  { name: 'Coffee', Icon: Coffee },
  { name: 'ShoppingBag', Icon: ShoppingBag },
];

const ShopItemFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { starshipId, item: existingItem } = (route.params as any) || {};
  const isEditing = !!existingItem;

  const [name, setName] = useState(existingItem?.name || '');
  const [description, setDescription] = useState(
    existingItem?.description || '',
  );
  const [price, setPrice] = useState(existingItem?.price?.toString() || '50');
  const [icon, setIcon] = useState(existingItem?.icon || 'ShoppingBag');
  const [loading, setLoading] = useState(false);

  const handleSelectSuggestion = (suggestion: (typeof SUGGESTIONS)[0]) => {
    setName(suggestion.name);
    setPrice(suggestion.price.toString());
    setDescription(suggestion.description);
    setIcon(suggestion.icon);
  };

  const handleSave = async () => {
    if (!name || !price || !icon) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        name,
        description,
        price: parseInt(price, 10) || 0,
        icon,
      };

      v.parse(ShopItemSchema, itemData);

      if (isEditing && existingItem) {
        await starshipService.updateShopItem(
          starshipId,
          existingItem.id,
          itemData,
        );
      } else {
        await starshipService.addShopItem(starshipId, itemData);
      }

      navigation.goBack();
    } catch (error: any) {
      console.error('Error saving shop item:', error);
      if (v.isValiError(error)) {
        Alert.alert(
          'Validation Error',
          error.issues.map(i => i.message).join('\n'),
        );
      } else {
        Alert.alert('Error', error.message || 'Failed to save item');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingItem) return;

    Alert.alert(
      'REMOVE ITEM',
      `Are you sure you want to remove "${name}" from the shop?`,
      [
        { text: 'CANCEL', style: 'cancel' },
        {
          text: 'REMOVE',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await starshipService.deleteShopItem(starshipId, existingItem.id);
              navigation.goBack();
            } catch {
              Alert.alert('Error', 'Failed to delete item');
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

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft color={Colors.cyan} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'EDIT PROVISION' : 'ADD PROVISION'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>SUGGESTIONS</Text>
              <View style={styles.sectionLine} />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionRow}
            >
              {SUGGESTIONS.map((s, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionCard}
                  onPress={() => handleSelectSuggestion(s)}
                >
                  <Text style={styles.suggestionName}>{s.name}</Text>
                  <Text style={styles.suggestionPrice}>{s.price} CR</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionTitle}>ITEM DETAILS</Text>
              <View style={styles.sectionLine} />
            </View>
            <SciFiInput
              label="Item Name"
              value={name}
              onChangeText={setName}
              placeholder="E.G. SCREEN TIME..."
            />
            <SciFiInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="DETAILS..."
              multiline
              numberOfLines={2}
            />
            <SciFiInput
              label="Price (CR)"
              value={price}
              onChangeText={setPrice}
              placeholder="50"
              keyboardType="numeric"
            />
          </View>

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

          <View style={{ height: 20 }} />

          <SciFiButton
            title={isEditing ? 'Update Provision' : 'Add Provision'}
            onPress={handleSave}
            disabled={loading}
            icon={
              loading ? (
                <ActivityIndicator
                  color={Colors.deepObsidian}
                  style={{ marginLeft: 10 }}
                />
              ) : (
                <ShoppingBag
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
              <Text style={styles.deleteButtonText}>REMOVE FROM SHOP</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </SciFiBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  backButton: { padding: 5 },
  headerTitle: {
    color: Colors.cyan,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  scrollContent: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 25 },
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
  suggestionRow: { flexDirection: 'row', marginBottom: 5 },
  suggestionCard: {
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  suggestionName: { color: Colors.white, fontSize: 12, fontWeight: 'bold' },
  suggestionPrice: {
    color: Colors.neonOrange,
    fontSize: 10,
    marginTop: 4,
    fontWeight: '800',
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

export default ShopItemFormScreen;
