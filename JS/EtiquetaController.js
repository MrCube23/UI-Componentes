let action = null;
let type = "etiqueta";

async function startOfPage() {
  await GetDataAndPopulateTable();
  let urlId = getIdFromURL();
  if (urlId) GetDataOfSpecificId(urlId);
  LoadCreateBtn();
  LoadUpdateBtn();
  LoadDeleteBtn();
  LoadCancelBtn();
}

function goToList() {
  window.open("etiquetaList.html", "_self");
}

// CRUD

// Obtener datos y poblar tabla
async function GetDataAndPopulateTable() {
  try {
    const data = await obtenerEtiquetas();
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
  } catch (error) {
    console.error("Error al obtener etiquetas:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un error al cargar los datos.",
      confirmButtonText: "Aceptar",
    });
  }
}

// Validar nueva etiqueta
async function validarNuevaEtiqueta() {
  var name = document.getElementById('etiquetaName').value;
  var description = document.getElementById('etiquetaDesc').value;

  if (name.trim() !== '' && description.trim() !== '') {
    var nuevaEtiqueta = {
      fechaCreacion: new Date().toISOString().slice(0, 10),
      descripcion: description,
      nombre: name
    };

    const { status } = await crearEtiqueta(nuevaEtiqueta);
    console.log("Éxito al crear etiqueta. Estado:", status);

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

// Modificar etiqueta
async function modificarEtiqueta() {
  var id = getIdFromURL();
  var name = document.getElementById('etiquetaName').value;
  var description = document.getElementById('etiquetaDesc').value;

  if (name.trim() !== '' && description.trim() !== '') {
      var etiquetaActualizada = {
        fechaCreacion: new Date().toISOString().slice(0, 10),
        descripcion: description,
        etiquetaId: id,
        nombre: name
      };

    const { status } = await actualizarEtiqueta(etiquetaActualizada);
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

// Eliminar etiqueta
async function eliminarEtiqueta(id) {
  const { status } = await eliminarEtiquetaRequest(id);
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
  obtenerEtiquetaPorId(selectedProductId)
    .then((response) => {
      $("#etiquetaName").val(response.nombre);
      $("#etiquetaDesc").val(response.descripcion);
    })
    .catch((error) => {
      console.error("Error al obtener etiqueta por ID:", error);
    });
}

// Cargar botones
function LoadCreateBtn(){
  var btnCreateEtiqueta = document.getElementById("btnCreateEtiqueta");
  if (btnCreateEtiqueta != null)
    btnCreateEtiqueta.addEventListener("click", function (e) {
    e.preventDefault();
    validarNuevaEtiqueta();
  });
}
function LoadUpdateBtn(){
  var btnUpdateEtiqueta = document.getElementById("btnUpdateEtiqueta");
  if (btnUpdateEtiqueta != null)
    btnUpdateEtiqueta.addEventListener("click", function (e) {
      e.preventDefault();
      modificarEtiqueta();
  });
}
function LoadDeleteBtn(){
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
      // Redireccionar a etiquetaList.html en la misma pestaña
      window.location.href = "etiquetaList.html";
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