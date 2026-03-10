# Getting Started

`@booploops/pod-router` is a self-contained component-level router for Vue 3 Single Page Applications. It allows you to mount full-fledged routing environments inside any component, not just the root layout!

## Installation

Install the package via your preferred package manager:

::: code-group

```bash [npm]
npm install @booploops/pod-router
```

```bash [pnpm]
pnpm add @booploops/pod-router
```

```bash [yarn]
yarn add @booploops/pod-router
```

:::

Make sure you also have `vue` installed as it is a peer dependency (Vue 3+ is required).

## Basic Usage

To use `pod-router`, simply import the `<PodRouter>` component and supply an array of route definitions.

```vue
<script setup lang="ts">
import { PodRouter } from "@booploops/pod-router";
import type { Route } from "@booploops/pod-router";
import HomeView from "./views/HomeView.vue";
import AboutView from "./views/AboutView.vue";

const routes: Route[] = [
  { path: "/", name: "home", component: HomeView },
  { path: "/about", name: "about", component: AboutView },
];
</script>

<template>
  <div>
    <h1>My Mini App</h1>
    <!-- Mount the router! -->
    <PodRouter :routes="routes" history="memory" />
  </div>
</template>
```

That's it! Because we set `history="memory"`, navigating between these routes will not affect the main browser URL, making this perfect for embedded widgets, complex modals, or multi-step forms.
