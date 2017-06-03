var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var index = require('./js/index.js');
var dir = require('./js/makePath.js');
var get = require('./js/serverCommonUtil.js');

//******************** //
// Make Function Part
// ********************//

var d = new Date();
var yymd = d.getFullYear() + '.' + d.getMonth() + '.' + d.getDate();

//******************** //
// Setting express config & page path.
// ********************//
var app = express();

//******************** //
// view engine setup
// ********************//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

//******************** //
// uncomment after placing your favicon in /public
// ********************//
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
  var fileName='', source=req.body.source;
	d = new Date();

	yymd = d.getFullYear() + '.' + d.getMonth() + '.' + d.getDate();
	importPart = source.split('|')[0];
	methodPart = source.split('|')[1];

	var logPath = 'log/' + yymd;
	dir.mkdir(logPath);

  if(fileName === ''){
    fileName = logPath + '/Solution.java';
  }

	source = get.completeSource(req, importPart, methodPart);

  var stream = fs.createWriteStream(fileName);
  stream.once('open', function(fd) {
  	stream.write(source);
  	stream.end();
  });

  var spawn = require('child_process').spawn;
  var opts = {stdio: 'inherit'} ;
  var javac = spawn('javac', ['-cp', logPath + '/Solution.class', '/usr/local/Java_Checker/'+ logPath +'/Solution.java'], opts);

  javac.on('close', function(code) {
		console.log('close:'+yymd);
    const exec = require('child_process').exec;
   	exec('java Solution totalTime', {cwd: './'+logPath}, (e, stdout, stderr)=> {
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

//******************** //
// catch 404 and forward to error handler
// ********************//
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//******************** //
// error handler
// ********************//
app.use(function(err, req, res, next) {
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
