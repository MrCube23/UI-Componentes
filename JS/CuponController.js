// CuponController.js

// Variables globales
let action = null;
let type = "cupón";

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
    const data = await obtenerCupones();
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
  } catch (error) {
    console.error("Error al obtener cupones:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un error al cargar los datos.",
      confirmButtonText: "Aceptar",
    });
  }
}

// Validar nuevo cupon
async function validarNuevoCupon() {
  var name = document.getElementById('cuponName').value;
  var discount = document.getElementById('cuponDiscount').value;

  if (name.trim() !== '' && discount.trim() !== '') {
    var nuevoCupon = {
      codigo: name,
      descuento: discount
    };

    const { status } = await crearCupon(nuevoCupon);

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

// Modificar cupon
async function modificarCupon() {
  var id = getIdFromURL();
  var name = document.getElementById('cuponName').value;
  var discount = document.getElementById('cuponDiscount').value;

  if (name.trim() !== '' && discount.trim() !== '') {
    var actualizadoCupon = {
      cuponId: id,
      codigo: name,
      descuento: discount
    };

    const { status } = await actualizarCupon(actualizadoCupon)
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

// Eliminar cupon
async function eliminarCupon(id) {
  const { status } = await eliminarCuponRequest(id);

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
  obtenerCuponPorId(selectedProductId)
    .then((response) => {
      $("#cuponName").val(response.codigo);
      $("#cuponDiscount").val(response.descuento);
    })
    .catch((error) => {
      console.error("Error al obtener cupón por ID:", error);
    });
}

// Cargar botones
function LoadCreateBtn() {
  var btnCreateCupon = document.getElementById("btnCreateCupon");
  if (btnCreateCupon != null)
    btnCreateCupon.addEventListener("click", function (e) {
      e.preventDefault();
      validarNuevoCupon();
    });
}
function LoadUpdateBtn() {
  var btnUpdateCupon = document.getElementById("btnUpdateCupon");
  if (btnUpdateCupon != null)
    btnUpdateCupon.addEventListener("click", function (e) {
      e.preventDefault();
      modificarCupon();
    });
}
function LoadDeleteBtn() {
  var btnDeleteCupon = document.querySelectorAll(".btnDeleteCupon");
  if (btnDeleteCupon != null) {
    for (var i = 0; i < btnDeleteCupon.length; i++) {
      btnDeleteCupon[i].addEventListener("click", function (e) {
        e.preventDefault();
        var productId = this.getAttribute("product-id");
        eliminarCupon(productId);
      });
    }
  }
}
function LoadCancelBtn() {
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
      window.location.href = "cuponList.html";
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