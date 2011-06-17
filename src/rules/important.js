/*
 * Rule: Make sure !important is not overused, this could lead to specificity
 * war. Display a warning on !important declarations, an error if it's
 * used more at least 10 times.
 */
CSSLint.addRule({

    //rule information
    id: "important",
    name: "Important",
    desc: "Be careful when using !important declaration",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;
        var count = 0;

        //warn that important is used and increment the declaration counter
        parser.addListener("property", function(event){
            var name = event.property;
            if (event.important === true){
                count++;
                reporter.warn("Use of !important", name.line, name.col, rule);
            }
        });

        //report the results
        parser.addListener("endstylesheet", function(event){
            reporter.stat("important", count);
            if (count >= 10){
                reporter.rollupError("Too many !important declarations (" + count + "), be careful with rule specificity", rule);
            }
        });
    }

});