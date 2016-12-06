/*
 * Rule: You should always end your font/font-family declarations with sans-serif, serif, or monospace.
 */

/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "font-stack",
    name: "Disallow incomplete font stacks",
    desc: "Checks if font and font-family declarations end with a sans-serif, serif, or monospace.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            whiteList = ["sans-serif", "serif", "monospace"], // "cursive" often equals comic sans and "fantasy" can mean virtually anything
            onTheWhitelist,
            trim;

        onTheWhitelist = function (thing) {
            var i;
            for (i = whiteList.length; i--;) {
                if (whiteList[i] === thing) {
                    return true;
                }
            }
            return false;
        };

        trim = function (s) {
            return s.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
        };

        //check for use of "font" and "font-size"
        parser.addListener("property", function(event){
            var parts, lastPart, pieces, lastPiece;
            if (event.property.text === "font" || event.property.text === "font-family"){
                parts = event.value.parts;
                lastPart = parts[parts.length - 1];

                // With "font-family: sans serif;" (note the missing dash), the last part would be "serif", which *is* on the whitelist.
                // In order to be able to catch this, we have to chop it up manually using slightly different rules.
                pieces = event.value.text.split(',');
                lastPiece = pieces[pieces.length - 1];

                if (!onTheWhitelist(trim(lastPiece))) {
                    reporter.report("Did not find 'sans-serif', 'serif', or 'monospace' at the end of the " + event.property.text + " declaration.", lastPart.line, lastPart.col, rule);
                }
            }
        });
    }

});