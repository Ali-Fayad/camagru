import { Api } from "../api.js";
import { ROUTE_PATHS } from "../constants.js";
import { Toast } from "../ui.js";

export const PasswordPage = {
    route: "password",
    title: "Camagru | Password",
    requiresAuth: false,
    render: () => `
        <section class="flex justify-center">
            <div class="w-full max-w-md rounded-xl border border-cam-gray bg-white p-8 shadow-lg shadow-cam-tan/20">
                <div class="flex flex-col gap-8">
                    <div class="text-center">
                        <p class="text-xs uppercase tracking-[0.4em] text-cam-olive">Reset access</p>
                        <h1 class="mt-3 text-3xl font-black text-gray-900">Forgot your password?</h1>
                        <p class="mt-2 text-sm text-gray-500">Drop your email below and we'll send a recovery link.</p>
                    </div>
                    <form id="password-form" class="flex flex-col gap-5">
                        <label class="flex flex-col gap-2 text-sm font-medium text-gray-900">
                            Email address
                            <input type="email" name="email" required placeholder="you@example.com" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-3 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                        </label>
                        <button type="submit" class="rounded-lg bg-cam-olive py-3 text-sm font-semibold text-white hover:bg-opacity-90">Send reset link</button>
                    </form>
                    <p class="text-center text-sm text-gray-500">
                        Remembered it? <button class="font-semibold text-cam-olive" data-route="login">Back to login</button>
                    </p>
                </div>
            </div>
        </section>
    `,
    bind: (root) => {
        const form = root.querySelector("#password-form");
        form?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const email = (data.get("email") ?? "").toString().trim();
            if (!email) {
                Toast.push("Email is required", "warning");
                return;
            }
            const response = await Api.sendVerificationCode({ email });
            if (response.status === "success") {
                Toast.push("Check your inbox for the reset link", "success");
                window.location.hash = `#${ROUTE_PATHS.login}`;
            } else {
                Toast.push(response.message ?? "Unable to send reset email", "error");
            }
        });
    }
};
