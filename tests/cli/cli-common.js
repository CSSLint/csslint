/*jshint loopfunc:true, node:true */
"use strict";
function include(path, sandbox) {
    var
        vm = require("vm"),
        fs = require("fs"),
        file;

    file = fs.readFileSync(path);
    vm.runInNewContext(file, sandbox);
}



(function(){

    var Assert = YUITest.Assert,
        suite   = new YUITest.TestSuite("General Tests for CLI"),
        apiStub = require("../tests/cli/assets/apiStub.js"),
        data = require("../tests/cli/assets/data.js"),
        suites = data.suites,
        suiteix,
        sandbox = {
            CSSLint: CSSLint
        };

    include("./src/cli/common.js", sandbox); /* expose sandbox.cli */

    for (suiteix in suites) {
        if (suites.hasOwnProperty(suiteix)) {
            (function (suiteix) {

                suite.add(new YUITest.TestCase({

                    name: "Test " + suiteix,

                    "Outcome logs should match expected": function (){
                        var
                            it = suites[suiteix],
                            expecting = it.expecting,
                            expectingLen = expecting.length,
                            outcome,
                            api,
                            exp,
                            out,
                            i = 0;

                        data.args = it.args.slice();
                        api = apiStub(data);
                        sandbox.cli(api);
                        outcome = api.readLogs();

                        for (i; i < expectingLen; i += 1) {
                            exp = expecting[i];
                            out = outcome[i];

                            if ( typeof out === "string") {
                                out = /^.*/.exec(out.trim())[0];
                            }
                            if ( exp !== out ) {
                                Assert.fail("Expecting: " + exp + " Got: " + out);
                            }
                        }
                        Assert.pass();

                    }
                }));
            })(suiteix);
        }
    }

    YUITest.TestRunner.add(suite);
})();
