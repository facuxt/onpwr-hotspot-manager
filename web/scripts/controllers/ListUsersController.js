app.controller("ListUsersController",["$mdToast", "$http", function($mdToast, $http){

	var m = this;

	m.inicial = function(){
		$http.get("/api/users").success(function(data){
			m.users = data;
		})
	}
	m.stateUser = function(user){
		var action = 'disable';
		if(user.disabled=="true"){
			action='enable';
		}
		$http.get('/api/user/'+action+'/'+user['.id']).success(function(data){
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