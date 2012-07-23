(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "JUNIT XML formatter test",

        "File with no problems should say so": function(){

            var result = { messages: [], stats: [] },
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites></testsuites>";
            Assert.areEqual(expected, CSSLint.format(result, "FILE", "junit-xml"));

        },

        "File with problems should list them": function(){

            var result = { messages: [
                     { type: "warning", line: 1, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: { name: "A Rule"} },
                     { type: "error", line: 2, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: { name: "Some Other Rule"} }
                ], stats: [] },

                file = "<testsuite time=\"0\" tests=\"2\" skipped=\"0\" errors=\"2\" failures=\"0\" package=\"net.csslint\" name=\"FILE\">",
                error1 = "<testcase time=\"0\" name=\"net.csslint.ARule\"><error message=\"BOGUS\"><![CDATA[1:1:ALSO BOGUS]]></error></testcase>",
                error2 = "<testcase time=\"0\" name=\"net.csslint.SomeOtherRule\"><error message=\"BOGUS\"><![CDATA[2:1:ALSO BOGUS]]></error></testcase>",
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites>" + file + error1 + error2 + "</testsuite></testsuites>",
                actual = CSSLint.format(result, "FILE", "junit-xml");

            Assert.areEqual(expected, actual);
        
        },

        "Formatter should escape special characters": function() {

            var specialCharsSting = 'sneaky, "sneaky", <sneaky>',
                result = { messages: [
                     { type: "warning", line: 1, col: 1, message: specialCharsSting, evidence: "ALSO BOGUS", rule: [] },
                     { type: "error", line: 2, col: 1, message: specialCharsSting, evidence: "ALSO BOGUS", rule: [] }
                ], stats: [] },

                file = "<testsuite time=\"0\" tests=\"2\" skipped=\"0\" errors=\"2\" failures=\"0\" package=\"net.csslint\" name=\"FILE\">",
                error1 = "<testcase time=\"0\" name=\"\"><error message=\"sneaky, 'sneaky', &lt;sneaky&gt;\"><![CDATA[1:1:ALSO BOGUS]]></error></testcase>",
                error2 = "<testcase time=\"0\" name=\"\"><error message=\"sneaky, 'sneaky', &lt;sneaky&gt;\"><![CDATA[2:1:ALSO BOGUS]]></error></testcase>",
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites>" + file + error1 + error2 + "</testsuite></testsuites>",
                actual = CSSLint.format(result, "FILE", "junit-xml");

            Assert.areEqual(expected, actual);

        }

    }));
})();
