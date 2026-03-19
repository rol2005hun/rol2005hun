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
      <div v-if="activeTab === 'appearance'">
        <h2>{{ $t('os.apps.settings.themeSelection') }}</h2>
        <p class="subtitle">{{ $t('os.apps.settings.themeSubtitle') }}</p>

        <div class="theme-grid">
          <button
            v-for="theme in themeStore.availableThemes"
            :key="theme.id"
            class="theme-card"
            :class="{ active: themeStore.currentTheme === theme.id }"
            @click="themeStore.setTheme(theme.id)">
            <div class="color-preview" :style="{ backgroundColor: theme.color }"></div>
            <span>{{ $t(theme.nameKey) }}</span>
          </button>
        </div>
      </div>

      <div v-if="activeTab === 'wallpaper'">
        <h2>{{ $t('os.apps.settings.wallpaperSelection') }}</h2>
        <p class="subtitle">{{ $t('os.apps.settings.wallpaperSubtitle') }}</p>

        <div class="wallpaper-grid">
          <button
            v-for="wp in themeStore.availableWallpapers"
            :key="wp.id"
            class="wallpaper-card"
            :class="{ active: themeStore.currentWallpaper === wp.id }"
            @click="themeStore.setWallpaper(wp.id)">
            <div
              class="wallpaper-preview"
              :style="{ backgroundImage: 'url(' + wp.thumb + ')' }"></div>
          </button>
        </div>

        <h3 class="section-title">{{ $t('os.apps.settings.customWallpaper') }}</h3>

        <div class="custom-wallpaper-form">
          <div class="input-group">
            <label>{{ $t('os.apps.settings.wallpaperUrl') }}</label>
            <div class="input-row">
              <input v-model="customUrlInput" type="text" placeholder="https://..." />
              <button class="apply-btn" @click="applyCustomUrl">
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
              :style="{ backgroundImage: 'url(' + themeStore.customWallpaperData + ')' }"></div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'language'">
        <h2>{{ $t('os.apps.settings.languageSelection') }}</h2>
        <p class="subtitle">{{ $t('os.apps.settings.languageSubtitle') }}</p>

        <div class="theme-grid">
          <button
            class="theme-card"
            :class="{ active: languageStore.currentLanguage === 'en' }"
            @click="languageStore.setLanguage('en')">
            <div class="language-icon"><Icon name="flag:gb-4x3" /></div>
            <span>{{ $t('os.apps.settings.english') }}</span>
          </button>
          <button
            class="theme-card"
            :class="{ active: languageStore.currentLanguage === 'hu' }"
            @click="languageStore.setLanguage('hu')">
            <div class="language-icon"><Icon name="flag:hu-4x3" /></div>
            <span>{{ $t('os.apps.settings.hungarian') }}</span>
          </button>
        </div>
      </div>
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
  width: 100%;
  height: 100%;
  background: var(--os-window-bg, rgba(30, 30, 30, 0.95));
  color: var(--os-text, #fff);
  border-radius: inherit;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
  padding: 20px 10px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 10px 15px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      transition:
        background 0.2s,
        color 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      &.active {
        background: var(--os-primary-color, rgba(255, 255, 255, 0.1));
        color: var(--os-primary-text, #000);
        font-weight: 600;

        .icon {
          color: var(--os-primary-text, #000);
        }
      }
    }
  }
}

.content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;

  h2 {
    margin-bottom: 5px;
    font-size: 24px;
    font-weight: 600;
  }

  .subtitle {
    font-size: 14px;
    opacity: 0.7;
    margin-bottom: 30px;
  }
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
}

.theme-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--os-text, #fff);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &.active {
    border-color: var(--os-primary-color, #fff);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
  }

  .color-preview {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  .language-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    border-radius: 4px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  span {
    font-size: 13px;
    font-weight: 500;
  }
}

.wallpaper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.wallpaper-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    border-color: var(--os-primary-color, #fff);
  }

  .wallpaper-preview {
    width: 100%;
    height: 100px;
    border-radius: 8px;
    background-size: cover;
    background-position: center;
  }
}

.section-title {
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.1));
  padding-bottom: 8px;
}

.custom-wallpaper-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-size: 13px;
      opacity: 0.8;
      font-weight: 500;
    }

    .input-row {
      display: flex;
      gap: 10px;

      input[type='text'] {
        flex: 1;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.15));
        color: var(--os-text, #fff);
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;

        &:focus {
          border-color: var(--os-primary-color, rgba(255, 255, 255, 0.4));
        }
      }

      .apply-btn {
        background: var(--os-primary-color, rgba(255, 255, 255, 0.2));
        color: var(--os-primary-text, #000);
        border: none;
        border-radius: 8px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.2s;

        &:hover {
          opacity: 0.8;
        }
      }
    }

    .file-input {
      font-size: 14px;
      color: var(--os-text, #fff);

      &::file-selector-button {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.15));
        color: var(--os-text, #fff);
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        margin-right: 15px;
        transition: background 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  .divider {
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--os-text, #fff);
    opacity: 0.5;
    font-size: 12px;
    margin: 10px 0;

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--os-border-color, rgba(255, 255, 255, 0.2));
    }

    &:not(:empty)::before {
      margin-right: 0.5em;
    }

    &:not(:empty)::after {
      margin-left: 0.5em;
    }
  }

  .custom-preview-box {
    margin-top: 10px;
    border: 2px solid var(--os-primary-color, #fff);
    border-radius: 12px;
    padding: 4px;
    background: rgba(255, 255, 255, 0.05);

    .wallpaper-preview {
      width: 100%;
      height: 150px;
      border-radius: 8px;
      background-size: cover;
      background-position: center;
    }
  }
}
</style>
