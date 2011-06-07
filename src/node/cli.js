#!/usr/bin/env node

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

//output CLI help screen
function outputHelp(){
    stdout.write([
        "\nUsage: csslint [file|dir]*",
        " ",
        "Global Options",
        "  --help              Displays this information."
    ].join("\n") + "\n\n");
}

//-----------------------------------------------------------------------------
// Process command line
//-----------------------------------------------------------------------------

var args    = process.argv.slice(2),  
    arg     = args.shift(),     
    files   = [];  
    
while(arg){
    if (arg.indexOf("--") == 0){
        options[arg.substring(2)] = true;
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

if (options.help || process.argv.length == 2){
    outputHelp();
    process.exit(0);
}

//get the full path names
files = files.map(function(filename){
    return path.join(process.cwd(), filename);
});

//-----------------------------------------------------------------------------
// Loop over files
//-----------------------------------------------------------------------------

files.forEach(function(filepath){
    var text    = fs.readFileSync(filepath,"utf-8"),
        filename= path.basename(filepath),
        result  = CSSLint.verify(text),
        messages= result.messages;
        
    if (messages.length){
    
        stdout.write("csslint: There are " + messages.length + " errors and warnings in " + filename + ".\n");
    
    //rollups at the bottom
        messages.sort(function(a, b){
            if (a.rollup){
                return -1;
            } else if (b.rollup){
                return 1;
            } else {
                return 0;
            }
        });
        
        messages.forEach(function(message,i){
            stdout.write("\n" + filename + ":\n");
            if (message.rollup){
                stdout.write((i+1) + ": " + message.type + "\n");
                stdout.write(message.message + "\n");
            } else {
                stdout.write((i+1) + ": " + message.type + " at line " + message.line + ", col " + message.line + "\n");   
                stdout.write(message.message + "\n");
                stdout.write(message.evidence + "\n");
            }
        });
        
    } else {
        stdout.write("csslint: No problems found in " + filename + ".\n");
    }
});


