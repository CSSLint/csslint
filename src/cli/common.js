/*
 * Encapsulates all of the CLI functionality. The api argument simply
 * provides environment-specific functionality.
 */
/*global CSSLint*/
function cli(api){

    //-------------------------------------------------------------------------
    // Helper functions
    //-------------------------------------------------------------------------
    
    /**
     * Returns an array of messages for a particular type.
     * @param messages {Array} Array of CSS Lint messages.
     * @param type {String} The type of message to filter on.
     * @return {Array} An array of matching messages.
     */
    function pluckByType(messages, type){
        return messages.filter(function(message) {
            return message.type === type;
        });        
    }

    /**
     * Returns a ruleset object based on the CLI options.
     * @param options {Object} The CLI options.
     * @return {Object} A ruleset object.
     */
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

    /**
     * Outputs all available rules to the CLI.
     * @return {void}
     */
    function printRules(){
        api.print("");
        var rules = CSSLint.getRules();
        rules.forEach(function(rule){
            api.print(rule.id + "\n" + rule.desc + "\n");
        });
    }

    /**
     * Given a file name and options, run verification and print formatted output.
     * @param {String} fullFilePath absolute file location
     * @param {Object} options for processing
     * @return {Number} exit code
     */
    function processFile(fullFilePath, options) {
        var input = api.readFile(fullFilePath),
            result = CSSLint.verify(input, gatherRules(options)),
            formatter = CSSLint.getFormatter(options.format || "text")
            messages = result.messages || [],
            exitCode = 0;

        if (!input) {
            api.print("csslint: Could not read file data in " + fullFilePath + ". Is the file empty?");
            exitCode = 1;
        } else {
            var relativeFilePath = getRelativePath(api.getWorkingDirectory(), fullFilePath);
            options["fullPath"] = fullFilePath;
            api.print(formatter.formatResults(result, relativeFilePath, options));

            if (messages.length > 0 && pluckByType(messages, "error").length > 0) {
                exitCode = 1;
            }
        }
        
        return exitCode;
    }

    /**
     * Given a source directory and a target filename, return the relative
     * file path from source to target.
     * @param source {String} directory path to start from for traversal
     * @param target {String} directory path and filename to seek from source
     * @return Relative path (e.g. "../../style.css") as {String}
     */
    function getRelativePath(source, target) {
        var sep = (source.indexOf("/") !== -1) ? "/" : "\\",
            targetArr = target.split(sep),
            sourceArr = source.split(sep),
            file = targetArr.pop(),
            targetPath = targetArr.join(sep),
            relativePath = "";

        while (targetPath.indexOf(sourceArr.join(sep)) === -1) {
            sourceArr.pop();
            relativePath += ".." + sep;
        }

        var relPathArr = targetArr.slice(sourceArr.length);
        relPathArr.length && (relativePath += relPathArr.join(sep) + sep);

        return relativePath + file;
    }

    /**
     * Outputs the help screen to the CLI.
     * @return {void}
     */
    function outputHelp(){
        api.print([
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
     * Given an Array of filenames, print wrapping output and process them.
     * @param files {Array} filenames list
     * @param options {Object} options object
     * @return {Number} exit code
     */
    function processFiles(files, options){
        var exitCode = 0,
            formatId = options.format || "text",
            formatter,
            output;
            
        if (!files.length) {
            api.print("csslint: No files specified.");
            exitCode = 1;
        } else {
            if (!CSSLint.hasFormat(formatId)){
                api.print("csslint: Unknown format '" + formatId + "'. Cannot proceed.");
                exitCode = 1; 
            } else {
                formatter = CSSLint.getFormatter(formatId);
                
                output = formatter.startFormat();
                if (output){
                    api.print(output);
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
                    api.print(output);
                }
            }
        }
        return exitCode;
    }    

    //-----------------------------------------------------------------------------
    // Process command line
    //-----------------------------------------------------------------------------

    var args     = api.args,
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
            
            //see if it's a directory or a file
            if (api.isDirectory(arg)){
                files = files.concat(api.getFiles(arg));
            } else {
                files.push(arg);
            }
        }
        arg = args.shift();
    }

    if (options.help || arguments.length === 0){
        outputHelp();
        api.quit(0);
    }

    if (options.version){
        api.print("v" + CSSLint.version);
        api.quit(0);
    }

    if (options["list-rules"]){
        printRules();
        api.quit(0);
    }

    files = api.fixFilenames(files);

    api.quit(processFiles(files,options));
}