/*
 * Rule: If an element has a width of 100%, be careful when placing within
 * an element that has padding. It may look strange.
 */
//Commented out pending further review.
/*CSSLint.addRule({

    //rule information
    id: "width-100",
    name: "Width 100%",
    desc: "Be careful when using width: 100% on elements.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            width100,
            boxsizing;

        parser.addListener("startrule", function(){
            width100 = null;
            boxsizing = false;
        });

        parser.addListener("property", function(event){
            var name = event.property.text.toLowerCase(),
                value = event.value;

            if (name == "width" && value == "100%"){
                width100 = event.property;
            } else if (name == "box-sizing" || /\-(?:webkit|ms|moz)\-box-sizing/.test(name)){  //means you know what you're doing
                boxsizing = true;
            }
        });
        
        parser.addListener("endrule", function(){
            if (width100 && !boxsizing){
                reporter.report("Elements with a width of 100% may not appear as you expect inside of other elements.", width100.line, width100.col, rule);
            }
        });
    }

});*/