<template>
  <div class="settings-app">
    <div class="sidebar">
      <ul>
        <li :class="{ active: activeTab === 'appearance' }" @click="activeTab = 'appearance'">
          <Icon name="ph:paint-brush-broad-fill" class="icon" />
          {{ $t('os.apps.settings.appearance') }}
        </li>
        <li :class="{ active: activeTab === 'wallpaper' }" @click="activeTab = 'wallpaper'">
          <Icon name="ph:image-fill" class="icon" />
          {{ $t('os.apps.settings.wallpaper') }}
        </li>
        <li :class="{ active: activeTab === 'language' }" @click="activeTab = 'language'">
          <Icon name="ph:globe-hemisphere-west-fill" class="icon" />
          {{ $t('os.apps.settings.language') }}
        </li>
      </ul>
    </div>
    <div class="content">
      <transition name="fade-slide" mode="out-in">
        <div v-if="activeTab === 'appearance'" key="appearance" class="tab-content">
          <div class="header">
            <h2>{{ $t('os.apps.settings.themeSelection') }}</h2>
            <p class="subtitle">{{ $t('os.apps.settings.themeSubtitle') }}</p>
          </div>

          <div class="theme-grid">
            <button
              v-for="theme in themeStore.availableThemes"
              :key="theme.id"
              class="theme-card"
              :class="{ active: themeStore.currentTheme === theme.id }"
              :style="{ '--theme-color': theme.color }"
              @click="themeStore.setTheme(theme.id)">
              <div class="color-preview" :style="{ backgroundColor: theme.color }" />
              <span>{{ $t(theme.nameKey) }}</span>
            </button>
          </div>
        </div>

        <div v-else-if="activeTab === 'wallpaper'" key="wallpaper" class="tab-content">
          <div class="header">
            <h2>{{ $t('os.apps.settings.wallpaperSelection') }}</h2>
            <p class="subtitle">{{ $t('os.apps.settings.wallpaperSubtitle') }}</p>
          </div>

          <div class="wallpaper-grid">
            <button
              v-for="wp in themeStore.availableWallpapers"
              :key="wp.id"
              class="wallpaper-card"
              :class="{ active: themeStore.currentWallpaper === wp.id }"
              @click="themeStore.setWallpaper(wp.id)">
              <div
                class="wallpaper-preview"
                :style="{ backgroundImage: 'url(' + wp.thumb + ')' }" />
              <div class="active-indicator">
                <Icon name="ph:check-circle-fill" />
              </div>
            </button>
          </div>

          <div class="section-title">
            <Icon name="ph:paint-brush-broad-duotone" />
            <span>{{ $t('os.apps.settings.customWallpaper') }}</span>
          </div>

          <div class="custom-wallpaper-form glass-panel">
            <div class="input-group">
              <label>{{ $t('os.apps.settings.wallpaperUrl') }}</label>
              <div class="input-row">
                <input v-model="customUrlInput" type="text" placeholder="https://..." />
                <button
                  class="apply-btn"
                  :disabled="!customUrlInput.trim()"
                  @click="applyCustomUrl">
                  <Icon name="ph:check-bold" />
                </button>
              </div>
            </div>

            <div class="divider">
              <span>{{ $t('os.apps.settings.or') || 'OR' }}</span>
            </div>

            <div class="input-group">
              <label>{{ $t('os.apps.settings.uploadWallpaper') }}</label>
              <input type="file" accept="image/*" class="file-input" @change="handleFileUpload" />
            </div>

            <div
              v-if="themeStore.currentWallpaper === 'custom' && themeStore.customWallpaperData"
              class="custom-preview-box">
              <div
                class="wallpaper-preview"
                :style="{ backgroundImage: 'url(' + themeStore.customWallpaperData + ')' }" />
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'language'" key="language" class="tab-content">
          <div class="header">
            <h2>{{ $t('os.apps.settings.languageSelection') }}</h2>
            <p class="subtitle">{{ $t('os.apps.settings.languageSubtitle') }}</p>
          </div>

          <div class="theme-grid">
            <button
              class="theme-card lang-card"
              :class="{ active: languageStore.currentLanguage === 'en' }"
              @click="languageStore.setLanguage('en')">
              <div class="language-icon"><Icon name="flag:gb-4x3" /></div>
              <span>{{ $t('os.apps.settings.english') }}</span>
            </button>
            <button
              class="theme-card lang-card"
              :class="{ active: languageStore.currentLanguage === 'hu' }"
              @click="languageStore.setLanguage('hu')">
              <div class="language-icon"><Icon name="flag:hu-4x3" /></div>
              <span>{{ $t('os.apps.settings.hungarian') }}</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useThemeStore } from '@/stores/features/os/useThemeStore';
import { useLanguageStore } from '@/stores/features/os/useLanguageStore';

const themeStore = useThemeStore();
const languageStore = useLanguageStore();

const activeTab = ref<'appearance' | 'wallpaper' | 'language'>('appearance');

const customUrlInput = ref('');

watch(
  () => themeStore.customWallpaperData,
  (newVal) => {
    if (themeStore.currentWallpaper === 'custom' && newVal && newVal.startsWith('http')) {
      customUrlInput.value = newVal;
    }
  },
  { immediate: true }
);

const applyCustomUrl = () => {
  if (customUrlInput.value.trim()) {
    themeStore.setCustomWallpaper(customUrlInput.value.trim());
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1920;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            themeStore.setCustomWallpaper(compressedDataUrl);
            customUrlInput.value = '';
          }
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style scoped lang="scss">
.settings-app {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background: var(--os-window-bg, rgba(30, 30, 30, 0.95));
  color: var(--os-text, var(--os-text));
  border-radius: inherit;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.sidebar {
  width: 220px;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid var(--os-border-color, var(--os-border-color));
  padding: 24px 12px;
  flex-shrink: 0;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
    border-right: none;
    border-bottom: 1px solid var(--os-border-color, var(--os-border-color));
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;

    @media (max-width: 768px) {
      flex-direction: row;
      gap: 12px;
      width: max-content;
    }

    li {
      padding: 12px 16px;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--os-text);
      opacity: 0.7;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

      .icon {
        font-size: 20px;
        transition: color 0.3s ease;
      }

      &:hover {
        background: var(--os-hover);
        color: var(--os-text);
        opacity: 0.95;
        transform: translateX(4px);

        @media (max-width: 768px) {
          transform: translateY(-2px);
        }
      }

      &.active {
        background: var(--os-primary-color, var(--os-border-color));
        color: var(--os-primary-text, #000);
        font-weight: 600;
        box-shadow: 0 4px 15px
          color-mix(in srgb, var(--os-primary-color, var(--os-text)) 20%, transparent);

        .icon {
          color: var(--os-primary-text, #000);
        }

        &:hover {
          transform: translateY(0);
        }
      }
    }
  }
}

.content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  position: relative;
  background: radial-gradient(circle at top right, var(--os-border-color), transparent 70%);

  @media (max-width: 768px) {
    padding: 20px;
  }
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.header {
  margin-bottom: 32px;

  h2 {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--os-text);
  }

  .subtitle {
    font-size: 15px;
    opacity: 0.7;
    margin: 0;
    line-height: 1.5;
  }
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
  }
}

.theme-card {
  --theme-color: var(--os-text);
  background: rgba(20, 20, 25, 0.4);
  border: 1px solid var(--os-border-color);
  border-radius: 16px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--os-text, var(--os-text));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &:hover {
    background: var(--os-hover);
    transform: translateY(-4px);
    border-color: color-mix(in srgb, var(--os-text) 20%, transparent);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  &.active {
    border-color: var(--theme-color);
    background: var(--os-hover);
    box-shadow:
      0 8px 30px color-mix(in srgb, var(--theme-color) 30%, transparent),
      0 0 0 1px var(--theme-color) inset;
  }

  .color-preview {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    border: 3px solid var(--os-primary-color);
    transition: transform 0.3s ease;
  }

  &:hover .color-preview {
    transform: scale(1.05);
  }

  .language-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    border-radius: 12px;
    background: var(--os-hover);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--os-border-color);
  }

  span {
    font-size: 14px;
    font-weight: 600;
  }
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }
}

.wallpaper-card {
  position: relative;
  background: var(--os-hover);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;

  .active-indicator {
    position: absolute;
    top: 12px;
    right: 12px;
    color: var(--os-text);
    background: var(--os-primary-color, #3b82f6);
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    opacity: 0;
    transform: scale(0.8) translateY(-10px);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    background: var(--os-hover);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }

  &.active {
    border-color: var(--os-primary-color, var(--os-text));
    box-shadow: 0 0 20px
      color-mix(in srgb, var(--os-primary-color, var(--os-text)) 30%, transparent);

    .active-indicator {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .wallpaper-preview {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    transition: filter 0.3s ease;
  }

  &:not(.active):hover .wallpaper-preview {
    filter: brightness(1.1);
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 48px;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: var(--os-text);
  border-bottom: 1px solid var(--os-border-color);
  padding-bottom: 12px;

  svg {
    font-size: 24px;
    color: var(--os-primary-color, var(--os-text));
  }
}

.glass-panel {
  background: rgba(20, 20, 25, 0.4);
  border: 1px solid var(--os-border-color);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.custom-wallpaper-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 500px;
  width: 100%;

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 12px;

    label {
      font-size: 14px;
      color: var(--os-text);
      opacity: 0.8;
      font-weight: 500;
    }

    .input-row {
      display: flex;
      gap: 12px;

      input[type='text'] {
        flex: 1;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--os-border-color);
        color: var(--os-text);
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 14px;
        outline: none;
        transition: all 0.2s;

        &:focus {
          border-color: var(--os-primary-color, var(--os-border-color));
          box-shadow: 0 0 0 3px
            color-mix(in srgb, var(--os-primary-color, var(--os-text)) 15%, transparent);
        }
      }

      .apply-btn {
        background: var(--os-primary-color, #3b82f6);
        color: var(--os-text);
        border: none;
        border-radius: 12px;
        width: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px
            color-mix(in srgb, var(--os-primary-color, #3b82f6) 40%, transparent);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--os-hover);
        }
      }
    }

    .file-input {
      font-size: 14px;
      color: var(--os-text);
      opacity: 0.8;
      width: 100%;

      &::file-selector-button {
        background: var(--os-hover);
        border: 1px solid var(--os-border-color);
        color: var(--os-text);
        padding: 10px 20px;
        border-radius: 10px;
        cursor: pointer;
        margin-right: 16px;
        font-weight: 500;
        transition: all 0.2s;

        &:hover {
          background: var(--os-hover);
          border-color: color-mix(in srgb, var(--os-text) 20%, transparent);
        }
      }
    }
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--os-text);
    opacity: 0.4;
    font-size: 12px;
    font-weight: 600;
    margin: 8px 0;

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--os-border-color);
    }

    &::before {
      margin-right: 16px;
    }
    &::after {
      margin-left: 16px;
    }
  }

  .custom-preview-box {
    margin-top: 16px;
    border: 2px solid var(--os-primary-color, var(--os-text));
    border-radius: 16px;
    padding: 6px;
    background: rgba(0, 0, 0, 0.2);
    animation: fadeSlideUp 0.4s ease-out forwards;

    .wallpaper-preview {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
    }
  }
}

@keyframes fadeSlideUp {
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

