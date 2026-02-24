# Simple Example

```vue
<script setup lang="ts">
import { PodRouter, type Route } from "pod-router";
import HomePage from "./views/HomePage.vue";
import UserPage from "./views/UserPage.vue";

const historyType: "hash" | "memory" | "history" = "memory";

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
  <PodRouter :routes="routes" :history="historyType" />
</template>
```

# Custom Router View with Transitions

```vue
<script setup lang="ts">
import { PodRouter, type Route } from "pod-router";
import HomePage from "./views/HomePage.vue";
import UserPage from "./views/UserPage.vue";

/**
 * Defining our routes
 */
const routes: Route[] = [
  // ...
];
</script>

<template>
  <PodRouter :routes="routes" history="memory">
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
import { useRoute } from "pod-router";

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
import { PodRouter, type Route } from "pod-router";

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
