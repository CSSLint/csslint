(function(a) {
    var input, results;
    if (!a[0]) {
        print("Usage: csslint-rhino.js file.css"); 
        quit(1);
    }
    input = readFile(a[0]);
    if (!input) {
        print("CSSLint could not open file: '" + a[0] + "'."); 
        quit(1);
    }
    results = CSSLint.verify(input);
    if (results && results.messages && results.messages.length > 0) {
        for (i = 0, len = results.messages.length; i < len; ++i) {
            cur = results.messages[i];
            print(cur["type"] + " at line " + cur["line"] + " character " + cur["col"] + ": " + cur["rule"]["desc"]);
            print(cur["evidence"] + "\n");
        }
    }
    else {
        print("csslint: No problems found in " + a[0]);
    }
})(arguments);
