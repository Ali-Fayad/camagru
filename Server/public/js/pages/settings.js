import { Api } from "../api.js";
import { AuthStorage } from "../auth.js";
import { ROUTE_PATHS } from "../constants.js";
import { Toast } from "../ui.js";

export const SettingsPage = {
    route: "settings",
    title: "Camagru | Settings",
    requiresAuth: true,
    render: () => {
        const user = AuthStorage.getUser();
        return `
            <section class="max-w-2xl mx-auto flex flex-col gap-8">
                <div class="rounded-xl border border-cam-gray bg-white p-6 text-center shadow-lg shadow-cam-tan/20">
                    <p class="text-xs uppercase tracking-[0.4em] text-cam-olive">Control room</p>
                    <h1 class="mt-3 text-3xl font-black text-gray-900">Account settings</h1>
                    <p class="mt-2 text-sm text-gray-500">Manage your identity, emails, and access in one place.</p>
                </div>
                <form id="settings-form" class="rounded-xl border border-cam-gray bg-white p-6 space-y-5">
                    <label class="flex flex-col gap-2 text-sm font-semibold text-gray-900">
                        Username
                        <input type="text" name="username" value="${user?.username ?? ""}" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-2.5 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                    </label>
                    <label class="flex flex-col gap-2 text-sm font-semibold text-gray-900">
                        Email address
                        <input type="email" name="email" value="${user?.email ?? ""}" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-2.5 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                    </label>
                    <label class="flex flex-col gap-2 text-sm font-semibold text-gray-900">
                        Change password
                        <input type="password" name="password" placeholder="New password" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-2.5 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                    </label>
                    <label class="flex items-center gap-3 text-sm font-semibold text-gray-900">
                        <input type="checkbox" class="peer sr-only" data-email-toggle />
                        <span class="relative inline-flex h-6 w-11 items-center rounded-full bg-cam-gray transition-colors peer-checked:bg-cam-olive">
                            <span class="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></span>
                        </span>
                        Email notifications
                    </label>
                    <button type="submit" class="w-full rounded-full bg-cam-olive py-3 text-sm font-semibold text-white hover:bg-opacity-90">Save changes</button>
                </form>
                <div class="grid gap-4 sm:grid-cols-3">
                    <button data-send-verification class="rounded-xl border border-cam-gray bg-white px-4 py-4 text-sm font-semibold text-gray-700 hover:text-cam-olive">Send verification</button>
                    <button data-logout class="rounded-xl border border-cam-gray bg-white px-4 py-4 text-sm font-semibold text-gray-700 hover:text-cam-olive">Log out</button>
                    <button data-delete-account class="rounded-xl border border-red-200 bg-white px-4 py-4 text-sm font-semibold text-red-600">Delete account</button>
                </div>
            </section>
        `;
    },
    bind: (root) => {
        const form = root.querySelector("#settings-form");
        const emailToggle = root.querySelector("[data-email-toggle]");
        form?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const payload = {
                username: (data.get("username") ?? "").toString().trim(),
                email: (data.get("email") ?? "").toString().trim()
            };
            const password = (data.get("password") ?? "").toString().trim();
            if (password) {
                payload.password = password;
            }
            const response = await Api.updateUser(payload);
            if (response.status === "success" && response.user) {
                AuthStorage.setSession(response.user);
                Toast.push("Profile updated", "success");
                const passwordInput = form.querySelector("input[name='password']");
                if (passwordInput) {
                    passwordInput.value = "";
                }
            } else {
                Toast.push(response.message ?? "Unable to update profile", "error");
            }
        });

        emailToggle?.addEventListener("change", (event) => {
            const enabled = event.target.checked;
            Toast.push(enabled ? "Notifications enabled" : "Notifications muted", "info");
        });

        root.addEventListener("click", async (event) => {
            const target = event.target;
            if (target.closest && target.closest("[data-send-verification]")?.matches("button")) {
                const response = await Api.verifyEmail({});
                if (response.status === "success") {
                    Toast.push("Verification email requested", "success");
                } else {
                    Toast.push(response.message ?? "Unable to send email", "error");
                }
            }
            if (target.closest && target.closest("[data-logout]")?.matches("button")) {
                AuthStorage.clear();
                Toast.push("Signed out", "info");
                window.location.hash = `#${ROUTE_PATHS.login}`;
            }
            if (target.closest && target.closest("[data-delete-account]")?.matches("button")) {
                const confirmed = window.confirm("This cannot be undone. Continue?");
                if (!confirmed) {
                    return;
                }
                const response = await Api.deleteUser({});
                if (response.status === "success") {
                    AuthStorage.clear();
                    Toast.push("Account removed", "success");
                    window.location.hash = `#${ROUTE_PATHS.signup}`;
                } else {
                    Toast.push(response.message ?? "Deletion failed", "error");
                }
            }
        });
    }
};
