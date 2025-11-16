import { Api } from "../api.js";
import { AuthStorage } from "../auth.js";
import { Toast } from "../ui.js";

const card = (post) => {
    const image = post.image_url && post.image_url.length > 4 ? post.image_url : `https://picsum.photos/seed/gallery-${post.id}/640/640`;
    return `
        <article class="rounded-2xl border border-cam-gray bg-white shadow-md shadow-cam-tan/20 overflow-hidden" data-post-card>
            <div class="relative">
                <img src="${image}" alt="${post.description ?? "Gallery asset"}" class="w-full h-52 object-cover" loading="lazy" />
                <button class="absolute top-4 right-4 rounded-full bg-white/90 text-gray-600 p-2" data-edit-post>
                    <span class="material-symbols-outlined text-xl">edit</span>
                </button>
            </div>
            <div class="p-4 space-y-3">
                <p class="text-sm font-semibold text-gray-900 line-clamp-2">${post.description ?? "Untitled post"}</p>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>${post.created_at ?? "Recently"}</span>
                    <span>${post.likes ?? 0} likes</span>
                </div>
                <div class="flex gap-2">
                    <button class="flex-1 rounded-full bg-cam-olive text-white text-xs font-semibold py-2" data-share-post>Share</button>
                    <button class="flex-1 rounded-full border border-cam-gray text-gray-700 text-xs font-semibold py-2" data-edit-post>Edit</button>
                </div>
            </div>
        </article>
    `;
};

export const GalleryPage = {
    route: "gallery",
    title: "Camagru | Gallery",
    requiresAuth: true,
    render: () => `
        <section class="max-w-5xl mx-auto flex flex-col gap-8">
            <div class="rounded-xl border border-cam-gray bg-white p-6 shadow-lg shadow-cam-tan/20 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p class="text-xs uppercase tracking-[0.3em] text-cam-olive">Archive</p>
                    <h1 class="mt-2 text-3xl font-black text-gray-900">Your gallery</h1>
                    <p class="mt-2 text-sm text-gray-500">Browse uploads, remix captions, and keep your grid on-brand.</p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <button data-route="post" class="rounded-full bg-cam-olive text-white px-5 py-2.5 text-sm font-semibold">New upload</button>
                    <button data-refresh-gallery class="rounded-full border border-cam-gray px-5 py-2.5 text-sm text-gray-700 hover:text-cam-olive">Refresh</button>
                </div>
            </div>
            <div class="flex flex-col gap-4 md:flex-row md:items-center">
                <div class="flex-1">
                    <label class="sr-only" for="gallery-search">Search gallery</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                        <input id="gallery-search" type="search" placeholder="Search captions" data-gallery-search class="w-full rounded-full border border-cam-gray bg-white px-12 py-3 text-sm text-gray-700 focus:border-cam-olive focus:ring-cam-olive" />
                    </div>
                </div>
                <div class="flex gap-3">
                    <select data-gallery-sort class="rounded-full border border-cam-gray bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-cam-olive">
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="likes">Most liked</option>
                    </select>
                </div>
            </div>
            <div id="gallery-grid" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <p class="col-span-full text-center text-gray-400">Loading gallery...</p>
            </div>
        </section>
    `,
    bind: (root) => {
        const grid = root.querySelector("#gallery-grid");
        const searchInput = root.querySelector("[data-gallery-search]");
        const sortSelect = root.querySelector("[data-gallery-sort]");

        const render = (posts) => {
            if (!grid) {
                return;
            }
            if (!posts.length) {
                grid.innerHTML = `
                    <div class="col-span-full rounded-xl border border-dashed border-cam-gray p-10 text-center text-gray-500">
                        <p class="font-semibold">Nothing yet</p>
                        <p class="text-sm">Share your first shot to populate the gallery.</p>
                    </div>
                `;
                return;
            }
            grid.innerHTML = posts.map(card).join("");
        };

        let personalPosts = [];

        const parseTimestamp = (value) => {
            const result = Date.parse(value ?? "");
            return Number.isNaN(result) ? 0 : result;
        };

        const applyFilters = () => {
            const query = searchInput?.value.toLowerCase() ?? "";
            const sortMode = sortSelect?.value ?? "latest";
            let dataset = personalPosts.filter((post) => (post.description ?? "").toLowerCase().includes(query));

            dataset = dataset.sort((a, b) => {
                if (sortMode === "likes") {
                    return (b.likes ?? 0) - (a.likes ?? 0);
                }
                const timeA = parseTimestamp(a.created_at);
                const timeB = parseTimestamp(b.created_at);
                return sortMode === "oldest" ? timeA - timeB : timeB - timeA;
            });

            render(dataset);
        };

        const load = async () => {
            if (!grid) {
                return;
            }
            grid.innerHTML = `<p class="col-span-full text-center text-gray-400">Loading gallery...</p>`;
            const user = AuthStorage.getUser();
            if (!user) {
                Toast.push("Log in to view your gallery", "warning");
                grid.innerHTML = `<p class="col-span-full text-center text-gray-400">Sign in to load your uploads.</p>`;
                return;
            }
            const response = await Api.getPosts();
            const allPosts = Array.isArray(response?.data) ? response.data : [];
            personalPosts = allPosts.filter((post) => post.username === user.username);
            applyFilters();
        };

        load();

        searchInput?.addEventListener("input", applyFilters);
        sortSelect?.addEventListener("change", applyFilters);

        root.addEventListener("click", (event) => {
            const refreshTrigger = event.target.closest?.("[data-refresh-gallery]");
            if (refreshTrigger) {
                event.preventDefault();
                void load();
                return;
            }
            if (event.target.closest?.("[data-edit-post]") || event.target.closest?.("[data-share-post]")) {
                event.preventDefault();
                Toast.push("Wire this action to the backend", "info");
            }
        });
    }
};
