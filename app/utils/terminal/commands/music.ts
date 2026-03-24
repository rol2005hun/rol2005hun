import { type TerminalContext } from '../types';
import { useMusicStore } from '@/stores/features/os/useMusicStore';

export const musicCommand = {
  name: 'music',
  descriptionKey: 'os.apps.terminal.commands.music.usage',
  execute: async (args: string[], { print, t }: TerminalContext) => {
    const musicStore = useMusicStore();

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
        musicStore.nextTrack();
        print(t('os.apps.terminal.commands.music.next'));
        break;
      case 'prev':
      case 'previous':
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
