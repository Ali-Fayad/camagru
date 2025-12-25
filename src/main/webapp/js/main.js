/**
 * Main Application Entry Point
 * Initializes services, layout, and router.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Storage
    const storage = new Storage();

    // Initialize Services
    const apiService = new ApiService(storage);
    const authService = new AuthService(apiService, storage);
    const userService = new UserService(apiService);
    const imageService = new ImageService(apiService);
    const galleryService = new GalleryService(apiService);
    const commentService = new CommentService(apiService);
    const statsService = new StatsService(apiService);
    const stickerService = new StickerService(apiService);
    const webcamService = new WebcamService();

    // Initialize Layout
    const layout = new Layout(storage);
    window.appLayout = layout; // Expose for router to update
    
    const appContainer = document.getElementById('app');
    DOM.clear(appContainer);
    appContainer.appendChild(layout.render());

    // Define Routes
    const routes = [
        // Public Routes
        { path: '/', component: () => new HomePage(storage) },
        { path: '/gallery', component: () => new GalleryPage(galleryService, apiService, authService, storage) },
        { path: '/post/:id', component: () => new PostPage(apiService, authService, storage) },
        
        // Guest Only Routes
        { path: '/login', component: () => new LoginPage(authService), guestOnly: true },
        { path: '/register', component: () => new RegisterPage(authService), guestOnly: true },
        { path: '/verify', component: () => new VerifyPage(authService), guestOnly: true },
        { path: '/forgot-password', component: () => new ForgotPasswordPage(authService), guestOnly: true },
        { path: '/reset-password', component: () => new ResetPasswordPage(authService), guestOnly: true },
        
        // Protected Routes
        { path: '/upload', component: () => new UploadPage(imageService, stickerService, webcamService), protected: true },
        { path: '/profile', component: () => new ProfilePage(userService, statsService, authService, apiService, storage), protected: true },
        { path: '/settings', component: () => new SettingsPage(userService, authService), protected: true },
        { path: '/change-password', component: () => new ChangePasswordPage(authService), protected: true },
        
        // Fallback
        { path: '/404', component: () => ({ render: () => DOM.create('div', { className: 'p-8 text-center text-xl text-gray-600' }, ['Page Not Found']) }) }
    ];

    // Initialize Router
    const router = new Router(routes, storage);
    
    // Handle Logout Event
    window.addEventListener('app:logout', async () => {
        try {
            await authService.logout();
            window.location.hash = '#/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API fails
            storage.clearAuth();
            window.location.hash = '#/login';
        }
    });
});
