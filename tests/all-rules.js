/*
 * This file contains generic tests that are run against every rule. Early on,
 * we found some common rule patterns that would cause errors under certain
 * conditions. Instead of tracking them down individually, this file runs
 * the same tests on every defined rule to track down these patterns.
 *
 * When run in addition to the other tests, this causes the Rhino CLI test
 * to fail due to Java stack overflow. This must be run separate from other tests.
 */

/*jshint loopfunc: true */

(function(){
    "use strict";
    var Assert = YUITest.Assert,
        suite   = new YUITest.TestSuite("General Tests for all Rules"),
        rules   = CSSLint.getRules(),
        len     = rules.length,
        i;

    for (i=0; i < len; i++){

        (function(i, rules){

            suite.add(new YUITest.TestCase({

                name: "General Tests for " + rules[i].id,

                setUp: function(){
                    this.options = {};
                    this.options[rules[i].id] = 1;
                },

                "Using @viewport should not result in an error": function(){
                    var result = CSSLint.verify("@viewport { width: auto; }", this.options);
                    Assert.areEqual(0, result.messages.length);
                },

                "Using @keyframes should not result in an error": function(){
                    var result = CSSLint.verify("@keyframes resize { 0% {padding: 0;} 50% {padding: 0;} 100% {padding: 0;}}", this.options);
                    Assert.areEqual(0, result.messages.length);
                },

                "Using @page should not result in an error": function(){
                    var result = CSSLint.verify("@page { width: 100px; }", this.options);
                    Assert.areEqual(0, result.messages.length);
                },

                "Using @page @top-left should not result in an error": function(){
                    var result = CSSLint.verify("@page { @top-left { content: ''; } }", this.options);
                    Assert.areEqual(0, result.messages.length);
                },

                "Using a regular rule should not result in an error": function(){
                    var result = CSSLint.verify("body { margin: 0; }", this.options);
                    Assert.areEqual(0, result.messages.length);
                }

            }));

        })(i, rules);

    }

    YUITest.TestRunner.add(suite);

})();
