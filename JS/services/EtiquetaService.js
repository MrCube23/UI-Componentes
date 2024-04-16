// EtiquetaService.js

const apiUrl = "http://localhost:4090/api/Etiqueta/";

// Obtener todas las etiquetas
async function obtenerEtiquetas() {
  return $.ajax({
    url: apiUrl + "obtenerEtiquetas",
    method: "GET",
    dataType: "json",
  });
}

// Obtener etiqueta por ID
async function obtenerEtiquetaPorId(id) {
  return $.ajax({
    method: "GET",
    url: apiUrl + `obtenerEtiquetaPorId/${id}`,
  });
}

// Crear una nueva etiqueta
async function crearEtiqueta(nuevaEtiqueta) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrl + "crearEtiqueta",
      dataType: "text json",
      data: JSON.stringify(nuevaEtiqueta),
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

// Actualizar etiqueta existente
async function actualizarEtiqueta(actualizadaEtiqueta) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrl + "actualizarEtiqueta",
      dataType: "json",
      data: JSON.stringify(actualizadaEtiqueta),
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

// Eliminar etiqueta por ID
async function eliminarEtiquetaRequest(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      url: apiUrl + `eliminarEtiqueta/${id}`,
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