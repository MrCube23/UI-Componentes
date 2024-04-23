let action = null;
let type = "orden";
let appliedDiscount = 0;
let cuponUsado = false;
let cupon = null;
let cliente = null;
var totalActual = 0;

async function startOfPage() {
  LoadListPage();
  checkValidarButtonState();
  GetDataAndPopulateSelectCli();
  cargarvalidacioncupones();
  agregarProducto(true);

  var btnDeleteOrden = document.querySelectorAll(".btnDeleteOrden");

  const btnCreateOrden = document.getElementById("btnCreateCliente");
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

      iconSpan.className = 'bi bi-check-circle-fill text-success';
    } else {
      console.error('Error al validar el cupón.');
      iconSpan.className = 'bi bi-x-circle-fill text-danger';
    }
  });
}

function checkValidarButtonState() {
  var totalInput = document.getElementById("total");
  var btnValidar = document.getElementById("btnValitadeCupon");
  var isTotalValid = !isNaN(parseFloat(totalInput.value)) && parseFloat(totalInput.value) > 0;

  btnValidar.disabled = cuponUsado || !isTotalValid; 
}

function goToList() {
  window.open("ordenList.html", "_self");
}

function validarNuevaOrden() {
  const clienteId = document.getElementById('clientesSelect').value;
  const total = document.getElementById('total').value;

  if (!clienteId || clienteId.trim() === '' || clienteId === 'null') {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, seleccione un cliente.",
    });

    return;
  }

  if (total.trim() !== '') {
    var nuevaOrden = {
      "total": parseFloat(total),
      "fecha": new Date().toISOString().replace(/T.*/, ''),
      "cliente": {
        "clienteId": clienteId
      },
      "cupon": cupon,
    }

    crearOrden(nuevaOrden)
      .then(({ status, data }) => {
        if (status == 200 || status == 201) {
          validarNuevaOrdenDetalle(data.ordenId);
          mostrarMensaje("creado", true, type)
            .then(() => {
              goToList();
            });
        } else {
          mostrarMensaje("creado", false, type);
        }
      })
      .catch((error) => {
        console.error("Error al crear orden:", error);
        mostrarMensaje("creado", null, type); 
      });
      
  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

async function validarNuevaOrdenDetalle(ordenId) {

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

// Adapted crearOrdenDetalle using OrdenService

async function crearOrdenDetalle(nuevoOrdenDetalle) {
  try {
    const response = await crearDetallesOrden(nuevoOrdenDetalle);
    return response;
  } catch (error) {
    console.error("Error al crear detalle de orden:", error);
    throw error;
  }
}

// Adapted eliminarOrden using OrdenService

async function eliminarOrden(id) {
  try {
    const response = await eliminarOrdenRequest(id);
    if (response.success) {
      mostrarMensaje("Orden eliminada", response.status);
      startOfPage();
    } else {
      console.error("Error al eliminar orden:", response.error);
      mostrarMensaje("Error al eliminar orden", response.status);
    }
  } catch (error) {
    console.error("Error al eliminar orden:", error);
    mostrarMensaje("Error al eliminar orden", 500);
  }
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
    actualizarOrdenService(actualizarOrden)
      .then(({ status }) => {
        if (status == 200 || status == 201) {
          mostrarMensaje("actualizada", true, type);
          clearFormFields(); 
        } else {
          mostrarMensaje("actualizada", false, type);
        }
      })
      .catch((error) => {
        console.error("Error al actualizar orden:", error);
        mostrarMensaje("actualizada", null, type); 
      });
  } else {
    Swal.fire({
      title: "Message",
      icon: "error",
      text: "Por favor, complete todos los campos.",
    });
  }
}

async function fillProductSelect(selectElement, excludedProducts) {
  try {
    const productos = await obtenerProductos();
    selectElement.empty();
    selectElement.append('<option value="null" disabled>--Selecciona--</option>');

    productos.forEach(producto => {
      if (!excludedProducts.includes(producto.productoId)) {
        selectElement.append(
          `<option value="${producto.productoId}" data-price="${producto.precio}">${producto.nombre}</option>`
        );
      }
    });

    selectElement.val("null");
  } catch (error) {
    console.error("Error fetching products:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al cargar productos!",
    });
  }
}

async function GetDataAndPopulateSelectCli() {
  try {
    const data = await obtenerClientes();
    const selectOptions = $("#clientesSelect");
    selectOptions.empty();

    selectOptions.append('<option value="null">Selecciona un cliente</option>'); 

    data.forEach(cliente => {
      selectOptions.append(
        `<option value="${cliente.clienteId}">${cliente.nombre} ${cliente.primerApellido} ${cliente.segundoApellido}</option>`
      );
    });
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al cargar clientes!",
      });
  }
} 

function agregarProducto(isFirst) {
  var productosContainer = $("#productosContainer");
  var productoRow = $("<div></div>").addClass("form-group producto-row");
  productoRow.html(`
    ${isFirst ? '' : '<hr class="EL--hr-gradient">'}
    <div class="row align-items-center">
      <div class="col-12 mb-4">
        <label for="productos">Producto:</label>                     
        <select name="productos[]" class="form-control productosSelect" required></select>
      </div>
      <div class="col-xl my-3">
        <label for="cantidad">Cantidad:</label>
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
      <div class="col-xl my-3">
        <label for="precio">Precio:</label>
        <input type="text" class="form-control price-input" name="precio[]" required disabled>                   
      </div>     
      ${isFirst ? '' : '<div class="col-6 d-flex justify-content-center align-items-stretch flex-column text-right pt-3"><button type="button" class="btn btn-danger btn-sm btn-remove-producto" onclick="eliminarProducto(this)"><span class="bi bi-trash"></span> Eliminar</button></div>'}
    </div>
  `);

  productoRow.find(".decreaseBtn").click(function () {
    decrementarCantidad(this);
  });
  productoRow.find(".increaseBtn").click(function () {
    incrementarCantidad(this);
  });
  productoRow.find(".productosSelect").change(function () {
    updatePriceAndTotal(this, $(this).closest('.producto-row').find('.quantity-input'), $(this).closest('.producto-row').find('.price-input'));
  });

  var selectedProducts = [];
  productosContainer.find('.productosSelect').each(function () {
    var selectedProduct = $(this).val();
    if (selectedProduct !== 'null') {
      selectedProducts.push(selectedProduct);
    }
  });

  productosContainer.append(productoRow);

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
  try {
    const response = await buscarCuponPorCodigo(cuponCodigo);
    if (!response.payload) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Cupón inválido o sin descuento!',
      });
      return null;
    } else {
      const descuento = response.payload.descuento;
      cupon = response.payload;
      appliedDiscount = descuento;
      recalcularTotal();
      cuponUsado = true;
      checkValidarButtonState();
      Swal.fire({
        icon: 'success',
        title: '¡Cupón válido!',
        text: `Se aplicó un descuento de ${descuento}%`,
      });
      return response.payload;
    }
  } catch (error) {
    console.error("Error validating coupon:", error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error al validar el cupón!',
    });
    return null;
  }
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

  var totalInput = document.getElementById("total");
  var currentTotal = parseFloat(totalInput.value) || 0;
  var newTotal = Math.max(0, currentTotal - price);
  totalInput.value = newTotal.toFixed(2);

  row.remove();
  recalcularTotal();
}

window.onload = function () {
  startOfPage();
};

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

  return Swal.fire({
    title: title,
    icon: icon,
    text: text,
    confirmButtonText: "Aceptar",
  });
}

const cellRendererDelete = (options) => {
  if (!options.data) return null;
  const button = document.createElement('span');
  button.textContent = 'Eliminar';
  button.classList.add('text-danger', 'cursor-pointer');
  button.addEventListener('click', async () => {
    const { data } = options;
    const { detalle } = data;
    const { detalleId } = detalle;
    const result = await eliminarDetallesOrden(detalleId);
    if (result.success) {
      // Swal.fire('Eliminado', 'El detalle de la orden ha sido eliminado correctamente.', 'success');
      Swal.fire({
        title: 'Eliminado',
        text: 'El detalle de la orden ha sido eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      reloadData();
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Ha ocurrido un error al eliminar el detalle de la orden.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  });

  return button;
};

let apiGrid = null;
const gridOptions = {
  columnDefs: [
    {
      valueFormatter: ({ value, node }) => {
        if (node.allLeafChildren.length === 0) return `Orden #${value}`;

        const { cliente, orden } = node.allLeafChildren[0].data;
        return `Orden #${orden.ordenId} - ${cliente.nombre} ${cliente.primerApellido} ${cliente.segundoApellido}`;
      },
      headerName: 'Orden', field: 'orden.ordenId',
      hide: true, rowGroup: true,
    },
    {
      headerName: 'Detalle ID', field: 'detalle.detalleId',
    },
    {
      headerName: 'Nombre Producto', field: 'producto.nombre',
    },
    {
      headerName: 'Descripción', field: 'producto.descripcion',
    },
    {
      headerName: 'Precio', field: 'producto.precio',
    },
    {
      headerName: 'Cantidad', field: 'detalle.cantidad',
    },
    {
      headerName: 'Fecha', field: 'orden.fecha',
    },
    {
      headerName: 'Acciones',
      cellRenderer: cellRendererDelete,
    }
  ],
  defaultColDef: {
    filter: true,
    sortable: true,
    editable: false,
    resizable: true,
  },
};

async function fetchDetalleOrden(orden, productos) {
  try {
    const cliente = await obtenerClientePorId(orden.clienteId);
    const detalles = await obtenerDetallesOrdenPorOrdenId(orden.ordenId);
    const formatted = detalles.map(d => {
      const producto = productos.find(p => p.productoId === d.productoId);
      if (!producto) return null;

      return {
        orden,
        cliente,
        producto,
        detalle: d,
      };
    });

    return formatted.filter(Boolean);
  }
  catch (error) {
    console.error(error);
    return [];
  }
}

async function reloadData() {
  apiGrid.setGridOption('rowData', []);

  const productos = await obtenerProductos();
  const ordenes = await obtenerOrdenes();

  const obtenidos = ordenes.map(o => fetchDetalleOrden(o, productos));
  const detalles = await Promise.all(obtenidos);
  const data = detalles.flat();

  apiGrid.setGridOption('rowData', data);
}

function LoadListPage(){
  const gridDiv = document.querySelector('#ag-root');
  if (gridDiv){
    apiGrid = new agGrid.createGrid(gridDiv, gridOptions);
    reloadData();
  }
}