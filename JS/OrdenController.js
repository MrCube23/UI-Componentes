let action = null;
let type = "orden";
let appliedDiscount = 0;
let cuponUsado = false;
let cupon = null;
let cliente = null;
var totalActual = 0;

async function startOfPage() {
  checkValidarButtonState();
  GetDataAndPopulateSelectCli();
  cargarvalidacioncupones();
  agregarProducto(true);

  var btnDeleteOrden = document.querySelectorAll(".btnDeleteOrden");
  console.log(btnDeleteOrden);

  const btnCreateOrden = document.getElementById("btnCreateCliente"); // Assuming this is the correct button ID
  if (btnCreateOrden) {
    btnCreateOrden.addEventListener("click", function (e) {
      e.preventDefault();
      validarNuevaOrden();
    });
  }

  if (btnDeleteOrden != null) {
    for (var i = 0; i < btnDeleteOrden.length; i++) {
      btnDeleteOrden[i].addEventListener("click", function (e) {
        e.preventDefault();
        var ordenId = this.getAttribute("orden-id");
        eliminarOrden(ordenId);
      });
    }
  }
}

async function cargarvalidacioncupones() {
  document.getElementById('btnValitadeCupon').addEventListener('click', async function (e) {
    e.preventDefault();
    var cuponCodigo = document.getElementById('codigo-cupon').value;
    var iconSpan = document.querySelector('.input-group-text i');

    var descuento = await validarCupon(cuponCodigo);
    if (descuento) {

      console.log('Descuento aplicado:', descuento);
      // Cambiar clase del icono a check si el cupón es válido
      iconSpan.className = 'bi bi-check-circle-fill text-success';
    } else {
      console.error('Error al validar el cupón:', error);
      // Cambiar clase del icono a x-circle si el cupón no es válido
      iconSpan.className = 'bi bi-x-circle-fill text-danger';
    }
  });
}

function checkValidarButtonState() {
  var totalInput = document.getElementById("total");
  var btnValidar = document.getElementById("btnValitadeCupon");
  var isTotalValid = !isNaN(parseFloat(totalInput.value)) && parseFloat(totalInput.value) > 0;

  btnValidar.disabled = cuponUsado || !isTotalValid;  // Disable if coupon used or total invalid
  console.log('isTotalValid:', isTotalValid);
  console.log('cuponUsado:', cuponUsado);
}

function goToList() {
  window.open("ordenList.html", "_self");
}

function callINFUsuario(id) {
  return new Promise((resolve, reject) => {
    var apiURL = `http://localhost:4090/api/Cliente/obtenerClientePorId/${id}`;
    $.ajax({
      method: "GET",
      url: apiURL,
      success: function (response) {
        resolve(response.nombreCompleto);
        cliente = response;
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

function validarNuevaOrden() {
  const clienteId = document.getElementById('clientesSelect').value;
  const total = document.getElementById('total').value;

  if (clienteId.trim() !== '' && total.trim() !== '') {

    var nuevaOrden = {
      "total": parseFloat(total),
      "fecha": new Date().toISOString().replace(/T.*/, ''),
      "cliente": {
        "clienteId": clienteId
      },
      "cupon": cupon,
    }

    var apiUrl = "http://localhost:4090/api/Orden/crearOrden";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(nuevaOrden),
      hasContent: true,
      statusCode: {
        200: function (data) {
          mostrarMensaje("creado", 200);
          validarNuevaOrdenDetalle(data.ordenId);
        },
        201: function () {
          mostrarMensaje("creado", 201);
          validarNuevaOrdenDetalle(data.ordenId);
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

function validarNuevaOrdenDetalle(ordenId) {

  var productosData = [];

  $(".producto-row").each(function () {
    var productoSelect = $(this).find(".productosSelect");
    var quantityInput = $(this).find(".quantity-input");

    var productoId = productoSelect.val();
    var cantidad = quantityInput.val();

    // Verificar si los valores son válidos antes de agregarlos al array
    if (productoId !== "null" && cantidad && !isNaN(cantidad)) {
      productosData.push({ productoId, cantidad });
    } else {
      console.warn("Se encontraron valores inválidos en la fila del producto.");
    }

  });


  for (const producto of productosData) {
    const nuevoOrdenDetalle = {
      orden: {
        ordenId,
      },
      producto: {
        productoId: parseInt(producto.productoId),
      },
      cantidad: parseInt(producto.cantidad),
    };

    crearOrdenDetalle(nuevoOrdenDetalle);

  }

  Swal.fire({
    title: "Success",
    icon: "success",
    text: "Orden creada exitosamente!",
  });

}

function crearOrdenDetalle(nuevoOrdenDetalle) {

  $.ajax({
    headers: {
      Accept: "application/json",
    },
    method: "POST",
    url: "http://localhost:4090/api/DetallesOrden/crearDetallesOrden",
    dataType: "json",
    data: JSON.stringify(nuevoOrdenDetalle),
    hasContent: true,
    statusCode: {
      200: function () {
        console.log("Detalle de orden creado con éxito.");
      },
      201: function () {
        console.log("Detalle de orden creado con éxito (código 201).");
      },
      400: function () {
        console.error("Error 400: Solicitud incorrecta al crear detalle de orden.");
      },
      404: function () {
        console.error("Error 404: Ruta no encontrada para crear detalle de orden.");
      },
      500: function () {
        console.error("Error 500: Error del servidor al crear detalle de orden.");
      },
    },
  });
}

function eliminarOrden(id) {
  var apiUrl = `http://localhost:4090/api/Orden/eliminarOrden/${id}`;
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
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

function modificarOrden() {
  var id = getIdFromURL();
  var cliente = document.getElementById('clientesSelect').value;
  var cupon = document.getElementById('clientePRA').value;
  if (cliente.trim() !== '' && cupon.trim() !== '') {
    var actualizarOrden = {
      ordenId: id,
      clienteId: cliente,
      codigoCupon: cupon
    };
    var apiUrl = "http://localhost:4090/api/Orden/actualizarOrden";

    $.ajax({
      headers: {
        Accept: "application/json",
      },
      method: "PUT",
      url: apiUrl,
      dataType: "json",
      data: JSON.stringify(actualizarOrden),
      hasContent: true,
      statusCode: {
        200: function () {
          mostrarMensaje("actualizada", 200),
            clearFormFields();
          //waitForConfirmation();
        },
        201: function () {
          mostrarMensaje("actualizada", 201),
            clearFormFields();
          //waitForConfirmation();
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

function fillProductSelect(selectElement, excludedProducts) {
  var apiUrl = "http://localhost:4090/api/Producto/obtenerProductos";

  $.ajax({
    url: apiUrl,
    method: "GET",
    dataType: "json",
    success: function (data) {
      selectElement.empty();
      selectElement.append('<option value="null" disabled>--Selecciona--</option>');

      $.each(data, function (index, producto) {
        if (!excludedProducts.includes(producto.productoId)) {
          selectElement.append(
            '<option value="' + producto.productoId + '" data-price="' + producto.precio + '">' + producto.nombre + '</option>'
          );
        }
      });
      selectElement.val("null");
    },
    error: function (error) {
      console.error("Error al obtener productos:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al cargar productos!",
      });
    },
  });
}

function GetDataAndPopulateSelectCli() {
  var apiUrl = "http://localhost:4090/api/Cliente/obtenerClientes";

  $.ajax({
    url: apiUrl,
    method: "GET",
    dataType: "json",
  })
    .done(function (data) {
      var selectOptions = $("#clientesSelect");
      selectOptions.empty();

      // Add a disabled placeholder option
      selectOptions.append('<option value="" disabled selected>Selecciona un cliente</option>');

      for (var i = 0; i < data.length; i++) {
        selectOptions.append(
          '<option value="' + data[i].clienteId + '">' +
          data[i].nombre + ' ' + data[i].primerApellido + ' ' + data[i].segundoApellido +
          '</option>'
        );
      }
    })
    .fail(function (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al cargar clientes!",
      });
    });
}

function agregarProducto(isFirst) {
  var productosContainer = $("#productosContainer");
  var productoRow = $("<div></div>").addClass("form-group producto-row");
  productoRow.html(`
    ${isFirst ? '' : '<hr class="EL--hr-gradient">'}
    <div class="row align-items-center">
      <div class="col-12 mb-4">
        <label for="productos" class="mb-0">Producto:</label>                     
        <select name="productos[]" class="form-control productosSelect" required></select>
      </div>
      <div class="col-6 text-center">
        <label for="cantidad" class="mb-0">Cantidad:</label>
        <div class="input-group">
          <span class="input-group-btn">
            <button class="btn btn-outline-secondary decreaseBtn" type="button">-</button>
          </span>
          <input type="text" name="quant[]" class="form-control quantity-input" value="1" min="1" max="99"> 
          <span class="input-group-btn">
            <button class="btn btn-outline-secondary increaseBtn" type="button">+</button>
          </span>
        </div>
      </div>
      <div class="col-6">
        <label for="precio" class="mb-0">Precio:</label>
        <input type="text" class="form-control price-input" name="precio[]" required disabled>                   
      </div>     
      ${isFirst ? '' : '<div class="col-6 d-flex justify-content-center align-items-stretch flex-column text-right pt-3"><button type="button" class="btn btn-danger btn-sm btn-remove-producto" onclick="eliminarProducto(this)"><span class="bi bi-trash"></span> Eliminar</button></div>'}
    </div>
  `);

  // Agregar event listeners a los botones de incremento y decremento
  productoRow.find(".decreaseBtn").click(function () {
    decrementarCantidad(this);
  });
  productoRow.find(".increaseBtn").click(function () {
    incrementarCantidad(this);
  });
  productoRow.find(".productosSelect").change(function () {
    updatePriceAndTotal(this, $(this).closest('.producto-row').find('.quantity-input'), $(this).closest('.producto-row').find('.price-input'));
  });

  // Obtener los productos seleccionados en las filas anteriores
  var selectedProducts = [];
  productosContainer.find('.productosSelect').each(function () {
    var selectedProduct = $(this).val();
    if (selectedProduct !== 'null') {
      selectedProducts.push(selectedProduct);
    }
  });

  productosContainer.append(productoRow);

  // Llenar el select de productos excluyendo los productos seleccionados previamente
  fillProductSelect(productoRow.find(".productosSelect"), selectedProducts);

}

function updatePriceAndTotal(productSelect, quantityInput, precioInput) {
  quantityInput = $(quantityInput);
  precioInput = $(precioInput);
  var selectedOption = productSelect.options[productSelect.selectedIndex];
  var productPrice = parseFloat(selectedOption.dataset.price || 0);
  var quantity = parseFloat(quantityInput.val() || 0);

  var rowPrice = productPrice * quantity;
  precioInput.val(rowPrice.toFixed(2));

  recalcularTotal();
}

async function validarCupon(cuponCodigo) {
  return new Promise((resolve, reject) => {
    var apiUrl = `http://localhost:4090/api/Cupon/buscarCuponPorCodigo/${cuponCodigo}`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
    })
      .done(function (response) {
        if (!response.payload) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Cupón inválido o sin descuento!',
          });
          resolve(null);
        }
        else {
          var descuento = response.payload.descuento;
          cupon = response.payload;
          console.log('Cupón válido:', cupon);
          appliedDiscount = descuento;
          recalcularTotal();
          cuponUsado = true;
          checkValidarButtonState();

          Swal.fire({
            icon: 'success',
            title: '¡Cupón válido!',
            text: `Se aplicó un descuento de ${descuento}%`,
          });
        }
      })
      .fail(function (error) {
        console.error("Error validating coupon:", error);
        resolve(null);
      });
  });
}

function incrementarCantidad(button) {
  var input = button.parentNode.parentNode.querySelector(".quantity-input");
  var currentValue = parseInt(input.value);
  if (!isNaN(currentValue) && currentValue < 99) {
    input.value = currentValue + 1;
    updatePriceAndTotal(input.closest(".producto-row").querySelector(".productosSelect"), input, input.closest(".producto-row").querySelector(".price-input"));
  }
}

function decrementarCantidad(button) {
  var input = button.parentNode.parentNode.querySelector(".quantity-input");
  var currentValue = parseInt(input.value);
  if (!isNaN(currentValue) && currentValue > 1) {
    input.value = currentValue - 1;
    updatePriceAndTotal(input.closest(".producto-row").querySelector(".productosSelect"), input, input.closest(".producto-row").querySelector(".price-input"));
  }
}

function recalcularTotal() {
  var productRows = document.querySelectorAll(".producto-row");
  var total = 0;
  productRows.forEach(function (row) {
    var rowPriceInput = row.querySelector(".price-input");
    var rowPrice = parseFloat(rowPriceInput.value || 0);
    if (!isNaN(rowPrice)) {
      total += rowPrice;
    }
  });

  if (appliedDiscount > 0) {
    var descuentoCantidad = total * (appliedDiscount / 100);
    total -= descuentoCantidad;
  }

  document.getElementById("total").value = total.toFixed(2);
  checkValidarButtonState();
}

function eliminarProducto(button) {
  var row = button.closest('.producto-row');
  var priceInput = row.querySelector('.price-input');
  var price = parseFloat(priceInput.value) || 0;

  // Restar el precio del producto eliminado del total
  var totalInput = document.getElementById("total");
  var currentTotal = parseFloat(totalInput.value) || 0;
  var newTotal = Math.max(0, currentTotal - price); // No permitir que el total sea negativo
  totalInput.value = newTotal.toFixed(2);

  // Eliminar la fila del producto
  row.remove();
  recalcularTotal();
}

window.onload = function () {
  startOfPage();
};

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