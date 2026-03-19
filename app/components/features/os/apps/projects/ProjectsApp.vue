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
    <transition name="fade" mode="out-in">
      <div v-if="!activeProject" key="grid" class="grid-view">
        <div class="header">
          <h2 class="title">{{ $t('os.apps.projects.name') }}</h2>
          <div class="header-divider"/>
        </div>

        <div class="projects-grid">
          <div
            v-for="project in projects"
            :key="project.id"
            class="project-card"
            @click="openProject(project.component)"
          >
            <div class="card-bg"/>
            <div class="card-content">
              <h3>{{ $t(project.titleKey) }}</h3>
              <p>{{ $t(project.descKey) }}</p>
            </div>
            <div class="card-actions">
              <button class="view-btn">
                <span>{{ $t('os.apps.projects.viewProject') }}</span>
                <Icon name="ph:arrow-right-bold" class="btn-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else key="detail" class="detail-view">
        <div class="toolbar glass-toolbar">
          <button class="back-btn" @click="closeProject">
            <Icon name="ph:caret-left-bold" size="16px" />
            <span>{{ $t('os.apps.projects.backToProjects') }}</span>
          </button>
        </div>
        <div class="project-wrapper">
          <transition name="slide-up" appear>
            <component :is="activeProject" />
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  height: 100%;
  padding: 24px;
  color: var(--os-text, #fff);
  box-sizing: border-box;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--os-bg, radial-gradient(circle at top right, rgba(255,255,255,0.05), transparent 50%));
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.header {
  margin-bottom: 30px;

  .title {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, #fff, rgba(255,255,255,0.6));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .header-divider {
    height: 1px;
    width: 60px;
    background: linear-gradient(90deg, var(--os-accent, #3b82f6), transparent);
    margin-top: 12px;
    border-radius: 2px;
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.project-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  .card-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 100% 0%, rgba(255,255,255,0.08) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset;

    .card-bg {
      opacity: 1;
    }

    .view-btn {
      background: var(--os-accent, #3b82f6);
      color: #fff;
      padding-right: 16px;

      .btn-icon {
        opacity: 1;
        transform: translateX(0);
        margin-left: 8px;
      }
    }
  }
}

.card-content {
  position: relative;
  z-index: 1;

  h3 {
    margin: 0 0 12px 0;
    font-size: 20px;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.7);
  }
}

.card-actions {
  position: relative;
  z-index: 1;
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.view-btn {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;

  .btn-icon {
    opacity: 0;
    transform: translateX(-10px);
    width: 0;
    transition: all 0.3s ease;
  }
}

.detail-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.glass-toolbar {
  margin-bottom: 20px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(-2px) scale(0.95);
  }
}

.project-wrapper {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  overflow-y: auto;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
}

:root[data-theme='light'] {
  .project-card {
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: #1a1a1a;

    .card-content p {
      color: rgba(0, 0, 0, 0.6);
    }

    .card-bg {
      background: radial-gradient(circle at 100% 0%, rgba(0,0,0,0.03) 0%, transparent 60%);
    }

    .view-btn {
      background: rgba(0, 0, 0, 0.05);
      color: #1a1a1a;
      border-color: rgba(0,0,0,0.1);
    }

    &:hover {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);

      .view-btn {
        background: var(--os-accent, #3b82f6);
        color: #fff;
      }
    }
  }

  .header .title {
    background: linear-gradient(90deg, #1a1a1a, #4a4a4a);
    background-clip: text;
    -webkit-background-clip: text;
  }

  .glass-toolbar {
    background: rgba(255, 255, 255, 0.4);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .back-btn {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    color: #1a1a1a;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .project-wrapper {
    background: rgba(255, 255, 255, 0.5);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
  }
}
</style>
