(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Checkstyle XML formatter test",

        "File with no problems should say so": function(){
            var result = { messages: [], stats: [] },
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle></checkstyle>";
            Assert.areEqual(expected, CSSLint.format(result, "FILE", "checkstyle-xml"));
        },

        "File with problems should list them": function(){
            var result = { messages: [
                     { type: "warning", line: 1, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: { name: "A Rule"} },
                     { type: "error", line: 2, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: { name: "Some Other Rule"} }
                ], stats: [] },
                file = "<file name=\"FILE\">",
                error1 = "<error line=\"1\" column=\"1\" severity=\"warning\" message=\"BOGUS\" source=\"net.csslint.ARule\"/>",
                error2 = "<error line=\"2\" column=\"1\" severity=\"error\" message=\"BOGUS\" source=\"net.csslint.SomeOtherRule\"/>",
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle>" + file + error1 + error2 + "</file></checkstyle>",
                actual = CSSLint.format(result, "FILE", "checkstyle-xml");
            Assert.areEqual(expected, actual);
        },

        "Formatter should escape special characters": function() {
            var specialCharsSting = 'sneaky, "sneaky", <sneaky>, sneak & sneaky',
                result = { messages: [
                     { type: "warning", line: 1, col: 1, message: specialCharsSting, evidence: "ALSO BOGUS", rule: [] },
                     { type: "error", line: 2, col: 1, message: specialCharsSting, evidence: "ALSO BOGUS", rule: [] }
                ], stats: [] },
                file = "<file name=\"FILE\">",
                error1 = "<error line=\"1\" column=\"1\" severity=\"warning\" message=\"sneaky, &quot;sneaky&quot;, &lt;sneaky&gt;, sneak &amp; sneaky\" source=\"\"/>",
                error2 = "<error line=\"2\" column=\"1\" severity=\"error\" message=\"sneaky, &quot;sneaky&quot;, &lt;sneaky&gt;, sneak &amp; sneaky\" source=\"\"/>",
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle>" + file + error1 + error2 + "</file></checkstyle>",
                actual = CSSLint.format(result, "FILE", "checkstyle-xml");
            Assert.areEqual(expected, actual);
        }

    }));
})();
