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
    
    //initialization
    init: function(parser, reporter){
    
        var propertiesToCheck = {
                display: 1,
                "float": 1,
                height: 1,
                width: 1,
                margin: 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-bottom": 1,
                "margin-padding": 1,                
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-bottom": 1,
                "padding-padding": 1,                
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
                        reportProperty("height", display, this);
                        reportProperty("width", display, this);
                        reportProperty("margin", display, this);
                        reportProperty("margin-left", display, this);
                        reportProperty("margin-right", display, this);
                        reportProperty("margin-top", display, this);
                        reportProperty("margin-bottom", display, this);
                        reportProperty("padding", display, this);
                        reportProperty("padding-left", display, this);
                        reportProperty("padding-right", display, this);
                        reportProperty("padding-top", display, this);
                        reportProperty("padding-bottom", display, this);                
                        reportProperty("float", display, this);
                        break;
                        
                    case "block":
                        //vertical-align should not be used with block
                        reportProperty("vertical-align", display, this);
                        break;
                        
                    case "inline-block":
                        //float should not be used with inline-block
                        reportProperty("float", display, this);
                        break;
                        
                    default:
                        //margin, float should not be used with table
                        if (display.indexOf("table-") == 0){
                            reportProperty("margin", display, this);
                            reportProperty("margin-left", display, this);
                            reportProperty("margin-right", display, this);
                            reportProperty("margin-top", display, this);
                            reportProperty("margin-bottom", display, this);
                            reportProperty("float", display, this);                        
                        }
                        
                        //otherwise do nothing            
                }
            }
          
        });     
        
        
        function reportProperty(name, display, rule){
            if (properties[name]){
                reporter.warn(name + " can't be used with display: " + display + ".", properties[name].line, properties[name].col, rule);
            }            
        }
    }

});