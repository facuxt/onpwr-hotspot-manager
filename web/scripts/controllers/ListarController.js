app.controller("AgregarEspecialistaController",["$state", "DataService", function($state, DataService){

	var m = this;
	m.especialistas = DataService.especialistas;
	m.especialidades= ["cardiologo", "clinico", "otorrinolaringologo", "oftalmólogo", "pediatra", "traumatologo"]
	
	m.inicial = function(){
		if(DataService.especialista){
			m.especialista = DataService.especialista;
		}else{
			m.especialista = {
				nombre: "",
				especialidad: "cardiologo",
				pacientesenEspera: [],
			};
		}
	}
	m.registrarEspecialista = function(){
		if(!m.especialista.id)
			m.especialista.id = new Date().getTime();
		m.especialistas.push(m.especialista);
		console.log(m.especialistas);
		if(m.especialista.editando){
			m.especialistas.splice(m.especialista.posicion,1);
			DataService.especialista = undefined;
			$state.go("listarEspecialistas")
		}
		m.especialista = {
			nombre: "",
		};
	}
	m.inicial();
}])
//un servicio rest es un servicio que envia cualquier tipo de imformacion
//ejemplo get, post, delete, put
//get trae un usuario especifico /usuario etc.