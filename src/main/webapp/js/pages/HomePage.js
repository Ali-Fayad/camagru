class HomePage {
    constructor(storage) {
        this.storage = storage;
    }

    async render() {
        const container = DOM.create('div', { className: 'flex flex-col gap-8 animate-fade-in' });
        const isAuth = this.storage.isAuthenticated();

        // Hero Section
        const hero = DOM.create('div', { 
            className: 'bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center border border-gray-100' 
        });
        
        let buttonsHtml = `
            <a href="#/gallery" class="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-200">
                Explore Gallery
            </a>
        `;

        if (!isAuth) {
            buttonsHtml += `
                <a href="#/register" class="px-8 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 font-semibold transition-all hover:border-gray-300">
                    Get Started
                </a>
            `;
        } else {
            buttonsHtml += `
                <a href="#/upload" class="px-8 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 font-semibold transition-all transform hover:scale-105 shadow-lg shadow-green-200">
                    Take Photo
                </a>
            `;
        }

        hero.innerHTML = `
            <div class="mb-6 inline-block p-3 bg-blue-50 rounded-2xl">
                <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
            </div>
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Capture & <span class="text-blue-600">Create</span>
            </h1>
            <p class="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                The simplest way to add fun stickers to your photos. Join our community and start sharing your creations today.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                ${buttonsHtml}
            </div>
        `;
        
        container.appendChild(hero);

        // Features Grid
        const features = DOM.create('div', { className: 'grid md:grid-cols-3 gap-6' });
        features.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Webcam Support</h3>
                <p class="text-gray-500">Take photos directly from your browser with live sticker previews.</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Social Sharing</h3>
                <p class="text-gray-500">Share your photos in the public gallery and get likes and comments.</p>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Fun Stickers</h3>
                <p class="text-gray-500">Choose from a variety of stickers to make your photos unique.</p>
            </div>
        `;
        container.appendChild(features);

        return container;
    }
}
