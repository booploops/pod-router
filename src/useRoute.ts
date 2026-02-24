import { inject } from 'vue';
import type { UseRouteReturn } from './types';

/**
 * Composable to access the current route and navigation functions.
 * Must be used within a component that is a child of PodRouter.
 *
 * @returns {UseRouteReturn} Object containing current route information and navigation methods
 */
export function useRoute(): UseRouteReturn {
  const routeData = inject<UseRouteReturn>('use-route-payload');

  if (!routeData) {
    throw new Error('useRoute must be used within a component that is a child of PodRouter');
  }

  return routeData;
}