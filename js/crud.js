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

async function eliminarAlumno(legajo) {
    try {
        const response = await fetch(
            `http://localhost:3000/alumnos/${legajo}`,
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
        const nombre = document.getElementById(`nombre-${legajo}`).value;
        const apellido = document.getElementById(`apellido-${legajo}`).value;

        const response = await fetch(
            `http://localhost:3000/alumnos/${legajo}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    apellido
                })
            }
        );

        const data = await response.json();

        alert(data.msg);

        obtenerAlumnos();

    } catch (error) {
        console.error(error);
    }
}
