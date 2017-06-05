
const addJavaSource = {
  classHeader: (x,importPart) => { return importPart + '\n' + 'public class Solution {\n' + x + '\n}'; },
  funcCustomHeader: (req, methodPart) => {
    var source = ''
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
    return source;
  }
}

const get = {
  completeSource: (req, importPart, methodPart) => {
    var source = '';
    source = addJavaSource.funcCustomHeader(req, methodPart);
    source = addJavaSource.classHeader(source, importPart);
    source = source.split('\n').join(' ');
    source = source.split('\u00a0').join(' ');

    return source;
  }
}

module.exports = get;
