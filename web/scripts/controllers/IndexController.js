app.controller("IndexController",["$mdDialog", "$http", function($mdDialog, $http){
  $mdDialog.show({
      controller: DialogController,
      templateUrl: 'vistas/modal-login.html',
      parent: angular.element(document.body),
      clickOutsideToClose:false,
    })
    .then(function(answer) {
     
    }, function() {
  
  });

  function DialogController($scope, $mdDialog, $http, $rootScope, $mdToast, $state) {
    $scope.login = function(){
        $http({
          url: '/session/login',
          data: {
            name: $scope.name,
            password: $scope.password
          },
          method: "post"
        }).success(function(data){
            if(data.success){
              $rootScope.token = data.token;
              $mdDialog.hide();
              $state.go("listUsers")
            }else{
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Usuario o clave incorrectas, compruebe e intentelo nuevamente')
                  .hideDelay(3000)
              );
            }
        })
    }
  }
}])