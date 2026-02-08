# Project Overview: Astra (Starship Home)

## 1. Executive Summary
**Astra** is a co-op family management app that gamifies household chores through a "Spaceship Survival" metaphor. It moves away from the "Parent as Boss" model toward a "Shared Survival" model where every crew member (family member) is responsible for the ship's (home's) status.

## 2. Core Narrative & UI
- **The Metaphor:** The house is a Starship. Each room is a "Module" (e.g., Kitchen = Mess Hall).
- **The Shared Stake:** The primary metric is hull integrity (0-100%). It is a calculation of (Completed Missions / Assigned Missions).
- **The AI Agent:** An in-app "Ship’s AI" handles notifications (e.g., "Red Alert: Oxygen levels critical in Life Support/Laundry Room") to remove the need for parental nagging.
- **Visual Style:** "Neon Industrial" / Sci-Fi HUD. High contrast, neon accents (Cyan, Orange, Green), glassmorphism, and haptic feedback.

## 3. Technical Architecture
- **Frontend:** React Native + `react-native-game-engine` (for the interactive 2D ship map).
- **State Management:** React Context / Redux (to sync real-time state across multiple family devices).
- **Backend:** Firebase (Firestore for real-time DB, FCM for notifications, Auth for Family Grouping).

### Data Structure
- **Starship:** Top-level document containing `hull_integrity`, `crew_list`, and `modules`.
- **Modules:** Sub-collection representing rooms, containing `tasks` and `health_status`.
- **Crew:** User profiles with XP, Credits, and Class (e.g., Pilot, Engineer, Captain).

## 4. Key Mechanics
- **Missions (Chores):** Categorized by difficulty and mapped to real-world rooms.
- **Loot (Rewards):** Credits earned from missions are spent in the "Hangar" for parent-approved real-world rewards (e.g., "Shore Leave" = Screen Time).
- **Bounties:** A "Reverse Bounty" system where kids can set missions for parents (e.g., "Dad must workout to earn Silence").
- **Critical Events:** If Astra drops below a certain threshold, "Ship Systems" fail (e.g., automated Wi-Fi pause via API integrations).

## 5. Development Priorities (MVP)
- **Real-time Sync:** Ensure when a kid completes a task, the parent's "Astra" bar moves instantly.
- **Ship Mapping:** User-friendly onboarding to map home rooms to ship sectors.
- **Notification Engine:** The "Ship AI" alert system.

## 6. Tone & Voice Guidelines
The AI assistant for this project should use terminology like "Initialize," "Command Deck," "Bio-hazard," "Atmospheric Scrubbers," and "Deep Space" to stay within the product's immersive theme.