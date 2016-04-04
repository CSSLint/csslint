/* jshint browser:true, loopfunc:true */

(function() {
    "use strict";

    window.onload = function() {

        // some helpful variables
        var runButton = window.document.getElementById("run"),
            resultsList = window.document.getElementById("results"),
            resultNode = resultsList,
            events = [
                YUITest.TestRunner.TEST_CASE_BEGIN_EVENT,
                YUITest.TestRunner.TEST_CASE_COMPLETE_EVENT,
                YUITest.TestRunner.TEST_SUITE_BEGIN_EVENT,
                YUITest.TestRunner.TEST_SUITE_COMPLETE_EVENT,
                YUITest.TestRunner.TEST_PASS_EVENT,
                YUITest.TestRunner.TEST_FAIL_EVENT,
                YUITest.TestRunner.TEST_IGNORE_EVENT,
                YUITest.TestRunner.COMPLETE_EVENT,
                YUITest.TestRunner.BEGIN_EVENT,
                YUITest.TestRunner.ERROR_EVENT
            ];

        for (var i=0; i < events.length; i++) {
            YUITest.TestRunner.attach(events[i], function(event) {
                var node,
                    message,
                    messageType;

                switch (event.type) {
                    case this.BEGIN_EVENT:
                        message = "Testing began at " + (new Date()).toString() + ".";
                        messageType = "info";
                        break;

                    case this.COMPLETE_EVENT:
                        message = "Testing completed at " + (new Date()).toString() + ".\nPassed:" +
                                event.results.passed + " Failed:" + event.results.failed + " Total:" + event.results.total;
                        messageType = "info";
                        break;

                    case this.TEST_FAIL_EVENT:
                        node = window.document.createElement("li");
                        node.className = "failed";
                        node.innerHTML = event.testName + ": " + event.error.getMessage().replace(/\n/g, "<br>");
                        resultNode.appendChild(node);
                        break;

                    case this.ERROR_EVENT:
                        node = window.document.createElement("li");
                        node.className = "error";
                        node.innerHTML = "ERROR: " + event.methodName + "() caused an error: " + event.error.message.replace(/\n/g, "<br>");
                        resultNode.appendChild(node);
                        break;

                    case this.TEST_IGNORE_EVENT:
                        node = window.document.createElement("li");
                        node.className = "ignored";
                        node.innerHTML = event.testName;
                        resultNode.appendChild(node);
                        break;

                    case this.TEST_PASS_EVENT:
                        node = window.document.createElement("li");
                        node.className = "passed";
                        node.innerHTML = event.testName;
                        resultNode.appendChild(node);
                        break;

                    case this.TEST_SUITE_BEGIN_EVENT:
                        node = window.document.createElement("li");
                        node.innerHTML = event.testSuite.name;
                        resultNode.appendChild(node);
                        resultNode = resultNode.appendChild(window.document.createElement("ul"));
                        break;

                    case this.TEST_CASE_COMPLETE_EVENT:
                    case this.TEST_SUITE_COMPLETE_EVENT:
                        resultNode.previousSibling.innerHTML += " (passed: " + event.results.passed + ", failed: " + event.results.failed + ", total: " + event.results.total + ", errors: " + event.results.errors + ", ignored: " + event.results.ignored + ")";
                        resultNode = resultNode.parentNode;
                        break;

                    case this.TEST_CASE_BEGIN_EVENT:
                        node = window.document.createElement("li");
                        node.innerHTML = event.testCase.name;
                        resultNode.appendChild(node);
                        resultNode = resultNode.appendChild(window.document.createElement("ul"));
                        break;

                }

            });
        }

        runButton.onclick = function() {
            // reset the interface
            resultsList.innerHTML = "";
            resultNode = resultsList;

            YUITest.TestRunner.run();
        };
    };

})();
