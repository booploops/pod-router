# Simple Example

```vue
<script setup lang="ts">
import { PodRouter, type Route } from "@booploops/pod-router";
import HomePage from "./views/HomePage.vue";
import UserPage from "./views/UserPage.vue";
import { ref } from "vue";

const historyType: "hash" | "memory" | "history" = "memory";

const currentRoute = ref('/');

/**
 * Defining our routes
 */
const routes: Route[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/users/:id",
    component: UserPage,
  },
];
</script>

<template>
  <PodRouter :routes="routes" :history="historyType" v-model="currentRoute" />
</template>
```

# Custom Router View with Transitions

```vue
<script setup lang="ts">
import { PodRouter, type Route } from "@booploops/pod-router";
import HomePage from "./views/HomePage.vue";
import UserPage from "./views/UserPage.vue";

const currentRoute = ref('/');

/**
 * Defining our routes
 */
const routes: Route[] = [
  // ...
];
</script>

<template>
  <PodRouter :routes="routes" history="memory" v-model="currentRoute">
    <template #default="{ Component, route }">
      <transition name="fade" mode="out-in">
        <component :is="Component" v-bind="route.params" :key="route.key" />
      </transition>
    </template>
  </PodRouter>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

# Using `useRoute` in a Child Component

```vue
<script setup lang="ts">
import { useRoute } from "@booploops/pod-router";

const route = useRoute();
</script>

<template>
  <div>
    <h1>User ID: {{ route.params.id }}</h1>
    <p>Current Path: {{ route.path }}</p>
  </div>
</template>
```

# Lazy Loading Routes (Code Splitting)

You can lazy-load route components using dynamic imports for better performance and code splitting:

```vue
<script setup lang="ts">
import { PodRouter, type Route } from "@booploops/pod-router";

const routes: Route[] = [
  {
    path: "/",
    component: () => import("./views/HomePage.vue"),
  },
  {
    path: "/about",
    component: () => import("./views/AboutPage.vue"),
  },
  {
    path: "/users/:id",
    component: () => import("./views/UserPage.vue"),
  },
];
</script>

<template>
  <PodRouter :routes="routes" history="memory" />
</template>
```

This approach automatically code-splits your routes, loading components only when they're needed. The router internally uses Vue's `defineAsyncComponent` to handle lazy-loaded components.

# Route Meta and Props Example

This example demonstrates using `route.meta` for metadata (like page titles and auth requirements) and `route.props` to pass additional data to components.

```vue
<script setup lang="ts">
import { PodRouter, useRoute, type Route } from "@booploops/pod-router";
import { watch } from "vue";
import Dashboard from "./views/Dashboard.vue";
import Settings from "./views/Settings.vue";
import Profile from "./views/Profile.vue";

const routes: Route[] = [
  {
    path: "/",
    component: Dashboard,
    meta: {
      title: "Dashboard",
      requiresAuth: true,
      icon: "🏠",
    },
    props: {
      theme: "dark",
      showWelcome: true,
    },
  },
  {
    path: "/settings",
    component: Settings,
    meta: {
      title: "Settings",
      requiresAuth: true,
      icon: "⚙️",
    },
    props: (route) => ({
      section: route.query.section || "general",
      canEdit: route.meta?.requiresAuth || false,
    }),
  },
  {
    path: "/profile/:username",
    component: Profile,
    meta: {
      title: "User Profile",
      requiresAuth: false,
      icon: "👤",
    },
    props: (route) => ({
      username: route.params.username,
      showFollowers: true,
    }),
  },
];

// Set page title based on route meta
const route = useRoute();
watch(() => route.meta.title, (title) => {
  if (title) {
    document.title = `${title} - My App`;
  }
}, { immediate: true });
</script>

<template>
  <PodRouter :routes="routes" history="memory" />
</template>
```

**Dashboard.vue** - Receives props from route:

```vue
<script setup lang="ts">
defineProps<{
  theme: string;
  showWelcome: boolean;
}>();
</script>

<template>
  <div :class="`theme-${theme}`">
    <h1 v-if="showWelcome">Welcome to Dashboard!</h1>
  </div>
</template>
```

**Profile.vue** - Receives both params and props:

```vue
<script setup lang="ts">
import { useRoute } from "@booploops/pod-router";

// Props from route.props (merged with params)
defineProps<{
  username: string;
  showFollowers: boolean;
}>();

// Also access meta
const route = useRoute();
console.log(route.meta.icon); // "👤"
</script>

<template>
  <div>
    <h1>{{ username }}'s Profile</h1>
    <div v-if="showFollowers">
      Followers section...
    </div>
  </div>
</template>
```
