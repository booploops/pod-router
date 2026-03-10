<script setup>
import DemoRouter from './components/DemoRouter.vue'
</script>

# &lt;PodRouter&gt; Component

The core of this package is the `<PodRouter>` component. It acts as the routing provider and view outlet all in one.

## Interactive Demo

Here is a live demo of the `PodRouter` running in **memory mode** right inside this VitePress documentation page!

<DemoRouter />

---

## Props

The component accepts the following properties (`PodRouterProps`):

| Prop        | Type                              | Default      | Description                                                                                          |
| ----------- | --------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `routes`    | `Route[]`                         | **Required** | An array of route objects defining the views to render.                                              |
| `history`   | `"memory" \| "hash" \| "history"` | `"hash"`     | Dictates the routing mechanism. `memory` is ideal for localized view state without changing the URL. |
| `startPath` | `string`                          | `undefined`  | The initial path when booting up in `memory` mode.                                                   |
| `v-model`   | `string`                          | `undefined`  | Allows two-way binding of the current path when in `memory` mode.                                    |

## Emits

The component emits several events allowing parent views to hook into the navigation lifecycle (`PodRouterEmits`).

| Emit                 | Arguments                          | Description                                                                                        |
| -------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| `@routeChange`       | `(to: Route, from: Route)`         | Fired immediately after the route has successfully changed.                                        |
| `@beforeRouteChange` | `(to: Route, from: Route \| null)` | Fired just before the route changes. `from` is null on initial load.                               |
| `@routeNotFound`     | `(path: string)`                   | Fired when the requested path does not map to any configured route and there is no fallback route. |
| `@navigate`          | `(path: string)`                   | Emitted when a manual navigation occurs.                                                           |
| `@back`              | `()`                               | Triggered when a backwards traversal occurs.                                                       |
| `@forward`           | `()`                               | Triggered when a forwards traversal occurs.                                                        |
| `@reload`            | `()`                               | Triggered when the current route component is forced to remount.                                   |

## Exposed Functions

The `<PodRouter>` instance exposes programmatic methods accessible via a template ref (`ref="myRouter"`).

These are particularly useful when operating in memory mode from outside the `<PodRouter>` tree. If you are inside the routing tree, use the [`useRoute` composable](./use-route.md) instead.

| Function       | Arguments        | Description                                                              |
| -------------- | ---------------- | ------------------------------------------------------------------------ |
| `navigate`     | `(path: string)` | Navigates to a new view based on the supplied path.                      |
| `back`         | `()`             | Steps back one level in the memory history stack.                        |
| `forward`      | `()`             | Steps forward one level in the memory history stack.                     |
| `reload`       | `()`             | Remounts the currently active component.                                 |
| `clearHistory` | `()`             | Wipes the existing routing stack retaining only the current active view. |

## Catch-All Routes

You can specify a fallback or catch-all route by defining a path of `'*'`. This is useful for building Not Found or 404 pages.

```javascript
const routes = [
  { path: "/", component: HomeView },
  { path: "*", component: NotFoundView },
];
```
