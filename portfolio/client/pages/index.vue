<template>
  <main class="index">
    <!-- <h1><i class="fa-solid fa-circle-info"></i> Információ</h1>
    <br>
    <h3>A fennt lévő navigációs sáv segítségével tudsz navigálni a többi oldal között; de addig is jó zenehallgatást ;)</h3> -->
    <div class="divs">
      <div class="terminal">
        <span class="prompt big">ranzakOS v1.0 copyrighted</span>
        <div class="output" v-for="output in outputs" v-html="output"></div>
        <div class="input-container">
          <span class="prompt">you@ranzak.me:~$</span>
          <input v-model="command" @keyup.enter="executeCommand" placeholder="Futass le egy parancsot..." />
        </div>
      </div>
      <div class="music-player">
        <audio :src="currentTrack.audio" ref="audioElement"></audio>
        <div class="music-player-track">
          <img :src="currentTrack.image" title="currenttrack">
          <div class="music-player-track-info">
            <div class="title">{{ currentTrack.title }}</div>
            <div class="artist">{{ currentTrack.artist }}</div>
            <div class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
            <input type="range" class="slider-music" title="Húzogassad kedved szerint" :value="musicSlider" @input="e => setTime(parseFloat((e.target as HTMLInputElement).value))">
          </div>
          <div class="music-player-track-volum">
            <input type="range" class="slider-volume" title="Húzogassad kedved szerint" :value="volumeSlider" @input="e => setVolume(parseFloat((e.target as HTMLInputElement).value))">
            <button @click="toggleMute">
              <i :class="[isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high']"></i>
            </button>
          </div>
        </div>
        <div class="music-player-controls">
          <div class="buttons">
            <button @click="prevTrack">
              <i class="fas fa-backward"></i>
            </button>
            <button @click="restartTrack">
              <i class="fas fa-undo"></i>
            </button>
            <button @click="togglePlayback(false)">
              <i :class="[isPlaying ? 'fas fa-pause' : 'fas fa-play']"></i>
            </button>
            <button @click="toggleLoop">
              <i :class="[isLooping ? 'fas fa-retweet' : 'fas fa-redo']"></i>
            </button>
            <button @click="nextTrack">
              <i class="fas fa-forward"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
  
<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue';
import playlist from '@/assets/ts/musiclist.json';
import commands from '@/assets/ts/commands.json';
import { match } from 'assert';

interface Track {
  title: string
  artist: string
  image: string
  audio: string
}

const currentTrackIndex = ref(0);
const currentTime = ref(0);
const duration = ref(0);
const musicSlider = ref(0);
const volumeSlider = ref(100);
const defaultVolume = ref(100);
const isPlaying = ref(false);
const isLooping = ref(false);
const isMuted = ref(false);
const tracks = ref<Track[]>([]);
const audioElement = ref<HTMLAudioElement | null>(null);
const outputs = ref<string[]>([]);
const command = ref('christmascounter');

watchEffect(() => {
  tracks.value = playlist;
});

const currentTrack = computed(() => {
  return tracks.value[currentTrackIndex.value];
});

function togglePlayback(nextprev: boolean) {
  if(!nextprev) {
    if (!isPlaying.value) {
      audioElement.value?.play();
    } else {
      audioElement.value?.pause();
    }
    isPlaying.value = !isPlaying.value;
  } else {
    if(isPlaying.value) {
      audioElement.value?.play();
      isPlaying.value = true;
    }
  }
}

function toggleLoop() {
  isLooping.value = !isLooping.value;
  audioElement.value!.loop = isLooping.value;
}

function toggleMute() {
  isMuted.value = !isMuted.value;
  if (audioElement.value) {
    audioElement.value.volume = isMuted.value ? 0 : defaultVolume.value / 100;
    volumeSlider.value = isMuted.value ? 0 : defaultVolume.value;
  }
}

function nextTrack() {
  currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.value.length;
  restartOrTogglePlayback();
}

function prevTrack() {
  currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.value.length) % tracks.value.length;
  restartOrTogglePlayback();
}

function restartOrTogglePlayback() {
  const onLoadedData = () => {
    audioElement.value?.removeEventListener('loadeddata', onLoadedData);
    togglePlayback(true);
    updateMusicSlider();
  };

  audioElement.value?.addEventListener('loadeddata', onLoadedData);

  audioElement.value!.currentTime = 0;

  if (!audioElement.value!.paused) {
    audioElement.value!.load();
  }
}

function restartTrack() {
  audioElement.value!.currentTime = 0;
  if(isPlaying.value) audioElement.value?.play();
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function setTime(value: number) {
  if (audioElement.value) {
    audioElement.value.currentTime = (value / 100) * audioElement.value.duration;
  }
}

function setVolume(value: number) {
  if (audioElement.value) {
    audioElement.value.volume = value / 100;
    volumeSlider.value = value;
    defaultVolume.value = value;
  }
}

function updateMusicSlider() {
  currentTime.value = audioElement.value!.currentTime;
  duration.value = audioElement.value!.duration || 0;
  musicSlider.value = (currentTime.value / duration.value) * 100 || 0;
}

onMounted(() => {
  audioElement.value?.addEventListener('ended', nextTrack);
  audioElement.value?.addEventListener('timeupdate', updateMusicSlider);

  if (audioElement.value) {
    updateMusicSlider();
  }

  executeCommand();
});

const executeCommand = () => {
  if(!command.value) return outputs.value = [...outputs.value, `you@ranzak.me:~$`];
  const matchedCommand = commands.find(cmd => cmd.command.find(c => c === command.value.toLowerCase()));
  if (matchedCommand) {
    let output = '';
    if(matchedCommand.output.startsWith('$')) {
      output = matchedCommand.output.replace(/\${(.*?)}/g, (match, placeholder) => {
        try {
          const dynamicValue = eval(placeholder);
          console.log(dynamicValue);
          return dynamicValue !== undefined ? dynamicValue : match;
        } catch (e) {
          return match;
        }
      });
    }
    if(matchedCommand.output.startsWith('*')) {
      output = matchedCommand.output.replace(/\*{(.*?)}/g, (match, placeholder) => {
        try {
          eval(placeholder);
          return '';
        } catch (e) {
          return match;
        }
      });
    }
    outputs.value = [...outputs.value, `you@ranzak.me:~$ ${command.value}`, output ? output : matchedCommand.output];
  } else {
    outputs.value = [...outputs.value, `you@ranzak.me:~$ ${command.value}`, `Nincs ilyen parancs! Próbáld meg a 'help' parancsot!`];
  }

  command.value = '';
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/index.scss';
</style>