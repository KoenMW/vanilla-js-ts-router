"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = exports.goTo = exports.getFile = exports.setRoutes = void 0;
var routes = {};
/**
 * sets the routes is required to be called before using the router
 * @param newRoutes the new routes
 */
var setRoutes = function (newRoutes) {
    routes = newRoutes;
};
exports.setRoutes = setRoutes;
/**
 * gets the content of a file from the public folder
 * @param location the location of the file from the public folder
 * @returns Promise<string> the content of the file
 */
var getFile = function (location) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            debugging && console.log("getting file: ", location);
            return [2 /*return*/, fetch(location).then(function (resopnse) {
                    return resopnse.text().then(function (text) {
                        return text;
                    });
                })];
        }
        catch (error) {
            console.log("couldn't get file: ", error);
            return [2 /*return*/, "404"];
        }
        return [2 /*return*/];
    });
}); };
exports.getFile = getFile;
var render = function (route) {
    try {
        var validRoute_1 = routes[route];
        var main_1 = document.querySelector("body");
        debugging && console.log("rendering: ", route);
        debugging && console.log("valid route: ", validRoute_1);
        if (!main_1)
            return;
        if (!validRoute_1) {
            console.error("404: no valid route found: ", route, " in routes: ", routes);
            main_1.innerHTML = "404";
            return;
        }
        if (validRoute_1.condition && !validRoute_1.condition()) {
            if (validRoute_1.fallback)
                (0, exports.goTo)(validRoute_1.fallback);
            else {
                window.history.pushState({}, "", "/");
                render(window.location.pathname || "/");
            }
            return;
        }
        document.title = validRoute_1.title;
        if (validRoute_1.content) {
            validRoute_1.content.then(function (content) {
                main_1.innerHTML = content;
                if (validRoute_1.scripts) {
                    validRoute_1.scripts.forEach(function (script) {
                        script();
                    });
                }
            });
        }
        else {
            main_1.innerHTML = "";
            if (validRoute_1.scripts) {
                validRoute_1.scripts.forEach(function (script) {
                    script();
                });
            }
        }
    }
    catch (error) {
        console.log("error while rendering: ", error);
    }
};
var params = false;
var debugging = false;
/**
 * sets the route to go to
 * @param route the route to go to
 */
var goTo = function (route) {
    history.pushState({}, "", route);
    render(route);
};
exports.goTo = goTo;
/**
 * gets the value of a parameter from the url
 * @param name the name of the parameter
 * @returns the value of the parameter
 */
var getParam = function (name) {
    return new URLSearchParams(window.location.search).get(name);
};
exports.getParam = getParam;
var getRoute = function () {
    var route = window.location.pathname;
    if (params) {
        var urlParams = new URLSearchParams(window.location.search);
        route = urlParams.get("route") || "/";
    }
    debugging && console.log("got route: ", route);
    return route;
};
window.onpopstate = function () {
    render(getRoute() || "/");
};
/**
 * initializes the router
 * @param useParams whether to use query parameters for routing
 * when using query parameters your route will be in the form of /?route=your-route
 */
var router = function (useParams, debug) {
    if (useParams === void 0) { useParams = false; }
    if (debug === void 0) { debug = false; }
    params = useParams;
    debugging = debug;
    debugging && console.log("router initialized");
    render(getRoute() || "/"); // render the initial route
    window.onpopstate = function () {
        render(getRoute() || "/");
    };
};
exports.default = router;
