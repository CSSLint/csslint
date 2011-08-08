CSSLint.addFormatter({
    //format information
    id: "compact",
    name: "Compact, 'porcelain' format",
    
    startFormat: function(){
        return "";
    },
    
    endFormat: function(){
        return "";
    },

    formatResults: function(results, filename) {
        var messages = results.messages,
            output = "",
            pos = filename.lastIndexOf("/"),
            shortFilename = filename;

        if (messages.length === 0) {
            return shortFilename + ": Lint Free!";
        }

        if (pos == -1){
            pos = filename.lastIndexOf("\\");       
        }
        if (pos > -1){
            shortFilename = filename.substring(pos+1);
        }

        messages.forEach(function (message, i) {
            if (message.rollup) {
                output += shortFilename + ": " + message.message + "\n";
            } else {
                output += shortFilename + ": " + "line " + message.line + 
                    ", col " + message.col + ", " + message.message + "\n";
            }
        });
    
        return output;
    }
});