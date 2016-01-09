(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: ":hover; Warning",
        "using :hover on non-link ements should result in an warning": function(){
            var result = CSSLint.verify("li:hover {color:blue;} .foo:hover {float:left;} #foo:hover {clear:both;} div.faa :hover {font-size:1px;}, body .test-result .tmp-program .test-program-left .test-program-title .test-program-help-image :hover, body .test-eligibility-result.cw-collapsed-map .test-eligibility-triage .test-top-panel-left-image:hover, body .test-eligibility-result .test-eligibility-result-triage .test-panel-right-image :hover {font-size:1px;}, body .test-eligibility-result .test-eligibility-result-triage .test-panel-image:hover {background-position: 100% 49%;}", { "non-link-hover": 4 });
            Assert.areEqual(4, result.messages.length);
            Assert.areEqual("warn", result.messages[0].type);
            Assert.areEqual("Using :hover pseudo-selector to non-link elements is known to be slow.", result.messages[0].message);
        },
        "using :hover on link ements should not result in any remark": function(){
            var result = CSSLint.verify("a:hover {color:red;} li a:hover, div a:hover {color:red;}, body .test-result .tmp-program .test-program-left .test-program-title .test-program-help-image a:hover, body .test-eligibility-result.cw-collapsed-map .test-eligibility-triage a.test-top-panel-left-image:hover, body .test-eligibility-result .test-eligibility-result-triage .test-panel-right-image a:hover {font-size:1px;}, body .test-eligibility-result .test-eligibility-result-triage a.test-panel-image:hover {background-position: 100% 49%;}", { "non-link-hover": 0 });
            Assert.areEqual(0, result.messages.length);
        }
    }));
})();