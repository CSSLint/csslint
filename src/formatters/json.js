/* global JSON */

CSSLint.addFormatter({
    //format information
    id: "json",
    name: "CSSLint JSON format",
    json: [],

    /**
     * Return content to be printed before all file results.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        "use strict";
        return "";
    },

    /**
     * Return full JSON
     * @return {String} to append after all results
     */
    endFormat: function() {
        "use strict";
        return JSON.stringify(this.json);
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} relative file path
     * @param options {Object} (UNUSED for now) specifies special handling of output
     * @return {String} output for results
     */
    formatResults: function(results, filename, options) {
        "use strict";
        options = options || {};

        if (results.messages.length > 0) {
            this.json.push({
                filename: filename,
                results: results
            });
        }
        return "";
    }
});
