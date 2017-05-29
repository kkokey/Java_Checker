var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var index = require('./js/index.js');

//******************** //
// Make Function Part
// ********************//

var d = new Date();
var yymd = d.getFullYear() + '.' + d.getMonth() + '.' + d.getDate();

const dir = {
	mkdir: (x) => {
		fs.mkdir(
			x, 
			[0o777],		// What's mean this? 
			function(rs){
				console.log('Make folder :[' + yymd +']');
				return rs;
		});
	}
}

//******************** //
// Setting express config & page path.
// ********************//
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//******************** //
// Setting url path link.
// ********************//
app.use('/js', express.static(__dirname + '/js'));
app.use('/', index);
app.post('/file', function(req, res){
	var importPart='', methodPart='';
  var fileName = '', source = req.body.source;
	yymd = d.getFullYear() + '.' + d.getMonth() + '.' + d.getDate();
	importPart = source.split('|')[0];
	methodPart = source.split('|')[1];
  const add = {
    classHeader: (x) => { return importPart + '\n' + 'public class Solution {\n' + x + '\n}'; }
  }

	dir.mkdir(yymd);

  if(fileName === ''){
    fileName = yymd + '/Solution.java';
  }
  if(source === ''){
    source = ''
    +'public static void main(String[] args) {\n'
    +'  totalTime();'
    +'}\n\n'
    +'public static long totalTime(){\n'
  	+'	long startTime = System.currentTimeMillis();\n'
  	+'	System.out.println(reAlignString("String size check test!"));\n'
  	+'	long endTime   = System.currentTimeMillis();\n'
  	+'	long totalTime = endTime - startTime;\n'
  	+'	System.out.println(totalTime);\n'
    +'\n'
    +'  return totalTime;\n'
  	+'}\n\n'
    +'\n'
    +'public static int getSize(String strData){\n'
    +'  return strData.length();\n'
    +'}\n\n'
    +'public static String reAlignString(String strData){\n'
    +'  int i=0, len=getSize(strData);\n'
    +'  StringBuffer strBuf = new StringBuffer();\n'
    +'  for(i=0; i \< len; i++){\n'
    +'    strBuf.append(strData.substring((len-i-1), (len-i)));\n'
    +'  }\n'
    +'  return strBuf.toString();\n'
    +'}\n';
  }else{
    source = ''
    +'public static void main(String[] args) {\n'
    +'  totalTime();'
    +'}\n\n'
    +'public static long totalTime(){\n'
  	+'	long startTime = System.nanoTime();\n'
    + req.body.runCommand
  	+'	long endTime   = System.nanoTime();\n'
  	+'	long totalTime = endTime - startTime;\n'
  	+'	System.out.println(totalTime);\n'
    +'\n'
    +'  return totalTime;\n'
  	+'}\n\n'
    +'\n'
    + methodPart;
  }

  source = add.classHeader(source);
  source = source.split('\n').join(' ');
  source = source.split('\u00a0').join(' ');

  var stream = fs.createWriteStream(fileName);
  stream.once('open', function(fd) {
  	stream.write(source);
  	stream.end();
  });

  var javaa;
  var returnVal;
  var spawn = require('child_process').spawn;
  var opts = {stdio: 'inherit'} ;
  var javac = spawn('javac', ['-cp', yymd + '/Solution.class', '/usr/local/Java_Checker/'+ yymd +'/Solution.java'], opts);

  javac.on('close', function(code) {
    const exec = require('child_process').exec;
   	exec('java Solution totalTime', {cwd: './'+yymd}, (e, stdout, stderr)=> {
			process.chdir(yymd);
      if (e instanceof Error) {
     	  console.error(e);
      }
      // console.log('stdout ', stdout);
      var result = stdout;

   	  // console.log('stderr ', stderr);
      res.render('file', {'result':result});
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('not find');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log('default error');
	console.log(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
	res.render('file', {'result':err});
//  res.render('error');
});

module.exports = app;
