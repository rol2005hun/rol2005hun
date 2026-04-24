<template>
  <div class="os-setup-container">
    <div class="language-selector">
      <Icon name="ph:globe-hemisphere-west-light" class="lang-icon" />
      <select v-model="currentLocale" @change="changeLocale">
        <option value="en">English (US)</option>
        <option value="hu">Magyar (HU)</option>
      </select>
    </div>

    <div class="os-setup-window">
      <div class="os-setup-header">
        <div class="os-logo">
          <Icon name="ph:cpu-light" class="icon" />
        </div>
        <h1 class="os-title">{{ t('setup.title') }}</h1>
        <p class="os-subtitle">{{ t('setup.description') }}</p>
      </div>

      <div class="os-setup-body">
        <div class="beta-notice" @click="copyKey">
          <Icon
            :name="isCopied ? 'ph:check-circle-light' : 'ph:key-light'"
            class="beta-icon"
            :class="{ 'text-success': isCopied }" />
          <div class="beta-text">
            <span class="beta-label">{{ t('setup.betaKeyHint') }}</span>
            <code class="beta-key">{{ VALID_KEY }}</code>
          </div>
          <Icon name="ph:copy-light" class="copy-action" />
        </div>

        <div class="input-group">
          <input
            id="os-license"
            v-model="inputKey"
            type="text"
            placeholder="XXXX-XXXX-XXXX"
            :class="{ error: hasError }"
            autocomplete="off"
            spellcheck="false"
            @keyup.enter="verifyLicense" />
          <transition name="fade">
            <div v-if="hasError" class="error-message">
              <Icon name="ph:warning-circle-light" />
              <span>{{ t('setup.invalidKey') }}</span>
            </div>
          </transition>
        </div>
      </div>

      <div class="os-setup-footer">
        <label class="privacy-agreement-label">
          <input v-model="acceptedPrivacy" type="checkbox" />
          <span class="custom-chk"></span>
          <span class="label-txt">{{ t('setup.acceptPrivacy') }}</span>
        </label>

        <button
          class="os-btn-primary"
          :disabled="!inputKey || !acceptedPrivacy"
          @click="verifyLicense">
          <span>{{ t('setup.verifyBtn') }}</span>
          <Icon name="ph:arrow-right-bold" />
        </button>
        <a href="#" class="os-link" @click.prevent="openPrivacyPolicy">
          {{ t('setup.learnMore') }}
        </a>
      </div>
    </div>

    <!-- Telemetry & Privacy Modal overlay -->
    <Transition name="modal-fade">
      <div v-if="showPrivacyModal" class="privacy-modal" @click.self="closePrivacyPolicy">
        <div class="privacy-content-wrapper">
          <div class="p-header">
            <h2>{{ t('setup.modalTitle') }}</h2>
            <button class="p-close" @click="closePrivacyPolicy">
              <Icon name="ph:x-bold" />
            </button>
          </div>
          <div class="p-body">
            <iframe
              v-if="currentLocale !== 'en'"
              :src="`/${currentLocale}/privacy`"
              class="privacy-iframe"
              frameborder="0"></iframe>
            <iframe v-else src="/privacy" class="privacy-iframe" frameborder="0"></iframe>
          </div>
          <div class="p-footer">
            <button class="os-btn-primary small-btn" @click="acceptAndClosePrivacy">
              {{ t('setup.acceptBtn') || t('setup.acceptPrivacy').replace('.', '') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCookie } from '#imports';

const { t, locale } = useI18n();

const emit = defineEmits(['setup-complete']);

const inputKey = ref('');
const hasError = ref(false);
const isCopied = ref(false);

const VALID_KEY = ref('RNZK-2026-BETA');

const acceptedPrivacy = ref(false);
const showPrivacyModal = ref(false);

const localeCookie = useCookie('os_locale', {
  maxAge: 60 * 60 * 24 * 365
});

const currentLocale = ref(localeCookie.value || locale.value);

const changeLocale = () => {
  locale.value = currentLocale.value;
  localeCookie.value = currentLocale.value;
};

const verifyLicense = () => {
  if (inputKey.value.toUpperCase() === VALID_KEY.value && acceptedPrivacy.value) {
    hasError.value = false;
    const licenseCookie = useCookie('ranzakos_license', {
      maxAge: 60 * 60 * 24 * 365
    });
    licenseCookie.value = 'valid';
    emit('setup-complete');
  } else {
    if (inputKey.value.toUpperCase() !== VALID_KEY.value) {
      hasError.value = true;
      inputKey.value = '';
    }
  }
};

const openPrivacyPolicy = () => {
  showPrivacyModal.value = true;
};

const closePrivacyPolicy = () => {
  showPrivacyModal.value = false;
};

const acceptAndClosePrivacy = () => {
  acceptedPrivacy.value = true;
  closePrivacyPolicy();
};

const copyKey = async () => {
  try {
    await navigator.clipboard.writeText(VALID_KEY.value);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped lang="scss">
.os-setup-container {
  height: 100dvh;
  width: 100vw;
  background: radial-gradient(circle at top right, #1e293b, #020617);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f8fafc;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  overflow: hidden;
  position: relative;
}

.language-selector {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(15, 23, 42, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.language-selector select {
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
}

.language-selector select option {
  background: #1e293b;
  color: #f8fafc;
}

.os-setup-window {
  width: 100%;
  max-width: 640px;
  min-height: 520px;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(40px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem 4rem;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: windowScaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

.os-setup-header {
  text-align: center;
  margin-bottom: 2rem;

  .os-logo {
    width: 88px;
    height: 88px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(129, 140, 248, 0.15));
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

    .icon {
      font-size: 44px;
      color: #38bdf8;
      filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
    }
  }

  .os-title {
    font-size: 2rem;
    font-weight: 300;
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.5px;
    background: linear-gradient(to right, #f8fafc, #cbd5e1);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .os-subtitle {
    color: #94a3b8;
    font-size: 1.1rem;
    margin: 0;
    font-weight: 300;
  }
}

.os-setup-body {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.beta-notice {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(56, 189, 248, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  .beta-icon {
    font-size: 1.5rem;
    color: #94a3b8;
    &.text-success {
      color: #22c55e;
    }
  }

  .beta-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: left;

    .beta-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #64748b;
      letter-spacing: 1px;
    }

    .beta-key {
      font-size: 1.1rem;
      color: #e2e8f0;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }

  .copy-action {
    color: #64748b;
    font-size: 1.2rem;
  }
}

.input-group {
  position: relative;
  width: 100%;

  input {
    width: 100%;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    font-size: 1.4rem;
    color: #f8fafc;
    text-align: center;
    letter-spacing: 2px;
    outline: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-sizing: border-box;

    &::placeholder {
      color: rgba(255, 255, 255, 0.15);
    }

    &:focus {
      background: rgba(0, 0, 0, 0.4);
      border-color: rgba(56, 189, 248, 0.5);
      box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
    }

    &.error {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.05);
      color: #ef4444;
    }
  }

  .error-message {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    color: #ef4444;
    font-size: 0.95rem;
  }
}

.os-setup-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
  width: 100%;

  .os-link {
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;

    &:hover {
      color: #38bdf8;
    }
  }
}

.os-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
  color: #fff;
  border: none;
  padding: 1.2rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px -10px rgba(56, 189, 248, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.03);
    color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);
    cursor: not-allowed;
    box-shadow: none;
  }
}

/* --- MOBILE SPECIFIC STYLES --- */
@media (max-width: 768px), (max-height: 700px) {
  .os-setup-window {
    width: 100vw;
    height: 100dvh;
    max-width: none;
    border-radius: 0;
    border: none;
    padding: 3rem 1.5rem 2.5rem 1.5rem;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    justify-content: center;
    gap: 2rem;
    animation: fadeIn 0.5s ease-out;
  }

  .os-setup-header {
    margin-bottom: 0;

    .os-logo {
      width: 76px;
      height: 76px;
      margin-bottom: 1rem;

      .icon {
        font-size: 36px;
      }
    }

    .os-title {
      font-size: 1.8rem;
    }
    .os-subtitle {
      font-size: 1rem;
    }
  }

  .os-setup-body {
    flex: 0 1 auto;
    gap: 1.25rem;
  }

  .input-group input {
    font-size: 1.25rem;
    padding: 1.1rem;
  }

  .os-setup-footer {
    margin-top: 0;
    gap: 1.25rem;
  }
}

@keyframes windowScaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.privacy-agreement-label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.6rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.privacy-agreement-label:hover {
  background: rgba(255, 255, 255, 0.05);
}

.privacy-agreement-label input {
  display: none;
}

.custom-chk {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  position: relative;
}

.privacy-agreement-label input:checked + .custom-chk {
  background: #38bdf8;
  border-color: #38bdf8;
}

.privacy-agreement-label input:checked + .custom-chk::after {
  content: '?';
  color: white;
  font-size: 14px;
}

.label-txt {
  color: #cbd5e1;
  font-size: 0.95rem;
}

/* Privacy Modal Styles */
.privacy-modal {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(15px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.privacy-content-wrapper {
  width: 100%;
  max-width: 900px;
  height: 85vh;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.p-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
}

.p-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 500;
}

.p-close {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-close:hover {
  color: #ef4444;
}

.p-body {
  flex: 1;
  width: 100%;
  min-height: 0;
  position: relative;
}

.privacy-iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}

.p-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: flex-end;
  background: rgba(255, 255, 255, 0.02);
}

.small-btn {
  width: auto;
  padding: 0.8rem 2rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .privacy-modal {
    padding: 0;
  }
  .privacy-content-wrapper {
    height: 100vh;
    border-radius: 0;
    border: none;
  }
  .privacy-agreement-label {
    width: 100%;
    margin-bottom: 1.5rem;
  }
  .p-footer {
    padding: 1rem;
  }
  .p-footer .small-btn {
    width: 100%;
  }
}
</style>
