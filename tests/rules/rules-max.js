(function() {
    "use strict";

    var Assert = YUITest.Assert, MAX_RULES = 499;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "rules-max errors",

        /**
         * generate a 500 rule stylesheet
         */
        setUp: function() {
            var ndx;
            
            this.count = 0;
            this.cssA = "";
            this.cssB = "";

            function num(n) {
                return ("000" + n).substr(-3);
            }

            for (ndx = 1; ndx < MAX_RULES; ndx += 1) {
                this.cssA += ".rule-a-" + num(ndx) + " { display: inline-block; }";
                this.count += 1;
            }

            this.cssB = this.cssA;
            for (ndx = 1; ndx < MAX_RULES; ndx += 1) {
                this.cssB += ".rule-b-" + num(ndx) + " { display: block; }";
                this.count += 1;
            }
        },

        "Using 499 or fewer rules should not result in a warning": function() {
            var result = CSSLint.verify(this.cssA, { "rules-max": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        "Using 500 or more rules should result in a warning": function() {
            var result = CSSLint.verify(this.cssB, { "rules-max": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("There are too many rules (" + this.count + ") in the stylesheet.", result.messages[0].message);
        }

    }));

})();
