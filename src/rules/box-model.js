/*
 * Rule: Don't use width or height when using padding or border. 
 */
CSSLint.addRule({

    //rule information
    id: "box-model",
    name: "Box Model",
    desc: "Don't use width or height when using padding or border.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
        mismatchingProperties = {
            width:  ["border", "border-left", "border-right", "padding", "padding-left", "padding-right"],
            height: ["border", "border-bottom", "border-top", "padding", "padding-bottom", "padding-top"]
        },
        propertiesToCheck = {
            width: 1,
            height: 1,
            border: 1,
            "border-left": 1,
            "border-right": 1,
            "border-bottom": 1,
            "border-top": 1,
            padding: 1,
            "padding-left": 1,
            "padding-right": 1,
            "padding-bottom": 1,
            "padding-top": 1
        },
        checkMismatch = function(dimension) {
            var i,
                l,
                prop,
                mismatching = mismatchingProperties[dimension];
            for(i=0, l=mismatching.length; i < l; i++) {
                if(properties.hasOwnProperty(mismatching[i])){
                    prop = mismatching[i];
                    reporter.warn("Broken box model: using " + dimension + " with " + prop + ".", properties[prop].line, properties[prop].col, rule);
                }
            }
        },
        properties;

        parser.addListener("startrule", function(){
            properties = {
            };
        });
    
        parser.addListener("property", function(event){
            var name = event.property;

            if (propertiesToCheck[name]){
                properties[name] = { line: name.line, col: name.col };
            }
        });
        
        parser.addListener("endrule", function(){
            if(properties.hasOwnProperty("width")) {
                checkMismatch("width");
            }

            if(properties.hasOwnProperty("height")) {
                checkMismatch("height");
            }
        });
    }
});