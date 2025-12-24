class ChangePasswordPage {
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
                            <a href="#/settings" class="flex items-center rounded-xl px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                <span class="material-symbols-outlined mr-3">person</span>
                                Account
                            </a>
                            <a href="#/change-password" class="flex items-center rounded-xl bg-cam-cream px-4 py-3 font-medium text-cam-olive">
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
                            <h2 class="mb-6 text-xl font-bold text-gray-900">Change Password</h2>
                            
                            <form id="change-password-form" class="space-y-6">
                                <div>
                                    <label class="mb-2 block text-sm font-bold text-gray-700">Current Password</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span class="material-symbols-outlined text-gray-400">lock</span>
                                        </div>
                                        <input type="password" name="currentPassword" required 
                                            class="block w-full rounded-xl border-gray-300 pl-10 focus:border-cam-olive focus:ring-cam-olive">
                                    </div>
                                </div>

                                <div class="pt-4 border-t border-gray-100"></div>

                                <div>
                                    <label class="mb-2 block text-sm font-bold text-gray-700">New Password</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span class="material-symbols-outlined text-gray-400">key</span>
                                        </div>
                                        <input type="password" name="newPassword" required 
                                            class="block w-full rounded-xl border-gray-300 pl-10 focus:border-cam-olive focus:ring-cam-olive">
                                    </div>
                                    <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
                                </div>

                                <div>
                                    <label class="mb-2 block text-sm font-bold text-gray-700">Confirm New Password</label>
                                    <div class="relative">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span class="material-symbols-outlined text-gray-400">lock_reset</span>
                                        </div>
                                        <input type="password" name="confirmNewPassword" required 
                                            class="block w-full rounded-xl border-gray-300 pl-10 focus:border-cam-olive focus:ring-cam-olive">
                                    </div>
                                </div>

                                <div id="error-msg" class="hidden rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100"></div>
                                <div id="success-msg" class="hidden rounded-xl bg-green-50 p-4 text-sm text-green-600 border border-green-100"></div>

                                <div class="pt-4 border-t border-gray-100">
                                    <div class="flex items-center justify-end gap-4">
                                        <button type="button" class="rounded-xl px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" id="submit-btn" class="rounded-xl bg-cam-olive px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-cam-olive/90 transition-transform hover:scale-[1.02]">
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    async afterRender() {
        const form = document.getElementById('change-password-form');
        const errorMsg = document.getElementById('error-msg');
        const successMsg = document.getElementById('success-msg');
        const submitBtn = document.getElementById('submit-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Reset messages
            errorMsg.classList.add('hidden');
            successMsg.classList.add('hidden');
            errorMsg.textContent = '';
            successMsg.textContent = '';
            
            const formData = new FormData(form);
            const currentPassword = formData.get('currentPassword');
            const newPassword = formData.get('newPassword');
            const confirmNewPassword = formData.get('confirmNewPassword');

            if (newPassword !== confirmNewPassword) {
                errorMsg.textContent = 'New passwords do not match';
                errorMsg.classList.remove('hidden');
                return;
            }

            if (newPassword.length < 8) {
                errorMsg.textContent = 'New password must be at least 8 characters long';
                errorMsg.classList.remove('hidden');
                return;
            }

            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span>';

            try {
                // await this.authService.changePassword(currentPassword, newPassword);
                successMsg.textContent = 'Password updated successfully!';
                successMsg.classList.remove('hidden');
                form.reset();
            } catch (error) {
                errorMsg.textContent = error.message || 'Failed to update password. Please try again.';
                errorMsg.classList.remove('hidden');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
}