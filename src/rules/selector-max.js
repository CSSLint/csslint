/*
 * Rule: Warn people with approaching the IE 4095 limit 
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "selector-max-approaching",
    name: "Warn when approaching the 4095 limit for IE",
    desc: "Will warn when selector count is >= 3800 rules.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
		var rule = this,
			count = 0,
			notFired = true;

		parser.addListener('startrule',function(event){
			count++;
			if(count >= 3800 && notFired){
				notFired=false;
				var selectors = event.selectors;
				reporter.report("Rule is the number 3800 and approaching the 4095 IE limit.", selectors[0].line, selectors[0].col, rule);
			}
		});
	}

});



CSSLint.addRule({

    //rule information
    id: "selector-max",
    name: "Error when past the 4095 limit for IE",
    desc: "Will error when selector count is > 4095.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
		var rule = this,
			count = 0,
			notFired = true;

		parser.addListener('startrule',function(event){
			count++;
			if(count >= 4096 && notFired){
				notFired=false;
				var selectors = event.selectors;
				reporter.report("Rule is the number 4096 and past the 4095 IE limit.", selectors[0].line, selectors[0].col, rule);
			}
		});
	}

});