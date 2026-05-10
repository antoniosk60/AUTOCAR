/* ============================================
   AQUACAR AUTOLAVADOS — Script Principal
   Nordic Asymmetry Edition
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // =======================================
    // 1. LOADING SCREEN
    // =======================================
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBarFill = document.getElementById('loadingBarFill');

    if (loadingScreen && loadingBarFill) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                loadingBarFill.style.width = '100%';
                setTimeout(() => {
                    loadingScreen.classList.add('hide');
                    setTimeout(() => loadingScreen.style.display = 'none', 800);
                }, 600);
            } else {
                loadingBarFill.style.width = progress + '%';
            }
        }, 200);
    }

    // =======================================
    // 2. SCROLL PROGRESS BAR
    // =======================================
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            scrollProgress.style.transform = `scaleX(${progress})`;
        }, { passive: true });
    }

    // =======================================
    // 3. HEADER — Transparent → Glass on Scroll
    // =======================================
    const header = document.getElementById('mainHeader');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // check on load
    }

    // =======================================
    // 4. MOBILE FULLSCREEN MENU
    // =======================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =======================================
    // 5. DARK MODE
    // =======================================
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('aquacar-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('aquacar-theme', isDark ? 'dark' : 'light');
        });
    }

    // =======================================
    // 6. REVIEW CAROUSEL
    // =======================================
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const cards = carousel.querySelectorAll('.review-card');
        const prevBtn = document.querySelector('.carousel-button.prev');
        const nextBtn = document.querySelector('.carousel-button.next');
        const indicators = document.querySelectorAll('.indicator');
        let current = 0;
        let autoPlay;

        const showSlide = (index) => {
            cards.forEach(c => c.classList.remove('active'));
            indicators.forEach(i => i.classList.remove('active'));
            current = (index + cards.length) % cards.length;
            cards[current].classList.add('active');
            if (indicators[current]) indicators[current].classList.add('active');
        };

        const startAutoPlay = () => {
            autoPlay = setInterval(() => showSlide(current + 1), 5000);
        };
        const stopAutoPlay = () => clearInterval(autoPlay);

        if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); showSlide(current - 1); startAutoPlay(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); showSlide(current + 1); startAutoPlay(); });
        indicators.forEach((ind, i) => ind.addEventListener('click', () => { stopAutoPlay(); showSlide(i); startAutoPlay(); }));

        // Swipe
        let touchStartX = 0;
        carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAutoPlay(); }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) showSlide(diff > 0 ? current + 1 : current - 1);
            startAutoPlay();
        });

        // Keyboard
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') { stopAutoPlay(); showSlide(current - 1); startAutoPlay(); }
            if (e.key === 'ArrowRight') { stopAutoPlay(); showSlide(current + 1); startAutoPlay(); }
        });

        startAutoPlay();
    }

    // =======================================
    // 7. GALLERY FILTERS + LIGHTBOX
    // =======================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            galleryItems.forEach(item => {
                if (category === 'todos' || item.dataset.category === category) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeSlide 0.5s ease forwards';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // Lightbox
    const lightbox = document.querySelector('.lightbox-modal');
    const lightboxImg = document.querySelector('.lightbox-content');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let lightboxImages = [];
    let lightboxIndex = 0;

    document.querySelectorAll('.gallery-btn').forEach((btn, i) => {
        const img = btn.closest('.gallery-item')?.querySelector('img');
        if (img) lightboxImages.push(img.src);
        btn.addEventListener('click', () => {
            if (lightbox && lightboxImg) {
                lightboxIndex = i;
                lightboxImg.src = lightboxImages[i];
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => {
        lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex];
    });
    if (lightboxNext) lightboxNext.addEventListener('click', () => {
        lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex];
    });
    if (lightbox) {
        lightbox.addEventListener('click', e => { if (e.target === lightbox) { lightbox.classList.remove('active'); document.body.style.overflow = ''; } });
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
            if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
            if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
        });
    }

    // =======================================
    // 8. QUOTE CALCULATOR
    // =======================================
    const calcForm = document.getElementById('quoteCalculator');
    if (calcForm) {
        const update = () => {
            const vehicleType = document.querySelector('input[name="vehicleType"]:checked');
            const serviceType = document.querySelector('input[name="serviceType"]:checked');
            const extras = document.querySelectorAll('input[name="extras"]:checked');

            if (!vehicleType || !serviceType) return;

            const vehiclePrices = { sedan: 0, suv: 30, camioneta: 50 };
            const servicePrices = { basico: 49.99, detallado: 99.99, premium: 149.99 };
            const extraPrices = { tapetes: 25, motor: 45, pulido: 80, carroceria: 60 };

            let base = servicePrices[serviceType.value] || 0;
            let vehicleSurcharge = vehiclePrices[vehicleType.value] || 0;
            let extrasTotal = 0;
            extras.forEach(e => { extrasTotal += extraPrices[e.value] || 0; });

            const total = base + vehicleSurcharge + extrasTotal;

            const resultEl = document.getElementById('calculatorResult');
            if (resultEl) {
                resultEl.innerHTML = `
                    <div class="result-item"><span>Servicio base</span><span>$${base.toFixed(2)}</span></div>
                    ${vehicleSurcharge > 0 ? `<div class="result-item"><span>Cargo por vehículo</span><span>+$${vehicleSurcharge.toFixed(2)}</span></div>` : ''}
                    ${extrasTotal > 0 ? `<div class="result-item"><span>Extras seleccionados</span><span>+$${extrasTotal.toFixed(2)}</span></div>` : ''}
                    <div class="result-total"><span>Total estimado</span><span>$${total.toFixed(2)}</span></div>
                    <div class="result-time"><i class="fas fa-clock"></i> Tiempo estimado: ${serviceType.value === 'basico' ? '30-45' : serviceType.value === 'detallado' ? '60-90' : '90-120'} minutos</div>
                `;
            }
        };

        calcForm.querySelectorAll('input').forEach(input => input.addEventListener('change', update));
    }

    // =======================================
    // 9. CONTACT FORM → WHATSAPP
    // =======================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(contactForm);
            const name = fd.get('nombre') || '';
            const phone = fd.get('telefono') || '';
            const vehicle = fd.get('vehiculo') || '';
            const service = fd.get('servicio') || '';
            const date = fd.get('fecha') || '';
            const time = fd.get('hora') || '';
            const notes = fd.get('notas') || '';

            let msg = `🚗 *AQUACAR - Nueva Cita*\n\n`;
            msg += `👤 *Nombre:* ${name}\n`;
            if (phone) msg += `📞 *Teléfono:* ${phone}\n`;
            if (vehicle) msg += `🚙 *Vehículo:* ${vehicle}\n`;
            if (service) msg += `🧽 *Servicio:* ${service}\n`;
            if (date) msg += `📅 *Fecha:* ${date}\n`;
            if (time) msg += `🕐 *Hora:* ${time}\n`;
            if (notes) msg += `📝 *Notas:* ${notes}\n`;

            window.open(`https://wa.me/525543180287?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }

    // =======================================
    // 10. SCROLL REVEAL ANIMATIONS
    // =======================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        animateElements.forEach(el => observer.observe(el));
    }

    // =======================================
    // 11. ANIMATED STAT COUNTERS
    // =======================================
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent;
                    const match = text.match(/([\d,]+)/);
                    if (match) {
                        const target = parseInt(match[1].replace(/,/g, ''));
                        const suffix = text.replace(match[1], '').trim();
                        let current = 0;
                        const step = Math.max(1, Math.ceil(target / 60));
                        const interval = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                current = target;
                                clearInterval(interval);
                            }
                            el.textContent = current.toLocaleString() + (suffix ? ' ' + suffix : '');
                        }, 30);
                    }
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    // =======================================
    // 12. SMOOTH SCROLL (anchor links)
    // =======================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
