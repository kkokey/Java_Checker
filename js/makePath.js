var fs = require('fs');

const dir = {
  mkdir: (x) => {
	  fs.mkdir(
		  x,
			[0o777],    // What's mean this?
			function(rs){
			  //console.log('Make folder :[' + yymd +']');
				console.log(rs);
				return rs;
		});
	}
}

module.exports = dir;
