/*
 * CSSLint Windows Script Host (WSH) Command Line Interface
 */

//-----------------------------------------------------------------------------
// Prototype
//-----------------------------------------------------------------------------
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
      {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }

    return res;
  };
}
if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}
if (!Array.prototype.some)
{
  Array.prototype.some = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this &&
          fun.call(thisp, this[i], i, this))
        return true;
    }

    return false;
  };
}

//-----------------------------------------------------------------------------
// Windows Script Host Utility Fixes
//-----------------------------------------------------------------------------

//print for wsh
var print = function (strText) {
	return WScript.StdOut.Write(strText);
};

//readFile for wsh
var readFile = function (filepath) {
	var handler = new ActiveXObject('Scripting.FileSystemObject').OpenTextFile(filepath, 1);
	var content = handler.ReadAll();
	handler.Close();
	return content;
}

//-----------------------------------------------------------------------------
// Helper Functions
//-----------------------------------------------------------------------------

function getFiles(dir) {
	var files = [];

	var traverse = function (dir) {
		var dirList = new ActiveXObject('Scripting.FileSystemObject').GetFolder(dir).files;
		for (var e = new Enumerator(dirList); !e.atEnd(); e.moveNext()) {
			var file = e.item();
			if (/\.css$/.test(file)) {
				files.push(file);
			} else if (new ActiveXObject('Scripting.FileSystemObject').FolderExists(file)) {
				traverse(file);
			}
		};
	};

	traverse(dir);

	return files;
}

//-----------------------------------------------------------------------------
// Process command line
//-----------------------------------------------------------------------------

var args	 = [],
	argName,
	arg	  = '',
	options  = {},
	files	= [];

for (var i = 0; i < WScript.Arguments.length; i += 1) {
	args.push(WScript.Arguments(i));
}
arg = args.shift();

while(arg){
	if (arg.indexOf("--") == 0){
		argName = arg.substring(2);
		options[argName] = true;
		
		if (argName.indexOf("rules=") > -1){
			options.rules = argName.substring(argName.indexOf("=") + 1);
		}
	} else {
		//see if it's a directory or a file
		if (new ActiveXObject('Scripting.FileSystemObject').FolderExists(arg)){
			files = files.concat(getFiles(arg));
		} else {
			files.push(arg);
		}
	}
	arg = args.shift();
}

if (options.help || WScript.Arguments.length == 0){
	outputHelp();
	WScript.Quit(0);
}

if (options.version){
	print("v" + CSSLint.version);
	WScript.Quit(0);
}

var exitCode = 0;
if (!files.length) {
	print("No files specified.");
	exitCode = 1;
} else {
	files.some(function(file){
		processFile(file,options);
	});
}
WScript.Quit(Number(exitCode));