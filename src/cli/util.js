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


function listRules(){
    print("");
    var rules = CSSLint.getRules();
    rules.forEach(function(rule){
        print(rule.id + "\n" + rule.desc + "\n");
    });
}

/**
 * Given a file name and options, run verification and print formatted output.
 * @param {String} name of file to process
 * @param {Object} options for processing
 * @return {Number} exit code
 */
var processFile = function(filename, options) {
    var input = readFile(filename),
        result = CSSLint.verify(input, gatherRules(options)),
        formatId = options.format || "text",
        messages = result.messages || [],
        exitCode = 0;

    if (!input) {
        print("csslint: Could not read file data in " + filename + ". Is the file empty?");
        exitCode = 1;
    } else {
        print(CSSLint.getFormatter(formatId).formatResults(result, filename, options));

        if (messages.length > 0 && pluckByType(messages, 'error').length > 0) {
            exitCode = 1;
        }
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
        "  --format=<format>      Indicate which format to use for output.",
        "  --list-rules           Outputs all of the rules available.",
        "  --rules=<rule[,rule]+> Indicate which rules to include.",
        "  --version              Outputs the current version number."
    ].join("\n") + "\n");
}

/**
 * Given an {Array} of files, print wrapping output and process them.
 * @param {Array} files list
 * @param {Object} options
 * @return {Number} exit code
 */
function processFiles(files, options){
    var exitCode = 0,
        formatId = options.format || "text",
        formatter,
        output;
    if (!files.length) {
        print("No files specified.");
        exitCode = 1;
    } else {
        if (!CSSLint.hasFormat(formatId)){
            print("csslint: Unknown format '" + formatId + "'. Cannot proceed.");
            exitCode = 1; 
        } else {
            formatter = CSSLint.getFormatter(formatId);
            
            output = formatter.startFormat();
            if (output){
                print(output);
            }

            files.forEach(function(file){
                if (exitCode == 0) {
                    exitCode = processFile(file,options);
                } else {
                    processFile(file,options);
                }
            });
            
            output = formatter.endFormat();
            if (output){
                print(output);
            }
        }
    }
    return exitCode;
}