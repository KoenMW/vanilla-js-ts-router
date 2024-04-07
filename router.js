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
    return fetch(location).then((resopnse) => {
        return resopnse.text().then((text) => {
            return text;
        });
    });
};
const render = (route) => {
    const validRoute = routes[route];
    const main = document.querySelector("body");
    if (!main)
        return;
    if (!validRoute) {
        main.innerHTML = "404";
        return;
    }
    if (validRoute.condition && !validRoute.condition()) {
        if (validRoute.fallback)
            goTo(validRoute.fallback);
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
    }
    else {
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
export const goTo = (route) => {
    history.pushState({}, "", route);
    render(route);
};
/**
 * gets the value of a parameter from the url
 * @param name the name of the parameter
 * @returns the value of the parameter
 */
export const getParam = (name) => {
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
