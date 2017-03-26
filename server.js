// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser 	= require('body-parser');
var config 		= require('./config'); // get our config file
var jwt    		= require('jsonwebtoken');
var MikroNode   = require('mikronode');


//setear globales
app.set('secret', config.secret);
app.set('adminUsr', config.adminUsr);
app.set('arpInterface', config.arpInterface);

//Crear conexión reutilizable para mikrotik.
var createConnection = function(){
	var connection = MikroNode.getConnection(config.router_ip, config.router_user, config.router_password, { //configurar estos parámetros: "ip router, user, password"
	  closeOnDone : true
	});
	connection.on('error', function(err) {
	    console.error('Error: ', err);
	});
	return connection;
}
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('web'));

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var sessionRoutes = express.Router();              // get an instance of the express Router
var apiRoutes = express.Router();              // get an instance of the express Router

// LOGIN 
sessionRoutes.post('/login', function(req, res) {
	console.log("Intentando loguearse")
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/print');
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			var users = values[0];
			for(var i in users){
				var user = users[i];
				//console.log("usuario invalido")
				if(req.body.name==app.get('adminUsr') && user.name==req.body.name && user.password == req.body.password){
					var token = jwt.sign(user, app.get('secret'), {
						expiresIn: 3600 // expires in 1 hour (seconds)
			        });
					console.log("usuario valido, iniciando")

			        // return the information including token as JSON
			        res.json({
						success: true,
						message: 'Enjoy onpwr',
						token: token
			        });  

				}
			}
			res.json({
				success: false,
				message: 'Usuario o contraseña inválida',
        	});  
		}, function rejected(reason) {
			console.log('Oops: ' + reason);
		});
	});
})

apiRoutes.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('secret'), function(err, decoded) {			
			if (err) {
				return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
});

apiRoutes.get('/users', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/print');
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			var users = values[0];
			res.json(users);			
		}, function rejected(reason) {
			console.log('Oops: ' + reason);
		});
	});
});


apiRoutes.get('/active', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/hotspot/active/print');
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			var users = values[0];
			res.json(users);			
		}, function rejected(reason) {
			console.log('Oops: ' + reason);
		});
	});
});

apiRoutes.post('/removeActive/:activeId', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/hotspot/active/remove', ['=.id='+req.params.activeId])
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			res.json({success:true});  
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});

apiRoutes.post('/userPassword/:userId', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/set', ['=.id='+req.params.userId, '=password='+req.body.newpass])
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			res.json({success:true});  
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});


apiRoutes.get('/user/enable/:userId', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/set', ['=.id='+req.params.userId, '=disabled=no'])
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			res.json({success:true});  
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});

apiRoutes.get('/user/disable/:userId', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/set', ['=.id='+req.params.userId, '=disabled=yes'])
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			res.json({success:true});   
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});
apiRoutes.get('/clients', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/arp/print');
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			var users = [];
			for(var i in values[0]){
				var val = values[0][i];
				if(val.interface == app.get('arpInterface') && val.comment.indexOf(".hidden")==-1){
					users.push(val);
				}
			}
			res.json(users);			
		}, function rejected(reason) {
			console.log('Oops: ' + reason);
		});
	});
});

apiRoutes.get('/client/enable/:userId', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/arp/set', ['=.id='+req.params.userId, '=disabled=no'])
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			res.json({success:true});  
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});

apiRoutes.get('/client/disable/:userId', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/arp/set', ['=.id='+req.params.userId, '=disabled=yes'])
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			res.json({success:true});   
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});

apiRoutes.get('/getQueueByAddress/:address', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/queue/simple/print')
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			var queue = false;
			for(var i in values[0]){
				var val = values[0][i];
				if(val.target.split('/')[0] == req.params.address){
					queue = val
				}
			}
			if(queue){
				res.json({success:true, response: queue});   
			}else{
				res.json({success:false, message: 'no se encontró un plan de velocidad para el cliente seleccionado'});
			}
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});
apiRoutes.get('/getQueueByName/:name', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/queue/simple/print')
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			var queue = false;
			for(var i in values[0]){
				var val = values[0][i];
				if(val.name == req.params.name){
					queue = values[0][i];
				}
			}
			if(queue){
				res.json({success:true, response: queue});   
			}else{
				res.json({success:false, message: 'no se encontró un plan de velocidad para el cliente seleccionado'});
			}
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});
apiRoutes.post('/changeQueue/:queueId', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/queue/simple/set', ['=.id='+req.params.queueId, '=max-limit='+req.body.maxLimit])
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			res.json({success:true});  
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/session', sessionRoutes)
app.use('/api', apiRoutes);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);