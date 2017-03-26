var app = angular.module("app",['ui.router','ngMessages','ngCookies', 'ngMaterial']);

app.factory('httpInterceptor', function($q, $injector, $rootScope, $cookies) {
    return {
        request: function(config) {
            //console.log(JSON.stringify(config));
            if($cookies.get("token")){
            	config.headers['x-access-token'] = $cookies.get("token");
            }
            return config;
        },
        response: function(response) {
            // do something on success
            // $rootScope.hadPreviousRetry = undefined;
             return response;
        },
      responseError: function(rejection) {
      	var stateService = $injector.get('$state');
        //var mdDialog = $injector.get('$mdDialog');
        //var $sessionStorage = $injector.get('$sessionStorage');
        var $state = $injector.get('$state');

        if (rejection.status === 401) {
           


            $state.go("inicio");
            return $q.reject(rejection);
            //END BYPASS

            //TODO Abrir dialogo cuando se detecta que el token está vencido, y mandar al login cuando no se detecta sesion anterior.
            // rejection.config.headers.Authorization = $localStorage.token;
            // if(!$rootScope.hadPreviousRetry){
            //     $rootScope.hadPreviousRetry=1;
            //     return $http(rejection.config);
            // }else{
            //     $rootScope.hadPreviousRetry = undefined;
            //     $state.go("access.signin");
            //     return $q.reject(rejection);
            // }

        }else if(rejection.status=== 403){
            $state.go("inicio");
        } else if (rejection.status === 302||rejection.status === 0) {
            location.reload();
        }else{
            alert("Se detectó un error al tratar de llamar al servicio \""+rejection.config.url+"\": ERROR "+rejection.status);
        }
        return $q.reject(rejection);
      }
    };
  });

app.config(['$httpProvider', function($httpProvider) {
		//Http Intercpetor to check auth failures for xhr requests
		$httpProvider.interceptors.push('httpInterceptor');
}]);
