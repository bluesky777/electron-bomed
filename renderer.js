// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

require('dotenv').config();
const path          = require('path');
const express       = require('express');
const app           = express();
var cors            = require('cors');
var http            = require('http').Server(app);
var io              = require('socket.io')(http);
var bodyParser      = require('body-parser');
var img_folder    	= require('os').homedir();


process.env.JWT_SECRET = 'FB2ywB21v60UosPDYcO7HiVQkQZcFhbQ';

if (!process.env.NODE_PORT) {
	process.env.NODE_PORT = 8787;
}



app.use(cors());
app.use(bodyParser.json()); // Para recibir json desde Angular
app.use("/app/bomed-frontend/dist", express.static(path.join(__dirname, 'app/bomed-frontend/dist')));
app.use("/images", express.static(path.join(__dirname, 'app/images')));
app.use("/images", express.static(path.join(img_folder + '/images_bomed')));
app.use('/api', require('./app/controllers/routes'));


app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/', function(req, res){
    res.writeHead(301,
        { Location: 'app/bomed-frontend/dist' }
    );
    res.end();
});
    


self 		  = this;
self.io 	= io;

var count_clients = 0;
var all_clts 		  = [];
var info_evento 	= {
        examen_iniciado: 		  false, 
        preg_actual: 			    0,
        free_till_question: 	-1,
        puestos_ordenados: 		true
    };


http.listen(process.env.NODE_PORT, function(){
  console.log('listening on *:'+process.env.NODE_PORT);
});





self.io.on('connection', (socket)=> {
  console.log('New connection: '+socket.id);

  count_clients++;

  datos 					    = {};
  datos.logged 			  = false;
  datos.registered 		= false;
  datos.resourceId		= socket.id;
  datos.categsel			= 0;
  datos.respondidas		= 0;
  datos.correctas			= 0;
  datos.tiempo			  = 0;
  datos.nombre_punto		= 'Punto_' + count_clients;
  datos.user_data 		= {};
  socket.datos 			= datos;

  all_clts.push(socket.datos);

  setTimeout(function(){
    socket.emit('te_conectaste', {datos: socket.datos});
    socket.broadcast.emit('conectado:alguien', {clt: socket.datos} );
  }, 500);

  
  socket.on('mensaje', (data)=>{
    if (data.nombre_punto) {
        socket.datos.nombre_punto = data.nombre_punto;
    }
    if (data.registered) {
        socket.datos.registered = data.registered;
    }
    
    for(var i=0; i < all_clts.length; i++){
        if (all_clts[i].resourceId == socket.id) {
            all_clts.splice(i, 1, socket.datos);
        }
    }
    
    datos = {nombre_punto: socket.datos.nombre_punto, resourceId: socket.id, registered: socket.datos.registered };
    self.io.sockets.emit('reconocido:punto:registered', datos );
  });

  
  socket.on('disconnect', function (data){

    for (let i = 0; i < all_clts.length; i++) {

      if (all_clts[i].resourceId == socket.id) {
        all_clts.splice(i, 1);
        
      }
    }
    
    self.io.sockets.emit('client_disconnected',  {sockect_id: socket.id} );
  });

  
  socket.on('traer_clientes', (data)=>{
    
    socket.emit('clientes_traidos', all_clts );
  });


  socket.on('empezar_examen', function(data){
    info_evento.examen_iniciado 	= true;
  

    if(data){
        if(data.puestos_ordenados){
            info_evento.puestos_ordenados 	= data.puestos_ordenados;
        }
    }
    
    for (var i = 0; i < all_clts.length; i++) {
      if (all_clts[i].user_data.tipo == 'Usuario') {
         io.to(all_clts[i].resourceId).emit('empezar_examen');
      }
    }

  });

  socket.on('empezar_examen_cliente', function(data){
      socket.broadcast.to(data.resourceId).emit('empezar_examen'); 
  });

  socket.on('set_my_examen_id', (data)=> {
      socket.datos.examen_actual_id = data.examen_actual_id;

      for (var i = 0; i < all_clts.length; i++) {
          if (all_clts[i].resourceId == socket.id) {
              all_clts.splice(i, 1, socket.datos);
          }
      }
  });


  socket.on('loguear', (data)=> {

    datos               = {};
    datos.logged        = true;
    datos.registered    = data.registered?true:false;
    datos.resourceId    = socket.id;
    datos.puntos        = 0;
    datos.tiempo        = 0;
    datos.correctas     = 0;
    datos.respondidas   = 0;
    datos.nombre_punto  = data.nombre_punto?data.nombre_punto:socket.datos.nombre_punto;
    datos.user_data     = data.usuario;
    socket.datos        = datos;

    for (var i = 0; i < all_clts.length; i++) {
      if (all_clts[i].resourceId == socket.id) {
        all_clts.splice(i, 1, socket.datos);
      }
    }
    //console.log('loguear2', all_clts);

    socket.broadcast.emit('logueado:alguien', {clt: socket.datos} );

    
  });

  

  socket.on('cerrar_su_sesion', function(data){
     
      for (var i = 0; i < all_clts.length; i++) {
          if (all_clts[i].resourceId == data.resourceId) {
           
            io.to(all_clts[i].resourceId).emit('sesion_A_cerrar');
          }
      }


  });

  socket.on('llevar_espectadorU', function(){

    for (var i = 0; i < all_clts.length; i++) {
      if (all_clts[i].user_data.tipo == 'Espectador') {
         
         io.to(all_clts[i].resourceId).emit('llevelos_espectadoresU');
      }
    }


  });


  socket.on('traer_participantes', function(data){

    partis = []; 
    
    for (var i = 0; i < all_clts.length; i++) {
       if (all_clts[i].user_data.prueba_id) {
          
          partis.push(all_clts[i]);

        }
    }


    socket.emit('llevar_participantes',  partis );
    
  });

  
  socket.on('empezar_examen', function(data){
    info_evento.preg_actual = 0;
    socket.broadcast.emit('empezar_examen');
    info_evento.examen_iniciado = true;
    info_evento.preg_actual++;
    dato_actual = info_evento.preg_actual;
    socket.emit('preg_actual', {preg_actual: dato_actual});
  });
  
  socket.on('next_question', function(data){
    
    socket.broadcast.emit('next_question');
    info_evento.preg_actual++;
    dato_actual = info_evento.preg_actual;
    socket.emit('preg_actual', {preg_actual: dato_actual});
   
  });

  socket.on('next_question_only', function(data){
    for (var i = all_clts.length - 1; i >= 0; i--) {
      if (all_clts[i].resourceId == data.cliente.resourceId){
        socket.to(all_clts[i].resourceId).emit('next_question_only', data.cliente); 
      }
    }
   
    
  });

  
  socket.on('contesto_mal/bien', function(data){
    
    socket.datos.answered 		= data.correcta;
		socket.datos.respondidas++;
		socket.datos.tiempo 		  = socket.datos.tiempo + data.tiempo;
		if (data.correcta == 1) {
			socket.datos.correctas++;
			socket.datos.puntos 	= socket.datos.puntos + data.puntos;
		}

    participante  = {};
    codigo        = socket.id;

		for (var i = 0; i < all_clts.length; i++) {
			if(all_clts[i].resourceId === codigo){
        console.log(all_clts[i].resourceId, socket, (all_clts[i].resourceId == socket.id));
				all_clts[i] 	= socket.datos;
				participante 	= all_clts[i];
			}
    }
    
		for (var i = 0; i < all_clts.length; i++) {

				if(all_clts[i].user_data.tipo == 'Espectador' || all_clts[i].user_data.tipo == 'Admin'){
					socket.broadcast.to(all_clts[i].resourceId).emit('respondido', { resourceId: socket.id, cliente: participante, clientes: all_clts });
				}
		}

  });


  socket.on('mostrar_pregunta', function(data){
    console.log('mostrar_pregunta', data);
    for (var i = 0; i < all_clts.length; i++) {
          if (all_clts[i].user_data.tipo == 'Espectador') {

            io.to(all_clts[i].resourceId).emit('sc_mostrar_pregunta', {pregunta: data.pregunta});

          }
      }
  });

  socket.on('mostrar_puestos', function(data){
    console.log(data);
    for (var i = 0; i < all_clts.length; i++) {
          if (all_clts[i].user_data.tipo == 'Espectador') {

            io.to(all_clts[i].resourceId).emit('sc_mostrar_puestos', {examenes: data.examenes});

          }
      }

  });

  socket.on('mostrar_puesto', function(data){
    console.log(data);
    for (var i = 0; i < all_clts.length; i++) {
          if (all_clts[i].user_data.tipo == 'Espectador') {

            io.to(all_clts[i].resourceId).emit('sc_mostrar_puesto', { examen: data.examen });

          }
      }

  });



  socket.on('limpiar_pantalla', function(){
    for (var i = 0; i < all_clts.length; i++) {
          if (all_clts[i].user_data.tipo == 'Espectador') {
            

            io.to(all_clts[i].resourceId).emit('limpie_pantalla');

          }
      }
  });

  socket.on('abrirle_la_sesion', function(data){
      
     for (var i = 0; i < all_clts.length; i++) {
          if (all_clts[i].resourceId == data.resourceId) {
            user =  {username: data.username, password: data.password, nombre_punto: data.nombre_punto}  
            
            io.to(all_clts[i].resourceId).emit('a_abrir_sesion', user  ); 
          };
      };

  });

  socket.on('liberar_hasta_pregunta', function(data){
      info_evento.free_till_question 	= data.numero;
      info_evento.preg_actual 		    = data.numero;
      socket.broadcast.emit('set_free_till_question', { free_till_question: data.numero }); 
  });

  socket.on('hasta_que_pregunta_esta_free', function(data){
      socket.emit('set_free_till_question', { free_till_question: info_evento.free_till_question }); 
  });

  socket.on('set_puestos_ordenados', function(data){
      console.log('set_puestos_ordenados');
      info_evento.puestos_ordenados 		= data.puestos_ordenados;
      socket.broadcast.emit('set_puestos_ordenados', { puestos_ordenados: data.puestos_ordenados }); 
  });



  socket.on('toma_mis_datos', (data)=>{
    

    for (var i = 0; i < all_clts.length; i++) {
      if (all_clts[i].resourceId == socket.id){
        
        all_clts[i].user_data = data.usuario;
       

        all_clts[i] = Object.assign({}, all_clts[i], data.usuario);
        socket.broadcast.emit('alguien_logueado', all_clts[i]);
        
        console.log('Alguien se logueó ' , all_clts);
      }
    }

  });



});
