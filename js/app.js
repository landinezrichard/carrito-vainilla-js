const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const btnVaciarCarrito = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = [];
const notificacionCarrito = document.getElementById("notificacion-carrito");

function agregarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    leerDatosCurso(cursoSeleccionado);
  }
}

function leerDatosCurso(curso) {
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };
  // revisar si el articulo ya existe en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);

  if (existe) {
    // Actualizar la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; // retorna el objeto con cantidad actualizada
      } else {
        return curso; // retorna el objeto que no esta duplicado
      }
    });
    articulosCarrito = [...cursos];
  } else {
    // Agrega articulos al array de carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }
  // console.log(articulosCarrito);
  htmlCarrito();
}

function limpiarHtml() {
  // Forma lenta de limpiar el HTML
  // contenedorCarrito.innerHTML = "";

  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

function htmlCarrito() {
  // Limpiar el HTML del carrito
  limpiarHtml();

  // recorrer el carrito y generar el HTML
  articulosCarrito.forEach((curso) => {
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <img src="${imagen}" width=100>
            </td>
            <td>${titulo}</td>
            <td style="text-align:right;">${precio}</td>
            <td style="text-align:center;">${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `;
    contenedorCarrito.appendChild(row);
  });

  // Sincronizar el carrito con el localStorage
  sincronizarStorage();

  // Actualizar la cantidad de la notificacion
  añadirNotificacion();
}

function eliminarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");
    // eliminar del array articulosCarrito por data-id
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);
    htmlCarrito();
  }
}

function cantidadCarrito() {
  return articulosCarrito.reduce(
    (cantidad, articulo) => (cantidad += articulo.cantidad),
    0
  );
}

function añadirNotificacion() {
  let cantidad = cantidadCarrito();
  if (cantidad !== 0) {
    notificacionCarrito.dataset.cantidadnotificacion = cantidad;
    notificacionCarrito.classList.add("notificacion-carrito--visible");
  } else {
    notificacionCarrito.classList.remove("notificacion-carrito--visible");
  }
}

function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

function agregarEventos() {
  // Agregar evento a los cursos
  listaCursos.addEventListener("click", agregarCurso);
  // eliminar cursos del carrito
  carrito.addEventListener("click", eliminarCurso);
  // Vaciar carrito
  btnVaciarCarrito.addEventListener("click", () => {
    articulosCarrito = []; // reseteamos el carrito
    limpiarHtml(); // limpiamos el html
    añadirNotificacion(); // actualizamos la notificacion
  });
  // Cargar el carrito desde el localStorage
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    htmlCarrito(); // renderizamos el carrito
  });
}

agregarEventos();
