angular.module('app')


.controller('ControlCtrl', function($scope, $filter, MySocket, $uibModal, toastr){
  $scope.mostrando = false;
  $scope.boton1 	= true;
  $scope.clientes = [];


  $scope.actualizarClientes = function(){
    MySocket.emit('traer_clientes');
  }
    
   
  MySocket.on('alguien_logueado', function(datos){
    console.log(datos, 'ertyuytr')
    $scope.actualizarClientes();
    if (datos.tipo == 'Admin') 
     { toastr.success('Alguien ha ingresado al sistema');
     } 
    
  });
    

  MySocket.on('client_disconnected', function(datos){
    $scope.actualizarClientes();
  });
    

  MySocket.on('conectado:alguien', function(datos){
    $scope.actualizarClientes();
  });
    

  MySocket.emit('traer_clientes');
     

  MySocket.on('clientes_traidos',function(res){
    $scope.clientes = res ;
  });
      



  $scope.OpenModalUser = function (cliente) {

    var modalInstance = $uibModal.open({
      templateUrl: 'views/ModalControlUser.html',
      controller: 'ModalControlUserCtrl',
      animation: false,
      resolve: {
          cliente: function () {
            return cliente;
          }
      },
    });
        
    modalInstance.result.then(function (clientes) {
      console.log(clientes);
    
    });
  
  };
    



})

.controller('ModalControlUserCtrl', function($scope, $uibModalInstance, $http, cliente, AuthServ, MySocket, toastr){

    $scope.cliente = cliente;

    $scope.cliente_existe = false;

    if ($scope.cliente.user_data.rowid) {
      $scope.cliente_existe = true;

    }else{

       $http.get('::usuarios_de_control').then (function(result){
        $scope.usuarios = result.data ;
        console.log('Se trajo los datos con exito', result);
      }, function(error){
        console.log('No se pudo traer los datos', error);

      })

    }


    $scope.ok = function(){
        
      $uibModalInstance.close($scope.cliente);  
   
    };
            
    $scope.cerrar_se = function(datos){  

      
      MySocket.emit('cerrar_su_sesion', datos);
      toastr.success('Se ha cerrado la sesión con éxito')
           
    };

    $scope.put_user = function(user){  
      console.log('usuario', user);
      
      data = {username: user.username , password: user.password, nombre_punto: $scope.cliente.nombre_punto};
      
      MySocket.emit('abrirle_la_sesion', data);
    };
          
    $scope.cancel = function () {
        
      $uibModalInstance.dismiss('cancel');

    }; 
});