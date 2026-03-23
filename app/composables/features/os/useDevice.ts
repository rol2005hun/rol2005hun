import { ref, onMounted, onUnmounted } from 'vue';

export const useDevice = () => {
  const isMobile = ref(false);
  const userAgent = ref('');

  const checkDevice = () => {
    isMobile.value = window.innerWidth <= 768;
    if (typeof navigator !== 'undefined') {
      userAgent.value = navigator.userAgent;
    }
  };

  onMounted(() => {
    if (typeof window !== 'undefined') {
      checkDevice();
      window.addEventListener('resize', checkDevice);
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', checkDevice);
    }
  });

  return {
    isMobile,
    userAgent
  };
};
