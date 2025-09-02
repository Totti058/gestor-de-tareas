// ==== VARIABLES PRINCIPALES ====

// Botón para cambiar modo oscuro/claro
const botonColor = document.querySelector("header button");

// Formulario y campos
const formulario = document.querySelector("form");
const inputNombre = document.getElementById("nombreTarea");
const inputHora = document.getElementById("horaTarea");
const selectImportancia = document.getElementById("importancia");

// Tabla donde irán las tareas
const tablaTareas = document.getElementById("tareas");

// Contador para ID autoincremental
let idTarea = 1;

// Cargar tareas de localStorage
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
if (tareas.length > 0) {
    idTarea = tareas[tareas.length - 1].id + 1;
    tareas.forEach(tarea => agregarFila(tarea));
}

botonColor.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Función para agregar fila a la tabla
function agregarFila(tarea) {
    const fila = document.createElement("tr");
    if (tarea.completada) fila.classList.add("completada");
    fila.innerHTML = `
        <td>${tarea.id}</td>
        <td>${tarea.nombre}</td>
        <td>${tarea.hora}</td>
        <td>${tarea.importancia}</td>
        <td><button class="btn-eliminar" ${tarea.completada ? "" : "disabled"}>Eliminar</button></td>
        <td><button class="btn-editar">Completada</button></td>
    `;
    tablaTareas.appendChild(fila);
}

formulario.addEventListener("submit", (e) => {
   e.preventDefault();
   const nombre = inputNombre.value;
   const hora = inputHora.value;
   const importancia = selectImportancia.value;

   const tarea = {
       id: idTarea,
       nombre,
       hora,
       importancia,
       completada: false
   };
   tareas.push(tarea);
   localStorage.setItem("tareas", JSON.stringify(tareas));
   agregarFila(tarea);
   idTarea++;
   formulario.reset();
});

tablaTareas.addEventListener("click", (e) => {
    const fila = e.target.closest("tr");
    if (!fila) return;
    const id = parseInt(fila.children[0].textContent);
    const btnEliminar = fila.querySelector(".btn-eliminar");

    if (e.target.classList.contains("btn-editar")) {
        fila.classList.toggle("completada");
        btnEliminar.disabled = !fila.classList.contains("completada");
        // Actualizar estado en localStorage
        const tarea = tareas.find(t => t.id === id);
        tarea.completada = fila.classList.contains("completada");
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }
    if (e.target.classList.contains("btn-eliminar")) {
        if (!btnEliminar.disabled) {
            fila.remove();
            tareas = tareas.filter(t => t.id !== id);
            localStorage.setItem("tareas", JSON.stringify(tareas));
        }
    }
});



