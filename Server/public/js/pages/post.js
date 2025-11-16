import { Api } from "../api.js";
import { AuthStorage } from "../auth.js";
import { Toast } from "../ui.js";

const getUserId = (user) => user?.id ?? user?.userId ?? user?.ID ?? null;

export const PostPage = {
    route: "post",
    title: "Camagru | New Post",
    requiresAuth: true,
    render: () => `
        <section class="max-w-4xl mx-auto flex flex-col gap-8">
            <div class="rounded-xl border border-cam-gray bg-white p-6 shadow-lg shadow-cam-tan/20 text-center">
                <p class="text-xs uppercase tracking-[0.4em] text-cam-olive">Studio drop</p>
                <h1 class="mt-3 text-3xl font-black text-gray-900">Create a new post</h1>
                <p class="mt-2 text-sm text-gray-500">Upload an image, remix stickers, and share a caption with your crew.</p>
            </div>
            <div class="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <div class="space-y-5">
                    <div id="post-preview" class="relative h-72 rounded-2xl border border-dashed border-cam-tan bg-cam-cream flex items-center justify-center overflow-hidden">
                        <img data-preview-image class="absolute inset-0 h-full w-full object-cover hidden" alt="Selected preview" />
                        <div data-preview-placeholder class="flex flex-col items-center text-gray-500 text-center">
                            <span class="material-symbols-outlined text-4xl mb-2">photo_camera</span>
                            <p class="font-semibold">Drop a file to get started</p>
                            <p class="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <div data-preview-sticker class="absolute bottom-4 right-4 hidden"></div>
                    </div>
                    <div>
                        <label for="post-file-input" class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-cam-tan bg-white px-6 py-8 text-center text-sm text-gray-500 hover:bg-cam-gray/40">
                            <span class="material-symbols-outlined text-3xl mb-2">upload</span>
                            <span class="font-semibold">Click to upload</span>
                            <span class="text-xs text-gray-400">or drag & drop</span>
                        </label>
                        <input id="post-file-input" type="file" accept="image/*" class="sr-only" data-file-input />
                    </div>
                    <button type="button" data-load-stickers class="w-full rounded-full border border-cam-gray px-5 py-3 text-sm font-semibold text-gray-700 hover:text-cam-olive">Load stickers</button>
                    <div id="sticker-tray" class="flex flex-wrap gap-3"></div>
                </div>
                <form id="post-form" class="rounded-2xl border border-cam-gray bg-white p-6 space-y-5">
                    <label class="flex flex-col gap-2 text-sm font-semibold text-gray-900">
                        Caption
                        <textarea name="caption" rows="6" placeholder="Write about this snapshot..." class="rounded-xl border border-cam-tan bg-cam-gray px-4 py-3 text-sm text-gray-900 focus:border-cam-olive focus:ring-cam-olive"></textarea>
                    </label>
                    <button type="submit" class="w-full rounded-full bg-cam-olive py-3 text-sm font-semibold text-white hover:bg-opacity-90">Publish post</button>
                </form>
            </div>
        </section>
    `,
    bind: (root) => {
        const form = root.querySelector("#post-form");
        const tray = root.querySelector("#sticker-tray");
        const preview = root.querySelector("#post-preview");
        const previewImage = preview?.querySelector("[data-preview-image]");
        const previewPlaceholder = preview?.querySelector("[data-preview-placeholder]");
        const stickerLayer = preview?.querySelector("[data-preview-sticker]");
        const fileInput = root.querySelector("[data-file-input]");

        const state = {
            imageData: null,
            sticker: null
        };

        const updatePreview = () => {
            if (!previewImage || !previewPlaceholder) {
                return;
            }
            if (state.imageData) {
                previewImage.src = state.imageData;
                previewImage.classList.remove("hidden");
                previewPlaceholder.classList.add("hidden");
            } else {
                previewImage.src = "";
                previewImage.classList.add("hidden");
                previewPlaceholder.classList.remove("hidden");
            }
        };

        updatePreview();
        updateStickerOverlay();

        const updateStickerOverlay = () => {
            if (!stickerLayer) {
                return;
            }
            if (!state.sticker) {
                stickerLayer.innerHTML = "";
                stickerLayer.classList.add("hidden");
                return;
            }
            stickerLayer.innerHTML = `<img src="${state.sticker.url}" alt="Sticker preview" class="h-16 w-16 object-contain drop-shadow-xl" />`;
            stickerLayer.classList.remove("hidden");
        };

        fileInput?.addEventListener("change", () => {
            const file = fileInput.files?.[0];
            if (!file) {
                state.imageData = null;
                updatePreview();
                return;
            }
            if (!file.type.startsWith("image/")) {
                Toast.push("Please pick an image file", "warning");
                fileInput.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                state.imageData = reader.result;
                updatePreview();
            };
            reader.onerror = () => {
                Toast.push("Failed to read file", "error");
            };
            reader.readAsDataURL(file);
        });

        const renderStickers = (stickers) => {
            if (!tray) {
                return;
            }
            if (!stickers.length) {
                tray.innerHTML = `<p class="w-full rounded-xl border border-dashed border-cam-gray px-4 py-3 text-sm text-gray-500">No stickers uploaded yet.</p>`;
                return;
            }
            tray.innerHTML = stickers
                .map(
                    (sticker) => `
                        <button type="button" class="flex items-center gap-2 rounded-full border border-cam-gray bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:text-cam-olive" data-sticker-id="${sticker.id}" data-sticker-url="${sticker.url}" data-sticker-name="${sticker.name}">
                            <img src="${sticker.url}" alt="${sticker.name}" class="h-6 w-6 object-contain" />
                            ${sticker.name}
                        </button>
                    `
                )
                .join("");
        };

        root.addEventListener("click", async (event) => {
            const stickerTrigger = event.target.closest?.("[data-load-stickers]");
            if (stickerTrigger) {
                event.preventDefault();
                stickerTrigger.setAttribute("disabled", "true");
                stickerTrigger.textContent = "Loading...";
                const response = await Api.getStickers();
                const stickers = Array.isArray(response?.stickers)
                    ? response.stickers
                    : Array.isArray(response?.data)
                    ? response.data
                    : [];
                renderStickers(stickers);
                stickerTrigger.removeAttribute("disabled");
                stickerTrigger.textContent = "Reload stickers";
                return;
            }
            const stickerButton = event.target.closest?.("[data-sticker-id]");
            if (stickerButton) {
                event.preventDefault();
                const id = stickerButton.getAttribute("data-sticker-id");
                const url = stickerButton.getAttribute("data-sticker-url");
                const name = stickerButton.getAttribute("data-sticker-name");
                state.sticker = { id, url, name };
                tray?.querySelectorAll("[data-sticker-id]")?.forEach((btn) => {
                    btn.classList.remove("ring-2", "ring-cam-olive");
                });
                stickerButton.classList.add("ring-2", "ring-cam-olive");
                updateStickerOverlay();
            }
        });

        form?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const user = AuthStorage.getUser();
            const userId = getUserId(user);
            if (!userId) {
                Toast.push("Login expired. Please re-authenticate.", "warning");
                return;
            }
            if (!state.imageData) {
                Toast.push("Select an image before publishing", "warning");
                return;
            }
            const data = new FormData(form);
            const caption = (data.get("caption") ?? "").toString().trim();
            if (!caption) {
                Toast.push("Caption is required", "warning");
                return;
            }
            const payload = {
                userId,
                image: state.imageData,
                caption,
                sticker: state.sticker?.id ?? null,
                stickerPosition: state.sticker ? { x: 20, y: 20, scale: 1 } : null
            };
            const response = await Api.addPost(payload);
            if (response.status === "success") {
                Toast.push("Post published!", "success");
                form.reset();
                state.imageData = null;
                state.sticker = null;
                fileInput && (fileInput.value = "");
                updatePreview();
                updateStickerOverlay();
                tray?.querySelectorAll("[data-sticker-id]")?.forEach((btn) => btn.classList.remove("ring-2", "ring-cam-olive"));
            } else {
                Toast.push(response.message ?? "Could not publish", "error");
            }
        });
    }
};
