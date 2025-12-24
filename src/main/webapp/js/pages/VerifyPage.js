class VerifyPage {
    constructor(authService) {
        this.authService = authService;
    }

    async render() {
        const container = DOM.create('div', { className: 'flex min-h-[80vh] items-center justify-center animate-fade-in' });
        
        container.innerHTML = `
            <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border border-cam-gray">
                <div class="mb-8 text-center">
                    <div class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-cam-cream text-cam-olive">
                        <span class="material-symbols-outlined text-3xl">mark_email_read</span>
                    </div>
                    <h2 class="text-3xl font-bold text-gray-800">Check Your Email</h2>
                    <p class="mt-2 text-gray-600">We've sent a verification code to you. Please enter it below to continue.</p>
                </div>
                
                <form id="verify-form" class="space-y-6">
                    <div>
                        <label class="mb-2 block text-sm font-bold text-gray-700">Verification Code</label>
                        <div class="relative">
                            <input type="text" name="code" required maxlength="6"
                                class="block w-full rounded-xl border-gray-300 text-center text-2xl tracking-[0.5em] font-mono focus:border-cam-olive focus:ring-cam-olive uppercase"
                                placeholder="------">
                        </div>
                    </div>
                    
                    <div id="error-msg" class="hidden rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100"></div>
                    <div id="success-msg" class="hidden rounded-xl bg-green-50 p-4 text-sm text-green-600 border border-green-100"></div>
                    
                    <button type="submit" id="submit-btn" 
                        class="flex w-full justify-center rounded-xl bg-cam-olive py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-cam-olive/90 focus:outline-none focus:ring-2 focus:ring-cam-olive focus:ring-offset-2 transition-transform hover:scale-[1.02]">
                        Verify
                    </button>
                </form>
                
                <div class="mt-8 text-center">
                    <button id="resend-btn" class="text-sm font-bold text-gray-500 hover:text-cam-olive transition-colors">
                        Didn't receive the email? Resend
                    </button>
                </div>
            </div>
        `;

        return container;
    }

    async afterRender() {
        const form = document.getElementById('verify-form');
        const errorMsg = document.getElementById('error-msg');
        const successMsg = document.getElementById('success-msg');
        const submitBtn = document.getElementById('submit-btn');
        const resendBtn = document.getElementById('resend-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Reset messages
            errorMsg.classList.add('hidden');
            successMsg.classList.add('hidden');
            errorMsg.textContent = '';
            successMsg.textContent = '';
            
            const formData = new FormData(form);
            const code = formData.get('code');

            // Loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span>';

            try {
                await this.authService.verify(code);
                successMsg.textContent = 'Email verified successfully!';
                successMsg.classList.remove('hidden');
                setTimeout(() => {
                    window.location.hash = '#/login';
                }, 2000);
            } catch (error) {
                errorMsg.textContent = error.message || 'Verification failed. Invalid code.';
                errorMsg.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });

        resendBtn.addEventListener('click', async () => {
            resendBtn.disabled = true;
            resendBtn.textContent = 'Sending...';
            
            try {
                // await this.authService.resendVerification();
                alert('Verification code resent! (Mock)');
                resendBtn.textContent = 'Sent!';
                setTimeout(() => {
                    resendBtn.textContent = "Didn't receive the email? Resend";
                    resendBtn.disabled = false;
                }, 30000);
            } catch (error) {
                alert('Failed to resend code.');
                resendBtn.disabled = false;
                resendBtn.textContent = "Didn't receive the email? Resend";
            }
        });
    }
}