import playlist from '@/public/musiclist.json';
import functions from '@/composables/functions';

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
const volumeSlider = ref<Number>(100);
const defaultVolume = ref<Number>(100);
const isPlaying = ref(false);
const isLooping = ref(false);
const isMuted = ref(false);
const showPlayer = ref(true);
const tracks = ref<Track[]>([]);
const audioElement = ref<HTMLAudioElement | null>(null);

export const togglePlayer = () => {
    showPlayer.value = !showPlayer.value;
}

const currentTrack = computed(() => {
    return tracks.value[currentTrackIndex.value];
});

export const togglePlayback = (nextprev: boolean) => {
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

export const toggleLoop = () => {
    isLooping.value = !isLooping.value;
    audioElement.value!.loop = isLooping.value;
}

export const toggleMute = () => {
    isMuted.value = !isMuted.value;
    if (audioElement.value) {
        audioElement.value.volume = isMuted.value ? 0 : (defaultVolume.value as number) / 100;
        volumeSlider.value = isMuted.value ? 0 : defaultVolume.value;
    }
}

export const nextTrack = () => {
    currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.value.length;
    restartOrTogglePlayback();
}

export const prevTrack = () => {
    currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.value.length) % tracks.value.length;
    restartOrTogglePlayback();
}

export const restartOrTogglePlayback = () => {
    const onLoadedData = () => {
        audioElement.value?.removeEventListener('loadeddata', onLoadedData);
        togglePlayback(true);
        updateMusicSlider();
    }

    audioElement.value?.addEventListener('loadeddata', onLoadedData);

    audioElement.value!.currentTime = 0;

    if (!audioElement.value!.paused) {
        audioElement.value!.load();
    }
}

export const restartTrack = () => {
    audioElement.value!.currentTime = 0;
    if(isPlaying.value) audioElement.value?.play();
}

export const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export const setTime = (value: number) => {
    if (audioElement.value) {
        audioElement.value.currentTime = (value / 100) * audioElement.value.duration;
    }
}

export const setVolume = (value: number) => {
    if (audioElement.value) {
        audioElement.value.volume = value / 100;
        volumeSlider.value = value;
        defaultVolume.value = value;
        if(value == 0) isMuted.value = true;
        else isMuted.value = false;
        functions.setCookie('volume', value.toString(), 365);
    }
}

export const updateMusicSlider = () => {
    currentTime.value = audioElement.value!.currentTime;
    duration.value = audioElement.value!.duration || 0;
    musicSlider.value = (currentTime.value / duration.value) * 100 || 0;
}

watchEffect(() => {
    tracks.value = playlist;
});

export const useAudioUtils = () => {
    return {
        currentTime,
        duration,
        musicSlider,
        volumeSlider,
        isPlaying,
        isLooping,
        isMuted,
        showPlayer,
        audioElement,
        currentTrack
    }
}