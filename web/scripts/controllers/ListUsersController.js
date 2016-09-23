app.controller("ListUsersController",["$mdToast", "$http", '$scope', function($mdToast, $http, $scope){

	var m = this;
	var token = {}
	token['x-access-token'] = $scope.token;
	m.inicial = function(){
		$http({
			url: "/api/users",
			method: "get",
			headers: token
		}).success(function(data){
			m.users = data;
		})
	}
	m.stateUser = function(user){
		var action = 'disable';
		if(user.disabled=="true"){
			action='enable';
		}
		$http({
			url: '/api/user/'+action+'/'+user['.id'],
			method: "get",
			headers: token
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
	m.floor= function(qty){
		return Math.floor(qty);
	}
	
	m.inicial();
}])