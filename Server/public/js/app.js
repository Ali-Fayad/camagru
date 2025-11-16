import { AuthStorage } from "./auth.js";
import { DEFAULT_ROUTE, ROUTE_PATHS } from "./constants.js";
import { Router } from "./router.js";

const toneClass = (tone) => {
    switch (tone) {
        case "success":
            return "border-green-400";
        case "warning":
            return "border-amber-400";
        case "error":
            return "border-red-400";
        default:
            return "border-cam-gray";
    }
};

const mountToasts = () => {
    const host = document.getElementById("toast-root");
    if (!host) {
        return;
    }
    window.addEventListener("spa:toast", (event) => {
        const detail = event.detail ?? {};
        const toast = document.createElement("div");
        toast.className = `px-4 py-3 rounded-2xl shadow-lg text-sm bg-white border-l-4 ${toneClass(detail.tone)}`;
        toast.textContent = detail.message ?? "";
        host.appendChild(toast);
        setTimeout(() => toast.classList.add("opacity-0"), 3500);
        setTimeout(() => toast.remove(), 4000);
    });
};

const initNavigation = (router) => {
    document.addEventListener("click", (event) => {
        const target = event.target;
        const routeTrigger = target.closest?.("[data-route]");
        if (!routeTrigger) {
            return;
        }
        const route = routeTrigger.getAttribute("data-route");
        if (!route) {
            return;
        }
        event.preventDefault();
        router.navigate(route);
    });
};

const highlightActiveLinks = (activeRoute) => {
    const selectors = document.querySelectorAll("[data-route]");
    selectors.forEach((node) => {
        const route = node.getAttribute("data-route");
        const isActive = route === activeRoute;
        if (node.classList.contains("route-pill")) {
            node.classList.toggle("bg-cam-gray", isActive);
            node.classList.toggle("text-gray-900", isActive);
            node.classList.toggle("ring-2", isActive);
            node.classList.toggle("ring-cam-olive", isActive);
        } else {
            node.classList.toggle("text-cam-olive", isActive);
            node.classList.toggle("font-semibold", isActive);
        }
    });
};

const wireAuthButtons = (router) => {
    const loginButton = document.getElementById("login-btn");
    const logoutButton = document.getElementById("logout-btn");

    loginButton?.addEventListener("click", () => router.navigate(ROUTE_PATHS.login));
    logoutButton?.addEventListener("click", () => {
        AuthStorage.clear();
        router.navigate(ROUTE_PATHS.login);
    });

    const refreshButtons = () => {
        const isAuth = AuthStorage.isAuthenticated();
        if (loginButton) {
            loginButton.classList.toggle("hidden", isAuth);
        }
        if (logoutButton) {
            logoutButton.classList.toggle("hidden", !isAuth);
        }
    };

    refreshButtons();
    window.addEventListener("spa:route", refreshButtons);
};

const bootstrap = () => {
    const outlet = document.getElementById("app-root");
    if (!outlet) {
        console.error("Missing #app-root container");
        return;
    }

    const router = new Router(outlet);
    mountToasts();
    initNavigation(router);
    wireAuthButtons(router);

    window.addEventListener("spa:route", (event) => {
        const detail = event.detail;
        highlightActiveLinks(detail?.route ?? DEFAULT_ROUTE);
    });

    router.init();
    highlightActiveLinks(router.getCurrentRoute());
};

window.addEventListener("DOMContentLoaded", bootstrap);
