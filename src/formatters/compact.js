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
     * @param filename {String} relative file path
     * @param options {Object} (Optional) specifies special handling of output
     * @return {String} output for results
     */
    formatResults: function(results, filename, options) {
        var messages = results.messages,
            output = "",
            options = options || {};

        if (messages.length === 0) {
            return options.quiet ? "" : filename + ": Lint Free!";
        }

        messages.forEach(function(message, i) {
            if (message.rollup) {
                output += filename + ": " + message.message + "\n";
            } else {
                output += filename + ": " + "line " + message.line + 
                    ", col " + message.col + ", " + message.message + "\n";
            }
        });
    
        return output;
    }
});