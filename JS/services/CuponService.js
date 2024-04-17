// CuponService.js

const apiUrlCupon = "http://localhost:4090/api/Cupon/";

// Obtener todos los cupones
async function obtenerCupones() {
  return $.ajax({
    url: apiUrlCupon + "obtenerCupones",
    method: "GET",
    dataType: "json",
  });
}

// Obtener cupón por ID
async function obtenerCuponPorId(id) {
  return $.ajax({
    method: "GET",
    url: apiUrlCupon + `obtenerCuponPorId/${id}`,
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
      url: apiUrlCupon + "crearCupon",
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
      url: apiUrlCupon + "actualizarCupon",
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
      url: apiUrlCupon + `eliminarCupon/${id}`,
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

//Validar cupón por código
async function buscarCuponPorCodigo(cuponCodigo) {
  return $.ajax({
    method: "GET",
    url: apiUrlCupon + `buscarCuponPorCodigo/${cuponCodigo}`,
  });
}