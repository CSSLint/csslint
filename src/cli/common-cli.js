var args     = CLI.getArguments(),
    argName,
    arg      = args.shift(),
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
        //see if it's a directory or a file
        if (CLI.isDirectory(arg)){
            files = files.concat(CLI.getFiles(arg));
        } else {
            files.push(arg);
        }
    }
    arg = args.shift();
}

if (options.help || arguments.length === 0){
    CLI.outputHelp();
    CLI.quit(0);
}

if (options.version){
    CLI.print("v" + CSSLint.version);
    CLI.quit(0);
}

//get the full path names
files = files.map(function(filename){
    return path.join(CLI.getCurrentDirectory(), filename);
});

CLI.quit(CLI.processFiles(files,options));
