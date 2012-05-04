/*
 * Rule: Don't use properties with a underscore prefix.
 *
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "underscore-property-hack",
    name: "Disallow properties with an underscore prefix",
    desc: "Checks for the underscore property hack (targets IE6)",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this;

        //check if property name starts with "_"
        parser.addListener("property", function(event){
            var property = event.property;

            if (property.hack == "_") {
                reporter.report("Property with underscore prefix found.", event.property.line, event.property.col, rule);
            }
        });
    }
});