/*
 * Rule: If an element has a width of 100%, be careful when placing within
 * an element that has padding. It may look strange.
 */
CSSLint.addRule({

    //rule information
    id: "width-100",
    name: "Width 100%",
    desc: "Be careful when using width: 100% on elements.",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this;

        parser.addListener("property", function(event){
            var name = event.property,
                value = event.value;
                
            if (name == "width" && value == "100%"){
                reporter.warn("Elements with a width of 100% may not appear as you expect inside of other elements.", name.line, name.col, rule);
            }
        });        
    }

});