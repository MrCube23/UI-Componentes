// ClienteController.js

// Variables globales
let action = null;
let type = "cliente";

// Inicio de la página
async function startOfPage() {
  await GetDataAndPopulateTable();
  let urlId = getIdFromURL();
  if (urlId) GetDataOfSpecificId(urlId);
  LoadCreateBtn();
  LoadUpdateBtn();
  LoadDeleteBtn();
  LoadCancelBtn();
}

// CRUD

// Obtener datos y poblar tabla
async function GetDataAndPopulateTable() {
  try {
    const data = await obtenerClientes();
    var tableBody = $("#dynamicTableBody");
    tableBody.empty();

    for (var i = 0; i < data.length; i++) {
      tableBody.append(
        "<tr>" +
          '<th scope="row" class="txtId">' +
          data[i].clienteId +
          "</th>" +
          '<td class="txtName">' +
          data[i].nombre +
          "</td>" +
          '<td class="txtName">' +
          data[i].primerApellido + " " + data[i].segundoApellido +
          "</td>" +
          '<td class="txtDescription">' +
          data[i].email +
          "</td>" +
          '<td class="txtPrice">' +
          data[i].direccion +
          "</td>" +
          '<td class="actionDelete"><a class="btnDecoratioStyleMod btnModifyClient" href="clienteModify.html?id=' +
          data[i].clienteId +
          '">Actualizar</a> / <a  href="#" class="btnDecoratioStyleDel btnDeleteClient" product-id="' +
          data[i].clienteId +
          '">Eliminar</a></td>' +
          "</tr>"
      );
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error!",
    });
  }
}

// Validar nuevo cliente
async function validarNuevoCliente() {
  var name = document.getElementById('clienteName').value;
  var clientPRA = document.getElementById('clientePRA').value;
  var clientSGA = document.getElementById('clienteSGA').value;
  var mail = document.getElementById('mail').value;
  var direction = document.getElementById('direction').value;

  if (name.trim() !== '' && clientPRA.trim() !== '' && clientSGA.trim() !== '' && mail.trim() !== '' && direction.trim() !== '') {
    var nuevoCliente = {
      segundoApellido: clientSGA,
      primerApellido: clientPRA,
      direccion: direction,
      nombre: name,
      email: mail
    };

    const { status } = await crearCliente(nuevoCliente);
    console.log("Éxito al crear cliente. Estado:", status);

      if (status == 200 || status == 201) {
        mostrarMensaje("creado", true, type);
        waitForConfirmationForm();
      } else if (status == 400 || status == 404) {
        mostrarMensaje("creado", false, type);
      } else {
        mostrarMensaje("creado", null, type);
      };   

  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

// Modificar cliente
async function modificarCliente() {
  var id = getIdFromURL();
  var name = document.getElementById("clienteName").value;
  var clientPRA = document.getElementById("clientePRA").value;
  var clientSGA = document.getElementById("clienteSGA").value;
  var mail = document.getElementById("mail").value;
  var direction = document.getElementById("direction").value;

  if (
    name.trim() !== "" &&
    clientPRA.trim() !== "" &&
    clientSGA.trim() !== "" &&
    mail.trim() !== "" &&
    direction.trim() !== ""
  ) {
    var actualizadoCliente = {
      segundoApellido: clientSGA,
      primerApellido: clientPRA,
      direccion: direction,
      clienteId: id,
      nombre: name,
      email: mail,
    };

    const { status } = await actualizarCliente(actualizadoCliente);
    console.log("Éxito de la actualización. Estado:", status);

      if (status == 200 || status == 201) {
        mostrarMensaje("actualizado", true, type);
        waitForConfirmationForm();
      } else if (status == 400 || status == 404) {
        mostrarMensaje("actualizado", false, type);
      } else {
        mostrarMensaje("actualizado", null, type);
      };   

  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

// Eliminar cliente
async function eliminarCliente(id) {
  const { status } = await eliminarClienteRequest(id);
    console.log("Éxito de la eliminación. Estado:", status);

      if (status == 200 || status == 201) {
        mostrarMensaje("eliminado", true, type);
        waitForConfirmationList();
      } else if (status == 400 || status == 404) {
        mostrarMensaje("eliminado", false, type);
      } else {
        mostrarMensaje("eliminado", null, type);
      };   
}

// Funciones auxiliares

// Obtener ID desde URL
function getIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}
// Obtener datos de un ID específico
function GetDataOfSpecificId(selectedProductId) {
  obtenerClientePorId(selectedProductId)
    .then((response) => {
      $("#clienteName").val(response.nombre);
      $("#clientePRA").val(response.primerApellido);
      $("#clienteSGA").val(response.segundoApellido);
      $("#mail").val(response.email);
      $("#direction").val(response.direccion);
    })
    .catch((error) => {
      console.error("Error fetching client by ID:", error);
    });
}

// Cargar botones
function LoadCreateBtn(){
  var btnCreateCliente = document.getElementById("btnCreateCliente");
  if (btnCreateCliente != null)
    btnCreateCliente.addEventListener("click", function (e) {
    e.preventDefault();
    validarNuevoCliente();
  });
}
function LoadUpdateBtn(){
  var btnUpdateCliente = document.getElementById("btnUpdateCliente");
  if (btnUpdateCliente != null)
    btnUpdateCliente.addEventListener("click", function (e) {
      e.preventDefault();
      modificarCliente();
  });
}
function LoadDeleteBtn(){
  var btnDeleteClient = document.querySelectorAll(".btnDeleteClient");
  console.log(btnDeleteClient);
  if (btnDeleteClient != null) {
    for (var i = 0; i < btnDeleteClient.length; i++) {
      btnDeleteClient[i].addEventListener("click", function (e) {
        e.preventDefault();
        var productId = this.getAttribute("product-id");
        eliminarCliente(productId);
      });
    }
  }
}
function LoadCancelBtn(){
  var btnCancel = document.getElementById("btnCancel");
  if (btnCancel != null)
    btnCancel.addEventListener("click", function (e) {
    e.preventDefault();
    window.history.back();
  });
}

// Recargar datos de la página
function DataReload() {
  startOfPage();
}

// Mostrar mensaje según acción y estado
function mostrarMensaje(action, statusCode, type) {
  var title, icon, text;

  switch (statusCode) {
    case true:
      title = "Éxito";
      icon = "success";
      text = "El " + type + " se " + action + " correctamente.";
      break;
    case false:
      title = "Error";
      icon = "error";
      text = "Hubo un problema al " + action + " el " + type + ".";
      break;
    default:
      title = "Error de servidor";
      icon = "error";
      text = "Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.";
      break;
  }

  Swal.fire({
    title: title,
    icon: icon,
    text: text,
    confirmButtonText: "Aceptar",
  });
}

// Esperar confirmación después de una transacción (crear o actualizar)
function waitForConfirmationForm() {
  document.addEventListener("click", function (event) {
    const target = event.target;
    if (
      target &&
      target.classList.contains("swal2-confirm") &&
      target.classList.contains("swal2-styled")
    ) {
      // Redireccionar a clienteList.html en la misma pestaña
      window.location.href = "clienteList.html";
    }
  });
}

// Esperar confirmación después de eliminar
function waitForConfirmationList() {
  document.addEventListener("click", function (event) {
    const target = event.target;
    if (
      target &&
      target.classList.contains("swal2-confirm") &&
      target.classList.contains("swal2-styled")
    ) {
      DataReload();
    }
  });
}

// Inicialización de la página
window.onload = function () {
  startOfPage();
};