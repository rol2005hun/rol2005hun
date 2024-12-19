import AppsAbout from '@/components/apps/About.vue';
import AppsTerminal from '@/components/apps/Terminal.vue';
import AppsMusicPlayer from '@/components/apps/MusicPlayer.vue';
import AppsWolimbySearch from '@/components/apps/WolimbySearch.vue';
import SystemInfo from '@/components/apps/SystemInfo.vue';
import Settings from '@/components/apps/Settings.vue';
import Changelog from '@/components/apps/Changelog.vue';
import Chat from '@/components/apps/Chat.vue';

let zIndexCounter = 1000;

export function useDesktop() {
    const apps = ref([
        { id: 'about', name: 'Rólam', icon: '📂', desktopIcon: true, component: markRaw(AppsAbout) },
        { id: 'terminal', name: 'Terminal', icon: '💻', desktopIcon: true, component: markRaw(AppsTerminal) },
        { id: 'musicplayer', name: 'Zene', icon: '🎵', desktopIcon: true, component: markRaw(AppsMusicPlayer) },
        { id: 'browser', name: 'Wolimby Search', icon: '🌐', desktopIcon: true, component: markRaw(AppsWolimbySearch) },
        { id: 'sysinfo', name: 'ranzakOS v2 névjegye', icon: 'ℹ️', desktopIcon: false, component: markRaw(SystemInfo) },
        { id: 'settings', name: 'Beállítások', icon: '⚙️', desktopIcon: false, component: markRaw(Settings) },
        { id: 'changelog', name: 'Újdonságok', icon: '📝', desktopIcon: false, component: markRaw(Changelog) },
        { id: 'chat', name: 'Chat', icon: '💬', desktopIcon: true, component: markRaw(Chat) },
    ]);
    const currentApps = useCookie('currentApps', { default: () => [] }) as Ref<{ id: string, position: { top: number, left: number }, size: { width: number, height: number }, zIndex: number, minimized: boolean }[]>;
    const backgroundUrl = useCookie('backgroundUrl', { expires: new Date('3000-12-12') }) as Ref<string>;
    const isMenuVisible = ref(false);
    const hour = ref(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const date = ref(new Date().toLocaleDateString());
    const isSelecting = ref(false);
    const selectionStart = ref<{ x: number; y: number } | null>(null);
    const selectionEnd = ref<{ x: number; y: number } | null>(null);
    let selectedIcons = new Set<string>();

    if (!currentApps.value || !Array.isArray(currentApps.value)) {
        currentApps.value = [];
    }

    const selectionBoxStyles = computed(() => {
        if (!selectionStart.value || !selectionEnd.value) return {};
        const startX = Math.min(selectionStart.value.x, selectionEnd.value.x);
        const startY = Math.min(selectionStart.value.y, selectionEnd.value.y);
        const width = Math.abs(selectionEnd.value.x - selectionStart.value.x);
        const height = Math.abs(selectionEnd.value.y - selectionStart.value.y);

        return {
            left: `${startX}px`,
            top: `${startY}px`,
            width: `${width}px`,
            height: `${height}px`,
        };
    });

    const maximized = (appId: string): boolean => {
        const app = currentApps.value.find((app) => app.id === appId);
        if (!app) return false;
    
        const isWidthMax = app.size.width === 100;
        const isHeightMax = Math.abs(app.size.height - 93) > 0;
        return isWidthMax && isHeightMax;
    };

    const startSelection = (event: MouseEvent) => {
        if (event.button !== 0) return;
        const target = event.target as HTMLElement;
        if (target.closest('.window') || target.closest('.desktop-icons .app') || target.closest('.taskbar')) {
            return;
        }

        isSelecting.value = true;
        selectionStart.value = { x: event.clientX, y: event.clientY };
        selectionEnd.value = { x: event.clientX, y: event.clientY };
    };

    const updateSelection = (event: MouseEvent) => {
        if (!isSelecting.value || !selectionStart.value) return;
        selectionEnd.value = { x: event.clientX, y: event.clientY };

        const apps = document.querySelectorAll('.desktop-icons .app');
        apps.forEach((app) => {
            app.classList.remove('selected');
            const icon = app.querySelector('.icon');
            const name = app.querySelector('.name');
            if (icon) icon.classList.remove('selected');
            if (name) name.classList.remove('selected');
        });

        const selectionRect = {
            left: Math.min(selectionStart.value.x, selectionEnd.value.x),
            top: Math.min(selectionStart.value.y, selectionEnd.value.y),
            right: Math.max(selectionStart.value.x, selectionEnd.value.x),
            bottom: Math.max(selectionStart.value.y, selectionEnd.value.y),
        };

        apps.forEach((app) => {
            const rect = app.getBoundingClientRect();
            if (
                rect.left < selectionRect.right &&
                rect.right > selectionRect.left &&
                rect.top < selectionRect.bottom &&
                rect.bottom > selectionRect.top
            ) {
                app.classList.add('selected');
                const icon = app.querySelector('.icon');
                const name = app.querySelector('.name');
                if (icon) icon.classList.add('selected');
                if (name) name.classList.add('selected');
                selectedIcons.add(app.classList.value);
            }
        });
    };

    const endSelection = (event: MouseEvent) => {
        const clickedIcon = event.target as HTMLElement;
        const icons = document.querySelectorAll('.desktop-icons .app');

        if (!clickedIcon.classList.contains('selected')) {
            icons.forEach((icon) => {
                icon.classList.remove('selected');
                selectedIcons.clear();
            });
        }

        isSelecting.value = false;
        selectionStart.value = null;
        selectionEnd.value = null;
    };

    const handleOutsideClick = (event: MouseEvent) => {
        const startMenuElement = document.querySelector('.start-menu');
        const startButton = document.querySelector('.start-button');

        if (
            startMenuElement &&
            !startMenuElement.contains(event.target as Node) &&
            startButton &&
            !startButton.contains(event.target as Node)
        ) {
            isMenuVisible.value = false;
        }
    };

    const observeResize = (appId: string) => {
        if (appId === 'cookies') return;

        const appElement = document.querySelector(`.window.${appId}`) as HTMLElement;
    
        if (!appElement) return;
    
        let isResizing = false;
        let pendingSize: { width: number; height: number } | null = null;
    
        const onMouseDown = (event: MouseEvent) => {
            isResizing = true;
        };
    
        const onMouseUp = () => {
            if (isResizing) {
                isResizing = false;
    
                if (pendingSize) {
                    const appIndex = currentApps.value.findIndex((app) => app.id === appId);
                    currentApps.value[appIndex] = {
                        ...currentApps.value[appIndex],
                        size: {
                            width: (pendingSize.width / window.innerWidth) * 100.6,
                            height: (pendingSize.height / window.innerHeight) * 100.6,
                        },
                    };
                    pendingSize = null;
                }
            }
        };

        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
    
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (isResizing) {
                    pendingSize = {
                        width: entry.contentRect.width,
                        height: entry.contentRect.height,
                    };
                }
            }
        });
    
        observer.observe(appElement);
    };
    
    const openApp = (appId: string) => {
        if (appId !== 'cookies') {
            const selectedElements = document.querySelectorAll('.app.selected');

            selectedElements.forEach((element) => {
                const id = element.classList[0];
                if (id && id !== appId) {
                    const existingApp = currentApps.value.find((app) => app.id === id);
                    if (!existingApp) {
                        const newApp = { id, position: { top: 20, left: 125 }, size: { width: -1, height: -1 }, zIndex: zIndexCounter++, minimized: false };
                        currentApps.value.push(newApp);
                        nextTick(() => {
                            observeResize(id);
                        });
                    } else if (existingApp.minimized) {
                        restoreApp(id);
                    } else {
                        putToTop(existingApp);
                    }
                }
            });
        };

        const app = currentApps.value.find((app) => app.id === appId);
        if (!app) {
            const newApp = { id: appId, position: { top: 20, left: 125 }, size: { width: -1, height: -1 }, zIndex: zIndexCounter++, minimized: false };
            currentApps.value.push(newApp);
            nextTick(() => {
                observeResize(appId);
            });
        } else if (app.minimized) {
            restoreApp(appId);
        } else {
            putToTop(app);
        }
    };    

    const minimizeApp = (appId: string) => {
        const appIndex = currentApps.value.findIndex((app) => app.id === appId);
        if (appIndex !== -1) {
            const appElement = document.querySelector(`.window.${appId}`) as HTMLElement;
            appElement?.classList.add('minimized');
            setTimeout(() => {
                currentApps.value[appIndex] = { ...currentApps.value[appIndex], minimized: true };
            }, 500);
        }
    };

    const maximizeApp = (appId: string) => {
        const taskbarHeight = 70;
        const appIndex = currentApps.value.findIndex((app) => app.id === appId);
        const app = document.querySelector(`.window.${appId}`) as HTMLElement;
    
        if (appIndex !== -1) {
            currentApps.value[appIndex] = { ...currentApps.value[appIndex], position: { top: 0, left: 0 } };
        }
    
        if (!maximized(appId)) {
            if (!app) return;
            app.classList.add('maximized');
            setTimeout(() => {
                app.classList.remove('maximized');
                const maxHeight = window.innerHeight - taskbarHeight;
                currentApps.value[appIndex] = { ...currentApps.value[appIndex], size: { width: 100, height: (maxHeight / window.innerHeight) * 100 } };
            }, 500);
        } else {
            if (!app) return;
    
            app.classList.add('revert-maximized');
            setTimeout(() => {
                app.classList.remove('revert-maximized');
                currentApps.value[appIndex] = { ...currentApps.value[appIndex], size: { width: 50, height: 50 } };
            }, 500);
        }
    };

    const restoreApp = (appId: string) => {
        const appIndex = currentApps.value.findIndex((app) => app.id === appId);
        if (appIndex !== -1) {
            const appElement = document.querySelector(`.window.${appId}`) as HTMLElement;
            appElement?.classList.remove('minimized');
            appElement?.classList.add('restored');
            setTimeout(() => {
                appElement?.classList.remove('restored');
                currentApps.value[appIndex] = { ...currentApps.value[appIndex], minimized: false };
                putToTop(currentApps.value[appIndex]);
            }, 500);
        }
    };

    const closeApp = (appId: string) => {
        const appElement = document.querySelector(`.window.${appId}`) as HTMLElement;
        appElement?.classList.add('closed');
        setTimeout(() => {
            currentApps.value = currentApps.value.filter((app) => app.id !== appId);
        }, 500);
    };

    const startDrag = (app: { id: string, position: { top: number, left: number }, size: { width: number, height: number }, zIndex: number, minimized: boolean }, event: MouseEvent) => {
        const offset = {
            x: event.clientX - (app.position.left || 0),
            y: event.clientY - (app.position.top || 0),
        };

        const onDrag = (event: MouseEvent) => {
            let newTop = event.clientY - offset.y;
            let newLeft = event.clientX - offset.x;

            const windowElement = document.querySelector(`.window.${app.id}`) as HTMLElement;
            const headerElement = windowElement?.querySelector('.window-header') as HTMLElement;

            if (!windowElement || !headerElement) return;

            const headerHeight = headerElement.offsetHeight;
            const desktopWidth = window.innerWidth;
            const desktopHeight = window.innerHeight;
            const taskbarHeight = 70;
            const topBoundaryMargin = 42;
            const sideMargin = 45;

            newTop = Math.max(-headerHeight + topBoundaryMargin, Math.min(desktopHeight - taskbarHeight - headerHeight, newTop));
            newLeft = Math.max(-windowElement.offsetWidth + sideMargin, Math.min(desktopWidth - sideMargin, newLeft));

            app.position = { top: newTop, left: newLeft };

            const appIndex = currentApps.value.findIndex((a) => a.id === app.id);
            if (appIndex !== -1) {
                currentApps.value[appIndex] = { ...currentApps.value[appIndex], position: app.position };
            }
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
        };

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    const appName = (appId: string): string => {
        const app = apps.value.find((app) => app.id === appId);
        return app ? app.name : 'Ismeretlen alkalmazás';
    };

    const getComponent = (appId: string) => {
        const app = apps.value.find((app) => app.id === appId);
        return app ? app.component : null;
    }

    const putToTop = (app: { id: string; zIndex: number }) => {
        currentApps.value.forEach((app) => (app.zIndex -= 1));
        app.zIndex = zIndexCounter++;
    };

    return {
        apps,
        currentApps,
        backgroundUrl,
        isMenuVisible,
        hour,
        date,
        isSelecting,
        selectionBoxStyles,
        maximized,
        startSelection,
        updateSelection,
        endSelection,
        handleOutsideClick,
        observeResize,
        openApp,
        minimizeApp,
        maximizeApp,
        closeApp,
        startDrag,
        appName,
        getComponent,
        putToTop
    };
}