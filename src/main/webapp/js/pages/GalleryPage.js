class GalleryPage {
    constructor(apiService) {
        this.apiService = apiService;
        this.posts = [];
    }

    async render() {
        const container = DOM.create('div', { className: 'container mx-auto px-4 py-8 animate-fade-in' });
        
        container.innerHTML = `
            <div class="flex flex-col gap-8">
                <div class="flex items-center justify-between">
                    <h2 class="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900">Gallery</h2>
                    <div class="relative">
                        <button id="sort-btn" class="inline-flex items-center rounded-xl bg-cam-olive px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-cam-olive/50 transition-all">
                            Sort by Date
                            <span class="material-symbols-outlined ml-2 text-sm">expand_more</span>
                        </button>
                        <!-- Dropdown menu would go here -->
                    </div>
                </div>
                
                <div id="gallery-grid" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <!-- Loading skeletons -->
                    ${Array(8).fill(0).map(() => `
                        <div class="rounded-xl border border-cam-gray bg-white shadow-lg shadow-cam-tan/20 overflow-hidden animate-pulse">
                            <div class="h-64 bg-gray-200"></div>
                            <div class="p-4 space-y-3">
                                <div class="flex justify-between">
                                    <div class="h-4 w-24 bg-gray-200 rounded"></div>
                                    <div class="h-4 w-16 bg-gray-200 rounded"></div>
                                </div>
                                <div class="flex gap-4 pt-2">
                                    <div class="h-6 w-12 bg-gray-200 rounded"></div>
                                    <div class="h-6 w-12 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div id="pagination" class="mt-8 flex justify-center gap-2"></div>
            </div>
        `;

        return container;
    }

    async afterRender() {
        try {
            // Fetch posts
            // this.posts = await this.apiService.getPosts();
            // Mock data for now
            this.posts = Array(12).fill(0).map((_, i) => ({
                id: i,
                imageUrl: `https://picsum.photos/seed/${i}/400/400`,
                username: `user${i}`,
                createdAt: new Date(Date.now() - i * 3600000).toISOString(),
                likes: Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 20)
            }));
            
            this.renderGrid();
        } catch (error) {
            console.error('Failed to load gallery:', error);
            document.getElementById('gallery-grid').innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-500">
                    <span class="material-symbols-outlined text-4xl mb-2">error</span>
                    <p>Failed to load images. Please try again later.</p>
                </div>
            `;
        }
    }

    renderGrid() {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;

        grid.innerHTML = this.posts.map(post => `
            <div class="group overflow-hidden rounded-xl border border-cam-gray bg-white shadow-lg shadow-cam-tan/20 transition-all duration-300 hover:shadow-xl hover:shadow-cam-tan/40 hover:-translate-y-1">
                <a href="#/post/${post.id}" class="block overflow-hidden">
                    <img src="${post.imageUrl}" alt="Post by ${post.username}" 
                        class="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy">
                </a>
                <div class="p-4">
                    <div class="flex items-center justify-between text-sm text-gray-500">
                        <span class="font-medium text-gray-700">@${post.username}</span>
                        <span>${this.formatDate(post.createdAt)}</span>
                    </div>
                    <div class="mt-3 flex items-center gap-4">
                        <button class="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors group/btn">
                            <span class="material-symbols-outlined text-xl group-hover/btn:fill-current">favorite</span>
                            <span class="font-medium">${post.likes}</span>
                        </button>
                        <button class="flex items-center gap-1.5 text-gray-600 hover:text-cam-olive transition-colors">
                            <span class="material-symbols-outlined text-xl">chat_bubble</span>
                            <span class="font-medium">${post.comments}</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        // If less than 24 hours, show relative time
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            if (hours < 1) return 'Just now';
            return `${hours}h ago`;
        }
        
        return date.toLocaleDateString();
    }
}