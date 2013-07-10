/*
 * Rule: You shouldn't use more than 10 floats. If you do, there's probably
 * room for some abstraction.
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "count-properties",
    name: "Count all the properties used in a CSS file",
    desc: "This rule count how many time a property is used",
    browsers: "All",

    //initialization
    init: function (parser, reporter) {
        var rule = this;
        var count = 0;

        var properties = {};


        parser.addListener("property", function (event) {
            var propertyText = event.property.text.toLowerCase();
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
                stringResult : JSON.stringify(properties)
            });

            //reporter.report("Stylesheet count result <br>\n" + rule.propertiesToHTML(properties) + '<br>\n', 0, 0, rule);

        });
    },

    propertiesToHTML : function(properties) {
        var html = [];

        for (var name in properties) {
            if(properties.hasOwnProperty(properties[name])) {
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