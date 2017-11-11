(function(){
  "use strict";

	/*global YUITest, CSSLint*/
	var Assert = YUITest.Assert;

	YUITest.TestRunner.add(new YUITest.TestCase({

		name: "Performant Transitions Tests",

		"Using a non-performant transition property (width) should result in one warning": function(){
			var result = CSSLint.verify("div { transition: width 0.5s linear; }", { "performant-transitions": 1 });
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual("warning", result.messages[0].type);
      Assert.areEqual("Unexpected transition property 'width 0.5s linear'", result.messages[0].message);
		},
		"Using a non-performant and performant transition properties (transform, width) should result in one warning": function(){
			var result = CSSLint.verify("div { transition: transform 0.5s linear, width 0.2s ease-in-out; }", { "performant-transitions": 1 });
      Assert.areEqual(1, result.messages.length);
      Assert.areEqual("warning", result.messages[0].type);
      Assert.areEqual("Unexpected transition property 'width 0.2s ease-in-out'", result.messages[0].message);
		},
		"Using a performant transition property (transform) should result in 0 warnings": function(){
			var result = CSSLint.verify("div { transition: transform 0.5s linear; }", { "performant-transitions": 1 });
      Assert.areEqual(0, result.messages.length);
		},
		"Using a performant transition property (-webkit-transform) should result in 0 warnings": function(){
			var result = CSSLint.verify("div { transition: -webkit-transform 0.5s linea atomr; }", { "performant-transitions": 1 });
      Assert.areEqual(0, result.messages.length);
		},
		"Using a performant transition property (-ms-transform) should result in 0 warnings": function(){
			var result = CSSLint.verify("div { transition: -ms-transform 0.5s linear; }", { "performant-transitions": 1 });
      Assert.areEqual(0, result.messages.length);
		},
		"Using a performant transition property (opacity) should result in 0 warnings": function(){
			var result = CSSLint.verify("div { transition: opacity 0.5s linear; }", { "performant-transitions": 1 });
      Assert.areEqual(0, result.messages.length);
		},
		"Using multiple performant transition properties (opacity, transform) should result in 0 warnings": function(){
			var result = CSSLint.verify("div { transition: opacity 0.5s linear, transform 0.25s ease-in-out; }", { "performant-transitions": 1 });
      Assert.areEqual(0, result.messages.length);
		}
	}));
})();
