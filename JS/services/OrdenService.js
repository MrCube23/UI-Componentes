const url = 'http://localhost:4090';

async function getAllOrdenes() {
	try {
		const response = await $.ajax({
			url: url.concat('/api/Orden/obtenerTodasLasOrdenes'),
			type: 'GET',
		});

		return response;
	}
	catch (error) {
		Swal.fire({
			title: 'Error',
			text: 'Ocurrio un error al obtener las ordenes',
			icon: 'error',
		});
	}
}

async function getAllProductos() {
	try {
		const response = await $.ajax({
			url: url.concat('/api/Producto/obtenerProductos'),
			type: 'GET',
		});

		return response;
	}
	catch (error) {
		Swal.fire({
			title: 'Error',
			text: 'Ocurrio un error al obtener los productos',
			icon: 'error',
		});
	}
}

async function getCliente(id) {
	try {
		const response = await $.ajax({
			url: url.concat('/api/Cliente/obtenerClientePorId/', id),
			type: 'GET',
		});

		return response;
	}
	catch (error) {
		Swal.fire({
			title: 'Error',
			text: 'Ocurrio un error al obtener el cliente',
			icon: 'error',
		});
	}
}

async function getDetalleOrden(id) {
	try {
		const response = await $.ajax({
			url: url.concat('/api/DetallesOrden/obtenerDetallesOrdenPorOrdenId/', id),
			type: 'GET',
		});

		return response;
	}
	catch (error) {
		Swal.fire({
			title: 'Error',
			text: 'Ocurrio un error al obtener el detalle de la orden',
			icon: 'error',
		});
	}
}

async function deleteDetalleOrden(id) {
	try {
		const response = await $.ajax({
			url: url.concat('/api/DetallesOrden/eliminarDetallesOrden/', id),
			dataType: 'text',
			type: 'DELETE',
		});

		return true;
	}
	catch (error) {
		Swal.fire({
			title: 'Error',
			text: 'Ocurrio un error al eliminar el detalle de la orden',
			icon: 'error',
		});
	}
}