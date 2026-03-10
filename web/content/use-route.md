# useRoute

The `useRoute` composable provides access to the current route's state and navigation methods for components rendered _inside_ a `<PodRouter>`.

::: tip
`useRoute` must be called within the `<script setup>` of a component that is a child of a `<PodRouter>` instance.
:::

## Import

```javascript
import { useRoute } from "@booploops/pod-router";
```

## Usage

Calling the composable returns a reactive object containing information about the matched route, alongside utility functions to navigate programmatically.

```vue
<script setup lang="ts">
import { useRoute } from "@booploops/pod-router";

const route = useRoute();

const goToProfile = () => {
  // Navigate to a new path
  route.navigate("/profile/123");
};

const goBack = () => {
  // Go back to the previous path
  route.back();
};
</script>

<template>
  <div>
    <h2>Current Path: {{ route.path }}</h2>
    <p v-if="route.params.id">ID matches: {{ route.params.id }}</p>

    <button @click="goToProfile">Go To Profile</button>
    <button @click="goBack">Back</button>
  </div>
</template>
```

## Properties & Methods

The returned object follows the `UseRouteReturn` interface:

| Property/Method          | Type                     | Description                                                                             |
| ------------------------ | ------------------------ | --------------------------------------------------------------------------------------- |
| `currentRoute`           | `Route \| null`          | The matched route definition block.                                                     |
| `path`                   | `string`                 | The pathname of the current route (e.g., `"/user/123"`).                                |
| `fullPath`               | `string`                 | The entire path including query parameters and hash (e.g., `"/user/123?tab=info#bio"`). |
| `params`                 | `Record<string, string>` | Extract dynamic path parameters mapping (e.g., `"/user/:id"` -> `{ id: "123" }`).       |
| `query`                  | `Record<string, string>` | Query parameters extracted from the URL.                                                |
| `hash`                   | `string \| undefined`    | URL hash fragment if present.                                                           |
| `meta`                   | `Record<string, any>`    | Metadata corresponding to the active `Route` config.                                    |
| `navigate(path: string)` | `function`               | Programmatically triggers a navigation to a new target path.                            |
| `back()`                 | `function`               | Triggers a backward navigation through route history.                                   |
| `forward()`              | `function`               | Triggers a forward navigation through route history.                                    |
| `reload()`               | `function`               | Forces a remount of the currently rendered `<PodRouter>` component.                     |
