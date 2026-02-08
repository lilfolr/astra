# UI/UX Design Summary: Hull Integrity

## 1. Visual Identity: "Neon Industrial"
The interface is designed to feel like a high-tech tactical HUD (Heads-Up Display) found on a starship bridge.

- **Color Palette:** Deep Obsidian/Pitch Black backgrounds to minimize eye strain and save battery. Accents in Cyan (Active Systems), Neon Orange (Warnings/Alerts), and Acid Green (Mission Success).
- **Typography:** Monospace fonts for data readouts; clean, geometric Sans-Serif for primary navigation.
- **Visual Elements:** Glassmorphism (frosted glass panels), digital scan lines, and micro-animations that give the UI a "living" machine feel.

## 2. The Command Deck (Main Dashboard)
The primary screen is a 2D interactive map of the home, rendered as a ship schematic.

- **Interactive Schematic:** Built using `react-native-game-engine`. Rooms pulse or change color based on "Health Status."
    - **Green:** All systems nominal (clean/tasks done).
    - **Pulsing Red:** Hull Breach detected (overdue tasks).
- **The Hull Integrity Bar:** A prominent, glowing progress bar at the top of the screen that updates in real-time as tasks are completed.
- **Haptic Interface:** Heavy use of haptic feedback for button presses and "Red Alert" events to increase immersion.

## 3. Mission Control (Task Management)
- **Encrypted Data Packets:** Chores are presented as mission cards. Instead of "Clean Bathroom," the user sees "Sanitize Bio-Hazard Deck."
- **Mission Initialization:** Swiping or tapping a task triggers a "Scanning" animation rather than a simple checkbox.
- **Resource Gain:** Upon completion, a satisfying "Credits Received" animation plays, showing currency flying into the user's "Vault."

## 4. The Hangar (Rewards Shop)
- **Loot Grid:** A visual inventory of parent-approved rewards.
- **Purchase Flow:** Spending credits triggers a "Deployment" animation, where the reward (e.g., Shore Leave) is officially authorized by the Captain.

## 5. User Journey & Role Specifics
- **The Captain (Parent):** Has access to the "Ship Schematic Editor" to map new rooms and the "Mission Creator" to assign tasks and bounties.
- **The Crew (Kid):** Focuses on the "Bridge" (Dashboard) and "Missions" tabs. Their UI is more gamified, with more frequent XP pop-ups and rank-up notifications.

## 6. Atmosphere & "The Nag"
- **The Ship AI:** Status updates appear as text crawls or voice-synthesized notifications.
- **Tone:** Professional, urgent, and immersive. *"Captain, the Life Support systems are failing due to a Laundry overflow. Immediate intervention required."*