#!/usr/bin/env node//print for rhino and nodejs
if(typeof print == "undefined") {
    var print = console.log;
}

//readFile for rhino and nodejs
if(typeof readFile == "undefined") {
    var readFile = function(filepath) {
        var fs = require("fs");
        return fs.readFileSync(filepath, "utf-8");
    }
}

//filter messages by type
var pluckByType = function(messages, type){
    return messages.filter(function(message) {
        return message.type === type;
    });
};

//process a list of files, return 1 if one or more error occurred
var processFile = function(filename) {
    var input = readFile(filename),
        result = CSSLint.verify(input),
        messages = result.messages || [],
        exitCode = 0;

    if (!input) {
        print("csslint: Could not read file data in " + filename + ". Is the file empty?");
        exitCode = 1;
    }

    if (messages.length > 0) {
        var warnings = pluckByType(messages, 'warning');
        var errors  = pluckByType(messages, 'error');
        reportMessages(messages, warnings, errors, filename);

        if(errors.length > 0 ) {
            exitCode = 1;
        }

    } else {
        print("csslint: No problems found in " + filename);
    }
    return exitCode;
};

//display messages
var reportMessages = function(messages, warnings, errors, filename) {
    print("\n\ncsslint: There are " + errors.length +  " errors and " + warnings.length  +  " warnings in " + filename + ".");

    //rollups at the bottom
    messages.sort(function (a, b){
        if (a.rollup && !b.rollup){
            return 1;
        } else if (!a.rollup && b.rollup){
            return -1;
        } else {
            return 0;
        }
    });

    messages.forEach(function (message, i) {
        print("\n" + filename);
        if (message.rollup) {
            print("" + (i+1) + ": " + message.type);
            print(message.message);
        } else {
            print("" + (i+1) + ": " + message.type + " at line " + message.line + ", col " + message.col);
            print(message.message);
            print(message.evidence);
        }
    });
};
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

var args     = process.argv.slice(2),
    arg      = args.shift(),
    files    = [];

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

//process files, get the exit code
var exitCode = files.some(processFile)
process.exit(Number(exitCode));

