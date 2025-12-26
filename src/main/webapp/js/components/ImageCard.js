/**
 * Reusable Image Card Component
 * Displays image with likes, comments, and optional delete button
 */
class ImageCard {
    constructor(image, options = {}) {
        this.image = image;
        this.options = {
            showDelete: options.showDelete || false,
            onDelete: options.onDelete || null,
            onLike: options.onLike || null,
            apiService: options.apiService || null,
            authService: options.authService || null,
            storage: options.storage || null
        };
    }

    render() {
        const card = document.createElement('div');
        card.className = 'group overflow-hidden rounded-xl border border-cam-gray bg-white shadow-lg shadow-cam-tan/20 transition-all duration-300 hover:shadow-xl hover:shadow-cam-tan/40 hover:-translate-y-1';
        
        card.innerHTML = `
            <a href="#/post/${this.image.id}" class="block overflow-hidden">
                <img src="${this.image.imageUrl || this.image.thumbnailUrl}" alt="Post by ${this.image.username || 'User'}" 
                    class="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy">
            </a>
            <div class="p-4">
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <span class="font-medium text-gray-700">@${this.image.username || 'Unknown'}</span>
                    <span>${this.formatDate(this.image.createdAt)}</span>
                </div>
                <div class="mt-3 flex items-center gap-4">
                    <button class="like-btn flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors group/btn" data-image-id="${this.image.id}">
                        <span class="material-symbols-outlined text-xl ${this.image.isLikedByCurrentUser || this.image.userLiked ? 'fill-current text-red-500' : ''}">favorite</span>
                        <span class="font-medium like-count">${this.image.likesCount || this.image.likeCount || 0}</span>
                    </button>
                    <a href="#/post/${this.image.id}" class="flex items-center gap-1.5 text-gray-600 hover:text-cam-olive transition-colors">
                        <span class="material-symbols-outlined text-xl">chat_bubble</span>
                        <span class="font-medium">${this.image.commentsCount || this.image.commentCount || 0}</span>
                    </a>
                    ${this.options.showDelete ? `
                        <button class="delete-btn ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" data-image-id="${this.image.id}" title="Delete Post">
                            <span class="material-symbols-outlined text-xl">delete</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        // Attach event listeners
        this.attachEventListeners(card);
        
        return card;
    }

    attachEventListeners(card) {
        const likeBtn = card.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.handleLike(likeBtn);
            });
        }

        const deleteBtn = card.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.handleDelete(deleteBtn);
            });
        }
    }

    async handleLike(button) {
        // Check authentication
        if (!this.options.storage || !this.options.storage.isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }

        if (!this.options.apiService) return;

        try {
            const imageId = this.image.id;
            const isLiked = this.image.isLikedByCurrentUser || this.image.userLiked;

            // Optimistic UI update
            const icon = button.querySelector('.material-symbols-outlined');
            const count = button.querySelector('.like-count');
            const currentCount = parseInt(count.textContent);

            if (isLiked) {
                // Unlike
                icon.classList.remove('fill-current', 'text-red-500');
                count.textContent = Math.max(0, currentCount - 1);
                this.image.isLikedByCurrentUser = false;
                this.image.userLiked = false;
                await this.options.apiService.delete(`/likes/${imageId}`);
            } else {
                // Like
                icon.classList.add('fill-current', 'text-red-500');
                count.textContent = currentCount + 1;
                this.image.isLikedByCurrentUser = true;
                this.image.userLiked = true;
                await this.options.apiService.post(`/likes/${imageId}`, {});
            }

            // Call custom callback if provided
            if (this.options.onLike) {
                this.options.onLike(imageId, !isLiked);
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
            // Revert UI on error by reloading the count from server
            // Don't reload entire page - just log the error
            const icon = button.querySelector('.material-symbols-outlined');
            const count = button.querySelector('.like-count');
            icon.classList.remove('fill-current', 'text-red-500');
            if (this.image.likesCount !== undefined) {
                count.textContent = this.image.likesCount || this.image.likeCount || 0;
            }
        }
    }

    async handleDelete(button) {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        if (!this.options.apiService) return;

        try {
            const imageId = this.image.id;
            await this.options.apiService.delete(`/images/${imageId}`);
            
            if (this.options.onDelete) {
                this.options.onDelete(imageId);
            }
        } catch (error) {
            console.error('Failed to delete image:', error);
            alert('Failed to delete post. Please try again.');
        }
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