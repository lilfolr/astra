# Firestore Security Rules Documentation

This document explains the reasoning and design of the Firestore security rules for the Astra application.

## 1. Hierarchical Access Model

The application uses a role-based access control (RBAC) system with two primary roles: **Captain** (Parent) and **Crew Member** (Child).

### Captain Permissions
- Full administrative control over the starship (household).
- Can create, update, and delete modules (rooms) and missions (chores).
- Can recruit new crew members and manage their status (enable/disable).
- Can verify completed missions to distribute rewards.

### Crew Member Permissions
- Read access to starship data, modules, and the crew roster.
- Ability to assign themselves to "Available" missions.
- Ability to update the status of their assigned missions (e.g., from `active` to `under_review`).
- Restricted from modifying starship configuration or other members' data.

## 2. Join Process Security

Joining a starship as a crew member is a sensitive operation. To ensure security without requiring complex invite links:

1. **Registration Codes:** Captains generate a 6-character registration code with a 10-minute expiry.
2. **Verification:** The security rules enforce that when a user attempts to link their UID to a crew slot:
   - The provided `verificationCode` in the request must match the `registrationCode` stored in the document.
   - This ensures the client must explicitly provide the correct code in the update payload.
   - The `registrationCodeExpiry` must be in the future.
   - The slot must not already have a UID assigned (`resource.data.uid == null`).
3. **Application Support:** The `starshipService.joinStarshipAsCrew` method includes the `registrationCode` in the update payload to satisfy these rules.

## 3. User-to-Starship Mapping

To facilitate fast lookups and secure access across the app, a top-level `userStarships` collection maintains a 1:1 mapping between a User UID and a Starship ID.

- **Initial Link (Captain):** A user can create their own mapping if they are the `primaryCaptainId` of the starship.
- **Initial Link (Crew):** A user can create their own mapping if they have already been verified and linked to a crew record in that starship.
- **Verification Logic:** The rules verify this by checking `get(.../crew/$(request.resource.data.crewId)).data.uid == request.auth.uid`.
- **Disabling Access:** A Captain can set the `disabled` flag in both the `crew` document and the `userStarships` mapping. The security rules prevent a disabled user from performing any further actions by checking the `disabled` flag in the `userStarships` mapping via the `isMemberOfStarship` helper.

## 4. Discovery Process

The app supports discovering which starship a user belongs to through several fallbacks:
1. Direct lookup in `userStarships`.
2. Searching for a starship where the user is the `primaryCaptainId`.
3. A **Collection Group** query on the `crew` sub-collections to find a matching UID.

The security rules include a specific match for the collection group query to allow users to find their own crew records during this discovery phase.

## 5. Peer Verification for Chores

To prevent "self-cheating," the security rules for missions enforce that only a user other than the one who performed the chore can mark it as `completed`. In practice, this is typically the Captain verifying the work.

```javascript
// Rule snippet for verification
(resource.data.status == 'under_review' &&
 request.resource.data.status == 'completed' &&
 resource.data.assignedTo != request.auth.uid)
```
