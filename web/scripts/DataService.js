app.service('DataService', ['$http', '$q', function($http,$q){
	var m = this; 
	
	m.speeds = [{
		name:"1MB",
		value: '512000/1000000'
	},{
		name:"2MB",
		value: '512000/2500000'
	},{
		name:"4MB",
		value: '1500000/4500000'
	},{
		name:"6MB",
		value: '2500000/6500000'
	}]
}])

