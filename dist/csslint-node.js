/*!
CSSLint v1.0.4
Copyright (c) 2016 Nicole Sullivan and Nicholas C. Zakas. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var clone = require('clone');
var parserlib = require('parserlib');
/**
 * Main CSSLint object.
 * @class CSSLint
 * @static
 * @extends parserlib.util.EventTarget
 */

/* global parserlib, clone, Reporter */
/* exported CSSLint */

var CSSLint = (function() {
    "use strict";

    var rules           = [],
        formatters      = [],
        embeddedRuleset = /\/\*\s*csslint([^\*]*)\*\//,
        api             = new parserlib.util.EventTarget();

    api.version = "1.0.4";

    //-------------------------------------------------------------------------
    // Rule Management
    //-------------------------------------------------------------------------

    /**
     * Adds a new rule to the engine.
     * @param {Object} rule The rule to add.
     * @method addRule
     */
    api.addRule = function(rule) {
        rules.push(rule);
        rules[rule.id] = rule;
    };

    /**
     * Clears all rule from the engine.
     * @method clearRules
     */
    api.clearRules = function() {
        rules = [];
    };

    /**
     * Returns the rule objects.
     * @return An array of rule objects.
     * @method getRules
     */
    api.getRules = function() {
        return [].concat(rules).sort(function(a, b) {
            return a.id > b.id ? 1 : 0;
        });
    };

    /**
     * Returns a ruleset configuration object with all current rules.
     * @return A ruleset object.
     * @method getRuleset
     */
    api.getRuleset = function() {
        var ruleset = {},
            i = 0,
            len = rules.length;

        while (i < len) {
            ruleset[rules[i++].id] = 1;    // by default, everything is a warning
        }

        return ruleset;
    };

    /**
     * Returns a ruleset object based on embedded rules.
     * @param {String} text A string of css containing embedded rules.
     * @param {Object} ruleset A ruleset object to modify.
     * @return {Object} A ruleset object.
     * @method getEmbeddedRuleset
     */
    function applyEmbeddedRuleset(text, ruleset) {
        var valueMap,
            embedded = text && text.match(embeddedRuleset),
            rules = embedded && embedded[1];

        if (rules) {
            valueMap = {
                "true": 2,  // true is error
                "": 1,      // blank is warning
                "false": 0, // false is ignore

                "2": 2,     // explicit error
                "1": 1,     // explicit warning
                "0": 0      // explicit ignore
            };

            rules.toLowerCase().split(",").forEach(function(rule) {
                var pair = rule.split(":"),
                    property = pair[0] || "",
                    value = pair[1] || "";

                ruleset[property.trim()] = valueMap[value.trim()];
            });
        }

        return ruleset;
    }

    //-------------------------------------------------------------------------
    // Formatters
    //-------------------------------------------------------------------------

    /**
     * Adds a new formatter to the engine.
     * @param {Object} formatter The formatter to add.
     * @method addFormatter
     */
    api.addFormatter = function(formatter) {
        // formatters.push(formatter);
        formatters[formatter.id] = formatter;
    };

    /**
     * Retrieves a formatter for use.
     * @param {String} formatId The name of the format to retrieve.
     * @return {Object} The formatter or undefined.
     * @method getFormatter
     */
    api.getFormatter = function(formatId) {
        return formatters[formatId];
    };

    /**
     * Formats the results in a particular format for a single file.
     * @param {Object} result The results returned from CSSLint.verify().
     * @param {String} filename The filename for which the results apply.
     * @param {String} formatId The name of the formatter to use.
     * @param {Object} options (Optional) for special output handling.
     * @return {String} A formatted string for the results.
     * @method format
     */
    api.format = function(results, filename, formatId, options) {
        var formatter = this.getFormatter(formatId),
            result = null;

        if (formatter) {
            result = formatter.startFormat();
            result += formatter.formatResults(results, filename, options || {});
            result += formatter.endFormat();
        }

        return result;
    };

    /**
     * Indicates if the given format is supported.
     * @param {String} formatId The ID of the format to check.
     * @return {Boolean} True if the format exists, false if not.
     * @method hasFormat
     */
    api.hasFormat = function(formatId) {
        return formatters.hasOwnProperty(formatId);
    };

    //-------------------------------------------------------------------------
    // Verification
    //-------------------------------------------------------------------------

    /**
     * Starts the verification process for the given CSS text.
     * @param {String} text The CSS text to verify.
     * @param {Object} ruleset (Optional) List of rules to apply. If null, then
     *      all rules are used. If a rule has a value of 1 then it's a warning,
     *      a value of 2 means it's an error.
     * @return {Object} Results of the verification.
     * @method verify
     */
    api.verify = function(text, ruleset) {

        var i = 0,
            reporter,
            lines,
            allow = {},
            ignore = [],
            report,
            parser = new parserlib.css.Parser({
                starHack: true,
                ieFilters: true,
                underscoreHack: true,
                strict: false
            });

        // normalize line endings
        lines = text.replace(/\n\r?/g, "$split$").split("$split$");

        // find 'allow' comments
        CSSLint.Util.forEach(lines, function (line, lineno) {
            var allowLine = line && line.match(/\/\*[ \t]*csslint[ \t]+allow:[ \t]*([^\*]*)\*\//i),
                allowRules = allowLine && allowLine[1],
                allowRuleset = {};

            if (allowRules) {
                allowRules.toLowerCase().split(",").forEach(function(allowRule) {
                    allowRuleset[allowRule.trim()] = true;
                });
                if (Object.keys(allowRuleset).length > 0) {
                    allow[lineno + 1] = allowRuleset;
                }
            }
        });

        var ignoreStart = null,
            ignoreEnd = null;
        CSSLint.Util.forEach(lines, function (line, lineno) {
            // Keep oldest, "unclosest" ignore:start
            if (ignoreStart === null && line.match(/\/\*[ \t]*csslint[ \t]+ignore:start[ \t]*\*\//i)) {
                ignoreStart = lineno;
            }

            if (line.match(/\/\*[ \t]*csslint[ \t]+ignore:end[ \t]*\*\//i)) {
                ignoreEnd = lineno;
            }

            if (ignoreStart !== null && ignoreEnd !== null) {
                ignore.push([ignoreStart, ignoreEnd]);
                ignoreStart = ignoreEnd = null;
            }
        });

        // Close remaining ignore block, if any
        if (ignoreStart !== null) {
            ignore.push([ignoreStart, lines.length]);
        }

        if (!ruleset) {
            ruleset = this.getRuleset();
        }

        if (embeddedRuleset.test(text)) {
            // defensively copy so that caller's version does not get modified
            ruleset = clone(ruleset);
            ruleset = applyEmbeddedRuleset(text, ruleset);
        }

        reporter = new Reporter(lines, ruleset, allow, ignore);

        ruleset.errors = 2;       // always report parsing errors as errors
        for (i in ruleset) {
            if (ruleset.hasOwnProperty(i) && ruleset[i]) {
                if (rules[i]) {
                    rules[i].init(parser, reporter);
                }
            }
        }


        // capture most horrible error type
        try {
            parser.parse(text);
        } catch (ex) {
            reporter.error("Fatal error, cannot continue: " + ex.message, ex.line, ex.col, {});
        }

        report = {
            messages    : reporter.messages,
            stats       : reporter.stats,
            ruleset     : reporter.ruleset,
            allow       : reporter.allow,
            ignore      : reporter.ignore
        };

        // sort by line numbers, rollups at the bottom
        report.messages.sort(function (a, b) {
            if (a.rollup && !b.rollup) {
                return 1;
            } else if (!a.rollup && b.rollup) {
                return -1;
            } else {
                return a.line - b.line;
            }
        });

        return report;
    };

    //-------------------------------------------------------------------------
    // Publish the API
    //-------------------------------------------------------------------------

    return api;

})();

/**
 * An instance of Report is used to report results of the
 * verification back to the main API.
 * @class Reporter
 * @constructor
 * @param {String[]} lines The text lines of the source.
 * @param {Object} ruleset The set of rules to work with, including if
 *      they are errors or warnings.
 * @param {Object} explicitly allowed lines
 * @param {[][]} ingore list of line ranges to be ignored
 */
function Reporter(lines, ruleset, allow, ignore) {
    "use strict";

    /**
     * List of messages being reported.
     * @property messages
     * @type String[]
     */
    this.messages = [];

    /**
     * List of statistics being reported.
     * @property stats
     * @type String[]
     */
    this.stats = [];

    /**
     * Lines of code being reported on. Used to provide contextual information
     * for messages.
     * @property lines
     * @type String[]
     */
    this.lines = lines;

    /**
     * Information about the rules. Used to determine whether an issue is an
     * error or warning.
     * @property ruleset
     * @type Object
     */
    this.ruleset = ruleset;

    /**
     * Lines with specific rule messages to leave out of the report.
     * @property allow
     * @type Object
     */
    this.allow = allow;
    if (!this.allow) {
        this.allow = {};
    }

    /**
     * Linesets not to include in the report.
     * @property ignore
     * @type [][]
     */
    this.ignore = ignore;
    if (!this.ignore) {
        this.ignore = [];
    }
}

Reporter.prototype = {

    // restore constructor
    constructor: Reporter,

    /**
     * Report an error.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method error
     */
    error: function(message, line, col, rule) {
        "use strict";
        this.messages.push({
            type    : "error",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule || {}
        });
    },

    /**
     * Report an warning.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method warn
     * @deprecated Use report instead.
     */
    warn: function(message, line, col, rule) {
        "use strict";
        this.report(message, line, col, rule);
    },

    /**
     * Report an issue.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method report
     */
    report: function(message, line, col, rule) {
        "use strict";

        // Check if rule violation should be allowed
        if (this.allow.hasOwnProperty(line) && this.allow[line].hasOwnProperty(rule.id)) {
            return;
        }

        var ignore = false;
        CSSLint.Util.forEach(this.ignore, function (range) {
            if (range[0] <= line && line <= range[1]) {
                ignore = true;
            }
        });
        if (ignore) {
            return;
        }

        this.messages.push({
            type    : this.ruleset[rule.id] === 2 ? "error" : "warning",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule
        });
    },

    /**
     * Report some informational text.
     * @param {String} message The message to store.
     * @param {int} line The line number.
     * @param {int} col The column number.
     * @param {Object} rule The rule this message relates to.
     * @method info
     */
    info: function(message, line, col, rule) {
        "use strict";
        this.messages.push({
            type    : "info",
            line    : line,
            col     : col,
            message : message,
            evidence: this.lines[line-1],
            rule    : rule
        });
    },

    /**
     * Report some rollup error information.
     * @param {String} message The message to store.
     * @param {Object} rule The rule this message relates to.
     * @method rollupError
     */
    rollupError: function(message, rule) {
        "use strict";
        this.messages.push({
            type    : "error",
            rollup  : true,
            message : message,
            rule    : rule
        });
    },

    /**
     * Report some rollup warning information.
     * @param {String} message The message to store.
     * @param {Object} rule The rule this message relates to.
     * @method rollupWarn
     */
    rollupWarn: function(message, rule) {
        "use strict";
        this.messages.push({
            type    : "warning",
            rollup  : true,
            message : message,
            rule    : rule
        });
    },

    /**
     * Report a statistic.
     * @param {String} name The name of the stat to store.
     * @param {Variant} value The value of the stat.
     * @method stat
     */
    stat: function(name, value) {
        "use strict";
        this.stats[name] = value;
    }
};

// expose for testing purposes
CSSLint._Reporter = Reporter;

/*
 * Utility functions that make life easier.
 */
CSSLint.Util = {
    /*
     * Adds all properties from supplier onto receiver,
     * overwriting if the same name already exists on
     * receiver.
     * @param {Object} The object to receive the properties.
     * @param {Object} The object to provide the properties.
     * @return {Object} The receiver
     */
    mix: function(receiver, supplier) {
        "use strict";
        var prop;

        for (prop in supplier) {
            if (supplier.hasOwnProperty(prop)) {
                receiver[prop] = supplier[prop];
            }
        }

        return prop;
    },

    /*
     * Polyfill for array indexOf() method.
     * @param {Array} values The array to search.
     * @param {Variant} value The value to search for.
     * @return {int} The index of the value if found, -1 if not.
     */
    indexOf: function(values, value) {
        "use strict";
        if (values.indexOf) {
            return values.indexOf(value);
        } else {
            for (var i=0, len=values.length; i < len; i++) {
                if (values[i] === value) {
                    return i;
                }
            }
            return -1;
        }
    },

    /*
     * Polyfill for array forEach() method.
     * @param {Array} values The array to operate on.
     * @param {Function} func The function to call on each item.
     * @return {void}
     */
    forEach: function(values, func) {
        "use strict";
        if (values.forEach) {
            return values.forEach(func);
        } else {
            for (var i=0, len=values.length; i < len; i++) {
                func(values[i], i, values);
            }
        }
    }
};

/*
 * Rule: Don't use adjoining classes (.foo.bar).
 */

CSSLint.addRule({

    // rule information
    id: "adjoining-classes",
    name: "Disallow adjoining classes",
    desc: "Don't use adjoining classes.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-adjoining-classes",
    browsers: "IE6",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;
        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                classCount,
                i, j, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];
                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.SELECTOR_PART_TYPE) {
                        classCount = 0;
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (modifier.type === "class") {
                                classCount++;
                            }
                            if (classCount > 1){
                                reporter.report("Adjoining classes: "+selectors[i].text, part.line, part.col, rule);
                            }
                        }
                    }
                }
            }
        });
    }

});

/*
 * Rule: Don't use width or height when using padding or border.
 */
CSSLint.addRule({

    // rule information
    id: "box-model",
    name: "Beware of broken box size",
    desc: "Don't use width or height when using padding or border.",
    url: "https://github.com/CSSLint/csslint/wiki/Beware-of-box-model-size",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            widthProperties = {
                border: 1,
                "border-left": 1,
                "border-right": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1
            },
            heightProperties = {
                border: 1,
                "border-bottom": 1,
                "border-top": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-top": 1
            },
            properties,
            boxSizing = false;

        function startRule() {
            properties = {};
            boxSizing = false;
        }

        function endRule() {
            var prop, value;

            if (!boxSizing) {
                if (properties.height) {
                    for (prop in heightProperties) {
                        if (heightProperties.hasOwnProperty(prop) && properties[prop]) {
                            value = properties[prop].value;
                            // special case for padding
                            if (!(prop === "padding" && value.parts.length === 2 && value.parts[0].value === 0)) {
                                reporter.report("Using height with " + prop + " can sometimes make elements larger than you expect.", properties[prop].line, properties[prop].col, rule);
                            }
                        }
                    }
                }

                if (properties.width) {
                    for (prop in widthProperties) {
                        if (widthProperties.hasOwnProperty(prop) && properties[prop]) {
                            value = properties[prop].value;

                            if (!(prop === "padding" && value.parts.length === 2 && value.parts[1].value === 0)) {
                                reporter.report("Using width with " + prop + " can sometimes make elements larger than you expect.", properties[prop].line, properties[prop].col, rule);
                            }
                        }
                    }
                }
            }
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event) {
            var name = event.property.text.toLowerCase();

            if (heightProperties[name] || widthProperties[name]) {
                if (!/^0\S*$/.test(event.value) && !(name === "border" && event.value.toString() === "none")) {
                    properties[name] = {
                        line: event.property.line,
                        col: event.property.col,
                        value: event.value
                    };
                }
            } else {
                if (/^(width|height)/i.test(name) && /^(length|percentage)/.test(event.value.parts[0].type)) {
                    properties[name] = 1;
                } else if (name === "box-sizing") {
                    boxSizing = true;
                }
            }

        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
        parser.addListener("endpage", endRule);
        parser.addListener("endpagemargin", endRule);
        parser.addListener("endkeyframerule", endRule);
        parser.addListener("endviewport", endRule);
    }

});

/*
 * Rule: box-sizing doesn't work in IE6 and IE7.
 */

CSSLint.addRule({

    // rule information
    id: "box-sizing",
    name: "Disallow use of box-sizing",
    desc: "The box-sizing properties isn't supported in IE6 and IE7.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-box-sizing",
    browsers: "IE6, IE7",
    tags: ["Compatibility"],

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("property", function(event) {
            var name = event.property.text.toLowerCase();

            if (name === "box-sizing") {
                reporter.report("The box-sizing property isn't supported in IE6 and IE7.", event.line, event.col, rule);
            }
        });
    }

});

/*
 * Rule: Use the bulletproof @font-face syntax to avoid 404's in old IE
 * (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax)
 */

CSSLint.addRule({

    // rule information
    id: "bulletproof-font-face",
    name: "Use the bulletproof @font-face syntax",
    desc: "Use the bulletproof @font-face syntax to avoid 404's in old IE (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax).",
    url: "https://github.com/CSSLint/csslint/wiki/Bulletproof-font-face",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            fontFaceRule = false,
            firstSrc = true,
            ruleFailed = false,
            line, col;

        // Mark the start of a @font-face declaration so we only test properties inside it
        parser.addListener("startfontface", function() {
            fontFaceRule = true;
        });

        parser.addListener("property", function(event) {
            // If we aren't inside an @font-face declaration then just return
            if (!fontFaceRule) {
                return;
            }

            var propertyName = event.property.toString().toLowerCase(),
                value = event.value.toString();

            // Set the line and col numbers for use in the endfontface listener
            line = event.line;
            col = event.col;

            // This is the property that we care about, we can ignore the rest
            if (propertyName === "src") {
                var regex = /^\s?url\(['"].+\.eot\?.*['"]\)\s*format\(['"]embedded-opentype['"]\).*$/i;

                // We need to handle the advanced syntax with two src properties
                if (!value.match(regex) && firstSrc) {
                    ruleFailed = true;
                    firstSrc = false;
                } else if (value.match(regex) && !firstSrc) {
                    ruleFailed = false;
                }
            }


        });

        // Back to normal rules that we don't need to test
        parser.addListener("endfontface", function() {
            fontFaceRule = false;

            if (ruleFailed) {
                reporter.report("@font-face declaration doesn't follow the fontspring bulletproof syntax.", line, col, rule);
            }
        });
    }
});

/*
 * Rule: Include all compatible vendor prefixes to reach a wider
 * range of users.
 */

CSSLint.addRule({

    // rule information
    id: "compatible-vendor-prefixes",
    name: "Require compatible vendor prefixes",
    desc: "Include all compatible vendor prefixes to reach a wider range of users.",
    url: "https://github.com/CSSLint/csslint/wiki/Require-compatible-vendor-prefixes",
    browsers: "All",

    // initialization
    init: function (parser, reporter) {
        "use strict";
        var rule = this,
            compatiblePrefixes,
            properties,
            prop,
            variations,
            prefixed,
            i,
            len,
            inKeyFrame = false,
            arrayPush = Array.prototype.push,
            applyTo = [];

        // See http://peter.sh/experiments/vendor-prefixed-css-property-overview/ for details
        compatiblePrefixes = {
            "animation"                  : "webkit",
            "animation-delay"            : "webkit",
            "animation-direction"        : "webkit",
            "animation-duration"         : "webkit",
            "animation-fill-mode"        : "webkit",
            "animation-iteration-count"  : "webkit",
            "animation-name"             : "webkit",
            "animation-play-state"       : "webkit",
            "animation-timing-function"  : "webkit",
            "appearance"                 : "webkit moz",
            "border-end"                 : "webkit moz",
            "border-end-color"           : "webkit moz",
            "border-end-style"           : "webkit moz",
            "border-end-width"           : "webkit moz",
            "border-image"               : "webkit moz o",
            "border-radius"              : "webkit",
            "border-start"               : "webkit moz",
            "border-start-color"         : "webkit moz",
            "border-start-style"         : "webkit moz",
            "border-start-width"         : "webkit moz",
            "box-align"                  : "webkit moz ms",
            "box-direction"              : "webkit moz ms",
            "box-flex"                   : "webkit moz ms",
            "box-lines"                  : "webkit ms",
            "box-ordinal-group"          : "webkit moz ms",
            "box-orient"                 : "webkit moz ms",
            "box-pack"                   : "webkit moz ms",
            "box-sizing"                 : "",
            "box-shadow"                 : "",
            "column-count"               : "webkit moz ms",
            "column-gap"                 : "webkit moz ms",
            "column-rule"                : "webkit moz ms",
            "column-rule-color"          : "webkit moz ms",
            "column-rule-style"          : "webkit moz ms",
            "column-rule-width"          : "webkit moz ms",
            "column-width"               : "webkit moz ms",
            "hyphens"                    : "epub moz",
            "line-break"                 : "webkit ms",
            "margin-end"                 : "webkit moz",
            "margin-start"               : "webkit moz",
            "marquee-speed"              : "webkit wap",
            "marquee-style"              : "webkit wap",
            "padding-end"                : "webkit moz",
            "padding-start"              : "webkit moz",
            "tab-size"                   : "moz o",
            "text-size-adjust"           : "webkit ms",
            "transform"                  : "webkit ms",
            "transform-origin"           : "webkit ms",
            "transition"                 : "",
            "transition-delay"           : "",
            "transition-duration"        : "",
            "transition-property"        : "",
            "transition-timing-function" : "",
            "user-modify"                : "webkit moz",
            "user-select"                : "webkit moz ms",
            "word-break"                 : "epub ms",
            "writing-mode"               : "epub ms"
        };


        for (prop in compatiblePrefixes) {
            if (compatiblePrefixes.hasOwnProperty(prop)) {
                variations = [];
                prefixed = compatiblePrefixes[prop].split(" ");
                for (i = 0, len = prefixed.length; i < len; i++) {
                    variations.push("-" + prefixed[i] + "-" + prop);
                }
                compatiblePrefixes[prop] = variations;
                arrayPush.apply(applyTo, variations);
            }
        }

        parser.addListener("startrule", function () {
            properties = [];
        });

        parser.addListener("startkeyframes", function (event) {
            inKeyFrame = event.prefix || true;
        });

        parser.addListener("endkeyframes", function () {
            inKeyFrame = false;
        });

        parser.addListener("property", function (event) {
            var name = event.property;
            if (CSSLint.Util.indexOf(applyTo, name.text) > -1) {

                // e.g., -moz-transform is okay to be alone in @-moz-keyframes
                if (!inKeyFrame || typeof inKeyFrame !== "string" ||
                        name.text.indexOf("-" + inKeyFrame + "-") !== 0) {
                    properties.push(name);
                }
            }
        });

        parser.addListener("endrule", function () {
            if (!properties.length) {
                return;
            }

            var propertyGroups = {},
                i,
                len,
                name,
                prop,
                variations,
                value,
                full,
                actual,
                item,
                propertiesSpecified;

            for (i = 0, len = properties.length; i < len; i++) {
                name = properties[i];

                for (prop in compatiblePrefixes) {
                    if (compatiblePrefixes.hasOwnProperty(prop)) {
                        variations = compatiblePrefixes[prop];
                        if (CSSLint.Util.indexOf(variations, name.text) > -1) {
                            if (!propertyGroups[prop]) {
                                propertyGroups[prop] = {
                                    full: variations.slice(0),
                                    actual: [],
                                    actualNodes: []
                                };
                            }
                            if (CSSLint.Util.indexOf(propertyGroups[prop].actual, name.text) === -1) {
                                propertyGroups[prop].actual.push(name.text);
                                propertyGroups[prop].actualNodes.push(name);
                            }
                        }
                    }
                }
            }

            for (prop in propertyGroups) {
                if (propertyGroups.hasOwnProperty(prop)) {
                    value = propertyGroups[prop];
                    full = value.full;
                    actual = value.actual;

                    if (full.length > actual.length) {
                        for (i = 0, len = full.length; i < len; i++) {
                            item = full[i];
                            if (CSSLint.Util.indexOf(actual, item) === -1) {
                                propertiesSpecified = (actual.length === 1) ? actual[0] : (actual.length === 2) ? actual.join(" and ") : actual.join(", ");
                                reporter.report("The property " + item + " is compatible with " + propertiesSpecified + " and should be included as well.", value.actualNodes[0].line, value.actualNodes[0].col, rule);
                            }
                        }

                    }
                }
            }
        });
    }
});

/*
 * Rule: Certain properties don't play well with certain display values.
 * - float should not be used with inline-block
 * - height, width, margin-top, margin-bottom, float should not be used with inline
 * - vertical-align should not be used with block
 * - margin, float should not be used with table-*
 */

CSSLint.addRule({

    // rule information
    id: "display-property-grouping",
    name: "Require properties appropriate for display",
    desc: "Certain properties shouldn't be used with certain display property values.",
    url: "https://github.com/CSSLint/csslint/wiki/Require-properties-appropriate-for-display",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        var propertiesToCheck = {
                display: 1,
                "float": "none",
                height: 1,
                width: 1,
                margin: 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-bottom": 1,
                "margin-top": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-bottom": 1,
                "padding-top": 1,
                "vertical-align": 1
            },
            properties;

        function reportProperty(name, display, msg) {
            if (properties[name]) {
                if (typeof propertiesToCheck[name] !== "string" || properties[name].value.toLowerCase() !== propertiesToCheck[name]) {
                    reporter.report(msg || name + " can't be used with display: " + display + ".", properties[name].line, properties[name].col, rule);
                }
            }
        }

        function startRule() {
            properties = {};
        }

        function endRule() {

            var display = properties.display ? properties.display.value : null;
            if (display) {
                switch (display) {

                    case "inline":
                        // height, width, margin-top, margin-bottom, float should not be used with inline
                        reportProperty("height", display);
                        reportProperty("width", display);
                        reportProperty("margin", display);
                        reportProperty("margin-top", display);
                        reportProperty("margin-bottom", display);
                        reportProperty("float", display, "display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug).");
                        break;

                    case "block":
                        // vertical-align should not be used with block
                        reportProperty("vertical-align", display);
                        break;

                    case "inline-block":
                        // float should not be used with inline-block
                        reportProperty("float", display);
                        break;

                    default:
                        // margin, float should not be used with table
                        if (display.indexOf("table-") === 0) {
                            reportProperty("margin", display);
                            reportProperty("margin-left", display);
                            reportProperty("margin-right", display);
                            reportProperty("margin-top", display);
                            reportProperty("margin-bottom", display);
                            reportProperty("float", display);
                        }

                        // otherwise do nothing
                }
            }

        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event) {
            var name = event.property.text.toLowerCase();

            if (propertiesToCheck[name]) {
                properties[name] = {
                    value: event.value.text,
                    line: event.property.line,
                    col: event.property.col
                };
            }
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
        parser.addListener("endkeyframerule", endRule);
        parser.addListener("endpagemargin", endRule);
        parser.addListener("endpage", endRule);
        parser.addListener("endviewport", endRule);

    }

});

/*
 * Rule: Disallow duplicate background-images (using url).
 */

CSSLint.addRule({

    // rule information
    id: "duplicate-background-images",
    name: "Disallow duplicate background images",
    desc: "Every background-image should be unique. Use a common class for e.g. sprites.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-duplicate-background-images",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            stack = {};

        parser.addListener("property", function(event) {
            var name = event.property.text,
                value = event.value,
                i, len;

            if (name.match(/background/i)) {
                for (i=0, len=value.parts.length; i < len; i++) {
                    if (value.parts[i].type === "uri") {
                        if (typeof stack[value.parts[i].uri] === "undefined") {
                            stack[value.parts[i].uri] = event;
                        } else {
                            reporter.report("Background image '" + value.parts[i].uri + "' was used multiple times, first declared at line " + stack[value.parts[i].uri].line + ", col " + stack[value.parts[i].uri].col + ".", event.line, event.col, rule);
                        }
                    }
                }
            }
        });
    }
});

/*
 * Rule: Duplicate properties must appear one after the other. If an already-defined
 * property appears somewhere else in the rule, then it's likely an error.
 */

CSSLint.addRule({

    // rule information
    id: "duplicate-properties",
    name: "Disallow duplicate properties",
    desc: "Duplicate properties must appear one after the other.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-duplicate-properties",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            properties,
            lastProperty;

        function startRule() {
            properties = {};
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event) {
            var property = event.property,
                name = property.text.toLowerCase();

            if (properties[name] && (lastProperty !== name || properties[name] === event.value.text)) {
                reporter.report("Duplicate property '" + event.property + "' found.", event.line, event.col, rule);
            }

            properties[name] = event.value.text;
            lastProperty = name;

        });


    }

});

/*
 * Rule: Style rules without any properties defined should be removed.
 */

CSSLint.addRule({

    // rule information
    id: "empty-rules",
    name: "Disallow empty rules",
    desc: "Rules without any properties specified should be removed.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-empty-rules",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;

        parser.addListener("startrule", function() {
            count=0;
        });

        parser.addListener("property", function() {
            count++;
        });

        parser.addListener("endrule", function(event) {
            var selectors = event.selectors;
            if (count === 0) {
                reporter.report("Rule is empty.", selectors[0].line, selectors[0].col, rule);
            }
        });
    }

});

/*
 * Rule: There should be no syntax errors. (Duh.)
 */

CSSLint.addRule({

    // rule information
    id: "errors",
    name: "Parsing Errors",
    desc: "This rule looks for recoverable syntax errors.",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("error", function(event) {
            reporter.error(event.message, event.line, event.col, rule);
        });

    }

});

CSSLint.addRule({

    // rule information
    id: "fallback-colors",
    name: "Require fallback colors",
    desc: "For older browsers that don't support RGBA, HSL, or HSLA, provide a fallback color.",
    url: "https://github.com/CSSLint/csslint/wiki/Require-fallback-colors",
    browsers: "IE6,IE7,IE8",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            lastProperty,
            propertiesToCheck = {
                color: 1,
                background: 1,
                "border-color": 1,
                "border-top-color": 1,
                "border-right-color": 1,
                "border-bottom-color": 1,
                "border-left-color": 1,
                border: 1,
                "border-top": 1,
                "border-right": 1,
                "border-bottom": 1,
                "border-left": 1,
                "background-color": 1
            };

        function startRule() {
            lastProperty = null;
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event) {
            var property = event.property,
                name = property.text.toLowerCase(),
                parts = event.value.parts,
                i = 0,
                colorType = "",
                len = parts.length;

            if (propertiesToCheck[name]) {
                while (i < len) {
                    if (parts[i].type === "color") {
                        if ("alpha" in parts[i] || "hue" in parts[i]) {

                            if (/([^\)]+)\(/.test(parts[i])) {
                                colorType = RegExp.$1.toUpperCase();
                            }

                            if (!lastProperty || (lastProperty.property.text.toLowerCase() !== name || lastProperty.colorType !== "compat")) {
                                reporter.report("Fallback " + name + " (hex or RGB) should precede " + colorType + " " + name + ".", event.line, event.col, rule);
                            }
                        } else {
                            event.colorType = "compat";
                        }
                    }

                    i++;
                }
            }

            lastProperty = event;
        });

    }

});

/*
 * Rule: You shouldn't use more than 10 floats. If you do, there's probably
 * room for some abstraction.
 */

CSSLint.addRule({

    // rule information
    id: "floats",
    name: "Disallow too many floats",
    desc: "This rule tests if the float property is used too many times",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-too-many-floats",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;
        var count = 0;

        // count how many times "float" is used
        parser.addListener("property", function(event) {
            if (event.property.text.toLowerCase() === "float" &&
                    event.value.text.toLowerCase() !== "none") {
                count++;
            }
        });

        // report the results
        parser.addListener("endstylesheet", function() {
            reporter.stat("floats", count);
            if (count >= 10) {
                reporter.rollupWarn("Too many floats (" + count + "), you're probably using them for layout. Consider using a grid system instead.", rule);
            }
        });
    }

});

/*
 * Rule: Avoid too many @font-face declarations in the same stylesheet.
 */

CSSLint.addRule({

    // rule information
    id: "font-faces",
    name: "Don't use too many web fonts",
    desc: "Too many different web fonts in the same stylesheet.",
    url: "https://github.com/CSSLint/csslint/wiki/Don%27t-use-too-many-web-fonts",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;


        parser.addListener("startfontface", function() {
            count++;
        });

        parser.addListener("endstylesheet", function() {
            if (count > 5) {
                reporter.rollupWarn("Too many @font-face declarations (" + count + ").", rule);
            }
        });
    }

});

/*
 * Rule: You shouldn't need more than 9 font-size declarations.
 */

CSSLint.addRule({

    // rule information
    id: "font-sizes",
    name: "Disallow too many font sizes",
    desc: "Checks the number of font-size declarations.",
    url: "https://github.com/CSSLint/csslint/wiki/Don%27t-use-too-many-font-size-declarations",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;

        // check for use of "font-size"
        parser.addListener("property", function(event) {
            if (event.property.toString() === "font-size") {
                count++;
            }
        });

        // report the results
        parser.addListener("endstylesheet", function() {
            reporter.stat("font-sizes", count);
            if (count >= 10) {
                reporter.rollupWarn("Too many font-size declarations (" + count + "), abstraction needed.", rule);
            }
        });
    }

});

/*
 * Rule: When using a vendor-prefixed gradient, make sure to use them all.
 */

CSSLint.addRule({

    // rule information
    id: "gradients",
    name: "Require all gradient definitions",
    desc: "When using a vendor-prefixed gradient, make sure to use them all.",
    url: "https://github.com/CSSLint/csslint/wiki/Require-all-gradient-definitions",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            gradients;

        parser.addListener("startrule", function() {
            gradients = {
                moz: 0,
                webkit: 0,
                oldWebkit: 0,
                o: 0
            };
        });

        parser.addListener("property", function(event) {

            if (/\-(moz|o|webkit)(?:\-(?:linear|radial))\-gradient/i.test(event.value)) {
                gradients[RegExp.$1] = 1;
            } else if (/\-webkit\-gradient/i.test(event.value)) {
                gradients.oldWebkit = 1;
            }

        });

        parser.addListener("endrule", function(event) {
            var missing = [];

            if (!gradients.moz) {
                missing.push("Firefox 3.6+");
            }

            if (!gradients.webkit) {
                missing.push("Webkit (Safari 5+, Chrome)");
            }

            if (!gradients.oldWebkit) {
                missing.push("Old Webkit (Safari 4+, Chrome)");
            }

            if (!gradients.o) {
                missing.push("Opera 11.1+");
            }

            if (missing.length && missing.length < 4) {
                reporter.report("Missing vendor-prefixed CSS gradients for " + missing.join(", ") + ".", event.selectors[0].line, event.selectors[0].col, rule);
            }

        });

    }

});

/*
 * Rule: Don't use IDs for selectors.
 */

CSSLint.addRule({

    // rule information
    id: "ids",
    name: "Disallow IDs in selectors",
    desc: "Selectors should not contain IDs.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-IDs-in-selectors",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;
        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                idCount,
                i, j, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];
                idCount = 0;

                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.SELECTOR_PART_TYPE) {
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (modifier.type === "id") {
                                idCount++;
                            }
                        }
                    }
                }

                if (idCount === 1) {
                    reporter.report("Don't use IDs in selectors.", selector.line, selector.col, rule);
                } else if (idCount > 1) {
                    reporter.report(idCount + " IDs in the selector, really?", selector.line, selector.col, rule);
                }
            }

        });
    }

});

/*
 * Rule: IE6-9 supports up to 31 stylesheet import.
 * Reference:
 * http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/internet-explorer-stylesheet-rule-selector-import-sheet-limit-maximum.aspx
 */

CSSLint.addRule({

    // rule information
    id: "import-ie-limit",
    name: "@import limit on IE6-IE9",
    desc: "IE6-9 supports up to 31 @import per stylesheet",
    browsers: "IE6, IE7, IE8, IE9",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            MAX_IMPORT_COUNT = 31,
            count = 0;

        function startPage() {
            count = 0;
        }

        parser.addListener("startpage", startPage);

        parser.addListener("import", function() {
            count++;
        });

        parser.addListener("endstylesheet", function() {
            if (count > MAX_IMPORT_COUNT) {
                reporter.rollupError(
                    "Too many @import rules (" + count + "). IE6-9 supports up to 31 import per stylesheet.",
                    rule
                );
            }
        });
    }

});

/*
 * Rule: Don't use @import, use <link> instead.
 */

CSSLint.addRule({

    // rule information
    id: "import",
    name: "Disallow @import",
    desc: "Don't use @import, use <link> instead.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-%40import",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("import", function(event) {
            reporter.report("@import prevents parallel downloads, use <link> instead.", event.line, event.col, rule);
        });

    }

});

/*
 * Rule: Make sure !important is not overused, this could lead to specificity
 * war. Display a warning on !important declarations, an error if it's
 * used more at least 10 times.
 */

CSSLint.addRule({

    // rule information
    id: "important",
    name: "Disallow !important",
    desc: "Be careful when using !important declaration",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-%21important",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;

        // warn that important is used and increment the declaration counter
        parser.addListener("property", function(event) {
            if (event.important === true) {
                count++;
                reporter.report("Use of !important", event.line, event.col, rule);
            }
        });

        // if there are more than 10, show an error
        parser.addListener("endstylesheet", function() {
            reporter.stat("important", count);
            if (count >= 10) {
                reporter.rollupWarn("Too many !important declarations (" + count + "), try to use less than 10 to avoid specificity issues.", rule);
            }
        });
    }

});

/*
 * Rule: Properties should be known (listed in CSS3 specification) or
 * be a vendor-prefixed property.
 */

CSSLint.addRule({

    // rule information
    id: "known-properties",
    name: "Require use of known properties",
    desc: "Properties should be known (listed in CSS3 specification) or be a vendor-prefixed property.",
    url: "https://github.com/CSSLint/csslint/wiki/Require-use-of-known-properties",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("property", function(event) {

            // the check is handled entirely by the parser-lib (https://github.com/nzakas/parser-lib)
            if (event.invalid) {
                reporter.report(event.invalid.message, event.line, event.col, rule);
            }

        });
    }

});

/*
 * Rule: All properties should be in alphabetical order.
 */

CSSLint.addRule({

    // rule information
    id: "order-alphabetical",
    name: "Alphabetical order",
    desc: "Assure properties are in alphabetical order",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            properties;

        var startRule = function () {
            properties = [];
        };

        var endRule = function(event) {
            var currentProperties = properties.join(","),
                expectedProperties = properties.sort().join(",");

            if (currentProperties !== expectedProperties) {
                reporter.report("Rule doesn't have all its properties in alphabetical order.", event.line, event.col, rule);
            }
        };

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event) {
            var name = event.property.text,
                lowerCasePrefixLessName = name.toLowerCase().replace(/^-.*?-/, "");

            properties.push(lowerCasePrefixLessName);
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
        parser.addListener("endpage", endRule);
        parser.addListener("endpagemargin", endRule);
        parser.addListener("endkeyframerule", endRule);
        parser.addListener("endviewport", endRule);
    }

});

/*
 * Rule: outline: none or outline: 0 should only be used in a :focus rule
 *       and only if there are other properties in the same rule.
 */

CSSLint.addRule({

    // rule information
    id: "outline-none",
    name: "Disallow outline: none",
    desc: "Use of outline: none or outline: 0 should be limited to :focus rules.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-outline%3Anone",
    browsers: "All",
    tags: ["Accessibility"],

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            lastRule;

        function startRule(event) {
            if (event.selectors) {
                lastRule = {
                    line: event.line,
                    col: event.col,
                    selectors: event.selectors,
                    propCount: 0,
                    outline: false
                };
            } else {
                lastRule = null;
            }
        }

        function endRule() {
            if (lastRule) {
                if (lastRule.outline) {
                    if (lastRule.selectors.toString().toLowerCase().indexOf(":focus") === -1) {
                        reporter.report("Outlines should only be modified using :focus.", lastRule.line, lastRule.col, rule);
                    } else if (lastRule.propCount === 1) {
                        reporter.report("Outlines shouldn't be hidden unless other visual changes are made.", lastRule.line, lastRule.col, rule);
                    }
                }
            }
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event) {
            var name = event.property.text.toLowerCase(),
                value = event.value;

            if (lastRule) {
                lastRule.propCount++;
                if (name === "outline" && (value.toString() === "none" || value.toString() === "0")) {
                    lastRule.outline = true;
                }
            }

        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
        parser.addListener("endpage", endRule);
        parser.addListener("endpagemargin", endRule);
        parser.addListener("endkeyframerule", endRule);
        parser.addListener("endviewport", endRule);

    }

});

/*
 * Rule: Don't use classes or IDs with elements (a.foo or a#foo).
 */

CSSLint.addRule({

    // rule information
    id: "overqualified-elements",
    name: "Disallow overqualified elements",
    desc: "Don't use classes or IDs with elements (a.foo or a#foo).",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-overqualified-elements",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            classes = {};

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                i, j, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.SELECTOR_PART_TYPE) {
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (part.elementName && modifier.type === "id") {
                                reporter.report("Element (" + part + ") is overqualified, just use " + modifier + " without element name.", part.line, part.col, rule);
                            } else if (modifier.type === "class") {

                                if (!classes[modifier]) {
                                    classes[modifier] = [];
                                }
                                classes[modifier].push({
                                    modifier: modifier,
                                    part: part
                                });
                            }
                        }
                    }
                }
            }
        });

        parser.addListener("endstylesheet", function() {

            var prop;
            for (prop in classes) {
                if (classes.hasOwnProperty(prop)) {

                    // one use means that this is overqualified
                    if (classes[prop].length === 1 && classes[prop][0].part.elementName) {
                        reporter.report("Element (" + classes[prop][0].part + ") is overqualified, just use " + classes[prop][0].modifier + " without element name.", classes[prop][0].part.line, classes[prop][0].part.col, rule);
                    }
                }
            }
        });
    }

});

/*
 * Rule: Headings (h1-h6) should not be qualified (namespaced).
 */

CSSLint.addRule({

    // rule information
    id: "qualified-headings",
    name: "Disallow qualified headings",
    desc: "Headings should not be qualified (namespaced).",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-qualified-headings",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                i, j;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.SELECTOR_PART_TYPE) {
                        if (part.elementName && /h[1-6]/.test(part.elementName.toString()) && j > 0) {
                            reporter.report("Heading (" + part.elementName + ") should not be qualified.", part.line, part.col, rule);
                        }
                    }
                }
            }
        });
    }

});

/*
 * Rule: Selectors that look like regular expressions are slow and should be avoided.
 */

CSSLint.addRule({

    // rule information
    id: "regex-selectors",
    name: "Disallow selectors that look like regexs",
    desc: "Selectors that look like regular expressions are slow and should be avoided.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-selectors-that-look-like-regular-expressions",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                modifier,
                i, j, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];
                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.SELECTOR_PART_TYPE) {
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (modifier.type === "attribute") {
                                if (/([~\|\^\$\*]=)/.test(modifier)) {
                                    reporter.report("Attribute selectors with " + RegExp.$1 + " are slow!", modifier.line, modifier.col, rule);
                                }
                            }

                        }
                    }
                }
            }
        });
    }

});

/*
 * Rule: Total number of rules should not exceed x.
 */

CSSLint.addRule({

    // rule information
    id: "rules-count",
    name: "Rules Count",
    desc: "Track how many rules there are.",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var count = 0;

        // count each rule
        parser.addListener("startrule", function() {
            count++;
        });

        parser.addListener("endstylesheet", function() {
            reporter.stat("rule-count", count);
        });
    }

});

/*
 * Rule: Warn people with approaching the IE 4095 limit
 */

CSSLint.addRule({

    // rule information
    id: "selector-max-approaching",
    name: "Warn when approaching the 4095 selector limit for IE",
    desc: "Will warn when selector count is >= 3800 selectors.",
    browsers: "IE",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this, count = 0;

        parser.addListener("startrule", function(event) {
            count += event.selectors.length;
        });

        parser.addListener("endstylesheet", function() {
            if (count >= 3800) {
                reporter.report("You have " + count + " selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", 0, 0, rule);
            }
        });
    }

});

/*
 * Rule: Warn people past the IE 4095 limit
 */

CSSLint.addRule({

    // rule information
    id: "selector-max",
    name: "Error when past the 4095 selector limit for IE",
    desc: "Will error when selector count is > 4095.",
    browsers: "IE",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this, count = 0;

        parser.addListener("startrule", function(event) {
            count += event.selectors.length;
        });

        parser.addListener("endstylesheet", function() {
            if (count > 4095) {
                reporter.report("You have " + count + " selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", 0, 0, rule);
            }
        });
    }

});

/*
 * Rule: Avoid new-line characters in selectors.
 */

CSSLint.addRule({

    // rule information
    id: "selector-newline",
    name: "Disallow new-line characters in selectors",
    desc: "New-line characters in selectors are usually a forgotten comma and not a descendant combinator.",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        function startRule(event) {
            var i, len, selector, p, n, pLen, part, part2, type, currentLine, nextLine,
                selectors = event.selectors;

            for (i = 0, len = selectors.length; i < len; i++) {
                selector = selectors[i];
                for (p = 0, pLen = selector.parts.length; p < pLen; p++) {
                    for (n = p + 1; n < pLen; n++) {
                        part = selector.parts[p];
                        part2 = selector.parts[n];
                        type = part.type;
                        currentLine = part.line;
                        nextLine = part2.line;

                        if (type === "descendant" && nextLine > currentLine) {
                            reporter.report("newline character found in selector (forgot a comma?)", currentLine, selectors[i].parts[0].col, rule);
                        }
                    }
                }

            }
        }

        parser.addListener("startrule", startRule);

    }
});

/*
 * Rule: Use shorthand properties where possible.
 *
 */

CSSLint.addRule({

    // rule information
    id: "shorthand",
    name: "Require shorthand properties",
    desc: "Use shorthand properties where possible.",
    url: "https://github.com/CSSLint/csslint/wiki/Require-shorthand-properties",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            prop, i, len,
            propertiesToCheck = {},
            properties,
            mapping = {
                "margin": [
                    "margin-top",
                    "margin-bottom",
                    "margin-left",
                    "margin-right"
                ],
                "padding": [
                    "padding-top",
                    "padding-bottom",
                    "padding-left",
                    "padding-right"
                ]
            };

        // initialize propertiesToCheck
        for (prop in mapping) {
            if (mapping.hasOwnProperty(prop)) {
                for (i=0, len=mapping[prop].length; i < len; i++) {
                    propertiesToCheck[mapping[prop][i]] = prop;
                }
            }
        }

        function startRule() {
            properties = {};
        }

        // event handler for end of rules
        function endRule(event) {

            var prop, i, len, total;

            // check which properties this rule has
            for (prop in mapping) {
                if (mapping.hasOwnProperty(prop)) {
                    total=0;

                    for (i=0, len=mapping[prop].length; i < len; i++) {
                        total += properties[mapping[prop][i]] ? 1 : 0;
                    }

                    if (total === mapping[prop].length) {
                        reporter.report("The properties " + mapping[prop].join(", ") + " can be replaced by " + prop + ".", event.line, event.col, rule);
                    }
                }
            }
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);

        // check for use of "font-size"
        parser.addListener("property", function(event) {
            var name = event.property.toString().toLowerCase();

            if (propertiesToCheck[name]) {
                properties[name] = 1;
            }
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);

    }

});

/*
 * Rule: Don't use properties with a star prefix.
 *
 */

CSSLint.addRule({

    // rule information
    id: "star-property-hack",
    name: "Disallow properties with a star prefix",
    desc: "Checks for the star property hack (targets IE6/7)",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-star-hack",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        // check if property name starts with "*"
        parser.addListener("property", function(event) {
            var property = event.property;

            if (property.hack === "*") {
                reporter.report("Property with star prefix found.", event.property.line, event.property.col, rule);
            }
        });
    }
});

/*
 * Rule: Don't use text-indent for image replacement if you need to support rtl.
 *
 */

CSSLint.addRule({

    // rule information
    id: "text-indent",
    name: "Disallow negative text-indent",
    desc: "Checks for text indent less than -99px",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-negative-text-indent",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            textIndent,
            direction;


        function startRule() {
            textIndent = false;
            direction = "inherit";
        }

        // event handler for end of rules
        function endRule() {
            if (textIndent && direction !== "ltr") {
                reporter.report("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", textIndent.line, textIndent.col, rule);
            }
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);

        // check for use of "font-size"
        parser.addListener("property", function(event) {
            var name = event.property.toString().toLowerCase(),
                value = event.value;

            if (name === "text-indent" && value.parts[0].value < -99) {
                textIndent = event.property;
            } else if (name === "direction" && value.toString() === "ltr") {
                direction = "ltr";
            }
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);

    }

});

/*
 * Rule: Don't use properties with a underscore prefix.
 *
 */

CSSLint.addRule({

    // rule information
    id: "underscore-property-hack",
    name: "Disallow properties with an underscore prefix",
    desc: "Checks for the underscore property hack (targets IE6)",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-underscore-hack",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        // check if property name starts with "_"
        parser.addListener("property", function(event) {
            var property = event.property;

            if (property.hack === "_") {
                reporter.report("Property with underscore prefix found.", event.property.line, event.property.col, rule);
            }
        });
    }
});

/*
 * Rule: Headings (h1-h6) should be defined only once.
 */

CSSLint.addRule({

    // rule information
    id: "unique-headings",
    name: "Headings should only be defined once",
    desc: "Headings should be defined only once.",
    url: "https://github.com/CSSLint/csslint/wiki/Headings-should-only-be-defined-once",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        var headings = {
            h1: 0,
            h2: 0,
            h3: 0,
            h4: 0,
            h5: 0,
            h6: 0
        };

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                pseudo,
                i, j;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];
                part = selector.parts[selector.parts.length-1];

                if (part.elementName && /(h[1-6])/i.test(part.elementName.toString())) {

                    for (j=0; j < part.modifiers.length; j++) {
                        if (part.modifiers[j].type === "pseudo") {
                            pseudo = true;
                            break;
                        }
                    }

                    if (!pseudo) {
                        headings[RegExp.$1]++;
                        if (headings[RegExp.$1] > 1) {
                            reporter.report("Heading (" + part.elementName + ") has already been defined.", part.line, part.col, rule);
                        }
                    }
                }
            }
        });

        parser.addListener("endstylesheet", function() {
            var prop,
                messages = [];

            for (prop in headings) {
                if (headings.hasOwnProperty(prop)) {
                    if (headings[prop] > 1) {
                        messages.push(headings[prop] + " " + prop + "s");
                    }
                }
            }

            if (messages.length) {
                reporter.rollupWarn("You have " + messages.join(", ") + " defined in this stylesheet.", rule);
            }
        });
    }

});

/*
 * Rule: Don't use universal selector because it's slow.
 */

CSSLint.addRule({

    // rule information
    id: "universal-selector",
    name: "Disallow universal selector",
    desc: "The universal selector (*) is known to be slow.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-universal-selector",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                i;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                part = selector.parts[selector.parts.length-1];
                if (part.elementName === "*") {
                    reporter.report(rule.desc, part.line, part.col, rule);
                }
            }
        });
    }

});

/*
 * Rule: Don't use unqualified attribute selectors because they're just like universal selectors.
 */

CSSLint.addRule({

    // rule information
    id: "unqualified-attributes",
    name: "Disallow unqualified attribute selectors",
    desc: "Unqualified attribute selectors are known to be slow.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-unqualified-attribute-selectors",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";

        var rule = this;

        parser.addListener("startrule", function(event) {

            var selectors = event.selectors,
                selectorContainsClassOrId = false,
                selector,
                part,
                modifier,
                i, k;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                part = selector.parts[selector.parts.length-1];
                if (part.type === parser.SELECTOR_PART_TYPE) {
                    for (k=0; k < part.modifiers.length; k++) {
                        modifier = part.modifiers[k];

                        if (modifier.type === "class" || modifier.type === "id") {
                            selectorContainsClassOrId = true;
                            break;
                        }
                    }

                    if (!selectorContainsClassOrId) {
                        for (k=0; k < part.modifiers.length; k++) {
                            modifier = part.modifiers[k];
                            if (modifier.type === "attribute" && (!part.elementName || part.elementName === "*")) {
                                reporter.report(rule.desc, part.line, part.col, rule);
                            }
                        }
                    }
                }

            }
        });
    }

});

/*
 * Rule: When using a vendor-prefixed property, make sure to
 * include the standard one.
 */

CSSLint.addRule({

    // rule information
    id: "vendor-prefix",
    name: "Require standard property with vendor prefix",
    desc: "When using a vendor-prefixed property, make sure to include the standard one.",
    url: "https://github.com/CSSLint/csslint/wiki/Require-standard-property-with-vendor-prefix",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            properties,
            num,
            propertiesToCheck = {
                "-webkit-border-radius": "border-radius",
                "-webkit-border-top-left-radius": "border-top-left-radius",
                "-webkit-border-top-right-radius": "border-top-right-radius",
                "-webkit-border-bottom-left-radius": "border-bottom-left-radius",
                "-webkit-border-bottom-right-radius": "border-bottom-right-radius",

                "-o-border-radius": "border-radius",
                "-o-border-top-left-radius": "border-top-left-radius",
                "-o-border-top-right-radius": "border-top-right-radius",
                "-o-border-bottom-left-radius": "border-bottom-left-radius",
                "-o-border-bottom-right-radius": "border-bottom-right-radius",

                "-moz-border-radius": "border-radius",
                "-moz-border-radius-topleft": "border-top-left-radius",
                "-moz-border-radius-topright": "border-top-right-radius",
                "-moz-border-radius-bottomleft": "border-bottom-left-radius",
                "-moz-border-radius-bottomright": "border-bottom-right-radius",

                "-moz-column-count": "column-count",
                "-webkit-column-count": "column-count",

                "-moz-column-gap": "column-gap",
                "-webkit-column-gap": "column-gap",

                "-moz-column-rule": "column-rule",
                "-webkit-column-rule": "column-rule",

                "-moz-column-rule-style": "column-rule-style",
                "-webkit-column-rule-style": "column-rule-style",

                "-moz-column-rule-color": "column-rule-color",
                "-webkit-column-rule-color": "column-rule-color",

                "-moz-column-rule-width": "column-rule-width",
                "-webkit-column-rule-width": "column-rule-width",

                "-moz-column-width": "column-width",
                "-webkit-column-width": "column-width",

                "-webkit-column-span": "column-span",
                "-webkit-columns": "columns",

                "-moz-box-shadow": "box-shadow",
                "-webkit-box-shadow": "box-shadow",

                "-moz-transform": "transform",
                "-webkit-transform": "transform",
                "-o-transform": "transform",
                "-ms-transform": "transform",

                "-moz-transform-origin": "transform-origin",
                "-webkit-transform-origin": "transform-origin",
                "-o-transform-origin": "transform-origin",
                "-ms-transform-origin": "transform-origin",

                "-moz-box-sizing": "box-sizing",
                "-webkit-box-sizing": "box-sizing"
            };

        // event handler for beginning of rules
        function startRule() {
            properties = {};
            num = 1;
        }

        // event handler for end of rules
        function endRule() {
            var prop,
                i,
                len,
                needed,
                actual,
                needsStandard = [];

            for (prop in properties) {
                if (propertiesToCheck[prop]) {
                    needsStandard.push({
                        actual: prop,
                        needed: propertiesToCheck[prop]
                    });
                }
            }

            for (i=0, len=needsStandard.length; i < len; i++) {
                needed = needsStandard[i].needed;
                actual = needsStandard[i].actual;

                if (!properties[needed]) {
                    reporter.report("Missing standard property '" + needed + "' to go along with '" + actual + "'.", properties[actual][0].name.line, properties[actual][0].name.col, rule);
                } else {
                    // make sure standard property is last
                    if (properties[needed][0].pos < properties[actual][0].pos) {
                        reporter.report("Standard property '" + needed + "' should come after vendor-prefixed property '" + actual + "'.", properties[actual][0].name.line, properties[actual][0].name.col, rule);
                    }
                }
            }

        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event) {
            var name = event.property.text.toLowerCase();

            if (!properties[name]) {
                properties[name] = [];
            }

            properties[name].push({
                name: event.property,
                value: event.value,
                pos: num++
            });
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
        parser.addListener("endpage", endRule);
        parser.addListener("endpagemargin", endRule);
        parser.addListener("endkeyframerule", endRule);
        parser.addListener("endviewport", endRule);
    }

});

/*
 * Rule: You don't need to specify units when a value is 0.
 */

CSSLint.addRule({

    // rule information
    id: "zero-units",
    name: "Disallow units for 0 values",
    desc: "You don't need to specify units when a value is 0.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-units-for-zero-values",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        // count how many times "float" is used
        parser.addListener("property", function(event) {
            var parts = event.value.parts,
                i = 0,
                len = parts.length;

            while (i < len) {
                if ((parts[i].units || parts[i].type === "percentage") && parts[i].value === 0 && parts[i].type !== "time") {
                    reporter.report("Values of 0 shouldn't have units specified.", parts[i].line, parts[i].col, rule);
                }
                i++;
            }

        });

    }

});

(function() {
    "use strict";

    /**
     * Replace special characters before write to output.
     *
     * Rules:
     *  - single quotes is the escape sequence for double-quotes
     *  - &amp; is the escape sequence for &
     *  - &lt; is the escape sequence for <
     *  - &gt; is the escape sequence for >
     *
     * @param {String} message to escape
     * @return escaped message as {String}
     */
    var xmlEscape = function(str) {
        if (!str || str.constructor !== String) {
            return "";
        }

        return str.replace(/["&><]/g, function(match) {
            switch (match) {
                case "\"":
                    return "&quot;";
                case "&":
                    return "&amp;";
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
            }
        });
    };

    CSSLint.addFormatter({
        // format information
        id: "checkstyle-xml",
        name: "Checkstyle XML format",

        /**
         * Return opening root XML tag.
         * @return {String} to prepend before all results
         */
        startFormat: function() {
            return "<?xml version=\"1.0\" encoding=\"utf-8\"?><checkstyle>";
        },

        /**
         * Return closing root XML tag.
         * @return {String} to append after all results
         */
        endFormat: function() {
            return "</checkstyle>";
        },

        /**
         * Returns message when there is a file read error.
         * @param {String} filename The name of the file that caused the error.
         * @param {String} message The error message
         * @return {String} The error message.
         */
        readError: function(filename, message) {
            return "<file name=\"" + xmlEscape(filename) + "\"><error line=\"0\" column=\"0\" severty=\"error\" message=\"" + xmlEscape(message) + "\"></error></file>";
        },

        /**
         * Given CSS Lint results for a file, return output for this format.
         * @param results {Object} with error and warning messages
         * @param filename {String} relative file path
         * @param options {Object} (UNUSED for now) specifies special handling of output
         * @return {String} output for results
         */
        formatResults: function(results, filename/*, options*/) {
            var messages = results.messages,
                output = [];

            /**
             * Generate a source string for a rule.
             * Checkstyle source strings usually resemble Java class names e.g
             * net.csslint.SomeRuleName
             * @param {Object} rule
             * @return rule source as {String}
             */
            var generateSource = function(rule) {
                if (!rule || !("name" in rule)) {
                    return "";
                }
                return "net.csslint." + rule.name.replace(/\s/g, "");
            };


            if (messages.length > 0) {
                output.push("<file name=\""+filename+"\">");
                CSSLint.Util.forEach(messages, function (message) {
                    // ignore rollups for now
                    if (!message.rollup) {
                        output.push("<error line=\"" + message.line + "\" column=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                          " message=\"" + xmlEscape(message.message) + "\" source=\"" + generateSource(message.rule) +"\"/>");
                    }
                });
                output.push("</file>");
            }

            return output.join("");
        }
    });

}());

CSSLint.addFormatter({
    // format information
    id: "compact",
    name: "Compact, 'porcelain' format",

    /**
     * Return content to be printed before all file results.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        "use strict";
        return "";
    },

    /**
     * Return content to be printed after all file results.
     * @return {String} to append after all results
     */
    endFormat: function() {
        "use strict";
        return "";
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} relative file path
     * @param options {Object} (Optional) specifies special handling of output
     * @return {String} output for results
     */
    formatResults: function(results, filename, options) {
        "use strict";
        var messages = results.messages,
            output = "";
        options = options || {};

        /**
         * Capitalize and return given string.
         * @param str {String} to capitalize
         * @return {String} capitalized
         */
        var capitalize = function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        if (messages.length === 0) {
            return options.quiet ? "" : filename + ": Lint Free!";
        }

        CSSLint.Util.forEach(messages, function(message) {
            if (message.rollup) {
                output += filename + ": " + capitalize(message.type) + " - " + message.message + " (" + message.rule.id + ")\n";
            } else {
                output += filename + ": line " + message.line +
                    ", col " + message.col + ", " + capitalize(message.type) + " - " + message.message + " (" + message.rule.id + ")\n";
            }
        });

        return output;
    }
});

CSSLint.addFormatter({
    // format information
    id: "csslint-xml",
    name: "CSSLint XML format",

    /**
     * Return opening root XML tag.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        "use strict";
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><csslint>";
    },

    /**
     * Return closing root XML tag.
     * @return {String} to append after all results
     */
    endFormat: function() {
        "use strict";
        return "</csslint>";
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} relative file path
     * @param options {Object} (UNUSED for now) specifies special handling of output
     * @return {String} output for results
     */
    formatResults: function(results, filename/*, options*/) {
        "use strict";
        var messages = results.messages,
            output = [];

        /**
         * Replace special characters before write to output.
         *
         * Rules:
         *  - single quotes is the escape sequence for double-quotes
         *  - &amp; is the escape sequence for &
         *  - &lt; is the escape sequence for <
         *  - &gt; is the escape sequence for >
         *
         * @param {String} message to escape
         * @return escaped message as {String}
         */
        var escapeSpecialCharacters = function(str) {
            if (!str || str.constructor !== String) {
                return "";
            }
            return str.replace(/"/g, "'").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        if (messages.length > 0) {
            output.push("<file name=\""+filename+"\">");
            CSSLint.Util.forEach(messages, function (message) {
                if (message.rollup) {
                    output.push("<issue severity=\"" + message.type + "\" reason=\"" + escapeSpecialCharacters(message.message) + "\" evidence=\"" + escapeSpecialCharacters(message.evidence) + "\"/>");
                } else {
                    output.push("<issue line=\"" + message.line + "\" char=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                        " reason=\"" + escapeSpecialCharacters(message.message) + "\" evidence=\"" + escapeSpecialCharacters(message.evidence) + "\"/>");
                }
            });
            output.push("</file>");
        }

        return output.join("");
    }
});

/* globals JSON: true */

CSSLint.addFormatter({
    // format information
    id: "json",
    name: "JSON",

    /**
     * Return content to be printed before all file results.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        "use strict";
        this.json = [];
        return "";
    },

    /**
     * Return content to be printed after all file results.
     * @return {String} to append after all results
     */
    endFormat: function() {
        "use strict";
        var ret = "";
        if (this.json.length > 0) {
            if (this.json.length === 1) {
                ret = JSON.stringify(this.json[0]);
            } else {
                ret = JSON.stringify(this.json);
            }
        }
        return ret;
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} relative file path (Unused)
     * @return {String} output for results
     */
    formatResults: function(results, filename, options) {
        "use strict";
        if (results.messages.length > 0 || !options.quiet) {
            this.json.push({
                filename: filename,
                messages: results.messages,
                stats: results.stats
            });
        }
        return "";
    }
});

CSSLint.addFormatter({
    // format information
    id: "junit-xml",
    name: "JUNIT XML format",

    /**
     * Return opening root XML tag.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        "use strict";
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><testsuites>";
    },

    /**
     * Return closing root XML tag.
     * @return {String} to append after all results
     */
    endFormat: function() {
        "use strict";
        return "</testsuites>";
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} relative file path
     * @param options {Object} (UNUSED for now) specifies special handling of output
     * @return {String} output for results
     */
    formatResults: function(results, filename/*, options*/) {
        "use strict";

        var messages = results.messages,
            output = [],
            tests = {
                "error": 0,
                "failure": 0
            };

        /**
         * Generate a source string for a rule.
         * JUNIT source strings usually resemble Java class names e.g
         * net.csslint.SomeRuleName
         * @param {Object} rule
         * @return rule source as {String}
         */
        var generateSource = function(rule) {
            if (!rule || !("name" in rule)) {
                return "";
            }
            return "net.csslint." + rule.name.replace(/\s/g, "");
        };

        /**
         * Replace special characters before write to output.
         *
         * Rules:
         *  - single quotes is the escape sequence for double-quotes
         *  - &lt; is the escape sequence for <
         *  - &gt; is the escape sequence for >
         *
         * @param {String} message to escape
         * @return escaped message as {String}
         */
        var escapeSpecialCharacters = function(str) {

            if (!str || str.constructor !== String) {
                return "";
            }

            return str.replace(/"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        };

        if (messages.length > 0) {

            messages.forEach(function (message) {

                // since junit has no warning class
                // all issues as errors
                var type = message.type === "warning" ? "error" : message.type;

                // ignore rollups for now
                if (!message.rollup) {

                    // build the test case separately, once joined
                    // we'll add it to a custom array filtered by type
                    output.push("<testcase time=\"0\" name=\"" + generateSource(message.rule) + "\">");
                    output.push("<" + type + " message=\"" + escapeSpecialCharacters(message.message) + "\"><![CDATA[" + message.line + ":" + message.col + ":" + escapeSpecialCharacters(message.evidence) + "]]></" + type + ">");
                    output.push("</testcase>");

                    tests[type] += 1;

                }

            });

            output.unshift("<testsuite time=\"0\" tests=\"" + messages.length + "\" skipped=\"0\" errors=\"" + tests.error + "\" failures=\"" + tests.failure + "\" package=\"net.csslint\" name=\"" + filename + "\">");
            output.push("</testsuite>");

        }

        return output.join("");

    }
});

CSSLint.addFormatter({
    // format information
    id: "lint-xml",
    name: "Lint XML format",

    /**
     * Return opening root XML tag.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        "use strict";
        return "<?xml version=\"1.0\" encoding=\"utf-8\"?><lint>";
    },

    /**
     * Return closing root XML tag.
     * @return {String} to append after all results
     */
    endFormat: function() {
        "use strict";
        return "</lint>";
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} relative file path
     * @param options {Object} (UNUSED for now) specifies special handling of output
     * @return {String} output for results
     */
    formatResults: function(results, filename/*, options*/) {
        "use strict";
        var messages = results.messages,
            output = [];

        /**
         * Replace special characters before write to output.
         *
         * Rules:
         *  - single quotes is the escape sequence for double-quotes
         *  - &amp; is the escape sequence for &
         *  - &lt; is the escape sequence for <
         *  - &gt; is the escape sequence for >
         *
         * @param {String} message to escape
         * @return escaped message as {String}
         */
        var escapeSpecialCharacters = function(str) {
            if (!str || str.constructor !== String) {
                return "";
            }
            return str.replace(/"/g, "'").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        };

        if (messages.length > 0) {

            output.push("<file name=\""+filename+"\">");
            CSSLint.Util.forEach(messages, function (message) {
                if (message.rollup) {
                    output.push("<issue severity=\"" + message.type + "\" reason=\"" + escapeSpecialCharacters(message.message) + "\" evidence=\"" + escapeSpecialCharacters(message.evidence) + "\"/>");
                } else {
                    var rule = "";
                    if (message.rule && message.rule.id) {
                        rule = "rule=\"" + escapeSpecialCharacters(message.rule.id) + "\" ";
                    }
                    output.push("<issue " + rule + "line=\"" + message.line + "\" char=\"" + message.col + "\" severity=\"" + message.type + "\"" +
                        " reason=\"" + escapeSpecialCharacters(message.message) + "\" evidence=\"" + escapeSpecialCharacters(message.evidence) + "\"/>");
                }
            });
            output.push("</file>");
        }

        return output.join("");
    }
});

CSSLint.addFormatter({
    // format information
    id: "text",
    name: "Plain Text",

    /**
     * Return content to be printed before all file results.
     * @return {String} to prepend before all results
     */
    startFormat: function() {
        "use strict";
        return "";
    },

    /**
     * Return content to be printed after all file results.
     * @return {String} to append after all results
     */
    endFormat: function() {
        "use strict";
        return "";
    },

    /**
     * Given CSS Lint results for a file, return output for this format.
     * @param results {Object} with error and warning messages
     * @param filename {String} relative file path
     * @param options {Object} (Optional) specifies special handling of output
     * @return {String} output for results
     */
    formatResults: function(results, filename, options) {
        "use strict";
        var messages = results.messages,
            output = "";
        options = options || {};

        if (messages.length === 0) {
            return options.quiet ? "" : "\n\ncsslint: No errors in " + filename + ".";
        }

        output = "\n\ncsslint: There ";
        if (messages.length === 1) {
            output += "is 1 problem";
        } else {
            output += "are " + messages.length + " problems";
        }
        output += " in " + filename + ".";

        var pos = filename.lastIndexOf("/"),
            shortFilename = filename;

        if (pos === -1) {
            pos = filename.lastIndexOf("\\");
        }
        if (pos > -1) {
            shortFilename = filename.substring(pos+1);
        }

        CSSLint.Util.forEach(messages, function (message, i) {
            output = output + "\n\n" + shortFilename;
            if (message.rollup) {
                output += "\n" + (i+1) + ": " + message.type;
                output += "\n" + message.message;
            } else {
                output += "\n" + (i+1) + ": " + message.type + " at line " + message.line + ", col " + message.col;
                output += "\n" + message.message;
                output += "\n" + message.evidence;
            }
        });

        return output;
    }
});

exports.CSSLint = CSSLint;