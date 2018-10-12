angular.module('app')


.controller('preguntasCtrl', function($scope, $filter, $http, $location, $anchorScroll, toastr){
	console.log('dfvsd');
   $scope.mostrando 	= false;
    $scope.mostrando_edit = false;
	$scope.boton1 		= true;
	$scope.usuarios		= {};
	$scope.preg_edit 	= {};
	$scope.preguntas 	= {};
	$scope.pruebas 		= {};
	$scope.preg_nueva 	= { 
		definicion: '',
		tipo: 		'Multiple'
	};
	
	$location.hash('');
	
	
	// Editor options.
	$scope.options = {
		language: 'es',
		allowedContent: true,
		entities: false
	};

        

	$scope.traer_datos= function(){


		$http.get('::preguntas').then (function(result1){
			
			$scope.preguntas = result1.data ;

			console.log('Se trajo los datos con exito', result1);
		}, function(error){
			console.log('No se pudo traer los datos', error);

		})
		
		$http.get('::pruebas').then (function(result2){

			$scope.pruebas 					= result2.data ;
			$scope.preg_nueva.prueba_id 	= $scope.pruebas[0].rowid;

		}, function(error){
			console.log('No se pudo traer los datos', error);

		})
	}

	$scope.traer_datos();

	$scope.mostrar_crear = function(){

		$scope.mostrando= true;
		$scope.boton1= false;
		$scope.mostrando_edit= false

		$location.hash('crear-pregunta-div');
    	$anchorScroll();
	
	};

	
	
	$scope.salir_crear = function(){
		$location.hash('');
		$scope.mostrando= false
	};

	$scope.salir_editar = function(){
		$location.hash('');
		$scope.mostrando_edit= false
	};
	
	
  	$scope.insertarAsk = function(crea){
        
        $scope.mostrando = false;
  		
  		if (crea.definicion == '' || crea.definicion == undefined) {
  			toastr.error('Debe escribir la definición');
  			return;
  		}

  		if (crea.correcta == '' || crea.correcta == undefined) {
  			toastr.error('Debe escribir la respuesta correcta');
  			return;
  		}
       
  		$http.get('::preguntas/insertar', {params: {definicion: crea.definicion, tipo: crea.tipo, prueba_id: crea.prueba_id, opc_a: crea.opc_a, opc_b: crea.opc_b, opc_c: crea.opc_c, opc_d: crea.opc_d, correcta: crea.correcta  }  }).then (function(result){
	       toastr.success('Se ha insertado la pregunta con éxito')
           
	       $scope.traer_datos();
	        console.log('Se insertaron los datos con exito', result);
	        
	    }, function(error){
	       console.log('No se pudo insertar los datos', error);

	    })

	         
	};
  
    $scope.editarP = function(cambia){
        
        $scope.mostrando = false;
        $scope.mostrando_edit= true;
		
		$scope.pregunta = cambia;

		$location.hash('editar-pregunta-div');
    	$anchorScroll();
	

      for (var i = 0; i < $scope.preguntas.length; i++) {
			$scope.preguntas[i].editando = false;
		}
		cambia.editando = true; 
	


    
    };
    $scope.editarAsk = function(cambia){
	           
		$http.get('::preguntas/editar',  {params: {definicion: cambia.definicion, tipo: cambia.tipo, prueba_id: cambia.prueba_id, opc_a: cambia.opc_a, opc_b: cambia.opc_b, opc_c: cambia.opc_c, opc_d: cambia.opc_d, correcta: cambia.correcta, rowid: cambia.rowid }}).then (function(result){
	
			toastr.success('Se ha editado la pregunta con éxito')
			$scope.traer_datos();
			$scope.pregunta 		= {}
			$scope.mostrando_edit	= false;
		}, function(error){
			console.log('No se pudo actualizar los datos', error);
		})

	};
   
   
    $scope.eliminar_ask = function(rowid){
	    
	    $http.delete('::preguntas/eliminar', {params: { id: rowid } }).then (function(result){
			toastr.success('Se ha borrado la pregunta con éxito')
            $scope.traer_datos();
		}, function(error){
			console.log('No se pudo borrarlos datos', error);

		})

             


    }

  

});

