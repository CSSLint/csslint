/*global CSSLint*/
/*
 * Rule: Always specify generic font-family alternative
 */
CSSLint.addRule({

    //rule information
    id: "generic-font-family",
    name: "Generic font family",
    desc: "Check for generic font family presence",
    browsers: "All",

    //initialization
    init: function(parser, reporter){

        var rule = this,
            genericFonts = { 
                'serif': 1, 
                'sans-serif': 2, 
                'fantasy': 3, 
                'monospace': 4, 
                'cursive': 5 
            },
            fontFaceRule = false;

        // Disable checking inside @font-face block
        parser.addListener("startfontface", function(){
            fontFaceRule = true;
        });

        parser.addListener("endfontface", function(){
            fontFaceRule = false;
        });

        parser.addListener("property", function(event){

            var property = event.property,
                propertyName = property.text.toLowerCase(),
                valueParts = event.value.parts,
                hasGeneric = false,
                i, l, value, type, fontName;

            // Check if we inside @font-face rule
            if(fontFaceRule) {
                return;
            }

            if(propertyName == "font" || propertyName == "font-family") {
                
                // Special case "font: inherit"
                if(propertyName == 'font' && 
                    valueParts.length == 1 && 
                    valueParts[0].type == 'identifier' && 
                    valueParts[0].text == 'inherit') {
                    return;
                }

                for(i = 0, l = valueParts.length; i < l; i++) {
                    value = valueParts[i];
                    type = value.type;
                    if(type == 'identifier') {                        
                        if(value.text in genericFonts) {
                            hasGeneric = true;
                            break;
                        }
                    } else if(type == 'string') {

                        // Quoted generic are not generics
                        fontName = value.text.substr(1, value.text.length - 2);
                        if(fontName in genericFonts) {  
                            hasGeneric = true;                          
                            reporter.report("Generic font-family specified as string, not as an identifier (" + 
                                            value.text + " instead of " + fontName + "). Consider removing quotes.", 
                                            value.line,
                                            value.col,
                                            rule);
                        }
                    }
                }

                if(!hasGeneric) {
                    reporter.report("No generic font-family alternative specified. Consider adding one of the following:\n" +
                                  "serif, sans-serif, monospace, fantasy, cursive.",
                                  event.line,
                                  event.col,
                                  rule);
                }
            }
        });

    }

});