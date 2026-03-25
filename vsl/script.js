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
    let message = `¡Hola! Quiero asegurar mi ENTRADA para el evento.`;
    
    if (planType === 'GENERAL') {
        message = `Hola, quiero separar mi entrada GENERAL para el lanzamiento oficial de ELOHIM RAYMI con US$10.`;
    } else if (planType === 'VIP') {
        message = `Hola, quiero separar mi entrada VIP para el lanzamiento oficial de ELOHIM RAYMI con US$10.`;
    } else if (planType === 'EXPERIENCE') {
        message = `Hola, quiero separar mi entrada EXPERIENCE para el lanzamiento oficial de ELOHIM RAYMI con US$10.`;
    }

    const urlWa = `https://wa.me/51992220381?text=${encodeURIComponent(message)}`;
    window.location.href = urlWa;
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

// ===========================
// Aforo Progress Bar & Messages
// ===========================
(function initAforo() {
    const EVENT_DATE = new Date('2026-03-28T16:00:00-05:00');
    // Consideramos que la campaña empezó hace unos días, por lo que el progreso inicial es alto (90%)
    // y subirá lentamente hasta el 100% el día del evento.
    // Usaremos un progreso mínimo del 90%
    const TARGET_DATE = EVENT_DATE.getTime();
    
    // Configuración de la barra de progreso
    const progressBar = document.getElementById('aforo-bar');
    if (progressBar) {
        function updateProgressBar() {
            const now = new Date().getTime();
            const timeRemaining = TARGET_DATE - now;
            
            // Asumimos un máximo de 5 días para llenar el último 10% (de 90 a 100)
            const MAX_TIME = 5 * 24 * 60 * 60 * 1000;
            
            let percentage = 100; // Por defecto lleno si ya pasó o está por empezar
            
            if (timeRemaining > 0) {
                // Si el evento aún no empieza
                if (timeRemaining > MAX_TIME) {
                    percentage = 90; // Topado a mínimo 90%
                } else {
                    // Calcula el porcentaje entre 90 y 100 basado en el tiempo restante
                    const progress = 1 - (timeRemaining / MAX_TIME);
                    percentage = 90 + (progress * 10);
                }
            }
            
            progressBar.style.width = `${Math.min(100, Math.max(90, percentage))}%`;
        }

        updateProgressBar();
        setInterval(updateProgressBar, 60000); // Actualiza cada minuto
    }

    // Rotación de Mensajes
    const messages = document.querySelectorAll('.aforo-msg');
    let msgIndex = 0;

    if (messages.length > 0) {
        setInterval(() => {
            messages[msgIndex].classList.remove('active');
            msgIndex = (msgIndex + 1) % messages.length;
            messages[msgIndex].classList.add('active');
        }, 4000); // Cambia el mensaje cada 4 segundos
    }
})();
