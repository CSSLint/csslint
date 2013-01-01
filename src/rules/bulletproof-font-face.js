/*
 * Rule: Use the bulletproof @font-face syntax to avoid 404's in old IE
 * (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax)
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "bulletproof-font-face",
    name: "Use the bulletproof @font-face syntax",
    desc: "Use the bulletproof @font-face syntax to avoid 404's in old IE (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax).",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            count = 0,
            fontFaceRule = false,
            firstSrc     = true,
            ruleFailed    = false,
            line, col;

        // Mark the start of a @font-face declaration so we only test properties inside it
        parser.addListener("startfontface", function(event){
            fontFaceRule = true;
        });

        parser.addListener("property", function(event){
            // If we aren't inside an @font-face declaration then just return
            if (!fontFaceRule) {
                return;
            }

            var propertyName = event.property.toString().toLowerCase(),
                value        = event.value.toString();

            // Set the line and col numbers for use in the endfontface listener
            line = event.line;
            col  = event.col;

            // This is the property that we care about, we can ignore the rest
            if (propertyName === 'src') {
                var regex = /^\s?url\(['"].+\.eot\?.*['"]\)\s*format\(['"]embedded-opentype['"]\).*$/i;

                // We need to handle the advanced syntax with two src properties
                if (!value.match(regex) && firstSrc) {
                    ruleFailed = true;
                    firstSrc = false;
                } else if (value.match(regex) && !firstSrc) {
                    ruleFailed = false;
                }
            }


        });

        // Back to normal rules that we don't need to test
        parser.addListener("endfontface", function(event){
            fontFaceRule = false;

            if (ruleFailed) {
                reporter.report("@font-face declaration doesn't follow the fontspring bulletproof syntax.", line, col, rule);
            }
        });
    }
});