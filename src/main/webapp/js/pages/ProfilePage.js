class ProfilePage {
    constructor(apiService, authService) {
        this.apiService = apiService;
        this.authService = authService;
        this.user = null;
        this.posts = [];
    }

    async render() {
        const container = DOM.create('div', { className: 'container mx-auto px-4 py-8 animate-fade-in' });
        
        container.innerHTML = `
            <div class="max-w-5xl mx-auto space-y-8">
                <!-- Profile Header -->
                <div class="rounded-3xl border border-cam-gray bg-white p-8 shadow-xl shadow-cam-tan/20">
                    <div class="flex flex-col md:flex-row items-center gap-8">
                        <div class="relative group">
                            <div class="h-32 w-32 rounded-full bg-cam-cream border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-cam-olive">
                                <span class="material-symbols-outlined text-6xl">person</span>
                            </div>
                            <button class="absolute bottom-0 right-0 bg-cam-olive text-white p-2 rounded-full shadow-lg hover:bg-opacity-90 transition-transform hover:scale-110">
                                <span class="material-symbols-outlined text-sm">edit</span>
                            </button>
                        </div>
                        
                        <div class="flex-1 text-center md:text-left space-y-4">
                            <div class="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
                                <h2 class="text-3xl font-black text-gray-900" id="profile-username">Loading...</h2>
                                <a href="#/settings" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                                    <span class="material-symbols-outlined text-lg">settings</span>
                                    Edit Profile
                                </a>
                            </div>
                            
                            <div class="flex justify-center md:justify-start gap-8 text-gray-600">
                                <div class="text-center md:text-left">
                                    <span class="block text-xl font-black text-gray-900" id="posts-count">0</span>
                                    <span class="text-sm">Posts</span>
                                </div>
                                <div class="text-center md:text-left">
                                    <span class="block text-xl font-black text-gray-900" id="likes-count">0</span>
                                    <span class="text-sm">Likes</span>
                                </div>
                                <div class="text-center md:text-left">
                                    <span class="block text-xl font-black text-gray-900" id="comments-count">0</span>
                                    <span class="text-sm">Comments</span>
                                </div>
                            </div>
                            
                            <p class="text-gray-600 max-w-lg" id="profile-bio">
                                No bio yet.
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- User Posts Grid -->
                <div>
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-gray-900">My Posts</h3>
                        <div class="flex gap-2">
                            <button class="p-2 text-cam-olive bg-cam-cream rounded-lg">
                                <span class="material-symbols-outlined">grid_view</span>
                            </button>
                            <button class="p-2 text-gray-400 hover:text-gray-600">
                                <span class="material-symbols-outlined">list</span>
                            </button>
                        </div>
                    </div>
                    
                    <div id="user-posts-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <!-- Loading skeletons -->
                        ${Array(6).fill(0).map(() => `
                            <div class="aspect-square rounded-xl bg-gray-200 animate-pulse"></div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    async afterRender() {
        try {
            // Mock data
            this.user = {
                username: 'johndoe',
                bio: 'Photography enthusiast 📸 | Travel ✈️ | Coffee ☕',
                stats: { posts: 12, likes: 450, comments: 89 }
            };
            
            this.posts = Array(12).fill(0).map((_, i) => ({
                id: i,
                imageUrl: `https://picsum.photos/seed/${i + 100}/400/400`,
                likes: Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 20)
            }));

            this.updateProfile();
            this.renderPosts();
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    }

    updateProfile() {
        document.getElementById('profile-username').textContent = `@${this.user.username}`;
        document.getElementById('profile-bio').textContent = this.user.bio;
        document.getElementById('posts-count').textContent = this.user.stats.posts;
        document.getElementById('likes-count').textContent = this.user.stats.likes;
        document.getElementById('comments-count').textContent = this.user.stats.comments;
    }

    renderPosts() {
        const grid = document.getElementById('user-posts-grid');
        if (!grid) return;

        if (this.posts.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-500 bg-white rounded-3xl border border-cam-gray border-dashed">
                    <span class="material-symbols-outlined text-4xl mb-2 text-cam-olive">add_a_photo</span>
                    <p class="font-bold">No posts yet</p>
                    <p class="text-sm mt-1">Share your first photo with the world!</p>
                    <a href="#/upload" class="inline-block mt-4 px-6 py-2 bg-cam-olive text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-colors">
                        Create Post
                    </a>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.posts.map(post => `
            <div class="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                <img src="${post.imageUrl}" alt="Post" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined fill-current">favorite</span>
                        <span class="font-bold">${post.likes}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined fill-current">chat_bubble</span>
                        <span class="font-bold">${post.comments}</span>
                    </div>
                </div>
                
                <button class="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110" title="Delete Post">
                    <span class="material-symbols-outlined text-sm">delete</span>
                </button>
            </div>
        `).join('');
    }
}