// Añadir al carrito
function añadirAlCarrito(boton, nombre, precio) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.push({ nombre, precio: parseFloat(precio) });
  localStorage.setItem('carrito', JSON.stringify(carrito));

  mostrarNotificacion(`${nombre} fue añadido al carrito.`);

  if (boton) {
    boton.disabled = true;
    setTimeout(() => {
      boton.disabled = false;
      mostrarCarrito(); // refresca lista después de añadir
    }, 1000);
  } else {
    mostrarCarrito();
  }
}

function mostrarNotificacion(mensaje) {
  const notif = document.getElementById('notificacion');
  notif.textContent = mensaje;
  notif.style.display = 'block';
  notif.style.opacity = 1;

  setTimeout(() => {
    notif.style.opacity = 0;
    setTimeout(() => notif.style.display = 'none', 500);
  }, 2000);
}

// Mostrar el carrito
function mostrarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const totalEl = document.getElementById('total');
  if (!lista || !totalEl) return;

  lista.innerHTML = '';
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  if (carrito.length === 0) {
    lista.innerHTML = '<li>Tu carrito está vacío.</li>';
    totalEl.textContent = 'Bs 0.00';
    return;
  }

  let total = 0;
  carrito.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.nombre} - Bs ${item.precio.toFixed(2)} 
      <button onclick="eliminarDelCarrito(${index})">Eliminar</button>`;
    lista.appendChild(li);
    total += item.precio;
  });

  totalEl.textContent = `Bs ${total.toFixed(2)}`;
}

// Eliminar producto
function eliminarDelCarrito(index) {
  const lista = document.getElementById('lista-carrito').children;
  if (!lista[index]) return;
  lista[index].classList.add('eliminado');

  setTimeout(() => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
  }, 300);
}

// Vaciar carrito con modal
function vaciarCarrito() {
  const modal = document.getElementById('modal-vaciar');
  modal.style.display = 'flex';

  const btnSi = document.getElementById('btn-si');
  const btnNo = document.getElementById('btn-no');

  btnSi.onclick = () => {
    localStorage.removeItem('carrito');
    mostrarCarrito();
    modal.style.display = 'none';
  };

  btnNo.onclick = () => {
    modal.style.display = 'none';
  };
}

// Mostrar/ocultar campos método de pago
document.getElementById('metodo-pago').addEventListener('change', function () {
  const metodo = this.value;

  ['datos-tarjeta', 'datos-paypal', 'datos-transferencia', 'datos-qr'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });

  if (metodo === 'tarjeta') {
    document.getElementById('datos-tarjeta').style.display = 'block';
  } else if (metodo === 'paypal') {
    document.getElementById('datos-paypal').style.display = 'block';
  } else if (metodo === 'transferencia') {
    document.getElementById('datos-transferencia').style.display = 'block';
  } else if (metodo === 'qr') {
  document.getElementById('datos-qr').style.display = 'block';

  const codigo = generarCodigoPedido();
  console.log("Código del pedido:", codigo);
  document.getElementById("codigo-pedido").value = codigo;

   localStorage.setItem('codigoPedido', codigo);
}
});
function generarCodigoPedido() {
  const fecha = new Date();
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  const hh = String(fecha.getHours()).padStart(2, '0');
  const min = String(fecha.getMinutes()).padStart(2, '0');
  const seg = String(fecha.getSeconds()).padStart(2, '0');

  const aleatorio = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `PED-${yyyy}${mm}${dd}-${hh}${min}${seg}-${aleatorio}`;
}

// Procesar compra
function procesarCompra(event) {
  event.preventDefault();
  console.log("Procesando compra...");

  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const metodoPago = document.getElementById('metodo-pago').value;

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length === 0) {
    alert('Tu carrito está vacío. Añade productos antes de realizar la compra.');
    return;
  }

  // Puedes agregar validaciones extras aquí según método pago si quieres

  localStorage.setItem('datosCompra', JSON.stringify({ nombre, direccion, telefono, correo, metodoPago }));
  localStorage.setItem('carritoResumen', JSON.stringify(carrito));

  localStorage.removeItem('carrito');

  window.location.href = 'https://wa.me/+59164430334';
}

// Mostrar carrito al cargar
window.onload = mostrarCarrito;
