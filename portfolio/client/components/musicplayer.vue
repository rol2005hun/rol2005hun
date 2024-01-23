<template>
    <main class="music-box">
        <Transition name="showPlayer">
            <div v-show="showPlayer" class="music-player">
                <audio :src="currentTrack.audio" ref="audioElement"></audio>
                <div class="music-player-track">
                    <img :src="currentTrack.image" title="currenttrack">
                    <div class="music-player-track-info">
                        <div class="title">{{ currentTrack.title }}</div>
                        <div class="artist">{{ currentTrack.artist }}</div>
                        <div class="time">{{ formatTime(currentTime) }} / {{ formatTime(duration) != 'Infinity:NaN' ? formatTime(duration) : 'Live' }}</div>
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
                            <i :class="[isPlaying ? 'fas fa-pause' : 'fas fa-play']" id="playback"></i>
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
        </Transition>
    </main>
</template>

<script setup lang="ts">
import functions from '@/assets/ts/functions';

const volume = ref(functions.getCookie('volume') as string);
const musicPlayer = ref(functions.getCookie('musicPlayer') as string);
const {
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
} = useAudioUtils();

if(volume.value) volumeSlider.value = parseInt(volume.value);
if(musicPlayer.value != undefined) showPlayer.value = musicPlayer.value.toString() == 'true';

onMounted(() => {
    audioElement.value?.addEventListener('ended', nextTrack);
    audioElement.value?.addEventListener('timeupdate', updateMusicSlider);

    if (audioElement.value) {
        updateMusicSlider();

        if(volume) setVolume(parseInt(volume.value));
    }
});

watch(showPlayer, () => {
    const body = document.querySelector('body') as HTMLBodyElement;
    body.style.overflowX = 'hidden';
    setTimeout(() => {
        body.style.removeProperty('overflow-x');
    }, 1000);
    functions.setCookie('musicPlayer', showPlayer.value.toString(), 365);
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/musicplayer.scss';
</style>