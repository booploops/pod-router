# Defining Routes

Routes are defined as an array of route objects, where each object specifies the path, component, and optional metadata for a route. The `path` can include dynamic segments (e.g., `:id`) and nested routes.

```javascript
import type { Route } from "pod-router";
import Home from "./views/Home.vue";
import User from "./views/User.vue";
import UserProfile from "./views/UserProfile.vue";
import UserPosts from "./views/UserPosts.vue";

const routes: Route[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/about",
    component: () => import("./views/About.vue"), // Lazy-loaded route component
  },
  {
    path: "/users/:id",
    component: User,
    children: [
      {
        path: "profile",
        component: UserProfile,
      },
      {
        path: "posts",
        component: UserPosts,
      },
    ],
  },
];
```

# Events Emitted by `<PodRouter>`

The `<PodRouter>` component emits the following events that you can listen to for tracking navigation and route changes.

- **beforeRouteChange:** `(to: Route, from: Route | null) => void` — Emitted before a route change occurs. Receives the target route (`to`) and the previous route (`from`, which is `null` on initial navigation). This event fires before `routeChange`.

- **routeChange:** `(to: Route, from: Route) => void` — Emitted after a route change has occurred. Receives the new route (`to`) and the previous route (`from`). On initial navigation, `from` will be a minimal route object with an empty path.

- **routeNotFound:** `(path: string) => void` — Emitted when no matching route is found for the given path. Receives the path string that failed to match. Consider defining a catch-all route with `path: '*'` to handle 404 pages.

- **navigate:** `(path: string) => void` — Emitted when the `navigate()` method is called. Receives the target path string. Only emitted in memory history mode or when using `useRoute().navigate()`.

- **back:** `() => void` — Emitted when the `back()` method is called to navigate backward in history.

- **forward:** `() => void` — Emitted when the `forward()` method is called to navigate forward in history.

- **reload:** `() => void` — Emitted when the `reload()` method is called to force remount the current route component.

## Example Usage

```vue
<script setup>
const onRouteChange = (to, from) => {
  console.log('Navigated from', from.path, 'to', to.path);
};

const onBeforeRouteChange = (to, from) => {
  console.log('About to navigate to', to.path);
  // Perform any pre-navigation logic here
};

const onRouteNotFound = (path) => {
  console.error('Route not found:', path);
};
</script>

<template>
  <PodRouter
    :routes="routes"
    @routeChange="onRouteChange"
    @beforeRouteChange="onBeforeRouteChange"
    @routeNotFound="onRouteNotFound"
  />
</template>
```

# Exposed by `<PodRouter>` when using `useTemplateRef`

Below are the public methods exposed by the `<PodRouter>` component.

- **back:** `() => void` — Navigate back in memory history. Only available when `history` prop is `'memory'`. Emits `back`.
- **forward:** `() => void` — Navigate forward in memory history. Only available when `history` prop is `'memory'`. Emits `forward`.
- **navigate:** `(path: string) | ({ url: string; replace?: boolean })` — Navigate to `path`. When called with an object, `replace: true` will replace the current history entry (memory history only). Emits `navigate` with the target path.
- **reload:** `() => void` — Force remount of the current route by incrementing an internal reload counter (memory history only). Emits `reload`.
- **clearHistory:** `() => void` — Clears the memory history stack and keeps the current path as the sole entry (memory history only).

Notes:

- The `v-model` binding (when used) syncs the current route path in memory history mode and can be used as an alternative way to programmatically navigate (setting the bound value updates the router).
- Navigation methods like `back`, `forward`, and `reload` are only applicable in memory history mode, as hash and history modes rely on the browser's native navigation behavior.

# `useRoute` Composable

The `useRoute` composable provides access to the current route information and navigation methods. It must be used within a component that is a child of the `<PodRouter>` component.

## Usage

```javascript
import { useRoute } from 'pod-router';

const route = useRoute();
```

## Properties and Methods

- **currentRoute:** `Route | null` — The current matched route object, containing `path`, `name`, `component`, and `children`. Returns `null` if no route is matched.
- **params:** `Record<string, string>` — An object containing the route parameters extracted from the path (e.g., for `/users/:id`, `params.id` would be the value).
- **path:** `string` — The current path string, including query parameters and hash if present.
- **meta:** `Record<string, any>` — An object for route metadata. Currently empty but can be extended for custom route metadata.
- **query:** `Record<string, string>` — An object containing the query parameters parsed from the URL (e.g., for `/path?a=1&b=2`, `query` would be `{a: '1', b: '2'}`).
- **hash:** `string | undefined` — The hash fragment of the URL (the part after `#`). Only relevant in hash history mode.
- **navigate:** `(path: string) => void` — Programmatically navigate to a new path. In memory history mode, this updates the internal history stack. In other modes, it updates the current path directly.
- **back:** `() => void` — Navigate back in history. In memory mode, this goes back in the internal history stack. In history mode, it uses `window.history.back()`.
- **forward:** `() => void` — Navigate forward in history. In memory mode, this goes forward in the internal history stack. In history mode, it uses `window.history.forward()`.
- **reload:** `() => void` — Force a reload of the current route component. In memory mode, this increments an internal counter to remount the component. In other modes, it triggers a full page reload.

## Notes

- The `navigate`, `back`, `forward`, and `reload` methods adapt their behavior based on the history mode set on the `<PodRouter>` component.
- Route parameters (`params`) are only populated for dynamic segments in the route path (e.g., `:id`).
- Query parameters and hash are parsed from the current path regardless of history mode.