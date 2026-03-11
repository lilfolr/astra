import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  getDocs,
  serverTimestamp,
  collectionGroup,
} from '@react-native-firebase/firestore';
import * as v from 'valibot';
import { getAuth, signInAnonymously } from '@react-native-firebase/auth';
import { dataLogger } from '../logger';
import {
  StarshipSchema,
  MissionSchema,
  ModuleSchema,
  CrewSchema,
  UserStarshipSchema,
  ShopItemSchema,
  PurchaseSchema,
  type Starship,
  type Mission,
  type Module,
  type Crew,
  type UserStarship,
  type ShopItem,
  type Purchase,
} from '../models';

/**
 * Service for performing CRUD operations on Starship-related data in Firestore.
 */
export const starshipService = {
  /**
   * Updates an existing starship.
   */
  async updateStarship(starshipId: string, data: Partial<Starship>) {
    dataLogger.logRequest('updateStarship', { starshipId, data });
    try {
      const PartialStarshipSchema = v.partial(StarshipSchema);
      const validated = v.parse(PartialStarshipSchema, data);

      await updateDoc(doc(getFirestore(), `api/v1/starships/${starshipId}`), {
        ...validated,
        lastUpdate: serverTimestamp(),
      });
      dataLogger.logResponse('updateStarship', {
        starshipId,
        status: 'success',
      });
    } catch (error) {
      dataLogger.logError('updateStarship', error);
      throw error;
    }
  },

  /**
   * Verifies a mission, marking it as completed and awarding credits/XP.
   */
  async verifyMission(starshipId: string, missionId: string) {
    dataLogger.logRequest('verifyMission', { starshipId, missionId });
    try {
      const db = getFirestore();
      const missionRef = doc(
        db,
        `api/v1/starships/${starshipId}/missions/${missionId}`,
      );
      const missionSnap = await getDoc(missionRef);

      const exists =
        typeof missionSnap.exists === 'function'
          ? missionSnap.exists()
          : missionSnap.exists;
      if (!exists) throw new Error('Mission not found');

      const missionData = missionSnap.data() as Mission;
      if (missionData.status === 'completed') {
        return; // Already verified
      }

      const assignedToUid = missionData.assignedTo;
      if (!assignedToUid) {
        // Just mark as completed if no one is assigned
        await updateDoc(missionRef, { status: 'completed' });
        return;
      }

      // Find the crew member record for the assigned user
      const crewQuery = query(
        collection(db, `api/v1/starships/${starshipId}/crew`),
        where('uid', '==', assignedToUid),
        limit(1),
      );
      const crewSnap = await getDocs(crewQuery);

      if (!crewSnap.empty) {
        const crewDoc = crewSnap.docs[0];
        const crewData = crewDoc.data() as Crew;

        const reward = missionData.creditReward || 0;

        // Award credits and XP
        await updateDoc(crewDoc.ref, {
          credits: (crewData.credits || 0) + reward,
          xp: (crewData.xp || 0) + reward,
          lastSeen: Date.now(),
        });
      }

      // Mark mission as completed
      await updateDoc(missionRef, { status: 'completed' });

      dataLogger.logResponse('verifyMission', { status: 'success' });
    } catch (error) {
      dataLogger.logError('verifyMission', error);
      throw error;
    }
  },

  /**
   * Deletes an existing module.
   */
  async deleteModule(starshipId: string, moduleId: string) {
    dataLogger.logRequest('deleteModule', { starshipId, moduleId });
    try {
      await deleteDoc(
        doc(
          getFirestore(),
          `api/v1/starships/${starshipId}/modules/${moduleId}`,
        ),
      );
      dataLogger.logResponse('deleteModule', {
        starshipId,
        moduleId,
        status: 'success',
      });
    } catch (error) {
      dataLogger.logError('deleteModule', error);
      throw error;
    }
  },

  /**
   * Updates an existing module.
   */
  async updateModule(
    starshipId: string,
    moduleId: string,
    data: Partial<Module>,
  ) {
    dataLogger.logRequest('updateModule', { starshipId, moduleId, data });
    try {
      const PartialModuleSchema = v.partial(ModuleSchema);
      const validated = v.parse(PartialModuleSchema, data);

      await updateDoc(
        doc(
          getFirestore(),
          `api/v1/starships/${starshipId}/modules/${moduleId}`,
        ),
        validated,
      );
      dataLogger.logResponse('updateModule', {
        starshipId,
        moduleId,
        status: 'success',
      });
    } catch (error) {
      dataLogger.logError('updateModule', error);
      throw error;
    }
  },

  /**
   * Adds a new mission to a starship.
   */
  async addMission(starshipId: string, mission: Mission) {
    dataLogger.logRequest('addMission', { starshipId, mission });
    try {
      const validated = v.parse(MissionSchema, mission);
      const result = await addDoc(
        collection(getFirestore(), `api/v1/starships/${starshipId}/missions`),
        validated,
      );
      dataLogger.logResponse('addMission', { id: result.id });
      return result;
    } catch (error) {
      dataLogger.logError('addMission', error);
      throw error;
    }
  },

  /**
   * Updates an existing mission.
   */
  async updateMission(
    starshipId: string,
    missionId: string,
    data: Partial<Mission>,
  ) {
    dataLogger.logRequest('updateMission', { starshipId, missionId, data });
    try {
      const PartialMissionSchema = v.partial(MissionSchema);
      const validated = v.parse(PartialMissionSchema, data);

      await updateDoc(
        doc(
          getFirestore(),
          `api/v1/starships/${starshipId}/missions/${missionId}`,
        ),
        validated,
      );
      dataLogger.logResponse('updateMission', {
        starshipId,
        missionId,
        status: 'success',
      });
    } catch (error) {
      dataLogger.logError('updateMission', error);
      throw error;
    }
  },

  /**
   * Deletes an existing mission.
   */
  async deleteMission(starshipId: string, missionId: string) {
    dataLogger.logRequest('deleteMission', { starshipId, missionId });
    try {
      await deleteDoc(
        doc(
          getFirestore(),
          `api/v1/starships/${starshipId}/missions/${missionId}`,
        ),
      );
      dataLogger.logResponse('deleteMission', {
        starshipId,
        missionId,
        status: 'success',
      });
    } catch (error) {
      dataLogger.logError('deleteMission', error);
      throw error;
    }
  },

  /**
   * Adds a new module to a starship.
   */
  async addModule(starshipId: string, module: Module) {
    dataLogger.logRequest('addModule', { starshipId, module });
    try {
      const validated = v.parse(ModuleSchema, module);
      const result = await addDoc(
        collection(getFirestore(), `api/v1/starships/${starshipId}/modules`),
        validated,
      );
      dataLogger.logResponse('addModule', { id: result.id });
      return result;
    } catch (error) {
      dataLogger.logError('addModule', error);
      throw error;
    }
  },

  /**
   * Adds a new crew member to a starship.
   */
  async addCrewMember(starshipId: string, crew: Crew) {
    dataLogger.logRequest('addCrewMember', { starshipId, crew });
    try {
      const validated = v.parse(CrewSchema, crew);
      const result = await addDoc(
        collection(getFirestore(), `api/v1/starships/${starshipId}/crew`),
        validated,
      );
      dataLogger.logResponse('addCrewMember', { id: result.id });
      return result;
    } catch (error) {
      dataLogger.logError('addCrewMember', error);
      throw error;
    }
  },

  /**
   * Updates an existing crew member's data.
   */
  async updateCrewMember(
    starshipId: string,
    crewId: string,
    data: Partial<Crew>,
  ) {
    dataLogger.logRequest('updateCrewMember', { starshipId, crewId, data });
    try {
      const PartialCrewSchema = v.partial(CrewSchema);
      const validated = v.parse(PartialCrewSchema, data);

      await updateDoc(
        doc(getFirestore(), `api/v1/starships/${starshipId}/crew/${crewId}`),
        validated,
      );
      dataLogger.logResponse('updateCrewMember', {
        starshipId,
        crewId,
        status: 'success',
      });
    } catch (error) {
      dataLogger.logError('updateCrewMember', error);
      throw error;
    }
  },

  /**
   * Disables or enables a crew member.
   */
  async setCrewMemberDisabled(
    starshipId: string,
    crewId: string,
    uid: string | undefined,
    disabled: boolean,
  ) {
    dataLogger.logRequest('setCrewMemberDisabled', {
      starshipId,
      crewId,
      uid,
      disabled,
    });
    try {
      // 1. Update crew member document
      await this.updateCrewMember(starshipId, crewId, { disabled });

      // 2. Update user mapping if UID exists
      if (uid) {
        const userStarshipRef = doc(
          getFirestore(),
          `api/v1/userStarships/${uid}`,
        );
        await updateDoc(userStarshipRef, {
          disabled,
          lastUpdate: serverTimestamp(),
        });
      }

      dataLogger.logResponse('setCrewMemberDisabled', { status: 'success' });
    } catch (error) {
      dataLogger.logError('setCrewMemberDisabled', error);
      throw error;
    }
  },

  /**
   * Finds a starship by its primary captain's UID.
   */
  async getStarshipByCaptainId(captainId: string): Promise<Starship | null> {
    dataLogger.logRequest('getStarshipByCaptainId', { captainId });
    try {
      const q = query(
        collection(getFirestore(), 'api/v1/starships'),
        where('primaryCaptainId', '==', captainId),
        limit(1),
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        dataLogger.logResponse('getStarshipByCaptainId', null);
        return null;
      }

      const snapshotDoc = snapshot.docs[0];
      const data = snapshotDoc.data();
      const validated = v.parse(StarshipSchema, {
        ...data,
        starshipId: snapshotDoc.id,
      });
      dataLogger.logResponse('getStarshipByCaptainId', validated);
      return validated;
    } catch (error) {
      dataLogger.logError('getStarshipByCaptainId', error);
      throw error;
    }
  },

  /**
   * Helper to set hull integrity.
   */
  async setHullIntegrity(starshipId: string, integrity: number) {
    if (integrity < 0 || integrity > 100) {
      throw new Error('Hull integrity must be between 0 and 100');
    }
    await this.updateStarship(starshipId, { hullIntegrity: integrity } as any);
  },

  /**
   * Links a user to a starship.
   */
  async linkUserToStarship(userId: string, starshipId: string) {
    dataLogger.logRequest('linkUserToStarship', { userId, starshipId });
    try {
      const data = { userId, starshipId, lastUpdate: serverTimestamp() };
      // Note: We don't validate serverTimestamp() with UserStarshipSchema if it's strictly typed,
      // but v.any() for lastUpdate should handle it.
      v.parse(UserStarshipSchema, data);

      await setDoc(doc(getFirestore(), `api/v1/userStarships/${userId}`), data);
      dataLogger.logResponse('linkUserToStarship', { status: 'success' });
    } catch (error) {
      dataLogger.logError('linkUserToStarship', error);
      throw error;
    }
  },

  /**
   * Refreshes the registration code for a crew member.
   * Sets a new 6-character code and 10-minute expiry.
   */
  async refreshRegistrationCode(starshipId: string, crewId: string) {
    const registrationCode = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    //FIXME: Enforce this on the client side for now, but should ideally be enforced server-side with security rules or Cloud Functions.
    const registrationCodeExpiry = Date.now() + 10 * 60 * 1000;

    await this.updateCrewMember(starshipId, crewId, {
      registrationCode,
      registrationCodeExpiry,
    });

    return { registrationCode, registrationCodeExpiry };
  },

  /**
   * Validates a registration code for a crew member.
   */
  async validateRegistrationCode(
    starshipId: string,
    crewId: string,
    code: string,
  ) {
    const docRef = doc(
      getFirestore(),
      `api/v1/starships/${starshipId}/crew/${crewId}`,
    );
    const snapshot = await getDoc(docRef);

    const exists =
      typeof snapshot.exists === 'function'
        ? snapshot.exists()
        : snapshot.exists;

    if (!exists) {
      throw new Error('Crew member not found');
    }

    const data = snapshot.data() as Crew;
    if (data.registrationCode !== code) {
      throw new Error('Invalid registration code');
    }

    if (Date.now() > data.registrationCodeExpiry) {
      throw new Error('Registration code has expired');
    }

    return true;
  },

  /**
   * Joins a starship as a crew member using a registration code.
   * This handles anonymous authentication if the user is not logged in.
   *
   * NOTE: In a production environment, this logic should be moved to a
   * secure server-side environment (e.g., Firebase Cloud Functions) to
   * prevent unauthorized users from claiming crew slots.
   * The server should validate the registration code before linking the UID.
   */
  async joinStarshipAsCrew(starshipId: string, crewId: string, code: string) {
    dataLogger.logRequest('joinStarshipAsCrew', { starshipId, crewId, code });

    try {
      // 1. Validate the code
      await this.validateRegistrationCode(starshipId, crewId, code);

      // 2. Ensure user is authenticated
      let currentUser = getAuth().currentUser;
      if (!currentUser) {
        const credential = await signInAnonymously(getAuth());
        currentUser = credential.user;
      }

      // 3. Link the user to the crew member
      // TODO: This write should ideally be protected by a Cloud Function that verifies the code.
      await this.updateCrewMember(starshipId, crewId, {
        uid: currentUser.uid,
        status: 'stable',
        lastSeen: Date.now(),
      });

      dataLogger.logResponse('joinStarshipAsCrew', { status: 'success' });
      return currentUser;
    } catch (error) {
      dataLogger.logError('joinStarshipAsCrew', error);
      throw error;
    }
  },

  /**
   * Gets the starship ID for a user.
   */
  async getStarshipIdForUser(userId: string): Promise<string | null> {
    dataLogger.logRequest('getStarshipIdForUser', { userId });
    try {
      const docRef = doc(getFirestore(), `api/v1/userStarships/${userId}`);
      const snapshot = await getDoc(docRef);

      const exists =
        typeof snapshot.exists === 'function'
          ? snapshot.exists()
          : snapshot.exists;

      if (!exists) {
        dataLogger.logResponse('getStarshipIdForUser', null);
        return null;
      }
      const data = snapshot.data() as UserStarship;
      dataLogger.logResponse('getStarshipIdForUser', data.starshipId);
      return data.starshipId;
    } catch (error) {
      dataLogger.logError('getStarshipIdForUser', error);
      throw error;
    }
  },

  /**
   * Adds a new shop item.
   */
  async addShopItem(starshipId: string, item: ShopItem) {
    dataLogger.logRequest('addShopItem', { starshipId, item });
    try {
      const validated = v.parse(ShopItemSchema, item);
      const result = await addDoc(
        collection(getFirestore(), `api/v1/starships/${starshipId}/shopItems`),
        validated,
      );
      dataLogger.logResponse('addShopItem', { id: result.id });
      return result;
    } catch (error) {
      dataLogger.logError('addShopItem', error);
      throw error;
    }
  },

  /**
   * Updates an existing shop item.
   */
  async updateShopItem(
    starshipId: string,
    itemId: string,
    data: Partial<ShopItem>,
  ) {
    dataLogger.logRequest('updateShopItem', { starshipId, itemId, data });
    try {
      const PartialShopItemSchema = v.partial(ShopItemSchema);
      const validated = v.parse(PartialShopItemSchema, data);

      await updateDoc(
        doc(
          getFirestore(),
          `api/v1/starships/${starshipId}/shopItems/${itemId}`,
        ),
        validated,
      );
      dataLogger.logResponse('updateShopItem', { status: 'success' });
    } catch (error) {
      dataLogger.logError('updateShopItem', error);
      throw error;
    }
  },

  /**
   * Deletes a shop item.
   */
  async deleteShopItem(starshipId: string, itemId: string) {
    dataLogger.logRequest('deleteShopItem', { starshipId, itemId });
    try {
      await deleteDoc(
        doc(
          getFirestore(),
          `api/v1/starships/${starshipId}/shopItems/${itemId}`,
        ),
      );
      dataLogger.logResponse('deleteShopItem', { status: 'success' });
    } catch (error) {
      dataLogger.logError('deleteShopItem', error);
      throw error;
    }
  },

  /**
   * Records a purchase and deducts credits from the user.
   */
  async purchaseItem(
    starshipId: string,
    crewId: string,
    item: ShopItem & { id: string },
  ) {
    dataLogger.logRequest('purchaseItem', { starshipId, crewId, item });
    try {
      const db = getFirestore();
      const crewRef = doc(db, `api/v1/starships/${starshipId}/crew/${crewId}`);
      const crewSnap = await getDoc(crewRef);

      if (!crewSnap.exists) throw new Error('Crew member not found');
      const crewData = crewSnap.data() as Crew;

      if (crewData.credits < item.price) {
        throw new Error('Insufficient credits');
      }

      // 1. Deduct credits
      await updateDoc(crewRef, {
        credits: crewData.credits - item.price,
      });

      // 2. Record purchase
      const purchaseData: Purchase = {
        purchaserId: crewData.uid || '',
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        status: 'pending',
        createdAt: Date.now(),
      };

      const validated = v.parse(PurchaseSchema, purchaseData);
      const result = await addDoc(
        collection(db, `api/v1/starships/${starshipId}/purchases`),
        validated,
      );

      // TODO: Notify parent of new purchase

      dataLogger.logResponse('purchaseItem', { id: result.id });
      return result;
    } catch (error) {
      dataLogger.logError('purchaseItem', error);
      throw error;
    }
  },

  /**
   * Marks a purchase as fulfilled.
   */
  async fulfillPurchase(starshipId: string, purchaseId: string) {
    dataLogger.logRequest('fulfillPurchase', { starshipId, purchaseId });
    try {
      await updateDoc(
        doc(
          getFirestore(),
          `api/v1/starships/${starshipId}/purchases/${purchaseId}`,
        ),
        {
          status: 'fulfilled',
          fulfilledAt: Date.now(),
        },
      );
      dataLogger.logResponse('fulfillPurchase', { status: 'success' });
    } catch (error) {
      dataLogger.logError('fulfillPurchase', error);
      throw error;
    }
  },
  /**
   * Ensures the captain has a crew record in the starship's crew collection.
   */
  async ensureCaptainCrewRecord(
    starshipId: string,
    captainUid: string,
    captainName: string,
  ) {
    dataLogger.logRequest('ensureCaptainCrewRecord', {
      starshipId,
      captainUid,
    });
    try {
      const db = getFirestore();
      const crewQuery = query(
        collection(db, `api/v1/starships/${starshipId}/crew`),
        where('uid', '==', captainUid),
        limit(1),
      );
      const crewSnap = await getDocs(crewQuery);

      if (crewSnap.empty) {
        const newCrew: Crew = {
          uid: captainUid,
          name: captainName,
          role: 'captain',
          credits: 0,
          xp: 0,
          level: 1,
          createdDate: Date.now(),
          status: 'stable',
          lastSeen: Date.now(),
          registrationCode: '',
          registrationCodeExpiry: 0,
          disabled: false,
          theme: 'auto',
          notificationsEnabled: true,
          audioEffectsEnabled: true,
        };
        await this.addCrewMember(starshipId, newCrew);
        dataLogger.logResponse('ensureCaptainCrewRecord', {
          status: 'created',
        });
      } else {
        dataLogger.logResponse('ensureCaptainCrewRecord', { status: 'exists' });
      }
    } catch (error) {
      dataLogger.logError('ensureCaptainCrewRecord', error);
      throw error;
    }
  },

  /**
   * Finds a starship by a crew member's UID.
   *
   * NOTE: This requires a Firestore collection group index on the 'crew'
   * collection for the 'uid' field. If not present, this query will fail.
   * Link to create index: https://console.firebase.google.com/project/_/database/firestore/indices
   */
  async getStarshipByCrewUid(uid: string): Promise<Starship | null> {
    dataLogger.logRequest('getStarshipByCrewUid', { uid });
    try {
      const q = query(
        collectionGroup(getFirestore(), 'crew'),
        where('uid', '==', uid),
        limit(1),
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        dataLogger.logResponse('getStarshipByCrewUid', null);
        return null;
      }

      const crewDoc = snapshot.docs[0];
      const starshipDocRef = crewDoc.ref.parent.parent;
      if (!starshipDocRef) {
        return null;
      }

      const starshipSnapshot = await getDoc(starshipDocRef);
      const exists =
        typeof starshipSnapshot.exists === 'function'
          ? starshipSnapshot.exists()
          : starshipSnapshot.exists;

      if (!exists) {
        return null;
      }

      const data = starshipSnapshot.data();
      if (!data) {
        return null;
      }

      const validated = v.parse(StarshipSchema, {
        ...(data as object),
        starshipId: starshipSnapshot.id,
      });
      dataLogger.logResponse('getStarshipByCrewUid', validated);
      return validated;
    } catch (error) {
      dataLogger.logError('getStarshipByCrewUid', error);
      throw error;
    }
  },
};
