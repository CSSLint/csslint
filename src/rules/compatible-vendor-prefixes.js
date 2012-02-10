/*
 * Rule: Include all compatible vendor prefixes to reach a wider
 * range of users.
 */
/*global CSSLint*/ 
CSSLint.addRule({

    //rule information
    id: "compatible-vendor-prefixes",
    name: "Require compatible vendor prefixes",
    desc: "Include all compatible vendor prefixes to reach a wider range of users.",
    browsers: "All",

    //initialization
    init: function (parser, reporter) {
        var rule = this,
            compatiblePrefixes,
            properties,
            prop,
            variations,
            prefixed,
            i,
            len,
            arrayPush = Array.prototype.push,
            applyTo = [];

        // See http://peter.sh/experiments/vendor-prefixed-css-property-overview/ for details
        compatiblePrefixes = {
            "animation"                  : "webkit moz ms",
            "animation-delay"            : "webkit moz ms",
            "animation-direction"        : "webkit moz ms",
            "animation-duration"         : "webkit moz ms",
            "animation-fill-mode"        : "webkit moz ms",
            "animation-iteration-count"  : "webkit moz ms",
            "animation-name"             : "webkit moz ms",
            "animation-play-state"       : "webkit moz ms",
            "animation-timing-function"  : "webkit moz ms",
            "appearance"                 : "webkit moz",
            "border-end"                 : "webkit moz",
            "border-end-color"           : "webkit moz",
            "border-end-style"           : "webkit moz",
            "border-end-width"           : "webkit moz",
            "border-image"               : "webkit moz o",
            "border-radius"              : "webkit moz",
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
            "box-sizing"                 : "webkit moz",
            "box-shadow"                 : "webkit moz",
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
            "transform"                  : "webkit moz ms o",
            "transform-origin"           : "webkit moz ms o",
            "transition"                 : "webkit moz o ms",
            "transition-delay"           : "webkit moz o ms",
            "transition-duration"        : "webkit moz o ms",
            "transition-property"        : "webkit moz o ms",
            "transition-timing-function" : "webkit moz o ms",
            "user-modify"                : "webkit moz",
            "user-select"                : "webkit moz ms",
            "word-break"                 : "epub ms",
            "writing-mode"               : "epub ms"
        };


        for (prop in compatiblePrefixes) {
            if (compatiblePrefixes.hasOwnProperty(prop)) {
                variations = [];
                prefixed = compatiblePrefixes[prop].split(' ');
                for (i = 0, len = prefixed.length; i < len; i++) {
                    variations.push('-' + prefixed[i] + '-' + prop);
                }
                compatiblePrefixes[prop] = variations;
                arrayPush.apply(applyTo, variations);
            }
        }
        parser.addListener("startrule", function () {
            properties = [];
        });

        parser.addListener("property", function (event) {
            var name = event.property;
            if (CSSLint.Util.indexOf(applyTo, name.text) > -1) {
                properties.push(name);
            }
        });

        parser.addListener("endrule", function (event) {
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
                                    full : variations.slice(0),
                                    actual : [],
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
                                propertiesSpecified = (actual.length === 1) ? actual[0] : (actual.length == 2) ? actual.join(" and ") : actual.join(", ");
                                reporter.report("The property " + item + " is compatible with " + propertiesSpecified + " and should be included as well.", value.actualNodes[0].line, value.actualNodes[0].col, rule); 
                            }
                        }

                    }
                }
            }
        });
    }
});