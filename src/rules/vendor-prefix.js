/*
 * Rule: When using a vendor-prefixed property, make sure to
 * include the standard one.
 */
CSSLint.addRule({

    //rule information
    id: "zero-units",
    name: "Zero Units",
    desc: "When using a vendor-prefixed property, make sure to include the standard one.",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this,
            properties,
            num;
            
        parser.addListener("startrule", function(event){
            properties = {};
            num=1;
        });
            
        parser.addListener("property", function(event){
            var name = event.property,
                parts = event.value.parts,
                i = 0, 
                len = parts.length,
                j;
                
            if (!properties[name]){
                properties[name] = [];
            }    
            
            properties[name].push({ name: event.property, value : event.value, pos:num++ });             
        });
        
        parser.addListener("endrule", function(event){
            var prop,
                i, len,
                standard,
                needed,
                actual,
                needsStandard = [];
            
            for (prop in properties){
                if (/(\-(?:ms|moz|webkit|o)\-)/.test(prop)){
                    needsStandard.push({ actual: prop, needed: prop.substring(RegExp.$1.length)});
                }
            }
            
            for (i=0, len=needsStandard.length; i < len; i++){
                needed = needsStandard[i].needed;
                actual = needsStandard[i].actual;

                //special case for Mozilla's border radius
                if (/\-moz\-border\-radius\-(.+)/.test(actual)){
                    standard = "border-" + RegExp.$1.replace(/(left|right)/, "-$1") + "-radius";
                } else {
                    standard = needed; 
                }

                if (!properties[needed]){               
                    reporter.warn("Missing standard property '" + standard + "' to go along with '" + actual + "'.", event.selectors[0].line, event.selectors[0].col, rule); 
                } else {
                    //make sure standard property is last
                    if (properties[needed][0].pos < properties[actual][0].pos){
                        reporter.warn("Standard property '" + standard + "' should come after vendor-prefixed property '" + actual + "'.", event.selectors[0].line, event.selectors[0].col, rule); 
                    }
                }
            }

        });

    }

});