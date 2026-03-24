// ===========================
// Vimeo Mute/Unmute Overlay
// ===========================
const vslIframe = document.getElementById('vsl-iframe');
const unmuteOverlay = document.getElementById('unmute-overlay');

function unmuteVideo() {
    if (typeof Vimeo !== 'undefined') {
        const player = new Vimeo.Player(vslIframe);
        player.setCurrentTime(0).catch(console.error);
        player.setVolume(1).catch(console.error);
        player.setMuted(false).catch(console.error);
        player.play().catch(console.error);
        
        unmuteOverlay.style.opacity = '0';
        setTimeout(() => unmuteOverlay.style.display = 'none', 400);
    }
}

// ===========================
// Countdown Logic
// ===========================
(function initCountdown() {
    // Both phases from original
    const PHASE1_DATE = new Date('2026-03-22T23:59:59-05:00'); 
    const PHASE2_DATE = new Date('2026-03-28T16:00:00-05:00');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const labelEl = document.querySelector('.countdown-label');

    function pad(n) { return String(n).padStart(2, '0'); }

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

    function tick() {
        const p1 = getTimeDiff(PHASE1_DATE);
        const p2 = getTimeDiff(PHASE2_DATE);

        if (p2.expired) {
            labelEl.textContent = "✨ ¡El evento ha comenzado! ✨";
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            return;
        }

        let time, labelTxt;
        if (!p1.expired) {
            time = p1;
            labelTxt = "🔥 PRECIOS DE 'PREVENTA' TERMINAN EN:";
        } else {
            time = p2;
            labelTxt = "🚨 EL LANZAMIENTO COMIENZA EN:";
        }

        labelEl.textContent = labelTxt;
        daysEl.textContent = pad(time.days);
        hoursEl.textContent = pad(time.hours);
        minutesEl.textContent = pad(time.minutes);
        secondsEl.textContent = pad(time.seconds);
    }

    tick();
    setInterval(tick, 1000);
})();

// ===========================
// Modal & Webhook Logic
// ===========================
const modal = document.getElementById('wa-modal');
const form = document.getElementById('vsl-form');
const planInput = document.getElementById('selected_plan');
const submitBtn = document.getElementById('submit-btn');

function openWhatsAppModal(planType) {
    planInput.value = planType;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeWhatsAppModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeWhatsAppModal();
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const originalText = submitBtn.innerHTML;

    // Loading State
    submitBtn.innerHTML = 'PROCESANDO...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
        // Enviar a Webhook
        await fetch('https://clase-easypanel-n8n.zycrzt.easypanel.host/webhook/vsl2803', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                source: window.location.hostname,
                timestamp: new Date().toISOString(),
                page: 'Landing ELOHIM RAYMI VSL'
            }),
        });
    } catch (error) {
        console.error('Webhook error, redireccionando de todos modos...', error);
    }

    // Redirección WhatsApp inmediata después de resolver webhook (o fallar local)
    // Número: 51992220381
    // Mensaje: ¡Hola! Quiero asegurar mi ENTRADA para el evento y mi nombre es:
    const mensajeDecodificado = `¡Hola! Quiero asegurar mi ENTRADA para el evento y mi nombre es: ${data.nombre_completo}`;
    const urlWa = `https://wa.me/51992220381?text=${encodeURIComponent(mensajeDecodificado)}`;
    
    window.location.href = urlWa;
});
