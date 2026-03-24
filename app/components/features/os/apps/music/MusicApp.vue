<template>
  <div class="music-app">
    <div class="main-content">
      <div class="header">
        <h2>{{ $t('os.apps.music.playlist') }}</h2>
      </div>

      <div class="track-list">
        <div v-if="tracks.length === 0" class="empty-state">
          {{ $t('os.apps.music.emptyPlaylist') }}
        </div>

        <div
          v-for="(track, index) in tracks"
          :key="track.id"
          class="track-item"
          :class="{ active: currentTrackIndex === index }"
          @click="musicStore.playTrack(index)">
          <div class="track-cover" :style="{ backgroundImage: `url(${track.cover})` }">
            <div class="play-overlay">
              <Icon
                :name="
                  currentTrackIndex === index && isPlaying ? 'ph:pause-fill' : 'ph:play-fill'
                " />
            </div>
          </div>
          <div class="track-info">
            <span class="track-title">{{ track.title }}</span>
            <span class="track-artist">
              {{ track.artist || $t('os.apps.music.unknownArtist') }}
            </span>
          </div>
          <div class="track-duration">{{ track.duration }}</div>
        </div>
      </div>
    </div>

    <div class="player-bar glass-panel">
      <div v-if="currentTrack" class="now-playing">
        <div class="current-cover" :style="{ backgroundImage: `url(${currentTrack.cover})` }" />
        <div class="current-info">
          <span class="current-title">{{ currentTrack.title }}</span>
          <span class="current-artist">
            {{ currentTrack.artist || $t('os.apps.music.unknownArtist') }}
          </span>
        </div>
      </div>
      <div v-else class="now-playing placeholder">
        <div class="current-cover-placeholder">
          <Icon name="ph:music-notes-simple" />
        </div>
        <div class="current-info">
          <span class="current-title">{{ $t('os.apps.music.nowPlaying') }}</span>
          <span class="current-artist">--</span>
        </div>
      </div>

      <div class="player-controls">
        <div class="buttons">
          <button class="ctrl-btn" :disabled="tracks.length === 0" @click="musicStore.prevTrack">
            <Icon name="ph:skip-back-fill" />
          </button>
          <button
            class="ctrl-btn play-btn"
            :disabled="tracks.length === 0"
            @click="musicStore.togglePlay">
            <Icon :name="isPlaying ? 'ph:pause-fill' : 'ph:play-fill'" />
          </button>
          <button class="ctrl-btn" :disabled="tracks.length === 0" @click="musicStore.nextTrack">
            <Icon name="ph:skip-forward-fill" />
          </button>
        </div>
        <div class="progress-container">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <div ref="progressBar" class="progress-bar" @click="seek">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }">
              <div class="progress-thumb" />
            </div>
          </div>
          <span class="time">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <div class="volume-control">
        <Icon
          :name="
            volume === 0
              ? 'ph:speaker-x-fill'
              : volume > 0.5
                ? 'ph:speaker-high-fill'
                : 'ph:speaker-low-fill'
          " />
        <input
          v-model.number="volume"
          type="range"
          class="volume-slider"
          min="0"
          max="1"
          step="0.01" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMusicStore } from '@/stores/features/os/useMusicStore';

const musicStore = useMusicStore();
const {
  tracks,
  currentTrackIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  currentTrack,
  progressPercent
} = storeToRefs(musicStore);

const progressBar = ref<HTMLElement | null>(null);

const seek = (e: MouseEvent) => {
  if (!progressBar.value || currentTrackIndex.value === null) return;
  const rect = progressBar.value.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  musicStore.seek(pos);
};

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
</script>

<style scoped lang="scss">
.music-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--os-window-bg, rgba(30, 30, 30, 0.95));
  color: var(--os-text, #fff);
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.03), transparent 60%);

  .header h2 {
    margin: 0 0 24px 0;
    font-size: 28px;
    font-weight: 700;
  }
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.05);

    .track-cover .play-overlay {
      opacity: 1;
    }
  }

  &.active {
    background: rgba(255, 255, 255, 0.1);

    .track-title {
      color: var(--os-primary-color, #3b82f6);
    }
  }

  .track-cover {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;

      svg {
        font-size: 24px;
        color: #fff;
      }
    }
  }

  .track-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .track-title {
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-artist {
      font-size: 13px;
      opacity: 0.7;
      margin-top: 4px;
    }
  }

  .track-duration {
    font-size: 13px;
    opacity: 0.6;
    font-variant-numeric: tabular-nums;
  }
}

.player-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-top: 1px solid var(--os-border-color);
  background: var(--os-taskbar-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 10;
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 30%;
  min-width: 180px;

  .current-cover {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .current-cover-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: var(--os-hover);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: var(--os-text);
    opacity: 0.5;
  }

  .current-info {
    display: flex;
    flex-direction: column;

    .current-title {
      font-size: 13px;
      font-weight: 600;
    }

    .current-artist {
      font-size: 11px;
      opacity: 0.6;
      margin-top: 4px;
    }
  }
}

.player-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  margin: 0 20px;

  .buttons {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 6px;

    .ctrl-btn {
      background: transparent;
      border: none;
      color: var(--os-text);
      opacity: 0.8;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        opacity: 1;
        transform: scale(1.1);
      }

      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      &.play-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--os-primary-color);
        color: var(--os-primary-text);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        opacity: 1;

        &:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 15px var(--os-border-color);
        }
      }
    }
  }

  .progress-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;

    .time {
      font-size: 11px;
      opacity: 0.7;
      min-width: 35px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    .progress-bar {
      flex: 1;
      height: 4px;
      background: var(--os-border-color);
      border-radius: 2px;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;

      &:hover .progress-thumb {
        opacity: 1;
        transform: scale(1);
      }

      .progress-fill {
        height: 100%;
        background: var(--os-primary-color, var(--os-text));
        border-radius: 2px;
        position: relative;
        pointer-events: none;
      }

      .progress-thumb {
        position: absolute;
        right: -6px;
        top: -4px;
        width: 12px;
        height: 12px;
        background: var(--os-primary-color, var(--os-text));
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.2s;
      }
    }
  }
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 30%;
  justify-content: flex-end;
  color: var(--os-text);
  opacity: 0.8;

  svg {
    font-size: 20px;
  }

  .volume-slider {
    width: 80px;
    height: 4px;
    appearance: none;
    -webkit-appearance: none;
    background: var(--os-border-color);
    border-radius: 2px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--os-text);
      cursor: pointer;
    }
  }
}

@media (max-width: 768px) {
  .player-bar {
    padding: 12px;
  }

  .now-playing {
    display: none;
  }

  .volume-control {
    display: none;
  }

  .player-controls {
    width: 100%;
    margin: 0;
  }
}
</style>
