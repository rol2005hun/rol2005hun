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
import { ref, onUnmounted } from 'vue';
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

onUnmounted(() => {
  if (musicStore.isPlaying) {
    musicStore.togglePlay();
  }
});
</script>

<style scoped lang="scss">
.music-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--os-window-bg, rgba(30, 30, 30, 0.95));
  color: var(--os-text, #fff);
  overflow: hidden;
  position: relative;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px 24px;
  background: linear-gradient(180deg, rgba(var(--os-primary-color-rgb), 0.1) 0%, transparent 400px);

  .header h2 {
    margin: 0 0 32px 0;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }
}

.track-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  opacity: 0.5;
  font-size: 16px;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 14px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  border: 1px solid transparent;

  &:hover {
    background: var(--os-hover);
    transform: translateY(-1px);

    .track-cover .play-overlay {
      opacity: 1;
    }
  }

  &.active {
    background: var(--os-hover);
    border-color: rgba(var(--os-primary-color-rgb, 59, 130, 246), 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

    .track-title {
      color: var(--os-primary-color, #3b82f6);
      font-weight: 700;
    }
  }

  .track-cover {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

    .play-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      backdrop-filter: blur(2px);

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
    justify-content: center;

    .track-title {
      font-size: 15px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.3s;
    }

    .track-artist {
      font-size: 13px;
      opacity: 0.65;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .track-duration {
    font-size: 13px;
    opacity: 0.6;
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }
}

.player-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: var(--os-taskbar-bg, rgba(30, 30, 30, 0.85));
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  z-index: 10;
  gap: 16px;
  min-height: 78px;
  position: relative;
}

.now-playing {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;

  .current-cover,
  .current-cover-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  .current-cover-placeholder {
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
    overflow: hidden;

    .current-title {
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .current-artist {
      font-size: 11px;
      text-overflow: ellipsis;
    }
  }
}

.player-controls {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 24px;

  .buttons {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 8px;

    .ctrl-btn {
      background: transparent;
      border: none;
      color: var(--os-text);
      opacity: 0.7;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      &:hover:not(:disabled) {
        opacity: 1;
        transform: scale(1.1);
        color: var(--os-primary-color);
      }

      &:disabled {
        opacity: 0.2;
        cursor: not-allowed;
      }

      &.play-btn {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background: var(--os-text, #fff);
        color: var(--os-window-bg, #000);
        font-size: 22px;
        opacity: 1;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover:not(:disabled) {
          transform: scale(1.1);
          color: var(--os-window-bg, #000);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
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
      opacity: 0.6;
      min-width: 40px;
      text-align: center;
      font-variant-numeric: tabular-nums;
      font-weight: 500;
    }

    .progress-bar {
      flex: 1;
      height: 5px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      transition: height 0.2s;

      &:hover {
        height: 8px;

        .progress-thumb {
          opacity: 1;
          transform: scale(1);
        }
      }

      .progress-fill {
        height: 100%;
        background: var(--os-primary-color, #3b82f6);
        border-radius: 3px;
        position: relative;
        pointer-events: none;
        transition: width 0.1s linear;
      }

      .progress-thumb {
        position: absolute;
        right: -6px;
        top: 50%;
        margin-top: -6px;
        width: 12px;
        height: 12px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }
  }
}

.volume-control {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  color: var(--os-text);
  opacity: 0.8;
  transition: opacity 0.2s;
  position: relative;

  &:hover {
    opacity: 1;
  }

  svg {
    font-size: 20px;
    cursor: pointer;
  }

  .volume-slider {
    width: 90px;
    height: 4px;
    appearance: none;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      transition: transform 0.1s;
    }

    &::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
  }
}

@media (max-width: 768px) {
  .player-bar {
    padding: 12px 16px;
    padding-bottom: 40px;
  }

  .now-playing {
    .current-cover,
    .current-cover-placeholder {
      width: 44px;
      height: 44px;
    }
  }

  .player-controls {
    margin: 0;
    position: static;

    .buttons {
      margin-bottom: 0;
      gap: 16px;
    }

    .progress-container {
      position: absolute;
      bottom: 12px;
      left: 16px;
      right: 16px;
      width: calc(100% - 32px);
      display: flex;
      align-items: center;
      gap: 10px;

      .time {
        position: static;
        font-size: 11px;
        min-width: 32px;
      }

      .progress-bar {
        flex: 1;
        height: 4px;
        border-radius: 2px;
        background: rgba(255, 255, 255, 0.15);

        &:hover {
          height: 6px;
        }

        .progress-fill {
          border-radius: 2px;
        }

        .progress-thumb {
          opacity: 1;
          transform: scale(1);
          width: 12px;
          height: 12px;
          margin-top: -6px;
          right: -6px;
        }
      }
    }
  }

  .volume-control {
    flex: 0 0 auto;
    gap: 8px;

    .volume-slider {
      width: 60px;
    }
  }
}

@media (max-width: 480px) {
  .player-bar {
    padding: 10px 12px;
    padding-bottom: 36px;
  }

  .now-playing {
    .current-cover,
    .current-cover-placeholder {
      width: 40px;
      height: 40px;
      margin-right: 8px;
    }
  }

  .player-controls {
    .buttons {
      gap: 12px;

      .ctrl-btn {
        font-size: 20px;
        &.play-btn {
          width: 38px;
          height: 38px;
          font-size: 18px;
        }
      }
    }

    .progress-container {
      bottom: 10px;
      left: 12px;
      right: 12px;
      width: calc(100% - 24px);

      .time {
        font-size: 10px;
      }
    }
  }

  .volume-control {
    flex: 0 0 auto;
    gap: 6px;

    svg {
      font-size: 18px;
    }

    .volume-slider {
      width: 40px;
    }
  }
}
</style>
