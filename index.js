var express = require('express');
var exphbs = require('express-handlebars');
const fs = require('fs');
var Pusher = require('pusher');

var app = express();

var pusher = new Pusher({
    appId: '788469',
    key: '48aa33fe9a6470da8fd8',
    secret: '552daf810dcce5d42fba',
    cluster: 'us2',
    encrypted: true
});

app.use(express.static('public'));


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const ARCHIVO_VISITAS = 'public/files/visitas.txt';

app.get('/', function (request, response) {
    response.render('home');
});

app.get('/paginaa', function (request, response) {
    actulizarVisita("A");
    let visitas = obtenerVisitas('A');
    enviarMensaje();
    response.render('paginaa', { visitas: visitas });
});

app.post('/obtenervisitas', function (request, response) {
    let tipoPagina = request.query.tipo;
    console.log(tipoPagina);
    let visitas = obtenerVisitas(tipoPagina);
    response.send(visitas);
});

app.get('/paginab', function (request, response) {
    actulizarVisita("B");
    let visitas = obtenerVisitas('B');
    enviarMensaje();
    response.render('paginab', { visitas: visitas });
});

app.get('/paginac', function (request, response) {
    actulizarVisita("C");
    let visitas = obtenerVisitas('C');
    enviarMensaje();
    response.render('paginac', { visitas: visitas });
});

function actulizarVisita(pagina) {
    let contenido = fs.readFileSync(ARCHIVO_VISITAS, 'utf8');
    let lineas = contenido.split('\n');
    let contenidoSalida = [];
    if (pagina == 'A') {
        let linea = lineas[0];
        let particion = linea.split(':');
        let nombre = particion[0];
        let particion2 = particion[1].split(' ')
        let visitas = parseInt(particion2[1]);
        visitas += 1;
        contenidoSalida.push(nombre + ": " + visitas + " visitas");
        contenidoSalida.push(lineas[1]);
        contenidoSalida.push(lineas[2]);
    }
    else if (pagina == 'B') {
        let linea = lineas[1];
        let particion = linea.split(':');
        let nombre = particion[0];
        let particion2 = particion[1].split(' ')
        let visitas = parseInt(particion2[1]);
        visitas += 1;
        contenidoSalida.push(lineas[0]);
        contenidoSalida.push(nombre + ": " + visitas + " visitas");
        contenidoSalida.push(lineas[2]);
    }
    else if (pagina == 'C') {
        let linea = lineas[2];
        let particion = linea.split(':');
        let nombre = particion[0];
        let particion2 = particion[1].split(' ')
        let visitas = parseInt(particion2[1]);
        visitas += 1;
        contenidoSalida.push(lineas[0]);
        contenidoSalida.push(lineas[1]);
        contenidoSalida.push(nombre + ": " + visitas + " visitas");
    }
    else {
        //Sale error
    }
    let nuevoContenido = "";
    contenidoSalida.forEach(linea => {
        nuevoContenido += linea + "\n";
    });
    let escritura = fs.writeFileSync(ARCHIVO_VISITAS, nuevoContenido);
}

function obtenerVisitas(pagina) {
    let contenido = fs.readFileSync(ARCHIVO_VISITAS, 'utf8');
    let lineas = contenido.split('\n');
    let numeroVisitas = 0;
    lineas.forEach(linea => {
        let particion = linea.split(':');
        let nombre = particion[0];
        if (nombre == ("Página " + pagina)) {
            let particion2 = particion[1].split(' ')
            numeroVisitas = parseInt(particion2[1]);
        }
    });
    return numeroVisitas;
}

function enviarMensaje() {
    let contenido = fs.readFileSync(ARCHIVO_VISITAS, 'utf8');
    let lineas = contenido.split('\n');
    let numeros = [];
    for (let index = 0; index < lineas.length -1; index++) {
        const linea = lineas[index];
        var particion = linea.split(':');
        var particion2 = particion[1].split(' ')
        numeros.push(parseInt(particion2[1]));
        
    }
    pusher.trigger('my-channel', 'my-event', {
        tipoA: numeros[0],
        tipoB: numeros[1],
        tipoC: numeros[2]
    });
}



console.log("Servidor iniciado...");
app.listen(3000);