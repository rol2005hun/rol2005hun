<template>
  <div class="calendar-app">
    <div class="calendar-bg-glow"></div>
    <div class="header glass-header">
      <div class="header-content">
        <h2>
          {{ monthName }}
          <span>{{ currentYear }}</span>
        </h2>
        <div class="actions">
          <button class="icon-only" @click="prevMonth" :title="$t('os.apps.calendar.prevMonth')">
            <Icon name="ph:caret-left-bold" />
          </button>
          <button class="today-btn" @click="goToday">
            {{ $t('os.apps.calendar.today') }}
          </button>
          <button class="icon-only" @click="nextMonth" :title="$t('os.apps.calendar.nextMonth')">
            <Icon name="ph:caret-right-bold" />
          </button>
        </div>
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
          :class="[
            'day-cell',
            {
              'not-current-month': !day.isCurrentMonth,
              'is-today': day.isToday,
              'has-events': calendarStore.getEventsForDate(day.date).length > 0
            }
          ]"
          @click="openEventModal(day.date, day.isCurrentMonth)">
          <div class="day-content glass-panel">
            <span class="day-number">{{ day.day }}</span>
            <div class="event-dots" v-if="calendarStore.getEventsForDate(day.date).length > 0">
              <div
                v-for="evt in calendarStore.getEventsForDate(day.date).slice(0, 3)"
                :key="evt.id"
                class="dot"
                :class="{ predefined: evt.isPredefined }"
                :title="evt.title"></div>
              <div class="dot-more" v-if="calendarStore.getEventsForDate(day.date).length > 3">
                +{{ calendarStore.getEventsForDate(day.date).length - 3 }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal-fade">
      <div v-if="showModal" class="event-modal-overlay" @click.self="closeModal">
        <div class="event-modal glass-panel-strong">
          <div class="modal-header">
            <h3>
              {{ $t('os.apps.calendar.eventsOn') }}
              <span>{{ calendarStore.formatDate(selectedDate) }}</span>
            </h3>
            <button class="close-icon-btn" @click="closeModal">
              <Icon name="ph:x-bold" />
            </button>
          </div>

          <div class="existing-events">
            <div v-for="evt in selectedDateEvents" :key="evt.id" class="existing-event">
              <div class="event-info">
                <div class="event-indicator" :class="{ predefined: evt.isPredefined }"></div>
                <span>{{ evt.title }}</span>
              </div>
              <button
                v-if="!evt.isPredefined"
                class="delete-btn"
                @click="calendarStore.deleteEvent(evt.id)"
                :title="$t('os.apps.calendar.deleteEvent')">
                <Icon name="ph:trash-bold" />
              </button>
            </div>
            <div v-if="selectedDateEvents.length === 0" class="no-events">
              <Icon name="ph:calendar-blank-duotone" class="no-events-icon" />
              <p>{{ $t('os.apps.calendar.noEvents') }}</p>
            </div>
          </div>

          <div class="add-event-form">
            <input
              v-model="newEventTitle"
              :placeholder="$t('os.apps.calendar.newEvent')"
              @keyup.enter="addNewEvent" />
            <button class="primary-btn" @click="addNewEvent" :disabled="!newEventTitle.trim()">
              <Icon name="ph:plus-bold" />
              {{ $t('os.apps.calendar.add') }}
            </button>
          </div>
        </div>
      </div>
    </transition>
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
  background: var(--os-window-bg);
  color: var(--theme-text, #ffffff);
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.calendar-bg-glow {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--os-primary-color) 15%, transparent) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
  border-radius: 50%;
}

.glass-header {
  position: relative;
  z-index: 10;
  padding: 24px 32px 16px;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--os-window-bg) 95%, transparent),
    color-mix(in srgb, var(--os-window-bg) 40%, transparent)
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in srgb, var(--os-border-color) 50%, transparent);

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.5px;
    display: flex;
    gap: 8px;
    align-items: baseline;

    span {
      font-size: 1.4rem;
      font-weight: 500;
      opacity: 0.6;
    }

    @media (max-width: 768px) {
      font-size: 1.4rem;
      span {
        font-size: 1.1rem;
      }
    }
  }

  .actions {
    display: flex;
    gap: 8px;
    align-items: center;

    button {
      background: color-mix(in srgb, var(--os-text) 5%, transparent);
      border: 1px solid color-mix(in srgb, var(--os-border-color) 40%, transparent);
      color: var(--os-text);
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
      font-weight: 600;

      &:hover {
        background: color-mix(in srgb, var(--os-text) 10%, transparent);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &:active {
        transform: translateY(0);
      }

      &.icon-only {
        width: 36px;
        height: 36px;
        font-size: 1.2rem;
      }

      &.today-btn {
        padding: 0 16px;
        height: 36px;
        font-size: 0.9rem;
      }
    }
  }
}

.calendar-grid-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 32px 32px;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 12px 20px 20px;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--os-text) 20%, transparent);
    border-radius: 3px;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  min-height: 100%;

  @media (max-width: 768px) {
    gap: 6px;
  }
}

.weekday {
  text-align: center;
  font-weight: 700;
  padding: 8px 0 16px;
  color: color-mix(in srgb, var(--os-text) 50%, transparent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 4px 0 8px;
  }
}

.day-cell {
  position: relative;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-height: 90px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    min-height: 70px;
    border-radius: 10px;
  }

  .day-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: 14px;
    background: color-mix(in srgb, var(--os-text) 2%, transparent);
    border: 1px solid color-mix(in srgb, var(--os-border-color) 20%, transparent);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    @media (max-width: 768px) {
      padding: 6px;
      border-radius: 10px;
    }
  }

  .day-number {
    font-size: 1.1rem;
    font-weight: 600;
    align-self: flex-end;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 0.95rem;
    }
  }

  .event-dots {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: auto;
    padding-top: 8px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--os-primary-color, #3b82f6);
      box-shadow: 0 0 6px color-mix(in srgb, var(--os-primary-color) 60%, transparent);

      &.predefined {
        background: #f59e0b;
        box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
      }
    }

    .dot-more {
      font-size: 0.6rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--os-text) 60%, transparent);
      line-height: 6px;
      margin-left: 2px;
    }
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    z-index: 2;

    .day-content {
      background: color-mix(in srgb, var(--os-text) 5%, transparent);
      border-color: color-mix(in srgb, var(--os-border-color) 50%, transparent);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  }

  &.not-current-month {
    opacity: 0.3;
    pointer-events: none;
    .day-content {
      background: transparent;
      border-color: transparent;
    }
  }

  &.is-today {
    .day-content {
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--os-primary-color) 20%, transparent),
        color-mix(in srgb, var(--os-primary-color) 5%, transparent)
      );
      border-color: color-mix(in srgb, var(--os-primary-color) 40%, transparent);
      box-shadow: 0 4px 20px color-mix(in srgb, var(--os-primary-color) 15%, transparent);
    }
    .day-number {
      color: var(--os-primary-color);
      font-weight: 800;
      font-size: 1.25rem;
    }
  }
}

.event-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.event-modal {
  background: color-mix(in srgb, var(--os-window-bg) 85%, transparent);
  border: 1px solid color-mix(in srgb, var(--os-border-color) 50%, transparent);
  padding: 24px;
  border-radius: 20px;
  width: 90%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px color-mix(in srgb, var(--os-border-color) 20%, transparent) inset;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      gap: 4px;

      span {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--os-primary-color);
      }
    }

    .close-icon-btn {
      background: color-mix(in srgb, var(--os-text) 5%, transparent);
      border: none;
      color: var(--os-text);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: color-mix(in srgb, var(--os-text) 15%, transparent);
        transform: rotate(90deg);
      }
    }
  }

  .existing-events {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 250px;
    overflow-y: auto;
    padding-right: 4px;

    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, var(--os-text) 20%, transparent);
      border-radius: 2px;
    }

    .no-events {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 0;
      color: color-mix(in srgb, var(--os-text) 40%, transparent);
      gap: 12px;

      .no-events-icon {
        font-size: 3rem;
        opacity: 0.5;
      }

      p {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 500;
      }
    }

    .existing-event {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: color-mix(in srgb, var(--os-text) 3%, transparent);
      border: 1px solid color-mix(in srgb, var(--os-border-color) 30%, transparent);
      padding: 12px 16px;
      border-radius: 12px;
      transition: transform 0.2s;

      &:hover {
        transform: translateX(4px);
        background: color-mix(in srgb, var(--os-text) 6%, transparent);
      }

      .event-info {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        font-size: 0.95rem;

        .event-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--os-primary-color);
          box-shadow: 0 0 8px color-mix(in srgb, var(--os-primary-color) 50%, transparent);

          &.predefined {
            background: #f59e0b;
            box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
          }
        }
      }

      .delete-btn {
        background: transparent;
        border: none;
        color: #ef4444;
        cursor: pointer;
        padding: 6px;
        display: flex;
        align-items: center;
        border-radius: 8px;
        opacity: 0.7;
        transition: all 0.2s;

        &:hover {
          opacity: 1;
          background: rgba(239, 68, 68, 0.15);
        }
      }
    }
  }

  .add-event-form {
    display: flex;
    gap: 8px;
    margin-top: 4px;

    input {
      flex: 1;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid color-mix(in srgb, var(--os-border-color) 40%, transparent);
      background: color-mix(in srgb, var(--os-text) 5%, transparent);
      color: var(--os-text);
      font-family: inherit;
      font-size: 0.95rem;
      outline: none;
      transition: all 0.2s;

      &:focus {
        background: color-mix(in srgb, var(--os-text) 8%, transparent);
        border-color: var(--os-primary-color);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--os-primary-color) 20%, transparent);
      }

      &::placeholder {
        color: color-mix(in srgb, var(--os-text) 40%, transparent);
      }
    }

    .primary-btn {
      padding: 0 20px;
      border-radius: 12px;
      border: none;
      background: var(--os-primary-color);
      color: #fff;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px color-mix(in srgb, var(--os-primary-color) 40%, transparent);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;

  .event-modal {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .event-modal {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
}
</style>
