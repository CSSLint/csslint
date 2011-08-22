/*
 * CSSLint Rhino Command Line Interface
 */

importPackage(java.io);

//-----------------------------------------------------------------------------
// Helper Functions
//-----------------------------------------------------------------------------

function getFiles(dir) {
    var files = [];

    var traverse = function (dir) {
        var dirList = dir.listFiles();
        dirList.forEach(function (file) {
            if (/\.css$/.test(file)) {
                files.push(file.toString());
            } else if (file.isDirectory()) {
                traverse(file);
            }
        });
    };

    traverse(dir);

    return files;
}

//-----------------------------------------------------------------------------
// Process command line
//-----------------------------------------------------------------------------

var args     = Array.prototype.slice.call(arguments),
    argName,
    arg      = args.shift(),
    options  = {},
    files    = [];

while(arg){
    if (arg.indexOf("--") === 0){
        argName = arg.substring(2);
        options[argName] = true;
        
        if (argName.indexOf("rules=") > -1){
            options.rules = argName.substring(argName.indexOf("=") + 1);
        } else if (argName.indexOf("format=") > -1) {
            options.format = argName.substring(argName.indexOf("=") + 1);
        }
    } else {
        var curFile = new File(arg);
        
        //see if it's a directory or a file
        if (curFile.isDirectory()){
            files = files.concat(getFiles(curFile));
        } else {
            files.push(arg);
        }
    }
    arg = args.shift();
}

if (options.help || arguments.length === 0){
    outputHelp();
    quit(0);
}

if (options.version){
    print("v" + CSSLint.version);
    quit(0);
}

if (options["list-rules"]){
    listRules();
    quit(0);
}


quit(processFiles(files,options));
