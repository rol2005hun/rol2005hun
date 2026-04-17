<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from 'vue';

const SanoviseProject = defineAsyncComponent(() => import('./content/SanoviseProject.vue'));
const WolimbyProject = defineAsyncComponent(() => import('./content/WolimbyProject.vue'));
const KnightSwapProject = defineAsyncComponent(() => import('./content/KnightSwapProject.vue'));
const NexusProject = defineAsyncComponent(() => import('./content/NexusProject.vue'));
const DeikProject = defineAsyncComponent(() => import('./content/DeikProject.vue'));

const projects = [
  {
    id: 'nexus',
    titleKey: 'os.apps.projects.nexus.title',
    descKey: 'os.apps.projects.nexus.description',
    component: NexusProject,
    icon: 'ph:planet-duotone',
    color: '#8b5cf6'
  },
  {
    id: 'deik',
    titleKey: 'os.apps.projects.deik.title',
    descKey: 'os.apps.projects.deik.description',
    component: DeikProject,
    icon: 'ph:graduation-cap-duotone',
    color: '#3b82f6'
  },
  {
    id: 'sanovise',
    titleKey: 'os.apps.projects.sanovise.title',
    descKey: 'os.apps.projects.sanovise.description',
    component: SanoviseProject,
    icon: 'ph:heartbeat-duotone',
    color: '#10b981'
  },
  {
    id: 'wolimby',
    titleKey: 'os.apps.projects.wolimby.title',
    descKey: 'os.apps.projects.wolimby.description',
    component: WolimbyProject,
    icon: 'ph:cloud-fog-duotone',
    color: '#f59e0b'
  },
  {
    id: 'knightswap',
    titleKey: 'os.apps.projects.knightswap.title',
    descKey: 'os.apps.projects.knightswap.description',
    component: KnightSwapProject,
    icon: 'ph:sword-duotone',
    color: '#ef4444'
  }
];

const activeProject = shallowRef<any>(projects[0]);

const selectProject = (project: any) => {
  activeProject.value = project;
};
</script>

<template>
  <div class="split-view-container">
    <!-- Sidebar / List -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h2 class="title">{{ $t('os.apps.projects.name') }}</h2>
        <i18n-t keypath="os.apps.projects.githubInfo" tag="p" class="github-info">
          <template #githubLink>
            <a href="https://github.com/rol2005hun" target="_blank" class="github-link">
              {{ $t('os.apps.projects.githubLinkText') }}
            </a>
          </template>
        </i18n-t>
      </div>

      <div class="projects-list">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-item"
          :class="{ active: activeProject?.id === project.id }"
          @click="selectProject(project)">
          <div
            class="item-icon-wrapper"
            :style="{
              backgroundColor: 'color-mix(in srgb, ' + project.color + ' 15%, transparent)'
            }">
            <Icon :name="project.icon" class="item-icon" :style="{ color: project.color }" />
          </div>
          <div class="item-details">
            <h3 class="item-title">{{ $t(project.titleKey) }}</h3>
            <p class="item-desc">{{ $t(project.descKey) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <transition name="fade-slide" mode="out-in">
        <div v-if="activeProject" :key="activeProject.id" class="project-detail-wrapper">
          <div
            class="detail-header"
            :style="{
              borderBottom:
                '2px solid color-mix(in srgb, ' + activeProject.color + ' 30%, transparent)'
            }">
            <h1 class="content-title">{{ $t(activeProject.titleKey) }}</h1>
            <div
              class="content-badge"
              :style="{
                color: activeProject.color,
                backgroundColor: 'color-mix(in srgb, ' + activeProject.color + ' 15%, transparent)'
              }">
              <Icon :name="activeProject.icon" />
              <span>Project View</span>
            </div>
          </div>
          <div class="detail-body">
            <component :is="activeProject.component" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.split-view-container {
  display: flex;
  height: 100%;
  width: 100%;
  background: var(--os-window-bg);
  color: var(--os-text, #fff);
  overflow: hidden;
  border-radius: inherit;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: color-mix(in srgb, var(--os-window-bg) 60%, rgba(0, 0, 0, 0.2));
  border-right: 1px solid var(--os-border-color);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    width: 100vw;
    max-width: 100vw;
    border-right: none;
    border-bottom: 1px solid var(--os-border-color);
    overflow: hidden;
  }

  .sidebar-header {
    padding: 24px 20px;
    border-bottom: 1px solid var(--os-border-color);

    @media (max-width: 768px) {
      padding: 16px;
    }

    .title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }

    .github-info {
      font-size: 13px;
      color: color-mix(in srgb, var(--os-text) 60%, transparent);
      margin: 0;

      .github-link {
        color: var(--os-text);
        font-weight: 500;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .projects-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--os-hover);
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      flex-direction: row;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 16px 20px;
      gap: 16px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: contain;
    }
  }

  .project-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;

    @media (max-width: 768px) {
      flex-shrink: 0;
      width: 280px;
      max-width: 85vw;
      scroll-snap-align: center;
    }

    &:hover {
      background: var(--os-hover);
    }

    &.active {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .item-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;

      .item-icon {
        font-size: 24px;
      }
    }

    .item-details {
      flex: 1;
      overflow: hidden;

      .item-title {
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 2px 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .item-desc {
        font-size: 12px;
        margin: 0;
        color: color-mix(in srgb, var(--os-text) 60%, transparent);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}

.main-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
  background: var(--os-window-bg);
}

.project-detail-wrapper {
  padding: 32px;
  max-width: 900px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 20px;
    padding-bottom: 80px; /* add some safe space at the bottom for mobile */
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .content-title {
    font-size: 32px;
    font-weight: 700;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  .content-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
  }
}

.detail-body {
  line-height: 1.6;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}
</style>
