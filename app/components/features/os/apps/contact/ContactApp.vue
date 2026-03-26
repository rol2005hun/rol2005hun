<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Icon } from '#components';

const { t } = useI18n();

defineProps<{
  windowId: string;
}>();

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const isSuccess = ref(false);

const submitForm = async () => {
  if (!form.value.email || !form.value.message) return;

  isSubmitting.value = true;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  isSubmitting.value = false;
  isSuccess.value = true;
};

const resetForm = () => {
  isSuccess.value = false;
  form.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
};
</script>

<template>
  <div class="app-container contact-app">
    <div v-if="!isSuccess" class="contact-content glass-panel">
      <div class="contact-header">
        <Icon name="ph:envelope-open-fill" class="header-icon" />
        <h2>{{ t('os.apps.contact.title') }}</h2>
        <p>{{ t('os.apps.contact.subtitle') }}</p>
      </div>

      <form class="contact-form" @submit.prevent="submitForm">
        <div class="input-group">
          <input
            v-model="form.name"
            type="text"
            :placeholder="t(`os.apps.contact.form.name`)"
            class="os-input" />
        </div>
        <div class="input-group">
          <input
            v-model="form.email"
            type="email"
            required
            :placeholder="t(`os.apps.contact.form.email`)"
            class="os-input" />
        </div>
        <div class="input-group">
          <input
            v-model="form.subject"
            type="text"
            :placeholder="t(`os.apps.contact.form.subject`)"
            class="os-input" />
        </div>
        <div class="input-group">
          <textarea
            v-model="form.message"
            required
            :placeholder="t(`os.apps.contact.form.message`)"
            class="os-input textarea"
            rows="5"></textarea>
        </div>

        <button type="submit" class="os-button submit-btn" :disabled="isSubmitting">
          <Icon v-if="isSubmitting" name="ph:spinner-gap-bold" class="spinner" />
          <Icon v-else name="ph:paper-plane-right-fill" />
          <span>
            {{
              isSubmitting ? t('os.apps.contact.form.sending') : t('os.apps.contact.form.submit')
            }}
          </span>
        </button>
      </form>
    </div>

    <div v-else class="success-panel glass-panel">
      <div class="success-icon-wrapper">
        <Icon name="ph:check-circle-fill" class="success-icon" />
      </div>
      <h2>{{ t('os.apps.contact.form.successTitle') }}</h2>
      <p>{{ t('os.apps.contact.form.successMessage') }}</p>
      <button class="os-button back-btn" @click="resetForm">
        <Icon name="ph:arrow-left-bold" />
        <span>{{ t('os.apps.contact.form.back') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-container.contact-app {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  padding: 40px 20px;
  background: var(--os-window-bg);
  overflow-y: auto;
  box-sizing: border-box;
}

.glass-panel {
  margin: auto;
  width: 100%;
  max-width: 500px;
  padding: 30px;
  border-radius: 16px;
  background: var(--os-menu-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--os-border-color);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .header-icon {
    font-size: 3rem;
    color: var(--os-primary-color);
  }

  h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--os-text);
  }

  p {
    margin: 0;
    color: var(--os-text);
    font-size: 0.95rem;
  }
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .input-group {
    display: flex;
    flex-direction: column;
  }

  .os-input {
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    background: var(--os-menu-bg);
    border: 1px solid var(--os-border-color);
    color: var(--os-text);
    font-size: 0.95rem;
    transition: all 0.3s ease;
    outline: none;

    &::placeholder {
      color: var(--os-text);
    }

    &:focus {
      background: var(--os-menu-bg);
      border-color: var(--os-primary-color);
      box-shadow: 0 0 0 1px var(--os-primary-color);
    }

    &.textarea {
      resize: vertical;
      min-height: 120px;
    }
  }

  .os-button.submit-btn {
    margin-top: 8px;
    padding: 14px;
    border-radius: 10px;
    background: var(--os-primary-color);
    color: var(--os-primary-text);
    border: none;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      animation: spin 1s linear infinite;
    }
  }
}

.success-panel {
  text-align: center;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  .success-icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba(46, 213, 115, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;

    .success-icon {
      font-size: 3.5rem;
      color: #2ed573;
    }
  }

  h2 {
    margin: 0;
    font-size: 1.8rem;
    color: var(--os-text);
  }

  p {
    margin: 0;
    color: var(--os-text);
    margin-bottom: 24px;
  }

  .back-btn {
    padding: 10px 20px;
    border-radius: 8px;
    background: var(--os-menu-bg);
    border: 1px solid var(--os-border-color);
    color: var(--os-text);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--os-menu-bg);
      border-color: var(--os-text);
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
