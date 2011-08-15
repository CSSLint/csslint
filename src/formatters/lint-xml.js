CSSLint.addFormatter({
    //format information
    id: "lint-xml",
    name: "Lint XML format",
    
    startFormat: function(){
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><lint>";
    },

    endFormat: function(){
        return "</lint>";
    },
    
    formatResults: function(results, filename) {
        var messages = results.messages,
            output = [];

        /**
         * Replace special characters before write to output.
         *
         * Rules:
         *  - single quotes is the escape sequence for double-quotes
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
            return str.replace(/\"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        if (messages.length > 0) {
        
            output.push("<file name=\""+filename+"\">");
            messages.forEach(function (message, i) {
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