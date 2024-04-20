// ProductoEtiquetaService.js

const apiUrlProductoEtiqueta = "http://localhost:4090/api/Producto_Etiqueta/";

// Obtener todas las relaciones producto-etiqueta
async function obtenerProductoEtiquetas() {
  return $.ajax({
    url: apiUrlProductoEtiqueta + "obtenerProductoEtiquetas",
    method: "GET",
    dataType: "json",
  });
}

// Obtener una relación producto-etiqueta por ID
async function obtenerProductoEtiquetaPorId(id) {
  return $.ajax({
    method: "GET",
    url: apiUrlProductoEtiqueta + `obtenerProductoEtiquetaPorId/${id}`,
  });
}

// Crear una nueva relación producto-etiqueta
async function crearProductoEtiqueta(nuevaRelacion) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrlProductoEtiqueta + "crearProductoEtiqueta",
      dataType: "text json",
      data: JSON.stringify(nuevaRelacion),
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

// Actualizar una relación producto-etiqueta existente
async function actualizarProductoEtiqueta(actualizadaRelacion) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrlProductoEtiqueta + "actualizarProductoEtiqueta",
      dataType: "json",
      data: JSON.stringify(actualizadaRelacion),
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

// Eliminar una relación producto-etiqueta por ID
async function eliminarProductoEtiquetaRequest(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      url: apiUrlProductoEtiqueta + `eliminarProductoEtiqueta/${id}`,
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