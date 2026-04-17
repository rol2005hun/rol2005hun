<template>
  <div class="about-app">
    <div class="about-header">
      <div class="os-logo">
        <Icon name="mdi:desktop-mac" size="48" />
      </div>
      <div class="os-info">
        <h1>ranzakOS</h1>
        <div class="version-row">
          <p class="version">{{ $t('os.apps.about.version') }}: 1.0.1 (Build 2026.03)</p>
          <button class="changelog-btn" @click="openChangelog">
            <Icon name="ph:list-dashes-bold" size="14" />
            {{ $t('os.apps.about.viewChangelog') }}
          </button>
        </div>
        <p class="copyright">{{ $t('os.apps.about.copyright') }}</p>
      </div>
    </div>

    <div class="about-content">
      <div class="info-section">
        <h2>{{ $t('os.apps.about.systemInfo') }}</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">{{ $t('os.apps.about.osType') }}:</span>
            <span class="value">Web-based Desktop Environment</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('os.apps.about.kernel') }}:</span>
            <span class="value">Vue 3 / Browser</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('os.apps.about.processor') }}:</span>
            <span class="value">Nuxt 4/5 Engine</span>
          </div>
          <div v-if="deviceInfo.userAgent" class="info-item">
            <span class="label">{{ $t('os.apps.about.browser') }}:</span>
            <span class="value">{{ browserName }}</span>
          </div>
        </div>
      </div>

      <div class="info-section legacy-section">
        <h2>{{ $t('os.apps.about.legacy.title') }}</h2>
        <p class="legacy-desc">{{ $t('os.apps.about.legacy.desc') }}</p>

        <div class="legacy-buttons">
          <button class="legacy-btn v1" @click="bootLegacy('https://v1.ranzak.dev')">
            <Icon name="lucide:monitor" size="20" />
            <span>ranzakOS v1</span>
          </button>

          <button class="legacy-btn v2" @click="bootLegacy('https://v2.ranzak.dev')">
            <Icon name="lucide:monitor" size="20" />
            <span>ranzakOS v2</span>
          </button>
        </div>
      </div>

      <div class="info-section">
        <h2>{{ $t('os.apps.about.credits') }}</h2>
        <p class="credits-text">{{ $t('os.apps.about.creditsText') }}</p>
        <div class="author-credits">
          <Icon name="mdi:laptop-mac" size="20" />
          <span>
            {{ $t('os.apps.about.developedBy') }}:
            <strong>❤️ ranzak 💖</strong>
          </span>
        </div>
        <div class="links">
          <button class="os-button contact-me-btn" @click="openContact">
            <Icon name="ph:envelope-simple-fill" size="20" />
            {{ $t('os.apps.about.contactMe') }}
          </button>
          <a href="https://github.com/rol2005hun" target="_blank" rel="noopener noreferrer">
            <Icon name="mdi:github" size="20" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/roland-adalbert-rany%C3%A1k-9a2726373/"
            target="_blank"
            rel="noopener noreferrer">
            <Icon name="mdi:linkedin" size="20" />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDevice } from '@/composables/features/os/useDevice';
import { useSystemStore } from '@/stores/features/os/useSystemStore';
import { useWindowStore } from '@/stores/features/os/useWindowStore';
import { useAppRegistry } from '@/stores/features/os/useAppRegistry';

const deviceInfo = useDevice();
const systemStore = useSystemStore();
const windowStore = useWindowStore();
const registryStore = useAppRegistry();

const browserName = computed(() => {
  const ua = deviceInfo.userAgent.value;
  if (!ua) return 'Unknown';

  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident') || ua.includes('MSIE')) return 'Internet Explorer';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';

  return 'Unknown Browser';
});

const bootLegacy = (url: string) => {
  systemStore.bootLegacyOS(url);
};

const openChangelog = () => {
  const appConfig = registryStore.getAppById('changelog');
  if (appConfig) {
    windowStore.openWindow({
      id: `changelog-${Date.now()}`,
      appId: appConfig.id,
      titleKey: appConfig.nameKey,
      width: appConfig.defaultWidth || 650,
      height: appConfig.defaultHeight || 550
    });
  }
};

const openContact = () => {
  const appConfig = registryStore.getAppById('contact');
  if (appConfig) {
    windowStore.openWindow({
      id: `contact-${Date.now()}`,
      appId: appConfig.id,
      titleKey: appConfig.nameKey,
      width: appConfig.defaultWidth || 500,
      height: appConfig.defaultHeight || 650
    });
  }
};
</script>

<style scoped lang="scss">
.about-app {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--os-window-bg);
  color: var(--os-text);
  overflow-y: auto;
}

.about-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(to bottom, var(--os-border-color), transparent);
  border-bottom: 1px solid var(--os-border-color);

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
    padding: 20px;
    gap: 15px;
  }

  .os-logo {
    width: 80px;
    height: 80px;
    border-radius: 16px;
    background: linear-gradient(135deg, #4f46e5, #3b82f6);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--os-text);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }

  .os-info {
    h1 {
      margin: 0 0 5px 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .version-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 2px;

      @media (max-width: 600px) {
        justify-content: center;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
      }

      .version {
        font-weight: 500;
        margin: 0;
      }

      .changelog-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 3px 8px;
        font-size: 12px;
        font-weight: 600;
        background: var(--os-hover);
        border: 1px solid var(--os-border-color);
        border-radius: 6px;
        color: var(--os-text);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: var(--os-hover);
          border-color: color-mix(in srgb, var(--os-text) 0.3%, transparent);
        }

        &:active {
          transform: scale(0.96);
        }
      }
    }

    p {
      margin: 0;
      color: color-mix(in srgb, var(--os-text) 70%, transparent);

      &.copyright {
        font-size: 12px;
      }
    }
  }
}

.about-content {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 600px) {
    padding: 20px;
    gap: 20px;
  }
}

.info-section {
  h2 {
    margin: 0 0 15px 0;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: color-mix(in srgb, var(--os-text) 0.5%, transparent);
    border-bottom: 1px solid var(--os-border-color);
    padding-bottom: 8px;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background-color: var(--os-hover);
    border-radius: 8px;
    border: 1px solid var(--os-border-color);

    .label {
      color: color-mix(in srgb, var(--os-text) 0.6%, transparent);
    }

    .value {
      font-weight: 500;
    }
  }
}

.legacy-section {
  .legacy-desc {
    color: color-mix(in srgb, var(--os-text) 70%, transparent);
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  .legacy-buttons {
    display: flex;
    gap: 16px;

    @media (max-width: 600px) {
      flex-direction: column;
    }

    .legacy-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px 16px;
      background: var(--os-hover);
      border: 1px solid var(--os-border-color);
      border-radius: 12px;
      color: var(--os-text);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: var(--os-hover);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);

        &.v1 {
          border-color: #f59e0b;
          color: #f59e0b;
        }
        &.v2 {
          border-color: #10b981;
          color: #10b981;
        }
      }

      span {
        font-weight: 600;
        font-size: 15px;
      }
    }
  }
}

.credits-text {
  line-height: 1.6;
  color: color-mix(in srgb, var(--os-text) 80%, transparent);
  margin-bottom: 15px;
}

.author-credits {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background-color: rgba(59, 130, 246, 0.1);
  border-left: 3px solid #3b82f6;
  border-radius: 4px;
  margin-bottom: 20px;
}

.links {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;

    a,
    .contact-me-btn {
      justify-content: center;
      text-align: center;
    }
  }

  a,
  .contact-me-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #60a5fa;
    text-decoration: none;
    padding: 8px 16px;
    background-color: rgba(96, 165, 250, 0.1);
    border-radius: 20px;
    border: none;
    font-size: 1rem;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: rgba(96, 165, 250, 0.2);
      transform: translateY(-2px);
    }
  }
}
</style>
