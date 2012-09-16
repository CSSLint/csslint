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
			count = 0;

		parser.addListener('startrule',function(event){
			count++;

		});

		parser.addListener("endstylesheet", function(){
			if(count >= 3800){
				reporter.report("You have "+count+" rules. Internet Explorer supports a maximum of 4095 rules. Consider refactoring.",0,0,rule);
			}            
        });
	}

});
