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
  try {
    debugging && console.log("getting file: ", location);
    return fetch(location).then((resopnse) => {
      return resopnse.text().then((text) => {
        return text;
      });
    });
  } catch (error) {
    console.log("couldn't get file: ", error);
    return "404";
  }
};

const render = (route: string) => {
  try {
    const validRoute = routes[route];
    const main = document.querySelector("body");
    debugging && console.log("rendering: ", route);
    debugging && console.log("valid route: ", validRoute);
    if (!main) return;
    if (!validRoute) {
      console.error(
        "404: no valid route found: ",
        route,
        " in routes: ",
        routes
      );
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
  } catch (error) {
    console.log("error while rendering: ", error);
  }
};

let params: boolean = false;
let debugging: boolean = false;

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

const getRoute = (): string => {
  let route = window.location.pathname;
  if (params) {
    const urlParams = new URLSearchParams(window.location.search);
    route = urlParams.get("route") || "/";
  }
  debugging && console.log("got route: ", route);
  return route;
};

window.onpopstate = () => {
  render(getRoute() || "/");
};

/**
 * initializes the router
 * @param useParams whether to use query parameters for routing
 * when using query parameters your route will be in the form of /?route=your-route
 */
const router = (useParams: boolean = false, debug: boolean = false) => {
  params = useParams;
  debugging = debug;
  debugging && console.log("router initialized");
  debugging && console.log(useParams ? "using params" : "using pathname");
  render(getRoute() || "/"); // render the initial route

  window.onpopstate = () => {
    render(getRoute() || "/");
  };
};

export default router;
