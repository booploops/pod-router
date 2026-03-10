<p align="center">
    <img width="945" height="250" alt="pod-router Banner" src="https://github.com/user-attachments/assets/cf9ff07f-89b4-4f5d-9e9b-dfa87c17c94f" />
</p>

# pod-router

**This project is still in early development.**

Self-contained lightweight component level router for Vue 3 Single Page Applications.

Built using [h3js/rou3](https://github.com/h3js/rou3) for efficient route matching and navigation.

## Installation

```bash
# Using npm
npm install @booploops/pod-router
# Using yarn
yarn add @booploops/pod-router
# Using pnpm
pnpm add @booploops/pod-router
# Using bun
bun add @booploops/pod-router
```

## Documentation (WIP)

<p>
    <ul>
        <li><a href="https://booploops.github.io/pod-router/">Documentation</a></li>
        <li><a href="docs/Examples.md">Code Examples</a></li>
    </ul>
</p>

## Features

- Supports hash, memory, and history-push navigation modes.
- Hash and History can use multiple Memory based routers for nested routing scenarios.
- Provides a `useRoute` composable for easy access to the current route and navigation functions.
- Emits events for route changes, allowing for custom logic before and after navigation.
- Route definitions inspired by Vue Router
- Supports lazy loading of route components via dynamic imports.
- Allows for dynamically updating routes at runtime.

## Use Cases

- **Component-Level Routing**: Ideal for applications that require routing within specific components or sections, without the need for a global router.
- **Tabbed Interfaces**: Great for implementing tabbed interfaces where each tab corresponds to a different route or view.
- **Memory-Based Navigation**: Suitable for scenarios where you want to manage navigation state in memory, such as in modals, tabs, or embedded widgets.
- **Lightweight Routing**: Perfect for projects that need a simple routing solution without the overhead of a full-featured router like Vue Router.

## 🚦 Roadmap

- [ ] Implement scroll tracking and restoration on route changes.
- [ ] Add support for using parent routes as layout components (similar to Vue Router's nested routes).
  - Possibly as an explicit `layout` property on route definitions that wraps the route component.

## Development

- Install dependencies:

```bash
pnpm install
```

- Run the playground:

```bash
pnpm run play
```

- Build the library:

```bash
pnpm run build
```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
