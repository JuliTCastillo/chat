const socket = io({
    autoConnect:false //lo conecta al servidor siempre y cuando se identefique
}); //conexion del cliente
//creamos una variable para el chatbox
const chatBox = document.getElementById('chatBox');
let user;

Swal.fire({
    title: 'Identificate',
    input : 'text',
    text: 'Ingresa el nombre de usuario que tendra en el chat',
    inputValidator: (value) => {
        return !value && 'Necesitas colocar un usuario valido para proseguir!'
    },
    allowOutsideClick:false, //Desabilitamos que el alert se vaya si hay un clic fuera
}).then(result =>{ //El then es lo que obtenemos cuando tenemos un resultado y queremos hacer algo con eso
    user = result.value;
    socket.connect(); //Conectamos al usuario al socket
    socket.emit('authenticated', user); //Cremos un emit en donde le mandamos el usuario
    console.log(user)
})

chatBox.addEventListener('keyup', evt =>{ //keyup evento de teclas
    if(evt.key === 'Enter' || evt.keyCode ===13){
        if(chatBox.value.trim().length>0){ //eliminamos los espacios del mensaje
            //Emite un evento del socket | por cada emit tiene que haber un on que lo escuche
            socket.emit('message', {user, message: chatBox.value.trim()});
            chatBox.value = ''; //51:28
        }
    }
})

//Socket listeners
//Creamos este socket.on para que escuche el emit del servidor
socket.on('logs', data =>{
    //data es el array que le mandamos desde app.js
    const logsPanel = document.getElementById('logsPanel');
    let message = '';
    data.forEach(msg => {
        //guardamos en un la variable el nombre del usuario y el mensaje envia
        message += `${msg.user} dice: ${msg.message} <br/>`
    });
    logsPanel.innerHTML = message;
})
socket.on('newUserConnected', data =>{
    if(!user) return;//si no esta autentificado no le mostramos el mensaje
    Swal.fire({
        toast:true,
        position:'top-end',
        showConfirmButton: false,
        timer:2000,
        title: `${data} se ha unido al chat`,
        icon:'success'
    })
})