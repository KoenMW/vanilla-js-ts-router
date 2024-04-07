# Basic Javascript and TypeScript Router

This is a simple router for a vanilla Javascript and TypeScript frontend. It allows you to define routes with associated content, scripts, conditions, and fallbacks.

## installation

```bash
npm i basic-ts-router
```

## Usage

First, define your routes:

```typescript
import router, { setRoutes } from "basic-ts-router";

const routes: Routes = {
  "/": {
    title: "Home",
    content: getFile("/home.html"),
    scripts: [() => import("./home").then((module) => module.default())],
    condition: () => true,
    fallback: "/login",
  },
  // ... more routes
};

setRoutes(routes);

router();
```
