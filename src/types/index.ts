import type { Component } from "vue";

export type Route = {
  path: string;
  name?: string;
  component: Component | (() => Promise<any>);
  children?: Route[];
};

export type UseRouteReturn = {
  currentRoute: Route | null;
  params: Record<string, string>;
  path: string;
  meta: Record<string, any>;
  query: Record<string, string>;
  hash?: string;
  navigate: (path: string) => void;
  back: () => void;
  forward: () => void;
  reload: () => void;
}

export type PodRouterEmits = {
  (e: "routeChange", to: Route, from: Route): void;
  (e: "beforeRouteChange", to: Route, from: Route | null): void;
  (e: "routeNotFound", path: string): void;
  (e: "navigate", path: string): void;
  (e: "back"): void;
  (e: "forward"): void;
  (e: "reload"): void;
};

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
