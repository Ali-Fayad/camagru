class ProfilePage {
    constructor(userService, statsService, authService, apiService, storage) {
        this.userService = userService;
        this.statsService = statsService;
        this.authService = authService;
        this.api = apiService;
        this.storage = storage;
        this.user = null;
        this.stats = null;
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
            // Load real user data from localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                this.user = JSON.parse(storedUser);
            } else {
                // Fallback: fetch from API
                const profile = await this.userService.getProfile();
                this.user = profile.data;
            }
            
            // Fetch real stats from API
            const statsResponse = await this.statsService.getUserStats();
            this.stats = statsResponse.data;
            
            // Fetch user's own posts from API
            await this.loadUserPosts();

            this.updateProfile();
            this.renderPosts();
        } catch (error) {
            console.error('Failed to load profile:', error);
            ErrorHandler.showError('Failed to load profile data');
        }
    }

    updateProfile() {
        const usernameEl = document.getElementById('profile-username');
        const bioEl = document.getElementById('profile-bio');
        const postsCountEl = document.getElementById('posts-count');
        const likesCountEl = document.getElementById('likes-count');
        const commentsCountEl = document.getElementById('comments-count');
        
        if (usernameEl && this.user) {
            usernameEl.textContent = `@${this.user.username}`;
        }
        
        if (bioEl) {
            bioEl.textContent = 'Photography enthusiast 📸';
        }
        
        if (this.stats) {
            if (postsCountEl) postsCountEl.textContent = this.stats.imageCount || 0;
            if (likesCountEl) likesCountEl.textContent = this.stats.totalLikesReceived || 0;
            if (commentsCountEl) commentsCountEl.textContent = this.stats.totalCommentsReceived || 0;
        }
    }

    async loadUserPosts() {
        try {
            const response = await this.api.get('/user/images');
            if (response && response.data && response.data.images) {
                this.posts = response.data.images;
            }
        } catch (error) {
            console.error('Failed to load user posts:', error);
            this.posts = [];
        }
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

        // Clear grid
        grid.innerHTML = '';
        
        // Render each post using ImageCard component
        this.posts.forEach(post => {
            const imageCard = new ImageCard(post, {
                showDelete: true,
                apiService: this.api,
                authService: this.authService,
                storage: this.storage,
                onDelete: (imageId) => {
                    // Remove from DOM and update stats
                    this.posts = this.posts.filter(p => p.id !== imageId);
                    this.renderPosts();
                    // Reload stats
                    this.statsService.getUserStats().then(response => {
                        this.stats = response.data;
                        this.updateProfile();
                    });
                },
                onLike: (imageId, isLiked) => {
                    // Update local state
                    const post = this.posts.find(p => p.id === imageId);
                    if (post) {
                        post.isLikedByCurrentUser = isLiked;
                        post.likesCount = isLiked ? (post.likesCount + 1) : (post.likesCount - 1);
                    }
                }
            });
            grid.appendChild(imageCard.render());
        });
    }
}