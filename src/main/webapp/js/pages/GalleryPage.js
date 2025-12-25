class GalleryPage {
    constructor(galleryService, apiService, authService, storage) {
        this.galleryService = galleryService;
        this.api = apiService;
        this.authService = authService;
        this.storage = storage;
        this.images = [];
        this.loading = false;
    }

    async render() {
        const container = DOM.create('div', { className: 'container mx-auto px-4 py-8 animate-fade-in' });
        
        container.innerHTML = `
            <div class="flex flex-col gap-8">
                <div class="flex items-center justify-between">
                    <h2 class="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900">Gallery</h2>
                </div>
                
                <div id="gallery-grid" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <!-- Loading skeletons -->
                    ${this.renderLoadingSkeleton()}
                </div>
            </div>
        `;

        return container;
    }

    renderLoadingSkeleton() {
        return Array(8).fill(0).map(() => `
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
        `).join('');
    }

    async afterRender() {
        await this.loadGallery();
    }

    async loadGallery() {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;

        try {
            this.loading = true;
            const response = await this.galleryService.getGalleryImages();
            
            if (response && response.data) {
                this.images = response.data;
            }
            
            if (!this.images || this.images.length === 0) {
                grid.innerHTML = this.renderEmptyState();
                return;
            }
            
            this.renderGrid();
        } catch (error) {
            console.error('Failed to load gallery:', error);
            grid.innerHTML = this.renderErrorState();
        } finally {
            this.loading = false;
        }
    }

    renderEmptyState() {
        return `
            <div class="col-span-full text-center py-16">
                <div class="inline-flex h-24 w-24 items-center justify-center rounded-full bg-cam-cream text-cam-olive mb-4">
                    <span class="material-symbols-outlined text-5xl">image</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">No posts yet</h3>
                <p class="text-gray-600 mb-6">Be the first to share a photo!</p>
                <a href="#/upload" class="inline-flex items-center rounded-xl bg-cam-olive px-6 py-3 text-sm font-bold text-white hover:bg-opacity-90 transition-all">
                    <span class="material-symbols-outlined mr-2">add_a_photo</span>
                    Create Post
                </a>
            </div>
        `;
    }

    renderErrorState() {
        return `
            <div class="col-span-full text-center py-12 text-gray-500">
                <span class="material-symbols-outlined text-4xl mb-2 text-red-500">error</span>
                <p class="text-gray-700 font-medium mb-2">Failed to load images</p>
                <p class="text-sm text-gray-500">Please try again later.</p>
            </div>
        `;
    }

    renderGrid() {
        const grid = document.getElementById('gallery-grid');
        if (!grid) return;

        // Clear grid
        grid.innerHTML = '';

        // Render each image using ImageCard component
        this.images.forEach(image => {
            const imageCard = new ImageCard(image, {
                showDelete: false,
                apiService: this.api,
                authService: this.authService,
                storage: this.storage,
                onLike: (imageId, isLiked) => {
                    // Update local state
                    const img = this.images.find(i => i.id === imageId);
                    if (img) {
                        img.isLikedByCurrentUser = isLiked;
                        img.userLiked = isLiked;
                        img.likeCount = isLiked ? (img.likeCount + 1) : (img.likeCount - 1);
                        img.likesCount = img.likeCount;
                    }
                }
            });
            grid.appendChild(imageCard.render());
        });
    }

    formatDate(dateString) {
        if (!dateString) return '';
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