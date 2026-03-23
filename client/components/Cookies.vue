<template>
    <div class="window cookies" :style="{ zIndex: app.zIndex, top: app.position.top + 'px', left: app.position.left + 'px', 
                width: app.size.width + '%', height: app.size.height + '%' }">
        <div class="window-header" @mousedown="startDrag(app, $event)">
            <div class="icon-name">
                <span class="window-icon">🍪</span>
                <span class="window-title">Sütik</span>
            </div>
            <div class="buttons">
                <button class="minimize btn">—</button>
                <button class="maximize btn">
                    <span>🗖</span>
                </button>
                <button class="close btn">X</button>
            </div>
        </div>
        <div class="window-body">
            <div class="description">
                <p>Ez az alkalmazás sütiket használ a legjobb felhasználói élmény érdekében, kisebb adattípusokat tárolunk el ideiglenesen az eszközön. Tovább olvashat 
                    <a href="https://juda.hu/2021/07/mik-azok-a-sutik-cookie-k-es-hogyan-mukodnek/#:~:text=Di%C3%B3h%C3%A9jban%3A%20a%20b%C3%B6ng%C3%A9sz%C5%91%20vagy%20a%20HTTP%20cookie-k%20olyan,%28t%C3%B6bbek%20k%C3%B6z%C3%B6tt%29%20sokkal%20gyorsabban%20t%C3%B6lt%C5%91dik%20be%2C%20amikor%20visszat%C3%A9r." target="_blank">itt</a>.
                    Kérjük, adja meg a licenckulcsot (RANZAK_OS_V2_ACCEPT_COOKIE) az alábbi mezőbe, ezzel elfogadva a fenntebb leírtakat:</p>
            </div>
            <input type="text" v-model="licenseKey" placeholder="Licenckulcs" class="license-input">
            <button @click="validateLicenseKey" class="validate-button">Ellenőrzés</button>
        </div>
    </div>
</template>

<script setup lang="ts">
const { currentApps, openApp, startDrag } = useDesktop();
openApp('cookies');
const app = currentApps.value.find(app => app.id === 'cookies') as { id: string, position: { top: number, left: number }, zIndex: number, size: { width: number, height: number }, minimized: boolean };
const acceptedCookies = useCookie('acceptedCookies', { 
    expires: new Date('3000-12-12'), 
    default: () => false,
    sameSite: 'none', 
    secure: true 
}) as Ref<boolean>;
const currentScreen = useCookie('currentScreen', { 
    default: () => 'cookies',
    sameSite: 'none', 
    secure: true 
}) as Ref<string>;
const licenseKey = ref('');

function validateLicenseKey() {
    if (licenseKey.value === 'RANZAK_OS_V2_ACCEPT_COOKIE') {
        currentApps.value = currentApps.value.filter(app => app.id !== 'cookies');
        acceptedCookies.value = true;
        currentScreen.value = 'login';
    } else {
        alert('Hibás licenckulcs!');
    }
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/components/cookies.scss';
</style>
