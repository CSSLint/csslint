(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "obsolete property errors",

        setUp: function() {
            this.message = /Non\-standard or obsolete property /;
        },

        "appearance should result in an error": function() {
            var result = CSSLint.verify("li { appearance: none; }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "azimuth": function() {
            var result = CSSLint.verify("li { azimuth: left-side; }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "behavior": function() {
            var result = CSSLint.verify("li { behavior: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "binding": function() {
            var result = CSSLint.verify("li { binding: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "drop-initial-after-adjust": function() {
            var result = CSSLint.verify("li { drop-initial-after-adjust: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "drop-initial-after-align": function() {
            var result = CSSLint.verify("li { drop-initial-after-align: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "drop-initial-before-adjust": function() {
            var result = CSSLint.verify("li { drop-initial: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "drop-initial-before-align": function() {
            var result = CSSLint.verify("li { drop-initial-before-align: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "drop-initial-size": function() {
            var result = CSSLint.verify("li { drop-initial-size: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "drop-initial-value": function() {
            var result = CSSLint.verify("li { drop-initial-value: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "fit": function() {
            var result = CSSLint.verify("li { fit: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "fit-position": function() {
            var result = CSSLint.verify("li { fit-position: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-cell-stacking": function() {
            var result = CSSLint.verify("li { grid-cell-stacking: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-columns": function() {
            var result = CSSLint.verify("li { grid-columns: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-column-align": function() {
            var result = CSSLint.verify("li { grid-column-align: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-column-sizing": function() {
            var result = CSSLint.verify("li { grid-column-sizing: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-column-span": function() {
            var result = CSSLint.verify("li { grid-column-span: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-flow": function() {
            var result = CSSLint.verify("li { grid-flow: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-layer": function() {
            var result = CSSLint.verify("li { grid-layer: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-rows": function() {
            var result = CSSLint.verify("li { grid-rows: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-row-align": function() {
            var result = CSSLint.verify("li { grid-row-align: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-row-span": function() {
            var result = CSSLint.verify("li { grid-row-span: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "grid-row-sizing": function() {
            var result = CSSLint.verify("li { grid-row-sizing: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "hyphenate-after": function() {
            var result = CSSLint.verify("li { hyphenate-after: url(y-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "hyphenate-before": function() {
            var result = CSSLint.verify("li { hyphenate-before: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "hyphenate-character": function() {
            var result = CSSLint.verify("li { hyphenate-character: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "hyphenate-lines": function() {
            var result = CSSLint.verify("li { hyphenate-lines: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "hyphenate-resource": function() {
            var result = CSSLint.verify("li { hyphenate-resource: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "ime-mode": function() {
            var result = CSSLint.verify("li { ime-mode: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "marquee-direction": function() {
            var result = CSSLint.verify("li { marquee-diretion: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "marquee-play-count": function() {
            var result = CSSLint.verify("li { marquee-play-count: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "marquee-speed": function() {
            var result = CSSLint.verify("li { marquee-speed: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "marquee-style": function() {
            var result = CSSLint.verify("li { marquee-style: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "move-to": function() {
            var result = CSSLint.verify("li { move-to: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "nav-index": function() {
            var result = CSSLint.verify("li { nav-index: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "overflow-style": function() {
            var result = CSSLint.verify("li { overflow-style: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "page-policy": function() {
            var result = CSSLint.verify("li { page-policy: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "punctuation-trim": function() {
            var result = CSSLint.verify("li { punctuation-trim: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "rotation": function() {
            var result = CSSLint.verify("li { rotation: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "rotation-point": function() {
            var result = CSSLint.verify("li { rotation-point: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "ruby-overhang": function() {
            var result = CSSLint.verify("li { ruby-overhang: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "ruby-span": function() {
            var result = CSSLint.verify("li { ruby-span: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "target": function() {
            var result = CSSLint.verify("li { target: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "target-name": function() {
            var result = CSSLint.verify("li { target-name: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "target-new": function() {
            var result = CSSLint.verify("li { target-new: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "target-position": function() {
            var result = CSSLint.verify("li { target-position: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "text-outline": function() {
            var result = CSSLint.verify("li { text-outline: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "text-wrap": function() {
            var result = CSSLint.verify("li { text-wrap: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "user-modify": function() {
            var result = CSSLint.verify("li { user-modify: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        },
        "white-space-collapse": function() {
            var result = CSSLint.verify("li { white-space-collapse: url(my-behavior.htc); }", { "obsolete-properties": 1 }),
                isErr = this.message.test(result.messages[0].message);

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(isErr, true);
        }

    }));

})();
