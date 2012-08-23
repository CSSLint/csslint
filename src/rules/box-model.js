/*global CSSLint*/

/*
 * Rule: Don't use width or height when using padding or border. 
 */
CSSLint.addRule({

    //rule information
    id: "box-model",
    name: "Beware of broken box size",
    desc: "Don't use width or height when using padding or border.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            widthProperties = {
                border: 1,
                "border-left": 1,
                "border-right": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1
            },
            heightProperties = {
                border: 1,
                "border-bottom": 1,
                "border-top": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-top": 1
            },
            properties,
            boxSizing = false;

        function startRule(){
            properties = {};
            boxSizing = false;
        }

        function endRule(){
            var prop, value;
            
            if (!boxSizing) {
                if (properties.height){
                    for (prop in heightProperties){
                        if (heightProperties.hasOwnProperty(prop) && properties[prop]){
                            value = properties[prop].value;
                            //special case for padding
                            if (!(prop == "padding" && value.parts.length === 2 && value.parts[0].value === 0)){
                                reporter.report("Using height with " + prop + " can sometimes make elements larger than you expect.", properties[prop].line, properties[prop].col, rule);
                            }
                        }
                    }
                }

                if (properties.width){
                    for (prop in widthProperties){
                        if (widthProperties.hasOwnProperty(prop) && properties[prop]){
                            value = properties[prop].value;
                            
                            if (!(prop == "padding" && value.parts.length === 2 && value.parts[1].value === 0)){
                                reporter.report("Using width with " + prop + " can sometimes make elements larger than you expect.", properties[prop].line, properties[prop].col, rule);
                            }
                        }
                    }
                }   
            }     
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule); 

        parser.addListener("property", function(event){
            var name = event.property.text.toLowerCase();
            
            if (heightProperties[name] || widthProperties[name]){
                if (!/^0\S*$/.test(event.value) && !(name == "border" && event.value == "none")){
                    properties[name] = { line: event.property.line, col: event.property.col, value: event.value };
                }
            } else {
                if (/^(width|height)/i.test(name) && /^(length|percentage)/.test(event.value.parts[0].type)){
                    properties[name] = 1;
                } else if (name == "box-sizing") {
                    boxSizing = true;
                }
            }
            
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
        parser.addListener("endpage", endRule);
        parser.addListener("endpagemargin", endRule);
        parser.addListener("endkeyframerule", endRule);         
    }

});