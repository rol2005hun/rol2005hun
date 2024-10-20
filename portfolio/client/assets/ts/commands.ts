function executeCommands(command: string) {
    const cmd = command.toLowerCase().split(' ')[0];

    if(cmd == 'whoami' || cmd == 'who am i' || cmd == 'who') {
        const ageInMilliseconds = Date.now() - new Date("2005-12-25").getTime();
        const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
        return `Hello, Roland vagyok, ${ageInYears} éves, a DE-IK-ra járok.`;
    }

    if(cmd == 'date' || cmd == 'time' || cmd == 'now') {
        return 'A mai dátum: ' + new Date().toLocaleDateString();
    }

    if(cmd == 'help' || cmd == 'info') {
        return `Üdv itt! Ha zavar a hóesés vagy a zenelejátszó útban van, jobb klikk a képernyőre, és kapcsold ki, vagy használd a terminált hozzá.`;
    }

    if(cmd == 'commands' || cmd == 'command' || cmd == 'parancsok' || cmd == 'parancs' || cmd == 'cmds' || cmd == 'cmd') {
        return `A parancsok: <ul style="margin-left: 20px;"><li>whoami</li><li>date</li><li>skills</li><li>help</li><li>commands</li>
        <li>github</li><li>facebook</li><li>discord</li><li>email</li><li>christmascounter</li><li>login [username]</li><li>logout</li>
        <li>start</li><li>stop</li><li>next</li><li>previous</li><li>volume [érték]</li><li>togglesnow</li><li>togglemusicplayer</li><li>switch [page]</li></ul>`
    }

    if(cmd == 'skills') {
        window.open('https://credly.com/users/roland-ranyak/badges')
        return 'Vue, Nuxt, Nodejs, Python, C++, JavaScript, Java';
    }
    
    if(cmd == 'christmascounter' || cmd == 'christmas' || cmd == 'cc') {
        return `${new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime() > 0 ? 'Még ' + Math.floor((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)) + ' hónap ' + Math.floor(((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)) + ' nap ' + Math.floor(((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + ' óra ' + Math.floor(((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) % (1000 * 60 * 60)) / (1000 * 60)) + ' perc ' + Math.floor(((new Date('December 25, 2024 00:00:00').getTime() - new Date().getTime()) % (1000 * 60)) / 1000) + ' másodperc van karácsonyig!' : 'Már nincs karácsonyig! :('}`;
    }

    if(cmd == 'facebook' || cmd == 'fb' || cmd == 'fbprofile' || cmd == 'facebookprofile') {
        window.open('https://www.facebook.com/profile.php?id=100007575887372')
        return 'Megnyílt a Facebook profilom.';
    }

    if(cmd == 'github' || cmd == 'githubprofile' || cmd == 'gh') {
        window.open('https://github.com/rol2005hun');
        return 'Megnyílt a GitHub profilom.';
    }

    if(cmd == 'email' || cmd == 'mail' || cmd == 'e-mail' || cmd == 'e-mailcim') {
        window.open('mailto:contact@ranzak.me');
        return 'Megnyílt az e-mail címem.';
    }

    if(cmd == 'discord' || cmd == 'discordserver' || cmd == 'ds' || cmd == 'dc' || cmd == 'dsi') {
        window.open('https://discord.gg/FqdMuyhdTC');
        return 'Megnyílt a Discord szerverem.';
    }

    if(cmd == 'login' || cmd == 'bejelentkezes' || cmd == 'sudo' || cmd == 'su') {
        const username = command.split(' ')[1];
        if(!username) return 'Helyes használat: login [username]';
        document.cookie = `username=${username}; expires=Thu, 18 Dec 2029 12:00:00 UTC; path=/`;
        return `Bejelentkezve mint: ${username}`;
    }

    if(cmd == 'logout') {
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        return 'Sikeresen kijelentkeztél!';
    }

    if(cmd == 'start' || cmd == 'play' || cmd == 'resume' || cmd == 'continue' || cmd == 'playback' || cmd == 'stop' || cmd == 'pause') {
        const element = document.getElementById('playback') as HTMLElement;
        if(element.classList.contains('fa-play')) {
            togglePlayback(false);
            return `Zene elindítva.`;
        } else {
            togglePlayback(false);
            return `Zene megállítva.`;
        }
    }

    if(cmd == 'next' || cmd == 'skip') {
        nextTrack();
        return `Átváltottál a következő számra.`;
    }

    if(cmd == 'previous' || cmd == 'prev') {
        prevTrack();
        return `Átváltottál az előző számra.`;
    }

    if(cmd == 'volume' || cmd == 'vol') {
        const value = command.split(' ')[1];
        if(!value) return 'Helyes használat: volume [value] (value: szám [0, 100])';
        const volume = parseInt(value);
        if(isNaN(volume)) return 'A megadott érték nem szám.';
        if(volume < 0 || volume > 100) return 'A megadott értéknek 0 és 100 között kell lennie.';
        setVolume(volume);
        return `Állítottál a hangerőn.`;
    }

    const { showSnow } = useChristmasUtils();
    if(cmd == 'togglesnow' || cmd =='tsnow' || cmd == 'snow') {
        showSnow.value = !showSnow.value;
        return `Hó ${showSnow.value ? 'megjelenítve.' : 'elrejtve.'}`;
    }

    const { showPlayer } = useAudioUtils();
    if(cmd == 'togglemusicplayer' || cmd == 'toggleplayer' || cmd == 'togglemp' || cmd == 'tmp') {
        showPlayer.value = !showPlayer.value;
        return `A zenelejátszó ${showPlayer.value ? 'megjelenítve.' : 'elrejtve.'}`;
    
    }

    if(cmd == 'clear' || cmd == 'cls') {
        const outputs = document.getElementsByClassName('output') as HTMLCollectionOf<HTMLDivElement>;
        for (let i = outputs.length - 1; i >= 0; i--) {
            outputs[i].remove();
        }
        return '';
    }

    if(cmd == 'switch') {
        const page = command.split(' ')[1];
        if(!page) return 'Helyes használat: switch [page] (page: home, about, projects)';
        console.log(page)
        switch(page) {
            case 'home':
                return 'Már a kezdőoldalon vagy!';
            case 'about':
                return navigateTo('/about');
            case 'projects':
                return navigateTo('/projects');
            default:
                return 'Nincs ilyen oldal!';
        }
    }

    return `Nincs ilyen parancs! Próbáld meg a 'help' parancsot!`;
}

export default executeCommands;