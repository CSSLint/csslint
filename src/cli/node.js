/*
 * CSSLint Node.js Command Line Interface
 */

var fs      = require("fs"),
    path    = require("path"),
    CSSLint = require("./lib/csslint-node").CSSLint,
    options = {},
    stdout  = process.stdout;

//-----------------------------------------------------------------------------
// Helper Functions
//-----------------------------------------------------------------------------

//get all files in a directory
function getFiles(dir){
    var files = [];

    try {
        fs.statSync(dir);
    } catch (ex){
        return [];
    }

    function traverse(dir, stack){
        stack.push(dir);
        fs.readdirSync(stack.join("/")).forEach(function(file){
            var path = stack.concat([file]).join("/");
            var stat = fs.statSync(path);
            
            if (file[0] == ".") {
                return;
            } else if (stat.isFile() && /\.css$/.test(file)){
                files.push(path);
            } else if (stat.isDirectory()){
                traverse(file, stack);
            }
        });
        stack.pop();
    }

    traverse(dir, []);

    return files;
}

//-----------------------------------------------------------------------------
// Process command line
//-----------------------------------------------------------------------------

var args     = process.argv.slice(2),
    argName,
    arg      = args.shift(),
    files    = [];

while(arg){
    if (arg.indexOf("--") == 0){
        argName = arg.substring(2);
        options[argName] = true;
        
        if (argName.indexOf("rules=") > -1){
            options.rules = argName.substring(argName.indexOf("=") + 1);
        } else if (argName.indexOf("format=") > -1) {
            options.format = argName.substring(argName.indexOf("=") + 1);
        }
    } else {
        //see if it's a directory or a file
        if (fs.statSync(arg).isDirectory()){
            files = files.concat(getFiles(arg));
        } else {
            files.push(arg);
        }
    }
    arg = args.shift();
}

if (options.help || arguments.length == 0){
    outputHelp();
    process.exit(0);
}

if (options.version){
    print("v" + CSSLint.version);
    process.exit(0);
}

//get the full path names
files = files.map(function(filename){
    return path.join(process.cwd(), filename);
});

var exitCode = 0;
if (!files.length) {
    print("No files specified.");
    exitCode = 1;
} else {
    //FIXME: This needs to be refactored to take format into account
    exitCode = files.some(function(file){
        processFile(file,options);
    });
}
process.exit(Number(exitCode));

