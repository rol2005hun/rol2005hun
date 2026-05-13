import { defineStore } from 'pinia';
import { useCookie } from '#imports';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export interface CalendarEvent {
  id: string;
  dateStr: string;
  title: string;
  isPredefined?: boolean;
}

export const useCalendarStore = defineStore('calendar', () => {
  const { t } = useI18n();

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const customEvents = useCookie<CalendarEvent[]>('os_calendar_events', {
    default: () => [],
    maxAge: 365 * 24 * 60 * 60
  });

  const getPredefinedEvents = (year: number): CalendarEvent[] => {
    const events: CalendarEvent[] = [
      { id: `ny-${year}`, dateStr: `${year}-01-01`, title: 'Újév', isPredefined: true },
      { id: `mar15-${year}`, dateStr: `${year}-03-15`, title: 'Nemzeti ünnep', isPredefined: true },
      { id: `may1-${year}`, dateStr: `${year}-05-01`, title: 'Munka ünnepe', isPredefined: true },
      { id: `aug20-${year}`, dateStr: `${year}-08-20`, title: 'Államalapítás', isPredefined: true },
      { id: `oct23-${year}`, dateStr: `${year}-10-23`, title: 'Forradalom', isPredefined: true },
      { id: `nov1-${year}`, dateStr: `${year}-11-01`, title: 'Mindenszentek', isPredefined: true },
      { id: `dec25-${year}`, dateStr: `${year}-12-25`, title: 'Karácsony', isPredefined: true },
      {
        id: `dec26-${year}`,
        dateStr: `${year}-12-26`,
        title: 'Karácsony 2. napja',
        isPredefined: true
      }
    ];

    const firstOfMay = new Date(year, 4, 1);
    const dayOfWeek = firstOfMay.getDay();
    const firstSundayOffset = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const mothersDay = new Date(year, 4, 1 + firstSundayOffset);
    events.push({
      id: `mothersday-${year}`,
      dateStr: formatDate(mothersDay),
      title: 'Anyák napja',
      isPredefined: true
    });

    return events;
  };

  const allEvents = computed(() => {
    const currentYear = new Date().getFullYear();
    const predefinedKeys = [
      ...getPredefinedEvents(currentYear - 1),
      ...getPredefinedEvents(currentYear),
      ...getPredefinedEvents(currentYear + 1)
    ];
    return [...predefinedKeys, ...(customEvents.value || [])];
  });

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return allEvents.value.filter((e) => e.dateStr === dateStr);
  };

  const addEvent = (date: Date, title: string) => {
    if (!customEvents.value) customEvents.value = [];
    customEvents.value.push({
      id: `evt-${Date.now()}`,
      dateStr: formatDate(date),
      title,
      isPredefined: false
    });
  };

  const deleteEvent = (id: string) => {
    if (!customEvents.value) return;
    customEvents.value = customEvents.value.filter((e) => e.id !== id);
  };

  return {
    customEvents,
    allEvents,
    getEventsForDate,
    addEvent,
    deleteEvent,
    formatDate
  };
});
