# Project Overview: Astra

## 1. Executive Summary
**Astra** is a co-op family management app that gamifies household chores through a "Spaceship Survival" metaphor. It moves away from the "Parent as Boss" model toward a "Shared Survival" model where every crew member (family member) is responsible for the ship's (home's) status. While the theme is sci-fi, the user interface prioritizes relatable, family-oriented terminology to ensure accessibility for both parents and children.

## 2. Core Narrative & UI
- **The Metaphor:** The house is a Starship. Each room is a "Room" (mapped to a Ship Module).
- **The Shared Stake:** The primary metric is **Family Status** (formerly Hull Integrity). It is a calculation based on the completion of assigned chores.
- **The AI Agent:** An in-app "Ship’s AI" handles notifications (e.g., "Red Alert: Oxygen levels critical in Kitchen") to remove the need for parental nagging.
- **Visual Style:** "Neon Industrial" / Sci-Fi HUD. High contrast, neon accents (Cyan, Orange, Green), and haptic feedback.
- **Terminology:** The UI uses friendly labels like **Dashboard**, **Chores**, **Family**, and **Points** while maintaining the immersive sci-fi visual aesthetic.

## 3. Technical Architecture
- **Frontend:** React Native. The application uses standard React Native components and layouts to build the "Command Deck" (Dashboard), ensuring a responsive and performant experience.
- **State Management:** Real-time Firestore subscriptions via custom hooks (e.g., `useMissions`, `useStarship`).
- **Backend:** Firebase (Firestore for real-time DB, Auth for user management and family grouping).

### Data Structure (Firestore)
- **`api/v1/starships/{starshipId}`:** Root document for a family (starship), containing `hullIntegrity` and general status.
- **`api/v1/starships/{starshipId}/modules`:** Sub-collection representing rooms in the house.
- **`api/v1/starships/{starshipId}/missions`:** Sub-collection for chores.
- **`api/v1/starships/{starshipId}/crew`:** Sub-collection for family members, including XP, Credits, and Level.
- **`api/v1/userStarships`:** A mapping collection linking user UIDs to their respective `starshipId`.

## 4. Key Mechanics
- **Chores (Missions):** Categorized by difficulty and mapped to rooms. Chores follow a lifecycle: `pending` -> `active` -> `under_review` -> `completed`.
- **Points & Rewards:** Credits earned from chores can be spent in the **Shop** for parent-approved real-world rewards.
- **Verification:** Chores marked as "Done" by a user must be verified by a "Captain" (parent) or peer to be finalized and rewards distributed.
- **Family Status:** Real-time feedback on the "health" of the home based on chore completion.

## 5. Tone & Voice Guidelines
The AI assistant and system messages should maintain the sci-fi immersion using terms like "Initialize," "Atmospheric Scrubbers," and "Deep Space," while the primary UI navigation and actions use clear, family-friendly language.
