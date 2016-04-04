/*
 * Web worker for CSSLint
 */

/* global self, JSON */

// message indicates to start linting
self.onmessage = function(event) {
    "use strict";
    var data = event.data,
        message,
        text,
        ruleset,
        results;

    try {
        message = JSON.parse(data);
        text = message.text;
        ruleset = message.ruleset;
    } catch (ex) {
        text = data;
    }

    results = CSSLint.verify(text, ruleset);

    // Not all browsers support structured clone, so JSON stringify results
    self.postMessage(JSON.stringify(results));
};
