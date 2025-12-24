/**
 * Sidebar/Navigation Component
 * Responsive: Sidebar on desktop, Bottom Nav on mobile.
 */
class Sidebar {
    constructor(storage) {
        this.storage = storage;
        this.container = null;
    }

    render() {
        this.container = DOM.create('aside', {
            className: 'fixed top-0 right-0 z-20 flex h-full items-center pr-6 pointer-events-none' // pointer-events-none to let clicks pass through empty space
        });

        this.update();
        return this.container;
    }

    update() {
        if (!this.container) return;
        
        DOM.clear(this.container);
        
        const isAuth = this.storage.isAuthenticated();
        
        const nav = DOM.create('nav', {
            className: 'flex flex-col gap-3 rounded-full border border-cam-gray bg-cam-cream/80 p-3 backdrop-blur-sm shadow-sm pointer-events-auto'
        });

        const links = this.getLinks(isAuth);
        
        links.forEach(link => {
            const a = DOM.create('a', {
                href: link.path,
                className: `
                    group flex h-12 w-12 items-center justify-center rounded-full text-cam-olive 
                    hover:bg-cam-gray transition-colors duration-200
                `,
                title: link.label,
                dataset: { link: 'true' }
            });

            // Icon (Material Symbol)
            const iconSpan = DOM.create('span', { 
                className: 'material-symbols-outlined text-2xl' 
            }, [link.icon]);
            a.appendChild(iconSpan);

            if (link.action) {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    link.action();
                });
            }

            nav.appendChild(a);
        });

        this.container.appendChild(nav);
    }

    getLinks(isAuth) {
        // Using Material Symbols names
        const common = [
            { path: '#/', label: 'Home', icon: 'home' },
            { path: '#/gallery', label: 'Gallery', icon: 'grid_view' }
        ];

        if (isAuth) {
            return [
                ...common,
                { path: '#/upload', label: 'Post', icon: 'add_circle' },
                { path: '#/profile', label: 'Profile', icon: 'person' },
                { path: '#/settings', label: 'Settings', icon: 'settings' },
                { 
                    path: '#', 
                    label: 'Logout', 
                    icon: 'logout', 
                    action: () => {
                        window.dispatchEvent(new CustomEvent('app:logout'));
                    }
                }
            ];
        } else {
            return [
                ...common,
                { path: '#/login', label: 'Login', icon: 'login' }
            ];
        }
    }
}
