// Semana 4 — Arquitectura App Shell
// JavaScript moderno: fetch, async/await, DOM dinámico
// e indicador de conexión.

// =========================
// ESTADO DE LA APLICACIÓN
// =========================

let tareas = [];

// =========================
// ELEMENTOS DEL DOM
// =========================

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const lista = document.getElementById("task-list");

const loading = document.getElementById("loading");

const connectionStatus =
  document.getElementById("connection-status");

const connectionText =
  document.getElementById("connection-text");

// =========================
// CARGAR TAREAS
// =========================

async function cargarTareas() {

  mostrarCarga();

  try {

    // Código anterior:
    // const respuesta = await fetch("tasks.json");

    // Esperar 3 segundos antes de cargar las tareas
    await new Promise(resolve => setTimeout(resolve, 3000));

    const respuesta = await fetch("tasks.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar tasks.json");
    }

    tareas = await respuesta.json();

  } catch (error) {

    console.error("Error al cargar tareas:", error);

    tareas = [];

  } finally {

    ocultarCarga();

  }
}

// =========================
// MOSTRAR CARGANDO
// =========================

function mostrarCarga() {
  loading.style.display = "flex";
}

// =========================
// OCULTAR CARGANDO
// =========================

function ocultarCarga() {
  loading.style.display = "none";
}

// =========================
// RENDERIZAR TAREAS
// =========================

function renderizarTareas() {

  lista.innerHTML = "";

  tareas.forEach((tarea) => {

    const li = document.createElement("li");

    li.className =
      "task-item" +
      (tarea.hecha ? " task-item--done" : "");

    li.dataset.id = tarea.id;

    // Texto de la tarea
    const span = document.createElement("span");

    span.textContent = tarea.texto;

    // Contenedor de botones
    const acciones = document.createElement("div");

    acciones.className = "task-actions";

    // Botón completar
    const btnCompletar =
      document.createElement("button");

    btnCompletar.className = "btn-complete";

    btnCompletar.textContent = "✓";

    btnCompletar.type = "button";

    btnCompletar.setAttribute(
      "aria-label",
      "Completar tarea"
    );

    // Botón borrar
    const btnBorrar =
      document.createElement("button");

    btnBorrar.className = "btn-delete";

    btnBorrar.textContent = "✕";

    btnBorrar.type = "button";

    btnBorrar.setAttribute(
      "aria-label",
      "Eliminar tarea"
    );

    // Agregar botones
    acciones.append(
      btnCompletar,
      btnBorrar
    );

    // Agregar elementos a la tarea
    li.append(
      span,
      acciones
    );

    // Agregar tarea a la lista
    lista.appendChild(li);
  });
}

// =========================
// AGREGAR NUEVA TAREA
// =========================

form.addEventListener("submit", (evento) => {

  evento.preventDefault();

  const texto = input.value.trim();

  if (!texto) {
    return;
  }

  tareas.push({
    id: Date.now(),
    texto: texto,
    hecha: false
  });

  input.value = "";

  renderizarTareas();
});

// =========================
// COMPLETAR / ELIMINAR
// =========================

lista.addEventListener("click", (evento) => {

  const li =
    evento.target.closest(".task-item");

  if (!li) {
    return;
  }

  const id =
    Number(li.dataset.id);

  // Completar tarea
  if (
    evento.target.classList.contains(
      "btn-complete"
    )
  ) {

    tareas = tareas.map((tarea) => {

      if (tarea.id === id) {

        return {
          ...tarea,
          hecha: !tarea.hecha
        };

      }

      return tarea;
    });
  }

  // Eliminar tarea
  if (
    evento.target.classList.contains(
      "btn-delete"
    )
  ) {

    tareas = tareas.filter(
      (tarea) => tarea.id !== id
    );
  }

  renderizarTareas();
});

// =========================
// INDICADOR DE CONEXIÓN
// =========================

function actualizarConexion() {

  if (navigator.onLine) {

    connectionStatus.classList.remove(
      "offline"
    );

    connectionStatus.classList.add(
      "online"
    );

    connectionText.textContent =
      "En línea";

  } else {

    connectionStatus.classList.remove(
      "online"
    );

    connectionStatus.classList.add(
      "offline"
    );

    connectionText.textContent =
      "Sin conexión";
  }
}

// Detectar cuando se recupera la conexión
window.addEventListener(
  "online",
  actualizarConexion
);

// Detectar cuando se pierde la conexión
window.addEventListener(
  "offline",
  actualizarConexion
);

// =========================
// INICIAR APLICACIÓN
// =========================

(async function iniciar() {

  // Revisar conexión inicial
  actualizarConexion();

  // Cargar datos
  await cargarTareas();

  // Mostrar tareas
  renderizarTareas();

})();