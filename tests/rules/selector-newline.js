(function () {
    "use strict";
    var ruleId = "selector-newline", expectWarning, expectPass;

    expectWarning = function (ruleset, expectedMessage) {
        var result, enabledRules = {};
        enabledRules[ruleId] = 1;
        result = CSSLint.verify(ruleset, enabledRules);
        YUITest.Assert.areEqual(1, result.messages.length);
        YUITest.Assert.areEqual("warning", result.messages[0].type);
        YUITest.Assert.areEqual(expectedMessage, result.messages[0].message);
    };

    expectPass = function (ruleset) {
        var result, enabledRules = {};
        enabledRules[ruleId] = 1;
        result = CSSLint.verify(ruleset, enabledRules);
        YUITest.Assert.areEqual(0, result.messages.length);
    };

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: ruleId + " Rule Errors",

        "a newline in a selector should result in a warning": function () {
            expectWarning(".foo\n.bar{}", "newline character found in selector (forgot a comma?)");
        },
        "a newline between selectors should not result in a warning": function () {
            expectPass(".foo,\n.bar{}");
        },
        "'+' or '>' should not result in a warning": function () {
            expectPass(".foo > .bar,\n.foo + .bar,\n.foo >\n.bar{}");
        }
    }));

}());
