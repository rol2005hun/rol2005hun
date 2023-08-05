<template>
  <header>
    <nav class="nav">
      <NuxtLink to="/" class="nav-branding">Főoldal</NuxtLink>
      <ul class="nav-menu">
        <li class="nav-item" @click="toggleMenu(2)">
          <NuxtLink to="about" class="nav-link">Rólam</NuxtLink>
        </li>
        <li class="nav-item" @click="toggleMenu(2)">
          <NuxtLink to="projects" class="nav-link">Projektek</NuxtLink>
        </li>
        <li class="nav-item" @click="toggleMenu(2)">
          <NuxtLink to="contacts" class="nav-link">Elérhetőségeim</NuxtLink>
        </li>
      </ul>
      <div class="nav-hamburger" @click="toggleMenu(1)">
        <span class="nav-bar"></span>
        <span class="nav-bar"></span>
        <span class="nav-bar"></span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isDropdownActive = ref(false);

function toggleMenu(option: number) {
  const body = document.querySelector('body');
  const hamburger = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-menu');
  const submenu = document.querySelector('.nav-submenu') as HTMLUListElement;

  if (option === 1) {
    if (!hamburger?.classList.contains('active') || !menu?.classList.contains('active')) {
      body!.style.overflowX = 'hidden';
      setTimeout(() => {
        body!.style.removeProperty('overflow-x');
      }, 200);
    }
    hamburger?.classList.toggle('active');
    menu?.classList.toggle('active');
  } else if (option === 2) {
    submenu.classList.toggle('active');
    isDropdownActive.value = !isDropdownActive.value;
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const menu = document.querySelector('.nav-menu');
  const hamburger = document.querySelector('.nav-hamburger');
  const submenu = document.querySelector('.nav-submenu') as HTMLUListElement;

  if (menu && !menu.contains(target) && hamburger && !hamburger.contains(target)) {
    submenu.classList.remove('active');
    isDropdownActive.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/navbar.scss';
</style>
  