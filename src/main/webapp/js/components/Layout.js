/**
 * Main Application Layout
 * Handles the responsive sidebar/navbar structure and content injection.
 */
class Layout {
    constructor(storage) {
        this.storage = storage;
        this.sidebar = new Sidebar(storage);
        this.navbar = new Navbar();
        this.contentContainer = null;
    }

    render() {
        const container = DOM.create('div', { className: 'flex flex-col md:flex-row min-h-screen w-full' });

        // Mobile Navbar (Top)
        container.appendChild(this.navbar.render());

        // Sidebar (Bottom mobile, Left desktop)
        const sidebarEl = this.sidebar.render();
        container.appendChild(sidebarEl);

        // Main Content Area
        // pt-20 on mobile to account for fixed header (16) + spacing (4)
        // mb-16 on mobile to account for fixed bottom nav
        // md:pt-8 md:mb-0 on desktop
        const main = DOM.create('main', { 
            className: 'flex-grow bg-gray-50 p-4 md:p-8 overflow-y-auto mb-16 md:mb-0 pt-20 md:pt-8' 
        });
        
        this.contentContainer = DOM.create('div', { className: 'max-w-7xl mx-auto' });
        main.appendChild(this.contentContainer);
        
        container.appendChild(main);

        return container;
    }

    setContent(element) {
        if (this.contentContainer) {
            DOM.clear(this.contentContainer);
            this.contentContainer.appendChild(element);
        }
    }

    updateSidebar() {
        this.sidebar.update();
    }
}
