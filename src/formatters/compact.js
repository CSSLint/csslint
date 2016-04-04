CSSLint.addFormatter({
    // format information
    id: "compact",
    name: "Compact, 'porcelain' format",

    /**
     * Return content to be printed before all file results.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        "use strict";
        return "";
    },

    /**
     * Return content to be printed after all file results.
     * @return {String} to append after all results
     */
    endFormat: function() {
        "use strict";
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
        "use strict";
        var messages = results.messages,
            output = "";
        options = options || {};

        /**
         * Capitalize and return given string.
         * @param str {String} to capitalize
         * @return {String} capitalized
         */
        var capitalize = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        if (messages.length === 0) {
            return options.quiet ? "" : filename + ": Lint Free!";
        }

        CSSLint.Util.forEach(messages, function(message) {
            if (message.rollup) {
                output += filename + ": " + capitalize(message.type) + " - " + message.message + " (" + message.rule.id + ")\n";
            } else {
                output += filename + ": line " + message.line +
                    ", col " + message.col + ", " + capitalize(message.type) + " - " + message.message + " (" + message.rule.id + ")\n";
            }
        });

        return output;
    }
});
