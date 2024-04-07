let action = null;
let type = "etiqueta";

async function startOfPage() {
  await GetDataAndPopulateTable();
  let urlId = getIdFromURL();
  if (urlId) GetDataOfSpecificId(urlId);

  var btnDeleteTag = document.querySelectorAll(".btnDeleteTag");
  console.log(btnDeleteTag);
  if (btnDeleteTag != null) {
    for (var i = 0; i < btnDeleteTag.length; i++) {
      btnDeleteTag[i].addEventListener("click", function (e) {
        e.preventDefault();
        var productId = this.getAttribute("product-id");
        eliminarEtiqueta(productId);
      });
    }
  }
}

function goToList() {
  window.open("etiquetaList.html", "_self");
}

function validarNuevaEtiqueta() {
  var name = document.getElementById('etiquetaName').value;
  var description = document.getElementById('etiquetaDesc').value;

  if (name.trim() !== '' && description.trim() !== '') {
      var nuevaEtiqueta = {
        fechaCreacion: new Date().toISOString().slice(0, 10),
        descripcion: description,
        nombre: name
      };

      var apiUrl = "http://localhost:4090/api/Etiqueta/crearEtiqueta";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(nuevaEtiqueta),
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
    var apiUrl = "http://localhost:4090/api/Etiqueta/obtenerEtiquetas";

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
              data[i].etiquetaId +
              "</th>" +
              '<td class="txtName">' +
              data[i].nombre +
              "</td>" +
              '<td class="txtName">' +
              data[i].descripcion +
              "</td>" +
              '<td class="txtDescription">' +
              data[i].fechaCreacion +
              "</td>" +
              '<td class="actionDelete"><a class="btnDecoratioStyleMod btnModifyTag" href="etiquetaModify.html?id=' +
              data[i].etiquetaId +
              '">Actualizar</a> / <a  href="#" class="btnDecoratioStyleDel btnDeleteTag" product-id="' +
              data[i].etiquetaId +
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

function eliminarEtiqueta(id) {
  var apiUrl = `http://localhost:4090/api/Etiqueta/eliminarEtiqueta/${id}`;

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
  var apiUrl = `http://localhost:4090/api/Etiqueta/obtenerEtiquetaPorId/${selectedProductId}`;

  $.ajax({
    method: "GET",
    url: apiUrl,
    success: function (response) {
      $("#etiquetaName").val(response.nombre);
      $("#etiquetaDesc").val(response.descripcion);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function modificarEtiqueta() {
  var id = getIdFromURL();
  var name = document.getElementById('etiquetaName').value;
  var description = document.getElementById('etiquetaDesc').value;

  if (name.trim() !== '' && description.trim() !== '') {
      var actualizarEtiqueta = {
        fechaCreacion: new Date().toISOString().slice(0, 10),
        descripcion: description,
        etiquetaId: id,
        nombre: name
      };

    var apiUrl = "http://localhost:4090/api/Etiqueta/actualizarEtiqueta";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(actualizarEtiqueta),
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

var btnCreateEtiqueta = document.getElementById("btnCreateEtiqueta");
if (btnCreateEtiqueta != null)
  btnCreateEtiqueta.addEventListener("click", function (e) {
    e.preventDefault();
    validarNuevaEtiqueta();
  });

var btnUpdateEtiqueta = document.getElementById("btnUpdateEtiqueta");
if (btnUpdateEtiqueta != null)
btnUpdateEtiqueta.addEventListener("click", function (e) {
    e.preventDefault();
    modificarEtiqueta();
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
