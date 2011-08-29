CSSLint.addFormatter({
    //format information
    id: "checkstyle-xml",
    name: "Checkstyle XML format",

    startFormat: function(){
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle>";
    },

    endFormat: function(){
        return "</checkstyle>";
    },

    formatResults: function(results, filename) {
        var messages = results.messages,
            output = [];

        /**
         * Generate a source string for a rule.
         * Checkstyle source strings usually resemble Java class names e.g
         * net.csslint.SomeRuleName
         * @param {Object} rule
         * @return rule source as {String}
         */
        var generateSource = function(rule) {
            if (!rule || !('name' in rule)) {
                return "";
            }
            return 'net.csslint.' + rule.name.replace(/\s/g,'');
        };

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
                    //ignore rollups for now
                } else {
                  output.push("<error line=\"" + message.line + "\" column=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                      " message=\"" + escapeSpecialCharacters(message.message) + "\" source=\"" + generateSource(message.rule) +"\"/>");
                }
            });
            output.push("</file>");
        }

        return output.join("");
    }
});