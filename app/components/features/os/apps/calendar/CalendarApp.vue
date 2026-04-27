<template>
  <div class="calendar-app">
    <div class="header">
      <h2>{{ monthName }} {{ currentYear }}</h2>
      <div class="actions">
        <button class="icon-only" @click="prevMonth">
          <Icon name="ph:caret-left-bold" />
        </button>
        <button @click="goToday">
          {{ $t('os.apps.calendar.today') }}
        </button>
        <button class="icon-only" @click="nextMonth">
          <Icon name="ph:caret-right-bold" />
        </button>
      </div>
    </div>

    <div class="calendar-grid">
      <div v-for="weekday in weekdays" :key="weekday" class="weekday">
        {{ weekday }}
      </div>

      <div
        v-for="(day, index) in days"
        :key="index"
        :class="['day', { 'not-current-month': !day.isCurrentMonth, 'is-today': day.isToday }]">
        <span>{{ day.day }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

const monthName = computed(() => t(`os.apps.calendar.months.${currentMonth.value}`));
const weekdays = computed(() => {
  return Array.from({ length: 7 }, (_, i) => t(`os.apps.calendar.weekdays.${i}`));
});

const days = computed(() => {
  const cMonth = currentMonth.value;
  const cYear = currentYear.value;

  const firstDay = new Date(cYear, cMonth, 1).getDay();
  const daysInMonth = new Date(cYear, cMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(cYear, cMonth, 0).getDate();

  const calendarDays = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(cYear, cMonth - 1, daysInPrevMonth - i),
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      today.getDate() === i && today.getMonth() === cMonth && today.getFullYear() === cYear;
    calendarDays.push({
      date: new Date(cYear, cMonth, i),
      day: i,
      isCurrentMonth: true,
      isToday
    });
  }

  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({
      date: new Date(cYear, cMonth + 1, i),
      day: i,
      isCurrentMonth: false,
      isToday: false
    });
  }

  return calendarDays;
});

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const goToday = () => {
  currentMonth.value = today.getMonth();
  currentYear.value = today.getFullYear();
};
</script>

<style scoped lang="scss">
.calendar-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  background-color: var(--theme-bg, #1a1a1a);
  color: var(--theme-text, #ffffff);
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .actions {
    display: flex;
    gap: 8px;

    button {
      background: var(--theme-bg-element, rgba(255, 255, 255, 0.05));
      border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
      color: inherit;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-size: 0.95rem;

      &:hover {
        background: var(--theme-hover, rgba(255, 255, 255, 0.1));
      }

      &.icon-only {
        padding: 8px;
      }

      .iconify {
        font-size: 1.2rem;
      }
    }
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  flex-grow: 1;
}

.weekday {
  text-align: center;
  font-weight: 600;
  padding: 8px 0;
  color: var(--theme-text-muted, #a0a0a0);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--theme-bg-element, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.05));
  border-radius: 8px;
  cursor: default;
  transition: all 0.2s;
  min-height: 50px;
  font-size: 1.1rem;
  position: relative;

  &:hover {
    background: var(--theme-hover, rgba(255, 255, 255, 0.08));
  }

  &.not-current-month {
    opacity: 0.3;
    pointer-events: none;
  }

  &.is-today {
    background: rgba(0, 122, 255, 0.15);
    color: #4da3ff;
    font-weight: bold;
    border-color: rgba(0, 122, 255, 0.3);

    &::after {
      content: '';
      position: absolute;
      bottom: 8px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #4da3ff;
    }
  }
}
</style>
