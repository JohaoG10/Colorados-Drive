// ================================
// main.js
// ================================



const FALLBACK_REVIEWS = [
  { name: 'Gabriela C.', text: 'Excelente atención y paciencia. Salí muy segura para conducir en la ciudad.', rating: 5, date: '2024-08-12', photo: 'img/testimonio1.jpg' },
  { name: 'Carlos M.', text: 'Instructores profesionales, vehículos en perfecto estado y horarios flexibles.', rating: 5, date: '2024-06-05', photo: 'img/testimonio2.jpg' },
  { name: 'Yesenia R.', text: 'El simulador me ayudó muchísimo antes de ir a la pista real. 100% recomendado.', rating: 5, date: '2024-09-22', photo: 'img/testimonio3.jpg' },
  { name: 'David L.', text: 'Proceso claro y acompañamiento en cada práctica. Obtuve mi licencia sin estrés.', rating: 4, date: '2024-05-30', photo: 'img/testimonio4.jpg' },
  { name: 'María A.', text: 'Buen seguimiento y refuerzo adicional. Me encantó la metodología.', rating: 5, date: '2024-07-18', photo: 'img/testimonio5.jpg' },
  { name: 'Jonathan S.', text: 'Ambiente cordial y serio a la vez. Aprendí rápido y con confianza.', rating: 4, date: '2024-04-10', photo: 'img/testimonio6.jpg' }
];

let reviewsSwiper;
let reviewsLoaded = false;

const createStars = rating => '★'.repeat(Math.round(rating || 5));

function renderStaticSummary(rating = 5, total = 120) {
  const stars = document.querySelector('.static-stars');
  const count = document.querySelector('.static-count');
  if (stars) stars.textContent = createStars(rating);
  if (count) count.textContent = total;
}

function renderReviews(data) {
  if (reviewsSwiper) {
    reviewsSwiper.destroy(true, true);
    reviewsSwiper = null;
  }

  const wrapper = document.getElementById('reviews-wrapper');
  if (!wrapper) return;
  wrapper.innerHTML = '';

  data.forEach(r => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    const avatar = r.photo
      ? `<img src="${r.photo}" class="review-avatar" alt="${r.name}">`
      : `<div class="review-avatar placeholder">${r.name.charAt(0)}</div>`;

    const reviewDate = r.time ? new Date(r.time * 1000) : new Date(r.date);
    const readableDate = reviewDate.toLocaleDateString('es-EC', { year: 'numeric', month: 'short' });

    slide.innerHTML = `
      <div class="card h-100 review-card">
        <div class="card-body">
          <div class="d-flex align-items-center mb-2">
            ${avatar}
            <div class="ms-2">
              <h5 class="card-title mb-0">${r.name}</h5>
              <small class="text-muted">${readableDate}</small>
            </div>
            <img src="img/google-icon.png" class="google-icon ms-auto" alt="Google">
          </div>
          <div class="text-warning mb-2">${createStars(r.rating)}</div>
          <p class="card-text">“${r.text.length > 140 ? r.text.substr(0, 140) + '…' : r.text}”</p>
        </div>
      </div>`;
    wrapper.appendChild(slide);
  });

  reviewsSwiper = new Swiper('.reviews-swiper', {
    loop: true,
    autoplay: { delay: 4500, disableOnInteraction: false },
    slidesPerView: 1,
    spaceBetween: 24,
    breakpoints: { 576: { slidesPerView: 2 }, 992: { slidesPerView: 3 } },
    pagination: { el: '.reviews-pagination', clickable: true },
    navigation: { prevEl: '.reviews-prev', nextEl: '.reviews-next' }
  });
}

const shuffle = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

function renderFallbackReviews() {
  if (reviewsLoaded) return;
  renderStaticSummary(4.9, 180);
  renderReviews(shuffle([...FALLBACK_REVIEWS]).slice(0, 6));
  reviewsLoaded = true;
}

function loadGoogleReviews() {
  if (!window.google || !window.google.maps?.places) {
    renderFallbackReviews();
    return;
  }

  const PLACE_ID = 'ChIJ_wCUiIpG1ZERiljOTx2n-Ig';
  const service = new google.maps.places.PlacesService(document.createElement('div'));

  service.getDetails({ placeId: PLACE_ID, fields: ['name', 'rating', 'user_ratings_total', 'reviews'] }, (place, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
      renderFallbackReviews();
      return;
    }

    renderStaticSummary(place.rating, place.user_ratings_total);

    const seen = new Set();
    const curated = (place.reviews || [])
      .filter(r => r.rating >= 4)
      .filter(r => {
        if (seen.has(r.author_name)) return false;
        seen.add(r.author_name);
        return true;
      })
      .map(r => ({ name: r.author_name, text: r.text, rating: r.rating, time: r.time, photo: r.profile_photo_url }))
      .slice(0, 9);

    const source = curated.length ? curated : FALLBACK_REVIEWS;
    renderReviews(shuffle([...source]).slice(0, 6));
    reviewsLoaded = true;
  });
}

function initReviews(forceGoogle = false) {
  if (reviewsLoaded && !forceGoogle) return;
  if (forceGoogle || (window.google && window.google.maps && window.google.maps.places)) {
    loadGoogleReviews();
  }
}

function initAboutSwiper() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.about-swiper', {
    loop: true,
    autoplay: { delay: 3800, disableOnInteraction: false },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: { 576: { slidesPerView: 1.3 }, 768: { slidesPerView: 1.6 }, 1200: { slidesPerView: 2 } },
    pagination: { el: '.about-pagination', clickable: true },
    navigation: { prevEl: '.about-prev', nextEl: '.about-next' }
  });
}

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

  // — 2) Formulario → WhatsApp —␊

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
    try {
      const toggleBtn = widget.querySelector('#chat-toggle');
      const closeBtn  = widget.querySelector('#chat-close');
      const log       = widget.querySelector('#chat-log');
      const input     = widget.querySelector('#chat-input');
      const sendBtn   = widget.querySelector('#chat-send');
      const quickBtns = widget.querySelectorAll('#quick-replies button');

      if (!toggleBtn || !closeBtn || !log || !input || !sendBtn) throw new Error('Chat widget markup incomplete');

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
        widget.classList.toggle('collapsed');
        if (!widget.classList.contains('collapsed')) input.focus();
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
        if (!widget.contains(e.target) && !widget.classList.contains('collapsed')) {
          widget.classList.add('collapsed');
        }
      });
    } catch (err) {
      console.error('Chat widget init failed', err);
      widget.classList.add('collapsed');
    }
  }

  // — 4) Loader, animaciones, sliders y reseñas —
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';
  if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true });

  initAboutSwiper();
  initReviews();
  setTimeout(() => initReviews(), 1200);
  setTimeout(renderFallbackReviews, 4000);
});

// Exponer callback para Google Places
window.initReviews = () => initReviews(true);

