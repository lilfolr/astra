import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
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
  type Starship,
  type Mission,
  type Module,
  type Crew,
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
      dataLogger.logResponse('updateStarship', { starshipId, status: 'success' });
    } catch (error) {
      dataLogger.logError('updateStarship', error);
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
      validated
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
  async updateMission(starshipId: string, missionId: string, data: Partial<Mission>) {
    dataLogger.logRequest('updateMission', { starshipId, missionId, data });
    try {
      const PartialMissionSchema = v.partial(MissionSchema);
      const validated = v.parse(PartialMissionSchema, data);

       await updateDoc(
      doc(getFirestore(), `api/v1/starships/${starshipId}/missions/${missionId}`),
      validated
    );
      dataLogger.logResponse('updateMission', { starshipId, missionId, status: 'success' });
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
      validated
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
      validated
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
  async updateCrewMember(starshipId: string, crewId: string, data: Partial<Crew>) {
    dataLogger.logRequest('updateCrewMember', { starshipId, crewId, data });
    try {
      const PartialCrewSchema = v.partial(CrewSchema);
      const validated = v.parse(PartialCrewSchema, data);

     await updateDoc(
      doc(getFirestore(), `api/v1/starships/${starshipId}/crew/${crewId}`),
      validated
    );
      dataLogger.logResponse('updateCrewMember', { starshipId, crewId, status: 'success' });
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
      limit(1)
    );
    const snapshot = await getDocs(q);

      if (snapshot.empty) {
        dataLogger.logResponse('getStarshipByCaptainId', null);
        return null;
      }

      const snapshotDoc = snapshot.docs[0];
      const data = snapshotDoc.data();
      const validated = v.parse(StarshipSchema, { ...data, starshipId: snapshotDoc.id });
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
  }
};
