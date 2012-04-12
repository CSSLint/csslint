(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Lint XML formatter test",
        
        "File with no problems should say so": function(){
            var result = { messages: [], stats: [] },
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><lint></lint>";
            Assert.areEqual(expected, CSSLint.format(result, "FILE", "lint-xml"));
        },

        "File with problems should list them": function(){
            var result = { messages: [
                     { type: "warning", line: 1, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: [] },
                     { type: "error", line: 2, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: [] }
                ], stats: [] },
                file = "<file name=\"FILE\">",
                error1 = "<issue line=\"1\" char=\"1\" severity=\"warning\" reason=\"BOGUS\" evidence=\"ALSO BOGUS\"/>",
                error2 = "<issue line=\"2\" char=\"1\" severity=\"error\" reason=\"BOGUS\" evidence=\"ALSO BOGUS\"/>",
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><lint>" + file + error1 + error2 + "</file></lint>",
                actual = CSSLint.format(result, "FILE", "lint-xml");
            Assert.areEqual(expected, actual);
        },

        "Formatter should escape double quotes": function() {
            var doubleQuotedEvidence = 'sneaky, "sneaky", <sneaky>, sneak & sneaky',
                result = { messages: [
                     { type: "warning", line: 1, col: 1, message: "BOGUS", evidence: doubleQuotedEvidence, rule: [] },
                     { type: "error", line: 2, col: 1, message: "BOGUS", evidence: doubleQuotedEvidence, rule: [] }
                ], stats: [] },
                file = "<file name=\"FILE\">",
                error1 = "<issue line=\"1\" char=\"1\" severity=\"warning\" reason=\"BOGUS\" evidence=\"sneaky, 'sneaky', &lt;sneaky&gt;, sneak &amp; sneaky\"/>",
                error2 = "<issue line=\"2\" char=\"1\" severity=\"error\" reason=\"BOGUS\" evidence=\"sneaky, 'sneaky', &lt;sneaky&gt;, sneak &amp; sneaky\"/>",
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><lint>" + file + error1 + error2 + "</file></lint>",
                actual = CSSLint.format(result, "FILE", "lint-xml");
            Assert.areEqual(expected, actual);
        }
    }));
})();
