app.controller("ListUsersController",["$mdToast", "$http", '$scope','$mdDialog', function($mdToast, $http, $scope, $mdDialog){

	var m = this;
	m.inicial = function(){
		$http({
			url: "/api/users",
			method: "get",
		}).success(function(data){
			m.users = data;
		});
		$http({
			url: "/api/active",
			method: "get",
		}).success(function(data){
			m.active = {};
			for(var i in data){
				var session = data[i];
				if(m.active[session.user]== undefined){
					m.active[session.user] = [];
				}
				m.active[session.user].push(session);
			}
		})
	}
	m.stateUser = function(user){
		var action = 'disable';
		if(user.disabled=="true"){
			action='enable';
		}
		$http({
			url: '/api/user/'+action+'/'+user['.id'],
			method: "get"
		}).success(function(data){
			if(data.success){
				m.inicial();
				$mdToast.show(
			      $mdToast.simple()
			        .textContent('Accion ejecutada correctamente en el Router')
			        .hideDelay(3000)
			    );
			}else{
				$mdToast.show(
			      $mdToast.simple()
			        .textContent('ERROR: '+data.message)
			        .hideDelay(3000)
			    );
			}
		})
	}
	m.viewConnected = function(name){
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'vistas/dialog-connected.html',
			parent: angular.element(document.body),
			clickOutsideToClose:false,
			locals : {
				name: name,
				active: m.active[name],
				m: m
			}
	    })

		function DialogController($scope, $mdDialog, $http, $cookies, $mdToast, $state, name, active, m) {
			$scope.name = name;
			$scope.active = active;
			$scope.floor= function(qty){
				return Math.floor(qty);
			}
			$scope.hide = function() {
		      $mdDialog.hide();
		    };
			$scope.disconnect = function(id){
				$http({
			      url: '/api/removeActive/'+id,
			      method: "post"
			    }).success(function(data){
			        if(data.success){
						$mdToast.show(
							$mdToast.simple()
							  .textContent('Sesión borrada correctamente en el router')
							  .hideDelay(3000)
						);
						m.inicial();
			        }else{
			          $mdToast.show(
			            $mdToast.simple()
			              .textContent('Error '+data.message)
			              .hideDelay(3000)
			          );
			        }
			    })
			}
		}
	}

	m.editUser = function(user){
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'vistas/dialog-edit.html',
			parent: angular.element(document.body),
			clickOutsideToClose:false,
			locals : {
				user: user,
				m: m
			}
	    })
		function DialogController($scope, $mdDialog, $http, $mdToast, user, m, DataService) {
			$scope.user = user;
			$scope.speeds = DataService.speeds;
			$scope.currentSpeed = {}

			$http({
		    	url: '/api/getQueueByName/'+user.name,
		    	method: 'get'
		    }).success(function(data){
		    	if(data.success){
		    		$scope.currentSpeed = data.response['max-limit'];
		    		$scope.queueId = data.response['.id'];
		    	}else{
		    		$scope.hideSpeed = true;
		    	}
		    })

			$scope.floor= function(qty){
				return Math.floor(qty);
			}
			$scope.hide = function() {
				var found = false;
				for(var i in $scope.speeds){
					value = $scope.speeds[i].value
					if(value == $scope.currentSpeed){
						found=true;
					}
				}
				if(!found){
					$mdToast.show(
							$mdToast.simple()
							  .textContent('Seleccione una velocidad para continuar')
							  .hideDelay(3000)
					);
					return;
				}
				$http({
				  url: '/api/userPassword/'+user['.id'],
				  method: "post",
				  data: {
				  	newpass: user.password,
				  }
				}).success(function(data){
				    if(data.success){
						$scope.changeQueue();
						m.inicial();
				    }else{
				      $mdToast.show(
				        $mdToast.simple()
				          .textContent('Error '+data.message)
				          .hideDelay(3000)
				      );
				    }
				})
		      
		    };
		    $scope.changeQueue = function() {
		    	$http({
			      url: '/api/changeQueue/'+$scope.queueId,
			      method: "post",
			      data: {
			      	maxLimit: $scope.currentSpeed,
			      }
			    }).success(function(data){
			        if(data.success){
						$mdToast.show(
							$mdToast.simple()
							  .textContent('Cambios guardados correctamente')
							  .hideDelay(3000)
						);
						$mdDialog.hide();
						m.inicial();
			        }else{
			          $mdToast.show(
			            $mdToast.simple()
			              .textContent('Error '+data.message)
			              .hideDelay(3000)
			          );
			        }
			    })
		      
		    };
		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };
			
		}
	}
	m.floor= function(qty){
		return Math.floor(qty);
	}
	
	m.inicial();
}])