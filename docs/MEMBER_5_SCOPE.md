# Member 5 — Rimaz: Dashboard & Crowd Simulation

This contribution contains the dashboard preview and interactive crowd simulation that appears on the VISIO landing page. The original styling, images, layout and simulated data model are preserved.

## Owned file
- src/Member5_Rimaz_DashboardSimulation.tsx: chart, schematic camera visual, staff/public dashboard, sliders, scene presets and acknowledgement control.

## Integrated from the current VISIO source
- src/main.tsx: imports the Member 5 module and passes existing application state and shared SVG icons. It continues to own scroll effects and state so the other sections remain unaffected.

## Functional refinements
- Scenario preset buttons expose aria-pressed to screen readers.
- Reset returns to the staff dashboard tab and restores the default values.
- Dashboard and camera SVGs use unique React-generated gradient/pattern IDs, avoiding duplicate DOM IDs when multiple previews appear.
- Action buttons use type=button to avoid accidental form submissions.

## Accuracy
The demonstration is simulated. It does not access a live camera or perform AI detection. Actual teammate contribution is recorded through genuine Git commits.

## How to test
Run npm ci then npm run build. Visit the demo and try Calm, Busy, Critical, Offline, sliders, tab switching, acknowledgement and reset.

## Additional verified improvements
- src/member5Metrics.ts centralizes simulated occupancy thresholds and warnings for staff/public views.
- Accessible slider descriptions and the named demo landmark improve assistive-technology feedback.
- tests/member5Metrics.test.mjs checks normal, warning, critical, projected, offline, negative and invalid input cases.
- Run npm run test:member5 (Node.js 22+) and npm run build before opening a pull request.
