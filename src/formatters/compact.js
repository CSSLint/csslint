CSSLint.addFormatter({
    //format information
    id: "compact",
    name: "Compact, 'porcelain' format",

    /**
     * Return no content to prepend.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        return "";
    },

    /**
     * Return no content to append.
     * @return {String} to append after all results
     */
    endFormat: function() {
        return "";
    },

    formatResults: function(results, filename) {
        var messages = results.messages,
            output = "",
            pos = filename.lastIndexOf("/"),
            shortFilename = filename;

        /**
         * Capitalize and return given string.
         * @param str {String} to capitalize
         * @return {String} capitalized
         */
        var capitalize = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        if (messages.length === 0) {
            return shortFilename + ": Lint Free!";
        }

        if (pos == -1) {
            pos = filename.lastIndexOf("\\");       
        } else if (pos > -1) {
            shortFilename = filename.substring(pos+1);
        }

        messages.forEach(function (message, i) {
            if (message.rollup) {
                output += capitalize(message.type) + ": " + shortFilename + ": " + message.message + "\n";
            } else {
                output += capitalize(message.type) + ": " + shortFilename + ": " + "line " + message.line + 
                    ", col " + message.col + ", " + message.message + "\n";
            }
        });
    
        return output;
    }
});