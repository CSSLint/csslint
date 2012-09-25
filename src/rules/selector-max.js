/*
 * Rule: Warn people past the IE 4095 limit 
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "selector-max",
    name: "Error when past the 4095 limit for IE",
    desc: "Will error when selector count is > 4095.",
    browsers: "IE",

    //initialization
    init: function(parser, reporter){
		var rule = this,
			count = 0;

		parser.addListener('startrule',function(event){
			count++;
		});

		parser.addListener("endstylesheet", function(){
			if(count>4095){
				reporter.report("You have "+count+" rules. Internet Explorer supports a maximum of 4095 rules. All additional rules will be ignored by IE. Consider refactoring.",0,0,rule);	
			}
		});
	}

});