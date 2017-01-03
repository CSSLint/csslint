/*global YUITest, CSSLint*/
(function () {

    var ruleId = "no-new-lines-in-selectors", expectWarning, expectPass;

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

        "a new-line in a selector should result in a warning": function () {
            expectWarning(".foo\n.bar{}", "new-line character found in selector (forgot a comma?)");
        },
        "a new-line between selectors should not result in a warning": function () {
            expectPass(".foo,\n.bar{}");
        }
    }));

}());