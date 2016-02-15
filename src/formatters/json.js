/* globals JSON: true */

CSSLint.addFormatter({
    //format information
    id: "json",
    name: "JSON",

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
     * @param filename {String} relative file path (Unused)
     * @return {String} output for results
     */
    formatResults: function(results, filename, options) {
        "use strict";
        return options.quiet && results.messages.length < 1 ? "" : JSON.stringify(results);
    }
});
