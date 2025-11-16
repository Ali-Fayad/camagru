import { Api } from "../api.js";
import { AuthStorage } from "../auth.js";
import { Toast } from "../ui.js";

const placeholderPosts = [
    {
        id: 1,
        username: "retroqueen",
        description: "Testing pipeline — connect /posts/get for real data.",
        image_url: "",
        likes: 18,
        comments: [
            { username: "guest", body: "Love the tones" },
            { username: "demo", body: "Saving this look" }
        ],
        created_at: "Just now"
    }
];

const postCard = (post) => {
    const avatar = (post.username ?? "C").charAt(0).toUpperCase();
    const likes = post.likes ?? 0;
    const comments = Array.isArray(post.comments) ? post.comments : [];
    const image = post.image_url && post.image_url.length > 4 ? post.image_url : `https://picsum.photos/seed/${post.id}/640/640`;
    return `
        <article class="w-full rounded-xl border border-cam-gray bg-white shadow-lg shadow-cam-tan/20 overflow-hidden" data-post-id="${post.id}">
            <div class="p-5 flex justify-between items-center border-b border-cam-gray">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-cam-gray text-gray-700 font-semibold flex items-center justify-center">${avatar}</div>
                    <div>
                        <p class="text-sm font-semibold text-gray-900">@${post.username ?? "anonymous"}</p>
                        <p class="text-xs text-gray-500">${post.created_at ?? "Moments ago"}</p>
                    </div>
                </div>
                <button class="text-gray-400 hover:text-gray-700" type="button">
                    <span class="material-symbols-outlined">more_horiz</span>
                </button>
            </div>
            <div class="bg-cam-gray/60">
                <img src="${image}" alt="Post by ${post.username ?? "user"}" class="w-full h-auto object-cover" loading="lazy" />
            </div>
            <div class="p-5 flex flex-col gap-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4 text-gray-600">
                        <button data-like class="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                            <span class="material-symbols-outlined text-xl">favorite</span>
                            <span>${likes}</span>
                        </button>
                        <button data-toggle-comments class="flex items-center gap-1.5 hover:text-cam-olive transition-colors">
                            <span class="material-symbols-outlined text-xl">chat_bubble</span>
                            <span>${comments.length}</span>
                        </button>
                    </div>
                    <button class="text-gray-700 hover:text-cam-olive text-sm" data-refresh-feed>Refresh</button>
                </div>
                <p class="text-sm text-gray-900">${post.description ?? "No caption provided."}</p>
                <div class="space-y-2 hidden" data-comment-list>
                    ${comments
                        .map(
                            (comment) => `
                                <div class="flex gap-2 text-sm">
                                    <span class="font-semibold text-gray-800">@${comment.username}</span>
                                    <p class="text-gray-500">${comment.body}</p>
                                </div>
                            `
                        )
                        .join("")}
                </div>
                <form class="flex gap-2" data-comment-form>
                    <input type="text" name="comment" class="flex-1 rounded-full bg-cam-gray px-4 py-2 text-sm border border-cam-tan focus:ring-cam-olive focus:border-cam-olive" placeholder="Say something nice" required />
                    <button type="submit" class="px-5 py-2 rounded-full bg-cam-olive text-white text-sm font-semibold">Post</button>
                </form>
            </div>
        </article>
    `;
};

const renderFeed = (posts) => {
    if (!posts.length) {
        return `
            <div class="text-center text-gray-500 py-12 border border-dashed border-cam-gray rounded-2xl">
                <p class="font-semibold">No posts yet</p>
                <p class="text-sm">Be the first to share your analog creation.</p>
            </div>
        `;
    }
    return posts.map(postCard).join("");
};

export const HomePage = {
    route: "home",
    title: "Camagru | Home",
    requiresAuth: false,
    render: () => `
        <section class="flex flex-col gap-8 max-w-3xl mx-auto">
            <div class="rounded-xl border border-cam-gray bg-white p-8 shadow-lg shadow-cam-tan/20 text-center">
                <p class="text-sm uppercase text-cam-olive tracking-[0.3em]">Analog forever</p>
                <h2 class="mt-2 text-3xl font-black text-gray-900">Curate your retro gallery</h2>
                <p class="mt-2 text-base text-gray-500">Share instant classics, remix stickers, and keep your community inspired.</p>
                <div class="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                    <button data-route="post" class="inline-flex items-center rounded-full bg-cam-olive px-5 py-2.5 text-white font-semibold">Create post</button>
                    <button data-route="gallery" class="inline-flex items-center rounded-full border border-cam-olive px-5 py-2.5 text-cam-olive font-semibold">Open gallery</button>
                </div>
            </div>
            <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-gray-900">Latest drops</h3>
                <button class="inline-flex items-center rounded-full border border-cam-gray px-4 py-2 text-sm text-gray-600 hover:text-cam-olive" data-refresh-feed>
                    <span class="material-symbols-outlined text-base mr-1">refresh</span>
                    Refresh
                </button>
            </div>
            <div id="home-feed" class="flex flex-col gap-8">
                ${renderFeed(placeholderPosts)}
            </div>
        </section>
    `,
    bind: (root) => {
        const feed = root.querySelector("#home-feed");
        const spinner = `
            <div class="flex flex-col items-center gap-3 py-10 text-gray-400">
                <div class="w-8 h-8 border-4 border-cam-gray border-t-cam-olive rounded-full animate-spin"></div>
                <p class="text-sm">Loading posts...</p>
            </div>
        `;

        const loadPosts = async () => {
            if (!feed) {
                return;
            }
            feed.innerHTML = spinner;
            const response = await Api.getPosts();
            const posts = (() => {
                if (Array.isArray(response?.data) && response.data.length) {
                    return response.data;
                }
                if (Array.isArray(response?.posts) && response.posts.length) {
                    return response.posts;
                }
                return placeholderPosts;
            })();
            feed.innerHTML = renderFeed(posts);
        };

        loadPosts();

        root.addEventListener("click", async (event) => {
            const refreshTrigger = event.target.closest?.("[data-refresh-feed]");
            if (refreshTrigger) {
                event.preventDefault();
                await loadPosts();
                return;
            }
            const likeTrigger = event.target.closest?.("[data-like]");
            if (likeTrigger) {
                event.preventDefault();
                if (!AuthStorage.isAuthenticated()) {
                    Toast.push("Log in to like posts", "warning");
                    return;
                }
                const article = likeTrigger.closest("article[data-post-id]");
                const postId = article?.dataset.postId;
                if (!postId) {
                    return;
                }
                await Api.like({ post_id: Number(postId) });
                Toast.push("Like registered (check backend response)", "info");
                return;
            }
            const toggle = event.target.closest?.("[data-toggle-comments]");
            if (toggle) {
                event.preventDefault();
                const wrapper = toggle.closest("article")?.querySelector("[data-comment-list]");
                wrapper?.classList.toggle("hidden");
            }
        });

        root.addEventListener("submit", async (event) => {
            const form = event.target;
            if (!form.matches || !form.matches("[data-comment-form]")) {
                return;
            }
            event.preventDefault();
            if (!AuthStorage.isAuthenticated()) {
                Toast.push("Log in to comment", "warning");
                return;
            }
            const input = form.querySelector("input[name='comment']");
            const article = form.closest("article[data-post-id]");
            if (!input || !article) {
                return;
            }
            const postId = Number(article.dataset.postId);
            const comment = input.value.trim();
            if (!comment) {
                return;
            }
            const result = await Api.comment({ post_id: postId, comment });
            if (result.status === "success") {
                Toast.push("Comment sent", "success");
                input.value = "";
                await loadPosts();
            } else {
                Toast.push(result.message ?? "Unable to comment", "error");
            }
        });
    }
};
