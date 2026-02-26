import type { FeatureRoute } from "@app/routing/routes";
import { ROUTE_DESCRIPTORS } from "@app/routing/routes";

const FEATURE_ROUTE_SET = new Set(ROUTE_DESCRIPTORS.map((route) => route.path));

export function isFeatureRoute(route: string): route is FeatureRoute {
  return FEATURE_ROUTE_SET.has(route as FeatureRoute);
}

export function routeFromHash(hashValue: string): FeatureRoute {
  const normalized = hashValue.startsWith("#") ? hashValue.slice(1) : hashValue;
  return isFeatureRoute(normalized) ? normalized : "/customer-360";
}
