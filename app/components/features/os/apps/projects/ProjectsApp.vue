<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue';

const ProjectOne = defineAsyncComponent(() => import('./content/ProjectOne.vue'));
const ProjectTwo = defineAsyncComponent(() => import('./content/ProjectTwo.vue'));

const projects = [
  {
    id: 'project1',
    titleKey: 'os.apps.projects.project1.title',
    descKey: 'os.apps.projects.project1.description',
    component: ProjectOne
  },
  {
    id: 'project2',
    titleKey: 'os.apps.projects.project2.title',
    descKey: 'os.apps.projects.project2.description',
    component: ProjectTwo
  }
];

const activeProject = shallowRef<any>(null);

const openProject = (projectComponent: any) => {
  activeProject.value = projectComponent;
};

const closeProject = () => {
  activeProject.value = null;
};
</script>

<template>
  <div class="app-container">
    <div v-if="!activeProject" class="grid-view">
      <h2 class="title">{{ $t('os.apps.projects.name') }}</h2>

      <div class="projects-grid">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          @click="openProject(project.component)"
        >
          <div class="card-content">
            <h3>{{ $t(project.titleKey) }}</h3>
            <p>{{ $t(project.descKey) }}</p>
          </div>
          <div class="card-actions">
            <button class="view-btn">{{ $t('os.apps.projects.viewProject') }}</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="detail-view">
      <div class="toolbar">
        <button class="back-btn" @click="closeProject">
          &larr; {{ $t('os.apps.projects.backToProjects') }}
        </button>
      </div>
      <div class="project-wrapper">
        <component :is="activeProject" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  height: 100%;
  padding: 20px;
  color: var(--os-text, #fff);
  box-sizing: border-box;
  overflow-y: auto;
}

.title {
  margin-top: 0;
  margin-bottom: 20px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.project-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
}

.project-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-content h3 {
  margin: 0 0 10px 0;
}

.card-content p {
  margin: 0;
  font-size: 0.9em;
  opacity: 0.8;
}

.card-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.view-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: inherit;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.detail-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  margin-bottom: 20px;
}

.back-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: inherit;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.project-wrapper {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px;
  overflow-y: auto;
}
</style>
