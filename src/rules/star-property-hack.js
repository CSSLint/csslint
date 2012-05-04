/*
 * Rule: Don't use properties with a star prefix.
 *
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "star-property-hack",
    name: "Disallow properties with a star prefix",
    desc: "Checks for the star property hack (targets IE6/7)",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;

        //check if property name starts with "*"
        parser.addListener("property", function(event){
            var property = event.property;

            if (property.hack == "*") {
                reporter.report("Property with star prefix found.", event.property.line, event.property.col, rule);
            }
        });
    }
});