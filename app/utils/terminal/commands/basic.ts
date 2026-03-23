import type { TerminalCommand } from '../types';
import { getAllCommands } from '../registry';

export const helpCommand: TerminalCommand = {
  name: 'commands',
  aliases: ['help', 'cmds', 'cmd'],
  execute: (args, context) => {
    const allCmds = getAllCommands();
    const available = allCmds.filter((c) => !c.requiresRoot || context.isRoot());

    let out = context.t('os.apps.terminal.commands.availableCommands') + '\n';
    available.forEach((c) => {
      out += `  ${c.name.padEnd(12)} ${c.requiresRoot ? '[root] ' : ''}${c.aliases ? context.t('os.apps.terminal.commands.aliases', { aliases: c.aliases.join(', ') }) : ''}\n`;
    });
    context.print(out);
  }
};

export const clearCommand: TerminalCommand = {
  name: 'clear',
  aliases: ['cls'],
  execute: (args, context) => {
    context.clear();
  }
};

export const dateCommand: TerminalCommand = {
  name: 'date',
  aliases: ['time', 'now'],
  execute: (args, context) => {
    const dateStr = new Date().toLocaleDateString();
    context.print(context.t('os.apps.terminal.commands.dateText', { date: dateStr }));
  }
};

export const echoCommand: TerminalCommand = {
  name: 'echo',
  execute: (args, context) => {
    context.print(args.join(' '));
  }
};

export const versionCommand: TerminalCommand = {
  name: 'version',
  execute: (args, context) => {
    context.print(context.t('os.apps.terminal.commands.version'));
  }
};

export const whoamiCommand: TerminalCommand = {
  name: 'whoami',
  aliases: ['who', 'who am i'],
  execute: (args, context) => {
    const ageInMilliseconds = Date.now() - new Date('2005-12-25').getTime();
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    context.print(
      context.t('os.apps.terminal.commands.whoamiText', { age: ageInYears.toString() })
    );
  }
};

export const facebookCommand: TerminalCommand = {
  name: 'facebook',
  aliases: ['fb', 'fbprofile', 'facebookprofile'],
  execute: (args, context) => {
    window.open('https://www.facebook.com/profile.php?id=100007575887372', '_blank');
    context.print(context.t('os.apps.terminal.commands.facebookOpened'));
  }
};

export const githubCommand: TerminalCommand = {
  name: 'github',
  aliases: ['githubprofile', 'gh'],
  execute: (args, context) => {
    window.open('https://github.com/rol2005hun', '_blank');
    context.print(context.t('os.apps.terminal.commands.githubOpened'));
  }
};

export const linkedInCommand: TerminalCommand = {
  name: 'linkedin',
  aliases: ['linkedInprofile', 'li'],
  execute: (args, context) => {
    window.open('https://www.linkedin.com/in/roland-adalbert-rany%C3%A1k-9a2726373/', '_blank');
    context.print(context.t('os.apps.terminal.commands.linkedInOpened'));
  }
};

export const emailCommand: TerminalCommand = {
  name: 'email',
  aliases: ['mail', 'e-mail', 'e-mailcim'],
  execute: (args, context) => {
    window.open('mailto:contact@ranzak.site', '_blank');
    context.print(context.t('os.apps.terminal.commands.emailOpened'));
  }
};

export const discordCommand: TerminalCommand = {
  name: 'discord',
  aliases: ['discordserver', 'ds', 'dc', 'dsi'],
  execute: (args, context) => {
    window.open('https://discord.gg/FqdMuyhdTC', '_blank');
    context.print(context.t('os.apps.terminal.commands.discordOpened'));
  }
};

export const randomCommand: TerminalCommand = {
  name: 'random',
  aliases: ['rand'],
  execute: (args, context) => {
    if (args.length < 2) {
      context.print(context.t('os.apps.terminal.commands.randomUsage'));
      return;
    }
    const min = parseInt(args[0]!);
    const max = parseInt(args[1]!);

    if (isNaN(min) || isNaN(max)) {
      context.print(context.t('os.apps.terminal.commands.randomErrorNumber'));
      return;
    }
    if (min > max) {
      context.print(context.t('os.apps.terminal.commands.randomErrorMinMax'));
      return;
    }
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    context.print(
      context.t('os.apps.terminal.commands.randomResult', {
        min: min.toString(),
        max: max.toString(),
        result: rand.toString()
      })
    );
  }
};

const _terminalStartTime = Date.now();

export const uptimeCommand: TerminalCommand = {
  name: 'uptime',
  execute: (args, context) => {
    const diff = Date.now() - _terminalStartTime;
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    context.print(
      context.t('os.apps.terminal.commands.uptimeResult', {
        hours: hours.toString(),
        minutes: minutes.toString(),
        seconds: seconds.toString()
      })
    );
  }
};

export const asciiCommand: TerminalCommand = {
  name: 'ascii',
  execute: async (args, context) => {
    const text = args.join(' ').trim();
    if (!text) {
      context.print(context.t('os.apps.terminal.commands.asciiUsage'));
      return;
    }
    try {
      const response = await fetch(`https://api.zjm.im/ascii/?text=${encodeURIComponent(text)}`);
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      context.print(data.ascii || context.t('os.apps.terminal.commands.asciiError'));
    } catch {
      context.print(context.t('os.apps.terminal.commands.asciiError'));
    }
  }
};

export const jokeCommand: TerminalCommand = {
  name: 'joke',
  execute: async (args, context) => {
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Any');
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      if (data.type === 'single') {
        context.print(data.joke);
      } else if (data.type === 'twopart') {
        context.print(`${data.setup}\n${data.delivery}`);
      } else {
        context.print(context.t('os.apps.terminal.commands.jokeError'));
      }
    } catch {
      context.print(context.t('os.apps.terminal.commands.jokeError'));
    }
  }
};

export const weatherCommand: TerminalCommand = {
  name: 'weather',
  aliases: ['weatherin', 'wthr'],
  execute: async (args, context) => {
    const city = args.join(' ').trim();
    if (!city) {
      context.print(context.t('os.apps.terminal.commands.weatherUsage'));
      return;
    }

    try {
      const geomRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=hu`
      );
      if (!geomRes.ok) throw new Error('Geocoding fetch failed');
      const geodata = await geomRes.json();

      if (!geodata.results || geodata.results.length === 0) {
        context.print(context.t('os.apps.terminal.commands.weatherNotFound'));
        return;
      }

      const { latitude, longitude, name, country } = geodata.results[0];
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
      );
      if (!weatherRes.ok) throw new Error('Weather fetch failed');
      const weatherData = await weatherRes.json();

      const { temperature, weathercode } = weatherData.current_weather;

      const weatherDescription =
        context.t('os.apps.terminal.commands.weatherCodes.' + weathercode) ||
        context.t('os.apps.terminal.commands.weatherCodes.unknown');
      context.print(
        context.t('os.apps.terminal.commands.weatherResult', {
          name,
          country,
          temp: temperature.toString(),
          desc: weatherDescription
        })
      );
    } catch {
      context.print(context.t('os.apps.terminal.commands.weatherError'));
    }
  }
};

export const skillsCommand: TerminalCommand = {
  name: 'skills',
  aliases: ['badges', 'credentials'],
  execute: (args, context) => {
    window.open('https://credly.com/users/roland-ranyak/badges', '_blank');
    context.print(context.t('os.apps.terminal.commands.skillsProfileOpened'));
  }
};

export const christmascounterCommand: TerminalCommand = {
  name: 'christmascounter',
  aliases: ['christmas', 'cc', 'xmas'],
  execute: (args, context) => {
    const now = new Date();
    const xmas = new Date(now.getFullYear(), 11, 25);
    if (now > xmas) xmas.setFullYear(xmas.getFullYear() + 1);

    const diff = xmas.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    context.print(
      context.t('os.apps.terminal.commands.christmasCounterInfo', {
        days: days.toString(),
        hours: hours.toString(),
        minutes: minutes.toString(),
        seconds: seconds.toString()
      })
    );
  }
};
