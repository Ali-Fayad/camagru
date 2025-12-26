/**
 * Post Detail Page
 * Shows individual post with likes, comments, and ability to interact
 */
class PostPage {
    constructor(apiService, authService, storage) {
        this.api = apiService;
        this.auth = authService;
        this.storage = storage;
        this.postId = null;
        this.post = null;
    }

    async render(params) {
        this.postId = params.id;
        
        const container = document.createElement('div');
        container.className = 'min-h-screen bg-gradient-to-br from-cam-cream via-white to-cam-tan/20';
        container.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 py-8">
                <div id="post-content" class="bg-white rounded-3xl shadow-2xl shadow-cam-tan/30 overflow-hidden">
                    <div class="flex items-center justify-center p-8">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cam-olive"></div>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }

    async afterRender() {
        await this.loadPost();
    }

    async loadPost() {
        const contentDiv = document.getElementById('post-content');
        
        try {
            const response = await this.api.get(`/posts/${this.postId}`);
            this.post = response.data;
            
            const isAuthenticated = this.storage.isAuthenticated();
            
            contentDiv.innerHTML = `
                <!-- Back Button -->
                <div class="p-4 border-b border-gray-100">
                    <button onclick="window.history.back()" class="flex items-center gap-2 text-gray-600 hover:text-cam-olive transition-colors">
                        <span class="material-symbols-outlined">arrow_back</span>
                        <span class="font-medium">Back</span>
                    </button>
                </div>
                
                <!-- Post Header -->
                <div class="p-6 border-b border-gray-100">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cam-olive to-cam-tan flex items-center justify-center">
                            <span class="material-symbols-outlined text-white text-xl">person</span>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900">${this.post.author.username}</h3>
                            <p class="text-xs text-gray-500">${this.formatDate(this.post.createdAt)}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Post Image -->
                <div class="relative bg-black">
                    <img src="${this.post.imageUrl}" alt="Post image" class="w-full h-auto object-contain max-h-[600px] mx-auto">
                </div>
                
                <!-- Post Actions -->
                <div class="p-6 border-b border-gray-100">
                    <div class="flex items-center gap-6 mb-4">
                        <button id="like-btn" class="flex items-center gap-2 group transition-all ${this.post.isLikedByCurrentUser ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}" ${!isAuthenticated ? 'disabled' : ''}>
                            <span class="material-symbols-outlined text-2xl ${this.post.isLikedByCurrentUser ? 'filled' : ''}">favorite</span>
                            <span id="likes-count" class="font-bold">${this.post.likesCount}</span>
                        </button>
                        <div class="flex items-center gap-2 text-gray-600">
                            <span class="material-symbols-outlined text-2xl">comment</span>
                            <span class="font-bold">${this.post.commentsCount}</span>
                        </div>
                    </div>
                    ${this.post.caption ? `<p class="text-gray-800"><span class="font-bold">${this.post.author.username}</span> ${this.post.caption}</p>` : ''}
                </div>
                
                <!-- Comments Section -->
                <div class="p-6">
                    <h3 class="font-bold text-lg mb-4">Comments</h3>
                    <div id="comments-list" class="space-y-4 mb-6">
                        ${this.renderComments()}
                    </div>
                    
                    <!-- Add Comment Form -->
                    ${isAuthenticated ? `
                        <div class="border-t border-gray-100 pt-4">
                            <div class="flex gap-3">
                                <input 
                                    type="text" 
                                    id="comment-input" 
                                    placeholder="Add a comment..." 
                                    class="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cam-olive focus:border-transparent"
                                    maxlength="500"
                                >
                                <button 
                                    id="comment-btn" 
                                    class="px-6 py-2 bg-cam-olive text-white font-bold rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    ` : `
                        <div class="border-t border-gray-100 pt-4 text-center">
                            <p class="text-gray-500 mb-3">Log in to like or comment</p>
                            <a href="#/login" class="inline-block px-6 py-2 bg-cam-olive text-white font-bold rounded-full hover:bg-opacity-90 transition-all">
                                Log In
                            </a>
                        </div>
                    `}
                </div>
            `;
            
            this.setupEventListeners(isAuthenticated);
            
        } catch (error) {
            contentDiv.innerHTML = `
                <div class="p-12 text-center">
                    <span class="material-symbols-outlined text-6xl text-gray-300 mb-4">error</span>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
                    <p class="text-gray-600 mb-6">${error.message || 'This post may have been deleted or does not exist.'}</p>
                    <a href="#/gallery" class="inline-block px-6 py-3 bg-cam-olive text-white font-bold rounded-xl hover:bg-opacity-90 transition-all">
                        Back to Gallery
                    </a>
                </div>
            `;
        }
    }

    renderComments() {
        if (!this.post.comments || this.post.comments.length === 0) {
            return `
                <div class="text-center py-8">
                    <span class="material-symbols-outlined text-4xl text-gray-300 mb-2">chat_bubble_outline</span>
                    <p class="text-gray-500">No comments yet</p>
                </div>
            `;
        }
        
        return this.post.comments.map(comment => `
            <div class="flex gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cam-olive to-cam-tan flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-white text-sm">person</span>
                </div>
                <div class="flex-1">
                    <div class="bg-gray-50 rounded-2xl px-4 py-2">
                        <p class="font-bold text-sm text-gray-900">${comment.author.username}</p>
                        <p class="text-gray-800">${comment.content}</p>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 ml-4">${this.formatDate(comment.createdAt)}</p>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners(isAuthenticated) {
        if (!isAuthenticated) return;
        
        // Like button
        const likeBtn = document.getElementById('like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => this.handleLike());
        }
        
        // Comment button
        const commentBtn = document.getElementById('comment-btn');
        const commentInput = document.getElementById('comment-input');
        
        if (commentBtn && commentInput) {
            commentBtn.addEventListener('click', () => this.handleComment());
            commentInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleComment();
                }
            });
        }
    }

    async handleLike() {
        try {
            const likeBtn = document.getElementById('like-btn');
            const likesCountSpan = document.getElementById('likes-count');
            const heartIcon = likeBtn.querySelector('.material-symbols-outlined');
            
            likeBtn.disabled = true;
            
            if (this.post.isLikedByCurrentUser) {
                // Unlike
                await this.api.delete(`/likes/${this.postId}`);
                this.post.isLikedByCurrentUser = false;
                this.post.likesCount--;
                likeBtn.classList.remove('text-red-500');
                likeBtn.classList.add('text-gray-600', 'hover:text-red-500');
                heartIcon.classList.remove('filled');
            } else {
                // Like
                await this.api.post(`/likes/${this.postId}`, {});
                this.post.isLikedByCurrentUser = true;
                this.post.likesCount++;
                likeBtn.classList.remove('text-gray-600', 'hover:text-red-500');
                likeBtn.classList.add('text-red-500');
                heartIcon.classList.add('filled');
            }
            
            likesCountSpan.textContent = this.post.likesCount;
            likeBtn.disabled = false;
            
        } catch (error) {
            if (error.message.includes('Authentication')) {
                alert('Please log in to like posts');
                window.location.hash = '#/login';
            } else {
                alert('Failed to update like: ' + (error.message || 'Unknown error'));
            }
            document.getElementById('like-btn').disabled = false;
        }
    }

    async handleComment() {
        const commentInput = document.getElementById('comment-input');
        const commentBtn = document.getElementById('comment-btn');
        const content = commentInput.value.trim();
        
        if (!content) return;
        
        if (content.length > 500) {
            alert('Comment is too long (max 500 characters)');
            return;
        }
        
        try {
            commentBtn.disabled = true;
            commentBtn.textContent = 'Posting...';
            
            const response = await this.api.post(`/comments/${this.postId}`, { content });
            const newComment = response.data;
            
            // Add comment to list
            this.post.comments.push(newComment);
            this.post.commentsCount++;
            
            // Re-render comments
            const commentsList = document.getElementById('comments-list');
            commentsList.innerHTML = this.renderComments();
            
            // Clear input
            commentInput.value = '';
            commentBtn.disabled = false;
            commentBtn.textContent = 'Post';
            
        } catch (error) {
            if (error.message.includes('Authentication')) {
                alert('Please log in to comment');
                window.location.hash = '#/login';
            } else {
                alert('Failed to add comment: ' + (error.message || 'Unknown error'));
            }
            commentBtn.disabled = false;
            commentBtn.textContent = 'Post';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}
