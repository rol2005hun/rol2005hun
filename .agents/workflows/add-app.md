# Add New App Workflow
**Description**: A structured sequence to guide the Agent through adding a brand new glassmorphic application to RanzakOS.

## Steps
1. **Analyze Requirements**: 
   - Define the App ID and the core features.
   - Plan the UI layout following the OS's glassmorphic design system.

2. **Create App Component**:
   - Location: `app/components/features/os/apps/{appId}/{AppName}App.vue`
   - Use `<script setup lang="ts">`.
   - Use `useI18n` for all text.
   - Use modern CSS (glassmorphism, gradients, hover effects).
   - Ensure it's responsive (mobile/desktop).

3. **Initialize Locales**:
   - Create `app/locales/features/os/apps/{appId}/en.json`
   - Create `app/locales/features/os/apps/{appId}/hu.json`
   - Define at least `name` and any other strings needed.

4. **Register in OS**:
   - **Registry**: Add the app definition to `app/stores/features/os/useAppRegistry.ts`.
   - **Window Manager**: Register the async component in `app/components/features/os/window/WindowFrame.vue`.

5. **Update Changelog**:
   - Add a new version entry to `app/locales/features/os/apps/changelog/en.json`.
   - Add a corresponding entry to `app/locales/features/os/apps/changelog/hu.json`.

6. **Finalize**:
   - Run a quick type check if possible.
   - Git add and commit with a message like `feat: add {AppName} app`.
