<template>
  <div class="weather-app">
    <div v-if="loading" class="weather-loading">
      <div class="loading-spinner" />
      <span>{{ $t('os.apps.weather.loading') }}</span>
    </div>

    <div v-else-if="error" class="weather-error">
      <Icon name="ph:cloud-x-fill" size="48px" class="error-icon" />
      <p class="error-text">{{ error }}</p>
      <button class="retry-btn" @click="fetchWeather">
        <Icon name="ph:arrow-clockwise-bold" />
        {{ $t('os.apps.weather.retry') }}
      </button>
    </div>

    <template v-else-if="weather">
      <div class="weather-header">
        <div class="location-row">
          <div class="location-info">
            <Icon name="ph:map-pin-fill" size="16px" class="pin-icon" />
            <span class="location-name">{{ locationName }}</span>
          </div>
          <button class="refresh-btn" :title="$t('os.apps.weather.refresh')" @click="fetchWeather">
            <Icon name="ph:arrow-clockwise-bold" size="16px" />
          </button>
        </div>

        <div class="current-weather">
          <div class="temp-block">
            <div class="main-temp">{{ Math.round(weather.current.temperature_2m) }}°C</div>
            <div class="feels-like">
              {{ $t('os.apps.weather.feelsLike') }}
              {{ Math.round(weather.current.apparent_temperature) }}°C
            </div>
          </div>
          <div class="condition-block">
            <span class="weather-emoji">{{ getWeatherEmoji(weather.current.weathercode) }}</span>
            <span class="condition-label">
              {{ $t(getWeatherKey(weather.current.weathercode)) }}
            </span>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <Icon name="ph:drop-fill" size="14px" />
            <span>{{ weather.current.relative_humidity_2m }}%</span>
            <small>{{ $t('os.apps.weather.humidity') }}</small>
          </div>
          <div class="stat-item">
            <Icon name="ph:wind-fill" size="14px" />
            <span>{{ Math.round(weather.current.wind_speed_10m) }} km/h</span>
            <small>{{ $t('os.apps.weather.wind') }}</small>
          </div>
          <div class="stat-item">
            <Icon name="ph:thermometer-hot-fill" size="14px" />
            <span>
              {{ Math.round(weather.daily.temperature_2m_max[0] ?? 0) }}° /
              {{ Math.round(weather.daily.temperature_2m_min[0] ?? 0) }}°
            </span>
            <small>{{ $t('os.apps.weather.highLow') }}</small>
          </div>
          <div class="stat-item">
            <Icon name="ph:umbrella-fill" size="14px" />
            <span>{{ weather.daily.precipitation_sum[0] ?? 0 }} mm</span>
            <small>{{ $t('os.apps.weather.precipitation') }}</small>
          </div>
        </div>
      </div>

      <div class="weather-body">
        <div class="section-title">{{ $t('os.apps.weather.hourlyForecast') }}</div>
        <div class="hourly-scroll">
          <div
            v-for="(hour, i) in hourlySlice"
            :key="i"
            class="hour-card"
            :class="{ 'is-now': i === currentHourIndex }">
            <span class="hour-label">
              {{ i === currentHourIndex ? $t('os.apps.weather.now') : formatHour(hour.time) }}
            </span>
            <span class="hour-emoji">{{ getWeatherEmoji(hour.code) }}</span>
            <span class="hour-temp">{{ Math.round(hour.temp) }}°</span>
          </div>
        </div>

        <div class="section-title">{{ $t('os.apps.weather.weeklyForecast') }}</div>
        <div class="daily-list">
          <div v-for="(day, i) in dailySlice" :key="i" class="day-row">
            <span class="day-name">
              {{ i === 0 ? $t('os.apps.weather.today') : formatDay(day.date) }}
            </span>
            <span class="day-emoji">{{ getWeatherEmoji(day.code) }}</span>
            <div class="day-range">
              <span class="day-min">{{ Math.round(day.min) }}°</span>
              <div class="temp-bar-wrap">
                <div class="temp-bar" :style="getTempBarStyle(day.min, day.max)" />
              </div>
              <span class="day-max">{{ Math.round(day.max) }}°</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface WeatherResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weathercode: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

const loading = ref(true);
const error = ref<string | null>(null);
const weather = ref<WeatherResponse | null>(null);
const locationName = ref('');
const lat = ref(47.4979);
const lon = ref(19.0402);

const currentHourIndex = computed(() => {
  if (!weather.value) return 0;
  const now = new Date();
  const h = now.getHours();
  return weather.value.hourly.time.findIndex((t) => {
    const d = new Date(t);
    return d.getDate() === now.getDate() && d.getHours() === h;
  });
});

const hourlySlice = computed(() => {
  const w = weather.value;
  if (!w) return [];
  const idx = Math.max(0, currentHourIndex.value);
  return w.hourly.time.slice(idx, idx + 24).map((time, i) => ({
    time,
    temp: w.hourly.temperature_2m[idx + i] ?? 0,
    code: w.hourly.weathercode[idx + i] ?? 0
  }));
});

const dailySlice = computed(() => {
  const w = weather.value;
  if (!w) return [];
  return w.daily.time.slice(0, 7).map((date, i) => ({
    date,
    code: w.daily.weathercode[i] ?? 0,
    max: w.daily.temperature_2m_max[i] ?? 0,
    min: w.daily.temperature_2m_min[i] ?? 0
  }));
});

const weekMin = computed(() =>
  dailySlice.value.length ? Math.min(...dailySlice.value.map((d) => d.min)) : 0
);
const weekMax = computed(() =>
  dailySlice.value.length ? Math.max(...dailySlice.value.map((d) => d.max)) : 0
);

const getTempBarStyle = (min: number, max: number) => {
  const range = weekMax.value - weekMin.value || 1;
  const left = ((min - weekMin.value) / range) * 100;
  const width = ((max - min) / range) * 100;
  return { left: `${left}%`, width: `${Math.max(width, 8)}%` };
};

const formatHour = (iso: string) => {
  const d = new Date(iso);
  return d.getHours().toString().padStart(2, '0') + ':00';
};

const formatDay = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
};

const getWeatherEmoji = (code: number | undefined): string => {
  if (code === undefined) return '🌡️';
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌦️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '❄️';
  if (code <= 84) return '🌧️';
  if (code <= 94) return '⛈️';
  return '🌩️';
};

const getWeatherKey = (code: number): string => {
  if (code === 0) return 'os.apps.weather.conditions.clear';
  if (code <= 2) return 'os.apps.weather.conditions.partlyCloudy';
  if (code === 3) return 'os.apps.weather.conditions.overcast';
  if (code <= 49) return 'os.apps.weather.conditions.fog';
  if (code <= 59) return 'os.apps.weather.conditions.drizzle';
  if (code <= 69) return 'os.apps.weather.conditions.rain';
  if (code <= 79) return 'os.apps.weather.conditions.snow';
  if (code <= 84) return 'os.apps.weather.conditions.showers';
  return 'os.apps.weather.conditions.thunderstorm';
};

const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await res.json();
    const addr = data.address;
    locationName.value =
      addr.city || addr.town || addr.village || addr.county || t('os.apps.weather.unknownLocation');
  } catch {
    locationName.value = t('os.apps.weather.unknownLocation');
  }
};

const fetchWeather = async () => {
  loading.value = true;
  error.value = null;
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.value}&longitude=${lon.value}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weathercode` +
      `&hourly=temperature_2m,weathercode` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
      `&timezone=auto&forecast_days=7`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    weather.value = await res.json();
  } catch {
    error.value = t('os.apps.weather.errorFetch');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        lat.value = pos.coords.latitude;
        lon.value = pos.coords.longitude;
        await reverseGeocode(lat.value, lon.value);
        fetchWeather();
      },
      async () => {
        await reverseGeocode(lat.value, lon.value);
        fetchWeather();
      }
    );
  } else {
    reverseGeocode(lat.value, lon.value);
    fetchWeather();
  }
});
</script>

<style scoped lang="scss">
.weather-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--os-window-bg);
  color: var(--os-text, #fff);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.weather-loading,
.weather-error {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: color-mix(in srgb, var(--os-text) 70%, transparent);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid color-mix(in srgb, var(--os-text) 15%, transparent);
  border-top-color: var(--os-primary-color, #0078d4);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-icon {
  opacity: 0.5;
}

.error-text {
  font-size: 14px;
  text-align: center;
  max-width: 260px;
}

.retry-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--os-primary-color, #0078d4);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
}

.weather-header {
  padding: 20px 20px 16px;
  background: linear-gradient(
    160deg,
    color-mix(in srgb, var(--os-primary-color, #0078d4) 25%, transparent),
    transparent 70%
  );
  border-bottom: 1px solid color-mix(in srgb, var(--os-border, #444) 30%, transparent);
}

.location-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  opacity: 0.8;
}

.pin-icon {
  color: var(--os-primary-color, #0078d4);
}

.refresh-btn {
  background: color-mix(in srgb, var(--os-text) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 40%, transparent);
  border-radius: 8px;
  color: var(--os-text);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: color-mix(in srgb, var(--os-text) 15%, transparent);
    transform: rotate(30deg);
  }
}

.current-weather {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.temp-block {
  display: flex;
  flex-direction: column;
}

.main-temp {
  font-size: 56px;
  font-weight: 200;
  letter-spacing: -2px;
  line-height: 1;
}

.feels-like {
  font-size: 13px;
  opacity: 0.6;
  margin-top: 4px;
}

.condition-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.weather-emoji {
  font-size: 52px;
  line-height: 1;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.condition-label {
  font-size: 13px;
  opacity: 0.7;
  text-align: center;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 8px;
  background: color-mix(in srgb, var(--os-text) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 20%, transparent);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;

  small {
    font-size: 11px;
    opacity: 0.5;
    font-weight: 400;
  }
}

.weather-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.5;
  margin-bottom: 4px;
}

.hourly-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 6px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--os-text) 20%, transparent);
    border-radius: 4px;
  }
}

.hour-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: color-mix(in srgb, var(--os-text) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 20%, transparent);
  border-radius: 12px;
  flex-shrink: 0;
  min-width: 56px;
  transition: background 0.2s;

  &.is-now {
    background: color-mix(in srgb, var(--os-primary-color, #0078d4) 20%, transparent);
    border-color: color-mix(in srgb, var(--os-primary-color, #0078d4) 40%, transparent);
  }

  .hour-label {
    font-size: 11px;
    opacity: 0.6;
  }

  .hour-emoji {
    font-size: 20px;
  }

  .hour-temp {
    font-size: 13px;
    font-weight: 600;
  }
}

.daily-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.day-row {
  display: grid;
  grid-template-columns: 52px 28px 1fr;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: color-mix(in srgb, var(--os-text) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--os-border, #444) 15%, transparent);
  border-radius: 10px;

  .day-name {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.8;
  }

  .day-emoji {
    font-size: 18px;
    text-align: center;
  }

  .day-range {
    display: flex;
    align-items: center;
    gap: 8px;

    .day-min,
    .day-max {
      font-size: 13px;
      font-weight: 500;
      min-width: 32px;
      text-align: right;
    }

    .day-min {
      opacity: 0.5;
      text-align: right;
    }

    .temp-bar-wrap {
      flex: 1;
      height: 6px;
      background: color-mix(in srgb, var(--os-text) 10%, transparent);
      border-radius: 3px;
      position: relative;
      overflow: visible;
    }

    .temp-bar {
      position: absolute;
      top: 0;
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, #0078d4, #00c4a7);
    }
  }
}
</style>
