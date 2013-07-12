/*
 * Rule: count all the properties and pair values inside a file and return an object
 *
 * Result :
 * "float": {
 *       "count": 3,
 *       "values": {
 *           "left": {
 *               "count": 1
 *           },
 *
 *           "right": {
 *               "count": 2
 *           }
 *       }
 *   }
 *
 */
/*global CSSLint*/

CSSLint.addRule({

    //rule information
    id: "count-properties",
    name: "Count all the properties and pair values used in a CSS file",
    desc: "This rule count how many time a property is used in a stylesheet, it count also the value pairs in the stylesheet, example : 'float:left 12'",
    browsers: "All",

    //initialization
    init: function (parser, reporter) {
        var rule = this;
        var count = 0;

        var properties = {};


        parser.addListener("property", function (event) {
            // lower case the property and remove vendor prefix
            var propertyText = event.property.text.toLowerCase().replace(/^(mso|prince|-[\w\d]+)-/,'');
            var propertyValue = event.value.text.toLowerCase();
            if (!properties[propertyText]) {
                properties[propertyText] = {
                    count: 0,
                    values: {}
                };
            }
            if (!properties[propertyText].values[propertyValue]) {
                properties[propertyText].values[propertyValue] = {
                    count: 0
                };
            }

            properties[propertyText].count++;
            properties[propertyText].values[propertyValue].count++;
        });

        //report the results
        parser.addListener("endstylesheet", function (event) {
            reporter.stat("count-properties", {
                properties : properties,
                stringResult : JSON.stringify(properties),
                html:rule.propertiesToHTML(properties)
            });
        });
    },

    propertiesToHTML : function(properties) {
        var html = [];
        for (var name in properties) {
            if(properties.hasOwnProperty(name)) {
                var property = properties[name];
                html.push(name+': '+property.count);
                for (var valueName in property.values) {
                    if(property.values.hasOwnProperty(valueName)) {
                        html.push(name+':'+valueName+': '+property.values[valueName].count);
                    }
                }
            }
        }
        return html.join('<br>\n');
    }
});