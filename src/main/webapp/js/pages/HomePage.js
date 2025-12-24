class HomePage {
    constructor(storage) {
        this.storage = storage;
    }

    async render() {
        const container = DOM.create('div', { className: 'flex flex-col gap-12 animate-fade-in' });
        const isAuth = this.storage.isAuthenticated();

        // Hero Section
        const hero = DOM.create('div', { 
            className: 'relative overflow-hidden rounded-3xl bg-cam-olive/10 p-8 md:p-16 text-center' 
        });
        
        let ctaButton = isAuth ? `
            <a href="#/upload" class="inline-flex items-center justify-center gap-2 rounded-xl bg-cam-olive px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105 hover:bg-cam-olive/90 shadow-lg shadow-cam-olive/20">
                <span class="material-symbols-outlined">add_a_photo</span>
                Start Creating
            </a>
        ` : `
            <a href="#/register" class="inline-flex items-center justify-center gap-2 rounded-xl bg-cam-olive px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105 hover:bg-cam-olive/90 shadow-lg shadow-cam-olive/20">
                <span class="material-symbols-outlined">rocket_launch</span>
                Get Started
            </a>
        `;

        hero.innerHTML = `
            <div class="relative z-10">
                <div class="mb-6 inline-flex items-center justify-center rounded-2xl bg-white p-4 shadow-sm">
                    <span class="material-symbols-outlined text-4xl text-cam-olive">photo_camera</span>
                </div>
                <h1 class="mb-6 font-brand text-5xl md:text-7xl text-gray-800">
                    Capture & <span class="text-cam-olive">Create</span>
                </h1>
                <p class="mx-auto mb-10 max-w-2xl text-xl text-gray-600 leading-relaxed">
                    The simplest way to add fun stickers to your photos. Join our community and start sharing your creations today.
                </p>
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    ${ctaButton}
                    <a href="#/gallery" class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-gray-800 transition-transform hover:scale-105 hover:bg-gray-50 shadow-sm border border-cam-tan">
                        <span class="material-symbols-outlined">grid_view</span>
                        Explore Gallery
                    </a>
                </div>
            </div>
            
            <!-- Decorative blobs -->
            <div class="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cam-tan/20 blur-3xl"></div>
            <div class="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cam-olive/20 blur-3xl"></div>
        `;
        
        container.appendChild(hero);

        // Features Grid
        const features = DOM.create('div', { className: 'grid gap-6 md:grid-cols-3' });
        features.innerHTML = `
            <div class="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-cam-gray">
                <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-cam-cream text-cam-olive group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">videocam</span>
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-800">Webcam Support</h3>
                <p class="text-gray-600">Take photos directly from your browser with live sticker previews and filters.</p>
            </div>
            <div class="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-cam-gray">
                <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-cam-cream text-cam-olive group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">favorite</span>
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-800">Social Sharing</h3>
                <p class="text-gray-600">Share your photos in the public gallery and get likes and comments from others.</p>
            </div>
            <div class="group rounded-2xl bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-cam-gray">
                <div class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-cam-cream text-cam-olive group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">sentiment_satisfied</span>
                </div>
                <h3 class="mb-3 text-xl font-bold text-gray-800">Fun Stickers</h3>
                <p class="text-gray-600">Choose from a variety of stickers to make your photos unique and expressive.</p>
            </div>
        `;
        container.appendChild(features);

        return container;
    }
}
