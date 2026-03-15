import { ref, onMounted, onUnmounted } from 'vue';

export interface SystemInfo {
  batteryLevel: number | null;
  batteryCharging: boolean;
  online: boolean;
  connectionType: string | null;
}

interface ExtendedNavigator extends Navigator {
  connection?: any;
  mozConnection?: any;
  webkitConnection?: any;
  getBattery?: () => Promise<any>;
}

export function useSystemInfo() {
  const batteryLevel = ref<number | null>(null);
  const batteryCharging = ref<boolean>(true);
  const online = ref<boolean>(true);
  const connectionType = ref<string | null>(null);

  const updateOnlineStatus = () => {
    online.value = navigator.onLine;
  };

  const updateConnectionStatus = () => {
    const nav = navigator as ExtendedNavigator;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
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
    const nav = navigator as ExtendedNavigator;
    if ('getBattery' in nav && nav.getBattery) {
      try {
        const battery = await nav.getBattery();
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
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    const nav = navigator as ExtendedNavigator;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateConnectionStatus);
      updateConnectionStatus();
    }

    initBattery();
  });

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);

    const nav = navigator as ExtendedNavigator;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
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
