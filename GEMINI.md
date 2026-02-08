# Astra (Starship Home)

## Project Overview

**Astra** is a co-op family management application that gamifies household chores through a "Spaceship Survival" metaphor. It transforms the "Parent as Boss" dynamic into a "Shared Survival" model where every family member (Crew) contributes to the ship's (Home's) Hull Integrity.

This repository currently serves as the **documentation and planning hub** for the project, outlining the architectural, design, and developmental roadmap before code implementation begins.

### Core Concept
*   **Metaphor:** The house is a Starship. Rooms are Modules (e.g., Kitchen = Mess Hall).
*   **Goal:** Maintain Hull Integrity (0-100%) by completing Missions (Chores).
*   **Engagement:** "Neon Industrial" UI, haptic feedback, and an immersive "Ship AI" notification system.

## Planned Technology Stack

The following technologies have been selected for implementation:

*   **Frontend:** React Native (Cross-platform mobile).
*   **Game Engine:** `react-native-game-engine` (For the interactive 2D ship/home map).
*   **State Management:** React Context / Redux (Real-time synchronization).
*   **Backend:** Firebase
    *   **Firestore:** Real-time database for ship status and tasks.
    *   **Authentication:** Family group management.
    *   **Cloud Messaging (FCM):** "Ship AI" notifications.

## Documentation Structure

The `docs/` directory contains the source of truth for all project specifications:

| File | Description |
| :--- | :--- |
| **`docs/overview.md`** | **Executive Summary & Architecture:** Detailed breakdown of the core narrative, technical choices, data structure (Starship, Modules, Crew), and MVP priorities. |
| **`docs/projectPlan.md`** | **Development Roadmap:** Phased plan from Foundation (Phase 1) to Launch (Phase 5), including specific goals for the MVP (Minimum Viable Product). |
| **`docs/ui.md`** | **Visual & UX Design:** Specifications for the "Neon Industrial" aesthetic, color palette (Deep Obsidian, Cyan, Neon Orange), and key screens (Command Deck, Mission Control, Hangar). |

## Development Conventions (Planned)

### Terminology
Development and UI text should strictly adhere to the immersive "Starship" glossary:
*   **House** $\rightarrow$ Starship
*   **Room** $\rightarrow$ Module / Sector
*   **Chore** $\rightarrow$ Mission / Protocol
*   **Allowance** $\rightarrow$ Credits
*   **Parent** $\rightarrow$ Captain
*   **Child** $\rightarrow$ Crew / Cadet
*   **Notifications** $\rightarrow$ Ship AI Alerts (e.g., "Hull Breach," "Atmospheric Warning")

### Implementation Priorities
1.  **Real-time Sync:** The Hull Integrity bar must update instantly across devices.
2.  **Immersive UI:** Use of the `react-native-game-engine` for the ship map is central to the experience.
3.  **"Juice":** High emphasis on visual feedback (animations, haptics) to reward task completion.

## Getting Started

As this project is in the planning phase, there are no build instructions yet.
Refer to `docs/projectPlan.md` for the immediate next steps in Phase 1 (Foundation & Ship Specs).
