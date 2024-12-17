import commands from '@/public/jsons/commands.json';

export const useCommands = () => {
    const executeCommands = (command: string) => {
        const cmd = command.toLowerCase().split(' ')[0];
  
        if (cmd == 'whoami' || cmd == 'who am i' || cmd == 'who') {
            const ageInMilliseconds = Date.now() - new Date("2005-12-25").getTime();
            const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
            return `Hello, Roland vagyok, ${ageInYears} éves, a DE-IK-ra járok.`;
        }
    
        if (cmd == 'date' || cmd == 'time' || cmd == 'now') {
            return 'A mai dátum: ' + new Date().toLocaleDateString();
        }
    
        if (cmd == 'help' || cmd == 'info') {
            const hour = new Date().getHours();
            const formattedHours = hour < 10 ? '0' + hour : hour;
            const minutes = new Date().getMinutes();
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const hours = formattedHours + ':' + formattedMinutes;
            return `Üdv itt! Jelenleg ${hours} óra van.`;
        }
    
        if (cmd == 'commands' || cmd == 'command' || cmd == 'parancsok' || cmd == 'parancs' || cmd == 'cmds' || cmd == 'cmd') {
            const commandList = commands.commands.map((command) => `<li>${command}</li>`).join('');
            const commandHtml = `<ul style="margin-left: 30px;">${commandList}</ul>`;
            return `A parancsok: ` + commandHtml;
        }
    
        if (cmd == 'skills') {
            window.open('https://credly.com/users/roland-ranyak/badges');
            return 'Vue, Nuxt, Nodejs, Python, C++, JavaScript, Java';
        }
    
        if (cmd == 'christmascounter' || cmd == 'christmas' || cmd == 'cc') {
            return `${new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime() > 0 ? 'Még ' + Math.floor((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)) + ' hónap ' + Math.floor(((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)) + ' nap ' + Math.floor(((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + ' óra ' + Math.floor(((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) % (1000 * 60 * 60)) / (1000 * 60)) + ' perc ' + Math.floor(((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) % (1000 * 60)) / 1000) + ' másodperc van karácsonyig!' : 'Már nincs karácsonyig! :('}`;
        }
    
        if (cmd == 'facebook' || cmd == 'fb' || cmd == 'fbprofile' || cmd == 'facebookprofile') {
            window.open('https://www.facebook.com/profile.php?id=100007575887372');
            return 'Megnyílt a Facebook profilom.';
        }
    
        if (cmd == 'github' || cmd == 'githubprofile' || cmd == 'gh') {
            window.open('https://github.com/rol2005hun');
            return 'Megnyílt a GitHub profilom.';
        }
    
        if (cmd == 'email' || cmd == 'mail' || cmd == 'e-mail' || cmd == 'e-mailcim') {
            window.open('mailto:contact@ranzak.site');
            return 'Megnyílt az e-mail címem.';
        }
    
        if (cmd == 'discord' || cmd == 'discordserver' || cmd == 'ds' || cmd == 'dc' || cmd == 'dsi') {
            window.open('https://discord.gg/FqdMuyhdTC');
            return 'Megnyílt a Discord szerverem.';
        }
    
        if (cmd == 'login' || cmd == 'bejelentkezes' || cmd == 'sudo' || cmd == 'su') {
            const username = command.split(' ')[1];
            if (!username) return 'Helyes használat: login [username]';
            document.cookie = `username=${username}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/`;
            return `Bejelentkezve mint: ${username}`;
        }
    
        if (cmd == 'logout') {
            document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            return 'Sikeresen kijelentkeztél!';
        }
    
        if (cmd == 'clear' || cmd == 'cls') {
            const outputs = document.getElementsByClassName('output') as HTMLCollectionOf<HTMLDivElement>;
            for (let i = outputs.length - 1; i >= 0; i--) {
                outputs[i].remove();
            }
            return '';
        }

        if(cmd == 'start' || cmd == 'play' || cmd == 'resume' || cmd == 'continue' || cmd == 'playback' || cmd == 'stop' || cmd == 'pause') {
            function play(element: HTMLElement) {
                if(element.classList.contains('fa-play')) {
                    useMusicPlayer().togglePlayback(false);
                    return `Zene elindítva.`;
                } else {
                    useMusicPlayer().togglePlayback(false);
                    return `Zene megállítva.`;
                }
            }

            const element = document.getElementById('playback') as HTMLElement;
            if (!element) {
                useDesktop().openApp('musicplayer');
                setTimeout(() => {
                    const elementAfterDelay = document.getElementById('playback') as HTMLElement;
                    if (elementAfterDelay) {
                        return play(elementAfterDelay);
                    } else {
                        return `Nem található a Zenelejátszó app!`;
                    }
                }, 1000);
                return `Zene elindítva.`;
            } else {
                return play(element);
            }
        }
    
        if(cmd == 'next' || cmd == 'skip') {
            const element = document.getElementById('next') as HTMLElement;
            if (!element) {
                return `Nem található a Zenelejátszó app!`;
            }

            useMusicPlayer().nextTrack();
            return `Átváltottál a következő számra.`;
        }
    
        if(cmd == 'previous' || cmd == 'prev') {
            const element = document.getElementById('next') as HTMLElement;
            if (!element) {
                return `Nem található a Zenelejátszó app!`;
            }

            useMusicPlayer().prevTrack();
            return `Átváltottál az előző számra.`;
        }
    
        if(cmd == 'volume' || cmd == 'vol' || cmd == 'setvolume' || cmd == 'setvol') {
            const value = command.split(' ')[1];
            if(!value) return 'Helyes használat: volume [value] (value: szám [0, 100])';
            const volume = parseInt(value);
            if(isNaN(volume)) return 'A megadott érték nem szám.';
            if(volume < 0 || volume > 100) return 'A megadott értéknek 0 és 100 között kell lennie.';
            useMusicPlayer().setVolume(volume);
            return `Állítottál a hangerőn.`;
        }

        if (cmd == 'open') {
            const app = command.split(' ')[1];
            if (!app) return 'Helyes használat: open [app] (app: about, terminal, musicplayer, browser, sysinfo, settings)';
            switch (app) {
                case 'about':
                    useDesktop().openApp('about');
                    return 'Megnyitottad a Rólam appot.';
                case 'terminal':
                    useDesktop().openApp('terminal');
                    return 'Megnyitottad a Terminál appot.';
                case 'musicplayer':
                    useDesktop().openApp('musicplayer');
                    return 'Megnyitottad a Zenelejátszó appot.';
                case 'browser':
                    useDesktop().openApp('browser');
                    return 'Megnyitottad a Böngésző appot.';
                case 'sysinfo':
                    useDesktop().openApp('sysinfo');
                    return 'Megnyitottad a Rendszerinformáció appot.';
                case 'settings':
                    useDesktop().openApp('settings');
                    return 'Megnyitottad a Beállítások appot.';
                default:
                    return 'Nincs ilyen app!';
            }
        }

        if(cmd == 'close') {
            const app = command.split(' ')[1];
            if (!app) return 'Helyes használat: close [app] (app: about, terminal, musicplayer, browser, sysinfo, settings)';

            switch (app) {
                case 'about':
                    useDesktop().closeApp('about');
                    return 'Bezártad a Rólam appot.';
                case 'terminal':
                    useDesktop().closeApp('terminal');
                    return 'Bezártad a Terminál appot.';
                case 'musicplayer':
                    useDesktop().closeApp('musicplayer');
                    return 'Bezártad a Zenelejátszó appot.';
                case 'browser':
                    useDesktop().closeApp('browser');
                    return 'Bezártad a Böngésző appot.';
                case 'sysinfo':
                    useDesktop().closeApp('sysinfo');
                    return 'Bezártad a Rendszerinformáció appot.';
                case 'settings':
                    useDesktop().closeApp('settings');
                    return 'Bezártad a Beállítások appot.';
                default:
                    return 'Nincs ilyen app!';
            }
        }

        if(cmd == 'exit') {
            useDesktop().closeApp('terminal');
            return 'Kiléptél a terminálból.';
        }
  
        return `Nincs ilyen parancs! Próbáld meg a 'help' parancsot!`;
    };
  
    return { executeCommands };
};  