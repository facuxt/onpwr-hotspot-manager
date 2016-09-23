// src interface
/* jshint undef: true */
/* globals Promise */
var MikroNode = require('mikronode');

var connection = MikroNode.getConnection('192.168.88.1', 'admin', '', {
  closeOnDone : true
});
connection.on('error', function(err) {
    console.error('Error: ', err);
});

var connPromise = connection.getConnectPromise().then(function(conn) {
  var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/print', ["?name=SIPBA"]);
  //var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/set', ['=.id=*1', '=disabled=no']);  //Habilitar usuario ID 1
  Promise.all([ chan1Promise ]).then(function resolved(values) {
    var user = values[0][0];
    var command = ['=.id='+user[".id"], '=disabled=no'];
    console.log("COMANDO"+JSON.stringify(command));
    var connection2 = MikroNode.getConnection('192.168.88.1', 'admin', '', {
      closeOnDone : true
    });
    
    var connPromise2 = connection2.getConnectPromise().then(function(conn) {
      var ch1 = conn.getCommandPromise('/ip/hotspot/user/set', command);
      //var chan1Promise = conn.getCommandPromise('/ip/hotspot/user/set', ['=.id=*1', '=disabled=no']);  //Habilitar usuario ID 1
      Promise.all([ ch1 ]).then(function resolved(values) {
          console.log("worked");
      }, function rejected(reason) {
        console.log('Oops: ' + reason);
      });
    });
  }, function rejected(reason) {
    console.log('Oops: ' + reason);
  });
});
