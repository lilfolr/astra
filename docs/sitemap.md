# Astra Sitemap

## 1. Authentication & Onboarding
- **WelcomeScreen:** Landing page for the app.
- **LoginScreen:** Entry point for existing users.
- **SignupScreen:** Account creation for new Captains.
- **JoinFleetScreen:** QR Code / Code entry for family members joining an existing starship.
- **CreateProfileScreen:** User profile initialization (Name, Role).

## 2. Primary Navigation (Command Deck Tabs)
- **Command Deck (Dashboard):** The main hub showing Family Status, Chores Summary, and Rooms list.
- **Chores (Missions):**
    - **My Chores:** Filtered view for tasks assigned to the current user.
    - **Available:** Unassigned chores.
    - **All:** Full overview of ship-wide tasks.
- **Family (Roster):** Overview of all crew members and their stats.
- **Shop (Planned):** Reward redemption center.

## 3. Management & Creation
- **RecruitScreen:** (Captain Only) Generate codes and QR codes to invite family members.
- **ModuleFormScreen:** Add or edit rooms (Modules) in the home layout.
- **MissionFormScreen:** (Captain Only) Create or edit chores, set rewards, and define task checklists.

## 4. Navigation Flow
- **Unauthenticated:** Welcome -> Login/Signup/Join -> Dashboard.
- **Authenticated:**
    - Dashboard -> Missions
    - Dashboard -> Roster -> Recruit
    - Dashboard -> Room Details (via Room List)
    - Missions -> Add/Edit Chore
    - Dashboard -> Add/Edit Room
