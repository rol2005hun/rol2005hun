import { defineStore } from 'pinia';
import { useCookie } from '#imports';
import { computed, ref, watch } from 'vue';
import { useLanguageStore } from '@/stores/features/os/useLanguageStore';

export interface CalendarEvent {
  id: string;
  dateStr: string;
  title: string;
  startTime?: string;
  endTime?: string;
  isPredefined?: boolean;
}

export const useCalendarStore = defineStore('calendar', () => {
  const languageStore = useLanguageStore();

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

  const predefinedEvents = ref<CalendarEvent[]>([]);

  interface NagerHoliday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    counties: string[] | null;
    launchYear: number | null;
    types: string[];
  }

  const fetchHolidays = async (year: number, lang: string): Promise<CalendarEvent[]> => {
    const countryCode = lang === 'hu' ? 'HU' : lang === 'ro' ? 'RO' : 'US';
    try {
      const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`);
      if (res.ok) {
        const data: NagerHoliday[] = await res.json();
        return data.map((d) => ({
          id: `hol-${d.date}-${countryCode}-${d.localName}`,
          dateStr: d.date,
          title: d.localName || d.name,
          isPredefined: true
        }));
      }
    } catch (e) {
      console.error('Failed to fetch holidays', e);
    }
    return [];
  };

  const loadHolidays = async () => {
    const currentYear = new Date().getFullYear();
    const lang = languageStore.currentLanguage;

    const [prev, curr, next] = await Promise.all([
      fetchHolidays(currentYear - 1, lang),
      fetchHolidays(currentYear, lang),
      fetchHolidays(currentYear + 1, lang)
    ]);

    predefinedEvents.value = [...prev, ...curr, ...next];
  };

  watch(
    () => languageStore.currentLanguage,
    () => {
      loadHolidays();
    },
    { immediate: true }
  );

  const allEvents = computed(() => {
    return [...predefinedEvents.value, ...(customEvents.value || [])];
  });

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return allEvents.value.filter((e) => e.dateStr === dateStr);
  };

  const addEvent = (date: Date, title: string, startTime?: string, endTime?: string) => {
    if (!customEvents.value) customEvents.value = [];
    customEvents.value.push({
      id: `evt-${Date.now()}`,
      dateStr: formatDate(date),
      title,
      startTime,
      endTime,
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
