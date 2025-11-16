import { AuthStorage } from "./auth.js";
import { DEFAULT_ROUTE, PUBLIC_ROUTES, ROUTE_PATHS } from "./constants.js";
import { HomePage } from "./pages/home.js";
import { GalleryPage } from "./pages/gallery.js";
import { LoginPage } from "./pages/login.js";
import { SignupPage } from "./pages/signup.js";
import { PostPage } from "./pages/post.js";
import { SettingsPage } from "./pages/settings.js";
import { PasswordPage } from "./pages/password.js";

const registeredPages = [
    HomePage,
    GalleryPage,
    PostPage,
    SettingsPage,
    LoginPage,
    SignupPage,
    PasswordPage
];

export class Router {
    constructor(outlet) {
        this.outlet = outlet;
        this.routes = new Map();
        registeredPages.forEach((page) => this.routes.set(page.route, page));
    }

    init() {
        window.addEventListener("hashchange", () => this.handleRouteChange());
        this.handleRouteChange();
    }

    navigate(route) {
        if (!route) {
            return;
        }
        if (this.getCurrentRoute() === route) {
            this.render(route);
            return;
        }
        window.location.hash = `#${route}`;
    }

    getCurrentRoute() {
        return window.location.hash.replace("#", "") || DEFAULT_ROUTE;
    }

    handleRouteChange() {
        const route = this.getCurrentRoute();
        this.render(route);
    }

    render(route) {
        const module = this.routes.get(route) ?? this.routes.get(DEFAULT_ROUTE);
        if (!module) {
            console.warn("Route not registered", route);
            return;
        }

        const shouldProtect = module.requiresAuth && !PUBLIC_ROUTES.includes(route);
        if (shouldProtect && !AuthStorage.isAuthenticated()) {
            this.navigate(ROUTE_PATHS.login);
            this.showToast("Please log in to continue");
            return;
        }

        this.outlet.innerHTML = module.render();
        module.bind(this.outlet);
        document.title = module.title;
        window.dispatchEvent(new CustomEvent("spa:route", { detail: { route } }));
    }

    showToast(message) {
        window.dispatchEvent(new CustomEvent("spa:toast", { detail: { message, tone: "warning" } }));
    }
}
