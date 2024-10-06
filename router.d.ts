/**
 * sets the routes is required to be called before using the router
 * @param newRoutes the new routes
 */
export declare const setRoutes: (newRoutes: Routes) => void;
type functionType = () => void | Promise<void>;
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
        scripts?: functionType[];
        condition?: () => boolean;
        fallback?: string;
    };
};
/**
 * gets the content of a file from the public folder
 * @param location the location of the file from the public folder
 * @returns Promise<string> the content of the file
 */
export declare const getFile: (location: string) => Promise<string>;
/**
 * sets the route to go to
 * @param route the route to go to
 */
export declare const goTo: (route: string) => Promise<void>;
/**
 * gets the value of a parameter from the url
 * @param name the name of the parameter
 * @returns the value of the parameter
 */
export declare const getParam: (name: string) => string | null;
/**
 * initializes the router
 * @param useParams whether to use query parameters for routing
 * when using query parameters your route will be in the form of /?route=your-route
 */
declare const router: (useParams?: boolean, debug?: boolean) => Promise<void>;
export default router;
