import * as v from 'valibot';

/**
 * Starship status can be nominal, warning, or critical.
 */
export const StarshipStatusSchema = v.picklist(
  ['nominal', 'warning', 'critical'],
  'Status must be one of: nominal, warning, critical'
);

/**
 * Schema for a Starship (Starship Survival starship).
 * Represents a starship (household).
 */
export const StarshipSchema = v.object({
  /** Unique identifier for the starship */
  starshipId: v.pipe(v.string('Starship ID must be a string'), v.nonEmpty('Starship ID is required')),
  /** UID of the primary captain (owner) */
  primaryCaptainId: v.pipe(v.string('Primary Captain ID must be a string'), v.nonEmpty('Primary Captain ID is required')),
  /** Display name of the starship */
  name: v.pipe(v.string('Starship name must be a string'), v.nonEmpty('Starship name is required')),
  /** Hull integrity from 0 to 100 */
  hullIntegrity: v.pipe(
    v.number('Hull integrity must be a number'),
    v.minValue(0, 'Hull integrity cannot be less than 0'),
    v.maxValue(100, 'Hull integrity cannot be more than 100')
  ),
  /** Number of missions yet to be completed */
  incompleteMissionCount: v.pipe(
    v.number('Incomplete mission count must be a number'),
    v.minValue(0, 'Incomplete mission count cannot be negative')
  ),
  /** Current status of the ship */
  status: StarshipStatusSchema,
  /** Last time the starship record was updated */
  lastUpdate: v.any(), // Typically a Firebase Timestamp
});

export type Starship = v.InferOutput<typeof StarshipSchema>;

/**
 * Schema for a Module.
 * Represents a room in the house.
 */
export const ModuleSchema = v.object({
  /** Name of the module (e.g., "Bridge", "Engine Room") */
  name: v.pipe(v.string('Module name must be a string'), v.nonEmpty('Module name is required')),
  /** Real world room name (e.g., "Living Room", "Kitchen") */
  realWorldRoom: v.pipe(v.string('Real world room must be a string'), v.nonEmpty('Real world room name is required')),
  /** List of missions that are incomplete in this module */
  incompleteMissions: v.array(
    v.object({
      id: v.pipe(v.string('Mission ID must be a string'), v.nonEmpty('Mission ID is required')),
    }),
    'Incomplete missions must be an array of objects with an id'
  ),
});

export type Module = v.InferOutput<typeof ModuleSchema>;

/**
 * Mission difficulty levels.
 */
export const MissionDifficultySchema = v.picklist(
  ['easy', 'medium', 'hard'],
  'Difficulty must be easy, medium, or hard'
);

/**
 * Mission status lifecycle.
 */
export const MissionStatusSchema = v.picklist(
  ['pending', 'active', 'under_review', 'completed'],
  'Status must be pending, active, under_review, or completed'
);

/**
 * Schema for a Mission.
 * Represents a chore or task.
 */
export const MissionSchema = v.object({
  /** Title of the mission */
  title: v.pipe(v.string('Mission title must be a string'), v.nonEmpty('Mission title is required')),
  /** Detailed description of the mission */
  description: v.string('Description must be a string'),
  /** Number of credits awarded upon completion */
  creditReward: v.pipe(
    v.number('Credit reward must be a number'),
    v.minValue(0, 'Credit reward cannot be negative')
  ),
  /** UID of the crew member assigned to this mission */
  assignedTo: v.string('Assigned To must be a valid user ID'),
  /** How hard the mission is */
  difficulty: MissionDifficultySchema,
  /** Current state of the mission */
  status: MissionStatusSchema,
});

export type Mission = v.InferOutput<typeof MissionSchema>;

/**
 * Roles available for crew members.
 */
export const CrewRoleSchema = v.picklist(
  ['captain', 'crew'],
  'Role must be either captain or crew'
);

/**
 * Schema for a Crew member.
 * Represents a user within a starship.
 */
export const CrewSchema = v.object({
  /** Firebase Authentication UID */
  uid: v.pipe(v.string('UID must be a string'), v.nonEmpty('UID is required')),
  /** Display name of the crew member */
  name: v.pipe(v.string('Name must be a string'), v.nonEmpty('Name is required')),
  /** Role within the ship */
  role: CrewRoleSchema,
  /** Current credit balance */
  credits: v.pipe(v.number('Credits must be a number'), v.minValue(0, 'Credits cannot be negative')),
  /** Experience points earned */
  xp: v.pipe(v.number('XP must be a number'), v.minValue(0, 'XP cannot be negative')),
  /** Current level of the crew member */
  level: v.pipe(v.number('Level must be a number'), v.minValue(1, 'Level must be at least 1')),
  /** Date the crew member was created (epoch) */
  createdDate: v.number('Created date must be a number'),
  /** Code used for registration/joining */
  registrationCode: v.string('Registration code must be a string'),
  /** Expiry time for the registration code (epoch) */
  registrationCodeExpiry: v.number('Registration code expiry must be a number'),
});

export type Crew = v.InferOutput<typeof CrewSchema>;
