import { Api } from "../api.js";
import { AuthStorage } from "../auth.js";
import { ROUTE_PATHS } from "../constants.js";
import { Toast } from "../ui.js";

export const SignupPage = {
  route: "signup",
  title: "Camagru | Sign up",
  requiresAuth: false,
  render: () => `
        <section class="flex justify-center">
            <div class="w-full max-w-md rounded-xl border border-cam-gray bg-white p-8 shadow-lg shadow-cam-tan/20">
                <div class="flex flex-col gap-8">
                    <div class="text-center">
                        <p class="text-xs uppercase tracking-[0.4em] text-cam-olive">Start creating</p>
                        <h1 class="mt-3 text-3xl font-black text-gray-900">Create an account</h1>
                        <p class="mt-2 text-sm text-gray-500">Drop your handle, plug your email, and join the gallery.</p>
                    </div>
                    <form id="signup-form" class="flex flex-col gap-5">
                        <label class="flex flex-col gap-2 text-sm font-medium text-gray-900">
                            Username
                            <input type="text" name="username" minlength="3" required placeholder="retroqueen" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-3 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                        </label>
                        <label class="flex flex-col gap-2 text-sm font-medium text-gray-900">
                            Email address
                            <input type="email" name="email" required placeholder="you@example.com" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-3 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                        </label>
                        <label class="flex flex-col gap-2 text-sm font-medium text-gray-900">
                            Password
                            <input type="password" name="password" minlength="6" required placeholder="••••••••" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-3 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                        </label>
                        <label class="flex flex-col gap-2 text-sm font-medium text-gray-900">
                            Confirm password
                            <input type="password" name="confirm" minlength="6" required placeholder="••••••••" class="rounded-lg border border-cam-tan bg-cam-gray px-4 py-3 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive" />
                        </label>
                        <button type="submit" class="rounded-lg bg-cam-olive py-3 text-sm font-semibold text-white hover:bg-opacity-90">Create account</button>
                    </form>
                    <p class="text-center text-sm text-gray-500">
                        Already a member?
                        <button class="font-semibold text-cam-olive" data-route="login">Login</button>
                    </p>
                </div>
            </div>
        </section>
    `,
  bind: (root) => {
    const form = root.querySelector("#signup-form");
    if (!form) {
      return;
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const payload = {
        username: (formData.get("username") ?? "").toString().trim(),
        email: (formData.get("email") ?? "").toString().trim(),
        password: (formData.get("password") ?? "").toString().trim(),
        confirm: (formData.get("confirm") ?? "").toString().trim(),
      };
      if (
        !payload.username ||
        !payload.email ||
        !payload.password ||
        !payload.confirm
      ) {
        Toast.push("All fields are required", "warning");
        return;
      }
      if (payload.password !== payload.confirm) {
        Toast.push("Passwords do not match", "error");
        return;
      }
      const { confirm, ...signupPayload } = payload;
      const response = await Api.signup(signupPayload);
      const user = response.user;
      const token =
        typeof response.token === "string" ? response.token : undefined;
      if (response.status === "success" && user) {
        AuthStorage.setSession(user, token);
        Toast.push("Welcome to Camagru!", "success");
        window.location.hash = `#${ROUTE_PATHS.home}`;
      } else if (response.status === "success") {
        Toast.push(
          response.message ?? "Account created — please log in",
          "success"
        );
        window.location.hash = `#${ROUTE_PATHS.login}`;
      } else {
        Toast.push(response.message ?? "Signup failed", "error");
      }
    });
  },
};
