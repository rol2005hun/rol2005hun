import { type TerminalContext } from '../types';
import { useMusicStore } from '@/stores/features/os/useMusicStore';
import { useWindowStore } from '@/stores/features/os/useWindowStore';
import { useAppRegistry } from '@/stores/features/os/useAppRegistry';

export const musicCommand = {
  name: 'music',
  descriptionKey: 'os.apps.terminal.commands.music.usage',
  execute: async (args: string[], { print, t }: TerminalContext) => {
    const musicStore = useMusicStore();
    const windowStore = useWindowStore();

    const ensureAppOpen = () => {
      const isMusicOpen = windowStore.windows.some((w) => w.appId === 'music');
      if (!isMusicOpen) {
        const registry = useAppRegistry();
        const app = registry.getAppById('music');
        if (app) {
          windowStore.openWindow({
            id: `${app.id}-${Date.now()}`,
            appId: app.id,
            titleKey: app.nameKey,
            width: app.defaultWidth || 850,
            height: app.defaultHeight || 600
          });
        }
      }
    };

    if (args.length === 0) {
      if (musicStore.currentTrack) {
        const title = musicStore.currentTrack.title;
        const artist = musicStore.currentTrack.artist || 'Unknown';
        const status = musicStore.isPlaying
          ? t('os.apps.terminal.commands.music.statusPlaying')
          : t('os.apps.terminal.commands.music.statusPaused');
        print(t('os.apps.terminal.commands.music.nowPlaying', { title, artist, status }));
      } else {
        print(t('os.apps.terminal.commands.music.noTrack'));
      }
      print(t('os.apps.terminal.commands.music.usage'));
      return;
    }

    const action = (args[0] || '').toLowerCase();

    switch (action) {
      case 'start':
      case 'resume':
      case 'play':
        ensureAppOpen();
        if (musicStore.isPlaying) {
          print(t('os.apps.terminal.commands.music.alreadyPlaying'));
        } else {
          musicStore.togglePlay();
          print(t('os.apps.terminal.commands.music.started'));
        }
        break;
      case 'pause':
      case 'stop':
        if (!musicStore.isPlaying) {
          print(t('os.apps.terminal.commands.music.alreadyPaused'));
        } else {
          musicStore.togglePlay();
          print(t('os.apps.terminal.commands.music.paused'));
        }
        break;
      case 'next':
        ensureAppOpen();
        musicStore.nextTrack();
        print(t('os.apps.terminal.commands.music.next'));
        break;
      case 'prev':
      case 'previous':
        ensureAppOpen();
        musicStore.prevTrack();
        print(t('os.apps.terminal.commands.music.prev'));
        break;
      case 'vol':
      case 'volume':
        if (args.length < 2) {
          const vol = Math.round(musicStore.volume * 100);
          print(t('os.apps.terminal.commands.music.currentVol', { vol }));
        } else {
          const vol = parseInt(args[1] || '0', 10);
          if (isNaN(vol) || vol < 0 || vol > 100) {
            print(t('os.apps.terminal.commands.music.volError'));
          } else {
            musicStore.volume = vol / 100;
            print(t('os.apps.terminal.commands.music.volSet', { vol }));
          }
        }
        break;
      default:
        print(t('os.apps.terminal.commands.music.unknownAction', { action }));
        print(t('os.apps.terminal.commands.music.usage'));
        break;
    }
  }
};
