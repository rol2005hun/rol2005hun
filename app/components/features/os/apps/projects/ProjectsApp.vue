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

const activeProject = shallowRef<any>(null);

const openProject = (projectComponent: any) => {
  activeProject.value = projectComponent;
};

const closeProject = () => {
  activeProject.value = null;
};

const handleMouseMove = (e: MouseEvent, target: HTMLElement) => {
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  target.style.setProperty('--mouse-x', `${x}px`);
  target.style.setProperty('--mouse-y', `${y}px`);
};
</script>

<template>
  <div class="app-container">
    <transition name="fade" mode="out-in">
      <div v-if="!activeProject" key="grid" class="grid-view">
        <div class="header">
          <h2 class="title">{{ $t('os.apps.projects.name') }}</h2>
          <i18n-t keypath="os.apps.projects.githubInfo" tag="p" class="github-info">
            <template #githubLink>
              <a href="https://github.com/rol2005hun" target="_blank">
                {{ $t('os.apps.projects.githubLinkText') }}
              </a>
            </template>
          </i18n-t>
          <div class="header-divider" />
        </div>

        <div class="projects-grid">
          <div
            v-for="(project, index) in projects"
            :key="project.id"
            class="project-card"
            :style="{ '--app-color': project.color, 'animation-delay': `${index * 0.05}s` }"
            @click="openProject(project.component)"
            @mousemove="handleMouseMove($event, $event.currentTarget as HTMLElement)">
            <div class="card-bg" />
            <div class="card-border" />
            <div class="card-content">
              <div class="card-header">
                <div
                  class="icon-wrapper"
                  :style="{
                    backgroundColor: `color-mix(in srgb, ${project.color} 15%, transparent)`
                  }">
                  <Icon
                    :name="project.icon"
                    class="project-icon"
                    :style="{ color: project.color }" />
                </div>
                <h3>{{ $t(project.titleKey) }}</h3>
              </div>
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: var(
    --os-bg,
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.05), transparent 50%)
  );
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
    background: linear-gradient(90deg, #fff, rgba(255, 255, 255, 0.6));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .github-info {
    margin: 8px 0 16px 0;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.5;

    :deep(a) {
      color: #58a6ff;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;

      &:hover {
        color: #79b8ff;
        text-decoration: underline;
      }
    }
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card {
  --mouse-x: 50%;
  --mouse-y: 50%;
  position: relative;
  background: rgba(20, 20, 25, 0.4);
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  transform: translateY(0) scale(1);
  transition:
    transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
    box-shadow 0.4s ease;

  .card-bg {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      600px circle at var(--mouse-x, 0) var(--mouse-y, 0),
      color-mix(in srgb, var(--app-color, #ffffff) 12%, transparent),
      transparent 40%
    );
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 0;
    pointer-events: none;
  }

  .card-border {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: radial-gradient(
      400px circle at var(--mouse-x, 0) var(--mouse-y, 0),
      color-mix(in srgb, var(--app-color, #ffffff) 60%, transparent),
      rgba(255, 255, 255, 0.05) 40%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
    transition: opacity 0.5s ease;
    pointer-events: none;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow:
      0 20px 40px -10px rgba(0, 0, 0, 0.5),
      0 0 20px -5px color-mix(in srgb, var(--app-color, #fff) 20%, transparent);

    .card-bg {
      opacity: 1;
    }

    .card-border {
      opacity: 1;
    }

    .view-btn {
      background: var(--app-color, #3b82f6);
      color: #fff;
      padding-right: 16px;
      box-shadow: 0 4px 15px color-mix(in srgb, var(--app-color, #3b82f6) 40%, transparent);

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

  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 2px 10px rgba(255, 255, 255, 0.05);

      .project-icon {
        font-size: 24px;
      }
    }

    h3 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.3px;
    }
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.65);
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
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;

  .btn-icon {
    opacity: 0;
    transform: translateX(-15px);
    width: 0;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
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
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
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
      background: radial-gradient(circle at 100% 0%, rgba(0, 0, 0, 0.03) 0%, transparent 60%);
    }

    .view-btn {
      background: rgba(0, 0, 0, 0.05);
      color: #1a1a1a;
      border-color: rgba(0, 0, 0, 0.1);
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
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
  }
}
</style>
