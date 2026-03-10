# Types

`@booploops/pod-router` exports strict TypeScript interfaces to guarantee type safety throughout your app.

---

## Route

The definition of a single route.

```typescript
export type Route = {
  path: string;
  name?: string;
  component: Component | (() => Promise<any>);
  children?: Route[];
  /**
   * Component props passed to the route component.
   * Can be an object or a function that returns an object.
   */
  props?: Record<string, any> | ((route: Route) => Record<string, any>);
  /**
   * Arbitrary metadata that can be attached to the route.
   * This can be used for things like route guards, titles, etc.
   */
  meta?: Record<string, any>;
};
```

---

## PodRouterProps

Props accepted by the `<PodRouter>` component.

```typescript
export type PodRouterProps = {
  routes: Route[];
  /**
   * The type of history to use:
   * - "hash": Uses URL hash (#/path) to track routes
   * - "memory": Keeps routes in memory without URL changes
   * - "history": Uses HTML5 History API (pushState) for clean URLs
   * The default is "hash".
   */
  history?: "hash" | "memory" | "history";
  /**
   * Initial path to start with when using memory history
   */
  startPath?: string;
};
```

---

## PodRouterEmits

Events emitted by the `<PodRouter>` component.

```typescript
export type PodRouterEmits = {
  (e: "routeChange", to: Route, from: Route): void;
  (e: "beforeRouteChange", to: Route, from: Route | null): void;
  (e: "routeNotFound", path: string): void;
  (e: "navigate", path: string): void;
  (e: "back"): void;
  (e: "forward"): void;
  (e: "reload"): void;
};
```

---

## UseRouteReturn

The object returned by the `useRoute()` composable.

```typescript
export type UseRouteReturn = {
  currentRoute: Route | null;
  params: Record<string, string>;
  /**
   * Path of the current route, e.g. "/dashboard/profile/123"
   */
  path: string;
  /**
   * Entire path including query and hash, e.g. "/dashboard/profile/123?tab=info#section1"
   */
  fullPath: string;
  meta: Record<string, any>;
  query: Record<string, string>;
  hash?: string;
  navigate: (path: string) => void;
  back: () => void;
  forward: () => void;
  reload: () => void;
};
```
