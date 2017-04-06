(function() {
    "use strict";

    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "selector naming convention errors",

        "Subselectors following the camelcase pattern should result in an error when BEM is used": function() {
            var result = CSSLint.verify("div .fooBar { display: block; }", { "selector-pattern": 1 }),
                msg = /Selector naming convention \(\w+\) not followed\./;

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(msg.test(result.messages[0].message), true);
        },

        "Selectors following the camelcase pattern should result in an error when BEM is used": function() {
            var result = CSSLint.verify(".fooBar { display: block; }", { "selector-pattern": 1 }),
                msg = /Selector naming convention \(\w+\) not followed\./;

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(msg.test(result.messages[0].message), true);
        },

        "Subselectors following the camelcase pattern should not result in an error when camelcase is used": function() {
            var result = CSSLint.verify("div .fooBar { display: block; }", { "selector-pattern": 1 }, { "name-pattern": "camelcase"});

            Assert.areEqual(0, result.messages.length);
        },

        "Selectors following the camelcase pattern should not result in an error when camelcase is used": function() {
            var result = CSSLint.verify(".fooBar { display: block; }", { "selector-pattern": 1 }, { "name-pattern": "camelcase"});

            Assert.areEqual(0, result.messages.length);
        },

        "Subselectors following the snakecase pattern should result in an error when BEM is used": function() {
            var result = CSSLint.verify("div .foo_bar { display: block; }", { "selector-pattern": 1 }),
                msg = /Selector naming convention \(\w+\) not followed\./;

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(msg.test(result.messages[0].message), true);
        },

        "Selectors following the snakecase pattern should result in an error when BEM is used": function() {
            var result = CSSLint.verify(".foo_bar { display: block; }", { "selector-pattern": 1 }),
                msg = /Selector naming convention \(\w+\) not followed\./;

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(msg.test(result.messages[0].message), true);
        },

        "Subselectors following the snakecase pattern should not result in an error when snakecase is used": function() {
            var result = CSSLint.verify("div .foo_bar { display: block; }", { "selector-pattern": 1 }, { "name-pattern": "snakecase"});

            Assert.areEqual(0, result.messages.length);
        },

        "Selectors following the snakecase pattern should not result in an error when snakecase is used": function() {
            var result = CSSLint.verify(".foo_bar { display: block; }", { "selector-pattern": 1 }, { "name-pattern": "snakecase"});

            Assert.areEqual(0, result.messages.length);
        },

        "Subselectors following the BEM pattern should result in an error when BEM is not used": function() {
            var result = CSSLint.verify("div .foo-bar { display: block; }", { "selector-pattern": 1 }, { "name-pattern": "camelcase"}),
                msg = /Selector naming convention \(\w+\) not followed\./;

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(msg.test(result.messages[0].message), true);
        },

        "Selectors following the BEM pattern should result in an error when BEM is not used": function() {
            var result = CSSLint.verify(".foo-bar { display: block; }", { "selector-pattern": 1 }, { "name-pattern": "snakecase"}),
                msg = /Selector naming convention \(\w+\) not followed\./;

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(msg.test(result.messages[0].message), true);
        },

        "Subselectors following the BEM pattern should not result in an error": function() {
            var result = CSSLint.verify("div .foo-bar { display: block; }", { "selector-pattern": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        "Selectors following the BEM pattern should not result in an error": function() {
            var result = CSSLint.verify(".foo-bar { display: block; }", { "selector-pattern": 1 });

            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
