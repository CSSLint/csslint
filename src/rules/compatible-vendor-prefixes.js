/*
 * Rule: Include all compatible vendor prefixes to reach a wider
 * range of users.
 */
/*global CSSLint*/ 
CSSLint.addRule({

	//rule information
	id: "compatible-vendor-prefixes",
	name: "Compatible Vendor Prefixes",
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
			"animation"                  : "webkit moz",
			"animation-delay"            : "webkit moz",
			"animation-direction"        : "webkit moz",
			"animation-duration"         : "webkit moz",
			"animation-fill-mode"        : "webkit moz",
			"animation-iteration-count"  : "webkit moz",
			"animation-name"             : "webkit moz",
			"animation-play-state"       : "webkit moz",
			"animation-timing-function"  : "webkit moz",
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
			"column-count"               : "webkit moz",
			"column-gap"                 : "webkit moz",
			"column-rule"                : "webkit moz",
			"column-rule-color"          : "webkit moz",
			"column-rule-style"          : "webkit moz",
			"column-rule-width"          : "webkit moz",
			"column-width"               : "webkit moz",
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
			"transition"                 : "webkit moz o",
			"transition-delay"           : "webkit moz o",
			"transition-duration"        : "webkit moz o",
			"transition-property"        : "webkit moz o",
			"transition-timing-function" : "webkit moz o",
			"user-modify"                : "webkit moz",
			"user-select"                : "webkit moz",
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
			var name = event.property.text;
			if (applyTo.indexOf(name) > -1) {
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
						if (variations.indexOf(name) > -1) {
							if (propertyGroups[prop] === undefined) {
								propertyGroups[prop] = {
									full : variations.slice(0),
									actual : []
								};
							}
							if (propertyGroups[prop].actual.indexOf(name) === -1) {
								propertyGroups[prop].actual.push(name);
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
							if (actual.indexOf(item) === -1) {
								propertiesSpecified = (actual.length === 1) ? actual[0] : (actual.length == 2) ? actual.join(" and ") : actual.join(", ");
								reporter.warn("The property " + item + " is compatible with " + propertiesSpecified + " and should be included as well.", event.selectors[0].line, event.selectors[0].col, rule); 
							}
						}

					}
				}
			}
		});
	}
});