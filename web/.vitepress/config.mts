import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "content",
  base: "/pod-router/",

  title: "pod-router",
  description: "pod-router Documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/getting-started" },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "&lt;PodRouter&gt;", link: "/pod-router" },
          { text: "useRoute", link: "/use-route" },
          { text: "Types", link: "/types" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/booploops/pod-router" },
    ],
  },
});
