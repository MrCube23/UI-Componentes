let action = null;
let type = "cupon";

async function startOfPage() {
  await GetDataAndPopulateTable();
  let urlId = getIdFromURL();
  if (urlId) GetDataOfSpecificId(urlId);

  var btnDeleteCupon = document.querySelectorAll(".btnDeleteCupon");
  console.log(btnDeleteCupon);
  if (btnDeleteCupon != null) {
    for (var i = 0; i < btnDeleteCupon.length; i++) {
      btnDeleteCupon[i].addEventListener("click", function (e) {
        e.preventDefault();
        var idURL = this.getAttribute("product-id");
        eliminarCupon(idURL);
      });
    }
  }
}

function goToList() {
  window.open("cuponList.html", "_self");
}

function validarNuevoCupon() {
  var name = document.getElementById('cuponName').value;
  var discount = document.getElementById('cuponDiscount').value;

  if (name.trim() !== '' && discount.trim() !== '') {
      var nuevoCupon = {
          codigo: name,
          descuento: discount
      };

      var apiUrl = "http://localhost:4090/api/Cupon/crearCupon";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(nuevoCupon),
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
    var apiUrl = "http://localhost:4090/api/Cupon/obtenerCupones";

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
              data[i].cuponId +
              "</th>" +
              '<td class="txtName">' +
              data[i].codigo +
              "</td>" +
              '<td class="txtDescription">' +
              data[i].descuento +
              "</td>" +
              '<td class="actionDelete"><a class="btnDecoratioStyleMod btnModifyCupon" href="cuponModify.html?id=' +
              data[i].cuponId +
              '">Actualizar</a> / <a  href="#" class="btnDecoratioStyleDel btnDeleteCupon" product-id="' +
              data[i].cuponId +
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

function eliminarCupon(id) {
  var apiUrl = `http://localhost:4090/api/Cupon/eliminarCupon/${id}`;

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
  var apiUrl = `http://localhost:4090/api/Cupon/obtenerCuponPorId/${selectedProductId}`;

  $.ajax({
    method: "GET",
    url: apiUrl,
    success: function (response) {
      $("#cuponName").val(response.codigo);
      $("#cuponDiscount").val(response.descuento);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function modificarCupon() {
  var id = getIdFromURL();
  var name = document.getElementById('cuponName').value;
  var discount = document.getElementById('cuponDiscount').value;

  if (name.trim() !== '' && discount.trim() !== '') {
      var actualizarCupon = {
          cuponId: id,
          codigo: name,
          descuento: discount
      };

    var apiUrl = "http://localhost:4090/api/Cupon/actualizarCupon";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(actualizarCupon),
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

var btnCreateCupon = document.getElementById("btnCreateCupon");
if (btnCreateCupon != null)
btnCreateCupon.addEventListener("click", function (e) {
    e.preventDefault();
    validarNuevoCupon();
  });

var btnUpdateCupon = document.getElementById("btnUpdateCupon");
if (btnUpdateCupon != null)
  btnUpdateCupon.addEventListener("click", function (e) {
    e.preventDefault();
    modificarCupon();
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
