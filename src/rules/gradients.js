/*
 * Rule: When using a vendor-prefixed gradient, make sure to use them all.
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "gradients",
    name: "Require all gradient definitions",
    desc: "When using a vendor-prefixed gradient, make sure to use them all.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            gradients;

        parser.addListener("startrule", function(){
            gradients = {
                moz: 0,
                webkit: 0,
                oldWebkit: 0,
                o: 0
            };
        });

        parser.addListener("property", function(event){

            if (/\-(moz|o|webkit)(?:\-(?:linear|radial))\-gradient/i.test(event.value)){
                gradients[RegExp.$1] = 1;
            } else if (/\-webkit\-gradient/i.test(event.value)){
                gradients.oldWebkit = 1;
            }

        });

        parser.addListener("endrule", function(event){
            var missing = [];

            if (!gradients.moz){
                missing.push("Firefox 3.6+");
            }

            if (!gradients.webkit){
                missing.push("Webkit (Safari 5+, Chrome)");
            }
            
            if (!gradients.oldWebkit){
                missing.push("Old Webkit (Safari 4+, Chrome)");
            }

            if (!gradients.o){
                missing.push("Opera 11.1+");
            }

            if (missing.length && missing.length < 4){            
                reporter.report("Missing vendor-prefixed CSS gradients for " + missing.join(", ") + ".", event.selectors[0].line, event.selectors[0].col, rule); 
            }

        });

    }

});
