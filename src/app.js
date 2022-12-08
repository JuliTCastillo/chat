import express from 'express';
import handlerbars from 'express-handlebars'; //importamos la plantilla
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js'
import {Server} from 'socket.io';

const app = express(); //iniciamos el servidor

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlerbars.engine())
app.set('views', __dirname+'/views'); //indicamos donde se guardan las vistas
app.set('view engine', 'handlebars'); 

app.use('/', viewsRouter);

//Declaramos el puerto de nuestro servidor
const server = app.listen(8080, ()=>console.log("Listening :)")); 
//iniciamos indicandole con el pueerto
const io = new Server(server); //modulo socket.io

const message = [];

//la propiedad .on escucha los evento del servidor | conexion del servidor 
io.on('connection', socket =>{
    //usamos socket porque al hacerlo de esta forma estamos manipulando el socket recien ingrado | si usamos io, le manipulamos todo los usuarios conectados
    socket.emit('logs', message); //le mandamos los mensajes anterios al usuario que se acaba de ingresar
    //cuando haya un evento de conexion se realiza esto
    console.log('socket connected');
    //Creamos el on del emit message del cliente
    socket.on('message', data=>{
        message.push(data);
        io.emit('logs', message); //Envia unicamente al socket | colocamos io.emit para que le llegue a todos los usuarios
    })
    socket.on('authenticated', data =>{
        /*********
         * socket : es el usuario propio, el que realiza el evento
         * io : es usa para indicarle a todos los usuarios conectados
         * broadcast : se usa para modificar a todos los usuarios menos el que realiza el evento 
         **/
        socket.broadcast.emit('newUserConnected',data);
    })
})