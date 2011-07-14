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
            //rollups at the bottom
            messages.sort(function (a, b) {
                if (a.rollup && !b.rollup) {
                    return 1;
                } else if (!a.rollup && b.rollup) {
                    return -1;
                } else {
                    return 0;
                }
            });
        
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