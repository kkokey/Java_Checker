'use strict';
//var fs = require('fs'); // node style
//import fs from 'fs';  // ES6 style

module.exports.writeFileTest = function(name, source){
  //var name = '', source = '';

  var fs = require('fs'); // node style

  const add = {
    classHeader: (x) => { return 'public class Solution {\n' + x + '\n}'; }
  }

  if(name === ''){
    name = 'Solution.java';
  }
  if(source === ''){
    source = ''
    +'public static void main(String[] args) {\n'
    +'  totalTime();'
    +'}\n\n'
    +'public static long totalTime(){\n'
  	+'	long startTime = System.currentTimeMillis();\n'
  	+'	System.out.println(getSize("String size check test!"));\n'
  	+'	long endTime   = System.currentTimeMillis();\n'
  	+'	long totalTime = endTime - startTime;\n'
  	+'	System.out.println(endTime);\n'
  	+'	System.out.println(startTime);\n'
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
  }

  source = add.classHeader(source);

  // var addInClass = x

  var javaa;
  var spawn = require('child_process').spawn;
  var opts = {stdio: 'inherit'} ;
  var javac = spawn('javac', ['-cp', 'Solution.class', '/usr/local/Java_Checker/Solution.java'], opts);

  //console.log(javac);

  /*
  javac.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  */

  javac.on('close', function (code) {
      if (code === 0) {
        javaa = spawn('java', ['Solution', 'totalTime()'], opts);
      }
  });

/*
  var makeJar = spawn('jar' ['cfm', 'Solution.jar', 'manifest.mf', 'Solution.class'], opts);

  makeJar.on('close', function (code){
    console.log(code);
  });
*/
  var stream = fs.createWriteStream(name);
  stream.once('open', function(fd) {
	stream.write(source);
	stream.end();
  });

};

this.writeFileTest('','');
