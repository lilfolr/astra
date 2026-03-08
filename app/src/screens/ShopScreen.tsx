import React, { useState, useMemo } from 'react';
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
  ShoppingBag,
  CircleDollarSign,
  Plus,
  ChevronRight,
  PackageCheck,
  Package,
  Clock,
  Edit2,
} from 'lucide-react-native';
import * as Icons from 'lucide-react-native';
import SciFiBackground from '../components/SciFiBackground';
import Colors from '../theme/colors';
import {
  useShopItems,
  usePurchases,
  useDiscoverStarship,
  useCrew,
  starshipService,
  type ShopItem,
  type Purchase,
} from '../data';
import { getAuth } from '@react-native-firebase/auth';

type ShopScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Shop'>;

interface Props {
  navigation: ShopScreenNavigationProp;
}

const ShopScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'orders'>('items');
  const { starshipId, loading: discovering } = useDiscoverStarship();
  const { items, loading: itemsLoading } = useShopItems(starshipId);
  const { purchases, loading: purchasesLoading } = usePurchases(starshipId);
  const { crew } = useCrew(starshipId);

  const currentUser = getAuth().currentUser;
  const myCrewMember = useMemo(
    () => crew.find(c => c.uid === currentUser?.uid),
    [crew, currentUser],
  );
  const isCaptain = myCrewMember?.role === 'captain';

  const handlePurchase = async (item: ShopItem & { id: string }) => {
    if (!starshipId || !myCrewMember) return;

    if (myCrewMember.credits < item.price) {
      Alert.alert(
        'INSUFFICIENT CREDITS',
        'You do not have enough credits for this item.',
      );
      return;
    }

    Alert.alert('CONFIRM PURCHASE', `Buy ${item.name} for ${item.price} CR?`, [
      { text: 'CANCEL', style: 'cancel' },
      {
        text: 'PURCHASE',
        onPress: async () => {
          try {
            await starshipService.purchaseItem(
              starshipId,
              myCrewMember.id,
              item,
            );
            Alert.alert(
              'SUCCESS',
              'Purchase successful! Awaiting fulfillment.',
            );
          } catch (error: any) {
            Alert.alert(
              'ERROR',
              error.message || 'Failed to complete purchase.',
            );
          }
        },
      },
    ]);
  };

  const handleFulfill = async (purchaseId: string) => {
    if (!starshipId) return;
    try {
      await starshipService.fulfillPurchase(starshipId, purchaseId);
    } catch (error: any) {
      Alert.alert('ERROR', error.message || 'Failed to fulfill order.');
    }
  };

  const renderItemCard = (item: ShopItem & { id: string }) => {
    const IconComponent = (Icons as any)[item.icon] || Icons.Package;

    return (
      <View key={item.id} style={styles.itemCard}>
        <View style={styles.itemIconContainer}>
          <IconComponent color={Colors.cyan} size={24} />
        </View>
        <View style={styles.itemInfo}>
          <View style={styles.itemTitleRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            {isCaptain && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ShopItemForm', {
                    starshipId: starshipId!,
                    item,
                  })
                }
              >
                <Edit2 size={16} color={Colors.cyan} opacity={0.6} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <View style={styles.itemFooter}>
            <View style={styles.priceTag}>
              <CircleDollarSign size={14} color={Colors.neonOrange} />
              <Text style={styles.priceText}>{item.price} CR</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.buyButton,
                myCrewMember &&
                  myCrewMember.credits < item.price &&
                  styles.buyButtonDisabled,
              ]}
              onPress={() => handlePurchase(item)}
            >
              <Text style={styles.buyButtonText}>PURCHASE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderPurchaseCard = (purchase: Purchase & { id: string }) => {
    const purchaser = crew.find(c => c.uid === purchase.purchaserId);
    const isPending = purchase.status === 'pending';

    return (
      <View
        key={purchase.id}
        style={[styles.purchaseCard, !isPending && styles.fulfilledCard]}
      >
        <View style={styles.purchaseHeader}>
          <View style={styles.purchaserInfo}>
            <Text style={styles.purchaserName}>
              {purchaser?.name || 'Unknown'}
            </Text>
            <Text style={styles.purchaseDate}>
              {new Date(purchase.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isPending ? styles.pendingBadge : styles.fulfilledBadge,
            ]}
          >
            <Text style={styles.statusBadgeText}>
              {purchase.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.purchaseBody}>
          <Text style={styles.purchaseItemName}>{purchase.itemName}</Text>
          <Text style={styles.purchasePrice}>{purchase.price} CR</Text>
        </View>

        {isCaptain && isPending && (
          <TouchableOpacity
            style={styles.fulfillButton}
            onPress={() => handleFulfill(purchase.id)}
          >
            <PackageCheck size={16} color={Colors.deepObsidian} />
            <Text style={styles.fulfillButtonText}>MARK AS FULFILLED</Text>
          </TouchableOpacity>
        )}
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
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>PROVISIONS</Text>
            <View style={styles.creditsDisplay}>
              <CircleDollarSign size={14} color={Colors.neonOrange} />
              <Text style={styles.creditsText}>
                {myCrewMember?.credits || 0} CR
              </Text>
            </View>
          </View>
          <ShoppingBag size={28} color={Colors.cyan} opacity={0.8} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'items' && styles.activeTab]}
            onPress={() => setActiveTab('items')}
          >
            <Package
              size={18}
              color={activeTab === 'items' ? Colors.cyan : Colors.grey}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'items' && styles.activeTabText,
              ]}
            >
              SHOP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
            onPress={() => setActiveTab('orders')}
          >
            <Clock
              size={18}
              color={activeTab === 'orders' ? Colors.cyan : Colors.grey}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'orders' && styles.activeTabText,
              ]}
            >
              ORDERS
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'items' && isCaptain && (
            <TouchableOpacity
              style={styles.addItemButton}
              onPress={() =>
                navigation.navigate('ShopItemForm', { starshipId: starshipId! })
              }
            >
              <Plus size={20} color={Colors.cyan} />
              <Text style={styles.addItemButtonText}>ADD NEW PROVISION</Text>
            </TouchableOpacity>
          )}

          {discovering || itemsLoading || purchasesLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={Colors.cyan} size="large" />
              <Text style={styles.loadingText}>ACCESSING LOGISTICS...</Text>
            </View>
          ) : activeTab === 'items' ? (
            items.length === 0 ? (
              <View style={styles.centered}>
                <ShoppingBag size={48} color={Colors.cyan} opacity={0.2} />
                <Text style={styles.emptyText}>SHOP IS CURRENTLY EMPTY</Text>
              </View>
            ) : (
              items.map(renderItemCard)
            )
          ) : purchases.length === 0 ? (
            <View style={styles.centered}>
              <Clock size={48} color={Colors.cyan} opacity={0.2} />
              <Text style={styles.emptyText}>NO ORDERS FOUND</Text>
            </View>
          ) : (
            purchases.map(renderPurchaseCard)
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 255, 0.2)',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 2,
  },
  creditsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  creditsText: {
    color: Colors.neonOrange,
    fontSize: 12,
    fontWeight: 'bold',
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
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderRadius: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.grey,
    letterSpacing: 1,
  },
  activeTabText: {
    color: Colors.cyan,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 255, 255, 0.05)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  addItemButtonText: {
    color: Colors.cyan,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 30, 35, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.15)',
    gap: 16,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.2)',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  itemDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
    lineHeight: 18,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    color: Colors.neonOrange,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: Colors.cyan,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buyButtonDisabled: {
    backgroundColor: Colors.grey,
    opacity: 0.5,
  },
  buyButtonText: {
    color: Colors.deepObsidian,
    fontSize: 10,
    fontWeight: '900',
  },
  purchaseCard: {
    backgroundColor: 'rgba(16, 30, 35, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.15)',
  },
  fulfilledCard: {
    opacity: 0.6,
    borderColor: 'rgba(0, 255, 255, 0.05)',
  },
  purchaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingBottom: 8,
  },
  purchaserInfo: {
    flex: 1,
  },
  purchaserName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  purchaseDate: {
    color: Colors.grey,
    fontSize: 10,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  pendingBadge: {
    borderColor: Colors.neonOrange,
    backgroundColor: 'rgba(255, 95, 31, 0.1)',
  },
  fulfilledBadge: {
    borderColor: '#4ade80',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  statusBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: Colors.white,
  },
  purchaseBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  purchaseItemName: {
    color: Colors.cyan,
    fontSize: 16,
    fontWeight: '700',
  },
  purchasePrice: {
    color: Colors.neonOrange,
    fontSize: 14,
    fontWeight: 'bold',
  },
  fulfillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4ade80',
    borderRadius: 6,
    paddingVertical: 10,
  },
  fulfillButtonText: {
    color: Colors.deepObsidian,
    fontSize: 12,
    fontWeight: '900',
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
  emptyText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ShopScreen;
