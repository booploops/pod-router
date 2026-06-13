import packageJson from "../package.json" assert { type: "json" };

export { default as PodRouter } from "./PodRouter.vue";
export { useRoute } from "./useRoute";
export * from "./types";

export const VERSION = packageJson.version;
