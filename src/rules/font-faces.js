/*
 * Rule: Avoid too many @font-face declarations in the same stylesheet.
 */
CSSLint.addRule({

    //rule information
    id: "font-faces",
    name: "Font Faces",
    desc: "Too many different web fonts in the same stylesheet.",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this,
            count = 0;
    
        
        parser.addListener("startfontface", function(event){
            count++;
        });

        parser.addListener("endstylesheet", function(event){
            if (count > 5){
                reporter.rollupWarn("Too many @font-face declarations (" + count + ").", rule);
            }
        });        
    }

});