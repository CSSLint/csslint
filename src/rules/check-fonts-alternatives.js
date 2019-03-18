/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "check-fonts-alternatives",
    name: "Check font alternatives",
    desc: "Check font alternatives for Mac OS (OS X, iOS)",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            macMap = {
                "Tahoma": "Geneva",
                "Lucida Console": "Monaco",
                "Lucida Sans Unicode": "Lucida Grande",
                "Palatino Linotype": "Palatino",
                "Book Antiqua": "Palatino",
                "Wingdings": "Zapf Dingbats",
                "MS Sans Serif": "Geneva",
                "MS Serif": "New York"
            },
            skipIdentifiers = {
                // font-style related
                "normal": 1,
                "italic": 2,
                "oblique": 3,
                // any
                "inherit": 4,
                // font-variant related
                "small-caps": 5,
                // font-weight related
                "bold": 6,
                "bolder": 7,
                "lighter": 8,
                // font-size related
                "xx-small": 9, 
                "x-small": 10, 
                "small": 11, 
                "medium": 12,
                "large": 13, 
                "x-large": 14, 
                "xx-large": 15,
                "larger": 16,
                "smaller": 17
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

            // font: [font-style||font-variant||font-weight] font-size[/line-height] font-family | inherit
            // font-style: normal | italic | oblique | inherit
            // font-variant: normal | small-caps | inherit
            // font-weight: bold|bolder|lighter|normal|100|200|300|400|500|600|700|800|900
            // font-size: absolute | relative | value | precents | inherit
            // font-size-absolute: xx-small, x-small, small, medium, large, x-large, xx-large
            // font-size-relative: larger | smaller

            var property = event.property,
                propertyName = property.text.toLowerCase(),
                valueParts = event.value.parts,
                currentRuleFonts = {},
                idStack = [],
                i, l, value;

            // Skip any detection if we inside @font-face block
            if(fontFaceRule) {
                return;
            }

            if(propertyName == "font" || propertyName == "font-family") {
                for(i = 0, l = valueParts.length; i < l; i++) {
                    value = valueParts[i];
                    if(value.type == 'identifier') {
                        // skip not-font-family-related identifiers
                        if(value.text in skipIdentifiers) {
                            continue;
                        }
                        idStack.push(value.text);
                    } else if(value.type == 'operator' && value.text == ',') {
                        currentRuleFonts[idStack.join(' ')] = { line: value.line, col: value.col };
                        idStack = [];
                    }
                }
                if(idStack.length > 0) {
                    currentRuleFonts[idStack.join(' ')] = { line: value.line, col: value.col };
                }

                for(i in currentRuleFonts) {
                    if(currentRuleFonts.hasOwnProperty(i)) {
                        if(i in macMap && currentRuleFonts[macMap[i]] === undefined) {
                            reporter.warn("No MacOS-alternative for font '" + i + "'. " + 
                                          "Consider adding '" + macMap[i] + "'.", 
                                          currentRuleFonts[i].line, 
                                          currentRuleFonts[i].col, 
                                          rule);
                        }
                    }
                }
            }
        });

    }

});