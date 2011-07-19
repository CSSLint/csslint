/*
 * Rule: When using a vendor-prefixed property, make sure to
 * include the standard one.
 */
CSSLint.addRule({

    //rule information
    id: "vendor-prefix",
    name: "Vendor Prefix",
    desc: "When using a vendor-prefixed property, make sure to include the standard one.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            properties,
            num,
            propertiesToCheck = {
                "-moz-border-radius": "border-radius",
                "-webkit-border-radius": "border-radius",
                "-webkit-border-top-left-radius": "border-top-left-radius",
                "-webkit-border-top-right-radius": "border-top-right-radius",
                "-webkit-border-bottom-left-radius": "border-bottom-left-radius",
                "-webkit-border-bottom-right-radius": "border-bottom-right-radius",
                "-moz-border-radius-topleft": "border-top-left-radius",
                "-moz-border-radius-topright": "border-top-right-radius",
                "-moz-border-radius-bottomleft": "border-bottom-left-radius",
                "-moz-border-radius-bottomright": "border-bottom-right-radius",
                "-moz-box-shadow": "box-shadow",
                "-webkit-box-shadow": "box-shadow",
                "-moz-transform" : "transform",
                "-webkit-transform" : "transform",
                "-o-transform" : "transform",
                "-ms-transform" : "transform",
                "-moz-box-sizing" : "box-sizing",
                "-webkit-box-sizing" : "box-sizing",
                "-moz-user-select" : "user-select",
                "-khtml-user-select" : "user-select",
                "-webkit-user-select" : "user-select"                
            };

        //event handler for beginning of rules
        function startRule(){
            properties = {};
            num=1;        
        }
        
        //event handler for end of rules
        function endRule(event){
            var prop,
                i, len,
                standard,
                needed,
                actual,
                needsStandard = [];

            for (prop in properties){
                if (propertiesToCheck[prop]){
                    needsStandard.push({ actual: prop, needed: propertiesToCheck[prop]});
                }
            }

            for (i=0, len=needsStandard.length; i < len; i++){
                needed = needsStandard[i].needed;
                actual = needsStandard[i].actual;

                if (!properties[needed]){               
                    reporter.warn("Missing standard property '" + needed + "' to go along with '" + actual + "'.", event.line, event.col, rule);
                } else {
                    //make sure standard property is last
                    if (properties[needed][0].pos < properties[actual][0].pos){
                        reporter.warn("Standard property '" + needed + "' should come after vendor-prefixed property '" + actual + "'.", event.line, event.col, rule);
                    }
                }
            }

        }        
        
        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);

        parser.addListener("property", function(event){
            var name = event.property.text.toLowerCase();

            if (!properties[name]){
                properties[name] = [];
            }

            properties[name].push({ name: event.property, value : event.value, pos:num++ });
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
    }

});