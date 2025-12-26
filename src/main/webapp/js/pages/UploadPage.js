class UploadPage {
    constructor(imageService, stickerService, webcamService) {
        this.imageService = imageService;
        this.stickerService = stickerService;
        this.webcamService = webcamService;
        this.stream = null;
        this.selectedStickerIndex = 0;
        this.placedStickers = []; // Track placed stickers
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
                                    </button>disabled group flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 hover:shadow-red-500/30 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" disabled
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
                            <span class="text-xs font-bold text-cam-olive bg-cam-cream px-2 py-1 rounded-full border border-cam-olive/20" id="sticker-count">0 available</span>
                        </div>
                        <p class="text-sm text-gray-500 mb-4">Double-click a sticker to add it to your photo, then drag to position.</p>
                        
                        <div class="grid grid-cols-2 gap-4" id="stickers-grid">
                            <!-- Stickers loaded dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    async loadStickers() {
        // Load stickers directly from frontend static files
        this.availableStickers = [
            { id: 0, name: 'Cat Ears', url: '/stickers/0_cat_ears.png' },
            { id: 1, name: 'Glasses', url: '/stickers/1_glasses.png' },
            { id: 2, name: 'Mustache', url: '/stickers/2_mustache.png' },
            { id: 3, name: 'Crown', url: '/stickers/3_crown.png' },
            { id: 4, name: 'Heart', url: '/stickers/4_heart.png' }
        ];
        
        const grid = document.getElementById('stickers-grid');
        const count = document.getElementById('sticker-count');
        
        count.textContent = `${this.availableStickers.length} available`;
        grid.innerHTML = this.availableStickers.map((sticker, i) => `
            <div class="sticker-item aspect-square rounded-xl bg-gray-50 border border-gray-200 hover:border-cam-olive hover:bg-cam-cream transition-all p-2 flex items-center justify-center group relative overflow-hidden cursor-pointer" data-sticker="${i}">
                <img src="${sticker.url}" alt="${sticker.name}" class="w-full h-full object-contain group-hover:scale-110 transition-transform" draggable="false">
                <div class="absolute inset-0 bg-cam-olive/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span class="absolute bottom-1 left-1 right-1 text-xs text-center text-gray-700 bg-white/80 rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">${sticker.name}</span>
            </div>
        `).join('');
        
        this.setupStickers();
    }

    async afterRender() {
        this.setupTabs();
        this.setupWebcam();
        this.setupFileUpload();
        await this.loadStickers();
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
                alert("Could not access webcam. Please allow camera access.");
            }
        });

        captureBtn.addEventListener('click', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            
            // Store base image for re-rendering with stickers
            canvas.baseImage = video;
            
            // Clear placed stickers when capturing new image
            this.placedStickers = [];
            this.updateCaptureButtonState();
            
            video.classList.add('hidden');
            canvas.classList.remove('hidden');
            captureBtn.classList.add('hidden');
            retakeBtn.classList.remove('hidden');
            
            // Setup canvas interaction for dragging stickers
            this.setupCanvasInteraction(canvas);
            
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
                    const img = new Image();
                    img.onload = () => {
                        // Create/update canvas for upload
                        let canvas = document.getElementById('upload-canvas');
                        if (!canvas) {
                            canvas = document.createElement('canvas');
                            canvas.id = 'upload-canvas';
                            canvas.className = 'w-full h-auto rounded-xl';
                            previewDiv.insertBefore(canvas, previewDiv.firstChild);
                        }
                        
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        // Store base image
                        canvas.baseImage = img;
                        
                        // Clear placed stickers when uploading new image
                        this.placedStickers = [];
                        this.updateCaptureButtonState();
                        
                        previewImg.classList.add('hidden');
                        canvas.classList.remove('hidden');
                        previewDiv.classList.remove('hidden');
                        dropZone.classList.add('hidden');
                        
                        // Setup canvas interaction
                        this.setupCanvasInteraction(canvas);
                    };
                    img.src = e.target.result;
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
        const stickers = document.querySelectorAll('.sticker-item');
        stickers.forEach(item => {
            item.addEventListener('dblclick', () => {
                const stickerIndex = parseInt(item.dataset.sticker);
                this.addStickerToCanvas(stickerIndex);
            });
        });
    }
    
    addStickerToCanvas(stickerIndex) {
        const canvas = this.getActiveCanvas();
        if (!canvas) {
            alert('Please capture or upload an image first!');
            return;
        }
        
        const sticker = this.availableStickers[stickerIndex];
        if (!sticker) return;
        
        // Add sticker at center with default size (20% of canvas width)
        const stickerWidth = canvas.width * 0.2;
        const stickerHeight = stickerWidth; // Keep square for now, will adjust based on image aspect
        
        const placedSticker = {
            stickerIndex,
            url: sticker.url,
            x: (canvas.width - stickerWidth) / 2,
            y: (canvas.height - stickerHeight) / 2,
            width: stickerWidth,
            height: stickerHeight
        };
        
        this.placedStickers.push(placedSticker);
        this.renderCanvas();
        this.updateCaptureButtonState();
    }
    
    updateCaptureButtonState() {
        const captureBtn = document.getElementById('capture-btn');
        if (!captureBtn) return;
        
        // Capture button should only be enabled if at least one sticker is placed
        if (this.placedStickers.length > 0) {
            captureBtn.disabled = false;
            captureBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            captureBtn.disabled = true;
            captureBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
    
    getActiveCanvas() {
        const webcamCanvas = document.getElementById('webcam-canvas');
        if (webcamCanvas && !webcamCanvas.classList.contains('hidden')) {
            return webcamCanvas;
        }
        
        const uploadCanvas = document.getElementById('upload-canvas');
        if (uploadCanvas && !uploadCanvas.classList.contains('hidden')) {
            return uploadCanvas;
        }
        
        return null;
    }
    
    renderCanvas() {
        const canvas = this.getActiveCanvas();
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Redraw base image
        const baseImage = canvas.baseImage;
        if (baseImage) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        }
        
        // Draw all placed stickers
        this.placedStickers.forEach((sticker, index) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                ctx.drawImage(img, sticker.x, sticker.y, sticker.width, sticker.height);
                
                // Draw border and delete button if being dragged or hovered
                if (this.draggedSticker === index || this.hoveredSticker === index) {
                    // Border
                    ctx.strokeStyle = '#86A873';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(sticker.x, sticker.y, sticker.width, sticker.height);
                    
                    // Delete button (top-right corner)
                    const btnSize = 24;
                    const btnX = sticker.x + sticker.width - btnSize;
                    const btnY = sticker.y;
                    
                    // Red circle background
                    ctx.fillStyle = '#EF4444';
                    ctx.beginPath();
                    ctx.arc(btnX + btnSize/2, btnY + btnSize/2, btnSize/2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // White X
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    const offset = 6;
                    ctx.beginPath();
                    ctx.moveTo(btnX + offset, btnY + offset);
                    ctx.lineTo(btnX + btnSize - offset, btnY + btnSize - offset);
                    ctx.moveTo(btnX + btnSize - offset, btnY + offset);
                    ctx.lineTo(btnX + offset, btnY + btnSize - offset);
                    ctx.stroke();
                    
                    // Store delete button bounds for click detection
                    sticker._deleteBtnX = btnX;
                    sticker._deleteBtnY = btnY;
                    sticker._deleteBtnSize = btnSize;
                }
            };
            img.src = sticker.url;
        });
    }
    
    setupCanvasInteraction(canvas) {
        let isDragging = false;
        let dragStartX, dragStartY;
        let selectedStickerIndex = null;
        this.hoveredSticker = null;
        
        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        };
        
        const isInDeleteButton = (pos, sticker) => {
            if (!sticker._deleteBtnX) return false;
            const btnCenterX = sticker._deleteBtnX + sticker._deleteBtnSize / 2;
            const btnCenterY = sticker._deleteBtnY + sticker._deleteBtnSize / 2;
            const distance = Math.sqrt(
                Math.pow(pos.x - btnCenterX, 2) + Math.pow(pos.y - btnCenterY, 2)
            );
            return distance <= sticker._deleteBtnSize / 2;
        };
        
        canvas.addEventListener('mousedown', (e) => {
            const pos = getMousePos(e);
            
            // Find clicked sticker (check in reverse order to get top-most)
            for (let i = this.placedStickers.length - 1; i >= 0; i--) {
                const sticker = this.placedStickers[i];
                
                // Check if clicking delete button
                if (isInDeleteButton(pos, sticker)) {
                    this.placedStickers.splice(i, 1);
                    this.renderCanvas();
                    this.updateCaptureButtonState();
                    return;
                }
                
                // Check if clicking sticker body
                if (pos.x >= sticker.x && pos.x <= sticker.x + sticker.width &&
                    pos.y >= sticker.y && pos.y <= sticker.y + sticker.height) {
                    isDragging = true;
                    selectedStickerIndex = i;
                    this.draggedSticker = i;
                    dragStartX = pos.x - sticker.x;
                    dragStartY = pos.y - sticker.y;
                    canvas.style.cursor = 'grabbing';
                    break;
                }
            }
        });
        
        canvas.addEventListener('mousemove', (e) => {
            const pos = getMousePos(e);
            
            if (isDragging && selectedStickerIndex !== null) {
                const sticker = this.placedStickers[selectedStickerIndex];
                sticker.x = pos.x - dragStartX;
                sticker.y = pos.y - dragStartY;
                
                // Keep within bounds
                sticker.x = Math.max(0, Math.min(canvas.width - sticker.width, sticker.x));
                sticker.y = Math.max(0, Math.min(canvas.height - sticker.height, sticker.y));
                
                this.renderCanvas();
            } else {
                // Check if hovering over a sticker
                let hovering = false;
                let newHoveredSticker = null;
                
                for (let i = this.placedStickers.length - 1; i >= 0; i--) {
                    const sticker = this.placedStickers[i];
                    if (pos.x >= sticker.x && pos.x <= sticker.x + sticker.width &&
                        pos.y >= sticker.y && pos.y <= sticker.y + sticker.height) {
                        hovering = true;
                        newHoveredSticker = i;
                        break;
                    }
                }
                
                // Update hover state and re-render if changed
                if (newHoveredSticker !== this.hoveredSticker) {
                    this.hoveredSticker = newHoveredSticker;
                    this.renderCanvas();
                }
                
                canvas.style.cursor = hovering ? 'grab' : 'default';
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            selectedStickerIndex = null;
            this.draggedSticker = null;
            canvas.style.cursor = 'default';
            this.renderCanvas();
        });
        
        canvas.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                selectedStickerIndex = null;
                this.draggedSticker = null;
                canvas.style.cursor = 'default';
            }
            this.hoveredSticker = null;
            this.renderCanvas();
        });
    }
    
    async setupPublish() {
        const publishBtn = document.getElementById('publish-btn');
        const messageInput = document.getElementById('post-message');
        
        publishBtn.addEventListener('click', async () => {
            try {
                // Validate at least one sticker
                if (this.placedStickers.length === 0) {
                    alert('Please add at least one sticker to your photo!');
                    return;
                }
                
                // Get caption
                const caption = messageInput.value.trim();
                
                // Get active canvas
                const canvas = this.getActiveCanvas();
                if (!canvas) {
                    alert('Please capture or upload an image first!');
                    return;
                }
                
                // CRITICAL: Send RAW base image, NOT the canvas with stickers merged
                // The server must do the merging (subject requirement: "whole processing on server-side")
                const baseImage = canvas.baseImage;
                if (!baseImage) {
                    alert('No base image available!');
                    return;
                }
                
                // Create temporary canvas to get raw image data
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = baseImage.width || baseImage.videoWidth || canvas.width;
                tempCanvas.height = baseImage.height || baseImage.videoHeight || canvas.height;
                const ctx = tempCanvas.getContext('2d');
                ctx.drawImage(baseImage, 0, 0);
                
                const rawImageData = tempCanvas.toDataURL('image/jpeg', 0.9);
                const useWebcam = canvas.id === 'webcam-canvas';
                
                // Prepare sticker data (convert to relative positions 0-1)
                const stickers = this.placedStickers.map(s => ({
                    stickerIndex: s.stickerIndex,
                    x: s.x / canvas.width,
                    y: s.y / canvas.height,
                    width: s.width / canvas.width,
                    height: s.height / canvas.height
                }));
                
                // Disable button during upload
                publishBtn.disabled = true;
                publishBtn.textContent = 'Publishing...';
                
                // Upload RAW image + sticker metadata (server will merge)
                const response = await this.imageService.uploadImage(rawImageData, stickers, useWebcam, caption);
                
                if (response.success) {
                    alert('Post published successfully!');
                    window.location.hash = '#/gallery';
                } else {
                    throw new Error(response.message || 'Upload failed');
                }
                
            } catch (error) {
                alert('Failed to publish post: ' + (error.message || 'Unknown error'));
                publishBtn.disabled = false;
                publishBtn.textContent = 'Publish Post';
            }
        });
    }
}