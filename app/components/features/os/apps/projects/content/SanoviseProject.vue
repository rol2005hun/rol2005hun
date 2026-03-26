<script setup lang="ts">
import { Icon } from '#components';
</script>

<template>
  <div class="project-content">
    <div class="project-header">
      <div class="icon-wrap">
        <Icon name="ph:heartbeat-fill" size="32px" class="brand-icon" />
      </div>
      <div>
        <h3>{{ $t('os.apps.projects.sanovise.title') }}</h3>
        <p class="subtitle">{{ $t('os.apps.projects.sanovise.description') }}</p>
      </div>
    </div>

    <div class="content-body">
      <div class="info-card">
        <Icon name="ph:info-duotone" size="24px" class="card-icon" />
        <p>{{ $t('os.apps.projects.sanovise.details.description') }}</p>
      </div>

      <div class="info-card">
        <Icon name="ph:code-block-duotone" size="24px" class="card-icon" />
        <p>{{ $t('os.apps.projects.sanovise.details.stack') }}</p>
      </div>

      <div class="info-card">
        <Icon name="ph:star-duotone" size="24px" class="card-icon" />
        <p>{{ $t('os.apps.projects.sanovise.details.features') }}</p>
      </div>

      <div class="links-grid">
        <a href="https://github.com/rol2005hun/Sanovise" target="_blank" class="action-btn">
          <Icon name="ph:github-logo-fill" size="20px" />
          <span>GitHub</span>
        </a>
        <a
          href="https://www.youtube.com/watch?v=1CuafcQSEeg"
          target="_blank"
          class="action-btn secondary">
          <Icon name="ph:video-camera-fill" size="20px" />
          <span>{{ $t('os.apps.projects.sanovise.links.demo') }}</span>
        </a>
        <a
          href="https://web.unideb.hu/rol2005hun/felho/szakdolgozat.pdf"
          target="_blank"
          class="action-btn highlight">
          <Icon name="ph:student-fill" size="20px" />
          <span>{{ $t('os.apps.projects.sanovise.links.thesis') }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fade-in 0.4s ease-out forwards;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;

  h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .subtitle {
    margin: 4px 0 0 0;
    font-size: 0.95rem;
    opacity: 0.8;
  }

  .icon-wrap {
    background: rgba(255, 90, 90, 0.15);
    padding: 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 90, 90, 0.2);

    .brand-icon {
      color: #ff5a5a;
    }
  }
}

.content-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .card-icon {
    opacity: 0.7;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.4;
  }
}

.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;

  .action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--os-text);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    &.highlight {
      background: rgba(90, 150, 255, 0.2);
      border-color: rgba(90, 150, 255, 0.3);
      color: #bbd3ff;

      &:hover {
        background: rgba(90, 150, 255, 0.3);
      }
    }
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
