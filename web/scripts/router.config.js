app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('inicio', {
      url: "/",
      templateUrl: "vistas/inicio.html",
      //controller: "inicioController",
      //controllerAs: "modelo"
    })
});