# Project Plan: Astra (v1.0)

## Phase 1: Foundation & Ship Specs (Completed)
**Goal:** Finalize the game logic and technical environment.

- [x] **Database Schema:** Designed Firestore hierarchy for Starships, Crew, Rooms, and Chores.
- [x] **Tech Spike:** Set up React Native + Firebase environment with real-time state syncing.
- [x] **Auth & Profile:** Implemented Firebase Auth with "Captain" and "Crew" role initialization.

## Phase 2: Core Systems Development (Completed)
**Goal:** Build the functional "Chore Engine."

- [x] **Room Mapping:** Created UI for parents to map home rooms to ship modules.
- [x] **Chore Logic:** Built the CRUD system for "Chores" (Missions) with a multi-stage lifecycle (Pending -> Active -> Under Review -> Completed).
- [x] **Family Linking:** Developed the "Captain's Invite" system via QR codes and registration codes.
- [x] **Real-time Sync:** Implemented Firestore hooks to update the Dashboard and Chore lists instantly across devices.

## Phase 3: The "Game" Layer (In Progress)
**Goal:** Add the "Juice" that makes it feel like a spaceship.

- [x] **The Command Deck:** Built the "Neon Industrial" dashboard with real-time status updates and a scrolling ticker.
- [x] **Credit/XP System:** Implemented XP and Credit (CR) tracking for crew members.
- [x] **The Shop (Hangar):** Build the reward redemption system for parent-defined manual rewards. (Pending)
- [ ] **Visual FX & Sound:** Add more animations and haptic feedback to "Chore Done" and "Verification" events.
- [ ] **AI Notifications:** Set up automated "Ship AI" notifications for overdue chores or "Hull Breaches."

## Phase 4: Beta Testing (Planned)
**Goal:** Polish based on real family feedback.

- [ ] **Closed Beta:** Invite 10-20 families to use the app for 14 days.
- [ ] **Feedback Loop:** Identify friction points in the chore lifecycle and verification process.
- [ ] **Bug Squashing:** Address sync edge cases and UI/UX inconsistencies.

## Phase 5: Launch & Expansion (Future)
**Goal:** Go live and expand.

- [ ] **App Store Launch:** Deploy to iOS and Android.
- [ ] **Subscription Model:** Integrate Stripe/IAP for "Fleet" management features.
- [ ] **Integrations:** Explore API integrations for smart home systems (e.g., pausing Wi-Fi if status is critical).

---

## Minimum Viable Product (MVP) Scope
The MVP currently includes:
- **Real-time Family Status:** A visual indicator of home "health" based on chores.
- **Room & Chore Management:** Full CRUD for rooms and tasks.
- **Role-based Access:** Captains manage the ship; Crew members complete tasks.
- **Gamified Stats:** Leveling system with XP and Credits.
- **QR Code Onboarding:** Seamlessly join a family starship.
