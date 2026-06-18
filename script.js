(function() {
    const galleryImages = [
        { src: "images/game-screenshot1.jpg", caption: "Ферма в лесу" },
        { src: "images/game-screenshot2.jpg", caption: "Подвал с ресурсами" },
        { src: "images/game-screenshot3.jpg", caption: "Торговля с покупателем" }
    ];
    
    const videoFiles = [
        "videos/1.mp4",
        "videos/2.mp4",
        "videos/3.mp4",
        "videos/4.mp4",
        "videos/5.mp4",
        "videos/6.mp4",
        "videos/7.mp4",
        "videos/8.mp4"
    ];
    
    let currentImageIndex = 0;
    let currentVideoIndex = 0;
    
    const imageTrack = document.getElementById('galleryTrack');
    const imageDots = document.getElementById('galleryDots');
    const imageCaption = document.getElementById('galleryCaption');
    
    const videoTrack = document.getElementById('videosTrack');
    const videoDots = document.getElementById('videosDots');
    
    function createGalleryItem(src, isVideo) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        const baseSize = 320;
        item.style.width = baseSize + 'px';
        item.style.height = Math.floor(baseSize * 0.67) + 'px';
        
        if (isVideo) {
            const video = document.createElement('video');
            video.src = src;
            video.muted = true;
            video.playsInline = true;
            video.preload = 'metadata';
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            item.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.onerror = function() {
                this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231f4a6e'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%237fcdff' font-size='12'%3E📷%3C/text%3E%3C/svg%3E";
            };
            item.appendChild(img);
        }
        
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'center';
        
        return item;
    }
    
    function createVideoWithControls(src) {
        const container = document.createElement('div');
        container.className = 'video-item';
        const baseSize = 560;
        container.style.width = baseSize + 'px';
        container.style.height = Math.floor(baseSize * 0.67) + 'px';
        
        const video = document.createElement('video');
        video.src = src;
        video.playsInline = true;
        video.preload = 'metadata';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.style.background = '#000';
        
        const controls = document.createElement('div');
        controls.className = 'video-controls';
        
        const playBtn = document.createElement('button');
        playBtn.textContent = '▶';
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'video-progress';
        const progressFill = document.createElement('div');
        progressFill.className = 'video-progress-fill';
        progressContainer.appendChild(progressFill);
        
        const timeDisplay = document.createElement('span');
        timeDisplay.className = 'video-time';
        timeDisplay.textContent = '0:00 / 0:00';
        
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.textContent = '⛶';
        
        controls.appendChild(playBtn);
        controls.appendChild(progressContainer);
        controls.appendChild(timeDisplay);
        controls.appendChild(fullscreenBtn);
        
        container.appendChild(video);
        container.appendChild(controls);
        
        const videoObj = {
            container,
            video,
            playBtn,
            progressFill,
            timeDisplay,
            fullscreenBtn,
            progressContainer
        };
        
        return videoObj;
    }
    
    function setupVideoControls(videoObj) {
        const { video, playBtn, progressFill, timeDisplay, fullscreenBtn, progressContainer } = videoObj;
        
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                video.play();
                playBtn.textContent = '⏸';
            } else {
                video.pause();
                playBtn.textContent = '▶';
            }
        });
        
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playBtn.textContent = '⏸';
            } else {
                video.pause();
                playBtn.textContent = '▶';
            }
        });
        
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const percent = (video.currentTime / video.duration) * 100;
                progressFill.style.width = percent + '%';
                
                const currentMin = Math.floor(video.currentTime / 60);
                const currentSec = Math.floor(video.currentTime % 60);
                const totalMin = Math.floor(video.duration / 60);
                const totalSec = Math.floor(video.duration % 60);
                timeDisplay.textContent = 
                    `${currentMin}:${currentSec.toString().padStart(2, '0')} / ${totalMin}:${totalSec.toString().padStart(2, '0')}`;
            }
        });
        
        video.addEventListener('ended', () => {
            playBtn.textContent = '▶';
            video.currentTime = 0;
            progressFill.style.width = '0%';
        });
        
        progressContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = progressContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            video.currentTime = percent * video.duration;
        });
        
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        });
    }
    
    function updateGallery(track, items, currentIndex, isVideo) {
        if (!track) return;
        track.innerHTML = '';
        const total = items.length;
        
        for (let i = 0; i < total; i++) {
            let element;
            
            if (isVideo) {
                const videoObj = createVideoWithControls(items[i]);
                const container = videoObj.container;
                if (i === currentIndex) {
                    container.classList.add('center');
                    videoObj.video.load();
                    setTimeout(() => {
                        videoObj.video.play().catch(() => {});
                        videoObj.playBtn.textContent = '⏸';
                    }, 200);
                } else {
                    videoObj.video.pause();
                    videoObj.playBtn.textContent = '▶';
                }
                setupVideoControls(videoObj);
                element = container;
            } else {
                element = createGalleryItem(items[i], false);
                if (i === currentIndex) {
                    element.classList.add('center');
                }
            }
            
            track.appendChild(element);
        }
        
        setTimeout(() => {
            const containerWidth = track.parentElement.offsetWidth;
            const children = track.children;
            let scrollPos = 0;
            for (let i = 0; i < currentIndex; i++) {
                scrollPos += children[i].offsetWidth + 20;
            }
            const centerItemWidth = children[currentIndex]?.offsetWidth || 0;
            scrollPos = scrollPos - (containerWidth / 2) + (centerItemWidth / 2);
            track.style.transform = `translateX(-${Math.max(0, scrollPos)}px)`;
        }, 50);
    }
    
    function updateDots(container, count, currentIndex, callback) {
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot';
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                callback(i);
            });
            container.appendChild(dot);
        }
    }
    
    function setImageIndex(index) {
        currentImageIndex = Math.max(0, Math.min(index, galleryImages.length - 1));
        updateGallery(imageTrack, galleryImages.map(img => img.src), currentImageIndex, false);
        if (imageCaption) {
            imageCaption.textContent = galleryImages[currentImageIndex].caption;
        }
        updateDots(imageDots, galleryImages.length, currentImageIndex, setImageIndex);
    }
    
    function setVideoIndex(index) {
        currentVideoIndex = Math.max(0, Math.min(index, videoFiles.length - 1));
        updateGallery(videoTrack, videoFiles, currentVideoIndex, true);
        updateDots(videoDots, videoFiles.length, currentVideoIndex, setVideoIndex);
    }
    
    document.getElementById('galleryNext')?.addEventListener('click', () => {
        setImageIndex(currentImageIndex + 1);
    });
    document.getElementById('galleryPrev')?.addEventListener('click', () => {
        setImageIndex(currentImageIndex - 1);
    });
    
    document.getElementById('videosNext')?.addEventListener('click', () => {
        setVideoIndex(currentVideoIndex + 1);
    });
    document.getElementById('videosPrev')?.addEventListener('click', () => {
        setVideoIndex(currentVideoIndex - 1);
    });
    
    setImageIndex(0);
    setVideoIndex(0);
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    const sections = document.querySelectorAll('.section');
    const navBtns = document.querySelectorAll('.nav-btn');
    
    let isScrolling = false;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 100);
        
        let current = '';
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        if (current === '') {
            const lastSection = sections[sections.length - 1];
            if (window.pageYOffset + window.innerHeight >= document.documentElement.scrollHeight - 50) {
                current = lastSection.getAttribute('id');
            }
        }
        
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === '#' + current) {
                btn.classList.add('active');
            }
        });
    });
    
    if (typeof VANTA !== 'undefined' && VANTA.FOG) {
        VANTA.FOG({
            el: '#vanta-bg',
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0x00f0ff,
            midtoneColor: 0x1a4a7a,
            lowlightColor: 0x0a1a2e,
            baseColor: 0x0a1a2e,
            blurFactor: 0.30,
            speed: 0.80,
            zoom: 1.00
        });
        document.getElementById('vanta-bg').classList.add('ready');
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.feature-card, .guide-card, .plan-card');
                cards.forEach((card, i) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, i * 150);
                });
            } else {
                const cards = entry.target.querySelectorAll('.feature-card, .guide-card, .plan-card');
                cards.forEach((card) => {
                    card.classList.remove('visible');
                });
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.features-grid, .guides-grid, .plans-grid').forEach(el => {
        observer.observe(el);
    });
})();