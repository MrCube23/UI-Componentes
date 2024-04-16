// ClienteService.js

const apiUrl = "http://localhost:4090/api/Cliente/";

async function obtenerClientes() {
  return $.ajax({
    url: apiUrl + "obtenerClientes",
    method: "GET",
    dataType: "json",
  });
}

async function obtenerClientePorId(id) {
  return $.ajax({
    method: "GET",
    url: apiUrl + `obtenerClientePorId/${id}`,
  });
}

async function crearCliente(nuevoCliente) {
    return new Promise((resolve, reject) => {
      $.ajax({
        headers: {
          Accept: "application/json",
        },
        method: "POST",
        url: apiUrl + "crearCliente",
        dataType: "text json",
        data: JSON.stringify(nuevoCliente),
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

async function actualizarCliente(actualizadoCliente) {
    return new Promise((resolve, reject) => {
        $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrl + "actualizarCliente",
      dataType: "json",
      data: JSON.stringify(actualizadoCliente),
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

async function eliminarClienteRequest(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
      method: "DELETE",
      url: apiUrl + `eliminarClient/${id}`,
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