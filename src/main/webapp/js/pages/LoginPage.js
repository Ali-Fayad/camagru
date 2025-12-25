class LoginPage {
    constructor(authService) {
        this.authService = authService;
    }

    async render() {
        const container = DOM.create('div', { className: 'flex min-h-[80vh] items-center justify-center animate-fade-in' });
        
        container.innerHTML = `
            <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border border-cam-gray">
                <div class="mb-8 text-center">
                    <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-cam-cream text-cam-olive">
                        <span class="material-symbols-outlined text-3xl">lock</span>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p class="mt-2 text-gray-600">Sign in to continue to Camagru</p>
                </div>
                
                <form id="login-form" class="space-y-6">
                    <div>
                        <label class="mb-2 block text-sm font-bold text-gray-700">Email Address</label>
                        <div class="relative">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span class="material-symbols-outlined text-gray-400">mail</span>
                            </div>
                            <input type="email" name="email" required 
                                class="block w-full rounded-xl border-gray-300 pl-10 focus:border-cam-olive focus:ring-cam-olive"
                                placeholder="you@example.com">
                        </div>
                    </div>
                    
                    <div>
                        <label class="mb-2 block text-sm font-bold text-gray-700">Password</label>
                        <div class="relative">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span class="material-symbols-outlined text-gray-400">key</span>
                            </div>
                            <input type="password" name="password" required 
                                class="block w-full rounded-xl border-gray-300 pl-10 focus:border-cam-olive focus:ring-cam-olive"
                                placeholder="••••••••">
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" 
                                class="h-4 w-4 rounded border-gray-300 text-cam-olive focus:ring-cam-olive">
                            <label for="remember-me" class="ml-2 block text-sm text-gray-600">Remember me</label>
                        </div>
                        <a href="#/forgot-password" class="text-sm font-bold text-cam-olive hover:text-cam-olive/80">Forgot password?</a>
                    </div>
                    
                    <div id="error-msg" class="hidden rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100"></div>
                    
                    <button type="submit" id="submit-btn" 
                        class="flex w-full justify-center rounded-xl bg-cam-olive py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-cam-olive/90 focus:outline-none focus:ring-2 focus:ring-cam-olive focus:ring-offset-2 transition-transform hover:scale-[1.02]">
                        Sign In
                    </button>
                </form>
                
                <div class="mt-8 text-center text-sm text-gray-600">
                    Don't have an account? 
                    <a href="#/register" class="font-bold text-cam-olive hover:text-cam-olive/80">Create an account</a>
                </div>
            </div>
        `;

        return container;
    }

    async afterRender() {
        const form = document.getElementById('login-form');
        const errorMsg = document.getElementById('error-msg');
        const submitBtn = document.getElementById('submit-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Reset error
            errorMsg.classList.add('hidden');
            errorMsg.textContent = '';
            
            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span>';
            
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                const response = await this.authService.login(email, password);
                
                // Check if verification is required (status 201)
                if (response && response._status === 201) {
                    localStorage.setItem('pendingVerificationEmail', email);
                    window.location.hash = '#/verify';
                    return;
                }

                // Successful login, go to home
                window.location.hash = '#/';
            } catch (error) {
                errorMsg.textContent = error.message || 'Invalid email or password';
                errorMsg.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
}
