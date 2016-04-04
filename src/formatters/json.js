/* globals JSON: true */

CSSLint.addFormatter({
    // format information
    id: "json",
    name: "JSON",

    /**
     * Return content to be printed before all file results.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        "use strict";
        this.json = [];
        return "";
    },

    /**
     * Return content to be printed after all file results.
     * @return {String} to append after all results
     */
    endFormat: function() {
        "use strict";
        var ret = "";
        if (this.json.length > 0) {
            if (this.json.length === 1) {
                ret = JSON.stringify(this.json[0]);
            } else {
                ret = JSON.stringify(this.json);
            }
        }
        return ret;
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} relative file path (Unused)
     * @return {String} output for results
     */
    formatResults: function(results, filename, options) {
        "use strict";
        if (results.messages.length > 0 || !options.quiet) {
            this.json.push({
                filename: filename,
                messages: results.messages,
                stats: results.stats
            });
        }
        return "";
    }
});
