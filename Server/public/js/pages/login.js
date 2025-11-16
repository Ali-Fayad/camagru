import { Api } from "../api.js";
import { AuthStorage } from "../auth.js";
import { ROUTE_PATHS } from "../constants.js";
import { Toast } from "../ui.js";

export const LoginPage = {
    route: "login",
    title: "Camagru | Login",
    requiresAuth: false,
    render: () => `
        <section class="flex justify-center">
            <div class="w-full max-w-md rounded-xl border border-cam-gray bg-white p-8 shadow-lg shadow-cam-tan/20">
                <div class="flex flex-col gap-8">
                    <div class="text-center">
                        <p class="text-xs uppercase tracking-[0.4em] text-cam-olive">Welcome back</p>
                        <h1 class="mt-3 text-3xl font-black text-gray-900">Login to your account</h1>
                        <p class="mt-2 text-sm text-gray-500">Please enter your credentials to continue creating.</p>
                    </div>
                    <form id="login-form" class="flex flex-col gap-6">
                        <label class="flex flex-col gap-2 text-sm font-medium text-gray-900">
                            Email address
                            <input type="email" name="email" required placeholder="you@example.com" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-3 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                        </label>
                        <label class="flex flex-col gap-2 text-sm font-medium text-gray-900">
                            <div class="flex items-center justify-between">
                                <span>Password</span>
                                <button type="button" data-route="password" class="text-xs font-semibold text-gray-500 hover:text-cam-olive">Forgot password?</button>
                            </div>
                            <input type="password" name="password" required placeholder="••••••••" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-3 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                        </label>
                        <button type="submit" class="rounded-lg bg-cam-olive py-3 text-sm font-semibold text-white hover:bg-opacity-90">Sign in</button>
                    </form>
                    <p class="text-center text-sm text-gray-500">
                        Don't have an account?
                        <button class="font-semibold text-cam-olive" data-route="signup">Sign up</button>
                    </p>
                </div>
            </div>
        </section>
    `,
    bind: (root) => {
        const form = root.querySelector("#login-form");
        if (!form) {
            return;
        }
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const payload = {
                email: (formData.get("email") ?? "").toString().trim(),
                password: (formData.get("password") ?? "").toString().trim()
            };
            if (!payload.email || !payload.password) {
                Toast.push("Email and password are required", "warning");
                return;
            }
            const response = await Api.login(payload);
            const user = response.user;
            const token = typeof response.token === "string" ? response.token : undefined;
            if (response.status === "success" && user) {
                AuthStorage.setSession(user, token);
                Toast.push("Welcome back!", "success");
                window.location.hash = `#${ROUTE_PATHS.home}`;
            } else {
                Toast.push(response.message ?? "Login failed", "error");
            }
        });
    }
};
