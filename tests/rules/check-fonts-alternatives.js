(function(){

  /*global YUITest, CSSLint*/
  var 
    	Assert = YUITest.Assert,
    	testSpec = { "check-fonts-alternatives": 1 };

 	function mkErrorMessage(font, alternative) {
 		return "No MacOS-alternative for font '" + font + "'. Consider adding '" + alternative + "'.";
 	}						

  YUITest.TestRunner.add(new YUITest.TestCase({

   	name: "Mac alternative font checker - font property",

    "No erros when no Mac alternative needed": function(){
      var result = CSSLint.verify(".c { font-family: Arial }", testSpec);
            
      Assert.areEqual(0, result.messages.length);
    },

		"No erros when Mac alternative is specified": function(){
			var result = CSSLint.verify(".c { font: 14px Tahoma, Geneva }", testSpec);
            
      Assert.areEqual(0, result.messages.length);
    },

    "Font size + family form": function(){
      var result = CSSLint.verify(".c { font: 14px Lucida Console }", testSpec);
            
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual(mkErrorMessage("Lucida Console", "Monaco"), result.messages[0].message);
    },

    "Font variant, size, family form": function(){
      var result = CSSLint.verify(".c { font: italic 14px MS Serif }", testSpec);
            
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual(mkErrorMessage("MS Serif", "New York"), result.messages[0].message);
    },

    "Font weight, size, family form": function(){
      var result = CSSLint.verify(".c { font: bold 14px MS Serif }", testSpec);
            
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual(mkErrorMessage("MS Serif", "New York"), result.messages[0].message);
    },

    "Font weight as number, size + family form": function(){
      var result = CSSLint.verify(".c { font: 500 14px MS Serif }", testSpec);
            
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual(mkErrorMessage("MS Serif", "New York"), result.messages[0].message);
    },

    "Font size/height + family form": function(){
      var result = CSSLint.verify(".c { font: 14px/20px MS Serif }", testSpec);
            
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual(mkErrorMessage("MS Serif", "New York"), result.messages[0].message);
    },

    "Font size (absolute) + family form": function(){
      var result = CSSLint.verify(".c { font: xx-small MS Serif }", testSpec);
            
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual(mkErrorMessage("MS Serif", "New York"), result.messages[0].message);
    },

    "Font size (relative) + family form": function(){
      var result = CSSLint.verify(".c { font: larger MS Serif }", testSpec);
            
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual(mkErrorMessage("MS Serif", "New York"), result.messages[0].message);
    },

    "Font - badly formed rule": function(){
      // This is equal to identifier 'Tahoma Tahoma Tahoma'
      var result = CSSLint.verify(".c { font: 14px Tahoma Tahoma Tahoma }", testSpec);
            
      Assert.areEqual(0, result.messages.length);
    },

    "Multiple font families without an alternative": function(){
      var result = CSSLint.verify(".c { font: 14px MS Serif, Tahoma, Verdana }", testSpec);
            
      Assert.areEqual(2, result.messages.length);
      Assert.areEqual(mkErrorMessage("MS Serif", "New York"), result.messages[0].message);
      Assert.areEqual(mkErrorMessage("Tahoma", "Geneva"), result.messages[1].message);
    },

    "Font = inherit": function() {
      var result = CSSLint.verify(".c { font: inherit }", testSpec);
            
      Assert.areEqual(0, result.messages.length);	
    }

  }));

	YUITest.TestRunner.add(new YUITest.TestCase({

   	name: "Mac alternative font checker - font-family property",

    "No erros when no Mac alternative needed": function(){
      var result = CSSLint.verify(".c { font-family: Arial }", testSpec);
            
      Assert.areEqual(0, result.messages.length);
    },

		"No erros when Mac alternative is specified": function(){
      var result = CSSLint.verify(".c { font-family: Tahoma, Geneva }", testSpec);
            
      Assert.areEqual(0, result.messages.length);
    },

    "No alternative specified, font-family without space": function(){
      var result = CSSLint.verify(".c { font-family: Tahoma }", testSpec);
            
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual(mkErrorMessage("Tahoma", "Geneva"), result.messages[0].message);
    },

    "No alternative specified, font-family with space": function(){
      var result = CSSLint.verify(".c { font-family: MS Serif }", testSpec);
            
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual(mkErrorMessage("MS Serif", "New York"), result.messages[0].message);
    },

    "No alternative specified, font-family with space, multiple families": function(){
      var result = CSSLint.verify(".c { font-family: MS Serif, Tahoma, Arial }", testSpec);
            
      Assert.areEqual(2, result.messages.length);
      Assert.areEqual(mkErrorMessage("MS Serif", "New York"), result.messages[0].message);
      Assert.areEqual(mkErrorMessage("Tahoma", "Geneva"), result.messages[1].message);
    },
    
    "No detection inside @font-face rule 1": function() {
      var result = CSSLint.verify("@font-face { font-family: MyFont; }", testSpec);
            
      Assert.areEqual(0, result.messages.length);	
    },

    "No detection inside @font-face rule 2": function() {
      var result = CSSLint.verify("@font-face { font-family: Tahoma; }", testSpec);
            
      Assert.areEqual(0, result.messages.length); 
    }

  }));

})();   