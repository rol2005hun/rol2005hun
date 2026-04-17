<template>
  <div class="setup-container">
    <div class="setup-card">
      <div class="icon-wrapper">
        <Icon name="ph:cpu-light" class="setup-icon" />
      </div>

      <div class="setup-content">
        <h1>{{ t('setup.title') }}</h1>
        <p>
          {{ t('setup.description') }}
          <a href="#" class="privacy-link" @click.prevent="openPrivacyPolicy">
            {{ t('setup.learnMore') }}
          </a>
        </p>

        <div class="beta-key-hint" @click="copyKey">
          <span class="hint-label">{{ t('setup.betaKeyHint') }}</span>
          <code class="hint-key">{{ VALID_KEY }}</code>
          <Icon
            :name="isCopied ? 'ph:check-circle-light' : 'ph:copy-light'"
            class="copy-icon"
            :class="{ 'text-green': isCopied }" />
        </div>

        <div class="license-form">
          <label for="licenseKey">{{ t('setup.keyLabel') }}</label>
          <div class="input-wrapper">
            <input
              id="licenseKey"
              v-model="inputKey"
              type="text"
              placeholder="XXXX-XXXX-XXXX"
              :class="{ 'is-invalid': hasError }"
              @keyup.enter="verifyLicense" />
            <div class="focus-ring" />
          </div>
          <transition name="fade">
            <p v-if="hasError" class="error-msg">
              <Icon name="ph:warning-circle-light" class="error-icon" />
              {{ t('setup.invalidKey') }}
            </p>
          </transition>
        </div>

        <div class="actions">
          <button :disabled="!inputKey" class="verify-btn" @click="verifyLicense">
            <span>{{ t('setup.verifyBtn') }}</span>
            <Icon name="ph:arrow-right-light" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCookie, useRouter } from '#imports';

const { t } = useI18n({ useScope: 'global' });
const router = useRouter();

const emit = defineEmits(['setup-complete']);

const inputKey = ref('');
const hasError = ref(false);
const isCopied = ref(false);

const VALID_KEY = ref('RNZK-2026-BETA');

const verifyLicense = () => {
  if (inputKey.value.toUpperCase() === VALID_KEY.value) {
    hasError.value = false;
    const licenseCookie = useCookie('ranzakos_license', {
      maxAge: 60 * 60 * 24 * 365
    });
    licenseCookie.value = 'valid';
    emit('setup-complete');
  } else {
    hasError.value = true;
    inputKey.value = '';
  }
};

const openPrivacyPolicy = () => {
  router.push('/privacy');
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
.setup-container {
  height: 100dvh;
  width: 100vw;
  background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f8fafc;
  overflow: hidden;
  position: relative;
  padding: 1.5rem;
  box-sizing: border-box;
}

.setup-card {
  width: 100%;
  max-width: 480px;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(25px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  padding: 3.5rem 3rem;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6);
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-height: 100%;
  overflow-y: auto;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 480px), (max-height: 700px) {
  .setup-card {
    padding: 2.5rem 1.5rem;
  }
  .icon-wrapper {
    margin-bottom: 1.5rem;
    width: 64px;
    height: 64px;
    .setup-icon { font-size: 32px; }
  }
  .setup-content h1 {
    font-size: 1.5rem;
  }
  .beta-key-hint {
    margin-bottom: 1.5rem;
  }
  .license-form {
    margin-bottom: 1.5rem;
  }
}

.icon-wrapper {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(129, 140, 248, 0.15) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.5rem;
  box-shadow:
    inset 0 0 20px rgba(56, 189, 248, 0.1),
    0 0 40px rgba(56, 189, 248, 0.1);

  .setup-icon {
    font-size: 44px;
    color: #38bdf8;
    filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5));
  }
}

.setup-content {
  width: 100%;

  h1 {
    margin: 0 0 1rem 0;
    font-size: 1.85rem;
    font-weight: 400;
    letter-spacing: 0.5px;
    background: linear-gradient(to right, #f8fafc, #cbd5e1);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: #94a3b8;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-weight: 300;

    .privacy-link {
      color: #38bdf8;
      text-decoration: none;
      font-weight: 400;
      transition: color 0.2s;
      white-space: nowrap;

      &:hover {
        color: #818cf8;
        text-decoration: underline;
      }
    }
  }
}

.beta-key-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(56, 189, 248, 0.05);
  border: 1px dashed rgba(56, 189, 248, 0.3);
  padding: 0.8rem 1.2rem;
  border-radius: 16px;
  margin-bottom: 2.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(56, 189, 248, 0.1);
    border-color: rgba(56, 189, 248, 0.6);
  }

  &:active {
    transform: scale(0.97);
  }

  .hint-label {
    font-size: 0.85rem;
    color: #cbd5e1;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .hint-key {
    color: #f8fafc;
    font-size: 1.1rem;
    font-weight: bold;
    letter-spacing: 1.5px;
  }

  .copy-icon {
    font-size: 1.2rem;
    color: #38bdf8;
    transition: color 0.2s;

    &.text-green {
      color: #22c55e;
    }
  }
}

.license-form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 3rem;
  text-align: left;

  label {
    font-size: 0.85rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 500;
    margin-left: 0.5rem;
  }

  .input-wrapper {
    position: relative;
    width: 100%;

    input {
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1.2rem 1.5rem;
      border-radius: 20px;
      font-size: 1.3rem;
      color: #f8fafc;
      outline: none;
      text-transform: uppercase;
      letter-spacing: 3px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;

      &::placeholder {
        color: rgba(255, 255, 255, 0.1);
      }

      &:focus {
        background: rgba(0, 0, 0, 0.3);
        border-color: rgba(56, 189, 248, 0.6);
        box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
      }

      &.is-invalid {
        border-color: #ef4444;
        background: rgba(239, 68, 68, 0.05);
      }
    }
  }

  .error-msg {
    color: #ef4444;
    margin: 0;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.5rem;
    font-weight: 400;

    .error-icon {
      font-size: 1.2rem;
    }
  }
}

.actions {
  width: 100%;

  .verify-btn {
    width: 100%;
    background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
    color: white;
    border: none;
    padding: 1.2rem;
    border-radius: 20px;
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s;
    }

    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px -10px rgba(56, 189, 248, 0.5);

      &::after {
        transform: translateX(100%);
      }
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

    Icon {
      font-size: 1.2rem;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
