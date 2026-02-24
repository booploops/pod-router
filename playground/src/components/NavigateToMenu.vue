<script setup lang="ts">
import { ref } from 'vue';

const presetRoutes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/dashboard/stats', name: 'DashboardStats' },
  { path: '/dashboard/settings', name: 'DashboardSettings' },
  { path: '/dashboard/profile/john-smith-1234', name: 'DashboardProfile' },
  { path: '/user/john-smith-1234', name: 'User' },
  { path: '*', name: 'NotFound' },
];

const isMenuOpen = ref(false);
const emits = defineEmits<{
  'navigate': [path: string],
}>()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const selectRoute = (path: string) => {
  emits('navigate', path);
  isMenuOpen.value = false;
};
</script>

<template>
  <div class="dropdown">
    <button class="dropdown-toggle" @click="toggleMenu">
      Navigate to
    </button>
    <div v-show="isMenuOpen" class="dropdown-menu">
      <div
        v-for="route in presetRoutes"
        :key="route.path"
        class="dropdown-item"
        @click="selectRoute(route.path)"
      >
        {{ route.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {

}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1000;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #f8f8f8;
}
</style>