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
} from '@react-native-firebase/firestore';
import * as v from 'valibot';
import { dataLogger } from '../logger';
import {
  StarshipSchema,
  MissionSchema,
  ModuleSchema,
  CrewSchema,
  UserStarshipSchema,
  type Starship,
  type Mission,
  type Module,
  type Crew,
  type UserStarship,
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
   * Joins a starship using a registration code.
   *
   * REQUIREMENTS OUTSIDE THIS APP:
   * 1. Firestore Index: A collection group index on 'crew' sub-collection for 'registrationCode' field is required
   *    if we were searching across all starships. However, here we have starshipId, so a standard index is enough.
   * 2. Firestore Security Rules:
   *    match /api/v1/starships/{starshipId}/crew/{crewId} {
   *      allow read: if true; // Or more restrictive based on code knowledge
   *      allow update: if request.auth != null && resource.data.registrationCode == request.resource.data.registrationCode;
   *    }
   * 3. Cloud Function (Recommended): Ideally, this logic should be in a Cloud Function to prevent
   *    unauthorized updates to crew records and ensure atomicity.
   */
  async joinStarshipWithCode(starshipId: string, code: string, userId: string) {
    dataLogger.logRequest('joinStarshipWithCode', { starshipId, code, userId });
    try {
      const crewCollection = collection(
        getFirestore(),
        `api/v1/starships/${starshipId}/crew`,
      );
      const q = query(
        crewCollection,
        where('registrationCode', '==', code),
        limit(1),
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error('Invalid registration code.');
      }

      const crewDoc = snapshot.docs[0];
      const crewData = crewDoc.data() as Crew;

      if (crewData.registrationCodeExpiry < Date.now()) {
        throw new Error('Registration code has expired.');
      }

      // Link user to starship
      await this.linkUserToStarship(userId, starshipId);

      // Update crew member record
      await this.updateCrewMember(starshipId, crewDoc.id, {
        uid: userId,
        status: 'stable',
        registrationCode: '', // Clear the code
        registrationCodeExpiry: 0,
        lastSeen: Date.now(),
      });

      dataLogger.logResponse('joinStarshipWithCode', { status: 'success' });
      return { starshipId, crewId: crewDoc.id };
    } catch (error) {
      dataLogger.logError('joinStarshipWithCode', error);
      throw error;
    }
  },

  /**
   * Regenerates a registration code for a crew member.
   */
  async regenerateRegistrationCode(starshipId: string, crewId: string) {
    dataLogger.logRequest('regenerateRegistrationCode', { starshipId, crewId });
    try {
      const registrationCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      const registrationCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

      await this.updateCrewMember(starshipId, crewId, {
        registrationCode,
        registrationCodeExpiry,
      });

      dataLogger.logResponse('regenerateRegistrationCode', {
        registrationCode,
      });
      return { registrationCode, registrationCodeExpiry };
    } catch (error) {
      dataLogger.logError('regenerateRegistrationCode', error);
      throw error;
    }
  },
};
