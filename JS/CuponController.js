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
                'Accept': "application/json"
            },
            method: "POST",
            url: apiUrl,
            dataType: "json",
            data: JSON.stringify(nuevoCupon),
            hasContent: true,
            statusCode: {
                200: function() { mostrarMensaje(200); },
                201: function() { mostrarMensaje(201); },
                400: function() { mostrarMensaje(400); },
                404: function() { mostrarMensaje(404); },
                500: function() { mostrarMensaje(500); }
            }
        })
    } else {
        Swal.fire({
            title: "Message",
            icon: 'error',
            text: "Por favor, complete todos los campos."
        });
    }
}

var btnCreateProduct = document.getElementById('btnCreateCupon');
btnCreateProduct.addEventListener('click', function (e) {
    e.preventDefault();
    validarNuevoCupon();
});

function mostrarMensaje(statusCode) {
    var title, icon, text;

    switch (statusCode) {
        case 200:
        case 201:
            title = "Success";
            icon = "success";
            text = "Su cupon fue creado exitosamente.";
            break;
        case 400:
        case 404:
        case 500:
            title = "Error";
            icon = "error";
            text = "Existe un problema al crear el cupon.";
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
        text: text
    });
}
