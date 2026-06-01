//Obtener todos los alumnos
async function obtenerAlumnos() {
    try {
        const response = await fetch(
            'http://localhost:3000/alumnos'
        );

        const alumnos = await response.json();

        const tabla = document.getElementById('tablaAlumnos');

        tabla.innerHTML = '';

        alumnos.forEach(alumno => {
            tabla.innerHTML += `
                <tr>
                    <td>${alumno.legajo ?? '-'}</td>
                    <td>${alumno.nombre ?? '-'}</td>
                    <td>${alumno.apellido ?? '-'}</td>
                    <td>
                        <button onclick="mostrarEditarAlumno(${alumno.legajo}, this)" class="btn btn-primary">Editar</button>
                        <button onclick="eliminarAlumno(${alumno.legajo})" class="btn btn-danger">
                        Eliminar
                    </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

//Buscar alumno por legajo
async function obtenerAlumnosLegajo() {
    try {
        const legajo =
            document.getElementById('legajoBusqueda').value;

        const response = await fetch(
            `http://localhost:3000/alumnos/${legajo}`
        );

        const alumno = await response.json();

        const tabla = document.getElementById('tablaAlumnos');

        tabla.innerHTML = `
            <tr>
                <td>${alumno.legajo ?? '-'}</td>
                <td>${alumno.nombre ?? '-'}</td>
                <td>${alumno.apellido ?? '-'}</td>
                <td>
                    <button onclick="mostrarEditarAlumno(${alumno.legajo}, this)" class="btn btn-primary">
                        Editar
                    </button>

                    <button onclick="eliminarAlumno(${alumno.legajo})" class="btn btn-danger">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;

    } catch (error) {
        console.error(error);
    }
}

//Eliminar alumno
async function eliminarAlumno(legajo) {
    try {
        const response = await fetch(
            `http://localhost:3000/alumnos/${String(legajo)}`,  // forzar string
            {
                method: 'DELETE'
            }
        );

        const data = await response.json();
        alert(data.msg);
        obtenerAlumnos();

    } catch (error) {
        console.error(error);
    }
}

//Actualizar alumno
function mostrarEditarAlumno(legajo, boton) {

    const fila = boton.closest('tr');

    const nombre = fila.children[1].textContent;
    const apellido = fila.children[2].textContent;

    fila.children[1].innerHTML = `
        <input type="text" id="nombre-${legajo}" value="${nombre}">
    `;

    fila.children[2].innerHTML = `
        <input type="text" id="apellido-${legajo}" value="${apellido}">
    `;

    fila.children[3].innerHTML = `
        <button onclick="actualizarAlumno(${legajo})" class="btn btn-success">
            Guardar
        </button>

        <button class="btn btn-secondary" onclick="obtenerAlumnos()">
            Cancelar
        </button>
    `;
}

async function actualizarAlumno(legajo) {
    try {
        const nombre = document.getElementById(`nombre-${legajo}`).value.trim();
        const apellido = document.getElementById(`apellido-${legajo}`).value.trim();

        if (!nombre || !apellido) {
            alert('El nombre y apellido no pueden estar vacíos');
            return;
        }

        const response = await fetch(
            `http://localhost:3000/alumnos/${legajo}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, apellido })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(`Error: ${data.msg}`);
            return;
        }

        alert(data.msg);
        obtenerAlumnos();

    } catch (error) {
        console.error('Error al actualizar alumno:', error);
        alert('No se pudo conectar con el servidor');
    }
}

//Agregar alumno
function abrirModalAlumno() {
    document.getElementById('modalAlumno').style.display = 'flex';

    const hoy = new Date().toISOString().split('T')[0];

    document.getElementById('fechaAltaNuevo').value = hoy;
}

function cerrarModalAlumno() {
    document.getElementById('modalAlumno').style.display = 'none';
    document.querySelectorAll('#modalAlumno input').forEach(input => input.value = '');
}

async function agregarAlumno() {
    try {
        const legajo = +document.getElementById('legajoNuevo').value;
        const nombre = document.getElementById('nombreNuevo').value;
        const apellido = document.getElementById('apellidoNuevo').value;
        const email = document.getElementById('emailNuevo').value;
        const fechaAlta = document.getElementById('fechaAltaNuevo').value;
        const modificacion = document.getElementById('fechaAltaNuevo').value;
        const isActive = true;

        const response = await fetch(
            `http://localhost:3000/alumnos`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    legajo,
                    nombre,
                    apellido,
                    email,
                    fechaAlta,
                    modificacion,
                    isActive
                })
            }
        );

        const data = await response.json();

        alert(data.msg);

        cerrarModalAlumno();

        obtenerAlumnos();

    } catch (error) {
        console.error(error);
    }
}