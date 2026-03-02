<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, isVNode, provide, markRaw, defineAsyncComponent } from "vue";
import { createRouter, addRoute, findRoute } from "rou3";
import type { PodRouterProps, Route, UseRouteReturn } from "./types";

defineOptions({
  inheritAttrs: false
});

const props = withDefaults(defineProps<PodRouterProps>(), {
  history: 'memory',
});

/**
 * v-model used with memory history
 */
const currentRoute = defineModel<string>({
  required: false,
})

const emits = defineEmits<{
  routeChange: [to: Route, from: Route];
  beforeRouteChange: [to: Route, from: Route | null];
  routeNotFound: [path: string];
  navigate: [path: string];
  back: [];
  forward: [];
  reload: [];
}>()

// Initialize rou3 router
const routerInstance = ref(createRouter());

// Register all routes with rou3
const registerRoutes = (routes: Route[], parentPath = '') => {
  // Reset router by creating a new instance only on first call
  if (parentPath === '') {
    routerInstance.value = createRouter();
  }

  // Register all routes
  routes.forEach((route) => {
    // Construct full path by concatenating parent and child paths
    const fullPath = parentPath + route.path;

    // Handle async components (lazy loading)
    let component = route.component;
    if (typeof component === 'function' && !isVNode(component)) {
      // It's an async component loader, wrap it with defineAsyncComponent
      component = defineAsyncComponent(component as () => Promise<any>);
    }

    // Mark component as raw to prevent it from becoming reactive
    const routeWithRawComponent = {
      ...route,
      component: markRaw(component)
    };

    // Register the route with its full path using rou3's addRoute method
    addRoute(routerInstance.value, undefined, fullPath, routeWithRawComponent);

    // Recursively register child routes
    if (route.children && route.children.length > 0) {
      registerRoutes(route.children, fullPath);
    }
  });
};

// Initial route registration
registerRoutes(props.routes);

// Watch for route changes and re-register
watch(() => props.routes, (newRoutes) => {
  registerRoutes(newRoutes);
}, { deep: true });

// Get initial path based on history mode
const getInitialPath = (): string => {
  if (props.history === 'memory') {
    return currentRoute.value || props.startPath || '/';
  } else if (props.history === 'history') {
    // HTML5 History mode
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    } else {
      return '/';
    }
  } else {
    // Hash mode (default)
    if (typeof window !== 'undefined') {
      return window.location.hash.slice(1) || '/';
    } else {
      return '/';
    }
  }
};

// Reactive state for current path - initialize immediately to prevent 404 flash
const currentPath = ref<string>(getInitialPath());

// Memory mode: history stack for navigation
const historyStack = ref<string[]>([]);
const historyIndex = ref<number>(-1);
const isNavigatingHistory = ref<boolean>(false);
const isReplacing = ref<boolean>(false);

// Initialize history stack with the initial path for memory mode
if (props.history === 'memory') {
  historyStack.value = [currentPath.value];
  historyIndex.value = 0;
}

// Reload counter to force component remounting
const reloadCounter = ref<number>(0);

// Helper to normalize path (remove trailing slash for consistency)
const normalizePath = (path: string): string => {
  if (path !== '/' && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
};

// Helper to extract pathname from a path (removing query params and hash)
const extractPathname = (path: string): string => {
  return path.split('?')[0].split('#')[0];
};

// Update path from hash changes
const updateFromHash = () => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.slice(1) || '/';
    currentPath.value = hash;
  }
};

// Update path from history changes (popstate)
const updateFromHistory = () => {
  if (typeof window !== 'undefined') {
    currentPath.value = window.location.pathname || '/';
  }
};

// Set up navigation listeners
let hashChangeListener: (() => void) | null = null;
let popStateListener: (() => void) | null = null;

if (props.history === 'hash') {
  hashChangeListener = updateFromHash;
} else if (props.history === 'history') {
  popStateListener = updateFromHistory;
}

// Memory mode: sync v-model with internal state
if (props.history === 'memory') {
  // Watch v-model changes and update internal path
  watch(() => currentRoute.value, (newPath) => {
    if (newPath && !isNavigatingHistory.value) {
      currentPath.value = newPath;
    }
  });

  // Sync internal path changes back to v-model and manage history
  watch(currentPath, (newPath) => {
    if (currentRoute.value !== newPath) {
      currentRoute.value = newPath;
    }

    // Update history stack (only for non-history navigations)
    if (!isNavigatingHistory.value) {
      if (isReplacing.value) {
        // Replace current history entry
        if (historyIndex.value >= 0) {
          historyStack.value[historyIndex.value] = newPath;
        } else {
          historyStack.value.push(newPath);
          historyIndex.value = 0;
        }
      } else {
        // Remove any forward history when navigating to a new path
        historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
        historyStack.value.push(newPath);
        historyIndex.value = historyStack.value.length - 1;
      }
    }

    isNavigatingHistory.value = false;
    isReplacing.value = false;
  });
} else if (props.history === 'history') {
  // HTML5 History mode: sync internal path changes to window.history
  watch(currentPath, (newPath) => {
    if (typeof window !== 'undefined') {
      const currentPathname = window.location.pathname;
      if (currentPathname !== newPath) {
        window.history.pushState({}, '', newPath);
      }
    }
  });

  // History mode: also support v-model for programmatic navigation
  if (currentRoute.value !== undefined) {
    watch(() => currentRoute.value, (newPath) => {
      if (newPath && newPath !== currentPath.value) {
        currentPath.value = newPath;
      }
    });

    // Sync back to v-model
    watch(currentPath, (newPath) => {
      if (currentRoute.value !== newPath) {
        currentRoute.value = newPath;
      }
    });
  }
} else {
  // Hash mode: sync internal path changes to window.location.hash
  watch(currentPath, (newPath) => {
    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash.slice(1) || '/';
      if (currentHash !== newPath) {
        window.location.hash = newPath;
      }
    }
  });

  // Hash mode: also support v-model for programmatic navigation
  if (currentRoute.value !== undefined) {
    watch(() => currentRoute.value, (newPath) => {
      if (newPath && newPath !== currentPath.value) {
        currentPath.value = newPath;
      }
    });

    // Sync back to v-model
    watch(currentPath, (newPath) => {
      if (currentRoute.value !== newPath) {
        currentRoute.value = newPath;
      }
    });
  }
}

// Navigation functions for memory mode
const back = () => {
  if (props.history !== 'memory') {
    console.warn('back() is only available in memory history mode');
    return;
  }

  if (historyIndex.value > 0) {
    isNavigatingHistory.value = true;
    historyIndex.value--;
    currentPath.value = historyStack.value[historyIndex.value];
    emits('back');
  }
};

const forward = () => {
  if (props.history !== 'memory') {
    console.warn('forward() is only available in memory history mode');
    return;
  }

  if (historyIndex.value < historyStack.value.length - 1) {
    isNavigatingHistory.value = true;
    historyIndex.value++;
    currentPath.value = historyStack.value[historyIndex.value];
    emits('forward');
  }
};

const navigate = (options: string | { url: string; replace?: boolean }) => {
  if (props.history !== 'memory') {
    console.warn('navigate() is only available in memory history mode');
    return;
  }

  // Support string parameter or new options object
  const url = typeof options === 'string' ? options : options.url;
  const replace = typeof options === 'object' ? options.replace : false;

  if (replace) {
    isReplacing.value = true;
  }

  currentPath.value = url;
  emits('navigate', url);
};

const clearHistory = () => {
  if (props.history !== 'memory') {
    console.warn('clearHistory() is only available in memory history mode');
    return;
  }

  const currentPath_ = currentPath.value;
  historyStack.value = [currentPath_];
  historyIndex.value = 0;
};

const reload = () => {
  if (props.history !== 'memory') {
    console.warn('reload() is only available in memory history mode');
    return;
  }

  // Increment reload counter to force component remounting
  reloadCounter.value++;
  emits('reload');
};

/**
 * Provides a way for child components to access the current route and navigation functions
 * Inspired heavily by vue-router's useRoute() and useRouter() composables
 */
function useRoute(): UseRouteReturn {
  // Parse query parameters from current path
  const parseQuery = (path: string): Record<string, string> => {
    const url = new URL(path, 'http://dummy.com');
    const query: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  };

  // Get hash from current path (for hash mode)
  const getHash = (): string | undefined => {
    if (props.history === 'hash' && typeof window !== 'undefined') {
      return window.location.hash.slice(1).split('#')[1];
    }
    return undefined;
  };

  return {
    get currentRoute() {
      return matchedRoute.value ? {
        path: matchedRoute.value.path,
        name: matchedRoute.value.name,
        component: matchedRoute.value.component,
        children: matchedRoute.value.children,
      } : null;
    },
    get params() {
      return matchedRoute.value?.params || {};
    },
    get path() {
      return extractPathname(currentPath.value);
    },
    get fullPath() {
      return currentPath.value;
    },
    get meta() {
      return matchedRoute.value?.meta || {};
    },
    get query() {
      return parseQuery(currentPath.value);
    },
    get hash() {
      return getHash();
    },
    navigate: (path: string) => {
      if (props.history === 'memory') {
        navigate(path);
      } else {
        // For hash/history modes, update currentPath directly
        currentPath.value = path;
        emits('navigate', path);
      }
    },
    back: () => {
      if (props.history === 'memory') {
        back();
      } else if (props.history === 'history' && typeof window !== 'undefined') {
        window.history.back();
        emits('back');
      }
    },
    forward: () => {
      if (props.history === 'memory') {
        forward();
      } else if (props.history === 'history' && typeof window !== 'undefined') {
        window.history.forward();
        emits('forward');
      }
    },
    reload: () => {
      if (props.history === 'memory') {
        reload();
      } else {
        // For other modes, trigger a page reload
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        emits('reload');
      }
    },
  };
}

provide('use-route-payload', useRoute());

// Expose navigation functions
defineExpose({
  back,
  forward,
  navigate,
  reload,
  clearHistory,
});

// Match current route and extract params
const matchedRoute = computed(() => {
  // Access reloadCounter to track it as a dependency
  reloadCounter.value;

  // Extract pathname without query parameters or hash
  const pathname = extractPathname(currentPath.value);
  const normalizedPath = normalizePath(pathname);
  const match = findRoute(routerInstance.value, undefined, normalizedPath);

  if (match) {
    const route = match.data as Route;
    const component = route.component;
    const isVNodeComponent = isVNode(component);

    // If the component is a VNode (from h()), wrap it in a component definition
    const wrappedComponent = isVNodeComponent
      ? markRaw({ render: () => component })
      : component;

    // Only pass params to proper components, not wrapped VNodes
    // VNodes can't receive props, and wildcard routes may have invalid param names like '*'
    return {
      component: wrappedComponent,
      params: isVNodeComponent ? {} : (match.params || {}),
      name: route.name,
      path: route.path,
      children: route.children,
      meta: route.meta,
      props: route.props,
    };
  }

  // Fallback: look for catch-all route with path='*'
  const fallbackRoute = props.routes.find(r => r.path === '*');
  if (fallbackRoute) {
    let component = fallbackRoute.component;

    // Handle async components (lazy loading)
    if (typeof component === 'function' && !isVNode(component)) {
      component = defineAsyncComponent(component as () => Promise<any>);
    }

    component = markRaw(component);
    const wrappedComponent = isVNode(component)
      ? markRaw({ render: () => component })
      : component;

    return {
      component: wrappedComponent,
      params: {},
      name: fallbackRoute.name,
      path: fallbackRoute.path,
      children: fallbackRoute.children,
      meta: fallbackRoute.meta,
      props: fallbackRoute.props,
    };
  }

  return null;
});

// Compute the props to apply to the component based on route.props
const componentProps = computed(() => {
  if (!matchedRoute.value) return {};

  const routeProps = matchedRoute.value.props;
  if (!routeProps) {
    // If no props defined, only pass params
    return matchedRoute.value.params;
  }

  // If props is a function, call it with the route
  if (typeof routeProps === 'function') {
    const route: Route = {
      path: matchedRoute.value.path,
      name: matchedRoute.value.name,
      component: matchedRoute.value.component,
      children: matchedRoute.value.children,
      meta: matchedRoute.value.meta,
      props: matchedRoute.value.props,
    };
    return { ...matchedRoute.value.params, ...routeProps(route) };
  }

  // If props is an object, merge it with params
  return { ...matchedRoute.value.params, ...routeProps };
});

// Emit route-change event when route changes
watch(matchedRoute, (newRoute, oldRoute) => {
  if (newRoute && oldRoute) {
    // Create Route objects for the emit (without the computed wrapper properties)
    const to: Route = {
      path: newRoute.path,
      name: newRoute.name,
      component: newRoute.component,
      children: newRoute.children,
      meta: newRoute.meta,
      props: newRoute.props,
    };

    const from: Route = {
      path: oldRoute.path,
      name: oldRoute.name,
      component: oldRoute.component,
      children: oldRoute.children,
      meta: oldRoute.meta,
      props: oldRoute.props,
    };

    emits('beforeRouteChange', to, from);
    emits('routeChange', to, from);
  } else if (newRoute && !oldRoute) {
    // Initial route
    const to: Route = {
      path: newRoute.path,
      name: newRoute.name,
      component: newRoute.component,
      children: newRoute.children,
      meta: newRoute.meta,
      props: newRoute.props,
    };

    emits('beforeRouteChange', to, null);

    // Create a minimal "from" route for initial navigation
    const from: Route = {
      path: '',
      component: newRoute.component, // Dummy component to satisfy type
    };

    emits('routeChange', to, from);
  } else if (!newRoute && oldRoute) {
    // Route not found
    emits('routeNotFound', currentPath.value);
  } else if (!newRoute && !oldRoute) {
    // Initial route not found
    emits('routeNotFound', currentPath.value);
  }
});

onMounted(() => {
  if (hashChangeListener && typeof window !== 'undefined') {
    window.addEventListener('hashchange', hashChangeListener);
  }

  if (popStateListener && typeof window !== 'undefined') {
    window.addEventListener('popstate', popStateListener);
  }
});

onUnmounted(() => {
  if (hashChangeListener && typeof window !== 'undefined') {
    window.removeEventListener('hashchange', hashChangeListener);
  }

  if (popStateListener && typeof window !== 'undefined') {
    window.removeEventListener('popstate', popStateListener);
  }
});
</script>

<template>
  <slot
    v-if="matchedRoute"
    :Component="matchedRoute.component"
    :route="{ name: matchedRoute.name, path: currentPath, params: matchedRoute.params, meta: matchedRoute.meta, key: `${currentPath}-${reloadCounter}` }"
    :props="componentProps"
  >
    <component
      :is="matchedRoute.component"
      v-bind="componentProps"
      :key="`${currentPath}-${reloadCounter}`"
    />
  </slot>
</template>