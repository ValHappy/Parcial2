

var pusher = new Pusher('48aa33fe9a6470da8fd8', {
    cluster: 'us2',
    forceTLS: true
});


var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function (data) {
    var tipo = document.querySelector(".tipo").value;
    var datos = data
    var visitas = document.querySelector(".visitas");
    if (tipo == "A"){
        visitas.innerHTML = datos.tipoA;
    } else if(tipo == "B") {
        visitas.innerHTML = datos.tipoB;
    } else {
        visitas.innerHTML =datos.tipoC;
    }
});
