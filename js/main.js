// ================================
// main.js
// ================================



document.addEventListener('DOMContentLoaded', () => {
  // — 1) Navbar solid/transparent on scroll —
  const navbar = document.querySelector('.custom-navbar');
  if (navbar) {
    const startsTransparent = navbar.classList.contains('navbar-transparent');
    const updateNav = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-solid');
        navbar.classList.remove('navbar-transparent');
      } else if (startsTransparent) {
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('navbar-solid');
      }
    };
    updateNav();
    window.addEventListener('scroll', updateNav);
  }

  // — 2) Formulario → WhatsApp —
    
// — Preselección de curso al hacer click en “Inscribirme” —
document.querySelectorAll('[data-bs-target="#modalInscripcion"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('cursoSelect').value = btn.getAttribute('data-curso');
  });
});

// — Envío del formulario de Cursos → WhatsApp —
const cursoForm = document.getElementById('form-inscripcion-elegante');
if (cursoForm) {
  cursoForm.addEventListener('submit', e => {
    e.preventDefault();

    const nombre   = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const curso    = document.getElementById('cursoSelect').value.trim();
    const horario  = document.getElementById('horario').value.trim() || 'No especificado';
    const extra    = document.getElementById('infoextra').value.trim() || '';

    const mensaje = [
      '💬 Inscripción Colorados Drive',
      `Curso: "${curso}"`,
      `Nombre: "${nombre}"`,
      `Teléfono: "${telefono}"`,
      `Horario: "${horario}"`,
      extra ? `Observaciones: "${extra}"` : ''
    ]
    .filter(line => line)    // elimina líneas vacías
    .join('\n');

    const numero = '593992042546';
    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
      '_blank'
    );

    // Oculta el modal
    const modalEl = document.getElementById('modalInscripcion');
    bootstrap.Modal.getInstance(modalEl)?.hide();
  });
}



  // — 3) Chat widget —
  const widget   = document.getElementById('chat-widget');
  if (widget) {
    const toggleBtn = widget.querySelector('#chat-toggle');
    const closeBtn  = widget.querySelector('#chat-close');
    const log       = widget.querySelector('#chat-log');
    const input     = widget.querySelector('#chat-input');
    const sendBtn   = widget.querySelector('#chat-send');
    const quickBtns = widget.querySelectorAll('#quick-replies button');

    const responses = {
      horarios:       '🕑 Horarios: Lunes a domingo, 6 AM – 6 PM.',
      requisitos:     '📋 Requisitos: cédula, papeleta, tipo de sangre, 2 fotos carnet, certificado estudios.',
      costos:         '💰 Costos: Tipo A $125+IVA, Tipo B $175+IVA.',
      duracion_curso: '⏳ Duración: 2 semanas (+1 de refuerzo opcional).',
      default:        '❓ No entendí, usa los botones rápidos, por favor.'
    };

    const postMessage = (text, cls) => {
      const msg = document.createElement('div');
      msg.className = `chat-message ${cls}`;
      msg.textContent = text;
      log.appendChild(msg);
      log.scrollTop = log.scrollHeight;
    };

    const toggleChat = () => {
      widget.classList.toggle('hidden');
      if (!widget.classList.contains('hidden')) input.focus();
    };

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    quickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        postMessage(btn.textContent, 'user');
        setTimeout(() => postMessage(responses[btn.dataset.key] || responses.default, 'bot'), 300);
      });
    });

    sendBtn.addEventListener('click', () => {
      const txt = input.value.trim();
      if (!txt) return;
      postMessage(txt, 'user');
      input.value = '';
      const key = Object.keys(responses).find(k => txt.toLowerCase().includes(k)) || 'default';
      setTimeout(() => postMessage(responses[key], 'bot'), 300);
    });

    document.addEventListener('click', e => {
      if (!widget.contains(e.target) && !widget.classList.contains('hidden')) {
        widget.classList.add('hidden');
      }
    });
  }

  // — 4) Loader y AOS al cargar la página —
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
  if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true });
});


