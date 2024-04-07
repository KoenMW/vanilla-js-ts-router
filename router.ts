let routes: Routes = {};

/**
 * sets the routes is required to be called before using the router
 * @param newRoutes the new routes
 */
export const setRoutes = (newRoutes: Routes) => {
  routes = newRoutes;
};

/**
 * Defines the structure of the routes in the application.
 * @property key: The unique identifier for the route.
 * @property title: The title of the route.
 * @property content: A promise that resolves with the content for the route. This could be a file from the public folder.
 * @property scripts: An array of functions to be executed when the route is accessed.
 * @property condition: A function that returns a boolean to determine if the route should be accessible.
 * @property fallback: The key of the fallback route if the condition for this route fails.
 * @typedef Routes
 * @example
 * const routes: Routes = {
 *  '/': {
 *      title: 'Home',
 *      content: getFile('/home.html'),
 *      scripts: [() => import("./home").then((module) => module.default())],
 *      condition: () => true,
 *      fallback: '/login',
 *  },
 */
export type Routes = {
  [key: string]: {
    title: string;
    content?: Promise<string>;
    scripts?: (() => void)[];
    condition?: () => boolean;
    fallback?: string;
  };
};

/**
 * gets the content of a file from the public folder
 * @param location the location of the file from the public folder
 * @returns Promise<string> the content of the file
 */
export const getFile = async (location: string): Promise<string> => {
  return fetch(location).then((resopnse) => {
    return resopnse.text().then((text) => {
      return text;
    });
  });
};

const render = (route: string) => {
  const validRoute = routes[route];
  const main = document.querySelector("body");
  if (!main) return;
  if (!validRoute) {
    main.innerHTML = "404";
    return;
  }
  if (validRoute.condition && !validRoute.condition()) {
    if (validRoute.fallback) goTo(validRoute.fallback);
    else {
      window.history.pushState({}, "", "/");
      render(window.location.pathname || "/");
    }
    return;
  }
  document.title = validRoute.title;
  if (validRoute.content) {
    validRoute.content.then((content) => {
      main.innerHTML = content;
      if (validRoute.scripts) {
        validRoute.scripts.forEach((script) => {
          script();
        });
      }
    });
  } else {
    main.innerHTML = "";
    if (validRoute.scripts) {
      validRoute.scripts.forEach((script) => {
        script();
      });
    }
  }
};

/**
 * sets the route to go to
 * @param route the route to go to
 */
export const goTo = (route: string) => {
  history.pushState({}, "", route);
  render(route);
};

/**
 * gets the value of a parameter from the url
 * @param name the name of the parameter
 * @returns the value of the parameter
 */
export const getParam = (name: string) => {
  return new URLSearchParams(window.location.search).get(name);
};

window.onpopstate = () => {
  render(window.location.pathname || "/");
};

/**
 * initializes the router
 */
const router = () => {
  render(window.location.pathname || "/"); // render the initial route

  window.onpopstate = () => {
    render(window.location.pathname || "/");
  };
};

export default router;
