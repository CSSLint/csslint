(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "CSSLint object tests",

        "Adjoining classes should not cause an error": function(){
            var result = CSSLint.verify(".foo.bar{}", { });
            Assert.areEqual(0, result.messages.length);
        },

        "@media (max-width:400px) should not cause an error": function(){
            var result = CSSLint.verify("@media (max-width:400px) {}", { });
            Assert.areEqual(0, result.messages.length);
        },

        "Embedded ruleset should be honored": function(){
            var result = CSSLint.verify("/*csslint bogus, adjoining-classes:true, box-sizing:false */\n.foo.bar{}", {
                'text-indent': 1,
                'box-sizing': 1
            });

            Assert.areEqual(2, result.ruleset['adjoining-classes']);
            Assert.areEqual(1, result.ruleset['text-indent']);
            Assert.areEqual(0, result.ruleset['box-sizing']);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint, Reporter*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Reporter Object Tests",
        
        "Report should cause a warning": function(){
            var reporter = new CSSLint._Reporter([], { "fake-rule": 1});
            reporter.report("Foo", 1, 1, { id: "fake-rule" });
            
            Assert.areEqual(1, reporter.messages.length);
            Assert.areEqual("warning", reporter.messages[0].type);
        },
        
        "Report should cause an error": function(){
            var reporter = new CSSLint._Reporter([], { "fake-rule": 2});
            reporter.report("Foo", 1, 1, { id: "fake-rule" });
            
            Assert.areEqual(1, reporter.messages.length);
            Assert.areEqual("error", reporter.messages[0].type);
        },
        
        "Calling error() should cause an error": function(){
            var reporter = new CSSLint._Reporter([], { "fake-rule": 1});
            reporter.error("Foo", 1, 1, { id: "fake-rule" });
            
            Assert.areEqual(1, reporter.messages.length);
            Assert.areEqual("error", reporter.messages[0].type);
        }

    }));

})();

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

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "Compact formatter",

        "File with no problems should say so": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual("path/to/FILE: Lint Free!", actual);
        },

        "Should have no output when quiet option is specified and no errors": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE", quiet: "true"});
            Assert.areEqual("", actual);
        },

        "File with problems should list them": function() {
            var result = { messages: [ 
                     { type: 'error', line: 2, col: 1, message: 'BOGUS ERROR', evidence: 'BOGUS', rule: [] },
                     { type: 'warning', line: 1, col: 1, message: 'BOGUS WARNING', evidence: 'BOGUS', rule: [] }
                ], stats: [] },
                err = "path/to/FILE: line 2, col 1, Error - BOGUS ERROR\n",
                warning = "path/to/FILE: line 1, col 1, Warning - BOGUS WARNING\n",
                expected = err + warning,
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual(expected, actual);
        },

        "Should output relative file paths": function() {
            var result = { messages: [ 
                    { type: 'error', line: 2, col: 1, message: 'BOGUS ERROR', evidence: 'BOGUS', rule: [] },
                    { type: 'warning', line: 1, col: 1, message: 'BOGUS WARNING', evidence: 'BOGUS', rule: [] }
                ], stats: [] },
                err = "path/to/FILE: line 2, col 1, Error - BOGUS ERROR\n",
                warning = "path/to/FILE: line 1, col 1, Warning - BOGUS WARNING\n",
                expected = err + warning,
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual(expected, actual);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "CSSLint XML formatter test",
        
        "File with no problems should say so": function(){
            var result = { messages: [], stats: [] },
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><csslint></csslint>";
            Assert.areEqual(expected, CSSLint.format(result, "FILE", "csslint-xml"));
        },

        "File with problems should list them": function(){
            var result = { messages: [
                     { type: "warning", line: 1, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: [] },
                     { type: "error", line: 2, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: [] }
                ], stats: [] },
                file = "<file name=\"FILE\">",
                error1 = "<issue line=\"1\" char=\"1\" severity=\"warning\" reason=\"BOGUS\" evidence=\"ALSO BOGUS\"/>",
                error2 = "<issue line=\"2\" char=\"1\" severity=\"error\" reason=\"BOGUS\" evidence=\"ALSO BOGUS\"/>",
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><csslint>" + file + error1 + error2 + "</file></csslint>",
                actual = CSSLint.format(result, "FILE", "csslint-xml");
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
                expected = "<?xml version=\"1.0\" encoding=\"utf-8\"?><csslint>" + file + error1 + error2 + "</file></csslint>",
                actual = CSSLint.format(result, "FILE", "csslint-xml");
            Assert.areEqual(expected, actual);
        }
    }));
})();

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

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Text formatter",
        
        "File with no problems should say so": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("text").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual("\n\ncsslint: No errors in path/to/FILE.", actual);
        },

        "Should have no output when quiet option is specified and no errors": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("text").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE", quiet: "true"});
            Assert.areEqual("", actual);
        },

        "File with problems should list them": function() {
            var result = { messages: [ 
                     { type: 'warning', line: 1, col: 1, message: 'BOGUS', evidence: 'ALSO BOGUS', rule: [] },
                     { type: 'error', line: 2, col: 1, message: 'BOGUS', evidence: 'ALSO BOGUS', rule: [] }
                ], stats: [] },
                error1 = "\n1: warning at line 1, col 1\nBOGUS\nALSO BOGUS",
                error2 = "\n2: error at line 2, col 1\nBOGUS\nALSO BOGUS",
                expected = "\n\ncsslint: There are 2 problems in path/to/FILE.\n\nFILE" + error1 + "\n\nFILE" + error2,
                actual = CSSLint.getFormatter("text").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual(expected, actual);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Adjoining Selector Rule Errors",
        
        "Adjoining classes should result in a warning": function(){
            var result = CSSLint.verify(".foo.bar { }", { "adjoining-classes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Don't use adjoining classes.", result.messages[0].message);
        },

        "Adjoining classes should result in an error": function(){
            var result = CSSLint.verify(".foo.bar { }", { "adjoining-classes": 2 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("error", result.messages[0].type);
            Assert.areEqual("Don't use adjoining classes.", result.messages[0].message);
        },

        "Descendant selector with classes should not result in a warning": function(){
            var result = CSSLint.verify(".foo .bar { }", { "adjoining-classes": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Box Model Rule Errors",

        "Using width and padding should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with padding can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when padding is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
       "Using width:auto with padding should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: auto; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

       "Using width:available with padding should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: available; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

       "Using height:auto with padding should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: auto; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using width and padding-left should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with padding-left can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when padding-left is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-left: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-right should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with padding-right can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when padding-right is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-right: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-top should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using width and padding-to-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 10px 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },            

        "Using width and border should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with border can sometimes make elements larger than you expect.", result.messages[0].message);
        },
        
        "Using width and border with box-sizing should not result in a warning": function(){
            var result = CSSLint.verify(".foo { box-sizing: border-box; width: 100px; border: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using width and border-left should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with border-left can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when border-left is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-left: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-right should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with border-right can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when border-right is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-right: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-top should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with padding can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when padding is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-left should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-right should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using height and padding-left-right should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding: 0 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },    

        "Using height and padding-top should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with padding-top can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when padding-top is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-top: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-bottom should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with padding-bottom can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when padding-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-bottom: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with border can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height and border: none should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: none; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border: 0 should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-left should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-right should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-top should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with border-top can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when border-top is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-top: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with border-bottom can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when border-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Box Sizing Rule Errors",

        "Using box-sizing should result in a warning": function(){
            var result = CSSLint.verify(".foo { box-sizing: border-box; }", { "box-sizing": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The box-sizing property isn't supported in IE6 and IE7.", result.messages[0].message);
        },

        "No box-sizing should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 0; }", { "box-sizing": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Bulletproof @font-face syntax tests",

        "Using the official bulletproof syntax should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot?') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Skipping the hashtag with the svgFontName and having content after .eot? should also pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot?#iefix') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.svg') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "The minified version of the code should pass": function(){
            var result = CSSLint.verify("@font-face{font-family:'MyFontFamily';" +
                                            "src:url('myfont-webfont.eot?#iefix') format('embedded-opentype')," +
                                            "url('myfont-webfont.woff') format('woff')," +
                                            "url('myfont-webfont.ttf') format('truetype')," +
                                            "url('myfont-webfont.svg#svgFontName') format('svg')}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Skipping one of the font types should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot?') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },


        "Supplying the fonts in a different order should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot?#iefix') format('embedded-opentype')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using mixed double and single quotes should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url(\"myfont-webfont.eot?#iefix\") format(\"embedded-opentype\")," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url(\"myfont-webfont.woff\") format('woff')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Having only one font declaration with the question mark should pass": function(){
            var result = CSSLint.verify("@font-face{src:url('myfont-webfont.eot?') format('embedded-opentype');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "When we aren't inside an @font-face declaration the src property should not be checked": function(){
            var result = CSSLint.verify(".foo .bar{src:url('baz.png');}", { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using the advanced syntax with two src properties should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('webfont.eot'); /* IE9 Compat Modes */" +
                                        "src: url('myfont-webfont.eot?') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Leaving off the question mark should fail": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("@font-face declaration doesn't follow the fontspring bulletproof syntax.", result.messages[0].message);
        }

    }));
})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;
    
    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "Compatible Vendor Prefix Warnings",

        "Using -webkit-border-radius should not warn to also include -moz-border-radius.": function(){
            var result = CSSLint.verify("h1 { -webkit-border-radius: 5px; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using -webkit-transition and -moz-transition should warn to also include -o-transition.": function() {
            var result = CSSLint.verify("h1 { -webkit-transition: height 20px 1s; -moz-transition: height 20px 1s; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The property -o-transition is compatible with -webkit-transition and -moz-transition and should be included as well.", result.messages[0].message);
            Assert.areEqual(6, result.messages[0].col);
            Assert.areEqual(1, result.messages[0].line);            
        },
        
        "Using -webkit-transform should warn to also include -moz-transform, -ms-transform, and -o-transform.": function() {
            var result = CSSLint.verify("div.box { -webkit-transform: translate(50px, 100px); }", { "compatible-vendor-prefixes": 3 });
            Assert.areEqual(3, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The property -moz-transform is compatible with -webkit-transform and should be included as well.", result.messages[0].message);
            Assert.areEqual("warning", result.messages[1].type);
            Assert.areEqual("The property -ms-transform is compatible with -webkit-transform and should be included as well.", result.messages[1].message);
            Assert.areEqual("warning", result.messages[2].type);
            Assert.areEqual("The property -o-transform is compatible with -webkit-transform and should be included as well.", result.messages[2].message);
        },
        
        "Using -webkit-transform inside of an @-webkit- block shouldn't cause a warning": function(){
            var result = CSSLint.verify("@-webkit-keyframes spin {0%{ -webkit-transform: rotateX(-10deg) rotateY(0deg); } 100%{ -webkit-transform: rotateX(-10deg) rotateY(-360deg); } }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using all compatible vendor prefixes for animation should be allowed with no warnings.": function(){
            var result = CSSLint.verify(".next:focus { -moz-animation: 'diagonal-slide' 5s 10; -webkit-animation: 'diagonal-slide' 5s 10; -ms-animation: 'diagonal-slide' 5s 10; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using box-shadow with no vendor prefixes should be allowed with no warnings.": function(){
            var result = CSSLint.verify("h1 { box-shadow: 5px 5px 5px #ccc; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(0, result.messages.length);
        }
                
    }));     

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Display Property Grouping Rule Errors",

/*
 * - float should not be used with inline-block
 * - height, width, margin-top, margin-bottom, float should not be used with inline
 * - vertical-align should not be used with block
 * - margin, float should not be used with table-*
*/
        "Float with inline-block should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; display: inline-block; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("float can't be used with display: inline-block.", result.messages[0].message);
        },

        "Float with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug).", result.messages[0].message);
        },

        "Float:none with inline-block should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; display: inline-block; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Float:none with inline should result not in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Height with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("height can't be used with display: inline.", result.messages[0].message);
        },

        "Width with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("width can't be used with display: inline.", result.messages[0].message);
        },

        "Margin with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin can't be used with display: inline.", result.messages[0].message);
        },

        "Margin-left with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-left: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Margin-right with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-right: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Margin-top with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-top: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-top can't be used with display: inline.", result.messages[0].message);
        },

        "Margin-bottom with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-bottom: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-bottom can't be used with display: inline.", result.messages[0].message);
        },

        "Padding with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { padding: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Padding-left with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { padding-left: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Padding-right with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { padding-right: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Padding-top with inline should not result in a warning": function(){
            var result = CSSLint.verify(".foo { padding-top: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Padding-bottom with inline should result in a warning": function(){
            var result = CSSLint.verify(".foo { padding-bottom: 100px; display: inline; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        }, 

        "Vertical-align with block should result in a warning": function(){
            var result = CSSLint.verify(".foo { vertical-align: bottom; display: block; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("vertical-align can't be used with display: block.", result.messages[0].message);
        },

        "Margin with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin-left with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-left: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-left can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin-right with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-right: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-right can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin-top with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-top: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-top can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin-bottom with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-bottom: 100px; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-bottom can't be used with display: table-cell.", result.messages[0].message);
        },

        "Margin with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin can't be used with display: table-row.", result.messages[0].message);
        },

        "Margin-left with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-left: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-left can't be used with display: table-row.", result.messages[0].message);
        },

        "Margin-right with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-right: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-right can't be used with display: table-row.", result.messages[0].message);
        },

        "Margin-top with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-top: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-top can't be used with display: table-row.", result.messages[0].message);
        },

        "Margin-bottom with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { margin-bottom: 100px; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("margin-bottom can't be used with display: table-row.", result.messages[0].message);
        },

        "Float with table-row should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("float can't be used with display: table-row.", result.messages[0].message);
        },

        "Float with table-cell should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("float can't be used with display: table-cell.", result.messages[0].message);
        },

        "Float:none with table-row should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; display: table-row; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Float:none with table-cell should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; display: table-cell; }", { "display-property-grouping": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Duplicate Background-URL Rule Errors",

        "duplicate background-image should result in a warning": function(){
            var result = CSSLint.verify(".foo { background-image: url('mega-sprite.png'); } .foofoo { background-image: url('fancy-sprite.png'); } .bar { background-image: url(\"mega-sprite.png\"); } .foobar { background: white url(mega-sprite.png); }", {"duplicate-background-images": 1 });
            Assert.areEqual(2, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Background image 'mega-sprite.png' was used multiple times, first declared at line 1, col 8.", result.messages[0].message);
        },

        "duplicate background with url should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: url(mega-sprite.png) repeat-x; } .foofoo { background-image: url('fancy-sprite.png'); } .bar { background: white url(\"mega-sprite.png\") no-repeat left top; } .foobar { background: white url('mega-sprite.png'); }", {"duplicate-background-images": 1 });
            Assert.areEqual(2, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Background image 'mega-sprite.png' was used multiple times, first declared at line 1, col 8.", result.messages[0].message);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Duplicate Property Rule Errors",

        "Duplicate properties back-to-back should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; float: right }", { "duplicate-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Duplicate properties in @font-face back-to-back should not result in a warning": function(){
            var result = CSSLint.verify("@font-face { src: url(foo.svg); src: url(foo1.svg) }", { "duplicate-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Duplicate properties in @page back-to-back should not result in a warning": function(){
            var result = CSSLint.verify("@page :left { margin: 5px; margin: 4px; }", { "duplicate-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Duplicate properties not back-to-back should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; margin: 0; float: right }", { "duplicate-properties": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Duplicate property 'float' found.", result.messages[0].message);
        },
        
        "Duplicate properties not back-to-back with same values should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; margin: 0; float: left }", { "duplicate-properties": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Duplicate property 'float' found.", result.messages[0].message);
        },
        
        "Duplicate properties back-to-back with same values should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; float: left }", { "duplicate-properties": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Duplicate property 'float' found.", result.messages[0].message);
        },
        
        "Duplicate properties in @keyframe rules should not result in a warning": function(){
            var result = CSSLint.verify("@-webkit-keyframes slide_up {  from {  bottom:-91px; } to {  bottom:0; } }", { "duplicate-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        }
        

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Empty Rule Errors",

        "Empty rule should result in a warning": function(){
            var result = CSSLint.verify("li { }", { "empty-rules": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Rule is empty.", result.messages[0].message);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Parsing Errors",

        "Parsing error should result in one parsing error message": function(){
            var result = CSSLint.verify("li { float left;}", { errors: 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("error", result.messages[0].type);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Fallback Colors Rule Errors",

        "Using only a named color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { color: red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only a hex color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only rgb() should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { color: rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only rgba() should result in a warning": function(){
            var result = CSSLint.verify(".rgba { color: rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede RGBA color.", result.messages[0].message);
        },
        
        "Using only hsl() should result in a warning": function(){
            var result = CSSLint.verify(".hsl { color: hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede HSL color.", result.messages[0].message);
        },

        "Using only hsla() should result in a warning": function(){
            var result = CSSLint.verify(".hsla { color: hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede HSLA color.", result.messages[0].message);
        },

        "Using rgba() with a fallback should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { color: #fff; color: rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using hsl() with a fallback should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { color: #fff; color: hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { color: #fff; color: hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { color: rgba(0, 0, 0, 0.5); color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede RGBA color.", result.messages[0].message);
        },
        
        "Using hsl() with fallback color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { color: hsl(0, 0%, 0%); color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede HSL color.", result.messages[0].message);
        },

        "Using hsla() with fallback color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { color: hsla(0, 0%, 0%, 0.5); color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede HSLA color.", result.messages[0].message);
        },
        

        "Using only a named background-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { background-color: red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only a hex background-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { background-color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only rgb() background-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { background-color: rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only rgba() background-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { background-color: rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede RGBA background-color.", result.messages[0].message);
        },
        
        "Using only hsl() background-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { background-color: hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede HSL background-color.", result.messages[0].message);
        },

        "Using only hsla() background-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { background-color: hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede HSLA background-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback background-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { background-color: #fff; background-color: rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using hsl() with a fallback background-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { background-color: #fff; background-color: hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback background-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { background-color: #fff; background-color: hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback background-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { background-color: rgba(0, 0, 0, 0.5); background-color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede RGBA background-color.", result.messages[0].message);
        },
        
        "Using hsl() with fallback background-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { background-color: hsl(0, 0%, 0%); background-color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede HSL background-color.", result.messages[0].message);
        },

        "Using hsla() with fallback background-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { background-color: hsla(0, 0%, 0%, 0.5); background-color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede HSLA background-color.", result.messages[0].message);
        },

        // border color tests

        "Using only a named border should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede RGBA border.", result.messages[0].message);
        },

        "Using only hsl() border should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede HSL border.", result.messages[0].message);
        },

        "Using only hsla() border should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede HSLA border.", result.messages[0].message);
        },

        "Using rgba() with a fallback border should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border: 1px solid #fff; border: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border: 1px solid #fff; border: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border: 1px solid #fff; border: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border: 1px solid rgba(0, 0, 0, 0.5); border: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede RGBA border.", result.messages[0].message);
        },

        "Using hsl() with fallback border afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border: 1px solid hsl(0, 0%, 0%); border: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede HSL border.", result.messages[0].message);
        },

        "Using hsla() with fallback border afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border: 1px solid hsla(0, 0%, 0%, 0.5); border: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede HSLA border.", result.messages[0].message);
        },

        // border-top color tests

        "Using only a named border-top should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-top: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-top should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-top: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-top should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-top: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-top should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede RGBA border-top.", result.messages[0].message);
        },

        "Using only hsl() border-top should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede HSL border-top.", result.messages[0].message);
        },

        "Using only hsla() border-top should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede HSLA border-top.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-top should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top: 1px solid #fff; border-top: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-top should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top: 1px solid #fff; border-top: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-top should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top: 1px solid #fff; border-top: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-top afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top: 1px solid rgba(0, 0, 0, 0.5); border-top: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede RGBA border-top.", result.messages[0].message);
        },

        "Using hsl() with fallback border-top afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top: 1px solid hsl(0, 0%, 0%); border-top: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede HSL border-top.", result.messages[0].message);
        },

        "Using hsla() with fallback border-top afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top: 1px solid hsla(0, 0%, 0%, 0.5); border-top: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede HSLA border-top.", result.messages[0].message);
        },
        
        // border-right color tests

        "Using only a named border-right should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-right: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-right should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-right: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-right should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-right: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-right should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede RGBA border-right.", result.messages[0].message);
        },

        "Using only hsl() border-right should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede HSL border-right.", result.messages[0].message);
        },

        "Using only hsla() border-right should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede HSLA border-right.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-right should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right: 1px solid #fff; border-right: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-right should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right: 1px solid #fff; border-right: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-right should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right: 1px solid #fff; border-right: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-right afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede RGBA border-right.", result.messages[0].message);
        },

        "Using hsl() with fallback border-right afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right: 1px solid hsl(0, 0%, 0%); border-right: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede HSL border-right.", result.messages[0].message);
        },

        "Using hsla() with fallback border-right afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right: 1px solid hsla(0, 0%, 0%, 0.5); border-right: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede HSLA border-right.", result.messages[0].message);
        },

        // border-bottom color tests

        "Using only a named border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-bottom: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-bottom: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-bottom: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede RGBA border-bottom.", result.messages[0].message);
        },

        "Using only hsl() border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede HSL border-bottom.", result.messages[0].message);
        },

        "Using only hsla() border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede HSLA border-bottom.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom: 1px solid #fff; border-bottom: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom: 1px solid #fff; border-bottom: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom: 1px solid #fff; border-bottom: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-bottom afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-bottom: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede RGBA border-bottom.", result.messages[0].message);
        },

        "Using hsl() with fallback border-bottom afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom: 1px solid hsl(0, 0%, 0%); border-bottom: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede HSL border-bottom.", result.messages[0].message);
        },

        "Using hsla() with fallback border-bottom afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom: 1px solid hsla(0, 0%, 0%, 0.5); border-bottom: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede HSLA border-bottom.", result.messages[0].message);
        },
        
        // border-left color tests

        "Using only a named border-left should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-left: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-left should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-left: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-left should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-left: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-left should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede RGBA border-left.", result.messages[0].message);
        },

        "Using only hsl() border-left should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede HSL border-left.", result.messages[0].message);
        },

        "Using only hsla() border-left should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede HSLA border-left.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-left should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left: 1px solid #fff; border-left: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-left should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left: 1px solid #fff; border-left: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-left should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left: 1px solid #fff; border-left: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-left afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left: 1px solid rgba(0, 0, 0, 0.5); border-left: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede RGBA border-left.", result.messages[0].message);
        },

        "Using hsl() with fallback border-left afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left: 1px solid hsl(0, 0%, 0%); border-left: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede HSL border-left.", result.messages[0].message);
        },

        "Using hsla() with fallback border-left afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left: 1px solid hsla(0, 0%, 0%, 0.5); border-left: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede HSLA border-left.", result.messages[0].message);
        },

        // border-color color tests

        "Using only a named border-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede RGBA border-color.", result.messages[0].message);
        },

        "Using only hsl() border-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede HSL border-color.", result.messages[0].message);
        },

        "Using only hsla() border-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede HSLA border-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-color: 1px solid #fff; border-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-color: 1px solid #fff; border-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-color: 1px solid #fff; border-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-color: 1px solid rgba(0, 0, 0, 0.5); border-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede RGBA border-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-color: 1px solid hsl(0, 0%, 0%); border-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede HSL border-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-color: 1px solid hsla(0, 0%, 0%, 0.5); border-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede HSLA border-color.", result.messages[0].message);
        },

        // border-top-color color tests

        "Using only a named border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-top-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-top-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-top-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-top-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede RGBA border-top-color.", result.messages[0].message);
        },

        "Using only hsl() border-top-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede HSL border-top-color.", result.messages[0].message);
        },

        "Using only hsla() border-top-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede HSLA border-top-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top-color: 1px solid #fff; border-top-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top-color: 1px solid #fff; border-top-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top-color: 1px solid #fff; border-top-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-top-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top-color: 1px solid rgba(0, 0, 0, 0.5); border-top-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede RGBA border-top-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-top-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top-color: 1px solid hsl(0, 0%, 0%); border-top-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede HSL border-top-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-top-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top-color: 1px solid hsla(0, 0%, 0%, 0.5); border-top-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede HSLA border-top-color.", result.messages[0].message);
        },

        // border-right-color color tests

        "Using only a named border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-right-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-right-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-right-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-right-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede RGBA border-right-color.", result.messages[0].message);
        },

        "Using only hsl() border-right-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede HSL border-right-color.", result.messages[0].message);
        },

        "Using only hsla() border-right-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede HSLA border-right-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right-color: 1px solid #fff; border-right-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right-color: 1px solid #fff; border-right-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right-color: 1px solid #fff; border-right-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-right-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right-color: 1px solid rgba(0, 0, 0, 0.5); border-right-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede RGBA border-right-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-right-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right-color: 1px solid hsl(0, 0%, 0%); border-right-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede HSL border-right-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-right-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right-color: 1px solid hsla(0, 0%, 0%, 0.5); border-right-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede HSLA border-right-color.", result.messages[0].message);
        },

        // border-bottom-color color tests

        "Using only a named border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-bottom-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-bottom-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-bottom-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-bottom-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede RGBA border-bottom-color.", result.messages[0].message);
        },

        "Using only hsl() border-bottom-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede HSL border-bottom-color.", result.messages[0].message);
        },

        "Using only hsla() border-bottom-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede HSLA border-bottom-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom-color: 1px solid #fff; border-bottom-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom-color: 1px solid #fff; border-bottom-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom-color: 1px solid #fff; border-bottom-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-bottom-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom-color: 1px solid rgba(0, 0, 0, 0.5); border-bottom-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede RGBA border-bottom-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-bottom-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom-color: 1px solid hsl(0, 0%, 0%); border-bottom-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede HSL border-bottom-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-bottom-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom-color: 1px solid hsla(0, 0%, 0%, 0.5); border-bottom-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede HSLA border-bottom-color.", result.messages[0].message);
        },

        // border-left-color color tests

        "Using only a named border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-left-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-left-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-left-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-left-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede RGBA border-left-color.", result.messages[0].message);
        },

        "Using only hsl() border-left-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede HSL border-left-color.", result.messages[0].message);
        },

        "Using only hsla() border-left-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede HSLA border-left-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left-color: 1px solid #fff; border-left-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left-color: 1px solid #fff; border-left-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left-color: 1px solid #fff; border-left-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-left-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left-color: 1px solid rgba(0, 0, 0, 0.5); border-left-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede RGBA border-left-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-left-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left-color: 1px solid hsl(0, 0%, 0%); border-left-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede HSL border-left-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-left-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left-color: 1px solid hsla(0, 0%, 0%, 0.5); border-left-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede HSLA border-left-color.", result.messages[0].message);
        }
        
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Floats Rule Errors",

        "10 floats should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many floats (10), you're probably using them for layout. Consider using a grid system instead.", result.messages[0].message);
        },

        "9 floats should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "11 floats should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many floats (11), you're probably using them for layout. Consider using a grid system instead.", result.messages[0].message);
        },

        "float: none should not count and therefore should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: none; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "font-faces Rule Errors",

        "5 font-faces should result in a warning": function(){
            var result = CSSLint.verify("@font-face{ } @font-face{ } @font-face{ } @font-face{ } @font-face{ }", { "font-faces": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "4 font-faces should not result in a warning": function(){
            var result = CSSLint.verify("@font-face{} @font-face{} @font-face{} @font-face{}", { "font-faces": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "6 font-faces should result in a warning": function(){
            var result = CSSLint.verify("@font-face{} @font-face{} @font-face{} @font-face{} @font-face{} @font-face{}", { "font-faces": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many @font-face declarations (6).", result.messages[0].message);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "font-size Rule Errors",

        "10 font-sizes should result in a warning": function(){
            var result = CSSLint.verify(".foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } ", {"font-sizes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many font-size declarations (10), abstraction needed.", result.messages[0].message);
        },

        "9 font-sizes should not result in a warning": function(){
            var result = CSSLint.verify(" .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } ", {"font-sizes": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "11 font-sizes should result in a warning": function(){
            var result = CSSLint.verify(".foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } ", {"font-sizes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many font-size declarations (11), abstraction needed.", result.messages[0].message);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
/*
background: -moz-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); 
background: -webkit-gradient(linear, left top, left bottom, color-stop(,#1e5799), color-stop(,#2989d8), color-stop(,#207cca), color-stop(10,#7db9e8)); 
background: -webkit-linear-gradient(top, #1e5799 ,#2989d8 ,#207cca ,#7db9e8 );
background: -o-linear-gradient(top, #1e5799 ,#2989d8 ,#207cca ,#7db9e8 );

*/

        name: "Gradients Rule Errors",

        "Only using Mozilla gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -moz-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing vendor-prefixed CSS gradients for Webkit (Safari 5+, Chrome), Old Webkit (Safari 4+, Chrome), Opera 11.1+.", result.messages[0].message);
        },

        "Only using Opera gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -o-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing vendor-prefixed CSS gradients for Firefox 3.6+, Webkit (Safari 5+, Chrome), Old Webkit (Safari 4+, Chrome).", result.messages[0].message);
        },

        "Only using WebKit gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -webkit-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing vendor-prefixed CSS gradients for Firefox 3.6+, Old Webkit (Safari 4+, Chrome), Opera 11.1+.", result.messages[0].message);
        },

        "Only using old WebKit gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -webkit-gradient(linear, left top, left bottom, color-stop(10%,#1e5799), color-stop(20%,#2989d8), color-stop(30%,#207cca), color-stop(100%,#7db9e8)); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing vendor-prefixed CSS gradients for Firefox 3.6+, Webkit (Safari 5+, Chrome), Opera 11.1+.", result.messages[0].message);
        },

        "Using all vendor-prefixed gradients should not result in a warning": function(){
            var result = CSSLint.verify("div.box {\n    background: -moz-linear-gradient(top,  #1e5799 0%, #7db9e8 100%);\n    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1e5799), color-   stop(100%,#7db9e8));\n    background: -webkit-linear-gradient(top,  #1e5799 0%,#7db9e8 100%);\n    background: -o-linear-gradient(top,  #1e5799 0%,#7db9e8 100%);\n}", { "gradients": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "IDs Rule Errors",

        "Using an ID should result in one warning": function(){
            var result = CSSLint.verify("#foo { float: left;}", { ids: 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Don't use IDs in selectors.", result.messages[0].message);
        },

        "Using multiple IDs should result in one warning": function(){
            var result = CSSLint.verify("#foo #bar { float: left;}", { ids: 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("2 IDs in the selector, really?", result.messages[0].message);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Import Rule Errors",
        
        "Using @import should result in a warning": function(){
            var result = CSSLint.verify("@import url('foo.css');", { "import": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("@import prevents parallel downloads, use <link> instead.", result.messages[0].message);
        }
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "!important; Errors",

        "!important declarations should result in a warning": function(){
            var result = CSSLint.verify("h1 { color:#fff !important; }", { "important": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Use of !important", result.messages[0].message);
        },

        "Using !important at least 10 times should result in an error": function(){
            var css = "h1 { color:#fff !important; } h2 { color:#fff !important; } h3 { color:#fff !important; } h4 { color:#fff !important; } h5 { color:#fff !important; } h6 { color:#fff !important; } p { color:#fff !important; } ul { color:#fff !important; } ol { color:#fff !important; } li { color:#fff !important; }";
            var result = CSSLint.verify(css, { "important": 1 });
            Assert.areEqual(11, result.messages.length);
            Assert.areEqual("warning", result.messages[10].type);
            Assert.areEqual("Too many !important declarations (10), try to use less than 10 to avoid specificity issues.", result.messages[10].message);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Known Properties Errors",

        "Using an unknown property should result in a warning": function(){
            var result = CSSLint.verify("h1 { foo: red;}", { "known-properties": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Unknown property 'foo'.", result.messages[0].message);
        },

        "Using a known property should not result in a warning": function(){
            var result = CSSLint.verify("h1 { color: red;}", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using a known property with the star hack should not result in a warning": function(){
            var result = CSSLint.verify("h1 { *color: red;}", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using a known property with the underscore hack should not result in a warning": function(){
            var result = CSSLint.verify("h1 { _color: red;}", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using a vendor-prefix property should not result in a warning": function(){
            var result = CSSLint.verify("h2 { -moz-border-radius: 5px; }", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);        
        },
        
        "Using src in @font-face should not result in a warning": function(){
            var result = CSSLint.verify("@font-face { src: url(foo.otf); }", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);    
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Outline:none Errors",

        "Using outline: none should result in a warning": function(){
            var result = CSSLint.verify(".foo { outline: none; }", { "outline-none": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Outlines should only be modified using :focus.", result.messages[0].message);
        },

        "Using outline: 0 should result in a warning": function(){
            var result = CSSLint.verify(".foo { outline: 0; }", { "outline-none": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Outlines should only be modified using :focus.", result.messages[0].message);
        },
        
        "Using outline: none alone with :focus should result in a warning": function(){
            var result = CSSLint.verify(".foo:focus { outline: none; }", { "outline-none": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Outlines shouldn't be hidden unless other visual changes are made.", result.messages[0].message);
        },

        "Using outline: 0 alone with :focus should result in a warning": function(){
            var result = CSSLint.verify(".foo:focus { outline: 0; }", { "outline-none": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Outlines shouldn't be hidden unless other visual changes are made.", result.messages[0].message);
        },
        
        "Using outline: none with :focus and another property should not result in a warning": function(){
            var result = CSSLint.verify(".foo:focus { outline: none; border: 1px solid black; }", { "outline-none": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using outline: 0 with :focus and another property should not result in a warning": function(){
            var result = CSSLint.verify(".foo:focus { outline: 0; border: 1px solid black;}", { "outline-none": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Overqualified Elements Errors",

        "Using an ID with an element should result in one warning": function(){
            var result = CSSLint.verify("li#foo { float: left;}", { "overqualified-elements": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Element (li#foo) is overqualified, just use #foo without element name.", result.messages[0].message);
        },

        "Using a class without an element should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left;}", { "overqualified-elements": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using a class with an element should result in one warning": function(){
            var result = CSSLint.verify("li.foo { float: left;}", { "overqualified-elements": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Element (li.foo) is overqualified, just use .foo without element name.", result.messages[0].message);
        },
        
        "Using a class with two different elements should not result in a warning": function(){
            var result = CSSLint.verify("li.foo { float: left;} p.foo { float: right; }", { "overqualified-elements": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using a class with an element and without should not result in a warning": function(){
            var result = CSSLint.verify("li.foo { float: left;} .foo { float: right; }", { "overqualified-elements": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Qualified Headings Errors",

        "Using a heading as a descendant should result in one warning": function(){
            var result = CSSLint.verify("li h3{ float: left;}", { "qualified-headings": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Heading (h3) should not be qualified.", result.messages[0].message);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Regex Selectors Errors",

        "Using |= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class|=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with |= are slow!", result.messages[0].message);
        },

        "Using *= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class*=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with *= are slow!", result.messages[0].message);
        },

        "Using $= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class$=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with $= are slow!", result.messages[0].message);
        },

        "Using ~= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class~=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with ~= are slow!", result.messages[0].message);
        },

        "Using ^= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class^=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with ^= are slow!", result.messages[0].message);
        },

        "Using = in an attribute selector should not result in a warning": function(){
            var result = CSSLint.verify("li[class=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert, i, j, css1 = "", css2 = "", css3 = "", css4 = "";

    // create css1, which has only 4095 rules and 4095 selectors
    for (i = 1; i <= 4095; i++) {
        css1 += ".selector" + i + " { background:red; } ";
    }
    
    // create css2, which has 4096 rules and 4096 selectors
    for (i = 1; i <= 4096; i++) {
        css2 += ".selector" + i + " { background:red; } ";
    }
    
    // create css3, which has 1024 and but only 4095 selectors
    for (i = 0; i <= 1022; i++) {
        j = i * 4;
        css3 += ".selector" + (j+1) + ", .selector" + (j+2) + ", .selector" + (j+3) + ", .selector" + (j+4) + " { background:red; } ";
    }
    css3 += ".selector4093 { background:red; }.selector4094, .selector4095 { background:red; } ";

    // create css4, which has 1024 rules and 4096 selectors
    for (i = 0; i <= 1023; i++) {
        j = i * 4;
        css4 += ".selector" + (j+1) + ", .selector" + (j+2) + ", .selector" + (j+3) + ", .selector" + (j+4) + " { background:red; } ";
    }
    
    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Selector Max Errors Approaching",

        "Using 4095 or fewer single-selector rules should not result in a warning": function(){
            var result = CSSLint.verify(css1, { "selector-max-approaching": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4095 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        },
        
        "Using 4096 or more single-selector rules should result in a warning": function(){
            var result = CSSLint.verify(css2, { "selector-max-approaching": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4096 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        },
        
        "Using 4095 or fewer selectors should not result in a warning": function(){
            var result = CSSLint.verify(css3, { "selector-max-approaching": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4095 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        },
        
        "Using 4096 or more selectors should result in a warning": function(){
            var result = CSSLint.verify(css4, { "selector-max-approaching": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4096 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        },
        
        "Using fewer than 3800 selectors should not result in a warning": function() {
            var result = CSSLint.verify(".selector1 { background: red; }", { "selector-max-approaching": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert, i, j, css1 = "", css2 = "", css3 = "", css4 = "";

    // create css1, which has only 4095 rules and 4095 selectors
    for (i = 1; i <= 4095; i++) {
        css1 += ".selector" + i + " { background:red; } ";
    }
    
    // create css2, which has 4096 rules and 4096 selectors
    for (i = 1; i <= 4096; i++) {
        css2 += ".selector" + i + " { background:red; } ";
    }
    
    // create css3, which has 1024 and but only 4095 selectors
    for (i = 0; i <= 1022; i++) {
        j = i * 4;
        css3 += ".selector" + (j+1) + ", .selector" + (j+2) + ", .selector" + (j+3) + ", .selector" + (j+4) + " { background:red; } ";
    }
    css3 += ".selector4093 { background:red; }.selector4094, .selector4095 { background:red; } ";

    // create css4, which has 1024 rules and 4096 selectors
    for (i = 0; i <= 1023; i++) {
        j = i * 4;
        css4 += ".selector" + (j+1) + ", .selector" + (j+2) + ", .selector" + (j+3) + ", .selector" + (j+4) + " { background:red; } ";
    }
    
    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Selector Max Errors",

        "Using 4095 or fewer single-selector rules should not result in a warning": function(){
            var result = CSSLint.verify(css1, { "selector-max": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using 4096 or more single-selector rules should result in a warning": function(){
            var result = CSSLint.verify(css2, { "selector-max": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4096 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        },
        
        "Using 4095 or fewer selectors should not result in a warning": function(){
            var result = CSSLint.verify(css3, { "selector-max": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using 4096 or more selectors should result in a warning": function(){
            var result = CSSLint.verify(css4, { "selector-max": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4096 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        }
        
    }));

})();
(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "Shorthand Rule Errors",

        "All padding properties should result in a warning": function(){
            var result = CSSLint.verify(".foo{padding-top: 0px; padding-left: 3px; padding-right: 25px; padding-bottom: 10px;}", {"shorthand": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The properties padding-top, padding-bottom, padding-left, padding-right can be replaced by padding.", result.messages[0].message);
        },

        "All margin properties should result in a warning": function(){
            var result = CSSLint.verify(".foo{margin-top: 0px; margin-left: 3px; margin-right: 25px; margin-bottom: 10px;}", {"shorthand": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The properties margin-top, margin-bottom, margin-left, margin-right can be replaced by margin.", result.messages[0].message);
        },

        "padding-left should not result in a warning": function(){
            var result = CSSLint.verify(".foo{ padding-left: 8px;} ", {"shorthand": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "margin-top should not result in a warning": function(){
            var result = CSSLint.verify(".foo{ margin-top: 8px;} ", {"shorthand": 1 });
            Assert.areEqual(0, result.messages.length);
        }
				
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "star-property-hack Rule Errors",

        "a property with a star prefix should result in a warning": function(){
            var result = CSSLint.verify(".foo{*width: 100px;}", {"star-property-hack": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Property with star prefix found.", result.messages[0].message);
        },

        "a property without a star prefix should not result in a warning": function(){
            var result = CSSLint.verify(".foo{width: 100px;}", {"star-property-hack": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "text-indent Rule Errors",

        "-100px text-indent should result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -100px;}", {"text-indent": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", result.messages[0].message);
        },

        "-99px text-indent should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -99px;} ", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "-99em text-indent should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -99em;} ", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "-100px text-indent with LTR should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -100px; direction: ltr; }", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
            result = CSSLint.verify(".foo{direction: ltr; text-indent: -100px; }", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "-100em text-indent with RTL should result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -100em; direction: rtl; }", {"text-indent": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", result.messages[0].message);
        },

        "5px text-indent should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: 5px;}", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "This should cause a warning, not an error": function(){
            var result = CSSLint.verify(".top h1 a { background: url(../images/background/logo.png) no-repeat; display: block; height: 44px; position: relative; text-indent: -9999px; width: 250px; }", { "text-indent": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", result.messages[0].message);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "underscore-property-hack Rule Errors",

        "a property with an underscore prefix should result in a warning": function(){
            var result = CSSLint.verify(".foo{_width: 100px;}", {"underscore-property-hack": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Property with underscore prefix found.", result.messages[0].message);
        },

        "a property without an underscore prefix should not result in a warning": function(){
            var result = CSSLint.verify(".foo{width: 100px;}", {"underscore-property-hack": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Unique Headings Errors",

        "Defining two rules for h1 should result in two warnings": function(){
            var result = CSSLint.verify("h1 { color: red;} h1 {color: blue;}", { "unique-headings": 1 });
            Assert.areEqual(2, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Heading (h1) has already been defined.", result.messages[0].message);
            Assert.areEqual("warning", result.messages[1].type);
            Assert.areEqual("You have 2 h1s defined in this stylesheet.", result.messages[1].message);
        },

        "Defining two rules for h1 and h2 should result in one warning": function(){
            var result = CSSLint.verify("h1 { color: red;} h1 {color: blue;} h2 { color: red;} h2 {color: blue;}", { "unique-headings": 1 });
            Assert.areEqual(3, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Heading (h1) has already been defined.", result.messages[0].message);
            Assert.areEqual("warning", result.messages[1].type);
            Assert.areEqual("Heading (h2) has already been defined.", result.messages[1].message);
            Assert.areEqual("warning", result.messages[2].type);
            Assert.areEqual("You have 2 h1s, 2 h2s defined in this stylesheet.", result.messages[2].message);
        },

        "Defining one rule for h1 should not result in a warning": function(){
            var result = CSSLint.verify("h1 { color: red;}", { "unique-headings": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Defining a rule for h1 and h1:hover should not result in a warning": function(){
            var result = CSSLint.verify("h1 { color: red;} h1:hover { color: blue; }", { "unique-headings": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Defining multiple rules that contain h1 should not result in a warning": function(){
            var result = CSSLint.verify("h2 a, h2 a:active, h2 a:hover, h2 a:visited, h2 a:link { color: red;}", { "unique-headings": 1 });
            Assert.areEqual(0, result.messages.length);        
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "Universal Selector Errors",

        "Using a universal selector alone should result in a warning": function(){
            var result = CSSLint.verify("* { font-size: 10px; }", {"universal-selector": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The universal selector (*) is known to be slow.", result.messages[0].message);
        },

        "Using a universal selector as the right-most part should result in a warning": function(){
            var result = CSSLint.verify("p div * { font-size: 10px; }", {"universal-selector": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The universal selector (*) is known to be slow.", result.messages[0].message);
        },

        "Using a universal selector in the middle should not result in a warning": function(){
            var result = CSSLint.verify("* .foo { font-size: 10px; } ", {"universal-selector": 1 });
            Assert.areEqual(0, result.messages.length);
        }
        
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "Unqualified Attributes Errors",

        "Using an unqualified attribute selector alone should result in a warning": function(){
            var result = CSSLint.verify("[type=text] { font-size: 10px; }", {"unqualified-attributes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Unqualified attribute selectors are known to be slow.", result.messages[0].message);
        },

        "Using an unqualified attribute selector as the right-most part should result in a warning": function(){
            var result = CSSLint.verify("p div [type=text] { font-size: 10px; }", {"unqualified-attributes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Unqualified attribute selectors are known to be slow.", result.messages[0].message);
        },

        "Using an unqualified attribute selector in the middle should not result in a warning": function(){
            var result = CSSLint.verify("[type=text] .foo { font-size: 10px; } ", {"unqualified-attributes": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using a qualified attribute selector should not result in a warning": function(){
            var result = CSSLint.verify("input[type=text]  { font-size: 10px; } ", {"unqualified-attributes": 1 });
            Assert.areEqual(0, result.messages.length);
        }
        
        
    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Vendor Prefix Errors",

        "Using -moz-border-radius without border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 {\n    -moz-border-radius: 5px; \n}", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-radius' to go along with '-moz-border-radius'.", result.messages[0].message);
            Assert.areEqual(2, result.messages[0].line);
            Assert.areEqual(5, result.messages[0].col);
        },

        "Using -webkit-border-radius without border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 { -webkit-border-radius: 5px; }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-radius' to go along with '-webkit-border-radius'.", result.messages[0].message);
        },

        "Using -o-border-radius without border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 { -o-border-radius: 5px; }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-radius' to go along with '-o-border-radius'.", result.messages[0].message);
        },

        "Using -moz-border-radius after  border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 { \nborder-radius: 5px; \n    -moz-border-radius: 5px; }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Standard property 'border-radius' should come after vendor-prefixed property '-moz-border-radius'.", result.messages[0].message);
            Assert.areEqual(3, result.messages[0].line);
            Assert.areEqual(5, result.messages[0].col);
            
        },

        "Using -webkit-border-bottom-left-radius with border-bottom-left-radius should not result in a warning.": function(){
            var result = CSSLint.verify("h1 { -webkit-border-bottom-left-radius: 4px; border-bottom-left-radius: 4px;  }", { "vendor-prefix": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using -moz-border-radius-bottomleft should result in a warning.": function(){
            var result = CSSLint.verify("h1 {  -moz-border-radius-bottomleft: 5px;  }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-bottom-left-radius' to go along with '-moz-border-radius-bottomleft'.", result.messages[0].message);
        },
        
        "Using -moz-box-shadow should result in a warning.": function(){
            var result = CSSLint.verify("h1 {  -moz-box-shadow: 5px;  }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'box-shadow' to go along with '-moz-box-shadow'.", result.messages[0].message);
        },
        
        "Using -moz-user-select should result in a warning.": function(){
            var result = CSSLint.verify("h1 {  -moz-user-select:none;  }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'user-select' to go along with '-moz-user-select'.", result.messages[0].message);
        },
        
        "Using @font-face should not result in an error (#90)": function(){
            var result = CSSLint.verify("@font-face { src:url('../fonts/UniversBold.otf');font-family:Univers;advancedAntiAliasing: true;}", { "vendor-prefix": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();

(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Zero Units Errors",

        "Using 0px should result in one warning": function(){
            var result = CSSLint.verify("h1 { left: 0px; }", { "zero-units": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Values of 0 shouldn't have units specified.", result.messages[0].message);
        },

        "Using 0em should result in one warning": function(){
            var result = CSSLint.verify("h1 { left: 0em; }", { "zero-units": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Values of 0 shouldn't have units specified.", result.messages[0].message);
        },

        "Using 0% should result in one warning": function(){
            var result = CSSLint.verify("h1 { left: 0%; }", { "zero-units": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Values of 0 shouldn't have units specified.", result.messages[0].message);
        },

        "Using 0 should not result in a warning": function(){
            var result = CSSLint.verify("h1 { left: 0; }", { "zero-units": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using 0s for animation-duration should not result in a warning": function(){
            var result = CSSLint.verify("h1 { animation-duration: 0s; }", { "zero-units": 1 });
            Assert.areEqual(0, result.messages.length);
        }
        
        
    }));

})();
