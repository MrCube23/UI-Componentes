let action = null;
let type = "producto";

async function startOfPage() {
  await GetDataAndPopulateTable();
  let urlId = getProductIdFromURL();
  if (urlId) GetDataOfSpecificId(urlId);

  var btnDeleteProducts = document.querySelectorAll(".btnDeleteProduct");
  console.log(btnDeleteProducts);
  if (btnDeleteProducts != null) {
    for (var i = 0; i < btnDeleteProducts.length; i++) {
      btnDeleteProducts[i].addEventListener("click", function (e) {
        e.preventDefault();
        var productId = this.getAttribute("product-id");
        eliminarProducto(productId);
      });
    }
  }
}

function goToList() {
  window.open("productoList.html", "_self");
}

function validarNuevoProducto() {
  var name = document.getElementById("productName").value;
  var description = document.getElementById("productDescription").value;
  var price = document.getElementById("productPrice").value;

  if (name.trim() !== "" && description.trim() !== "" && price.trim() !== "") {
    var nuevoProducto = {
      nombre: name,
      descripcion: description,
      precio: price,
    };

    var apiUrl = "http://localhost:4090/api/Producto/crearProducto";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(nuevoProducto),
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
    var apiUrl = "http://localhost:4090/api/Producto/obtenerProductos";

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
              data[i].productoId +
              "</th>" +
              '<td class="txtName">' +
              data[i].nombre +
              "</td>" +
              '<td class="txtDescription">' +
              data[i].descripcion +
              "</td>" +
              '<td class="txtPrice">' +
              data[i].precio +
              "</td>" +
              '<td class="actionDelete"><a class="btnModifyProduct" href="productoModify.html?id=' +
              data[i].productoId +
              '">Actualizar</a> / <a  href="#" class="btnDeleteProduct" product-id="' +
              data[i].productoId +
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

function eliminarProducto(id) {
  var apiUrl = `http://localhost:4090/api/Producto/eliminarProducto/${id}`;

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

function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

function GetDataOfSpecificId(selectedProductId) {
  var apiUrl = `http://localhost:4090/api/Producto/obtenerProductoPorId/${selectedProductId}`;

  $.ajax({
    method: "GET",
    url: apiUrl,
    success: function (response) {
      $("#productName").val(response.nombre);
      $("#productDescription").val(response.descripcion);
      $("#productPrice").val(response.precio);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function modificarProducto() {
  var id = getProductIdFromURL();
  var name = document.getElementById("productName").value;
  var description = document.getElementById("productDescription").value;
  var price = document.getElementById("productPrice").value;

  if (name.trim() !== "" && description.trim() !== "" && price.trim() !== "") {
    var actualizarProducto = {
      productoId: id,
      nombre: name,
      descripcion: description,
      precio: price,
    };

    var apiUrl = "http://localhost:4090/api/Producto/actualizarProducto";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(actualizarProducto),
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

var btnCreateProduct = document.getElementById("btnCreateProduct");
if (btnCreateProduct != null)
  btnCreateProduct.addEventListener("click", function (e) {
    e.preventDefault();
    validarNuevoProducto();
  });

var btnUpdateProduct = document.getElementById("btnUpdateProduct");
if (btnUpdateProduct != null)
  btnUpdateProduct.addEventListener("click", function (e) {
    e.preventDefault();
    modificarProducto();
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
