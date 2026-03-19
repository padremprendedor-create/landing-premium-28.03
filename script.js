// ===========================
// Countdown Banner – Two-Phase Timer
// ===========================
(function initCountdown() {
    const PHASE1_DATE = new Date('2026-03-25T23:59:59-05:00'); // Pre-launch ends
    const PHASE2_DATE = new Date('2026-03-28T10:00:00-05:00'); // Event starts

    const banner = document.getElementById('countdown-banner');
    const label = document.getElementById('countdown-label');
    const cta = document.getElementById('countdown-cta');
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');

    if (!banner) return;

    let prevValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };

    function pad(n) { return String(n).padStart(2, '0'); }

    function flipDigit(el, newVal) {
        const padded = pad(newVal);
        if (el.textContent !== padded) {
            el.textContent = padded;
            el.classList.remove('countdown-flip');
            void el.offsetWidth; // force reflow
            el.classList.add('countdown-flip');
        }
    }

    function getTimeDiff(target) {
        const diff = target - new Date();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            expired: false
        };
    }

    function showExpired() {
        banner.innerHTML = '<div class="countdown-inner"><span class="countdown-expired-msg">✨ ¡El evento ha comenzado! ✨</span></div>';
    }

    function tick() {
        const now = new Date();
        const phase1Diff = getTimeDiff(PHASE1_DATE);
        const phase2Diff = getTimeDiff(PHASE2_DATE);

        // After event
        if (phase2Diff.expired) {
            showExpired();
            return;
        }

        let time, phaseLabel, ctaText;

        if (!phase1Diff.expired) {
            // Phase 1: Pre-launch countdown
            time = phase1Diff;
            phaseLabel = '🔥 Último lote a S/250 — se acaba en';
            ctaText = 'Reserva ahora';
        } else {
            // Phase 2: Launch countdown
            time = phase2Diff;
            phaseLabel = '🚀 El lanzamiento comienza en';
            ctaText = 'Asegura tu entrada';
        }

        label.textContent = phaseLabel;
        cta.textContent = ctaText;

        // Show/hide days column
        const daysUnit = daysEl.parentElement;
        const daysSep = daysUnit.nextElementSibling;
        if (time.days === 0) {
            daysUnit.style.display = 'none';
            if (daysSep) daysSep.style.display = 'none';
        } else {
            daysUnit.style.display = '';
            if (daysSep) daysSep.style.display = '';
        }

        flipDigit(daysEl, time.days);
        flipDigit(hoursEl, time.hours);
        flipDigit(minutesEl, time.minutes);
        flipDigit(secondsEl, time.seconds);
    }

    tick();
    setInterval(tick, 1000);
})();

// ===========================
// Header scroll effect
// ===========================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===========================
// FAQ Accordion
// ===========================
function toggleFaq(button) {
    const item = button.parentElement;
    const content = item.querySelector('.faq-content');
    const span = button.querySelector('span');

    // Close all other items
    document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.faq-content');
            const otherSpan = otherItem.querySelector('button span');
            if (otherContent) otherContent.style.maxHeight = '0';
            if (otherSpan) otherSpan.textContent = '+';
        }
    });

    // Toggle current
    if (!content.style.maxHeight || content.style.maxHeight === '0px') {
        content.style.maxHeight = content.scrollHeight + 'px';
        span.textContent = '−';
    } else {
        content.style.maxHeight = '0';
        span.textContent = '+';
    }
}

// ===========================
// Reveal animations on scroll
// ===========================
const revealElements = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => revealObserver.observe(el));

// ===========================
// Smooth scroll for anchors
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const offset = 180;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = target.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Vimeo VSL Player Handle
// ===========================
const vslIframe = document.getElementById('vsl-iframe');
const unmuteOverlay = document.getElementById('unmute-overlay');
const unmuteBtn = document.getElementById('unmute-vsl-btn');

if (vslIframe && unmuteBtn && typeof Vimeo !== 'undefined') {
    const player = new Vimeo.Player(vslIframe);
    
    unmuteBtn.addEventListener('click', () => {
        player.setCurrentTime(0).catch(console.error);
        player.setVolume(1).catch(console.error);
        player.setMuted(false).catch(console.error);
        player.play().catch(console.error);
        
        // Hide the overlay
        unmuteOverlay.style.opacity = '0';
        unmuteOverlay.style.pointerEvents = 'none';
        setTimeout(() => {
            unmuteOverlay.style.display = 'none';
        }, 500);
    });
}

// ===========================
// Loading & Pop-up Helpers
// ===========================
const loadingOverlay = document.getElementById('loading-overlay');

function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

function showSuccessPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        hideLoading();
        // Small delay for smooth transition from loading to popup
        setTimeout(() => {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 200);
    }
}

function closeSuccessPopup(popupId, e) {
    if (e) e.preventDefault();
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close popups on overlay click
document.querySelectorAll('.popup-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// ===========================
// Lead Form Handling
// ===========================
const leadForm = document.getElementById('lead-form');
if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Collect data
        const formData = new FormData(leadForm);
        const data = Object.fromEntries(formData.entries());

        // Show loading overlay
        submitBtn.innerHTML = 'PROCESANDO...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        showLoading();

        try {
            const response = await fetch('https://clase-easypanel-n8n.zycrzt.easypanel.host/webhook/evento2803', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    source: window.location.hostname,
                    timestamp: new Date().toISOString(),
                    page: 'Landing ELOHIM RAYMI v2'
                }),
            });

            if (response.ok) {
                // Show loading for 2.5 seconds minimum for premium feel
                setTimeout(() => {
                    showSuccessPopup('popup-reserva');
                    // Reset form for future use
                    leadForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 2500);
            } else {
                throw new Error('Server returned ' + response.status);
            }
        } catch (error) {
            console.error('Submission error:', error);
            hideLoading();
            document.body.style.overflow = '';

            submitBtn.innerHTML = 'ERROR - REINTENTAR';
            submitBtn.style.background = '#ff4d4d';
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

// ===========================
// Modal Privado Handling
// ===========================
const modalPrivado = document.getElementById('modal-privado');
const closeBtn = document.getElementById('close-modal-privado');

function openPrivateModal(e) {
    if (e) e.preventDefault();
    if (modalPrivado) {
        modalPrivado.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling
    }
}

function closePrivateModal() {
    if (modalPrivado) {
        modalPrivado.classList.remove('active');
        document.body.style.overflow = ''; 
    }
}

// Close when clicking outside
if (modalPrivado) {
    modalPrivado.addEventListener('click', (e) => {
        if (e.target === modalPrivado) {
            closePrivateModal();
        }
    });
}

// Handle Privado Form Submit
const loadFormPrivado = document.getElementById('lead-form-privado');
if (loadFormPrivado) {
    loadFormPrivado.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = loadFormPrivado.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        const formData = new FormData(loadFormPrivado);
        const data = Object.fromEntries(formData.entries());

        submitBtn.innerHTML = 'PROCESANDO...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Close privado modal and show loading
        closePrivateModal();
        showLoading();

        try {
            const response = await fetch('https://clase-easypanel-n8n.zycrzt.easypanel.host/webhook/evento2803', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    source: window.location.hostname,
                    timestamp: new Date().toISOString(),
                    page: 'Landing ELOHIM RAYMI v2 - Presentación Privada'
                }),
            });

            if (response.ok) {
                // Show loading for 2.5 seconds minimum for premium feel
                setTimeout(() => {
                    showSuccessPopup('popup-privado');
                    // Reset form for future use
                    loadFormPrivado.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 2500);
            } else {
                throw new Error('Server returned ' + response.status);
            }
        } catch (error) {
            console.error('Submission error:', error);
            hideLoading();
            document.body.style.overflow = '';

            // Reopen the modal to show error
            openPrivateModal();
            submitBtn.innerHTML = 'ERROR - REINTENTAR';
            submitBtn.style.background = '#ff4d4d';
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

