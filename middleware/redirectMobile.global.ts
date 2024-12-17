export default defineNuxtRouteMiddleware((to, from) => {
    const userAgent = useRequestHeaders()['user-agent'] || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (isMobile) {
        return navigateTo('https://ranzak.site', { external: true });
    }
});