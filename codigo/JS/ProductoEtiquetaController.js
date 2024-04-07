let action = null;
let type = "relacion";

async function startOfPage() {
  populateSelects();
  await GetDataAndPopulateTable();
  let urlId = getIdFromURL();
  if (urlId) GetDataOfSpecificId(urlId);

  var btnDeleteProTag = document.querySelectorAll(".btnDeleteProTag");
  console.log(btnDeleteProTag);
  if (btnDeleteProTag != null) {
    for (var i = 0; i < btnDeleteProTag.length; i++) {
      btnDeleteProTag[i].addEventListener("click", function (e) {
        e.preventDefault();
        var productEtiqId = this.getAttribute("product-id");
        eliminarProductoEtiqueta(productEtiqId);
      });
    }
  }
}

function goToList() {
  window.open("productoetiquetaList.html", "_self");
}

function callINFEtiqueta(id) {
  return new Promise((resolve, reject) => {
    var apiURL = `http://localhost:4090/api/Etiqueta/obtenerEtiquetaPorId/${id}`;
    $.ajax({
      method: "GET",
      url: apiURL,
      success: function (response) {
        resolve(response.nombre);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

function callINFProducto(id) {
  return new Promise((resolve, reject) => {
    var apiURL = `http://localhost:4090/api/Producto/obtenerProductoPorId/${id}`;
    $.ajax({
      method: "GET",
      url: apiURL,
      success: function (response) {
        resolve(response.nombre);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

function validarNuevaAssignacion() {
  var etiqueta = document.getElementById('etiquetasSelect').value;
  var producto = document.getElementById('productosSelect').value;
  var cantidad = document.getElementById('amountOfProducts').value;

  if (cantidad.trim() !== '') {
      var nuevaAssignacion = {
        etiquetaId: etiqueta,
        productoId: producto,
        cantidad: cantidad
      };

      var apiUrl = "http://localhost:4090/api/Producto_Etiqueta/crearProductoEtiqueta";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(nuevaAssignacion),
      hasContent: true,
      statusCode: {
        200: function () {
          mostrarMensaje("creada", 200),
            clearFormFields(),
            waitForConfirmation();
        },
        201: function () {
          mostrarMensaje("creada", 201),
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
    var apiUrl = "http://localhost:4090/api/Producto_Etiqueta/obtenerProductoEtiquetas";

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
    })
    .done(async function (data) {
      var tableBody = $("#dynamicTableBody");
      tableBody.empty();

      var requests = [];

      for (var i = 0; i < data.length; i++) {
        var etiquetaRequest = callINFEtiqueta(data[i].etiquetaId);
        var productoRequest = callINFProducto(data[i].productoId);
        
        requests.push(etiquetaRequest);
        requests.push(productoRequest);
      }

      var responses = await Promise.all(requests);

      for (var i = 0; i < responses.length; i += 2) {
        var etiquetaName = responses[i];
        var productoName = responses[i + 1];

        tableBody.append(
          "<tr>" +
          '<th scope="row" class="txtId">' +
          data[i / 2].detalleId +
          "</th>" +
          '<td class="txtEtiquetaId">' +
          etiquetaName +
          "</td>" +
          '<td class="txtProductoId">' +
          productoName +
          "</td>" +
          '<td class="cantidad">' +
          data[i / 2].cantidad +
          "</td>" +
          '<td class="actionDelete"><a class="btnDecoratioStyleMod btnModifyProTag" href="productoetiquetaModify.html?id=' +
          data[i / 2].detalleId +
          '">Actualizar</a> / <a  href="#" class="btnDecoratioStyleDel btnDeleteProTag" product-id="' +
          data[i / 2].detalleId +
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



function eliminarProductoEtiqueta(id) {
  var apiUrl = `http://localhost:4090/api/Producto_Etiqueta/eliminarProductoEtiqueta/${id}`;

  $.ajax({
    headers: {
      Accept: "application/json",
    },
    method: "DELETE",
    url: apiUrl,
    dataType: "json",
    statusCode: {
      200: function () {
        mostrarMensaje("eliminada", 200), startOfPage();
      },
      201: function () {
        mostrarMensaje("eliminada", 201), startOfPage();
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

async function GetDataOfSpecificId(selectedProductId) {
  var apiUrl = `http://localhost:4090/api/Producto_Etiqueta/obtenerProductoEtiquetaPorId/${selectedProductId}`;

  try {
    var response = await $.ajax({
      method: "GET",
      url: apiUrl,
    });

    var etiquetaName = await callINFEtiqueta(response.etiquetaId);
    var productoName = await callINFProducto(response.productoId);

    var etiquetasSelect = $("#etiquetasSelect");
    var productosSelect = $("#productosSelect");

    var etiquetaOption = etiquetasSelect.find(`option[value="${response.etiquetaId}"]`);
    if (etiquetaOption.length) {
      etiquetaOption.text(etiquetaName);
    } else {
      etiquetasSelect.append(`<option value="${response.etiquetaId}">${etiquetaName}</option>`);
    }

    var productoOption = productosSelect.find(`option[value="${response.productoId}"]`);
    if (productoOption.length) {
      productoOption.text(productoName);
    } else {
      productosSelect.append(`<option value="${response.productoId}">${productoName}</option>`);
    }

    etiquetasSelect.val(response.etiquetaId);
    productosSelect.val(response.productoId);

    $("#amountOfProducts").val(response.cantidad);
  } catch (error) {
    console.error(error);
  }
}

function modificarProductoEtiqueta() {
  var id = getIdFromURL();
  var etiqueta = document.getElementById('etiquetasSelect').value;
  var producto = document.getElementById('productosSelect').value;
  var cantidad = document.getElementById('amountOfProducts').value;

  if (cantidad.trim() !== '') {
      var actualizarAssignacion = {
        productoId: id,
        etiquetaId: etiqueta,
        productoId: producto,
        cantidad: cantidad
      };

    var apiUrl = "http://localhost:4090/api/Producto_Etiqueta/actualizarProductoEtiqueta";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(actualizarAssignacion),
      hasContent: true,
      statusCode: {
        200: function () {
          mostrarMensaje("actualizada", 200),
            clearFormFields(),
            waitForConfirmation();
        },
        201: function () {
          mostrarMensaje("actualizada", 201),
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

function GetDataAndPopulateSelectEti() {
    var apiUrl = "http://localhost:4090/api/Etiqueta/obtenerEtiquetas";

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
    })
      .done(function (data) {
        var selectOptions = $("#etiquetasSelect");
        selectOptions.empty();

        selectOptions.append('<option value="null" disabled>--Selecciona--</option>');

        for (var i = 0; i < data.length; i++) {
          selectOptions.append(
            '<option value="'+data[i].etiquetaId+'">'+data[i].nombre+'</option>',
            console.log("test")
          );
        }
        selectOptions.val("null");
      })
      .fail(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error!",
        });
      });
}

function GetDataAndPopulateSelectProd() {
  var apiUrl = "http://localhost:4090/api/Producto/obtenerProductos";

  $.ajax({
    url: apiUrl,
    method: "GET",
    dataType: "json",
  })
    .done(function (data) {
      var pselectOptions = $("#productosSelect");
      pselectOptions.empty();

      pselectOptions.append('<option value="null" disabled>--Selecciona--</option>');

      for (var i = 0; i < data.length; i++) {
        pselectOptions.append(
          '<option value="'+data[i].productoId+'">'+data[i].nombre+'</option>',
          console.log("test")
        );
      }
      pselectOptions.val("null");
    })
    .fail(function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error!",
      });
    });
}

var btnCreateProductoEtiqueta = document.getElementById("btnCreateProductoEtiqueta");
if (btnCreateProductoEtiqueta != null)
btnCreateProductoEtiqueta.addEventListener("click", function (e) {
    e.preventDefault();
    validarNuevaAssignacion();
  });

var btnUpdateProductoEtiqueta = document.getElementById("btnUpdateProductoEtiqueta");
if (btnUpdateProductoEtiqueta != null)
btnUpdateProductoEtiqueta.addEventListener("click", function (e) {
    e.preventDefault();
    modificarProductoEtiqueta();
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

function populateSelects(){
    GetDataAndPopulateSelectEti();
    GetDataAndPopulateSelectProd();
}

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
  const inputFields = document.querySelectorAll("input, textarea, select");
  inputFields.forEach(function (field) {
    field.value = "";
  });
}

function goBack() {
  window.history.back();
}