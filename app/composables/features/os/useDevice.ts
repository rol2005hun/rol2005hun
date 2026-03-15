import { ref, onMounted, onUnmounted } from 'vue';

export const useDevice = () => {
  const isMobile = ref(false);

  const checkDevice = () => {
    // 768px is a common breakpoint for mobile vs tablet/desktop
    isMobile.value = window.innerWidth <= 768;
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
  };
};
