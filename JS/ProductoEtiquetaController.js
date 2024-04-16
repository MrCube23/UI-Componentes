// ProductoEtiquetaController.js

let action = null;
let type = "relacion";

async function startOfPage() {
  await Promise.all([populateSelects(), GetDataAndPopulateTable()]);
  let urlId = getIdFromURL();
  if (urlId) await GetDataOfSpecificId(urlId);
  LoadCreateBtn();
  LoadUpdateBtn();
  LoadDeleteBtn();
  LoadCancelBtn();
}

function goToList() {
  window.open("productoetiquetaList.html", "_self");
}

// CRUD

// Obtener datos y poblar tabla
async function GetDataAndPopulateTable() {
  try {
    const data = await obtenerProductoEtiquetas();
    const tableBody = $("#dynamicTableBody");
    tableBody.empty();

    const rows = [];

    for (const item of data) {
      const etiquetaNombrePromise = obtenerEtiquetaPorId(item.etiquetaId).then(res => res.nombre);
      const productoNombrePromise = obtenerProductoPorId(item.productoId).then(res => res.nombre);

      const [etiquetaNombre, productoNombre] = await Promise.all([etiquetaNombrePromise, productoNombrePromise]);

      const row = $("<tr>").append(
        $("<th>", { scope: "row", class: "txtId", text: item.detalleId }),
        $("<td>", { class: "txtEtiquetaId", text: etiquetaNombre }),
        $("<td>", { class: "txtProductoId", text: productoNombre }),
        $("<td>", { class: "cantidad", text: item.cantidad }),
        $("<td>", { class: "actionDelete" }).append(
          $("<a>", { class: "btnDecoratioStyleMod btnModifyProTag", href: `productoetiquetaModify.html?id=${item.detalleId}`, text: "Actualizar" }),
          " / ",
          $("<a>", { href: "#", class: "btnDecoratioStyleDel btnDeleteProTag", "product-id": item.detalleId, text: "Eliminar" })
        )
      );

      rows.push(row);
    }

    tableBody.append(rows);
  } catch (error) {
    console.error("Error al obtener relaciones producto-etiqueta:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un error al cargar los datos.",
      confirmButtonText: "Aceptar",
    });
  }
}

// Validar nueva asignación
async function validarNuevaAssignacion() {
  const etiqueta = document.getElementById('etiquetasSelect').value;
  const producto = document.getElementById('productosSelect').value;
  const cantidad = document.getElementById('amountOfProducts').value;

  if (cantidad.trim() !== '') {
    const nuevaAssignacion = { etiquetaId: etiqueta, productoId: producto, cantidad: cantidad };

    try {
      const { status } = await crearProductoEtiqueta(nuevaAssignacion);
      if (status == 200 || status == 201) {
        mostrarMensaje("creada", true, type);
        waitForConfirmationForm();
      } else if (status == 400 || status == 404) {
        mostrarMensaje("creada", false, type);
      } else {
        mostrarMensaje("creada", null, type);
      }
    } catch (error) {
      console.error("Error al crear relación producto-etiqueta:", error);
    }
  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

async function GetDataOfSpecificId(selectedProductId) {
  try {
    const response = await obtenerProductoEtiquetaPorId(selectedProductId);
    const etiquetaNombre = await obtenerEtiquetaPorId(response.etiquetaId).then(res => res.nombre);
    const productoNombre = await obtenerProductoPorId(response.productoId).then(res => res.nombre);

    const etiquetasSelect = $("#etiquetasSelect");
    const productosSelect = $("#productosSelect");

    // Actualizar selects si las opciones ya existen, de lo contrario agregarlas
    etiquetasSelect.find(`option[value="${response.etiquetaId}"]`).length
      ? etiquetasSelect.find(`option[value="${response.etiquetaId}"]`).text(etiquetaNombre)
      : etiquetasSelect.append(`<option value="${response.etiquetaId}">${etiquetaNombre}</option>`);

    productosSelect.find(`option[value="${response.productoId}"]`).length
      ? productosSelect.find(`option[value="${response.productoId}"]`).text(productoNombre)
      : productosSelect.append(`<option value="${response.productoId}">${productoNombre}</option>`);

    etiquetasSelect.val(response.etiquetaId);
    productosSelect.val(response.productoId);
    $("#amountOfProducts").val(response.cantidad);
  } catch (error) {
    console.error(error);
  }
}

async function modificarProductoEtiqueta() {
  const id = getIdFromURL();
  const etiqueta = document.getElementById('etiquetasSelect').value;
  const producto = document.getElementById('productosSelect').value;
  const cantidad = document.getElementById('amountOfProducts').value;

  if (cantidad.trim() !== '') {
    var actualizarAssignacion = { detalleId: id, etiquetaId: etiqueta, productoId: producto, cantidad: cantidad };
    try {
      console.log(actualizarAssignacion);
      const { status } = await actualizarProductoEtiqueta(actualizarAssignacion);
      if (status == 200 || status == 201) {
        mostrarMensaje("actualizada", true, type);
        waitForConfirmationForm();
      } else if (status == 400 || status == 404) {
        mostrarMensaje("actualizada", false, type);
      } else {
        mostrarMensaje("actualizada", null, type);
      }
    } catch (error) {
      console.error("Error al actualizar relación producto-etiqueta:", error);
    }
  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

async function populateSelects() {
  try {
    const [etiquetasData, productosData] = await Promise.all([
      obtenerEtiquetas(),
      obtenerProductos(),
    ]);

    const etiquetasSelect = $("#etiquetasSelect");
    const productosSelect = $("#productosSelect");

    etiquetasSelect.empty().append('<option value="null" disabled>--Selecciona--</option>');
    productosSelect.empty().append('<option value="null" disabled>--Selecciona--</option>');

    for (const etiqueta of etiquetasData) {
      etiquetasSelect.append(`<option value="${etiqueta.etiquetaId}">${etiqueta.nombre}</option>`);
    }

    for (const producto of productosData) {
      productosSelect.append(`<option value="${producto.productoId}">${producto.nombre}</option>`);
    }

    etiquetasSelect.val("null");
    productosSelect.val("null");
  } catch (error) {
    console.error("Error al poblar selects:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al cargar los datos para los selects.",
      confirmButtonText: "Aceptar",
    });
  }
}

async function eliminarProductoEtiqueta(id) {
  try {
    const { status } = await eliminarProductoEtiquetaRequest(id);
    if (status == 200 || status == 201) {
      mostrarMensaje("eliminada", true, type);
      waitForConfirmationList();
    } else if (status == 400 || status == 404) {
      mostrarMensaje("eliminada", false, type);
    } else {
      mostrarMensaje("eliminada", null, type);
    }
  } catch (error) {
    console.error("Error al eliminar relación producto-etiqueta:", error);
  } 
}

// Cargar Selectores

async function GetDataAndPopulateSelectEti() {
  try {
    const data = await obtenerEtiquetas();
    const selectOptions = $("#etiquetasSelect");
    selectOptions.empty();

    selectOptions.append('<option value="null" disabled>--Selecciona--</option>');

    for (const etiqueta of data) {
      selectOptions.append(
        `<option value="${etiqueta.etiquetaId}">${etiqueta.nombre}</option>`
      );
    }
    selectOptions.val("null");
  } catch (error) {
    console.error("Error al obtener etiquetas:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al cargar los datos para el select de etiquetas.",
      confirmButtonText: "Aceptar",
    });
  }
}

async function GetDataAndPopulateSelectProd() {
  try {
    const data = await obtenerProductos();
    const selectOptions = $("#productosSelect");
    selectOptions.empty();

    selectOptions.append('<option value="null" disabled>--Selecciona--</option>');

    for (const producto of data) {
      selectOptions.append(
        `<option value="${producto.productoId}">${producto.nombre}</option>`
      );
    }
    selectOptions.val("null");
  } catch (error) {
    console.error("Error al obtener productos:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al cargar los datos para el select de productos.",
      confirmButtonText: "Aceptar",
    });
  }
}

// Funciones auxiliares

// Obtener ID desde URL
function getIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

// Cargar botones
function LoadCreateBtn(){
  var btnCreateProductoEtiqueta = document.getElementById("btnCreateProductoEtiqueta");
  if (btnCreateProductoEtiqueta != null)
    btnCreateProductoEtiqueta.addEventListener("click", function (e) {
    e.preventDefault();
    validarNuevaAssignacion();
  });
}
function LoadUpdateBtn(){
  var btnUpdateProductoEtiqueta = document.getElementById("btnUpdateProductoEtiqueta");
  if (btnUpdateProductoEtiqueta != null)
    btnUpdateProductoEtiqueta.addEventListener("click", function (e) {
      e.preventDefault();
      modificarProductoEtiqueta();
  });
}
function LoadDeleteBtn(){
  var btnDeleteProTag = document.querySelectorAll(".btnDeleteProTag");

  if (btnDeleteProTag != null) {
    for (var i = 0; i < btnDeleteProTag.length; i++) {
      btnDeleteProTag[i].addEventListener("click", function (e) {
        e.preventDefault();
        var productId = this.getAttribute("product-id");
        eliminarProductoEtiqueta(productId);
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
      text = "La " + type + " se " + action + " correctamente.";
      break;
    case false:
      title = "Error";
      icon = "error";
      text = "Hubo un problema al " + action + " la " + type + ".";
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
      // Redireccionar a productoetiquetaList.html en la misma pestaña
      window.location.href = "productoetiquetaList.html";
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

function populateSelects(){
    GetDataAndPopulateSelectEti();
    GetDataAndPopulateSelectProd();
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

// Inicialización de la página
window.onload = function () {
  startOfPage();
};