let action = null;
let type = "cliente";

async function startOfPage() {
  await GetDataAndPopulateTable();
  let urlId = getIdFromURL();
  if (urlId) GetDataOfSpecificId(urlId);

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

function goToList() {
  window.open("clienteList.html", "_self");
}

function validarNuevoCliente() {
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

      var apiUrl = "http://localhost:4090/api/Cliente/crearCliente";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(nuevoCliente),
      hasContent: true,
      statusCode: {
        200: function () {
          mostrarMensaje("creado", 200),
            clearFormFields(),
            waitForConfirmation();
        },
        201: function () {
          mostrarMensaje("creado", 201),
            clearFormFields(),
            waitForConfirmation();
        },
        400: function () {
          mostrarMensaje("crear", 400);
        },
        404: function () {
          mostrarMensaje("crear", 404);
        },
        500: function () {
          mostrarMensaje("crear", 500);
        },
      },
    });
  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

async function GetDataAndPopulateTable() {
  return new Promise((resolve, reject) => {
    var apiUrl = "http://localhost:4090/api/Cliente/obtenerClientes";

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
    })
      .done(function (data) {
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
        resolve();
      })
      .fail(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error!",
        });
        reject();
      });
  });
}

function eliminarCliente(id) {
  var apiUrl = `http://localhost:4090/api/Cliente/eliminarCliente/${id}`;

  $.ajax({
    headers: {
      Accept: "application/json",
    },
    method: "DELETE",
    url: apiUrl,
    dataType: "json",
    statusCode: {
      200: function () {
        mostrarMensaje("eliminado", 200), startOfPage();
      },
      201: function () {
        mostrarMensaje("eliminado", 201), startOfPage();
      },
      400: function () {
        mostrarMensaje("eliminar", 400);
      },
      404: function () {
        mostrarMensaje("eliminar", 404);
      },
      500: function () {
        mostrarMensaje("eliminar", 500);
      },
    },
  });
}

function getIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

function GetDataOfSpecificId(selectedProductId) {
  var apiUrl = `http://localhost:4090/api/Cliente/obtenerClientePorId/${selectedProductId}`;

  $.ajax({
    method: "GET",
    url: apiUrl,
    success: function (response) {
      $("#clienteName").val(response.nombre);
      $("#clientePRA").val(response.primerApellido);
      $("#clienteSGA").val(response.segundoApellido);
      $("#mail").val(response.email);
      $("#direction").val(response.direccion);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function modificarCliente() {
  var id = getIdFromURL();
  var name = document.getElementById('clienteName').value;
  var clientPRA = document.getElementById('clientePRA').value;
  var clientSGA = document.getElementById('clienteSGA').value;
  var mail = document.getElementById('mail').value;
  var direction = document.getElementById('direction').value;

  if (name.trim() !== '' && clientPRA.trim() !== '' && clientSGA.trim() !== '' && mail.trim() !== '' && direction.trim() !== '') {
      var actualizarCliente = {
        segundoApellido: clientSGA,
        primerApellido: clientPRA,
        direccion: direction,
        clienteId: id,
        nombre: name,
        email: mail
      };

    var apiUrl = "http://localhost:4090/api/Cliente/actualizarCliente";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(actualizarCliente),
      hasContent: true,
      statusCode: {
        200: function () {
          mostrarMensaje("actualizado", 200),
            clearFormFields(),
            waitForConfirmation();
        },
        201: function () {
          mostrarMensaje("actualizado", 201),
            clearFormFields(),
            waitForConfirmation();
        },
        400: function () {
          mostrarMensaje("actualizar", 400);
        },
        404: function () {
          mostrarMensaje("actualizar", 404);
        },
        500: function () {
          mostrarMensaje("actualizar", 500);
        },
      },
    });
  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

var btnCreateCliente = document.getElementById("btnCreateCliente");
if (btnCreateCliente != null)
  btnCreateCliente.addEventListener("click", function (e) {
    e.preventDefault();
    validarNuevoCliente();
  });

var btnUpdateCliente = document.getElementById("btnUpdateCliente");
if (btnUpdateCliente != null)
btnUpdateCliente.addEventListener("click", function (e) {
    e.preventDefault();
    modificarCliente();
  });

var btnCancel = document.getElementById("btnCancel");
if (btnCancel != null)
btnCancel.addEventListener("click", function (e) {
    e.preventDefault();
    goBack();
  });

function mostrarMensaje(action, statusCode) {
  var title, icon, text;

  switch (statusCode) {
    case 200:
    case 201:
      title = "Success";
      icon = "success";
      text = "Su " + type + " fue " + action + " exitosamente.";
      break;
    case 400:
    case 404:
    case 500:
      title = "Error";
      icon = "error";
      text = "Existe un problema al " + action + " el " + type + ".";
      break;
    default:
      title = "Error";
      icon = "error";
      text = "Ha ocurrido un error inesperado.";
      break;
  }

  Swal.fire({
    title: title,
    icon: icon,
    text: text,
  });
}

window.onload = function () {
  startOfPage();
};

function waitForConfirmation() {
  document.addEventListener("click", function (event) {
    const target = event.target;
    if (
      target &&
      target.classList.contains("swal2-confirm") &&
      target.classList.contains("swal2-styled")
    ) {
      goToList();
    }
  });
}

function clearFormFields() {
  const inputFields = document.querySelectorAll("input, textarea");
  inputFields.forEach(function (field) {
    field.value = "";
  });
}

function goBack() {
  window.history.back();
}
