/*
 * Rule: Don't use text-indent for image replacement if you need to support rtl.
 *
 */

CSSLint.addRule({

    //rule information
    id: "text-indent",
    name: "Disallow negative text-indent",
    desc: "Checks for text indent less than -99px",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        "use strict";
        var rule = this,
            textIndent,
            direction;


        function startRule(){
            textIndent = false;
            direction = "inherit";
        }

        //event handler for end of rules
        function endRule(){
            if (textIndent && direction !== "ltr"){
                reporter.report("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", textIndent.line, textIndent.col, rule);
            }
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);

        //check for use of "font-size"
        parser.addListener("property", function(event){
            var name = event.property.toString().toLowerCase(),
                value = event.value;

            if (name === "text-indent" && value.parts[0].value < -99){
                textIndent = event.property;
            } else if (name === "direction" && value.toString() === "ltr"){
                direction = "ltr";
            }
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);

    }

});
