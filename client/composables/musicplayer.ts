import playlist from '@/public/jsons/musiclist.json';

interface Track {
    title: string;
    artist: string;
    image: string;
    audio: string;
}

const currentTrackIndex = ref(0);
const currentTime = ref(0);
const duration = ref(0);
const musicSlider = ref(0);
const volumeSlider = ref<number>(100);
const defaultVolume = ref<number>(100);
const isPlaying = ref(false);
const isLooping = ref(false);
const isMuted = ref(false);
const showPlayer = ref(true);
const tracks = ref<Track[]>([]);
const audioElement = ref<HTMLAudioElement | null>(null);

export function useMusicPlayer() {
    const currentTrack = computed(() => tracks.value[currentTrackIndex.value]);

    const togglePlayer = () => (showPlayer.value = !showPlayer.value);

    const togglePlayback = (nextprev: boolean) => {
        if (!nextprev) {
            if (!isPlaying.value) audioElement.value?.play();
            else audioElement.value?.pause();
            isPlaying.value = !isPlaying.value;
        } else if (isPlaying.value) {
            audioElement.value?.play();
            isPlaying.value = true;
        }
    };

    const toggleLoop = () => {
        isLooping.value = !isLooping.value;
        if (audioElement.value) audioElement.value.loop = isLooping.value;
    };

    const toggleMute = () => {
        isMuted.value = !isMuted.value;
        if (audioElement.value) {
            audioElement.value.volume = isMuted.value ? 0 : defaultVolume.value / 100;
            volumeSlider.value = isMuted.value ? 0 : defaultVolume.value;
        }
    };

    const nextTrack = () => {
        currentTrackIndex.value = (currentTrackIndex.value + 1) % tracks.value.length;
        restartOrTogglePlayback();
    };

    const prevTrack = () => {
        currentTrackIndex.value = (currentTrackIndex.value - 1 + tracks.value.length) % tracks.value.length;
        restartOrTogglePlayback();
    };

    const restartOrTogglePlayback = () => {
        const onLoadedData = () => {
            audioElement.value?.removeEventListener('loadeddata', onLoadedData);
            togglePlayback(true);
            updateMusicSlider();
        };

        audioElement.value?.addEventListener('loadeddata', onLoadedData);
        audioElement.value!.currentTime = 0;
        if (!audioElement.value!.paused) audioElement.value!.load();
    };

    const restartTrack = () => {
        if (audioElement.value) {
            audioElement.value.currentTime = 0;
            if (isPlaying.value) audioElement.value.play();
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const setTime = (value: number) => {
        if (audioElement.value) audioElement.value.currentTime = (value / 100) * audioElement.value.duration;
    };

    const setVolume = (value: number) => {
        if (audioElement.value) {
            audioElement.value.volume = value / 100;
            volumeSlider.value = value;
            defaultVolume.value = value;
            isMuted.value = value === 0;
            useCookie('volume', { expires: new Date('3000-12-12') }).value = value.toString();
        }
    };

    const updateMusicSlider = () => {
        if (audioElement.value) {
            currentTime.value = audioElement.value.currentTime;
            duration.value = audioElement.value.duration || 0;
            musicSlider.value = (currentTime.value / duration.value) * 100 || 0;
        }
    };

    watchEffect(() => {
        tracks.value = playlist;
    });

    return {
        currentTrackIndex,
        currentTime,
        duration,
        musicSlider,
        volumeSlider,
        defaultVolume,
        isPlaying,
        isLooping,
        isMuted,
        showPlayer,
        tracks,
        audioElement,
        currentTrack,
        togglePlayer,
        togglePlayback,
        toggleLoop,
        toggleMute,
        nextTrack,
        prevTrack,
        restartOrTogglePlayback,
        restartTrack,
        formatTime,
        setTime,
        setVolume,
        updateMusicSlider
    };
}