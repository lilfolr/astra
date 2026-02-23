import firestore from '@react-native-firebase/firestore';
import * as v from 'valibot';
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
    const PartialStarshipSchema = v.partial(StarshipSchema);
    const validated = v.parse(PartialStarshipSchema, data);

    await firestore()
      .doc(`api/v1/starships/${starshipId}`)
      .update({
        ...validated,
        lastUpdate: firestore.FieldValue.serverTimestamp(),
      });
  },

  /**
   * Adds a new mission to a starship.
   */
  async addMission(starshipId: string, mission: Mission) {
    const validated = v.parse(MissionSchema, mission);
    return await firestore()
      .collection(`api/v1/starships/${starshipId}/missions`)
      .add(validated);
  },

  /**
   * Updates an existing mission.
   */
  async updateMission(starshipId: string, missionId: string, data: Partial<Mission>) {
    const PartialMissionSchema = v.partial(MissionSchema);
    const validated = v.parse(PartialMissionSchema, data);

    await firestore()
      .doc(`api/v1/starships/${starshipId}/missions/${missionId}`)
      .update(validated);
  },

  /**
   * Adds a new module to a starship.
   */
  async addModule(starshipId: string, module: Module) {
    const validated = v.parse(ModuleSchema, module);
    return await firestore()
      .collection(`api/v1/starships/${starshipId}/modules`)
      .add(validated);
  },

  /**
   * Adds a new crew member to a starship.
   */
  async addCrewMember(starshipId: string, crew: Crew) {
    const validated = v.parse(CrewSchema, crew);
    return await firestore()
      .collection(`api/v1/starships/${starshipId}/crew`)
      .add(validated);
  },

  /**
   * Updates an existing crew member's data.
   */
  async updateCrewMember(starshipId: string, crewId: string, data: Partial<Crew>) {
    const PartialCrewSchema = v.partial(CrewSchema);
    const validated = v.parse(PartialCrewSchema, data);

    await firestore()
      .doc(`api/v1/starships/${starshipId}/crew/${crewId}`)
      .update(validated);
  },

  /**
   * Finds a starship by its primary captain's UID.
   */
  async getStarshipByCaptainId(captainId: string): Promise<Starship | null> {
    const snapshot = await firestore()
      .collection('api/v1/starships')
      .where('primaryCaptainId', '==', captainId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return v.parse(StarshipSchema, { ...data, starshipId: doc.id });
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
