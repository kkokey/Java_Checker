var fs = require('fs');

const dir = {
  mkdir: (x) => {
	  fs.mkdir(
		  x,
			[0o777],    // What's mean this?
			function(rs){
				if(rs !== null && rs.code == 'EEXIST'){
					console.log('Already Make folder.');
				}else{
          console.log('=======================');
          console.log(rs);
          console.log('=======================');
				}
				return rs;
		});
	}
}

module.exports = dir;
