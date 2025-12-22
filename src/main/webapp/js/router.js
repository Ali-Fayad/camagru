/**
 * Client-side Router
 * Handles hash-based routing and route protection.
 */
class Router {
    constructor(routes, storage) {
        this.routes = routes;
        this.storage = storage;
        this.appContainer = document.getElementById('app');
        
        // Bind context
        this.handleRoute = this.handleRoute.bind(this);
        
        // Listen for hash changes
        window.addEventListener('hashchange', this.handleRoute);
        window.addEventListener('load', this.handleRoute);
    }

    /**
     * Navigate to a path programmatically
     */
    navigate(path) {
        window.location.hash = path;
    }

    /**
     * Handle route change
     */
    async handleRoute() {
        let hash = window.location.hash.slice(1) || '/';
        
        // Remove query params for matching
        const [path, query] = hash.split('?');
        
        // Find matching route
        let route = this.routes.find(r => r.path === path);
        
        // 404 handling
        if (!route) {
            console.warn('Route not found:', path);
            // Try to find a 404 route or redirect home
            route = this.routes.find(r => r.path === '/404');
            if (!route) {
                window.location.hash = '#/';
                return;
            }
        }

        // Route Protection
        const isAuth = this.storage.isAuthenticated();

        if (route.protected && !isAuth) {
            this.navigate('/login');
            return;
        }

        if (route.guestOnly && isAuth) {
            this.navigate('/');
            return;
        }

        // Render the route
        await this.renderRoute(route);
        
        // Update active state in sidebar/navbar if they exist
        this.updateNavigationState(path);
    }

    async renderRoute(route) {
        // Show loading state if needed
        
        try {
            // Create page instance (factory pattern from main.js)
            const page = await route.component();
            
            // Render page content
            const content = await page.render();
            
            // Inject into Layout
            // We assume a global Layout instance or we re-render layout
            // Better: The Router renders the Layout with the Page Content
            
            if (window.appLayout) {
                window.appLayout.setContent(content);
                window.appLayout.updateSidebar(); // Update auth state in sidebar
            } else {
                // Fallback if layout not initialized
                this.appContainer.innerHTML = '';
                this.appContainer.appendChild(content);
            }
            
            // Initialize page logic (event listeners, data fetch)
            if (page.afterRender) {
                await page.afterRender();
            }
            
            // Store current page for cleanup
            if (this.currentPage && this.currentPage.destroy) {
                this.currentPage.destroy();
            }
            this.currentPage = page;

        } catch (error) {
            console.error('Render error:', error);
            this.appContainer.innerHTML = '<div class="p-4 text-red-500">Error loading page</div>';
        }
    }
    
    updateNavigationState(path) {
        // Helper to update UI active states
        const links = document.querySelectorAll('[data-link]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${path}`) {
                link.classList.add('text-blue-600', 'bg-blue-50');
                link.classList.remove('text-gray-600');
            } else {
                link.classList.remove('text-blue-600', 'bg-blue-50');
                link.classList.add('text-gray-600');
            }
        });
    }
}
