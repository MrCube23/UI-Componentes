// ProductoService.js

const apiUrlProducto = "http://localhost:4090/api/Producto/";

// Obtener todos los productos
async function obtenerProductos() {
  return $.ajax({
    url: apiUrlProducto + "obtenerProductos",
    method: "GET",
    dataType: "json",
  });
}

// Obtener producto por ID
async function obtenerProductoPorId(id) {
  return $.ajax({
    method: "GET",
    url: apiUrlProducto + `obtenerProductoPorId/${id}`,
  });
}

// Crear un nuevo producto
async function crearProducto(nuevoProducto) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrlProducto + "crearProducto",
      dataType: "text json",
      data: JSON.stringify(nuevoProducto),
      hasContent: true,
    })
      .done((response, textStatus, xhr) => {
        resolve({ success: true, status: xhr.status, data: response });
      })
      .fail((xhr, textStatus, errorThrown) => {
        if (xhr.responseText.trim() === "") {
          resolve({ success: true, status: xhr.status, data: null });
        } else {
          resolve({ success: false, status: xhr.status, error: errorThrown });
        }
      });
  });
}

// Actualizar producto existente
async function actualizarProducto(actualizadoProducto) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrlProducto + "actualizarProducto",
      dataType: "json",
      data: JSON.stringify(actualizadoProducto),
    })
      .done((response, textStatus, xhr) => {
        resolve({ success: true, status: xhr.status, data: response });
      })
      .fail((xhr, textStatus, errorThrown) => {
        if (xhr.responseText.trim() === "") {
          resolve({ success: true, status: xhr.status, data: null });
        } else {
          resolve({ success: false, status: xhr.status, error: errorThrown });
        }
      });
  });
}

// Eliminar producto por ID
async function eliminarProductoRequest(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      url: apiUrlProducto + `eliminarProducto/${id}`,
    })
      .done((response, textStatus, xhr) => {
        resolve({ success: true, status: xhr.status, data: response });
      })
      .fail((xhr, textStatus, errorThrown) => {
        if (xhr.responseText.trim() === "") {
          resolve({ success: true, status: xhr.status, data: null });
        } else {
          resolve({ success: false, status: xhr.status, error: errorThrown });
        }
      });
  });
}