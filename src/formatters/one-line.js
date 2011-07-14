CSSLint.addFormatter({
    //format information
    id: "one-line",
    name: "One-line, 'porcelain' format",
    
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