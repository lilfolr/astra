## 2025-05-15 - [List Rendering Optimization]
**Learning:** In screens like `MissionsScreen`, using `.find()` inside a `map()` loop for list items creates O(M*N) complexity. For screens with many chores and rooms, this causes frame drops during scroll.
**Action:** Use `useMemo` to convert reference arrays into `Map` objects for O(1) lookups during render.

## 2025-05-15 - [Redundant Filtering]
**Learning:** Component re-renders (e.g., from animation pulse) trigger expensive array filter operations if they are defined as plain constants in the component body.
**Action:** Memoize derived state like counts or filtered lists using `useMemo` to ensure they only re-calculate when source data changes.
