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

    <div class="calendar-grid-wrapper">
      <div class="calendar-grid">
        <div v-for="weekday in weekdays" :key="weekday" class="weekday">
          {{ weekday }}
        </div>

        <div
          v-for="(day, index) in days"
          :key="index"
          @click="openEventModal(day.date, day.isCurrentMonth)"
          :class="['day', { 'not-current-month': !day.isCurrentMonth, 'is-today': day.isToday }]">
          <span class="day-number">{{ day.day }}</span>
          <div class="events">
            <div
              v-for="evt in calendarStore.getEventsForDate(day.date)"
              :key="evt.id"
              class="event-badge"
              :class="{ predefined: evt.isPredefined }"
              :title="evt.title">
              {{ evt.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="event-modal-overlay" @click.self="closeModal">
      <div class="event-modal glass-panel">
        <h3>{{ $t('os.apps.calendar.eventsOn') }} {{ calendarStore.formatDate(selectedDate) }}</h3>

        <div class="existing-events">
          <div v-for="evt in selectedDateEvents" :key="evt.id" class="existing-event">
            <span>{{ evt.title }}</span>
            <button
              v-if="!evt.isPredefined"
              @click="calendarStore.deleteEvent(evt.id)"
              class="delete-btn">
              <Icon name="ph:trash-bold" />
            </button>
          </div>
          <p v-if="selectedDateEvents.length === 0" class="no-events">
            {{ $t('os.apps.calendar.noEvents') }}
          </p>
        </div>

        <div class="add-event-form">
          <input
            v-model="newEventTitle"
            :placeholder="$t('os.apps.calendar.newEvent')"
            @keyup.enter="addNewEvent" />
          <button @click="addNewEvent">{{ $t('os.apps.calendar.add') }}</button>
        </div>
        <div class="modal-actions">
          <button @click="closeModal">{{ $t('os.apps.calendar.close') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalendarStore } from '@/stores/features/os/useCalendarStore';

const { t } = useI18n();
const calendarStore = useCalendarStore();

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

const showModal = ref(false);
const selectedDate = ref(new Date());
const newEventTitle = ref('');

const selectedDateEvents = computed(() => {
  return calendarStore.getEventsForDate(selectedDate.value);
});

const openEventModal = (date: Date, isCurrentMonth: boolean) => {
  if (!isCurrentMonth) return;
  selectedDate.value = date;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  newEventTitle.value = '';
};

const addNewEvent = () => {
  if (newEventTitle.value.trim()) {
    calendarStore.addEvent(selectedDate.value, newEventTitle.value.trim());
    newEventTitle.value = '';
  }
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

.calendar-grid-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  min-height: 100%;

  @media (max-width: 768px) {
    gap: 4px;
  }
}

.weekday {
  text-align: center;
  font-weight: 600;
  padding: 8px 0;
  color: var(--theme-text-muted, #a0a0a0);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 4px 0;
  }
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: var(--theme-bg-element, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.05));
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 80px;
  font-size: 1.1rem;
  position: relative;
  padding: 4px;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 60px;
    font-size: 0.9rem;
  }

  .day-number {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .events {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .event-badge {
    font-size: 0.65rem;
    background: rgba(0, 122, 255, 0.2);
    color: #4da3ff;
    padding: 2px 4px;
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    width: 100%;

    &.predefined {
      background: rgba(255, 149, 0, 0.2);
      color: #ff9f0a;
    }
  }

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
  }
}

.event-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.event-modal {
  background: var(--theme-bg-element, rgba(30, 30, 30, 0.95));
  border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.1));
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  .existing-events {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 200px;
    overflow-y: auto;

    .no-events {
      color: var(--theme-text-muted, #aaa);
      font-size: 0.9rem;
      font-style: italic;
    }

    .existing-event {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.05);
      padding: 8px 12px;
      border-radius: 6px;

      .delete-btn {
        background: transparent;
        border: none;
        color: #ff4d4f;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        border-radius: 4px;

        &:hover {
          background: rgba(255, 77, 79, 0.2);
        }
      }
    }
  }

  .add-event-form {
    display: flex;
    gap: 8px;

    input {
      flex: 1;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.2));
      background: rgba(0, 0, 0, 0.2);
      color: inherit;
    }

    button {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      background: var(--os-primary-color, #007aff);
      color: #fff;
      cursor: pointer;
      font-weight: 600;

      &:hover {
        opacity: 0.9;
      }
    }
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;

    button {
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.2));
      background: transparent;
      color: inherit;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
