
CLI.gatherRules = function(options){
    var ruleset;
    
    if (options.rules){
        ruleset = {};
        options.rules.split(",").forEach(function(value){
            ruleset[value] = 1;
        });
    }
    
    return ruleset;
};
    
CLI.pluckByType = function(messages, type){
    return messages.filter(function(message) {
        return message.type === type;
    });
};

/**
 * Given a file name and options, run verification and print formatted output.
 * @param {String} name of file to process
 * @param {Object} options for processing
 * @return {Number} exit code
 */
CLI.processFile = function(filename, options) {
    var input = this.readFile(filename),
        result = CSSLint.verify(input, this.gatherRules(options)),
        formatId = options.format || "text",
        messages = result.messages || [],
        exitCode = 0;

    if (!input) {
        this.print("csslint: Could not read file data in " + filename + ". Is the file empty?");
        exitCode = 1;
    } else {
        this.print(CSSLint.getFormatter(formatId).formatResults(result, filename, formatId));

        if (messages.length > 0 && this.pluckByType(messages, 'error').length > 0) {
            exitCode = 1;
        }
    }
    
    return exitCode;
};

//output CLI help screen
CLI.outputHelp = function(){
    print([
        "\nUsage: csslint-rhino.js [options]* [file|dir]*",
        " ",
        "Global Options",
        "  --help                 Displays this information.",
        "  --rules=<rule[,rule]+> Indicate which rules to include.",
        "  --format=<format>      Indicate which format to use for output.",
        "  --version              Outputs the current version number."
    ].join("\n") + "\n\n");
};

/**
 * Given an {Array} of files, print wrapping output and process them.
 * @param {Array} files list
 * @param {Object} options
 * @return {Number} exit code
 */
CLI.processFiles = function(files, options){
    var exitCode = 0,
        formatId = options.format || "text",
        formatter;
    if (!files.length) {
        this.print("No files specified.");
        exitCode = 1;
    } else {
        if (!CSSLint.hasFormat(formatId)){
            this.print("csslint: Unknown format '" + formatId + "'. Cannot proceed.");
            exitCode = 1; 
        } else {
            formatter = CSSLint.getFormatter(formatId);
            this.print(formatter.startFormat());
            exitCode = files.some(function(file){
                this.processFile(file,options);
            }, this);
            print(formatter.endFormat());
        }
    }
    return exitCode;
};