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
            phaseLabel = '🔥 Precio especial S/250 termina en';
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

        // Loading state
        submitBtn.innerHTML = 'PROCESANDO...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        try {
            const response = await fetch('https://clase-easypanel-n8n.zycrzt.easypanel.host/webhook-test/evento2803', {
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
                // Success state
                leadForm.innerHTML = `
                    <div style="text-align: center; padding: 2rem 1rem; animation: fadeIn 0.5s ease forwards;">
                        <div style="font-size: 3.5rem; color: var(--gold-premium); margin-bottom: 1.5rem;">✓</div>
                        <h3 style="color: white; margin-bottom: 1rem; font-family: 'Sora', sans-serif;">¡Registro Exitoso!</h3>
                        <p style="color: var(--text-secondary); line-height: 1.6;">Gracias por tu interés en ELOHIM RAYMI. En breve te contactaremos por WhatsApp para coordinar los detalles de tu entrada.</p>
                    </div>
                `;
            } else {
                throw new Error('Server returned ' + response.status);
            }
        } catch (error) {
            console.error('Submission error:', error);

            // Error state
            submitBtn.innerHTML = 'ERROR - REINTENTAR';
            submitBtn.style.background = '#ff4d4d';
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;

            alert('Lo sentimos, hubo un problema al enviar tus datos. Por favor, intenta de nuevo.');
        }
    });
}
