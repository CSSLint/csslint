/*
 * Rule: Duplicate properties must appear one after the other. If an already-defined
 * property appears somewhere else in the rule, then it's likely an error.
 */

CSSLint.addRule({

    //rule information
    id: "duplicate-properties",
    name: "Disallow duplicate properties",
    desc: "Duplicate properties must appear one after the other.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        "use strict";
        var rule = this,
            properties,
            lastProperty;

        function startRule(){
            properties = {};
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event){
            var property = event.property,
                name = property.text.toLowerCase();

            if (properties[name] && (lastProperty !== name || properties[name] === event.value.text)){
                reporter.report("Duplicate property '" + event.property + "' found.", event.line, event.col, rule);
            }

            properties[name] = event.value.text;
            lastProperty = name;

        });


    }

});
