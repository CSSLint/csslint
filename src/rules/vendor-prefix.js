/*
 * Rule: When using a vendor-prefixed property or value, make sure to
 * include the standard one.
 */
CSSLint.addRule({

    //rule information
    id: "zero-units",
    name: "Zero Units",
    desc: "When using a vendor-prefixed property or value, make sure to include the standard one.",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this,
            properties;
            
        parser.addListener("startrule", function(event){
            properties = {};
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
            
            properties[name].push({ name: event.property, value : event.value });
            
            while(i < len){
                if (parts[i].units && parts[i].value === 0){
                    reporter.warn("Values of 0 shouldn't have units specified.", parts[i].line, parts[i].col, rule);
                }
                i++;
            }
            
        });
        
        parser.addListener("endrule", function(event){
            var prop,
                i, len,
                needsStandard = [];
            
            for (prop in properties){
                if (/(\-(?:ms|moz|webkit|o)\-)/.test(prop)){
                    needsStandard.push({ actual: prop, needed: prop.substring(RegExp.$1.length)});
                }
            }
            
            for (i=0, len=needsStandard.length; i < len; i++){
                if (!properties[needsStandard[i].needed]){
                    reporter.warn("Missing standard property '" + needsStandard[i].needed + "' to go along with '" + needsStandard[i].actual + "'.", event.selectors[0].line, event.selectors[0].col, rule); 
                }            
            }

        });

    }

});