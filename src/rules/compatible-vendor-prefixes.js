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

		compatiblePrefixes = {
			"animation"                 : "webkit moz",
			"animation-name"            : "webkit moz",
			"animation-delay"           : "webkit moz",
			"animation-direction"       : "webkit moz",
			"animation-timing-function" : "webkit moz",
			"animation-iteration-count" : "webkit moz",
			"border-image"              : "webkit moz o",
			"border-radius"             : "webkit moz",
			"box-shadow"                : "webkit moz",
			"transition"                : "webkit moz o",
			"transform"                 : "webkit moz ms o",
			"transform-origin"          : "webkit moz ms o"
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