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
        this.container = DOM.create('nav', {
            className: `
                fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 z-50 flex justify-around items-center
                md:relative md:w-64 md:h-screen md:flex-col md:justify-start md:border-t-0 md:border-r md:p-4
            `
        });

        this.update();
        return this.container;
    }

    update() {
        if (!this.container) return;
        
        DOM.clear(this.container);
        
        const isAuth = this.storage.isAuthenticated();
        
        // Logo (Desktop only)
        const logo = DOM.create('div', { 
            className: 'hidden md:flex items-center gap-2 mb-8 px-2' 
        });
        logo.innerHTML = `
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span class="text-xl font-bold text-gray-800">Camagru</span>
        `;
        this.container.appendChild(logo);

        // Navigation Links
        const linksContainer = DOM.create('div', {
            className: 'flex w-full justify-around md:flex-col md:gap-2'
        });

        const links = this.getLinks(isAuth);
        
        links.forEach(link => {
            const a = DOM.create('a', {
                href: link.path,
                className: `
                    flex flex-col md:flex-row items-center md:gap-3 p-2 rounded-lg transition-colors
                    text-gray-600 hover:bg-gray-50 hover:text-blue-600
                `,
                dataset: { link: 'true' } // For router to highlight
            });

            // Icon
            const iconDiv = DOM.create('div', { className: 'w-6 h-6' });
            iconDiv.innerHTML = link.icon;
            a.appendChild(iconDiv);

            // Label (Hidden on mobile for some, or small)
            const label = DOM.create('span', { 
                className: 'text-xs md:text-sm font-medium mt-1 md:mt-0' 
            }, [link.label]);
            a.appendChild(label);

            if (link.action) {
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    link.action();
                });
            }

            linksContainer.appendChild(a);
        });

        this.container.appendChild(linksContainer);
        
        // User Info (Desktop only, bottom)
        if (isAuth) {
            const user = this.storage.getUser();
            const userDiv = DOM.create('div', {
                className: 'hidden md:flex mt-auto pt-4 border-t border-gray-100 w-full items-center gap-3'
            });
            userDiv.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    ${user.username ? user.username[0].toUpperCase() : 'U'}
                </div>
                <div class="flex-col overflow-hidden">
                    <div class="text-sm font-medium text-gray-900 truncate">${user.username}</div>
                    <div class="text-xs text-gray-500 truncate">${user.email}</div>
                </div>
            `;
            this.container.appendChild(userDiv);
        }
    }

    getLinks(isAuth) {
        const icons = {
            home: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
            gallery: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
            upload: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>',
            profile: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
            settings: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
            login: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>',
            logout: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>'
        };

        const common = [
            { path: '#/', label: 'Home', icon: icons.home },
            { path: '#/gallery', label: 'Gallery', icon: icons.gallery }
        ];

        if (isAuth) {
            return [
                ...common,
                { path: '#/upload', label: 'Upload', icon: icons.upload },
                { path: '#/profile', label: 'Profile', icon: icons.profile },
                { path: '#/settings', label: 'Settings', icon: icons.settings },
                { 
                    path: '#', 
                    label: 'Logout', 
                    icon: icons.logout, 
                    action: () => {
                        // Dispatch logout event or call service
                        // Since we don't have the service here, we can emit a custom event
                        window.dispatchEvent(new CustomEvent('app:logout'));
                    }
                }
            ];
        } else {
            return [
                ...common,
                { path: '#/login', label: 'Login', icon: icons.login }
            ];
        }
    }
}
