//print for rhino and nodejs
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

function gatherRules(options){
    var ruleset;
    
    if (options.rules){
        ruleset = {};
        options.rules.split(",").forEach(function(value){
            ruleset[value] = 1;
        });
    }
    
    return ruleset;
    
}

//process a list of files, return 1 if one or more error occurred
var processFile = function(filename, options) {
    var input = readFile(filename),
        result = CSSLint.verify(input, gatherRules(options)),
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

    var pos = filename.lastIndexOf("/"),
        shortFilename = filename;
        
    if (pos == -1){
        pos = filename.lastIndexOf("\\");       
    }
    if (pos > -1){
        shortFilename = filename.substring(pos+1);
    }
    

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
        print("\n" + shortFilename + ":");
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


//output CLI help screen
function outputHelp(){
    print([
        "\nUsage: csslint-rhino.js [options]* [file|dir]*",
        " ",
        "Global Options",
        "  --help                 Displays this information.",
        "  --rules=<rule[,rule]+> Indicate which rules to include.",
        "  --version              Outputs the current version number."
    ].join("\n") + "\n\n");
}