/*
  common.js start ===
*/

$(document).ready(function(){
  $('#method').click(function(){ resetData(this); });
  $('#import').click(function(){ resetData(this); });
  $('#command').click(function(){ resetData(this); });
  $('#analysis').click(function(){ analysis(); });

  // set default example value
  $('#sample').click(function(){ setTestDefaultVal(); });

});

function resetData(dom){
  var clsName = $(dom)[0].className;
  if(clsName.indexOf('first') > 0){
    $(dom).html('');
    $(dom).removeClass('first');
  }else{
    //$(dom).html('');
  }
}

function getInputCommand(){
  var runCommand = $('#command')[0].innerText;
  return runCommand;
}

function getInputSource(){
  var importSource = $('#import')[0].innerText;
  var methodSource = $('#method')[0].innerText;
  return importSource + '|' + methodSource;
}

function analysis(){
  var data = {'source': getInputSource(), 'runCommand': getInputCommand()};
  var type = 'POST';
  var url = location.origin+'/file';
  $('#result')[0].innerText = 'loading... please wait.';
  $.ajax({
    url: url,
    type: type,
    data: data,
    cache: false,
    async: true,
    datatype: 'application/json; charset=utf-8',
    error : function(error) {
        console.log("Error!");
    },
    success : function(data) {
        console.log("success!");
        data = data.split('\n').join('');
        $('#result')[0].innerText = data + ' (ns)';
    },
    complete : function() {
        console.log("complete!");
        // connect db and write log data..
    }
  });
}

function writeFile(){
  // var runJava = require('./runJava.js');
  writeFileTest('');
}

function resetAllData(){
  resetData($('#method'));
  resetData($('#import'));
  resetData($('#command'));
  resetData($('#result'));
}

function setTestDefaultVal(){
  resetAllData();

  var defaultValue = $('<div></div>');

  defaultValue.append('public static int getSize(String strData){')
  .append('<br/>')
  .append('  return strData.length();')
  .append('<br/>')
  .append('}')
  .append('<br/>')
  .append('<br/>')
  .append('public static String reAlignString(String strData){')
  .append('<br/>')
  .append('  int i=0, len=getSize(strData);')
  .append('<br/>')
  .append('  StringBuffer strBuf = new StringBuffer();')
  .append('<br/>')
  .append('  for(i=0; i \< len; i++){')
  .append('<br/>')
  .append('    strBuf.append(strData.substring((len-i-1), (len-i)));')
  .append('<br/>')
  .append('  }')
  .append('<br/>')
  .append('  return strBuf.toString();')
  .append('<br/>')
  .append('}');

  $('#method')[0].innerHTML = defaultValue[0].innerHTML.split(' ').join('&nbsp;');

  $('#command')[0].innerHTML = 'reAlignString("To string data align test which this method ");';

}

/*
  common.js end ===
*/
