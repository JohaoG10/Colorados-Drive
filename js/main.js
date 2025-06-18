// ================================
// main.js
// ================================

document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.custom-navbar');

  // Asegúrate de que exista el navbar
  if (!navbar) return;

  // Detectamos si el navbar comienza como transparente
  const navbarIsTransparent = navbar.classList.contains('navbar-transparent');

  function toggleNavbarSolidOnScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-solid');
      navbar.classList.remove('navbar-transparent');
    } else {
      if (navbarIsTransparent) {
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('navbar-solid');
      }
    }
  }

  // Aplicar de inmediato al cargar
  toggleNavbarSolidOnScroll();

  // Aplicar al hacer scroll
  window.addEventListener('scroll', toggleNavbarSolidOnScroll);
});

// Envío del formulario por WhatsApp
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-inscripcion-elegante');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const curso = document.getElementById('cursoSelect').value.trim();
    const horario = document.getElementById('horario').value.trim();
    const infoextra = document.getElementById('infoextra').value.trim();

    const mensaje = `Hola, quiero inscribirme en el curso *${curso}*. Aquí están mis datos:
*Nombre:* ${nombre}
*Teléfono:* ${telefono}
*Horario preferido:* ${horario || 'No especificado'}
*Más información:* ${infoextra || 'Sin comentarios adicionales.'}`;

    const numeroWhatsApp = '0992042546';
    const link = `https://wa.me/593${numeroWhatsApp.slice(1)}?text=${encodeURIComponent(mensaje)}`;
    window.open(link, '_blank');
  });
});


// Chat Widget Initialization
(function() {
  const responses = {
    horarios:      '🕑 Horarios: Lunes a domingo, de 6 AM a 6 PM.',
    requisitos:   '📋 Requisitos: copia de cédula, papeleta de votación, certificado de tipo de sangre (Cruz Roja), 2 fotos tamaño carnet y certificado de estudios.',
    duracion_curso:   '⏳ Duración curso: 2 semanas. Refuerzo extra (3.ª semana) por $19.99. ¡Inscríbete al 0992042546!',
    duracion_papeles: '🗂️ Papeles: procesamiento en ~15 días laborales tras finalizar tu curso.',
    duracion_clases:  '📚 Clases: 1 h académica en prácticas; teoría 100% online en nuestra plataforma.',
    costos:         '💰 Costos:\n• Tipo A (motos): $125+IVA\n• Tipo B (autos): $175+IVA\nPara más info al 0992042546 o haz clic en WhatsApp.',
    default:        '❓ No entendí tu pregunta. Usa los botones rápidos, por favor.'
  };

  const widget   = document.getElementById('chat-widget');
  const body     = widget.querySelector('#chat-body');
  const toggle   = widget.querySelector('#chat-toggle');
  const closeBtn = widget.querySelector('#chat-close');
  const log      = widget.querySelector('#chat-log');
  const input    = widget.querySelector('#chat-input');
  const sendBtn  = widget.querySelector('#chat-send');
  const quick    = widget.querySelectorAll('#quick-replies button');

  toggle.onclick  = () => body.style.display = 'block';
  closeBtn.onclick = () => body.style.display = 'none';

  function postMessage(text, cls) {
    const div = document.createElement('div');
    div.className = 'chat-message ' + cls;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  quick.forEach(btn => {
    btn.onclick = () => {
      const key = btn.dataset.key;
      postMessage(btn.textContent, 'user');
      setTimeout(() => postMessage(responses[key] || responses.default, 'bot'), 300);
    };
  });

  sendBtn.onclick = () => {
    const msg = input.value.trim();
    if (!msg) return;
    postMessage(msg, 'user');
    input.value = '';
    const key = Object.keys(responses).find(k => msg.toLowerCase().includes(k)) || 'default';
    setTimeout(() => postMessage(responses[key], 'bot'), 300);
  };
})();
