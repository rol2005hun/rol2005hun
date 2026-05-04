import { ref, onMounted, onUnmounted } from 'vue';

export interface SystemInfo {
  batteryLevel: number | null;
  batteryCharging: boolean;
  online: boolean;
  connectionType: string | null;
}

interface NetworkInformation extends EventTarget {
  readonly effectiveType?: string;
  readonly type?: string;
  onchange?: EventListener;
}

interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
  onchargingchange?: EventListener;
  onchargingtimechange?: EventListener;
  ondischargingtimechange?: EventListener;
  onlevelchange?: EventListener;
}

interface ExtendedNavigator extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
  getBattery?: () => Promise<BatteryManager>;
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

  let batteryRef: BatteryManager | null = null;

  const updateBatteryStatus = () => {
    if (batteryRef) {
      batteryLevel.value = batteryRef.level;
      batteryCharging.value = batteryRef.charging;
    }
  };

  const initBattery = async () => {
    const nav = navigator as ExtendedNavigator;
    if ('getBattery' in nav && nav.getBattery) {
      try {
        const battery = await nav.getBattery();
        batteryRef = battery;
        updateBatteryStatus();

        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
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
