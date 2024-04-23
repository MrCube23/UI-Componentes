// OrdenService.js

const apiUrlOrden = "http://localhost:4090/api/Orden/";
const apiUrlDetallesOrden = "http://localhost:4090/api/DetallesOrden/";

// Obtener todas las órdenes
async function obtenerOrdenes() {
  return $.ajax({
    url: apiUrlOrden + "obtenerTodasLasOrdenes",
    method: "GET",
    dataType: "json",
  });
}

// Obtener orden por ID
async function obtenerOrdenPorId(id) {
  return $.ajax({
    method: "GET",
    url: apiUrlOrden + `obtenerOrdenPorId/${id}`,
  });
}

// Crear una nueva orden
async function crearOrden(nuevaOrden) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrlOrden + "crearOrden",
      dataType: "text json",
      data: JSON.stringify(nuevaOrden),
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

// Actualizar orden existente
async function actualizarOrden(actualizadaOrden) {
  return new Promise((resolve, reject) => {
    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrlOrden + "actualizarOrden",
      dataType: "json",
      data: JSON.stringify(actualizadaOrden),
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

// Eliminar orden por ID
async function eliminarOrdenRequest(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      url: apiUrlOrden + `eliminarOrden/${id}`,
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


// Crear un nuevo detalle de orden
async function crearDetallesOrden(nuevoOrdenDetalle) {
	return $.ajax({
	  headers: {
		Accept: "application/json",
	  },
	  method: "POST",
	  url: apiUrlDetallesOrden + "crearDetallesOrden",
	  dataType: "json",
	  data: JSON.stringify(nuevoOrdenDetalle),
	  hasContent: true,
	});
  }

// Obtener detalles de orden por ID de orden
async function obtenerDetallesOrdenPorOrdenId(ordenId) {
  return $.ajax({
    method: "GET",
    url: apiUrlDetallesOrden + `obtenerDetallesOrdenPorOrdenId/${ordenId}`,
  });
}

// Eliminar detalles de orden por ID
async function eliminarDetallesOrden(id) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      url: apiUrlDetallesOrden + `eliminarDetallesOrden/${id}`,
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
