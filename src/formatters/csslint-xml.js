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
    
    formatResults: function(results, filename) {
        var messages = results.messages,
            output = [];

        /**
         * Replace double-quotes with single quotes for XML output
         * @param {String} message to escape
         * @return escaped message as {String}
         */
        var replaceDoubleQuotes = function(str) {
            if (!str || str.constructor !== String) {
                return "";
            }
            return str.replace(/\"/g, "'");
        };

        if (messages.length > 0) {
            output.push("<file name=\""+filename+"\">");
            messages.forEach(function (message, i) {
                if (message.rollup) {
                    output.push("<issue severity=\"" + message.type + "\" reason=\"" + replaceDoubleQuotes(message.message) + "\" evidence=\"" + replaceDoubleQuotes(message.evidence) + "\"/>");
                } else {
                    output.push("<issue line=\"" + message.line + "\" char=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                        " reason=\"" + replaceDoubleQuotes(message.message) + "\" evidence=\"" + replaceDoubleQuotes(message.evidence) + "\"/>");
                }
            });
            output.push("</file>");
        }

        return output.join("");
    }
});