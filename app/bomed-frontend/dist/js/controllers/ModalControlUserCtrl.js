angular.module('app')

.controller('ModalControlUserCtrl', function($scope, $uibModalInstance, $http, cliente, AuthServ, MySocket){
   console.log( 'jjjffffff');
    $scope.cliente = cliente;
   
	$scope.ok = function(){
		
		
			alert('Presionaste');
			$uibModalInstance.close($scope.cliente);
			
		
		};
			  
	$scope.cerrar_se = function(datos){
       

       $scope.id= datos.id;

       console.log($scope.id, 'jjjjj');


        MySocket.emit('cierra_ su_sesion',  $scope.id);
        
      MySocket.on('sesion_cerrada', function(datos){
    	console.log(datos);
      })


	};
			
	
	
	

	$scope.cancel = function () {
	   $uibModalInstance.dismiss('cancel');
	}; 
});