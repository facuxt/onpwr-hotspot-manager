app.service('DataService', ['$http', '$q', function($http,$q){
	var modelo = this; 
	modelo.personas = [];
	modelo.especialistas = [];
	modelo.iniciado= false;
	modelo.turnos = [];



	modelo.recargarDatos = function(){
		//Traer persona
		var promesa = $q.defer();
		$http//usa un servicio para traer orto servicio 
			.get("datos/personas.json")
			.success(function(data){
				modelo.personas= data;
			$http
				.get("datos/especialistas.json")
				.success(function(data){
					modelo.especialistas= data // este es el resultado de la function
				$http
					.get("datos/turnos.json")
					.success(function(data){
						modelo.turnos= data; // este es el resultado de la function
						modelo.iniciar=true;
						promesa.resolve(data);

			/*.error(function(data){ })*/		

				})
			})
		//Traer Especialistas
		})

		return promesa.promise;
	}
	modelo.promesa =modelo.recargarDatos();
}])

