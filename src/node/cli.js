#!/usr/bin/env node

/*
 * CSSLint Node.js Command Line Interface
 */

var fs      = require("fs"),
    path    = require("path"),
    CSSLint = require("csslint-node").CSSLint;
    
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
            } else if (stat.isFile() && /\.js$/.test(file)){
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

if (options.help){
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
    var text    = fs.readFileSync(filepath),
        filename= path.basename(filepath),
        result  = CSSLint.verify(text),
        messages= result.messages;
        
    if (messages.length){
    
        stdout.write("There are " + messages.length + " errors and warnings.");
    
        messages.sort(function(a, b){
            if (a.rollup){
                return -1;
            } else if (b.rollup){
                return 1;
            } else {
                return 0;
            }
        });
        
        messages.forEach(function(message){
            stdout.write(filename + ":");
            if (message.rollup){
                stdout.write(message);
            } else {
                stdout.write(message);        
            }
        });
        
        while(i < len){

            i++;
        }
    } else {
        stdout.write(filename + ": No problems found.";
    }

});
