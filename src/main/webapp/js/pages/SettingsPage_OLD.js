class SettingsPage {
    constructor(authService) {
        this.authService = authService;
    }

    async render() {
        const container = DOM.create('div', { className: 'container mx-auto px-4 py-8 animate-fade-in' });
        
        container.innerHTML = `
            <div class="mx-auto max-w-4xl">
                <div class="mb-8 flex items-center justify-between">
                    <div>
                        <h1 class="font-display text-3xl font-bold text-gray-900">Settings</h1>
                        <p class="mt-1 text-gray-600">Manage your account preferences</p>
                    </div>
                </div>

                <div class="grid gap-8 md:grid-cols-3">
                    <!-- Sidebar Navigation -->
                    <div class="md:col-span-1">
                        <nav class="space-y-1 rounded-2xl bg-white p-4 shadow-sm border border-cam-gray">
                            <a href="#/settings" class="flex items-center rounded-xl bg-cam-cream px-4 py-3 font-medium text-cam-olive">
                                <span class="material-symbols-outlined mr-3">person</span>
                                Account
                            </a>
                            <a href="#/change-password" class="flex items-center rounded-xl px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                <span class="material-symbols-outlined mr-3">lock</span>
                                Security
                            </a>
                            <a href="#" class="flex items-center rounded-xl px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                <span class="material-symbols-outlined mr-3">notifications</span>
                                Notifications
                            </a>
                            <a href="#" class="flex items-center rounded-xl px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                <span class="material-symbols-outlined mr-3">visibility</span>
                                Privacy
                            </a>
                        </nav>
                    </div>

                    <!-- Main Content -->
                    <div class="md:col-span-2">
                        <div class="rounded-3xl bg-white p-8 shadow-lg border border-cam-gray">
                            <h2 class="mb-6 text-xl font-bold text-gray-900">Account Information</h2>
                            
                            <form id="settings-form" class="space-y-6">
                                <div class="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <label class="mb-2 block text-sm font-bold text-gray-700">First Name</label>
                                        <input type="text" name="firstName" value="John"
                                            class="block w-full rounded-xl border-gray-300 focus:border-cam-olive focus:ring-cam-olive">
                                    </div>
                                    <div>
                                        <label class="mb-2 block text-sm font-bold text-gray-700">Last Name</label>
                                        <input type="text" name="lastName" value="Doe"
                                            class="block w-full rounded-xl border-gray-300 focus:border-cam-olive focus:ring-cam-olive">
                                    </div>
                                </div>

                                <div>
                                    <label class="mb-2 block text-sm font-bold text-gray-700">Email Address</label>
                                    <input type="email" name="email" value="john.doe@example.com" disabled
                                        class="block w-full rounded-xl border-gray-300 bg-gray-50 text-gray-500">
                                    <p class="mt-1 text-xs text-gray-500">Contact support to change your email address</p>
                                </div>

                                <div>
                                    <label class="mb-2 block text-sm font-bold text-gray-700">Bio</label>
                                    <textarea name="bio" rows="4" 
                                        class="block w-full rounded-xl border-gray-300 focus:border-cam-olive focus:ring-cam-olive"
                                        placeholder="Tell us a little about yourself..."></textarea>
                                </div>

                                <div class="pt-4 border-t border-gray-100">
                                    <div class="flex items-center justify-end gap-4">
                                        <button type="button" class="rounded-xl px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" class="rounded-xl bg-cam-olive px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-cam-olive/90 transition-transform hover:scale-[1.02]">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div class="mt-8 rounded-3xl bg-white p-8 shadow-lg border border-cam-gray">
                            <h2 class="mb-6 text-xl font-bold text-red-600">Danger Zone</h2>
                            <div class="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-4">
                                <div>
                                    <h3 class="font-bold text-red-800">Delete Account</h3>
                                    <p class="text-sm text-red-600">Once you delete your account, there is no going back.</p>
                                </div>
                                <button class="rounded-lg bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm border border-red-200 hover:bg-red-50 transition-colors">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    async afterRender() {
        // Add event listeners
    }
}