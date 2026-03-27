import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration: string;
}

export const useMusicStore = defineStore('os-music', () => {
  const tracks = ref<Track[]>([]);
  const currentTrackIndex = ref<number | null>(null);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(0.7);

  let audioPlayer: HTMLAudioElement | null = null;

  if (import.meta.client) {
    audioPlayer = new Audio();
    const savedVolume = localStorage.getItem('os-music-volume');
    if (savedVolume) {
      volume.value = parseFloat(savedVolume);
    }
    audioPlayer.volume = volume.value;

    audioPlayer.addEventListener('timeupdate', () => {
      currentTime.value = audioPlayer!.currentTime;
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
      duration.value = audioPlayer!.duration;
    });

    audioPlayer.addEventListener('ended', () => {
      nextTrack();
    });

    audioPlayer.addEventListener('play', () => {
      isPlaying.value = true;
    });

    audioPlayer.addEventListener('pause', () => {
      isPlaying.value = false;
    });

    fetch('/data/music.json')
      .then((res) => res.json())
      .then((data) => {
        tracks.value = data;
      })
      .catch((err) => {
        console.error('Failed to load music metadata:', err);
      });
  }

  watch(volume, (newVol) => {
    if (audioPlayer) {
      audioPlayer.volume = newVol;
    }
    if (import.meta.client) {
      localStorage.setItem('os-music-volume', newVol.toString());
    }
  });

  const currentTrack = computed(() => {
    return currentTrackIndex.value !== null ? tracks.value[currentTrackIndex.value] : null;
  });

  const progressPercent = computed(() => {
    if (!duration.value) return 0;
    return (currentTime.value / duration.value) * 100;
  });

  const playTrack = (index: number) => {
    if (currentTrackIndex.value === index) {
      togglePlay();
      return;
    }

    currentTrackIndex.value = index;
    const track = tracks.value[index];

    if (audioPlayer && track) {
      audioPlayer.src = track.url;
      audioPlayer.play().catch((e) => {
        console.warn('Autoplay blocked or invalid source.', e);
        isPlaying.value = false;
      });
    }
  };

  const togglePlay = () => {
    if (!audioPlayer) return;

    if (currentTrackIndex.value === null) {
      if (tracks.value.length > 0) playTrack(0);
      return;
    }

    if (isPlaying.value) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
  };

  const nextTrack = () => {
    if (tracks.value.length === 0) return;
    let next = (currentTrackIndex.value ?? -1) + 1;
    if (next >= tracks.value.length) next = 0;
    playTrack(next);
  };

  const prevTrack = () => {
    if (tracks.value.length === 0) return;
    let prev = (currentTrackIndex.value ?? 0) - 1;
    if (prev < 0) prev = tracks.value.length - 1;
    playTrack(prev);
  };

  const seek = (posPercent: number) => {
    if (!audioPlayer || currentTrackIndex.value === null) return;
    audioPlayer.currentTime = posPercent * duration.value;
  };

  return {
    tracks,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    progressPercent,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seek
  };
});
