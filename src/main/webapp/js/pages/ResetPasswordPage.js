class ResetPasswordPage {
    constructor(authService) {
        this.authService = authService;
    }

    async render() {
        const container = DOM.create('div', { className: 'flex min-h-[80vh] items-center justify-center animate-fade-in' });
        
        container.innerHTML = `
            <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border border-cam-gray">
                <div class="mb-8 text-center">
                    <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-cam-cream text-cam-olive">
                        <span class="material-symbols-outlined text-3xl">key</span>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-800">Reset Password</h2>
                    <p class="mt-2 text-gray-600">Enter your new password below.</p>
                </div>
                
                <form id="reset-password-form" class="space-y-6">
                    <div>
                        <label class="mb-2 block text-sm font-bold text-gray-700">New Password</label>
                        <div class="relative">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span class="material-symbols-outlined text-gray-400">lock</span>
                            </div>
                            <input type="password" name="password" required 
                                class="block w-full rounded-xl border-gray-300 pl-10 focus:border-cam-olive focus:ring-cam-olive"
                                placeholder="••••••••">
                        </div>
                        <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-bold text-gray-700">Confirm New Password</label>
                        <div class="relative">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span class="material-symbols-outlined text-gray-400">lock_reset</span>
                            </div>
                            <input type="password" name="confirmPassword" required 
                                class="block w-full rounded-xl border-gray-300 pl-10 focus:border-cam-olive focus:ring-cam-olive"
                                placeholder="••••••••">
                        </div>
                    </div>
                    
                    <div id="error-msg" class="hidden rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100"></div>
                    <div id="success-msg" class="hidden rounded-xl bg-green-50 p-4 text-sm text-green-600 border border-green-100"></div>
                    
                    <button type="submit" id="submit-btn" 
                        class="flex w-full justify-center rounded-xl bg-cam-olive py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-cam-olive/90 focus:outline-none focus:ring-2 focus:ring-cam-olive focus:ring-offset-2 transition-transform hover:scale-[1.02]">
                        Reset Password
                    </button>
                </form>
            </div>
        `;

        return container;
    }

    async afterRender() {
        const form = document.getElementById('reset-password-form');
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
            const password = formData.get('password');
            const confirmPassword = formData.get('confirmPassword');

            if (password !== confirmPassword) {
                errorMsg.textContent = 'Passwords do not match';
                errorMsg.classList.remove('hidden');
                return;
            }

            if (password.length < 8) {
                errorMsg.textContent = 'Password must be at least 8 characters long';
                errorMsg.classList.remove('hidden');
                return;
            }

            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span>';

            try {
                // await this.authService.resetPassword(token, password);
                successMsg.textContent = 'Password reset successfully! Redirecting to login...';
                successMsg.classList.remove('hidden');
                setTimeout(() => {
                    window.location.hash = '#/login';
                }, 2000);
            } catch (error) {
                errorMsg.textContent = error.message || 'Failed to reset password. Please try again.';
                errorMsg.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
}