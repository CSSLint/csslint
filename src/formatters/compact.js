CSSLint.addFormatter({
    //format information
    id: "compact",
    name: "Compact, 'porcelain' format",

    /**
     * Return content to be printed before all file results.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        return "";
    },

    /**
     * Return content to be printed after all file results.
     * @return {String} to append after all results
     */
    endFormat: function() {
        return "";
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} absolute file path
     * @param options {Object} (Optional) specifies special handling of output
     * @return {String} output for results
     */
    formatResults: function(results, filename, options) {
        var messages = results.messages,
            output = "",
            relativeFilename = filename;

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

        if (messages.length === 0) {
            return relativeFilename + ": Lint Free!";
        }

        options = options || {};

        if (options.workingDirectory) {
            relativeFilename = getRelativePath(options.workingDirectory, filename)
        }

        messages.forEach(function(message, i) {
            if (message.rollup) {
                output += relativeFilename + ": " + message.message + "\n";
            } else {
                output += relativeFilename + ": " + "line " + message.line + 
                    ", col " + message.col + ", " + message.message + "\n";
            }
        });
    
        return output;
    }
});