/*
 * Rule: Certain properties don't play well with certain display values. 
 * - float should not be used with inline-block
 * - height, width, margin, padding, float should not be used with inline
 * - vertical-align should not be used with block
 * - margin, float should not be used with table-*
 */
CSSLint.addRule({

    //rule information
    id: "display-property-grouping",
    name: "Display Property Grouping",
    desc: "Certain properties shouldn't be used with certain display property values.",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this;
   
        var propertiesToCheck = {
                display: 1,
                "float": 1,
                height: 1,
                width: 1,
                margin: 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-bottom": 1,
                "margin-top": 1,                
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-bottom": 1,
                "padding-top": 1,                
                "vertical-align": 1
            },
            properties;
    
        parser.addListener("startrule", function(event){
            properties = {};            
        });     

        parser.addListener("property", function(event){
            var name = event.property;
            
            if (propertiesToCheck[name]){
                properties[name] = { value: event.value.text, line: name.line, col: name.col };
            }        
        });     
        
        parser.addListener("endrule", function(event){
        
            var display = properties.display ? properties.display.value : null;
            if (display){
                switch(display){
             
                    case "inline":
                        //height, width, margin, padding, float should not be used with inline
                        reportProperty("height", display);
                        reportProperty("width", display);
                        reportProperty("margin", display);
                        reportProperty("margin-left", display);
                        reportProperty("margin-right", display);
                        reportProperty("margin-top", display);
                        reportProperty("margin-bottom", display);
                        reportProperty("padding", display);
                        reportProperty("padding-left", display);
                        reportProperty("padding-right", display);
                        reportProperty("padding-top", display);
                        reportProperty("padding-bottom", display);                
                        reportProperty("float", display);
                        break;
                        
                    case "block":
                        //vertical-align should not be used with block
                        reportProperty("vertical-align", display);
                        break;
                        
                    case "inline-block":
                        //float should not be used with inline-block
                        reportProperty("float", display);
                        break;
                        
                    default:
                        //margin, float should not be used with table
                        if (display.indexOf("table-") == 0){
                            reportProperty("margin", display);
                            reportProperty("margin-left", display);
                            reportProperty("margin-right", display);
                            reportProperty("margin-top", display);
                            reportProperty("margin-bottom", display);
                            reportProperty("float", display);                        
                        }
                        
                        //otherwise do nothing            
                }
            }
          
        });     
        
        
        function reportProperty(name, display){
            if (properties[name]){
                reporter.warn(name + " can't be used with display: " + display + ".", properties[name].line, properties[name].col, rule);
            }            
        }
    }

});