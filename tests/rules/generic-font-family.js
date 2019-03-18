(function(){

   /*global YUITest, CSSLint*/
   var 
    	Assert = YUITest.Assert,
    	testSpec = { "generic-font-family": 1 },
    	noGenericsError = "No generic font-family alternative specified. Consider adding one of the following:\n" + 
    							"serif, sans-serif, monospace, fantasy, cursive.";

 	function quotedGenericError(fontFace, quote) {
 		return "Generic font-family specified as string, not as an identifier (" + 
              quote + fontFace + quote + " instead of " + fontFace + "). Consider removing quotes.";
 	}						

   function mkTestSnippet(font) {
   	return ".c { font: 14px " + font + " }";	
   }

   function mkFontFamilySnippet(font) {
   	return ".c { font-family: " + font + " }";	
   }

   YUITest.TestRunner.add(new YUITest.TestCase({

   	name: "Generic font family checker - font property",

		"No any generic causes error": function(){
			var result = CSSLint.verify(mkTestSnippet('Tahoma'), testSpec);
            
         Assert.areEqual(1, result.messages.length);
    		Assert.areEqual(noGenericsError, result.messages[0].message);
      },

      "Single-quoted generic causes error": function(){
			var result = CSSLint.verify(mkTestSnippet("Tahoma, 'serif'"), testSpec);
            
         Assert.areEqual(1, result.messages.length);
    		Assert.areEqual(quotedGenericError('serif', '\''), result.messages[0].message);
      },

      "Double-quoted generic causes error": function(){
			var result = CSSLint.verify(mkTestSnippet("Tahoma, \"serif\""), testSpec);
            
         Assert.areEqual(1, result.messages.length);
    		Assert.areEqual(quotedGenericError('serif', '\"'), result.messages[0].message);
      },

      "No error with serif": function() {
      	var result = CSSLint.verify(mkTestSnippet("Tahoma, serif"), testSpec);
         
         Assert.areEqual(0, result.messages.length);			
      },

      "No error with sans-serif": function() {
      	var result = CSSLint.verify(mkTestSnippet("Tahoma, sans-serif"), testSpec);
            
         Assert.areEqual(0, result.messages.length);			
      },

      "No error with cursive": function() {
      	var result = CSSLint.verify(mkTestSnippet("Tahoma, cursive"), testSpec);
            
         Assert.areEqual(0, result.messages.length);			
      },

      "No error with monospace": function() {
      	var result = CSSLint.verify(mkTestSnippet("Tahoma, monospace"), testSpec);
            
         Assert.areEqual(0, result.messages.length);			
      },

      "No error with fantasy": function() {
      	var result = CSSLint.verify(mkTestSnippet("Tahoma, fantasy"), testSpec);
            
         Assert.areEqual(0, result.messages.length);			
      },

      "'font: inherit' causes no error": function() {
      	var result = CSSLint.verify(".c { font: inherit }", testSpec);
            
         Assert.areEqual(0, result.messages.length);	
      }

   }));

	YUITest.TestRunner.add(new YUITest.TestCase({

   	name: "Generic font family checker - font-family property",

		"No any generic causes error": function(){
			var result = CSSLint.verify(mkFontFamilySnippet('Tahoma'), testSpec);
            
         Assert.areEqual(1, result.messages.length);
    		Assert.areEqual(noGenericsError, result.messages[0].message);
      },

      "Single-quoted generic causes error": function(){
			var result = CSSLint.verify(mkFontFamilySnippet("Tahoma, 'serif'"), testSpec);
            
         Assert.areEqual(1, result.messages.length);
    		Assert.areEqual(quotedGenericError('serif', '\''), result.messages[0].message);
      },

      "Double-quoted generic causes error": function(){
			var result = CSSLint.verify(mkFontFamilySnippet("Tahoma, \"serif\""), testSpec);
            
         Assert.areEqual(1, result.messages.length);
    		Assert.areEqual(quotedGenericError('serif', '\"'), result.messages[0].message);
      },

      "No error with serif": function() {
      	var result = CSSLint.verify(mkFontFamilySnippet("Tahoma, serif"), testSpec);
         
         Assert.areEqual(0, result.messages.length);			
      },

      "No error with sans-serif": function() {
      	var result = CSSLint.verify(mkFontFamilySnippet("Tahoma, sans-serif"), testSpec);
            
         Assert.areEqual(0, result.messages.length);			
      },

      "No error with cursive": function() {
      	var result = CSSLint.verify(mkFontFamilySnippet("Tahoma, cursive"), testSpec);
            
         Assert.areEqual(0, result.messages.length);			
      },

      "No error with monospace": function() {
      	var result = CSSLint.verify(mkFontFamilySnippet("Tahoma, monospace"), testSpec);
            
         Assert.areEqual(0, result.messages.length);			
      },

      "No error with fantasy": function() {
      	var result = CSSLint.verify(mkFontFamilySnippet("Tahoma, fantasy"), testSpec);
            
         Assert.areEqual(0, result.messages.length);			
      },

      "No detection inside @font-face rule": function() {
      	var result = CSSLint.verify("@font-face { font-family: MyFont; }", testSpec);
            
         Assert.areEqual(0, result.messages.length);	
      }

   }));

})();   
