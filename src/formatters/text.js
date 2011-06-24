CSSLint.addFormatter({
    //format information
    id: "text",
    name: "Plain Text",

    init: function(messages, filename) {
	    // output = "\n\ncsslint: There are " + errors.length +  " errors and " + warnings.length  +  " warnings in " + filename + ".";
		output = "\n\n";

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
	        output = output + "\n" + filename;
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