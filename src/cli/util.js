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
        formatId = options.format || 'text',
        messages = result.messages || [],
        exitCode = 0;

    if (!input) {
        print("csslint: Could not read file data in " + filename + ". Is the file empty?");
        exitCode = 1;
    }

	print(CSSLint.format(result, formatId));

    if (messages.length > 0 && pluckByType(messages, 'error').length > 0) {
        exitCode = 1;
    }
    return exitCode;
};

//output CLI help screen
function outputHelp(){
    print([
        "\nUsage: csslint-rhino.js [options]* [file|dir]*",
        " ",
        "Global Options",
        "  --help                 Displays this information.",
        "  --rules=<rule[,rule]+> Indicate which rules to include.",
        "  --format=<format>      Indicate which format to use for output.",
        "  --version              Outputs the current version number."
    ].join("\n") + "\n\n");
}