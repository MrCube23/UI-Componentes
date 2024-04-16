// CuponService.js

const apiUrl = "http://localhost:4090/api/Cupon/";

// Obtener todos los cupones
async function obtenerCupones() {
  return $.ajax({
    url: apiUrl + "obtenerCupones",
    method: "GET",
    dataType: "json",
  });
}

// Obtener cupón por ID
async function obtenerCuponPorId(id) {
  return $.ajax({
    method: "GET",
    url: apiUrl + `obtenerCuponPorId/${id}`,
  });
}

// Crear un nuevo cupón
async function crearCupon(nuevoCupon) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrl + "crearCupon",
      dataType: "text json",
      data: JSON.stringify(nuevoCupon),
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

// Actualizar cupón existente
async function actualizarCupon(actualizadoCupon) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrl + "actualizarCupon",
      dataType: "json",
      data: JSON.stringify(actualizadoCupon),
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

// Eliminar cupón por ID
async function eliminarCuponRequest(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      url: apiUrl + `eliminarCupon/${id}`,
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