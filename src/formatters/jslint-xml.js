CSSLint.addFormatter({
    //format information
    id: "jslint-xml",
    name: "JSLint XML format",

    init: function(results, filename) {
        var messages = results.messages,
            output = ["<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<jslint>"];

        var escapeDoubleQuotes = function(str) {
            if (!str || str.constructor !== String) {
                return "";
            }
            return str.replace(/\"/g, "'");
        };

        if (messages.length > 0) {
            //rollups at the bottom
            messages.sort(function (a, b){
                if (a.rollup && !b.rollup){
                    return 1;
                } else if (!a.rollup && b.rollup){
                    return -1;
                } else {
                    return 0;
                }
            });
        
            output.push("  <file name=\""+filename+"\">");
            messages.forEach(function (message, i) {
                if (message.rollup) {
                    output.push("    <issue reason=\"" + escapeDoubleQuotes(message.message) + "\" evidence=\"" + escapeDoubleQuotes(message.evidence) + "\"/>");
                } else {
                    output.push("    <issue line=\"" + message.line + "\" char=\"" + message.col + "\"" +
                        " reason=\"" + escapeDoubleQuotes(message.message) + "\" evidence=\"" + escapeDoubleQuotes(message.evidence) + "\"/>");
                }
            });
            output.push("  </file>");
        }

        output.push("</jslint>");
        return output.join("\n");
    }
});