export default defineNuxtRouteMiddleware((to, from) => {
    const currentScreen = useCookie('currentScreen', { default: () => 'cookies' }) as Ref<string>;

    const query = to.query as Record<string, string>;
    if (query.screen) {
        currentScreen.value = query.screen;
    }
});