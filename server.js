// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

var MikroNode = require('mikronode');

//Crear conexión reutilizable para mikrotik.
var createConnection = function(){
	var connection = MikroNode.getConnection('192.168.88.1', 'admin', '', { //configurar estos parámetros: "ip router, user, password"
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
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/users', function(req, res) {
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

router.get('/user/enable/:userId', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/set', ['=.id='+req.params.userId, '=disabled=no'])
		Promise.all([ chan1Promise ]).then(function resolved(values) {
			res.json({success:true});  
		}, function rejected(reason) {
			res.json({success:false, message: reason});   
		});
	});
});

router.get('/user/disable/:userId', function(req, res) {
	var connPromise = createConnection().getConnectPromise().then(function(conn) {
		var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/set', ['=.id='+req.params.userId, '=disabled=yes'])
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
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);