CSSLint.addRule({

    //rule information
    name: "error",
    desc: "This rule looks for recoverable syntax errors",
    
    //initialization
    init: function(parser, reporter){
    
        parser.addListener("error", function(event){
            reporter.error(event.message, event.line, event.col);
        });

    }

});