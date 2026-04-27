const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxe152Qco1XKMsT6QUAdUmS5i12BlAc0IIm27T0e99S8n6v0Q_vLMh2-znPY0c3WRdx/exec';

const COLOR_MAP = {
  'producto-img-verde':    '#EDF5F1',
  'producto-img-cafe':     '#F5EDE6',
  'producto-img-rojo':     '#FBF0EA',
  'producto-img-morado':   '#F0ECF7',
  'producto-img-amarillo': '#FBF5E6',
  'producto-img-azul':     '#EAF1F8',
};
// Para agregar un producto nuevo solo añade un objeto a este arreglo.
// Campos:
//   id        → identificador único (sin espacios)
//   nombre    → nombre en la tarjeta y en el checklist
//   desc      → descripción en la tarjeta
//   precio    → precio unitario en pesos
//   emoji     → emoji principal
//   colorImg  → clase CSS para el fondo de la imagen (producto-img-rojo, verde, cafe, morado, amarillo, azul)
//   badge     → texto del badge (ej. '⭐ Favorito') — omitir o poner null si no lleva
const PRODUCTOS = [
  {
    id: 'mole',    nombre: 'Tamal Pollo en Mole',
    desc:    'Carne de pollo guisada en mole rojo con especias. El clásico que nunca falla.',
    precio:  25,   emoji: '🍖',  colorImg: 'producto-img-rojo',    badge: '⭐ Favorito',
    img: 'imgs/tamal_mole.jpg',
  },
  {
    id: 'rajas',   nombre: 'Tamal de Rajas con Queso',
    desc:    'Rajas de chile asadas con queso blanco derretido. El preferido de los amantes del queso.',
    precio:  25,   emoji: '🫑',  colorImg: 'producto-img-verde',   badge: null,
    img: 'imgs/tamal_rajas.jpg',
  },
  {
    id: 'pollo',   nombre: 'Tamal de Pollo en Salsa Verde',
    desc:    'Pollo deshebrado con salsa de tomate, chile serrano y cilantro. Fresco y lleno de sabor.',
    precio:  25,   emoji: '🍗',  colorImg: 'producto-img-cafe',    badge: null,
    img: 'imgs/tamal_pollo_verde.jpg',
  },
  {
    id: 'champ',   nombre: 'Tamal de Champiñones con Queso',
    desc:    'Champiñones con salsa de tomate, chile serrano y cilantro. Una opción vegetariana llena de sabor.',
    precio:  25,   emoji: '🫘',  colorImg: 'producto-img-morado',  badge: '🌿 Veg',
    img: 'imgs/tamal_champinones.jpg',
  },
  {
    id: 'costvert', nombre: 'Tamal de Costilla con Nopales Salsa Verde',
    desc:    'Costilla de Cerdo en salsa de tomate, chile serrano y cilantro.',
    precio:  25,   emoji: '🫑',  colorImg: 'producto-img-verde',   badge: null,
    img: 'imgs/tamal_costilla_verde.jpg',
  },
  {
    id: 'costroja', nombre: 'Tamal de Costilla Salsa Roja',
    desc:    'Costilla de Cerdo en salsa de jitomate, chile serrano y cilantro.',
    precio:  25,   emoji: '🍖',  colorImg: 'producto-img-rojo',    badge: '⭐ Favorito',
    img: 'imgs/tamal_costilla_roja.jpg',
  },
  {
    id: 'chicharron', nombre: 'Tamal de Chicharron Prensado',
    desc:    'Chicharrón prensado guisado en adobo de chiles secos (ancho, guajillo) con comino y orégano.',
    precio:  25,   emoji: '🍖',  colorImg: 'producto-img-rojo',    badge: '⭐ Favorito',
    img: 'imgs/tamal_chicharron.jpg',
  },
  {
    id: 'zarza',   nombre: 'Tamal Dulce de Zarzamora',
    desc:    'Masa de elote fresco con azúcar y canela, envuelto en hoja de maíz. Un postre tradicional.',
    precio:  25,   emoji: '🍬',  colorImg: 'producto-img-amarillo', badge: '🍫 Dulce',
    img: 'imgs/tamal_zarzamora.jpg',
  },
  {
    id: 'choco',   nombre: 'Tamal Dulce de Chocolate',
    desc:    'Masa dulce de maíz con chocolate. Una variante dulce y esponjosa.',
    precio:  25,   emoji: '🌶️', colorImg: 'producto-img-azul',    badge: null,
    img: 'imgs/tamal_chocolate.jpg',
  },
  {
    id: 'pina',   nombre: 'Tamal Dulce de pina',
    desc:    'Masa dulce de maíz con pina. Una variante dulce y esponjosa.',
    precio:  25,   emoji: '🌶️', colorImg: 'producto-img-azul',    badge: null,
    img: 'imgs/tamal_chocolate.jpg',
  },
];
// ────────────────────────────────────────────────────────────────────────────

// Genera el HTML del checklist a partir del arreglo PRODUCTOS
function renderChecklist() {
  const contenedor = document.getElementById('checklist-container');
  contenedor.innerHTML = PRODUCTOS.map(p => `
    <div class="checklist-item" id="ci-${p.id}">
      <div class="checklist-left">
        <input type="checkbox" id="ch-${p.id}" onchange="toggleItem('${p.id}')">
        <label for="ch-${p.id}" class="checklist-label">
          <span class="checklist-emoji">${p.emoji}</span>
          <span>
            <span class="checklist-nombre">${p.nombre}</span>
            <span class="checklist-precio">$${p.precio} c/u</span>
          </span>
        </label>
      </div>
      <div class="checklist-cantidad" id="qty-${p.id}">
        <button type="button" onclick="cambiarCantidad('${p.id}', -1)">−</button>
        <span id="num-${p.id}">1</span>
        <button type="button" onclick="cambiarCantidad('${p.id}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

// Genera el HTML de las tarjetas de productos (overlay deslizante)
function renderProductos() {
  const contenedor = document.getElementById('productos-grid');
  contenedor.innerHTML = PRODUCTOS.map(p => `
    <div class="producto-card">

      <!-- FRENTE -->
      <div class="producto-card-front">
        <div class="producto-img${p.img ? '' : ' no-img'}" style="background-color:${COLOR_MAP[p.colorImg] || '#F5EDE6'};">
          ${p.img
            ? `<img src="${p.img}" alt="${p.nombre}" onload="this.nextElementSibling.style.display='none'" onerror="this.style.display='none';this.parentElement.classList.add('no-img')">`
            : ''
          }
          <span class="producto-img-emoji">${p.emoji}</span>
          ${p.badge ? `<span class="producto-badge">${p.badge}</span>` : ''}
          <div class="producto-img-label">
            <span class="producto-nombre">${p.nombre}</span>
            <span class="producto-precio">$${p.precio}</span>
          </div>
        </div>
      </div>

      <!-- OVERLAY -->
      <div class="producto-card-back">
        <span class="producto-back-emoji">${p.emoji}</span>
        <span class="producto-back-nombre">${p.nombre}</span>
        <p class="producto-back-desc">${p.desc}</p>
        <span class="producto-back-precio">$${p.precio} c/u</span>
        <button class="btn-pedir" onclick="seleccionarEnFormulario('${p.id}')">Pedir</button>
        <span class="flip-hint">toca para ver más</span>
      </div>

    </div>
  `).join('');
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  renderProductos();
  renderChecklist();
  document.getElementById('contador-sabores').textContent = PRODUCTOS.length;

  // Botón de música flotante
  const audio     = document.getElementById('bg-audio');
  const musicBtn  = document.getElementById('music-btn');
  const musicIcon = musicBtn.querySelector('.music-icon');

  // Arranca silenciado (los navegadores sí permiten autoplay muted)
  audio.volume = 0;
  audio.play().catch(() => {});

  // Fade-in suave al primer gesto del usuario
  let fadeDone = false;
  function fadeIn() {
    if (fadeDone) return;
    fadeDone = true;
    audio.muted = false; // necesario en Safari
    musicBtn.classList.add('playing');
    const step = () => {
      if (audio.volume < 0.35) {
        audio.volume = Math.min(audio.volume + 0.01, 0.35);
        setTimeout(step, 60);
      }
    };
    step();
  }
  document.addEventListener('click',  fadeIn, { once: true });
  document.addEventListener('scroll', fadeIn, { once: true });

  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fadeIn(); // por si el primer clic es justo el botón
    if (audio.paused) {
      audio.play();
      musicBtn.classList.add('playing');
      musicIcon.textContent = '🎵';
    } else {
      audio.pause();
      musicBtn.classList.remove('playing');
      musicIcon.textContent = '🔇';
    }
  });
  document.getElementById('modal-confirm').addEventListener('click', function(e) {
    if (e.target === this) cerrarConfirm();
  });
  document.getElementById('modal-anticipo').addEventListener('click', function(e) {
    if (e.target === this) cerrarAnticipo();
  });
});

// NAV scroll
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

// Checklist: habilitar/deshabilitar cantidad y resaltar fila
function toggleItem(id) {
  const checked = document.getElementById('ch-' + id).checked;
  const qty = document.getElementById('qty-' + id);
  const row = document.getElementById('ci-' + id);
  if (checked) {
    qty.classList.add('habilitado');
    row.classList.add('activo');
  } else {
    qty.classList.remove('habilitado');
    row.classList.remove('activo');
  }
  actualizarTotal();
}

// Cambiar cantidad
function cambiarCantidad(id, delta) {
  const span = document.getElementById('num-' + id);
  let val = parseInt(span.textContent) + delta;
  if (val < 1) val = 1;
  span.textContent = val;
  actualizarTotal();
}

// Calcular y mostrar total + aviso anticipo
function actualizarTotal() {
  let total = 0;
  let totalTamales = 0;
  PRODUCTOS.forEach(p => {
    if (document.getElementById('ch-' + p.id).checked) {
      const cant = parseInt(document.getElementById('num-' + p.id).textContent);
      total += cant * p.precio;
      totalTamales += cant;
    }
  });
  document.getElementById('total-precio').textContent = '$' + total;
  const aviso = document.getElementById('aviso-anticipo');
  if (totalTamales >= 10) {
    aviso.classList.add('visible');
  } else {
    aviso.classList.remove('visible');
  }
}

// Guardar en Google Sheets — nuevo formato con items array
function guardarEnSheets(datos) {
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  }).catch(() => {});
}

// Enviar pedido del formulario principal
function enviarPedido() {
  const nombre   = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const fecha    = document.getElementById('fecha').value;
  const notas    = document.getElementById('pedido-notas').value.trim();

  if (!nombre) { alert('Por favor escribe tu nombre.'); return; }

  const lineas = [];
  const items  = [];

  PRODUCTOS.forEach(p => {
    if (document.getElementById('ch-' + p.id).checked) {
      const cant = parseInt(document.getElementById('num-' + p.id).textContent);
      lineas.push(cant + ' x ' + p.nombre + ' ($' + (cant * p.precio) + ')');
      items.push({ sabor: p.nombre, cantidad: cant });
    }
  });

  if (items.length === 0) { alert('Por favor selecciona al menos un sabor.'); return; }

  const totalStr = document.getElementById('total-precio').textContent;
  const totalNum = parseInt(totalStr.replace('$','')) || 0;
  const totalTamales = items.reduce((s, i) => s + i.cantidad, 0);

  // Armar mensaje de WhatsApp
  let msg = 'Hola Don Memo 🫔, soy *' + nombre + '*';
  if (telefono) msg += ', mi tel es ' + telefono;
  if (fecha)    msg += '. Lo necesito para el *' + fecha + '*';
  msg += '.\n\nMi pedido:\n' + lineas.join('\n');
  msg += '\n\nTotal estimado: *' + totalStr + '*';
  if (notas) msg += '\n\nNotas: ' + notas;

  // ¿Requiere anticipo?
  if (totalTamales >= 10) {
    const anticipo = Math.ceil(totalNum * 0.5);
    msg += '\n\n⚠️ Entiendo que este pedido requiere un *anticipo de $' + anticipo + '* (50%). Quedo pendiente de tu confirmación.';
    const url = 'https://wa.me/521XXXXXXXXXX?text=' + encodeURIComponent(msg);

    // Guardar en Sheets
    guardarEnSheets({ nombre, telefono: telefono || 'No proporcionado', items });

    // Mostrar modal de anticipo
    const anticipo100 = totalNum;
    document.getElementById('anticipo-monto-val').textContent = '$' + anticipo;
    document.getElementById('anticipo-label-50').textContent  = '$' + anticipo + ' ahora · $' + anticipo + ' al recoger';
    document.getElementById('anticipo-label-100').textContent = '$' + anticipo100 + ' · pedido confirmado';

    // Botón 50%
    const msg50 = msg + '\n\n⚠️ Entiendo que este pedido requiere un *anticipo de $' + anticipo + '* (50%). Quedo pendiente de tu confirmación.';
    const url50 = 'https://wa.me/521XXXXXXXXXX?text=' + encodeURIComponent(msg50);
    document.getElementById('anticipo-wa-btn').onclick = function() {
      cerrarAnticipo();
      mostrarConfirm(items, totalStr, url50);
    };

    // Botón 100%
    const msg100 = msg + '\n\n✅ Quiero pagar el *100% por adelantado ($' + anticipo100 + ')*. ¿Me dices cómo hacer la transferencia?';
    const url100 = 'https://wa.me/521XXXXXXXXXX?text=' + encodeURIComponent(msg100);
    document.getElementById('anticipo-wa-btn-100').onclick = function() {
      cerrarAnticipo();
      mostrarConfirm(items, totalStr, url100);
    };

    document.getElementById('modal-anticipo').classList.add('active');
    return;
  }

  // Pedido normal (menos de 10 tamales)
  msg += '\n\n¿Puede ser? 😊';
  const url = 'https://wa.me/521XXXXXXXXXX?text=' + encodeURIComponent(msg);

  guardarEnSheets({ nombre, telefono: telefono || 'No proporcionado', items });
  mostrarConfirm(items, totalStr, url);
}

// Modal de confirmación
function mostrarConfirm(items, total, waUrl) {
  const container = document.getElementById('confirm-items');
  container.innerHTML = items.map(i =>
    '<div class="confirm-item"><span>' + i.sabor + '</span><span>' + i.cantidad + ' pza</span></div>'
  ).join('');
  document.getElementById('confirm-total-val').textContent = total;
  document.getElementById('confirm-wa-btn').onclick = function() {
    cerrarConfirm();
    window.open(waUrl, '_blank');
  };
  document.getElementById('modal-confirm').classList.add('active');
  // Scroll to top of page so modal is visible
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function cerrarConfirm() {
  document.getElementById('modal-confirm').classList.remove('active');
}
function cerrarAnticipo() {
  document.getElementById('modal-anticipo').classList.remove('active');
}

// Botón "Pedir" de las tarjetas: scroll al formulario y pre-selecciona el producto
function seleccionarEnFormulario(id) {
  // Marcar el checkbox y habilitar cantidad
  const checkbox = document.getElementById('ch-' + id);
  if (checkbox && !checkbox.checked) {
    checkbox.checked = true;
    toggleItem(id);
  }
  // Scroll suave al formulario
  document.getElementById('form-pedido').scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Parpadeo visual para que el cliente note la fila seleccionada
  const fila = document.getElementById('ci-' + id);
  if (fila) {
    fila.style.transition = 'background 0.1s';
    fila.style.background = 'rgba(200,90,42,0.18)';
    setTimeout(() => { fila.style.background = ''; }, 900);
  }
}

function mostrarToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg || '✅ ¡Listo!';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
