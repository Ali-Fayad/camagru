class UploadPage {
    constructor(imageService, stickerService, webcamService) {
        this.imageService = imageService;
        this.stickerService = stickerService;
        this.webcamService = webcamService;
        this.stream = null;
        this.selectedStickerIndex = 0; // Default to first sticker
    }

    async render() {
        const container = DOM.create('div', { className: 'container mx-auto max-w-5xl px-4 py-8 animate-fade-in' });
        
        container.innerHTML = `
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div class="lg:col-span-2 space-y-6">
                    <div class="rounded-3xl border border-cam-gray bg-white p-6 shadow-xl shadow-cam-tan/20">
                        <h2 class="mb-4 text-2xl font-bold text-gray-900">Create Post</h2>
                        
                        <div class="mb-4 border-b border-gray-200">
                            <ul class="flex flex-wrap -mb-px text-sm font-bold text-center" id="upload-tabs">
                                <li class="me-2">
                                    <button class="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 transition-colors" 
                                        data-target="upload-panel" id="tab-upload">
                                        Upload Image
                                    </button>
                                </li>
                                <li class="me-2">
                                    <button class="inline-block p-4 border-b-2 rounded-t-lg text-cam-olive border-cam-olive transition-colors" 
                                        data-target="webcam-panel" id="tab-webcam">
                                        Webcam
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        <div id="tab-content">
                            <!-- Upload Panel -->
                            <div id="upload-panel" class="hidden p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <div class="flex items-center justify-center w-full">
                                    <label class="flex flex-col items-center justify-center w-full h-64 border-2 border-cam-olive/30 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors group">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            <span class="material-symbols-outlined text-4xl text-cam-olive mb-3 group-hover:scale-110 transition-transform">cloud_upload</span>
                                            <p class="mb-2 text-sm text-gray-500"><span class="font-bold">Click to upload</span> or drag and drop</p>
                                            <p class="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input id="file-upload" type="file" class="hidden" accept="image/*" />
                                    </label>
                                </div>
                                <div id="upload-preview" class="hidden mt-4 relative rounded-xl overflow-hidden">
                                    <img id="preview-image" class="w-full h-auto" />
                                    <button id="remove-upload" class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                                        <span class="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Webcam Panel -->
                            <div id="webcam-panel" class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center group">
                                    <video id="webcam-video" class="w-full h-full object-cover hidden" autoplay playsinline></video>
                                    <canvas id="webcam-canvas" class="hidden w-full h-full object-cover"></canvas>
                                    
                                    <div id="camera-placeholder" class="text-gray-400 flex flex-col items-center gap-2">
                                        <span class="material-symbols-outlined text-4xl">videocam_off</span>
                                        <span>Camera Preview</span>
                                    </div>
                                </div>
                                
                                <div class="mt-4 flex justify-center gap-4">
                                    <button id="start-camera" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                                        Start Camera
                                    </button>
                                    <button id="capture-btn" class="hidden group flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-red-500/30 transition-all duration-200 hover:scale-105 active:scale-95">
                                        <span class="material-symbols-outlined text-3xl">camera</span>
                                    </button>
                                    <button id="retake-btn" class="hidden px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors">
                                        Retake
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mt-6">
                            <label class="block mb-2 text-sm font-bold text-gray-900">Your message</label>
                            <textarea id="post-message" rows="3" 
                                class="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-cam-olive focus:border-cam-olive transition-colors" 
                                placeholder="Write your thoughts here..."></textarea>
                        </div>
                        
                        <div class="mt-6 flex justify-end">
                            <button id="publish-btn" class="px-6 py-3 bg-cam-olive text-white font-bold text-sm rounded-xl hover:bg-opacity-90 shadow-lg shadow-cam-olive/20 transition-all focus:ring-4 focus:ring-cam-olive/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                                Publish Post
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="lg:col-span-1 space-y-6">
                    <div class="rounded-3xl border border-cam-gray bg-white p-6 shadow-xl shadow-cam-tan/20 sticky top-24">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-bold text-gray-900">Add Stickers</h3>
                            <span class="text-xs font-bold text-cam-olive bg-cam-cream px-2 py-1 rounded-full border border-cam-olive/20">4 available</span>
                        </div>
                        <p class="text-sm text-gray-500 mb-4">Click a sticker to add it to your photo.</p>
                        
                        <div class="grid grid-cols-2 gap-4" id="stickers-grid">
                            ${this.getStickers().map((sticker, i) => `
                                <button class="sticker-btn aspect-square rounded-xl bg-gray-50 border border-gray-200 hover:border-cam-olive hover:bg-cam-cream transition-all p-2 flex items-center justify-center group relative overflow-hidden" data-sticker="${i}">
                                    <img src="${sticker}" alt="Sticker ${i+1}" class="w-full h-full object-contain group-hover:scale-110 transition-transform">
                                    <div class="absolute inset-0 bg-cam-olive/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    getStickers() {
        return [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBDivAl7-KlDazEG0oSOzi2TWUvUptRtwq1hHthS_bOhT2KRAz4X-njUwOLUxigeNrs6IIvs1Bu-jNGWMGwkvsgbYUDk85aSfByE8tNu2jyzMbAM-1fvbx5iNa2q6qKJBB15VPm5OoqTW6TBq9M3-tuEx75SnCuWb2qMywITBApIuE3qmEhX-A3GNs8-xwRKnDh7yssfxaS6QD_mSJa1_j-4O5wpSdYhtUQ9rwFv4-odznfwlD0lSqjG8tNKh98w1TvidF-_Vm1ICo",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAiEKar4jbdBqVYXVDBrURlLHAudVkpJJLYgWvhiIm140X-_DSTndWNPMMbwKEtiWEpHyJoQq-gyZuX44o1sDSy91hJutl8toweJSMWvaGPQdZBYFnQY49WOBG0YCybzRWcu5XziET--bKI-I88D7r1GresjPnu_hNH7ib_ETDBhBQEnwnJI_XCT_lPBdZSXDUJ0Oc1YmKo-iDJ8gEtmqoV3DXdBrt3oxXHirxQL1h_jAGTvQAcoAJMeB2lYXQIItLTkFBQUSDUnts",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDGu5XPyHnbK9LvOtfpsp7q_DSG3xYPJP4rcrlCfqoL3RhwVwsaIZQB-oGWHnI7BKtqS72Yx51eY85-5Za_r38QLbeH4AlPBcreDy458pK44uo40kL83KsETD_d-SsmeU7E0ntHslWVvAX629OjcD8bjt4CsgvZ5n_-3tTha06GVBtFdk1c3cp1xdj365lnAq4T1Jk-z3sE2mNWU2NZ0Ey8zAZuCU09acQwlIaUe3SBgzjX6dCVy_LnEoJNGeGih-K54kN_bHhk_q0",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCp0hfQK77FTJikssWXZBlMExfpT23e5uMzkLN2NxPEw9TUoxbp_QhKjdxzbjaXLCkPxE2INpn6KBzMieBtPRS2HTrwtiMH4uxSkYIZcdDPn-zumLKIz9-YN8pIzNX7h5Zd_-n3alSdoau8qFOtIT0Fid5tpeX_N67fnvkruh9eBvZZSF-VUvgbGjitMhB5wiwXiChubuSNlGMiRyzco_gcbxdHqGf2gLPQs7xjVURnsG0n2aiehZdFDDu9zuYXpKT87s-0liVWCxg"
        ];
    }

    async afterRender() {
        this.setupTabs();
        this.setupWebcam();
        this.setupFileUpload();
        this.setupStickers();
        this.setupPublish();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('#upload-tabs button');
        const panels = {
            'upload-panel': document.getElementById('upload-panel'),
            'webcam-panel': document.getElementById('webcam-panel')
        };

        // Default to webcam tab active
        const webcamTab = document.getElementById('tab-webcam');
        if (webcamTab) {
            webcamTab.click();
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update tab styles
                tabs.forEach(t => {
                    t.classList.remove('text-cam-olive', 'border-cam-olive');
                    t.classList.add('hover:text-gray-600', 'hover:border-gray-300');
                });
                tab.classList.add('text-cam-olive', 'border-cam-olive');
                tab.classList.remove('hover:text-gray-600', 'hover:border-gray-300');

                // Show target panel
                const targetId = tab.dataset.target;
                Object.values(panels).forEach(p => p.classList.add('hidden'));
                panels[targetId].classList.remove('hidden');
                
                // Stop camera if switching away from webcam
                if (targetId !== 'webcam-panel' && this.stream) {
                    this.stopCamera();
                }
            });
        });
    }

    setupWebcam() {
        const video = document.getElementById('webcam-video');
        const canvas = document.getElementById('webcam-canvas');
        const startBtn = document.getElementById('start-camera');
        const captureBtn = document.getElementById('capture-btn');
        const retakeBtn = document.getElementById('retake-btn');
        const placeholder = document.getElementById('camera-placeholder');

        startBtn.addEventListener('click', async () => {
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = this.stream;
                video.classList.remove('hidden');
                placeholder.classList.add('hidden');
                startBtn.classList.add('hidden');
                captureBtn.classList.remove('hidden');
            } catch (err) {
                console.error("Error accessing webcam:", err);
                alert("Could not access webcam. Please allow camera access.");
            }
        });

        captureBtn.addEventListener('click', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            
            video.classList.add('hidden');
            canvas.classList.remove('hidden');
            captureBtn.classList.add('hidden');
            retakeBtn.classList.remove('hidden');
            
            // Stop stream to save battery/resource
            // this.stopCamera(); 
        });

        retakeBtn.addEventListener('click', () => {
            canvas.classList.add('hidden');
            video.classList.remove('hidden');
            retakeBtn.classList.add('hidden');
            captureBtn.classList.remove('hidden');
        });
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            
            const video = document.getElementById('webcam-video');
            const startBtn = document.getElementById('start-camera');
            const captureBtn = document.getElementById('capture-btn');
            const placeholder = document.getElementById('camera-placeholder');
            
            video.srcObject = null;
            video.classList.add('hidden');
            placeholder.classList.remove('hidden');
            startBtn.classList.remove('hidden');
            captureBtn.classList.add('hidden');
        }
    }

    setupFileUpload() {
        const fileInput = document.getElementById('file-upload');
        const previewDiv = document.getElementById('upload-preview');
        const previewImg = document.getElementById('preview-image');
        const removeBtn = document.getElementById('remove-upload');
        const dropZone = fileInput.parentElement;

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                    previewDiv.classList.remove('hidden');
                    dropZone.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        removeBtn.addEventListener('click', () => {
            fileInput.value = '';
            previewDiv.classList.add('hidden');
            dropZone.classList.remove('hidden');
        });
    }

    setupStickers() {
        const stickers = document.querySelectorAll('.sticker-btn');
        stickers.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle selection visual
                stickers.forEach(s => s.classList.remove('ring-2', 'ring-cam-olive'));
                btn.classList.add('ring-2', 'ring-cam-olive');
                
                // Store selected sticker index
                this.selectedStickerIndex = parseInt(btn.dataset.sticker);
                console.log('Selected sticker:', this.selectedStickerIndex);
            });
        });
        
        // Default to first sticker
        if (stickers.length > 0) {
            stickers[0].click();
        }
    }
    
    async setupPublish() {
        const publishBtn = document.getElementById('publish-btn');
        const messageInput = document.getElementById('post-message');
        
        publishBtn.addEventListener('click', async () => {
            try {
                // Get caption
                const caption = messageInput.value.trim();
                
                // Get image data
                let imageData = null;
                let useWebcam = false;
                
                // Check webcam canvas first
                const webcamCanvas = document.getElementById('webcam-canvas');
                if (webcamCanvas && !webcamCanvas.classList.contains('hidden')) {
                    imageData = webcamCanvas.toDataURL('image/jpeg', 0.9);
                    useWebcam = true;
                } else {
                    // Check upload preview
                    const previewImg = document.getElementById('preview-image');
                    if (previewImg && previewImg.src && !document.getElementById('upload-preview').classList.contains('hidden')) {
                        imageData = previewImg.src;
                        useWebcam = false;
                    }
                }
                
                if (!imageData) {
                    alert('Please capture or upload an image first!');
                    return;
                }
                
                if (this.selectedStickerIndex === undefined) {
                    alert('Please select a sticker!');
                    return;
                }
                
                // Disable button during upload
                publishBtn.disabled = true;
                publishBtn.textContent = 'Publishing...';
                
                // Upload image using ImageService
                const response = await this.imageService.uploadImage(imageData, this.selectedStickerIndex, useWebcam, caption);
                
                if (response.success) {
                    alert('Post published successfully!');
                    window.location.hash = '#/gallery';
                } else {
                    throw new Error(response.message || 'Upload failed');
                }
                
            } catch (error) {
                console.error('Upload error:', error);
                alert('Failed to publish post: ' + (error.message || 'Unknown error'));
                publishBtn.disabled = false;
                publishBtn.textContent = 'Publish Post';
            }
        });
    }
}