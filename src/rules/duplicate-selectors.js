/*
 * Rule: Selectors should be unique
 */
CSSLint.addRule({

    //rule information
    id: "duplicate-selectors",
    name: "Duplicate Selectors",
    desc: "Selectors should be used only once.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            selectorStack = [];
        parser.addListener("startrule", function(event){
            var selectors = event.selectors,
                selector,
                i;

            for (i=0; i < selectors.length; i++){
                selector = selectors[i];
                if (typeof selectorStack[selector.text] === 'undefined') {
                    selectorStack[selector.text] = 1;
                }
                else {
                    selectorStack[selector.text]++;
                }
            }
        });

        //report the results
        parser.addListener("endstylesheet", function(event){
            reporter.stat("duplicate-selectors", selectorStack);
            for (i in selectorStack) {
                if (selectorStack[i] > 1) {
                    reporter.rollupWarn("Selectors should be used only once, " + i + " was used " + selectorStack[i] + " times." , rule);
                }
            }
        });
        delete selectorStack;
    }

});