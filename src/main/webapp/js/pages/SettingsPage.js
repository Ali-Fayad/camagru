class SettingsPage {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
        this.user = null;
        this.activeTab = 'account';
    }

    async render() {
        // Get user from storage
        const storage = new Storage();
        this.user = storage.getUser();

        const container = DOM.create('div', { className: 'container mx-auto px-4 py-8 animate-fade-in' });
        
        container.innerHTML = `
            <div class="mx-auto max-w-4xl">
                <div class="mb-8">
                    <h1 class="font-display text-3xl font-bold text-gray-900">Settings</h1>
                    <p class="mt-1 text-gray-600">Manage your account preferences</p>
                </div>

                <div class="grid gap-8 md:grid-cols-3">
                    <!-- Sidebar Navigation -->
                    <div class="md:col-span-1">
                        <nav class="space-y-1 rounded-2xl bg-white p-4 shadow-sm border border-cam-gray">
                            <button data-tab="account" class="tab-btn w-full flex items-center rounded-xl px-4 py-3 font-medium text-left transition-colors bg-cam-cream text-cam-olive">
                                <span class="material-symbols-outlined mr-3">person</span>
                                Account
                            </button>
                            <button data-tab="security" class="tab-btn w-full flex items-center rounded-xl px-4 py-3 font-medium text-gray-600 hover:bg-gray-50 transition-colors text-left">
                                <span class="material-symbols-outlined mr-3">lock</span>
                                Security
                            </button>
                        </nav>
                    </div>

                    <!-- Main Content -->
                    <div class="md:col-span-2">
                        <!-- Account Tab -->
                        <div id="account-tab" class="tab-content">
                            <div class="rounded-3xl bg-white p-8 shadow-lg border border-cam-gray">
                                <h2 class="mb-6 text-xl font-bold text-gray-900">Account Information</h2>
                                
                                <form id="account-form" class="space-y-6">
                                    <div>
                                        <label class="mb-2 block text-sm font-bold text-gray-700">Username</label>
                                        <input type="text" name="username" value="${this.user?.username || ''}"
                                            class="block w-full rounded-xl border-gray-300 focus:border-cam-olive focus:ring-cam-olive">
                                    </div>

                                    <div>
                                        <label class="mb-2 block text-sm font-bold text-gray-700">Email Address</label>
                                        <input type="email" name="email" value="${this.user?.email || ''}" readonly
                                            class="block w-full rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed">
                                        <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                                    </div>

                                    <div id="account-message" class="hidden"></div>

                                    <div class="pt-4 border-t border-gray-100">
                                        <div class="flex items-center justify-end gap-4">
                                            <button type="button" id="cancel-btn" class="rounded-xl px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                                                Cancel
                                            </button>
                                            <button type="submit" id="save-account-btn" class="rounded-xl bg-cam-olive px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-cam-olive/90 transition-transform hover:scale-[1.02]">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Security Tab -->
                        <div id="security-tab" class="tab-content hidden">
                            <!-- Change Password Section -->
                            <div class="rounded-3xl bg-white p-8 shadow-lg border border-cam-gray mb-6">
                                <h2 class="mb-6 text-xl font-bold text-gray-900">Change Password</h2>
                                
                                <form id="password-form" class="space-y-6">
                                    <div>
                                        <label class="mb-2 block text-sm font-bold text-gray-700">Current Password</label>
                                        <input type="password" name="oldPassword" required
                                            class="block w-full rounded-xl border-gray-300 focus:border-cam-olive focus:ring-cam-olive"
                                            placeholder="••••••••">
                                    </div>

                                    <div>
                                        <label class="mb-2 block text-sm font-bold text-gray-700">New Password</label>
                                        <input type="password" name="newPassword" required
                                            class="block w-full rounded-xl border-gray-300 focus:border-cam-olive focus:ring-cam-olive"
                                            placeholder="••••••••">
                                        <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters with uppercase, lowercase, and number</p>
                                    </div>

                                    <div>
                                        <label class="mb-2 block text-sm font-bold text-gray-700">Confirm New Password</label>
                                        <input type="password" name="confirmPassword" required
                                            class="block w-full rounded-xl border-gray-300 focus:border-cam-olive focus:ring-cam-olive"
                                            placeholder="••••••••">
                                    </div>

                                    <div id="password-message" class="hidden"></div>

                                    <div class="pt-4 border-t border-gray-100">
                                        <button type="submit" id="change-password-btn" class="rounded-xl bg-cam-olive px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-cam-olive/90 transition-transform hover:scale-[1.02]">
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                            
                            <!-- Notifications Section -->
                            <div class="rounded-3xl bg-white p-8 shadow-lg border border-cam-gray mb-6">
                                <h2 class="mb-6 text-xl font-bold text-gray-900">Notifications</h2>
                                
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="font-bold text-gray-900">Email Notifications</p>
                                        <p class="text-sm text-gray-500">Receive emails when someone comments on your posts</p>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" id="notifications-toggle" class="sr-only peer" checked>
                                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cam-olive/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cam-olive"></div>
                                    </label>
                                </div>
                            </div>
                            
                            <!-- Delete Account Section -->
                            <div class="rounded-3xl bg-white p-8 shadow-lg border border-red-200">
                                <h2 class="mb-2 text-xl font-bold text-red-600">Delete Account</h2>
                                <p class="mb-6 text-sm text-gray-600">Permanently delete your account and all your data. This action cannot be undone.</p>
                                
                                <button id="delete-account-btn" class="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-transform hover:scale-[1.02]">
                                    Delete My Account
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
        this.setupTabNavigation();
        this.setupAccountForm();
        this.setupPasswordForm();
        this.setupNotificationsToggle();
        this.setupDeleteAccount();
    }

    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
    }

    switchTab(tab) {
        // Update nav
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tab) {
                btn.classList.add('bg-cam-cream', 'text-cam-olive');
                btn.classList.remove('text-gray-600');
            } else {
                btn.classList.remove('bg-cam-cream', 'text-cam-olive');
                btn.classList.add('text-gray-600');
            }
        });

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tab}-tab`).classList.remove('hidden');
        
        this.activeTab = tab;
    }

    setupAccountForm() {
        const form = document.getElementById('account-form');
        const messageDiv = document.getElementById('account-message');
        const submitBtn = document.getElementById('save-account-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            messageDiv.classList.add('hidden');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            const formData = new FormData(form);
            const data = {};
            
            if (formData.get('username') !== this.user?.username) {
                data.username = formData.get('username');
            }
            // Email is read-only, don't include it

            if (Object.keys(data).length === 0) {
                this.showMessage(messageDiv, 'No changes to save', 'info');
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return;
            }

            try {
                await this.userService.updateProfile(data);
                
                // Update stored user
                const storage = new Storage();
                const updatedUser = { ...this.user, ...data };
                storage.setUser(updatedUser);
                this.user = updatedUser;

                this.showMessage(messageDiv, 'Profile updated successfully!', 'success');
            } catch (error) {
                this.showMessage(messageDiv, error.message || 'Failed to update profile', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            form.reset();
            form.querySelector('[name="username"]').value = this.user?.username || '';
            form.querySelector('[name="email"]').value = this.user?.email || '';
        });
    }

    setupPasswordForm() {
        const form = document.getElementById('password-form');
        const messageDiv = document.getElementById('password-message');
        const submitBtn = document.getElementById('change-password-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            messageDiv.classList.add('hidden');

            const formData = new FormData(form);
            const newPassword = formData.get('newPassword');
            const confirmPassword = formData.get('confirmPassword');

            if (newPassword !== confirmPassword) {
                this.showMessage(messageDiv, 'Passwords do not match', 'error');
                return;
            }

            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';

            try {
                await this.userService.changePassword(
                    formData.get('oldPassword'),
                    newPassword
                );

                this.showMessage(messageDiv, 'Password changed successfully!', 'success');
                form.reset();
            } catch (error) {
                this.showMessage(messageDiv, error.message || 'Failed to change password', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
    
    setupNotificationsToggle() {
        const toggle = document.getElementById('notifications-toggle');
        if (!toggle) return;
        
        // Set initial state from user preferences
        toggle.checked = true; // Default to true
        
        toggle.addEventListener('change', async (e) => {
            const enabled = e.target.checked;
            
            try {
                await this.userService.toggleNotifications(enabled);
            } catch (error) {
                console.error('Failed to update notifications:', error);
                // Revert toggle on error
                e.target.checked = !enabled;
            }
        });
    }
    
    setupDeleteAccount() {
        const deleteBtn = document.getElementById('delete-account-btn');
        if (!deleteBtn) return;
        
        deleteBtn.addEventListener('click', async () => {
            const confirmed = confirm(
                'Are you absolutely sure? This will permanently delete your account and all your data. This action cannot be undone.'
            );
            
            if (!confirmed) return;
            
            const doubleConfirm = prompt('Type "DELETE" to confirm account deletion:');
            
            if (doubleConfirm !== 'DELETE') {
                alert('Account deletion cancelled.');
                return;
            }
            
            deleteBtn.disabled = true;
            deleteBtn.textContent = 'Deleting...';
            
            try {
                await this.userService.deleteAccount();
                
                // Clear all auth data
                const storage = new Storage();
                storage.clearAuth();
                
                alert('Your account has been deleted.');
                window.location.hash = '#/';
            } catch (error) {
                alert('Failed to delete account: ' + (error.message || 'Unknown error'));
                deleteBtn.disabled = false;
                deleteBtn.textContent = 'Delete My Account';
            }
        });
    }

    showMessage(element, message, type = 'info') {
        const colors = {
            success: 'bg-green-50 text-green-700 border-green-200',
            error: 'bg-red-50 text-red-700 border-red-200',
            info: 'bg-blue-50 text-blue-700 border-blue-200'
        };

        element.className = `rounded-xl p-4 text-sm border ${colors[type]}`;
        element.textContent = message;
        element.classList.remove('hidden');

        if (type === 'success') {
            setTimeout(() => {
                element.classList.add('hidden');
            }, 5000);
        }
    }
}
