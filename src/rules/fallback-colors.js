CSSLint.addRule({

    //rule information
    id: "fallback-colors",
    name: "Require fallback colors",
    desc: "For older browsers that don't support RGBA, HSL, or HSLA, provide a fallback color.",
    browsers: "IE6,IE7,IE8",

    //initialization
    init: function(parser, reporter){
        "use strict";
        var rule = this,
            lastProperty,
            propertiesToCheck = {
                color: 1,
                background: 1,
                "border-color": 1,
                "border-top-color": 1,
                "border-right-color": 1,
                "border-bottom-color": 1,
                "border-left-color": 1,
                border: 1,
                "border-top": 1,
                "border-right": 1,
                "border-bottom": 1,
                "border-left": 1,
                "background-color": 1
            },
            properties;

        function startRule(){
            properties = {};
            lastProperty = null;
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event){
            var property = event.property,
                name = property.text.toLowerCase(),
                parts = event.value.parts,
                i = 0,
                colorType = "",
                len = parts.length;

            if(propertiesToCheck[name]){
                while(i < len){
                    if (parts[i].type === "color"){
                        if ("alpha" in parts[i] || "hue" in parts[i]){

                            if (/([^\)]+)\(/.test(parts[i])){
                                colorType = RegExp.$1.toUpperCase();
                            }

                            if (!lastProperty || (lastProperty.property.text.toLowerCase() !== name || lastProperty.colorType !== "compat")){
                                reporter.report("Fallback " + name + " (hex or RGB) should precede " + colorType + " " + name + ".", event.line, event.col, rule);
                            }
                        } else {
                            event.colorType = "compat";
                        }
                    }

                    i++;
                }
            }

            lastProperty = event;
        });

    }

});
