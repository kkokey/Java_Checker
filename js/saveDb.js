var mysql = require('mysql');
var connection = mysql.createConnection({
	host : '127.0.0.1',
	user : 'user',
	password : 'user'
});

connection.connect(function(err)){
	if(err){
		console.error('error connection: '+ err.stack);
		return;
	}
	console.log('connected as id '+ connection.threadId);
}



exports.module.saveDb = {}
