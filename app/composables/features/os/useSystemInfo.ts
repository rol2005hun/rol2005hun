import { ref, onMounted, onUnmounted } from 'vue';

export interface SystemInfo {
  batteryLevel: number | null;
  batteryCharging: boolean;
  online: boolean;
  connectionType: string | null; // e.g., 'wifi', 'cellular', etc.
}

export function useSystemInfo() {
  const batteryLevel = ref<number | null>(null);
  const batteryCharging = ref<boolean>(true);
  const online = ref<boolean>(true);
  const connectionType = ref<string | null>(null);

  // Fallback update functions
  const updateOnlineStatus = () => {
    online.value = navigator.onLine;
  };

  const updateConnectionStatus = () => {
    // @ts-ignore - Network Information API is experimental and not in all browsers
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connectionType.value = connection.type || connection.effectiveType || 'wifi';
    }
  };

  let batteryRef: any = null;

  const updateBatteryStatus = (battery: any) => {
    batteryLevel.value = battery.level;
    batteryCharging.value = battery.charging;
  };

  const initBattery = async () => {
    // @ts-ignore - Battery API
    if ('getBattery' in navigator) {
      try {
        // @ts-ignore
        const battery = await navigator.getBattery();
        batteryRef = battery;
        updateBatteryStatus(battery);

        battery.addEventListener('levelchange', () => updateBatteryStatus(battery));
        battery.addEventListener('chargingchange', () => updateBatteryStatus(battery));
      } catch (e) {
        console.error('Battery API access denied or failed:', e);
      }
    }
  };

  onMounted(() => {
    // Network events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateConnectionStatus);
      updateConnectionStatus();
    }

    // Battery init
    initBattery();
  });

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);

    // @ts-ignore
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.removeEventListener('change', updateConnectionStatus);
    }

    if (batteryRef) {
      batteryRef.removeEventListener('levelchange', updateBatteryStatus);
      batteryRef.removeEventListener('chargingchange', updateBatteryStatus);
    }
  });

  return {
    batteryLevel,
    batteryCharging,
    online,
    connectionType
  };
}
