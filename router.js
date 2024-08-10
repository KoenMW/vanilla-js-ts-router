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
        return [2 /*return*/, fetch(location).then(function (resopnse) {
                return resopnse.text().then(function (text) {
                    return text;
                });
            })];
    });
}); };
exports.getFile = getFile;
var render = function (route) {
    var validRoute = routes[route];
    var main = document.querySelector("body");
    if (!main)
        return;
    if (!validRoute) {
        main.innerHTML = "404";
        return;
    }
    if (validRoute.condition && !validRoute.condition()) {
        if (validRoute.fallback)
            (0, exports.goTo)(validRoute.fallback);
        else {
            window.history.pushState({}, "", "/");
            render(window.location.pathname || "/");
        }
        return;
    }
    document.title = validRoute.title;
    if (validRoute.content) {
        validRoute.content.then(function (content) {
            main.innerHTML = content;
            if (validRoute.scripts) {
                validRoute.scripts.forEach(function (script) {
                    script();
                });
            }
        });
    }
    else {
        main.innerHTML = "";
        if (validRoute.scripts) {
            validRoute.scripts.forEach(function (script) {
                script();
            });
        }
    }
};
var params = false;
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
    console.log("getRoute called");
    var route = window.location.pathname;
    if (params) {
        var urlParams = new URLSearchParams(window.location.search);
        route = urlParams.get("route") || "/";
    }
    console.log("route: ", route);
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
var router = function (useParams) {
    if (useParams === void 0) { useParams = false; }
    console.log("router initialized");
    params = useParams;
    render(getRoute() || "/"); // render the initial route
    window.onpopstate = function () {
        render(getRoute() || "/");
    };
};
exports.default = router;
