// ClienteService.js

const apiUrlCliente = "http://localhost:4090/api/Cliente/";

// Obtener todos los clientes
async function obtenerClientes() {
  return $.ajax({
    url: apiUrlCliente + "obtenerClientes",
    method: "GET",
    dataType: "json",
  });
}

// Obtener cliente por ID
async function obtenerClientePorId(id) {
  return $.ajax({
    method: "GET",
    url: apiUrlCliente + `obtenerClientePorId/${id}`,
  });
}

// Crear un nuevo cliente
async function crearCliente(nuevoCliente) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrlCliente + "crearCliente",
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

// Actualizar cliente existente
async function actualizarCliente(actualizadoCliente) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrlCliente + "actualizarCliente",
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

// Eliminar cliente por ID
async function eliminarClienteRequest(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      url: apiUrlCliente + `eliminarCliente/${id}`,
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