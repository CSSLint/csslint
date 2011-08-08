CSSLint.addFormatter({
    //format information
    id: "text",
    name: "Plain Text",
    
    startFormat: function(){
        return "";
    },
    
    endFormat: function(){
        return "";
    },

    formatResults: function(results, filename) {
        var messages = results.messages;
        if (messages.length === 0) {
            return "\n\ncsslint: No errors in " + filename + ".";
        }
        
        output = "\n\ncsslint: There are " + messages.length  +  " problems in " + filename + ".";
        var pos = filename.lastIndexOf("/"),
            shortFilename = filename;

        if (pos == -1){
            pos = filename.lastIndexOf("\\");       
        }
        if (pos > -1){
            shortFilename = filename.substring(pos+1);
        }

        messages.forEach(function (message, i) {
            output = output + "\n\n" + shortFilename;
            if (message.rollup) {
                output += "\n" + (i+1) + ": " + message.type;
                output += "\n" + message.message;
            } else {
                output += "\n" + (i+1) + ": " + message.type + " at line " + message.line + ", col " + message.col;
                output += "\n" + message.message;
                output += "\n" + message.evidence;
            }
        });
    
        return output;
    }
});