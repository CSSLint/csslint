/*global CSSLint*/
CSSLint.addFormatter({
    //format information
    id: "csslint-xml",
    name: "CSSLint XML format",

    /**
     * Return opening root XML tag.
     * @return {String} to prepend before all results
     */
    startFormat: function(){
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><csslint>";
    },

    /**
     * Return closing root XML tag.
     * @return {String} to append after all results
     */
    endFormat: function(){
        return "</csslint>";
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} relative file path
     * @param options {Object} (UNUSED for now) specifies special handling of output
     * @return {String} output for results
     */
    formatResults: function(results, filename, options) {
        var messages = results.messages,
            output = [];

        /**
         * Replace special characters before write to output.
         *
         * Rules:
         *  - single quotes is the escape sequence for double-quotes
         *  - &amp; is the escape sequence for &
         *  - &lt; is the escape sequence for <
         *  - &gt; is the escape sequence for >
         * 
         * @param {String} message to escape
         * @return escaped message as {String}
         */
        var escapeSpecialCharacters = function(str) {
            if (!str || str.constructor !== String) {
                return "";
            }
            return str.replace(/\"/g, "'").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        if (messages.length > 0) {
            output.push("<file name=\""+filename+"\">");
            CSSLint.Util.forEach(messages, function (message, i) {
                if (message.rollup) {
                    output.push("<issue severity=\"" + message.type + "\" reason=\"" + escapeSpecialCharacters(message.message) + "\" evidence=\"" + escapeSpecialCharacters(message.evidence) + "\"/>");
                } else {
                    output.push("<issue line=\"" + message.line + "\" char=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                        " reason=\"" + escapeSpecialCharacters(message.message) + "\" evidence=\"" + escapeSpecialCharacters(message.evidence) + "\"/>");
                }
            });
            output.push("</file>");
        }

        return output.join("");
    }
});