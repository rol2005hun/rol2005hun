<template>
  <div class="privacy-page">
    <div class="privacy-content">
      <h1>{{ t('privacy.title') }}</h1>
      <p class="intro">{{ t('privacy.intro') }}</p>

      <div class="section">
        <h2>{{ t('privacy.section1Title') }}</h2>
        <p>{{ t('privacy.section1Text') }}</p>
      </div>

      <div class="section">
        <h2>{{ t('privacy.section2Title') }}</h2>
        <p>{{ t('privacy.section2Text') }}</p>
      </div>

      <div class="section">
        <h2>{{ t('privacy.section3Title') }}</h2>
        <p>{{ t('privacy.section3Text') }}</p>
      </div>

      <div class="section">
        <h2>{{ t('privacy.section4Title') }}</h2>
        <p>{{ t('privacy.section4Text') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useHead } from '#imports';

const { t } = useI18n();

definePageMeta({
  layout: false
});

useHead({
  style: [
    {
      innerHTML: `
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: auto !important;
          background-color: #0f172a !important;
          overflow-y: auto !important;
        }
        #__nuxt {
          height: auto !important;
          min-height: 100% !important;
          overflow-y: auto !important;
        }
      `
    }
  ]
});
</script>

<style>
/* HMR placeholder */
</style>

<style scoped lang="scss">
.privacy-page {
  padding: 3rem 2rem;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  color: #e2e8f0;
  background-color: #0f172a;
  min-height: 100%;
  box-sizing: border-box;
}

.privacy-content {
  max-width: 800px;
  margin: 0 auto;

  h1 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    color: #f8fafc;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 1rem;
  }

  .intro {
    font-size: 1.15rem;
    margin-bottom: 2.5rem;
    color: #94a3b8;
    line-height: 1.6;
  }

  .section {
    margin-bottom: 2rem;
    background: rgba(255, 255, 255, 0.02);
    padding: 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    h2 {
      font-size: 1.3rem;
      margin-bottom: 1rem;
      color: #38bdf8;
      font-weight: 500;
    }

    p {
      color: #cbd5e1;
      line-height: 1.7;
      font-size: 1.05rem;
      margin: 0;
    }
  }
}

@media (max-width: 768px) {
  .privacy-page {
    padding: 1.5rem;
  }
  .privacy-content h1 {
    font-size: 1.8rem;
  }
}
</style>
