class LoginPage {
    constructor(authService) {
        this.authService = authService;
    }

    async render() {
        const container = DOM.create('div', { className: 'max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in' });
        
        container.innerHTML = `
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p class="text-gray-500 mt-2">Sign in to continue to Camagru</p>
            </div>
            
            <form id="login-form" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" name="email" required 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="you@example.com">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" name="password" required 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="••••••••">
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
                    </div>
                    <a href="#/forgot-password" class="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
                </div>
                
                <div id="error-msg" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg hidden border border-red-100"></div>
                
                <button type="submit" id="submit-btn" class="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm flex justify-center items-center">
                    Sign In
                </button>
            </form>
            
            <div class="mt-6 text-center text-sm text-gray-600">
                Don't have an account? <a href="#/register" class="font-medium text-blue-600 hover:text-blue-500">Create an account</a>
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
            submitBtn.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
            
            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');

            try {
                await this.authService.login(email, password);
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
