/**
 * Mobile Top Navbar
 * Visible only on mobile/tablet.
 */
class Navbar {
    render() {
        const nav = DOM.create('header', {
            className: 'md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-40 flex items-center px-4 justify-between shadow-sm'
        });

        const logo = DOM.create('div', { className: 'font-bold text-xl text-blue-600 flex items-center gap-2' });
        logo.innerHTML = `
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
            <span>Camagru</span>
        `;
        
        nav.appendChild(logo);
        return nav;
    }
}
