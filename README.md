# Basic Javascript and TypeScript Router

This is a simple router for a vanilla Javascript and TypeScript frontend. It allows you to define routes with associated content, scripts, conditions, and fallbacks.
Can also use search params if you want to use it for something like github pages

## installation

```bash
npm i basic-ts-router
```

## Usage

```typescript
import router, { setRoutes, getFile } from "basic-ts-router";
// getFile gets our html file from your public folder

const routes: Routes = {
  "/": {
    title: "Home",
    content: getFile("/home.html"),
    scripts: [() => import("./home").then((module) => module.default())], // you can also use the method directly but I prever dinamic importing
    condition: () => true,
    fallback: "/login",
  },
  // ... more routes
};

setRoutes(routes);

router();
```
