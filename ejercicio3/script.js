// Semana 3 — JavaScript moderno: fetch, async/await, DOM dinámico

let tareas = [];

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const lista = document.getElementById("task-list");


// TODO 1: crea una función async "cargarTareas" que haga
// fetch('tasks.json'), convierta la respuesta con .json() y
// guarde el resultado en la variable "tareas". Usa try/catch.

// Se utiliza async/await para cargar las tareas desde el archivo JSON.
// El try/catch permite controlar posibles errores durante la carga.
async function cargarTareas() {
  try {
    const respuesta = await fetch("tasks.json");

    // Verificamos que la respuesta del servidor sea correcta.
    if (!respuesta.ok) {
      throw new Error("No se pudo cargar tasks.json");
    }

    // Convertimos la respuesta a formato JSON.
    tareas = await respuesta.json();

  } catch (error) {
    // Si ocurre un error, se muestra en la consola.
    console.error("Error al cargar tareas:", error);

    // Se asigna un arreglo vacío para evitar errores posteriores.
    tareas = [];
  }
}


// TODO 2: crea una función "renderizarTareas" que:
//   - limpie el <ul id="task-list">
//   - por cada tarea en el arreglo "tareas", cree un <li> con
//     el texto, un botón de completar y un botón de borrar
//     (usa createElement, no innerHTML con datos del usuario)
//   - agregue la clase "task-item--done" si tarea.hecha es true

// Esta función se encarga de mostrar las tareas dinámicamente
// dentro de la lista de la página.
function renderizarTareas() {

  // Limpiamos la lista antes de volver a generar las tareas.
  lista.innerHTML = "";

  // Recorremos todas las tareas del arreglo.
  tareas.forEach((tarea) => {

    // Creamos el elemento <li>.
    const li = document.createElement("li");

    // Agregamos la clase principal de la tarea.
    // Si la tarea está hecha, también agregamos task-item--done.
    li.className =
      "task-item" + (tarea.hecha ? " task-item--done" : "");

    // Guardamos el identificador de la tarea en data-id.
    li.dataset.id = tarea.id;

    // Creamos el elemento que mostrará el texto.
    const span = document.createElement("span");

    // textContent permite colocar el texto de manera segura.
    // No se utiliza innerHTML con datos introducidos por el usuario.
    span.textContent = tarea.texto;

    // Creamos el contenedor de los botones.
    const acciones = document.createElement("div");
    acciones.className = "task-actions";

    // Creamos el botón para completar la tarea.
    const btnCompletar = document.createElement("button");
    btnCompletar.className = "btn-complete";
    btnCompletar.textContent = "✓";

    // Creamos el botón para eliminar la tarea.
    const btnBorrar = document.createElement("button");
    btnBorrar.className = "btn-delete";
    btnBorrar.textContent = "✕";

    // Agregamos los botones al contenedor.
    acciones.append(btnCompletar, btnBorrar);

    // Agregamos el texto y las acciones al elemento <li>.
    li.append(span, acciones);

    // Finalmente agregamos el <li> a la lista.
    lista.appendChild(li);
  });
}


// TODO 3: escucha el evento "submit" del formulario (#task-form),
// evita el comportamiento por defecto (preventDefault), toma el
// valor del input (#task-input), agrega un objeto nuevo al arreglo
// "tareas" con un id único (usa Date.now()), limpia el input y
// vuelve a llamar a "renderizarTareas".

// Se escucha el envío del formulario para agregar nuevas tareas.
form.addEventListener("submit", (evento) => {

  // Evitamos que el formulario recargue la página.
  evento.preventDefault();

  // Obtenemos el texto escrito y eliminamos espacios innecesarios.
  const texto = input.value.trim();

  // Si no hay texto, no se agrega ninguna tarea.
  if (!texto) return;

  // Creamos una nueva tarea con un identificador único.
  // Date.now() genera un número basado en la fecha y hora actual.
  const nuevaTarea = {
    id: Date.now(),
    texto: texto,
    hecha: false
  };

  // Agregamos la nueva tarea al arreglo.
  tareas.push(nuevaTarea);

  // Limpiamos el campo de texto.
  input.value = "";

  // Actualizamos la lista para mostrar la nueva tarea.
  renderizarTareas();
});


// TODO 4: usando delegación de eventos en el <ul>, detecta clics en
// los botones de completar/borrar (revisa event.target) y actualiza
// el arreglo "tareas" (cambia "hecha" o usa .filter para eliminar),
// luego vuelve a renderizar.

// Se utiliza delegación de eventos para controlar los botones
// de todas las tareas desde el elemento <ul>.
lista.addEventListener("click", (evento) => {

  // Buscamos el elemento <li> correspondiente al botón presionado.
  const li = evento.target.closest(".task-item");

  // Si el clic no pertenece a una tarea, no hacemos nada.
  if (!li) return;

  // Obtenemos el ID de la tarea desde data-id.
  const id = Number(li.dataset.id);


  // Si se presionó el botón de completar...
  if (evento.target.classList.contains("btn-complete")) {

    // Recorremos las tareas y cambiamos el valor de "hecha".
    tareas = tareas.map((tarea) =>
      tarea.id === id
        ? { ...tarea, hecha: !tarea.hecha }
        : tarea
    );
  }


  // Si se presionó el botón de borrar...
  if (evento.target.classList.contains("btn-delete")) {

    // filter elimina del arreglo la tarea cuyo ID coincide.
    tareas = tareas.filter((tarea) => tarea.id !== id);
  }


  // Actualizamos nuevamente la interfaz.
  renderizarTareas();
});


// TODO 5: al cargar el script, llama a cargarTareas() y después a
// renderizarTareas().

// Función de inicio de la aplicación.
// Primero carga las tareas desde tasks.json y después las muestra.
(async function iniciar() {

  await cargarTareas();

  renderizarTareas();

})();