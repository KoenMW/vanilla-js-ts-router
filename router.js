let routes = {};
/**
 * sets the routes is required to be called before using the router
 * @param newRoutes the new routes
 */
export const setRoutes = (newRoutes) => {
    routes = newRoutes;
};
/**
 * gets the content of a file from the public folder
 * @param location the location of the file from the public folder
 * @returns Promise<string> the content of the file
 */
export const getFile = async (location) => {
    try {
        debugging && console.log("getting file: ", location);
        return fetch(location).then((resopnse) => {
            return resopnse.text().then((text) => {
                return text;
            });
        });
    }
    catch (error) {
        console.log("couldn't get file: ", error);
        return "404";
    }
};
const render = async (route) => {
    try {
        const validRoute = routes[route];
        const main = document.querySelector("body");
        debugging && console.log("rendering: ", route);
        debugging && console.log("valid route: ", validRoute);
        if (!main)
            return;
        if (!validRoute) {
            console.error("404: no valid route found: ", route, " in routes: ", routes);
            main.innerHTML = "404";
            return;
        }
        if (validRoute.condition && !validRoute.condition()) {
            if (validRoute.fallback)
                await goTo(validRoute.fallback);
            else {
                window.history.pushState({}, "", "/");
                await render(window.location.pathname || "/");
            }
            return;
        }
        document.title = validRoute.title;
        if (validRoute.content) {
            validRoute.content.then((content) => {
                main.innerHTML = content;
                if (validRoute.scripts) {
                    validRoute.scripts.forEach(async (script) => {
                        await script();
                    });
                }
            });
        }
        else {
            main.innerHTML = "";
            if (validRoute.scripts) {
                validRoute.scripts.forEach((script) => {
                    script();
                });
            }
        }
    }
    catch (error) {
        console.log("error while rendering: ", error);
    }
};
let params = false;
let debugging = false;
/**
 * sets the route to go to
 * @param route the route to go to
 */
export const goTo = async (route) => {
    history.pushState({}, "", route);
    await render(route);
};
/**
 * gets the value of a parameter from the url
 * @param name the name of the parameter
 * @returns the value of the parameter
 */
export const getParam = (name) => {
    return new URLSearchParams(window.location.search).get(name);
};
const getRoute = () => {
    let route = window.location.pathname;
    if (params) {
        const urlParams = new URLSearchParams(window.location.search);
        route = urlParams.get("route") || "/";
    }
    debugging && console.log("got route: ", route);
    return route;
};
window.onpopstate = async () => {
    await render(getRoute() || "/");
};
/**
 * initializes the router
 * @param useParams whether to use query parameters for routing
 * when using query parameters your route will be in the form of /?route=your-route
 */
const router = async (useParams = false, debug = false) => {
    params = useParams;
    debugging = debug;
    debugging && console.log("router initialized");
    debugging && console.log(useParams ? "using params" : "using pathname");
    await render(getRoute() || "/"); // render the initial route
    window.onpopstate = async () => {
        await render(getRoute() || "/");
    };
};
export default router;
