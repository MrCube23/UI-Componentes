// ProductoController.js

// Variables globales
let action = null;
let type = "producto";

// Inicio de la página
async function startOfPage() {
  await GetDataAndPopulateTable();
  let urlId = getProductIdFromURL();
  if (urlId) GetDataOfSpecificId(urlId);
  LoadCreateBtn();
  LoadUpdateBtn();
  LoadDeleteBtn();
  LoadCancelBtn();
}

function goToList() {
  window.open("productoList.html", "_self");
}

// CRUD

// Obtener datos y poblar tabla
async function GetDataAndPopulateTable() {
  try {
    const data = await obtenerProductos();
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
  } catch (error) {
    console.error("Error al obtener productos:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un error al cargar los datos.",
      confirmButtonText: "Aceptar",
    });
  }
}

// Validar nuevo producto
async function validarNuevoProducto() {
  var name = document.getElementById("productName").value;
  var description = document.getElementById("productDescription").value;
  var price = document.getElementById("productPrice").value;

  if (name.trim() !== "" && description.trim() !== "" && price.trim() !== "") {
    var nuevoProducto = {
      nombre: name,
      descripcion: description,
      precio: price,
    };

    try {
      const { status } = await crearProducto(nuevoProducto);
      console.log("Éxito al crear producto. Estado:", status);

      if (status == 200 || status == 201) {
        mostrarMensaje("creado", true, type);
        waitForConfirmationForm();
      } else if (status == 400 || status == 404) {
        mostrarMensaje("creado", false, type);
      } else {
        mostrarMensaje("creado", null, type);
      }   
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

// Modificar producto
async function modificarProducto() {
  var id = getProductIdFromURL();
  var name = document.getElementById("productName").value;
  var description = document.getElementById("productDescription").value;
  var price = document.getElementById("productPrice").value;

  if (name.trim() !== "" && description.trim() !== "" && price.trim() !== "") {
    var ProductoActualizada = {
      productoId: id,
      nombre: name,
      descripcion: description,
      precio: price,
    };

    try {
      const { status } = await actualizarProducto(ProductoActualizada);
      console.log("Éxito de la actualización. Estado:", status);

      if (status == 200 || status == 201) {
        mostrarMensaje("actualizado", true, type);
        waitForConfirmationForm();
      } else if (status == 400 || status == 404) {
        mostrarMensaje("actualizado", false, type);
      } else {
        mostrarMensaje("actualizado", null, type);
      }   
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  try {
    const { status } = await eliminarProductoRequest(id);
    console.log("Éxito de la eliminación. Estado:", status);

      if (status == 200 || status == 201) {
        mostrarMensaje("eliminado", true, type);
        waitForConfirmationList();
      } else if (status == 400 || status == 404) {
        mostrarMensaje("eliminado", false, type);
      } else {
        mostrarMensaje("eliminado", null, type);
      }   
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  } 
}

// Funciones auxiliares

// Obtener ID desde URL
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}
// Obtener datos de un ID específico
function GetDataOfSpecificId(selectedProductId) {
  obtenerProductoPorId(selectedProductId)
    .then((response) => {
      $("#productName").val(response.nombre);
      $("#productDescription").val(response.descripcion);
      $("#productPrice").val(response.precio);
    })
    .catch((error) => {
      console.error("Error al obtener producto por ID:", error);
    });
}

// Cargar botones
function LoadCreateBtn(){
  var btnCreateProduct = document.getElementById("btnCreateProduct");
  if (btnCreateProduct != null)
    btnCreateProduct.addEventListener("click", function (e) {
    e.preventDefault();
    validarNuevoProducto();
  });
}
function LoadUpdateBtn(){
  var btnUpdateProduct = document.getElementById("btnUpdateProduct");
  if (btnUpdateProduct != null)
    btnUpdateProduct.addEventListener("click", function (e) {
      e.preventDefault();
      modificarProducto();
  });
}
function LoadDeleteBtn(){
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
      // Redireccionar a productoList.html en la misma pestaña
      window.location.href = "productoList.html";
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